import * as React from 'react';
import { Relax } from 'plume2';
import { List, Map, fromJS } from 'immutable';
import { Form, Modal, Popconfirm, Switch, Table, Tooltip } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { noop, checkAuth } from 'qmkit';
import { FormattedMessage,injectIntl } from 'react-intl';

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
      images: IList;
      doDelete: Function;
      showEditModal: Function;
      childFlag: boolean;
      goodsFlag: boolean;
      validChild: Function;
      validGoods: Function;
      cateSort: Function;
      setSeoModalVisible: Function;
      getSeo: Function;
      setCurrentStoreCateId: Function;
      clear: Function;
      updateDisplayStatus: Function;
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
    cateSort: noop,
    setSeoModalVisible: noop,
    images: 'images',
    getSeo: noop,
    setCurrentStoreCateId: noop,
    clear: noop,
    updateDisplayStatus: noop
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
      title: <FormattedMessage id="Product.CategoryName" />,
      dataIndex: 'cateName',
      key: 'cateName'
    },
    {
      title: <FormattedMessage id="Product.NumberOfProduct" />,
      dataIndex: 'productNum',
      key: 'productNum'
    },
    {
      title: <FormattedMessage id="Product.DisplayInShop" />,
      dataIndex: 'displayStatus',
      key: 'displayStatus',

      render: (text, record) => (
        <div>
          {text ? 'Yes' : 'No'}
          {/* {record.isDefault !== 1 && record.cateGrade === 1 ? (
            <Popconfirm placement="topLeft" title={+text ? 'Are you sure this item is not displayed in the shop?' : 'Are you sure to display this item in the shop?'} onConfirm={() => this._updateDisplayStatus(!+text, record)} okText="Confirm" cancelText="Cancel">
              <Switch checked={+text ? true : false}></Switch>
            </Popconfirm>
          ) : null} */}
        </div>
      )
    },
    {
      title: <FormattedMessage id="Product.operation" />,
      key: 'option',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * θ·εζδ½ι‘Ή
   */
  _getOption = (rowInfo) => {
    if (rowInfo.cateImg) {
      if (typeof rowInfo.cateImg == 'string') {
        rowInfo.cateImg = JSON.parse(rowInfo.cateImg);
      }
    } else {
      rowInfo.cateImg = [];
    }

    rowInfo = fromJS(rowInfo);

    let hasAuth = true;

    return (
      <div>
        {/*ι»θ?€εη±» ε±η€Ί"-" */}
        {rowInfo.get('isDefault') == 1
          ? '-'
          : hasAuth
          ? // δΈηΊ§εη±»(ιι»θ?€εη±»)ε―ζ·»ε ε­εη±»
            [
              rowInfo.get('isDefault') != 1 && checkAuth('Edit SEO setting') && (
                <Tooltip placement="top" title={<FormattedMessage id="Product.EditSEOSetting" />} key="item1">
                  <a style={styles.edit} onClick={this._editSEOSetting.bind(this, rowInfo.get('storeCateId'), rowInfo.get('cateName'), rowInfo.get('goodsCateId'))} className="iconfont iconicon">
                    {/*<FormattedMessage id="addSubcategory" />*/}
                  </a>
                </Tooltip>
              ),
              rowInfo.get('cateGrade') < 3 && rowInfo.get('isDefault') != 1 && checkAuth('Add sales category') && (
                <Tooltip placement="top" title={<FormattedMessage id="Product.AddSubcategory" />} key="item2">
                  <a style={styles.edit} onClick={this._addChildrenCate.bind(this, rowInfo.get('storeCateId'), rowInfo.get('cateName'), rowInfo.get('goodsCateId'))} className="iconfont iconbtn-addsubvisionsaddcategory">
                    {/*<FormattedMessage id="addSubcategory" />*/}
                  </a>
                </Tooltip>
              ),
              // ιι»θ?€εη±»ε―ηΌθΎ
              rowInfo.get('isDefault') != 1 && checkAuth('Edit sales category') && (
                <Tooltip placement="top" title={<FormattedMessage id="Product.Edit" />} key="item3">
                  <a style={styles.edit} onClick={this._showEditModal.bind(this, rowInfo)} className="iconfont iconEdit">
                    {/*<FormattedMessage id="edit" />*/}
                  </a>
                </Tooltip>
              ),
              // ιι»θ?€εη±»ε―ε ι€
              rowInfo.get('isDefault') != 1 && checkAuth('delete') && (
                <Tooltip placement="top" title={<FormattedMessage id="Product.Delete" />} key="item4">
                  <a onClick={this._delete.bind(this, rowInfo.get('storeCateId'))} className="iconfont iconDelete">
                    {/*<FormattedMessage id="delete" />*/}
                  </a>
                </Tooltip>
              )
            ]
          : '-'}
      </div>
    );
  };

  _editSEOSetting = (cateParentId: string, cateParentName: string, goodsCateId: number) => {
    const { getSeo } = this.props.relaxProps;
    getSeo(cateParentId);
  };
  /**
   * ζ·»ε ε­η±»η?
   */
  _addChildrenCate = (cateParentId: string, cateParentName: string, goodsCateId: number) => {
    const { showEditModal, images } = this.props.relaxProps;
    showEditModal(Map({ cateParentId, cateParentName, goodsCateId }), images);
  };

  /**
   * ζΎη€ΊδΏ?ζΉεΌΉηͺ
   */
  _showEditModal = (rowInfo) => {
    const { showEditModal, allDataList } = this.props.relaxProps;
    let cateParentName = '';
    let cateParentId = rowInfo.get('cateParentId');
    if (cateParentId > 0) {
      cateParentName = allDataList
        .filter((item) => item.get('storeCateId') === cateParentId)
        .get(0)
        .get('cateName');
    }
    rowInfo = rowInfo.set('cateParentName', cateParentName);
    showEditModal(rowInfo, rowInfo.get('cateImg'));
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
    let okText = (window as any).RCi18n({id:'Product.OK'});
    let title = (window as any).RCi18n({id:'Product.Prompt'});
    
    if (goodsFlag) {
      let content = (window as any).RCi18n({id:'Product.TheCurrentCategory'});
      //θ―₯εη±»δΈζεε
      Modal.info({
        title:title ,
        content: content,
        okText: okText
      });
    } else if (childFlag) {
      let content = (window as any).RCi18n({id:'Product.PleaseDelete'});
      //ζε­εη±»
      Modal.info({
        title: title ,
        content:content ,
        okText: okText
      });
      // confirm({
      //   title: 'Prompt',
      //   content: 'Please delete all categories under this category first.',
      //   onOk() {
      //     doDelete(storeCateId);
      //   }
      // });
    } else {
      let content = (window as any).RCi18n({id:'Product.deleteThisCategory'});
      //ζ²‘ζε­εη±»
      confirm({
        title: title,
        content: content,
        onOk() {
          doDelete(storeCateId);
        }
      });
    }
  };
  _updateDisplayStatus = (checked, row) => {
    const { updateDisplayStatus } = this.props.relaxProps;
    let params = {
      cateDescription: row.cateDescription,
      cateGrade: row.cateGrade,
      cateImg: JSON.stringify(row.cateImg),
      cateName: row.cateName,
      cateParentId: row.cateParentId,
      catePath: row.catePath,
      displayStatus: checked,
      sort: row.sort,
      storeCateId: row.storeCateId,
      children: row.children
    };
    updateDisplayStatus(params);
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

export default DragDropContext(HTML5Backend)(injectIntl(CateList));
