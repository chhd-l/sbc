import React from 'react';
import { DropTarget } from 'react-dnd';

const spec = {
  drop: (props) => ({ row: props.row, col: props.col, field: props.field }),
  canDrop: (props) => {
    let rvt = true;
    const dropItemInResult = props.result.find((o) => o.row === props.row && o.col === props.col);
    if (props.field || (dropItemInResult && dropItemInResult.field)) {
      rvt = false;
    }
    return rvt;
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
