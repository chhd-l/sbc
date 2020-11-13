import React, { Component } from 'react';
import { Table } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import { util }  from 'qmkit'

let dragingIndex = -1;

// Must have id, parentId and sort in object
class BodyRow extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, dragRow, clientOffset, sourceClientOffset, initialClientOffset, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />));
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
      record: props.children[0].props.record
    };
  }
};

const rowTarget = {
  drop(props, monitor) {
    const sourceRow = monitor.getItem().record;
    const targetRow = props.children[0].props.record;

    // check same level
    if (sourceRow.parentId != targetRow.parentId) {
      return;
    }

    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(sourceRow, dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }))(BodyRow)
);

class DragTable extends React.Component<any, any> {
  static propTypes = {
    columns: PropTypes.array,
    source: PropTypes.array
  };
  static defaultProps = {
    columns: {},
    source: []
  };

  constructor(props) {
    super(props);
    this.state = {
      source: [],
      loading: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { loading, dataSource } = nextProps;

    if (dataSource !== prevState.dataSource) {
      return {
        source: dataSource,
        loading: loading
      };
    }

    return null;
  }

  components = {
    body: {
      row: DragableBodyRow
    }
  };

  moveRow = (sourceRow, dragIndex, hoverIndex) => {
    var parentRows = this.state.source.filter((x) => (sourceRow.parentId ? x.parentId === sourceRow.parentId : !x.parentId))
    .sort((x1, x2) => x1.sort - x2.sort);
    const dragRow = parentRows[dragIndex];

    var sortList = update(parentRows, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow]
      ]
    });
    var newDatasource = this.state.source.map((item, index) => {
      if (item.parentId === sourceRow.parentId ? item.parentId === sourceRow.parentId : !item.parentId) {
        sortList.map((sItem, sIndex) => {
          if (item.id === sItem.id) {
            item.sort = sIndex;
            return;
          }
        });
      }
      return item;
    });
    this.setState({
      source: newDatasource
    });
    var sortListToUpdate = sortList.map(x=>({id:x.id, sort: x.sort}))
    this.props.sort(sortListToUpdate)
  };

  render() {
    const {source}= this.state
    var data = util.setChildrenData(source)
    return (
      <Table
        columns={this.props.columns}
        dataSource={data}
        components={this.components}
        loading={this.state.loading}
        onRow={(record, index) => ({
          index,
          moveRow: this.moveRow
        })}
      />
    );
  }
}
export default DragDropContext(HTML5Backend)(DragTable);
