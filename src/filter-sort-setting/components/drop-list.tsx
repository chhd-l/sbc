import { Table, Icon, Switch } from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import React, { Component } from 'react';
import { IList } from 'typings/globalType';

const DragHandle = sortableHandle(() => <Icon type="drag" style={{ fontSize: 20, color: '#e2001a', marginLeft: 20 }} />);
// const data = [
//   {
//     key: '1',
//     attributeName: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//     index: 0
//   },
//   {
//     key: '2',
//     attributeName: 'Jim Green',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//     index: 1
//   },
//   {
//     key: '3',
//     attributeName: 'Joe Black',
//     age: 32,
//     address: 'Sidney No. 1 Lake Park',
//     index: 2
//   }
// ];
const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

export default class SortableTable extends React.Component {
  props: {
    dataSource?: IList;
    type: String;
    switchFunction: Function;
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
    const { dataSource } = this.state;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter((el) => !!el);
      console.log('Sorted items: ', newData);
      this.setState({ dataSource: newData });
    }
  };

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  render() {
    const { dataSource, type } = this.state;
    const columnsFilter = [
      {
        title: 'Filter name',
        dataIndex: 'attributeName',
        className: 'drag-visible'
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        className: 'drag-visible',
        render: () => (
          <div>
            <Switch></Switch>
            <DragHandle />
          </div>
        )
      }
    ];
    const columnsSort = [
      {
        title: 'Sort name',
        dataIndex: 'field',
        className: 'drag-visible'
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        className: 'drag-visible',
        render: () => (
          <div>
            <Switch></Switch>
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
        rowKey="id"
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
