import * as React from 'react';
import { Relax } from 'plume2';
import { List, Map, fromJS } from 'immutable';
import { Modal, Table, Tooltip } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { noop, checkAuth } from 'qmkit';
import { FormattedMessage } from 'react-intl';

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
    relaxProps?: {
      dataList: IList;
      allDataList: IList;
      doDelete: Function;
      showEditModal: Function;
      childFlag: boolean;
      goodsFlag: boolean;
      validChild: Function;
      validGoods: Function;
      cateSort: Function;
    };
  };

  static relaxProps = {
    dataList: 'dataList',
    allDataList: 'allDataList',
    doDelete: noop,
    showEditModal: noop,
    childFlag: 'childFlag',
    goodsFlag: 'goodsFlag',
    validChild: noop,
    validGoods: noop,
    //ζζ½ζεΊ
    cateSort: noop
  };

  render() {
    const { dataList } = this.props.relaxProps;
    return (
      <Table
        id="related"
        rowKey="storeCateId"
        columns={this._columns}
        dataSource={dataList.toJS()}
        components={this.components}
        pagination={false}
        onRow={(_record, index) => ({
          index,
          moveRow: this._moveRow
        })}
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
      title: 'Image',
      dataIndex: 'cateName',
      key: 'cateName',
      className: 'namerow',
      ellipsis: 'true'
    },
    {
      title: 'SKU',
      dataIndex: 'cateName',
      key: 'cateName',
      className: 'namerow',
      ellipsis: 'true'
    },
    {
      title: 'Product name',
      dataIndex: 'cateName',
      key: 'cateName',
      className: 'namerow',
      ellipsis: 'true'
    },
    {
      title: 'Specification',
      dataIndex: 'cateName',
      key: 'cateName',
      className: 'namerow',
      ellipsis: 'true'
    },
    {
      title: 'Product category',
      dataIndex: 'cateName',
      key: 'cateName',
      className: 'namerow',
      ellipsis: 'true'
    },
    {
      title: 'Price',
      dataIndex: 'cateName',
      key: 'cateName',
      className: 'namerow',
      ellipsis: 'true'
    },
    {
      title: <FormattedMessage id="operation" />,
      key: 'option',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * θ·εζδ½ι‘Ή
   */
  _getOption = (rowInfo) => {
    rowInfo.cateImg = rowInfo.cateImg ? JSON.parse(rowInfo.cateImg) : [];
    rowInfo = fromJS(rowInfo);

    let hasAuth = checkAuth('f_goods_cate_1') || checkAuth('f_goods_cate_2');

    return (
      <div>
        <Tooltip placement="top" title="Delete">
          <a key="item3" onClick={this._delete.bind(this, rowInfo.get('storeCateId'))} style={{ paddingRight: 7 }} className="iconfont iconDelete">
            {/*<FormattedMessage id="delete" />*/}
          </a>
        </Tooltip>
        <Tooltip placement="top" title="Delete">
          <span key="item3" className="iconfont iconbtn-move" style={{ color: '#e2001a', cursor: 'move' }}></span>
        </Tooltip>
      </div>
    );
  };

  /**
   * ζ·»ε ε­η±»η?
   */
  _addChildrenCate = (cateParentId: string, cateParentName: string, goodsCateId: number) => {
    const { showEditModal } = this.props.relaxProps;
    showEditModal(Map({ cateParentId, cateParentName, goodsCateId }));
  };

  /**
   * ζΎη€ΊδΏ?ζΉεΌΉηͺ
   */
  _showEditModal = (storeCateId: string, cateName: string, cateParentId: number, goodsCateId: number, children: IList, cateDescription: string, cateImg: IList) => {
    const { showEditModal, allDataList } = this.props.relaxProps;
    let cateParentName = '';
    if (cateParentId > 0) {
      cateParentName = allDataList
        .filter((item) => item.get('storeCateId') === cateParentId)
        .get(0)
        .get('cateName');
    }
    let cateInfo = Map({
      storeCateId,
      cateName,
      cateParentName,
      cateParentId,
      goodsCateId,
      children,
      cateDescription
    });
    // let images = Map(cateImg)
    showEditModal(cateInfo, cateImg);
  };

  /**
   * ε ι€
   */
  _delete = async (storeCateId: string) => {
    const { validChild, validGoods } = this.props.relaxProps;

    //εε€ζ­ζεη±»δΈζζ εεοΌεε€ζ­ζζ ε­εη±»
    await validGoods(storeCateId);
    await validChild(storeCateId);
    this._confirm(storeCateId);
  };

  _confirm = (storeCateId: string) => {
    const { doDelete, childFlag, goodsFlag } = this.props.relaxProps;

    if (goodsFlag) {
      //θ―₯εη±»δΈζεε
      confirm({
        title: 'Prompt',
        content: 'The current classification has been associated with the product, it is recommended to delete it after modification.',
        onOk() {
          if (childFlag) {
            //ζε­εη±»
            confirm({
              title: 'Prompt',
              content: 'Delete the current category, and all categories under the category will also be deleted. Are you sure to delete this category?',
              onOk() {
                doDelete(storeCateId);
              }
            });
          } else {
            doDelete(storeCateId);
          }
        },
        okText: 'Continue to delete',
        cancelText: 'Cancel'
      });
    } else if (childFlag) {
      //ζε­εη±»
      confirm({
        title: 'Prompt',
        content: 'Delete the current category, and all categories under the category will also be deleted. Are you sure to delete this category?',
        onOk() {
          doDelete(storeCateId);
        }
      });
    } else {
      //ζ²‘ζε­εη±»
      confirm({
        title: 'Prompt',
        content: 'Are you sure you want to delete this category?',
        onOk() {
          doDelete(storeCateId);
        }
      });
    }
  };

  /**
   * ζζ½ζεΊ
   * @param dragIndex  ζζ½ζεΊζΊ
   * @param hoverIndex ζζ½ζεΊη?ζ δ½η½?
   * @private
   */
  _moveRow = (catePath, dragIndex, hoverIndex) => {
    const { cateSort } = this.props.relaxProps;
    cateSort(catePath, dragIndex, hoverIndex);
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
      index: props.index,
      cateInfo: props.children[0].props.record
    };
  }
};

const _rowTarget = {
  drop(props, monitor) {
    //ζΊε―Ήθ±‘
    const sourceCate = monitor.getItem().cateInfo;
    //η?ζ ε―Ήθ±‘
    const targetCate = props.children[0].props.record;
    //ε€ζ­δΈ€δΈͺζζ½η?ζ ζ―δΈζ―εδΈηΊ§
    if (sourceCate.cateParentId != targetCate.cateParentId) {
      return;
    }
    //ι»θ?€εη±»δΈθ½ζεΊ
    if (sourceCate.isDefault == 1 || targetCate.isDefault == 1) {
      return;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    //θͺε·±δΈθ½εθͺε·±ζ’δ½η½?
    if (dragIndex === hoverIndex) {
      return;
    }
    //ζζ½ζεΊζΉζ³
    props.moveRow(sourceCate.catePath, dragIndex, hoverIndex);
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

export default DragDropContext(HTML5Backend)(CateList);
