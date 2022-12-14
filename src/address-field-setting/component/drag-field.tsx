import React from 'react';
import { DragSource } from 'react-dnd';

const spec = {
  beginDrag(props) {
    return {
      name: props.name
    };
  },
  endDrag(props, monitor) {
    const dropItem = monitor.getDropResult();
    if (dropItem && props.onDragEnd) {
      props.onDragEnd(dropItem.row, dropItem.col, props.name);
    }
  }
};

@DragSource('box', spec, (connect, monitor) => ({ connectDragSource: connect.dragSource(), isDragging: monitor.isDragging() }))
class DragField extends React.Component<any, any> {
  render() {
    const { name, connectDragSource } = this.props;
    return connectDragSource && connectDragSource(<span className="field-item">{name}</span>);
  }
}

export default DragField;
