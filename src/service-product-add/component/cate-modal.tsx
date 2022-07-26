import { Form, Input, message, Modal, Tree, TreeSelect } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { fromJS, Map } from 'immutable';
import { Relax } from 'plume2';
import PropTypes from 'prop-types';
import { noop, QMMethod, Tips, ValidConst } from 'qmkit';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { IList, IMap } from 'typings/globalType';
import ImageLibraryUpload from './image-library-upload';

const { TextArea } = Input;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

const TreeNode = Tree.TreeNode;

let Errorbox = 
styled.div`
  .has-error.has-feedback .ant-form-item-children:after,
  .has-success.has-feedback .ant-form-item-children:after,
  .has-warning.has-feedback .ant-form-item-children:after,
  .has-success.has-feedback .ant-form-item-children-icon,
  .is-validating.has-feedback .ant-form-item-children:after {
    right: -30px;
  }
`;

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

      modalCateVisible: boolean;
      doCateAdd: Function;
      showGoodsPropDetail: Function;
      clickImg: Function;
      modalVisibleFun: Function;
      changeStoreCategory: Function;
      images: IList;
      removeImg: Function;
      closeCateModal: Function;
      cateList: IList;
      checkFlag: boolean;
      updateGoodsForm: Function;
      showCateModal: Function;
      goods: IMap;
      editGoods: Function;
      enterpriseFlag: boolean;
      flashsaleGoods: IList;
      storeCateList: IList;
      formData: IMap;
      closeModal: Function;
      editFormData: Function;
      sourceCateList: IList;

    };

  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 弹框是否显示
    modalCateVisible: 'modalCateVisible',
    // 店铺分类信息
    storeCateList: 'storeCateList',
    updateGoodsForm: noop,
    editGoods: noop,
    images: 'images',
    // 关闭弹窗
    closeCateModal: noop,
    goods: 'goods',
    cateList: 'cateList',
    sourceCateList: 'sourceCateList',
    modalVisibleFun: noop,
    clickImg: noop,
    checkFlag: 'checkFlag',
    showGoodsPropDetail: noop,
    changeStoreCategory: noop,
    // 添加类目
    doAdd: noop,
    // 修改类目
    editFormData: noop,
    // 添加店铺分类
    doCateAdd: noop,
    // 类目信息
    formData: 'formData',
    // 关闭弹窗
    closeModal: noop,
    removeImg: noop
  };

  render() {
     
    const WrapperForm = this.WrapperForm;
    let { 
      modalCateVisible
     } = this.props.relaxProps;

    if (!modalCateVisible) {
      return null;
    }
    return (
      <Modal
        key='ServiceProductAddModalComponents'
        maskClosable={false}
        title={<FormattedMessage id="add" />}
        visible={modalCateVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <WrapperForm ref={(form) => (this._form = form)} relaxProps={this.props.relaxProps} />
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    let form = this._form as WrappedFormUtils;

    form.validateFields(null, (errs) => {

      if (!errs) {
        //提交
        let { doCateAdd } = this.props.relaxProps;

        if (form.getFieldValue('cateName')) {

          const cateName = form.getFieldValue('cateName');

          let cateParentId = form.getFieldValue('cateParentId') || 0;
          let sort = form.getFieldValue('sort') || 0;

          doCateAdd(cateName, cateParentId, sort);
        }
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    let { closeCateModal } = this.props.relaxProps;
    closeCateModal();
  };
}

class CateModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      editFormData: Function;
      closeModal: Function;
      closeCateModal: Function;
      editGoods: Function;
      showBrandModal: Function;
      checkFlag: boolean;
      showCateModal: Function;
      sourceCateList: IList;
      updateGoodsForm: Function;
      formData: IMap;
      clickImg: Function;
      showGoodsPropDetail: Function;
      goods: IMap;
      enterpriseFlag: boolean;
      flashsaleGoods: IList;
      images: IList;
      changeStoreCategory: Function;
      storeCateList: IList;
      cateList: IList;
      removeImg: Function;
      modalVisibleFun: Function;
    };
    form;
  };

  //声明上下文依赖
  static contextTypes = {

    _plume$Store: PropTypes.object

  };

  constructor(props) {

    super(props);

  }


  static relaxProps = {
    // 修改类目
    editFormData: noop,
    changeStoreCategory: noop,
    updateGoodsForm: noop,
    // 弹框是否显示
    modalVisible: 'modalVisible',
    checkFlag: 'checkFlag',
    showGoodsPropDetail: noop,
    // 添加类目
    doAdd: noop,
    // 类目信息
    goods: 'goods',
    cateList: 'cateList',
    formData: 'formData',
    modalVisibleFun: noop,
    clickImg: noop,
    // 关闭弹窗
    closeModal: noop,
    sourceCateList: 'sourceCateList',
    editGoods: noop,
    images: 'images',
    removeImg: noop
  };

  render() {

    let storeCateList = this.props.relaxProps.storeCateList;

    const { sourceCateList, goods, cateList, images, modalVisibleFun, clickImg, removeImg } =
      this.props.relaxProps;
      
    let { getFieldDecorator } = this.props.form;

    // 返回一级分类列表
    let loop = (cateList) =>
      cateList
        .filter((item) => item.get('isDefault') != 1 && item.get('cateParentId') == 0)
        .map((item) => {
          return (
            <TreeNode
              key={item.get('storeCateId')}
              value={item.get('storeCateId')}
              title={item.get('cateName')}
            />
          );
        });

    //处理分类的树形图结构数据

    let loopCate = (cateList) =>

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

    return (
      <Form key='ServiceProductAddFromComponents' className="login-form">
        <FormItem {...formItemLayout} label="Classification name" hasFeedback>
          {getFieldDecorator('cateName', {
            rules: [
              { required: true, whitespace: true, message: '请输入分类名称' },
              { max: 10, message: '最多10字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '分类名称');
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Superior classification">
          {getFieldDecorator('cateParentId', {
            rules: [
              {
                required: true,
                message: 'please select superior classification'
              }
            ]
          })(
            <TreeSelect
              getPopupContainer={() => document.getElementById('root')}
              placeholder="please select superior classification"
              notFoundContent="暂无分类"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
            >
              <TreeNode key="0" value="0" title="Top level classification">
                {loop(storeCateList)}
              </TreeNode>
            </TreeSelect>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="product.platformCategory" />}>
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
            initialValue:
              goods.get('cateId') && goods.get('cateId') != '' ? goods.get('cateId') : undefined
          })(
            <TreeSelect
              getPopupContainer={() => document.getElementById('page-content')}
              placeholder="Please select category"
              notFoundContent="暂无分类"
              // disabled={cateDisabled}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
            >
              {loopCate(cateList)}
            </TreeSelect>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="cateImage" />}>
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
        <FormItem labelCol={2} {...formItemLayout} label={<FormattedMessage id="cateDsc" />}>
          {getFieldDecorator('goodsDescription', {
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '商品描述');
                }
              }
            ],
            onChange: this._editGoods.bind(this, 'goodsDescription'),
            initialValue: goods.get('goodsDescription')
          })(
            <TextArea rows={4} placeholder="Please iwwwwwwwwwwwnput the sssssproduct description" />
          )}
        </FormItem>
        <Errorbox>
          <FormItem {...formItemLayout} label="Sort" hasFeedback>
            {getFieldDecorator('sort', {
              rules: [
                { required: true, message: '请填写排序' },
                {
                  pattern: ValidConst.sortNum,
                  message: '请填写0-999之间的整数'
                }
              ],
              initialValue: 0
            })(<Input style={{ width: '30%' }} placeholder="请填写排序" />)}
            <Tips title="The smaller the value, the higher" />
          </FormItem>
        </Errorbox>
      </Form>
    );
  }

  /**
   * 修改商品项
   */
  _editGoods = (key: string, e) => {

    const { setFieldsValue } = this.props.form;

    let {
      checkFlag,
      showBrandModal,
      enterpriseFlag,
      flashsaleGoods,
      editGoods,
      showCateModal,
      updateGoodsForm
    } = this.props.relaxProps;

    if (e && e.target) {
      e = e.target.value;
    }
    if (key === 'cateId') {
      // this._onChange(e);
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
            message = '该商品正在参加分销活动，切换为批发模式，将会退出分销活动，确定要切换？';
          }
        } else {
          if (enterpriseFlag) {
            message = '该商品正在参加企业购活动，切换为批发模式，将会退出企业购活动，确定要切换？';
          }
        }
        let goods = Map({
          [key]: fromJS(e)
        });
        editGoods(goods);
      }
    } else {
      let goods = Map({
        [key]: fromJS(e)
      });
      updateGoodsForm(this.props.form);
      editGoods(goods);
    }
  };
}
