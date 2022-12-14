import * as React from 'react';
import { Relax } from 'plume2';
import { noop, checkAuth, RCi18n } from 'qmkit';
import { List, Map, fromJS } from 'immutable';
import { Table, Popconfirm, Switch, message, Tooltip } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { FormattedMessage, injectIntl } from 'react-intl';

declare type IList = List<any>;

const styles = {
  edit: {
    paddingRight: 10
  }
};

@Relax
class TabList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      consentList: IList;
      getConsentDelete: Function;
      propSort: Function;
      showEditModal: Function;
      onSwitch: Function;
      pageChange: Function;
      linkStatus: any;
    };
    intl: any;
  };

  static relaxProps = {
    consentList: 'consentList',
    getConsentDelete: noop,
    showEditModal: noop,
    propSort: noop,
    onSwitch: noop,
    pageChange: noop,
    linkStatus: 'linkStatus'
  };

  componentDidMount() {}

  render() {
    const { consentList } = this.props.relaxProps;
    return (
      <Table
        id="consent"
        rowKey="tabId"
        columns={this._columns}
        dataSource={consentList.toJS()}
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
  _columns = [
    {
      title: <FormattedMessage id="Setting.No" />,
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => `${index + 1}`
    },
    {
      title: <FormattedMessage id="Setting.Consenttitle" />,
      dataIndex: 'consentTitle',
      key: 'consentTitle',
      render: (text) => {
        let html = { __html: text };
        return <div dangerouslySetInnerHTML={html}></div>;
      }
    },
    {
      title: <FormattedMessage id="Setting.ConsentId" />,
      dataIndex: 'consentId',
      key: 'consentId'
    },
    {
      title: <FormattedMessage id="Setting.Consentcode" />,
      dataIndex: 'consentCode',
      key: 'consentCode'
    },
    {
      title: <FormattedMessage id="Setting.Consenttype" />,
      dataIndex: 'consentType',
      key: 'consentType'
    },
    {
      title: <FormattedMessage id="Setting.Category" />,
      dataIndex: 'consentCategory',
      key: 'consentCategory'
    },
    {
      title: <FormattedMessage id="Setting.Fieldtype" />,
      dataIndex: 'filedType',
      key: 'filedType'
    },
    ,
    {
      title: <FormattedMessage id="Setting.Operation" />,
      dataIndex: 'operation',
      key: 'operation',
      render: (_text, _record) => this._getOption(_record)
    }
  ];
  onChange = (checked, id) => {
    const { onSwitch } = this.props.relaxProps;
    //let linkStatus = checked === true ? 0 : 1;

    onSwitch({ id, openFlag: checked == true ? 1 : 0 });
  };
  confirm = (check, id) => {
    this.onChange(!check, id);
    // this.setState({ showSwich: true });
    // console.log(check);
    // message.success('Click on Yes');
  };
  cancel = () => {
    message.info((window as any).RCi18n({ id: 'Setting.canceled' }));
  };
  /**
   * ???????????????
   */
  _getOption = (rowInfo) => {
    const { onSwitch, pageChange, linkStatus } = this.props.relaxProps;
    rowInfo = fromJS(rowInfo);
    const check = +rowInfo.get('openFlag') === 0 ? false : true;
    // const check = +linkStatus === 0 ? true : false;

    return (
      <div className="operation flex-end">
        <Tooltip placement="top" title="Edit">
          <a href="javascript:void(0)" onClick={() => pageChange('Detail', rowInfo.get('id'))} className="iconfont iconEdit"></a>
        </Tooltip>
        <Popconfirm
          className="deleted"
          title={(window as any).RCi18n({ id: 'Setting.Confirmdeletion?' })}
          onConfirm={() => {
            const { getConsentDelete } = this.props.relaxProps;
            getConsentDelete(rowInfo.get('id'));
          }}
        >
          <Tooltip placement="top" title={(window as any).RCi18n({ id: 'Setting.Delete?' })}>
            <a href="javascript:void(0)" className="iconfont iconDelete"></a>
          </Tooltip>
        </Popconfirm>
        <div className="switch">
          <Popconfirm title={check ? (window as any).RCi18n({ id: 'Setting.Areyousuredisable' }) : (window as any).RCi18n({ id: 'Setting.Areyousureable' })} onConfirm={() => this.confirm(check, rowInfo.get('id'))} onCancel={this.cancel} okText="Yes" cancelText="No">
            <Switch
              //loading={loading}
              checked={check}
              // onChange={this.onValid}
            />
          </Popconfirm>
          {/*<Switch
            checked={rowInfo.get('openFlag') == 0}
            onChange={(e) => onSwitch({id:rowInfo.get('id'), openFlag:e.valueOf()})}
          />*/}
          {/*<Switch checked={
            rowInfo.get('openFlag') == '1' ? false : true
          } onChange={(e) => this.onChange(e, rowInfo.get('id'))} />*/}
        </div>
      </div>
    );
  };

  /**
   * ??????????????????
   */
  _showEditModal = (tabId: string, tabName: string) => {
    const { showEditModal } = this.props.relaxProps;
    let tabInfo = Map({
      tabId,
      tabName
    });
    showEditModal(tabInfo);
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
export default DragDropContext(HTML5Backend)(injectIntl(TabList));
