import { Table, Icon, Switch, Popconfirm, Tooltip } from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import React, { Component } from 'react';
import { IList } from 'typings/globalType';
import AddCustomizedFilter from './add-customized-filter';
import RelevancyProduct from './relevancy-product';

const DragHandle = sortableHandle(() => <Icon type="drag" style={{ fontSize: 20, color: '#e2001a', marginLeft: 20 }} />);

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
      for (let i = 0; i < newData.length; i++) {
        newData[i].sort = i + 1;
      }
      if (oldIndex > newIndex) {
        let tempIndex = oldIndex;
        oldIndex = newIndex;
        newIndex = tempIndex;
      }
      let newSortList = [];
      for (let index = oldIndex; index <= newIndex; index++) {
        let param = {
          id: newData[index].id,
          sort: newData[index].sort
        };
        newSortList.push(param);
      }
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
  // getAttributeValue = (attributeValueList) => {
  //   let attributeValue = [];
  //   for (let i = 0; i < attributeValueList.length; i++) {
  //     attributeValue.push(attributeValueList[i].attributeDetailName);
  //   }
  //   return attributeValue.join(';');
  // };

  render() {
    const { dataSource, type } = this.state;
    const columnsFilter = [
      {
        title: 'Filter name',
        dataIndex: 'attributeName',
        className: 'drag-visible'
      },
      // {
      //   title: 'Attribute value',
      //   dataIndex: 'attributeValue',
      //   key: 'attributeValue',
      //   width: '30%',
      //   render: (text, record) => <p>{record.storeGoodsFilterValueVOList ? this.getAttributeValue(record.storeGoodsFilterValueVOList) : ''}</p>
      // },
      {
        title: 'Filter status',
        dataIndex: 'filterStatus',
        className: 'drag-visible',
        render: (text, record) => (
          <div>
            <Switch checked={+text ? true : false} onClick={(checked) => this.updateFilterStatus(checked, record)}></Switch>
          </div>
        )
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        className: 'drag-visible',
        render: (text, record) => (
          <div>
            {record.filterType === '1' ? <AddCustomizedFilter currentSelected={record} type="edit" refreshList={this.refreshList} /> : null}
            <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteFilter(record.id, record.filterType)} okText="Confirm" cancelText="Cancel">
              <Tooltip placement="top" title="Delete">
                <a className="iconfont iconDelete"></a>
              </Tooltip>
            </Popconfirm>
            <DragHandle />
          </div>
        )
      }
    ];
    const columnsSort = [
      {
        title: 'Sort field name',
        dataIndex: 'field',
        className: 'drag-visible'
      },
      {
        title: 'Sort field status',
        dataIndex: 'sortStatus',
        className: 'drag-visible',
        render: (text, record) => (
          <div>
            <Switch checked={+text ? true : false} onClick={(checked) => this.updateSortStatus(checked, record)}></Switch>
          </div>
        )
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        className: 'drag-visible',
        render: (text, record) => (
          <div>
            <RelevancyProduct sortId={record.id} />
            <DragHandle />
          </div>
        )
      }
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
