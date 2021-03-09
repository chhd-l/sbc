import React from 'react';
import { DropTarget } from 'react-dnd';

const spec = {
  drop: (props) => ({ row: props.row, col: props.col, field: props.field }),
  canDrop: (props) => {
    if (props.field) {
      return false;
    }
    return true;
  }
};

@DropTarget('box', spec, (connect, monitor) => ({ connectDropTarget: connect.dropTarget(), isOver: monitor.isOver(), canDrop: monitor.canDrop() }))
class DropField extends React.Component<any, any> {
  render() {
    const { connectDropTarget } = this.props;
    return connectDropTarget && connectDropTarget(<div className="display-field-item">{this.props.children}</div>);
  }
}

export default DropField;
