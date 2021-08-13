import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Form,
  Input,
  TreeSelect,
  Tree,
  message,
  Select,
  Radio,
  Switch,
  DatePicker,
} from 'antd';
import { Relax } from 'plume2';
import {Const, noop, QMMethod, Tips} from 'qmkit';
import { Map, fromJS } from 'immutable';
import Store from '../store';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormattedMessage } from 'react-intl';
import { IList, IMap } from 'typings/globalType';
import ImageLibraryUpload from './image-library-upload';
import moment from 'moment';
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;
const Option = Select.Option;

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
const { RangePicker } = DatePicker;

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
      petType: IList;
      loading: boolean;
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
    removeImg: noop,
    petType: 'petType',
    loading: 'loading'
  };

  render() {
    const { modalVisible, formData, loading } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
      <Modal
          maskClosable={false}
          title={formData.get('storeCateId') ? 'Edit' : 'Add'}
          visible={modalVisible}
          zIndex={100}
          width={700}
          onCancel={this._handleModelCancel}
          onOk={this._handleSubmit}
          confirmLoading={loading}
      >
        <WrapperForm ref={(form) => (this._form = form)} relaxProps={this.props.relaxProps} />
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
    Modal.destroyAll();
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
      petType: IList;
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
    const cateName = formData.get('cateName');
    const cateRouter = formData.get('cateRouter');
    const goodsCateId = formData.get('goodsCateId');
    const goodsDescription = formData.get('cateDescription');
    const descriptionTitle = formData.get('cateTitle');
    const cateType = formData.get('cateType');
    const displayStatus = formData.get('displayStatus');
    const altName = formData.get('altName');
    const filterStatus = !!formData.get('filterStatus');
    const periodBeginTime = formData.get('periodBeginTime');
    const periodEndTime = formData.get('periodEndTime');
    let period = periodBeginTime && periodEndTime
        ? [moment(periodBeginTime), moment(periodEndTime)]
        : []

    const { getFieldDecorator } = this.props.form;
    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          // 一二级类目不允许选择
          return (
            <TreeNode key={item.get('cateId')} disabled={true} value={item.get('cateId')} title={item.get('cateName')}>
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return <TreeNode key={item.get('cateId')} value={item.get('cateId')} title={item.get('cateName')} />;
      });
    const { sourceCateList, goods, cateList, images, modalVisibleFun, clickImg, removeImg, petType } = this.props.relaxProps;

    return (
      <Form className="login-form" style={{ width: 550 }}>
        <FormItem {...formItemLayout} label={<FormattedMessage id="Product.categoryName" />} hasFeedback>
          {getFieldDecorator('cateName', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: <FormattedMessage id="Product.enterCategoryName" />
              },
              { max: 100, message: <FormattedMessage id="Product.Up100Characters" /> },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, 'Category Name');
                }
              }
            ],
            initialValue: cateName,
            onChange: this._changeCateName
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Parent category">
          {formData.get('cateParentName') ? formData.get('cateParentName') : 'none'}
        </FormItem>
        {formData.get('cateParentName') ? null : (
          <FormItem {...formItemLayout} label="Display in shop">
            {getFieldDecorator('displayStatus', {
              rules: [
                {
                  required: true,
                  message: <FormattedMessage id="Product.PleaseSelectDisplay" />
                }
              ],
              initialValue: displayStatus,
              onChange: this._editGoods.bind(this, 'displayStatus')
            })(
              <Radio.Group>
                <Radio value={true}>
                  <FormattedMessage id="Product.Yes" />
                </Radio>
                <Radio value={false}>
                  <FormattedMessage id="Product.No" />
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
        )}
        {formData.get('cateParentName')
            ? null
            : (
                <FormItem {...formItemLayout} label="Filter status">
                  {getFieldDecorator('filterStatus', {
                    rules: [],
                    valuePropName: 'checked',
                    initialValue: filterStatus || false,
                    onChange: this._editGoods.bind(this, 'filterStatus')
                  })(
                      <Switch/>
                    )}
            </FormItem>
        )}

        {formData.get('cateParentName')
            ? null
            : (
                <FormItem {...formItemLayout} label="Period">
                  {getFieldDecorator('period', {
                    rules: [],
                    initialValue: period || [],
                    onChange: this._editGoods.bind(this, 'period')
                  })(
                      <RangePicker
                          // allowClear={false}
                          format={Const.TIME_FORMAT}
                          placeholder={['Start time', 'End time']}
                          showTime
                      />
                  )}
                </FormItem>
            )
        }

        {formData.get('cateParentName') ? null : (
            <FormItem {...formItemLayout} label="Router">
              {getFieldDecorator('cateRouter', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: <FormattedMessage id="Product.PleaseEnterRouter" />
                  },
                  { max: 100, message: <FormattedMessage id="Product.Up100Characters" /> }
                ],
                initialValue: cateRouter,
                onChange: this._editGoods.bind(this, 'cateRouter')
              })(<Input />)}
              <Tips title={<FormattedMessage id="Product.recommendedRouter" />} />
            </FormItem>
        )}
        {formData.get('cateParentName') ? null : (
            <FormItem {...formItemLayout} label="ALT name">
              {getFieldDecorator('altName', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: <FormattedMessage id="Product.PleaseEnterALT" />
                  },
                  { max: 100, message: <FormattedMessage id="Product.Up100Characters" /> }
                ],
                initialValue: altName,
                onChange: this._editGoods.bind(this, 'altName')
              })(<Input />)}
            </FormItem>
        )}
        <FormItem labelCol={2} {...formItemLayout} label="Category type">
          {getFieldDecorator('cateType', {
            // rules: [
            //   {
            //     required: true,
            //     message: 'Please selected category type'
            //   }
            // ],
            onChange: this._editGoods.bind(this, 'cateType'),
            initialValue: cateType ? this._getCateTypeName(cateType) : ''
          })(
              <Select>
                <Option value="">
                  <FormattedMessage id="Product.All" />
                </Option>
                {petType &&
                petType.toJS().map((item, index) => (
                    <Option value={item.valueEn} key={index}>
                      {item.name}
                    </Option>
                ))}
              </Select>
          )}
          <Tips title={<FormattedMessage id="Product.recommendedAliasName" />} />
        </FormItem>

        {/*{displayStatus ? (*/}
        {/*  <>*/}
        {/*    {formData.get('cateParentName') ? null : (*/}
        {/*      <FormItem {...formItemLayout} label="Router">*/}
        {/*        {getFieldDecorator('cateRouter', {*/}
        {/*          rules: [*/}
        {/*            {*/}
        {/*              required: true,*/}
        {/*              whitespace: true,*/}
        {/*              message: <FormattedMessage id="Product.PleaseEnterRouter" />*/}
        {/*            },*/}
        {/*            { max: 100, message: <FormattedMessage id="Product.Up100Characters" /> }*/}
        {/*          ],*/}
        {/*          initialValue: cateRouter,*/}
        {/*          onChange: this._editGoods.bind(this, 'cateRouter')*/}
        {/*        })(<Input />)}*/}
        {/*        <Tips title={<FormattedMessage id="Product.recommendedRouter" />} />*/}
        {/*      </FormItem>*/}
        {/*    )}*/}
        {/*    {formData.get('cateParentName') ? null : (*/}
        {/*      <FormItem {...formItemLayout} label="ALT name">*/}
        {/*        {getFieldDecorator('altName', {*/}
        {/*          rules: [*/}
        {/*            {*/}
        {/*              required: true,*/}
        {/*              whitespace: true,*/}
        {/*              message: <FormattedMessage id="Product.PleaseEnterALT" />*/}
        {/*            },*/}
        {/*            { max: 100, message: <FormattedMessage id="Product.Up100Characters" /> }*/}
        {/*          ],*/}
        {/*          initialValue: altName,*/}
        {/*          onChange: this._editGoods.bind(this, 'altName')*/}
        {/*        })(<Input />)}*/}
        {/*      </FormItem>*/}
        {/*    )}*/}
        {/*    <FormItem labelCol={2} {...formItemLayout} label="Category type">*/}
        {/*      {getFieldDecorator('cateType', {*/}
        {/*        // rules: [*/}
        {/*        //   {*/}
        {/*        //     required: true,*/}
        {/*        //     message: 'Please selected category type'*/}
        {/*        //   }*/}
        {/*        // ],*/}
        {/*        onChange: this._editGoods.bind(this, 'cateType'),*/}
        {/*        initialValue: cateType ? this._getCateTypeName(cateType) : ''*/}
        {/*      })(*/}
        {/*        <Select>*/}
        {/*          <Option value="">*/}
        {/*            <FormattedMessage id="Product.All" />*/}
        {/*          </Option>*/}
        {/*          {petType &&*/}
        {/*            petType.toJS().map((item, index) => (*/}
        {/*              <Option value={item.valueEn} key={index}>*/}
        {/*                {item.name}*/}
        {/*              </Option>*/}
        {/*            ))}*/}
        {/*        </Select>*/}
        {/*      )}*/}
        {/*      <Tips title={<FormattedMessage id="Product.recommendedAliasName" />} />*/}
        {/*    </FormItem>*/}
        {/*  </>*/}
        {/*) : null}*/}

        <FormItem {...formItemLayout} label={<FormattedMessage id="Product.cateImage" />}>
          <div style={{ width: '400px' }}>
            <ImageLibraryUpload images={images} modalVisible={modalVisibleFun} clickImg={clickImg} removeImg={removeImg} imgType={0} imgCount={10} skuId="" />
          </div>
          <Tips title={<FormattedMessage id="Product.recommendedSizeImg" />} />
        </FormItem>

        <FormItem {...formItemLayout} label="Description title">
          {getFieldDecorator('cateTitle', {
            rules: [{ max: 100, message: <FormattedMessage id="Product.Up100Characters" /> }],
            onChange: this._editGoods.bind(this, 'cateTitle'),
            initialValue: descriptionTitle
          })(<Input />)}
        </FormItem>

        <FormItem labelCol={2} {...formItemLayout} label={<FormattedMessage id="Product.cateDsc" />}>
          {getFieldDecorator('cateDescription', {
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, 'Product Description');
                }
              }
            ],
            onChange: this._editGoods.bind(this, 'cateDescription'),
            initialValue: goodsDescription
          })(<TextArea rows={4} placeholder="Please input the product description" />)}
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
    const { editGoods, showBrandModal, showCateModal, checkFlag, enterpriseFlag, flashsaleGoods, updateGoodsForm } = this.props.relaxProps;
    const { setFieldsValue } = this.props.form;
    if (e && e.target) {
      e = e.target.value;
    }
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
        if (checkFlag) {
          if (enterpriseFlag) {
            //分销商品和企业购商品
            message = '该商品正在参加企业购和分销活动，切换为批发模式，将会退出企业购和分销活动，确定要切换？';
          } else {
            //分销商品
            message = '该商品正在参加分销活动，切换为批发模式，将会退出分销活动，确定要切换？';
          }
        } else {
          if (enterpriseFlag) {
            message = '该商品正在参加企业购活动，切换为批发模式，将会退出企业购活动，确定要切换？';
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
      editGoods(goods);
    }
  };
  _getCateTypeName = (value) => {
    const { petType } = this.props.relaxProps;
    let currentPetType = petType && petType.toJS().find((item) => item.id == value || item.valueEn == value);
    if (currentPetType && currentPetType.name) {
      return currentPetType.name;
    } else {
      return '';
    }
  };
}
