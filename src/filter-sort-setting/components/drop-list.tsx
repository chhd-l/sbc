import { Table, Icon, Switch, Popconfirm, Tooltip } from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import React, { Component } from 'react';
import { IList } from 'typings/globalType';
import AddCustomizedFilter from './add-customized-filter';
import RelevancyProduct from './relevancy-product';
import { FormattedMessage } from 'react-intl';

const DragHandle = sortableHandle(() => <Icon type="drag" style={{ fontSize: 20, color: 'var(--primary-color)', marginLeft: 20 }} />);

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

export default class SortableTable extends React.Component {
  props: {
    dataSource?: IList;
    type: String;
    switchFunction: Function;
    deleteFunction?: Function;
    sortFunction: Function;
    refreshListFunction?: Function;
  };
  state = {
    dataSource: [],
    type: '',
    prevPropType: ''
  };

  static getDerivedStateFromProps(props, state) {
    // 当传入的值发生变化的时候，更新state
    if (props.type !== state.prevPropType) {
      return {
        type: props.type,
        prevPropType: props.type,
        dataSource: props.dataSource
      };
    }
    return {
      dataSource: props.dataSource
    };
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource, type } = this.state;

    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter((el) => !!el);
      let newSortList = [];
      for (let i = 0; i < newData.length; i++) {
        //newData[i].sort = i + 1;
        newSortList.push({
          id: newData[i].id,
          sort: i + 1,
        });
      }
      // if (oldIndex > newIndex) {
      //   let tempIndex = oldIndex;
      //   oldIndex = newIndex;
      //   newIndex = tempIndex;
      // }
      
      // for (let index = oldIndex; index <= newIndex; index++) {
      //   let param = {
      //     id: newData[index].id,
      //     sort: newData[index].sort
      //   };
      //   newSortList.push(param);
      // }
      if (type === 'sort') {
        let params = {
          storeGoodsSortList: newSortList
        };
        this.props.sortFunction(params);
      } else {
        let params = {
          storeGoodsFilterList: newSortList
        };
        this.props.sortFunction(params, newData[0].filterType);
      }
    }
  };

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };
  updateFilterStatus = (checked, row) => {
    let params = {
      attributeId: row.attributeId,
      attributeName: row.attributeName,
      filterStatus: checked ? '1' : '0',
      filterType: row.filterType,
      id: row.id,
      sort: row.sort
    };
    this.props.switchFunction(params);
  };

  deleteFilter = (id, filterType) => {
    this.props.deleteFunction(id, filterType);
  };

  refreshList = () => {
    this.props.refreshListFunction();
  };
  updateSortStatus = (checked, row) => {
    let params = {
      field: row.field,
      id: row.id,
      sortStatus: checked ? '1' : '0',
      sortName: row.sortName,
      sortType: row.sortType,
      sort: row.sort
    };
    this.props.switchFunction(params);
  };
  getAttributeValue = (attributeValueList) => {
    let attributeValue = [];
    if (attributeValueList && attributeValueList.length > 0) {
      for (let i = 0; i < attributeValueList.length; i++) {
        attributeValue.push(attributeValueList[i].attributeDetailName);
      }
    }
    return attributeValue.join(';');
  };

  render() {
    const { dataSource, type } = this.state;
    const columnsFilter = [
      {
        title: <FormattedMessage id="Product.FilterName" />,
        dataIndex: 'attributeName',
        className: 'drag-visible'
      },
      {
        title: <FormattedMessage id="Product.DisplayName" />,
        dataIndex: 'attributeNameEn',
        key: 'attributeNameEn'
      },
      {
        title: <FormattedMessage id="Product.AttributeValue" />,
        dataIndex: 'attributeValue',
        key: 'attributeValue',
        width: '30%',
        render: (text, record) => <p>{record.filterType === '1' ? this.getAttributeValue(record.storeGoodsFilterValueVOList) : this.getAttributeValue(record.attributesValueList)}</p>
      },
      {
        title: <FormattedMessage id="Product.FilterStatus" />,
        dataIndex: 'filterStatus',
        className: 'drag-visible',
        render: (text, record) => (
          <Popconfirm placement="topLeft" title={'Are you sure to ' + (+text ? ' disable' : 'enable') + ' this?'} onConfirm={() => this.updateFilterStatus(!+text, record)} okText={<FormattedMessage id="Product.Confirm" />} cancelText={<FormattedMessage id="Product.Cancel" />}>
            <Switch checked={+text ? true : false}></Switch>
          </Popconfirm>
          // <div>
          //   <Switch checked={+text ? true : false} onClick={(checked) => this.updateFilterStatus(checked, record)}></Switch>
          // </div>
        )
      },
      {
        title: <FormattedMessage id="Product.Operation" />,
        dataIndex: 'operation',
        className: 'drag-visible',
        render: (text, record) => (
          <div>
            {/* {record.filterType === '1' && record.canDelFlag ? <AddCustomizedFilter currentSelected={record} type="edit" refreshList={this.refreshList} /> : null} */}

            {record.filterType !== '1' ? (
              <Popconfirm placement="topLeft" title={<FormattedMessage id="Product.deleteThisItem" />} onConfirm={() => this.deleteFilter(record.id, record.filterType)} okText={<FormattedMessage id="Product.Confirm" />} cancelText={<FormattedMessage id="Product.Cancel" />}>
                <Tooltip placement="top" title={<FormattedMessage id="Product.Delete" />}>
                  <a className="iconfont iconDelete"></a>
                </Tooltip>
              </Popconfirm>
            ) : null}
            <DragHandle />
          </div>
        )
      }
    ];
    const columnsSort = [
      {
        title: <FormattedMessage id="Product.SortFieldName" />,
        dataIndex: 'sortName',
        className: 'drag-visible'
      },
      {
        title: <FormattedMessage id="Product.SortFieldStatus" />,
        dataIndex: 'sortStatus',
        className: 'drag-visible',
        render: (text, record) => (
          <div>
            <Popconfirm placement="topLeft" title={'Are you sure to ' + (+text ? ' disable' : 'enable') + ' this?'} onConfirm={() => this.updateSortStatus(!+text, record)} okText={<FormattedMessage id="Product.Confirm" />} cancelText={<FormattedMessage id="Product.Cancel" />}>
              <Switch checked={+text ? true : false}></Switch>
            </Popconfirm>
            {/* <Switch checked={+text ? true : false} onClick={(checked) => this.updateSortStatus(checked, record)}></Switch> */}
          </div>
        )
      },
      // {
      //   title: <FormattedMessage id="Product.Operation" />,
      //   dataIndex: 'operation',
      //   className: 'drag-visible',
      //   render: (text, record) => (
      //     <div>
      //       <RelevancyProduct sortId={record.id} />
      //       <DragHandle />
      //     </div>
      //   )
      // }
    ];

    const DraggableContainer = (props) => <SortableContainer useDragHandle helperClass="row-dragging" onSortEnd={this.onSortEnd} {...props} />;
    return (
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={type === 'sort' ? columnsSort : columnsFilter}
        rowKey="index"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: this.DraggableBodyRow
          }
        }}
      />
    );
  }
}
