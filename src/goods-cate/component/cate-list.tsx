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
    //拖拽排序
    cateSort: noop
  };

  render() {
    const { dataList } = this.props.relaxProps;
    return (
      <Table
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
      title: <FormattedMessage id="categoryName" />,
      dataIndex: 'cateName',
      key: 'cateName',
      className: 'namerow',
      ellipsis: 'true'
    },
    {
      title: <FormattedMessage id="operation" />,
      key: 'option',
      width: '30%',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    rowInfo.cateImg = rowInfo.cateImg ? JSON.parse(rowInfo.cateImg) : [];
    rowInfo = fromJS(rowInfo);

    let hasAuth = checkAuth('f_goods_cate_1') || checkAuth('f_goods_cate_2');

    return (
      <div>
        {/*默认分类 展示"-" */}
        {rowInfo.get('isDefault') == 1
          ? '-'
          : hasAuth
          ? // 一级分类(非默认分类)可添加子分类
            [
              rowInfo.get('cateGrade') < 2 &&
                rowInfo.get('isDefault') != 1 &&
                checkAuth('f_goods_cate_1') && (
                  <Tooltip placement="top" title="Add subcategory">
                    <a
                      key="item1"
                      style={styles.edit}
                      onClick={this._addChildrenCate.bind(
                        this,
                        rowInfo.get('storeCateId'),
                        rowInfo.get('cateName'),
                        rowInfo.get('goodsCateId')
                      )}
                      className="iconfont iconbtn-addsubvisionsaddcategory"
                    >
                      {/*<FormattedMessage id="addSubcategory" />*/}
                    </a>
                  </Tooltip>
                ),
              // 非默认分类可编辑
              rowInfo.get('isDefault') != 1 && checkAuth('f_goods_cate_1') && (
                <Tooltip placement="top" title="Edit">
                  <a
                    key="item2"
                    style={styles.edit}
                    onClick={this._showEditModal.bind(
                      this,
                      rowInfo.get('storeCateId'),
                      rowInfo.get('cateName'),
                      rowInfo.get('cateParentId'),
                      rowInfo.get('goodsCateId'),
                      rowInfo.get('children'),
                      rowInfo.get('cateDescription'),
                      rowInfo.get('cateImg')
                    )}
                    className="iconfont iconEdit"
                  >
                    {/*<FormattedMessage id="edit" />*/}
                  </a>
                </Tooltip>
              ),
              // 非默认分类可删除
              rowInfo.get('isDefault') != 1 && checkAuth('f_goods_cate_2') && (
                <Tooltip placement="top" title="Delete">
                  <a
                    key="item3"
                    onClick={this._delete.bind(
                      this,
                      rowInfo.get('storeCateId')
                    )}
                    className="iconfont iconDelete"
                  >
                    {/*<FormattedMessage id="delete" />*/}
                  </a>
                </Tooltip>
              )
            ]
          : '-'}
      </div>
    );
  };

  /**
   * 添加子类目
   */
  _addChildrenCate = (
    cateParentId: string,
    cateParentName: string,
    goodsCateId: number
  ) => {
    console.log(goodsCateId, 'goodsCateId');
    const { showEditModal } = this.props.relaxProps;
    showEditModal(Map({ cateParentId, cateParentName, goodsCateId }));
  };

  /**
   * 显示修改弹窗
   */
  _showEditModal = (
    storeCateId: string,
    cateName: string,
    cateParentId: number,
    goodsCateId: number,
    children: IList,
    cateDescription: string,
    cateImg: IList
  ) => {
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
   * 删除
   */
  _delete = async (storeCateId: string) => {
    const { validChild, validGoods } = this.props.relaxProps;

    //先判断有分类下有无商品，后判断有无子分类
    await validGoods(storeCateId);
    await validChild(storeCateId);
    this._confirm(storeCateId);
  };

  _confirm = (storeCateId: string) => {
    const { doDelete, childFlag, goodsFlag } = this.props.relaxProps;

    if (goodsFlag) {
      //该分类下有商品
      confirm({
        title: 'Prompt',
        content:
          'The current classification has been associated with the product, it is recommended to delete it after modification.',
        onOk() {
          if (childFlag) {
            //有子分类
            confirm({
              title: 'Prompt',
              content:
                'Delete the current category, and all categories under the category will also be deleted. Are you sure to delete this category?',
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
      //有子分类
      confirm({
        title: 'Prompt',
        content:
          'Delete the current category, and all categories under the category will also be deleted. Are you sure to delete this category?',
        onOk() {
          doDelete(storeCateId);
        }
      });
    } else {
      //没有子分类
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
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @private
   */
  _moveRow = (catePath, dragIndex, hoverIndex) => {
    const { cateSort } = this.props.relaxProps;
    cateSort(catePath, dragIndex, hoverIndex);
  };
}

let _dragDirection = (
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) => {
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
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { ...restProps.style, cursor: 'move' };
  let className = restProps.className;
  if (isOver && initialClientOffset) {
    const direction = _dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }
  return connectDragSource(
    connectDropTarget(<tr {...restProps} className={className} style={style} />)
  );
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
    //源对象
    const sourceCate = monitor.getItem().cateInfo;
    //目标对象
    const targetCate = props.children[0].props.record;
    //判断两个拖拽目标是不是同一级
    if (sourceCate.cateParentId != targetCate.cateParentId) {
      return;
    }
    //默认分类不能排序
    if (sourceCate.isDefault == 1 || targetCate.isDefault == 1) {
      return;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    //自己不能和自己换位置
    if (dragIndex === hoverIndex) {
      return;
    }
    //拖拽排序方法
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
