import * as React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, TreeSelect, Tree, message } from 'antd';
import { Relax } from 'plume2';
import { noop, QMMethod, Tips } from 'qmkit';
import { Map, fromJS } from 'immutable';
import Store from '../store';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormattedMessage } from 'react-intl';
import { IList, IMap } from 'typings/globalType';
import ImageLibraryUpload from './image-library-upload';
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 10 }
  }
};

@Relax
export default class CateModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(CateModalForm);
  }

  props: {
    relaxProps?: {
      cateList: IList;
      modalVisible: boolean;
      doAdd: Function;
      editFormData: Function;
      formData: IMap;
      closeModal: Function;
      sourceCateList: IList;
      goods: IMap;
      modalVisibleFun: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 添加类目
    doAdd: noop,
    // 修改类目
    editFormData: noop,
    // 类目信息
    formData: 'formData',
    // 关闭弹窗
    closeModal: noop,
    sourceCateList: 'sourceCateList',
    goods: 'goods',
    cateList: 'cateList',
    checkFlag: 'checkFlag',
    showGoodsPropDetail: noop,
    updateGoodsForm: noop,
    editGoods: noop,
    images: 'images',
    modalVisibleFun: noop,
    clickImg: noop,
    removeImg: noop
  };

  render() {
    const { modalVisible, formData } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={formData.get('storeCateId') ? 'Edit' : 'Add'}
        visible={modalVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <WrapperForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;

    form.validateFields(null, (errs) => {
      if (!errs) {
        //提交
        const { doAdd, formData } = this.props.relaxProps;
        if (formData.get('cateName')) {
          doAdd();
        }
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { closeModal } = this.props.relaxProps;
    closeModal();
  };
}

class CateModalForm extends React.Component<any, any> {
  _store: Store;

  props: {
    relaxProps?: {
      cateList: IList;
      formData: IMap;
      closeModal: Function;
      editFormData: Function;
      sourceCateList: IList;
      goods: IMap;
      editGoods: Function;
      showBrandModal: Function;
      showCateModal: Function;
      checkFlag: boolean;
      enterpriseFlag: boolean;
      flashsaleGoods: IList;
      updateGoodsForm: Function;
      showGoodsPropDetail: Function;
      images: IList;
      clickImg: Function;
      removeImg: Function;
      modalVisibleFun: Function;
    };
    form;
  };

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const formData = this._store.state().get('formData');
    console.log(formData, 'formData');
    const cateName = formData.get('cateName');
    const goodsCateId = formData.get('goodsCateId');
    const goodsDescription = formData.get('cateDescription');
    const { getFieldDecorator } = this.props.form;
    // console.log(formData.get('children'), 'children')
    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          // 一二级类目不允许选择
          return (
            <TreeNode
              key={item.get('cateId')}
              disabled={true}
              value={item.get('cateId')}
              title={item.get('cateName')}
            >
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId')}
            value={item.get('cateId')}
            title={item.get('cateName')}
          />
        );
      });
    const {
      sourceCateList,
      goods,
      cateList,
      images,
      modalVisibleFun,
      clickImg,
      removeImg
    } = this.props.relaxProps;
    console.log(cateList, sourceCateList, 'cateList');
    return (
      <Form className="login-form">
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="categoryName" />}
          hasFeedback
        >
          {getFieldDecorator('cateName', {
            rules: [
              { required: true, whitespace: true, message: '请输入分类名称' },
              { max: 20, message: '最多20字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '分类名称');
                }
              }
            ],
            initialValue: cateName,
            onChange: this._changeCateName
          })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="subCategory" />}
        >
          {formData.get('cateParentName')
            ? formData.get('cateParentName')
            : '无'}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="product.platformCategory" />}
        >
          {getFieldDecorator('cateId', {
            rules: [
              {
                required: true,
                message: '请选择平台商品类目'
              },
              {
                validator: (_rule, value, callback) => {
                  if (!value) {
                    callback();
                    return;
                  }

                  let overLen = false;
                  sourceCateList.forEach((val) => {
                    if (val.get('cateParentId') + '' == value) overLen = true;
                    return;
                  });

                  if (overLen) {
                    callback(new Error('请选择最末级的分类'));
                    return;
                  }

                  callback();
                }
              }
            ],
            onChange: this._editGoods.bind(this, 'cateId'),
            initialValue: goodsCateId
          })(
            <TreeSelect
              disabled={
                (formData.get('cateParentId') &&
                  formData.get('cateParentId') !== 0) ||
                formData.get('children')
              }
              getPopupContainer={() => document.getElementById('page-content')}
              placeholder="请选择分类"
              notFoundContent="暂无分类"
              // disabled={cateDisabled}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
            >
              {loop(cateList)}
            </TreeSelect>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="cateImage" />}
        >
          <div style={{ width: 550 }}>
            <ImageLibraryUpload
              images={images}
              modalVisible={modalVisibleFun}
              clickImg={clickImg}
              removeImg={removeImg}
              imgType={0}
              imgCount={10}
              skuId=""
            />
          </div>
          <Tips title={<FormattedMessage id="product.recommendedSizeImg" />} />
        </FormItem>
        <FormItem
          labelCol={2}
          {...formItemLayout}
          label={<FormattedMessage id="cateDsc" />}
        >
          {getFieldDecorator('cateDescription', {
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '商品描述');
                }
              }
            ],
            onChange: this._editGoods.bind(this, 'cateDescription'),
            initialValue: goodsDescription
          })(<TextArea rows={4} placeholder="请填商品描述" />)}
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改分类名称
   */
  _changeCateName = (e) => {
    const store = this._store as any;
    store.editFormData(Map({ cateName: e.target.value }));
  };
  /**
   * 选中平台类目时，实时显示对应类目下的所有属性信息
   */
  _onChange = (value) => {
    const { showGoodsPropDetail } = this.props.relaxProps;
    showGoodsPropDetail(value);
  };
  /**
   * 修改商品项
   */
  _editGoods = (key: string, e) => {
    const {
      editGoods,
      showBrandModal,
      showCateModal,
      checkFlag,
      enterpriseFlag,
      flashsaleGoods,
      updateGoodsForm
    } = this.props.relaxProps;
    const { setFieldsValue } = this.props.form;
    if (e && e.target) {
      e = e.target.value;
    }
    console.log(key, 'key');
    if (key === 'cateId') {
      this._onChange(e);
      if (e === '-1') {
        showCateModal();
      }
    } else if (key === 'brandId' && e === '0') {
      showBrandModal();
    }

    if (key === 'saleType' && e == 0) {
      if (!flashsaleGoods.isEmpty()) {
        message.error('该商品正在参加秒杀活动，不可更改销售类型！', 3, () => {
          let goods = Map({
            [key]: fromJS(1)
          });
          editGoods(goods);
          setFieldsValue({ saleType: 1 });
        });
      } else {
        let message = '';
        //1:分销商品和企业购商品  2：企业购商品  3：分销商品  4：普通商品
        if (checkFlag == 'true') {
          if (enterpriseFlag) {
            //分销商品和企业购商品
            message =
              '该商品正在参加企业购和分销活动，切换为批发模式，将会退出企业购和分销活动，确定要切换？';
          } else {
            //分销商品
            message =
              '该商品正在参加分销活动，切换为批发模式，将会退出分销活动，确定要切换？';
          }
        } else {
          if (enterpriseFlag) {
            message =
              '该商品正在参加企业购活动，切换为批发模式，将会退出企业购活动，确定要切换？';
          }
        }
        if (message != '') {
          // confirm({
          //   title: '提示',
          //   content: message,
          //   onOk() {
          let goods = Map({
            [key]: fromJS(e)
          });
          editGoods(goods);
          //   },
          //   onCancel() {
          //     let goods = Map({
          //       [key]: fromJS(1)
          //     });
          //     editGoods(goods);
          //     setFieldsValue({ saleType: 1 });
          //   },
          //   okText: '确定',
          //   cancelText: '取消'
          // });
        } else {
          let goods = Map({
            [key]: fromJS(e)
          });
          editGoods(goods);
        }
      }
    } else {
      let goods = Map({
        [key]: fromJS(e)
      });
      updateGoodsForm(this.props.form);
      console.log(editGoods);
      editGoods(goods);
    }
  };
}
