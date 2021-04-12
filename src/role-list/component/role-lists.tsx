import * as React from 'react';
import { Relax } from 'plume2';
import { fromJS, List } from 'immutable';
import { Icon, Modal, Table, Tooltip } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import { Link } from 'react-router-dom';
import HTML5Backend from 'react-dnd-html5-backend';
import { AuthWrapper, noop } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';

declare type IList = List<any>;
const confirm = Modal.confirm;

const styles = {
  edit: {
    paddingRight: 10
  }
};

@Relax
class CateList extends React.Component<any, any> {
  props: {
    intl?:any;
    relaxProps?: {
      equitiesList: IList;
      cateSort: Function;
      showEditModal: Function;
      deleteEquities: Function;
      editFlag: Function;
    };
  };

  static relaxProps = {
    // 优惠券分类
    equitiesList: 'equitiesList',
    //拖拽排序
    cateSort: noop,
    // 展示修改框
    showEditModal: noop,
    // 删除
    deleteEquities: noop,
    //更改是否平台可用
    editFlag: noop
  };

  render() {
    const { equitiesList } = this.props.relaxProps;
    return (
      <Table
        rowKey="roleInfoId"
        columns={this._columns}
        dataSource={equitiesList.toJS()}
        //  components={this.components}
        pagination={false}
        // onRow={(_record, index) => ({
        //   index,
        //   moveRow: this._moveRow
        // })}
      />
    );
  }

  components = {
    body: {
      row: _BodyRow
    }
  };

  _columns = [
    {
      title: <FormattedMessage id="Setting.roleName" />,
      dataIndex: 'roleName',
      key: 'roleName'
    },

    {
      title: <FormattedMessage id="Setting.permission" />,
      dataIndex: 'menuNames',
      key: 'menuNames',
      render: (menuNames) => {
        return <p>{menuNames ? menuNames : '-'}</p>;
      }
    },
    {
      title: <FormattedMessage id="Setting.operation" />,
      key: 'option',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <div>
        <AuthWrapper functionName={'f_role_modify_authority'}>
          <Tooltip placement="top" title={<FormattedMessage id="Setting.setPermission" />}>
            <Link style={{ marginLeft: 20, marginRight: 20 }} to={`/authority-allocating/${rowInfo.roleInfoId}/${rowInfo.roleName}`} className="iconfont iconbtn-setpermission">
              {/*<FormattedMessage id="setPermission" />*/}
            </Link>
          </Tooltip>
        </AuthWrapper>
        <AuthWrapper functionName={'f_role_edit'}>
          <Tooltip placement="top" title={<FormattedMessage id="Setting.Edit" />}>
            <a style={styles.edit} onClick={this._showEditModal.bind(this, rowInfo)} className="iconfont iconEdit">
              {/*<FormattedMessage id="edit" />*/}
            </a>
          </Tooltip>
        </AuthWrapper>

        <AuthWrapper functionName={'f_role_delete'}>
          <Tooltip placement="top" title={<FormattedMessage id="Setting.Delete" />}>
            <a onClick={this._delete.bind(this, rowInfo.roleInfoId)} className="iconfont iconDelete">
              {/*<FormattedMessage id="delete" />*/}
            </a>
          </Tooltip>
        </AuthWrapper>
      </div>
    );
  };

  /**
   * 显示修改弹窗
   */
  _showEditModal = (rowInfo: object) => {
    const { showEditModal } = this.props.relaxProps;
    showEditModal(fromJS(rowInfo), false);
  };

  /**
   * 删除
   */
  _delete = async (roleInfoId) => {
    const { deleteEquities } = this.props.relaxProps;
    const title = this.props.intl.formatMessage({id:'Setting.Prompt'});
    const content = this.props.intl.formatMessage({id:'Setting.deleteThisRole'});
    const oktext = this.props.intl.formatMessage({id:'Setting.OK'});
    const canceltext = this.props.intl.formatMessage({id:'Setting.Cancel'});
    confirm({
      title: title,
      content: content,
      okText: oktext,
      cancelText: canceltext,
      iconType: 'exclamation-circle',
      onOk() {
        deleteEquities(roleInfoId);
      }
    });
  };

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @private
   */
  _moveRow = (dragIndex, hoverIndex) => {
    const { cateSort } = this.props.relaxProps;
    cateSort(dragIndex, hoverIndex);
  };
}

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

const _rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    //自己不能和自己换位置
    if (dragIndex === hoverIndex) {
      return;
    }
    //拖拽排序方法
    props.moveRow(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
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

export default DragDropContext(HTML5Backend)(injectIntl(CateList));
