import React, { Component } from 'react';
import { Table, Popconfirm, Switch, message, Tooltip } from 'antd';
import * as PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import update from 'immutability-helper';


class DragTable extends React.Component<any, any> {
  static propTypes = {
    columns: PropTypes.object,
    dataSource: PropTypes.array
  };
  static defaultProps = {
     columns: {},
     dataSource : []
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Table
        id="consent"
        rowKey="tabId"
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        onRow={(_record, index) => ({
          index,
          moveRow: this.moveRow
        })}
        components={this.components}
        pagination={false}
        size="middle"
      />
    );
  }

  components = {
    body: {
      row: _BodyRow
    }
  };
  moveRow = (dragIndex, hoverIndex) => {
    /*if (hoverIndex == 0 || dragIndex == 0) {
      return;
    }*/
    const { consentList, propSort } = this.props.relaxProps;
    const dragRow = consentList.toJS()[dragIndex];

    let sortList = update(consentList.toJS(), {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow]
      ]
    });
    let sort = [];
    let obj = { exchangeSortList: [] };
    sortList.map((item, index) => {
      sort.push({
        id: item.id,
        sort: index
      });
    });
    obj.exchangeSortList = sort;

    propSort(obj);
  };
}
const _rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    if (dragIndex === hoverIndex) {
      return;
    }
    props.moveRow(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  }
};
let _BodyRow = (props) => {
  const { isOver, connectDragSource, connectDropTarget, moveRow, dragRow, clientOffset, sourceClientOffset, initialClientOffset, ...restProps } = props;
  const style = { ...restProps.style, cursor: 'move' };
  let className = restProps.className;
  if (isOver && initialClientOffset) {
    const direction = _dragDirection(dragRow.index, restProps.index, initialClientOffset, clientOffset, sourceClientOffset);
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }
  return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />));
};

const _rowSource = {
  beginDrag(props) {
    return {
      index: props.index
    };
  }
};
_BodyRow = DropTarget('row', _rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}))(
  DragSource('row', _rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }))(_BodyRow)
);
let _dragDirection = (dragIndex, hoverIndex, initialClientOffset, clientOffset, sourceClientOffset) => {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
};

export default DragDropContext(HTML5Backend)(DragTable);
