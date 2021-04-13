import * as React from 'react';
import { Relax } from 'plume2';
import { Alert, Col, Form, Input, message, Modal, Radio, Row, Select, Tree, TreeSelect } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { noop, QMMethod, Tips, ValidConst, SelectGroup } from 'qmkit';
import { fromJS, Map } from 'immutable';

import ImageLibraryUpload from './image-library-upload';
import VideoLibraryUpload from './video-library-upload';
//import { makeCreateNormalizedMessageFromEsLintFailure } from 'fork-ts-checker-webpack-plugin/lib/NormalizedMessageFactories';
import { FormattedMessage } from 'react-intl';
//import { consoleTestResultHandler } from 'tslint/lib/test';

const { TextArea } = Input;
const { Option } = Select;
// const Option = Select.Option;
const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 12 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 12 }
  }
};
const tProps = {
  treeCheckable: 'true'
};

const FILE_MAX_SIZE = 2 * 1024 * 1024;
const confirm = Modal.confirm;
const { SHOW_PARENT } = TreeSelect;

@Relax
export default class Info extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      isEditGoods: boolean;
      goods: IMap;
      editGoods: Function;
      editGoodsItem: Function;
      onGoodsTaggingRelList: Function;
      onProductFilter: Function;
      statusHelpMap: IMap;
      cateList: IList;
      sourceCateList: IList;
      storeCateList: IList;
      sourceStoreCateList: IList;
      brandList: IList;
      images: IList;
      video: IMap;
      maxCount: number;

      editImages: Function;
      showGoodsPropDetail: Function;
      changeStoreCategory: Function;
      updateGoodsForm: Function;
      showBrandModal: Function;
      showCateModal: Function;
      modalVisible: Function;
      clickImg: Function;
      removeImg: Function;
      removeVideo: Function;
      changeDescriptionTab: Function;
      cateDisabled: boolean;
      checkFlag: boolean;
      enterpriseFlag: boolean;
      flashsaleGoods: IList;
      getGoodsCate: IList;
      filtersTotal: IList;
      taggingTotal: IList;
      goodsTaggingRelList: IList;
      productFilter: IList;
      sourceGoodCateList: IList;
      purchaseTypeList: IList;
      frequencyList: IList;
    };
  };

  static relaxProps = {
    isEditGoods: 'isEditGoods',
    // 商品基本信息
    goods: 'goods',
    // 修改商品基本信息
    editGoods: noop,
    editGoodsItem: noop,
    // 签约平台类目信息
    cateList: 'cateList',
    sourceCateList: 'sourceCateList',
    // 店铺分类信息
    storeCateList: 'storeCateList',
    sourceStoreCateList: 'sourceStoreCateList',
    // 品牌信息
    brandList: 'brandList',
    // 商品图片
    images: 'images',
    // 视频
    video: 'video',
    maxCount: 'maxCount',

    // 修改图片
    editImages: noop,
    showGoodsPropDetail: noop,
    changeStoreCategory: noop,
    updateGoodsForm: noop,
    changeDescriptionTab: noop,
    // 显示品牌窗口
    showBrandModal: noop,
    showCateModal: noop,
    modalVisible: noop,
    imgVisible: 'imgVisible',
    clickImg: noop,
    removeImg: noop,
    removeVideo: noop,
    cateDisabled: 'cateDisabled',
    checkFlag: 'checkFlag',
    enterpriseFlag: 'enterpriseFlag',
    flashsaleGoods: 'flashsaleGoods',
    getGoodsCate: 'getGoodsCate',
    filtersTotal: 'filtersTotal',
    taggingTotal: 'taggingTotal',
    onGoodsTaggingRelList: noop,
    onProductFilter: noop,
    goodsTaggingRelList: 'goodsTaggingRelList',
    productFilter: 'productFilter',
    sourceGoodCateList: 'sourceGoodCateList',
    purchaseTypeList: 'purchaseTypeList',
    frequencyList: 'frequencyList'
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(GoodsForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    return (
      <div>
        <div
          style={{
            fontSize: 16,
            marginBottom: 10,
            marginTop: 10,
            fontWeight: 'bold'
          }}
        >
          <FormattedMessage id="Product.basicInformation" />
        </div>
        <div>
          <WrapperForm
            ref={(form) => (this['_form'] = form)}
            //ref={(form) => updateGoodsForm(form)}
            {...{ relaxProps: relaxProps }}
          />
        </div>
      </div>
    );
  }
}

class GoodsForm extends React.Component<any, any> {
  componentDidMount() {
    const { updateGoodsForm } = this.props.relaxProps;
    updateGoodsForm(this.props.form);
  }

  constructor(props) {
    super(props);
    this.state = {
      storeCateIds: props.relaxProps.goods.get('storeCateIds'), // 店铺分类id列表
      filterList: [],
      selectFilters: [],
      saleableType: null
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.relaxProps.goods.get('saleableFlag') == 0) {
      this.setState({
        saleableType: true
      });
    } else {
      this.setState({
        saleableType: false
      });
    }
    const storeCateIds = nextProps.relaxProps.goods.get('storeCateIds');
    const filtersTotal = nextProps.relaxProps.filtersTotal;
    if (this.state.storeCateIds != storeCateIds) {
      this.setState({ storeCateIds: storeCateIds });
    }
    let filterList = [];
    if (filtersTotal) {
      let sourceFilter = filtersTotal.toJS();
      sourceFilter.map((item) => {
        let childrenNodes = [];
        let hasCustmerAttribute = item.storeGoodsFilterValueVOList && item.storeGoodsFilterValueVOList.length > 0;
        let hasAttribute = item.attributesValueList && item.attributesValueList.length > 0;
        if (hasCustmerAttribute || hasAttribute) {
          let valuesList = hasCustmerAttribute ? item.storeGoodsFilterValueVOList : hasAttribute ? item.attributesValueList : [];
          childrenNodes = valuesList.map((child) => {
            return {
              title: child.attributeDetailName,
              value: child.id,
              key: child.id,
              isSingle: item.choiceStatus === 'Single choice',
              filterType: item.filterType, // 1 is Custmered
              parentId: hasAttribute ? item.attributeId : item.id
            };
          });
          filterList.push({
            title: item.attributeName,
            value: hasAttribute ? item.attributeId : item.id,
            key: hasAttribute ? item.attributeId : item.id,
            children: childrenNodes
          });
        }
        return item;
      });
    }
    this.setState({
      filterList
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { goods, images, sourceGoodCateList, cateList, getGoodsCate, taggingTotal, modalVisible, clickImg, removeImg, brandList, removeVideo, video, goodsTaggingRelList, productFilter, purchaseTypeList, frequencyList } = this.props.relaxProps;
    const storeCateIds = this.state.storeCateIds;
    let parentIds = sourceGoodCateList ? sourceGoodCateList.toJS().map((x) => x.cateParentId) : [];
    const storeCateValues = [];

    if (storeCateIds) {
      storeCateIds.toJS().map((id) => {
        if (!parentIds.includes(id)) {
          storeCateValues.push({ value: id });
        }
      });
    }

    const taggingRelListValues =
      (goodsTaggingRelList &&
        goodsTaggingRelList.map((x) => {
          return { value: x.taggingId };
        })) ||
      [];
    const filterValues =
      (productFilter &&
        productFilter.map((x) => {
          return { value: x.filterValueId };
        })) ||
      [];

    const loop = (cateList) =>
      cateList &&
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
    let brandExists = false;
    if (goods.get('brandId') != null) {
      brandList.map((item) => {
        if (item.get('brandId') + '' == goods.get('brandId').toString()) {
          brandExists = true;
        }
      });
    }

    let getFrequencyList = []


    if (frequencyList && frequencyList.autoShip) {
      
      if (goods.get('promotions') == "autoship") {
        getFrequencyList = [...frequencyList.autoShip.dayList, ...frequencyList.autoShip.weekList, ...frequencyList.autoShip.monthList]
      }else if (goods.get('promotions') == "club"){
        getFrequencyList = [...frequencyList.club.dayClubList, ...frequencyList.club.weekClubList, ...frequencyList.club.monthClubList]
      }
    }

    return (
      <Form>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.SPU" />}>
              {getFieldDecorator('goodsNo', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please fill in the SPU code'
                  },
                  {
                    min: 1,
                    max: 20,
                    message: '1-20 characters'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(rule, value, callback, 'SPU encoding');
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsNo'),
                initialValue: goods.get('goodsNo')
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.InternalSPU" />}>
              {getFieldDecorator('internalGoodsNo', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please fill in the SPU code'
                  },
                  {
                    min: 1,
                    max: 20,
                    message: '1-20 characters'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(rule, value, callback, 'SPU encoding');
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsNo'),
                initialValue: goods.get('internalGoodsNo')
              })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.productName" />}>
              {getFieldDecorator('goodsName', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: 'Please input product name'
                  },
                  {
                    min: 1,
                    max: 225,
                    message: '1-225 characters'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(rule, value, callback, 'product name');
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsName'),
                initialValue: goods.get('goodsName')
              })(<Input placeholder="Please input product name，no more than 225 words" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.onOrOffShelves" />}>
              {getFieldDecorator('addedFlag', {
                rules: [
                  {
                    required: true,
                    message: 'Please select the status'
                  }
                ],
                onChange: this._editGoods.bind(this, 'addedFlag'),
                initialValue: goods.get('addedFlag') != 0? 1:0
              })(
                <RadioGroup>
                  <Radio value={1}>
                    <FormattedMessage id="Product.onShelves" />
                  </Radio>
                  <Radio value={0}>
                    <FormattedMessage id="Product.offShelves" />
                  </Radio>
                  {/* {isEditGoods && (
                    <Radio value={2} disabled={true}>
                      <FormattedMessage id="Product.partialOnShelves" />
                    </Radio>
                  )} */}
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.subscriptionStatus" />}>
              {getFieldDecorator('subscriptionStatus', {
                rules: [],
                onChange: this._editGoods.bind(this, 'subscriptionStatus'),
                // initialValue: 'Y'
                initialValue: goods.get('subscriptionStatus') || goods.get('subscriptionStatus') === 0 ? goods.get('subscriptionStatus') : 1
              })(
                <Select getPopupContainer={() => document.getElementById('page-content')} disabled={goods.get('displayFlag') == 0 ? true : false} placeholder="please select status">
                  <Option value={1}>Y</Option>
                  <Option value={0}>N</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="Subscription type">
              {getFieldDecorator('promotions', {
                rules: [],
                onChange: this._editGoods.bind(this, 'promotions'),
                // initialValue: 'Y'
                initialValue: goods.get('promotions')
              })(
                <Select getPopupContainer={() => document.getElementById('page-content')}  placeholder="please select type" disabled={Number(goods.get('subscriptionStatus')) === 0} >
                  <Option value='autoship'>Auto ship</Option>
                  <Option value='club'>Club</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        {/*修改*/}
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.defaultPurchaseType" />}>
              {getFieldDecorator('defaultPurchaseType', {
                rules: [],
                onChange: this._editGoods.bind(this, 'defaultPurchaseType'),
                // initialValue: 'Y'
                initialValue: goods.get('defaultPurchaseType')
              })(
                <Select getPopupContainer={() => document.getElementById('page-content')} value={goods.get('defaultPurchaseType')} placeholder="please select Default purchase type" disabled={Number(goods.get('subscriptionStatus')) === 0}>
                  {purchaseTypeList&&purchaseTypeList.map((option) => (
                    <Option value={option.id} key={option.id}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.defaultFrequency" />}>
              {getFieldDecorator('defaultFrequencyId', {
                // rules: [
                //   {
                //     required: false,
                //     message: 'Please select product tagging'
                //   }
                // ],
                initialValue: goods.get('defaultFrequencyId'),
                onChange: this._editGoods.bind(this, 'defaultFrequencyId')
              })(
                <Select getPopupContainer={() => document.getElementById('page-content')} value={goods.get('defaultFrequencyId')} placeholder="please select Default frequency" disabled={Number(goods.get('subscriptionStatus')) === 0}>
                  {getFrequencyList&&getFrequencyList.map((option) => (
                    <Option value={option.id} key={option.id}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="Product category">
              {getFieldDecorator('cateId', {
                rules: [
                  {
                    required: true,
                    message: 'Please select platform product category'
                  },
                  {
                    validator: (_rule, value, callback) => {
                      if (!value) {
                        callback();
                        return;
                      }

                      let overLen = false;
                      sourceGoodCateList.forEach((val) => {
                        if (val.get('cateParentId') + '' == value) overLen = true;
                        return;
                      });

                      if (overLen) {
                        callback(new Error('Please select the last category'));
                        return;
                      }

                      callback();
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'cateId'),
                initialValue: goods.get('cateId') && goods.get('cateId') != '' ? parseInt(goods.get('cateId')) : undefined
              })(
                <TreeSelect
                  getPopupContainer={() => document.getElementById('page-content')}
                  placeholder="Please select product category"
                  notFoundContent="No classification"
                  // disabled={cateDisabled}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeDefaultExpandAll
                >
                  {loop(cateList)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="Sales category">
              {getFieldDecorator('storeCateIds', {
                rules: [
                  // {
                  //   required: true,
                  //   message: 'Please select sales category'
                  // }
                ],

                initialValue: storeCateValues
              })(
                <TreeSelect
                  getPopupContainer={() => document.getElementById('page-content')}
                  treeCheckable={true}
                  showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                  treeCheckStrictly={true}
                  //treeData ={getGoodsCate}
                  // showCheckedStrategy = {SHOW_PARENT}
                  placeholder="Please select sales category"
                  notFoundContent="No classification"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  onChange={this.storeCateChange}
                  treeDefaultExpandAll
                >
                  {this.generateStoreCateTree(getGoodsCate)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          {/* <Col span={8}>
            <a
              href="#"
              onClick={showCateModal}
              style={{ marginLeft: 10, lineHeight: '40px' }}
            >
              Add store classification
            </a>
          </Col> */}
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.brand" />}>
              {getFieldDecorator(
                'brandId',
                brandExists
                  ? {
                      rules: [],
                      onChange: this._editGoods.bind(this, 'brandId'),
                      initialValue: goods.get('brandId').toString()
                    }
                  : {
                      rules: [],
                      onChange: this._editGoods.bind(this, 'brandId')
                    }
              )(this._getBrandSelect())}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="Product tagging">
              {getFieldDecorator('tagging', {
                rules: [
                  {
                    required: false,
                    message: 'Please select product tagging'
                  }
                ],
                initialValue: taggingRelListValues
              })(
                <TreeSelect
                  getPopupContainer={() => document.getElementById('page-content')}
                  treeCheckable={true}
                  showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                  treeCheckStrictly={true}
                  placeholder="Please select product tagging"
                  notFoundContent="No classification"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  showSearch={false}
                  onChange={this.taggingChange}
                >
                  {this.loopTagging(taggingTotal)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          {/*<Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.unitMeasurement" />}>
              {getFieldDecorator('goodsUnit', {
                rules: [
                  {
                    required: true,
                    min: 1,
                    max: 10,
                    message: '1-10 character'
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsUnit'),
                initialValue: goods.get('goodsUnit')
              })(<Input placeholder="Please fill in the unit of measurement，no more than 10 words" />)}
            </FormItem>
          </Col>*/}
        </Row>
        <Row>
          <Col span={16}>
            <FormItem
              // {...formItemLayout}
              labelCol={{
                span: 2,
                xs: { span: 24 },
                sm: { span: 6 }
              }}
              wrapperCol={{
                span: 24,
                xs: { span: 24 },
                sm: { span: 18 }
              }}
              label="Product card intro."
            >
              {getFieldDecorator('goodsNewSubtitle', {
                rules: [
                  {
                    min: 1,
                    max: 5000,
                    message: '1-5000 characters'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(rule, value, callback, 'Product card intro.');
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsNewSubtitle'),
                initialValue: goods.get('goodsNewSubtitle')
              })(<Input placeholder="Please input the item card intro., no more than 5000 words" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <FormItem
              // {...formItemLayout}
              labelCol={{
                span: 2,
                xs: { span: 24 },
                sm: { span: 6 }
              }}
              wrapperCol={{
                span: 24,
                xs: { span: 24 },
                sm: { span: 18 }
              }}
              label={<FormattedMessage id="Product.productSubtitle" />}
            >
              {getFieldDecorator('goodsSubtitle', {
                rules: [
                  {
                    min: 1,
                    max: 5000,
                    message: '1-5000 characters'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(rule, value, callback, 'Product Subtitle');
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsSubtitle'),
                initialValue: goods.get('goodsSubtitle')
              })(<Input placeholder="Please input the item subtitle, no more than 5000 words" />)}
            </FormItem>
          </Col>
        </Row>
        {/*<Row>
          <Col span={16}>
            <FormItem
              labelCol={{
                span: 2,
                xs: { span: 24 },
                sm: { span: 6 }
              }}
              wrapperCol={{
                span: 24,
                xs: { span: 24 },
                sm: { span: 18 }
              }}
              // {...formItemLayout}
              label={<FormattedMessage id="Product.productDescription" />}
            >
              {getFieldDecorator('goodsDescription', {
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorEmoji(rule, value, callback, 'product description');
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsDescription'),
                initialValue: goods.get('goodsDescription')
              })(<TextArea rows={4} placeholder="Please fill in the description of the item" />)}
            </FormItem>
          </Col>
        </Row>*/}
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label="Sales status">
              {getFieldDecorator('saleableFlag', {
                rules: [
                  {
                    required: true,
                    message: 'Please select the status'
                  }
                ],
                onChange: this._editGoods.bind(this, 'saleableFlag'),
                initialValue: goods.get('saleableFlag')
              })(
                <RadioGroup>
                  <span>
                    <Radio value={1}>Saleable</Radio>
                  </span>
                  <span>
                    <Radio value={0}>Not–Saleable</Radio>
                  </span>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          {goods.get('saleableFlag') == 0 ? (
            <Col span={12}>
              <FormItem {...formItemLayout} label="Display on shop">
                {getFieldDecorator('displayFlag', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select the status'
                    }
                  ],
                  onChange: this._editGoods.bind(this, 'displayFlag'),
                  initialValue: goods.get('displayFlag')
                })(
                  <RadioGroup>
                    <Radio value={1}>Yes</Radio>
                    <Radio value={0}>No</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          ) : null}
        </Row>
        {/* <Row>
          <Col span={8}>
            <FormItem {...formItemLayout} label="Customized filter">
              {getFieldDecorator('productFilter', {
                initialValue: filterValues
              })(
                <TreeSelect
                  getPopupContainer={() => document.getElementById('page-content')}
                  treeCheckable={true}
                  showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                  treeCheckStrictly={true}
                  //treeData ={filtersTotal}
                  // showCheckedStrategy = {SHOW_PARENT}
                  placeholder="Please select customized filter"
                  notFoundContent="No classification"
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  showSearch={false}
                  onChange={(value: any) => {
                    this.filterChange(value);
                  }}
                  treeDefaultExpandAll
                >
                  {this.filtersTotalTree(this.state.filterList)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
        </Row> */}
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  <FormattedMessage id="Product.productImage" />
                </span>
              }
            >
              <div style={{ width: 550 }}>
                <ImageLibraryUpload images={images} modalVisible={modalVisible} clickImg={clickImg} removeImg={removeImg} imgType={0} imgCount={10} skuId="" />
              </div>
              <Tips title={<FormattedMessage id="Product.recommendedSizeImg" />} />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="Product.productVideo" />}>
              <div style={{ width: 550 }}>
                <VideoLibraryUpload modalVisible={modalVisible} video={video} removeVideo={removeVideo} imgType={3} skuId="" />
              </div>
              <Tips title={<FormattedMessage id="Product.recommendedSizeVideo" />} />
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  /**
   * 选中平台类目时，实时显示对应类目下的所有属性信息
   */
  _onChange = (value) => {
    const { showGoodsPropDetail, changeStoreCategory, changeDescriptionTab } = this.props.relaxProps;
    showGoodsPropDetail(value);
    changeStoreCategory(value);
    changeDescriptionTab(value);
  };
  /**
   * 修改商品项
   */
  _editGoods = (key: string, e) => {
    const { editGoods, editGoodsItem, showBrandModal, showCateModal, checkFlag, enterpriseFlag, flashsaleGoods, updateGoodsForm } = this.props.relaxProps;
    const { setFieldsValue } = this.props.form;


    if (key === 'addedFlag') {
      if (e.target.value == 0) {
        this.setState({
          saleableType: true
        });
        let goods = Map({
          [key]: fromJS(0)
        });
        editGoodsItem(goods);
        setFieldsValue({ addedFlag: 0 });
      } else {
        this.setState({
          saleableType: false
        });
        let goods = Map({
          [key]: fromJS(1)
        });
        editGoodsItem(goods);
        setFieldsValue({ addedFlag: 1 });
      }
    }

    if (key === 'saleableFlag') {
      if (e.target.value == 0) {
        this.setState({
          saleableType: true
        });
        let goods = Map({
          [key]: fromJS(1)
        });
        editGoods(goods);
        setFieldsValue({ saleType: 1 });
      } else {
        this.setState({
          saleableType: false
        });
        let goods = Map({
          [key]: fromJS(0)
        });
        editGoods(goods);
        setFieldsValue({ saleType: 0 });
      }
    }

    if (key === 'displayFlag') {
      if (e.target.value == 0) {
        let goods = Map({
          subscriptionStatus: fromJS(0)
        });
        editGoods(goods);
        editGoodsItem(goods);
        setFieldsValue({ subscriptionStatus: 0 });
      } else {
        let goods = Map({
          subscriptionStatus: fromJS(1)
        });
        editGoods(goods);
        editGoodsItem(goods);
        setFieldsValue({ subscriptionStatus: 1 });
      }
    }

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
        message.error('This product is participating in a spike event, and the sales type cannot be changed!', 3, () => {
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
            message = 'The product is participating in corporate purchasing and distribution activities, switching to wholesale mode, will exit corporate purchasing and distribution activities, sure to switch?';
          } else {
            //分销商品
            message = 'The product is participating in the distribution activity, switch to wholesale mode, will withdraw from the distribution activity, sure to switch?';
          }
        } else {
          if (enterpriseFlag) {
            message = 'The product is participating in a corporate purchase activity and switched to the wholesale mode. Will it exit the corporate purchase activity? Are you sure you want to switch?';
          }
        }
        if (message != '') {
          confirm({
            title: '提示',
            content: message,
            onOk() {
              let goods = Map({
                [key]: fromJS(e)
              });
              editGoods(goods);
            },
            onCancel() {
              let goods = Map({
                [key]: fromJS(1)
              });
              editGoods(goods);
              setFieldsValue({ saleType: 1 });
            },
            okText: 'OK',
            cancelText: 'Cancel'
          });
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

    if (key === 'subscriptionStatus' && e == 0) {
      this.props.form.setFieldsValue({
        defaultPurchaseType: null
      });
      this.props.form.setFieldsValue({
        defaultFrequencyId: null
      });
    }else {

    }
  };

  /**
   * 修改店铺分类
   */
  storeCateChange = (value, _label, extra) => {
    const { editGoods, sourceGoodCateList } = this.props.relaxProps;
    // 店铺分类，结构如 [{value: 1, label: xx},{value: 2, label: yy}]
    // 店铺分类列表

    // 勾选的店铺分类列表
    let originValues = fromJS(value.map((v) => v.value));

    // 如果是点x清除某个节点或者是取消勾选某个节点，判断清除的是一级还是二级，如果是二级可以直接清；如果是一级，连带把二级的清了
    if (extra.clear || !extra.checked) {
      sourceGoodCateList.forEach((cate) => {
        // 删的是某个一级的
        if (extra.triggerValue == cate.get('storeCateId') && cate.get('cateParentId') == 0) {
          // 找到此一级节点下的二级节点
          const children = sourceGoodCateList.filter((ss) => ss.get('cateParentId') == extra.triggerValue);
          // 把一级的子节点也都删了
          originValues = originValues.filter((v) => children.findIndex((c) => c.get('storeCateId') == v) == -1);
        }
      });
    }

    // 如果子节点被选中，上级节点也要被选中
    // 为了防止extra对象中的状态api变化，业务代码未及时更新，这里的逻辑不放在上面的else中
    originValues.forEach((v) => {
      sourceGoodCateList.forEach((cate) => {
        // 找到选中的分类，判断是否有上级r
        if (v == cate.get('storeCateId') && cate.get('cateParentId') != 0) {
          // 判断上级是否已添加过，如果没有添加过，添加
          let secondLevel = sourceGoodCateList.find((x) => x.get('storeCateId') === cate.get('cateParentId'));
          if (secondLevel && secondLevel.get('cateParentId') !== 0) {
            let exsit = originValues.toJS().includes(secondLevel.get('cateParentId'));
            if (!exsit) {
              originValues = originValues.push(secondLevel.get('cateParentId')); // first level
            }
          }

          let exsit = originValues.toJS().includes(cate.get('cateParentId'));
          if (!exsit) {
            originValues = originValues.push(cate.get('cateParentId')); // second level
          }
        }
      });
    });
    const storeCateIds = originValues;

    const goods = Map({
      ['storeCateIds']: storeCateIds
    });

    editGoods(goods);
  };

  taggingChange = (taggingValues, _label, extra) => {
    const { onGoodsTaggingRelList } = this.props.relaxProps;
    let originValues = taggingValues.map((v) => v.value);
    const goodsTaggingRelList = [];
    originValues.map((x) => {
      goodsTaggingRelList.push({ taggingId: x });
    });

    // 强制刷新店铺分类的选中视图
    this.setState({ goodsTaggingRelList }, () => {});

    onGoodsTaggingRelList(goodsTaggingRelList);
  };

  filterChange = (values) => {
    const { onProductFilter } = this.props.relaxProps;
    let allChildrenList = [];
    this.state.filterList.map((x) => {
      x.children.map((c) => allChildrenList.push(c));
    });
    let selectFilters = values.map((x) => x.value);
    let selectChildren = allChildrenList.filter((x) => selectFilters.includes(x.value));

    let productFilter = [];

    selectChildren.map((child) => {
      productFilter.push({
        filterId: child.parentId,
        filterValueId: child.value
      });
    });
    // 强制刷新店铺分类的选中视图
    this.setState({ productFilter, selectFilters }, () => {
      this.filtersTotalTree(this.state.filterList);
    });

    onProductFilter(productFilter);
  };

  /**
   * 获取品牌下拉框
   */
  _getBrandSelect = () => {
    const { brandList } = this.props.relaxProps;
    return (
      <Select
        showSearch
        getPopupContainer={() => document.getElementById('page-content')}
        placeholder="please select brand"
        notFoundContent="No brand"
        allowClear={true}
        optionFilterProp="children"
        filterOption={(input, option: any) => {
          return typeof option.props.children == 'string' ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : true;
        }}
      >
        {brandList.map((item) => {
          return (
            <Option key={item.get('brandId')} value={item.get('brandId') + ''}>
              {item.get('brandName')}
            </Option>
          );
        })}
      </Select>
    );
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('File size cannot exceed 2M');
        return false;
      }
    } else {
      message.error('File format error');
      return false;
    }
  };

  /**
   * 店铺分类树形下拉框
   * @param storeCateList
   */
  generateStoreCateTree = (storeCateList) => {
    return (
      storeCateList &&
      storeCateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')} disabled checkable={false}>
              {this.generateStoreCateTree(item.get('children'))}
            </TreeNode>
          );
        }
        return <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')} />;
      })
    );
  };

  filtersTotalTree = (filterList) => {
    return (
      filterList &&
      filterList.map((item) => {
        let parentItem = this.state.filterList.find((x) => x.value === item.parentId);
        let childrenIds = parentItem ? parentItem.children.map((x) => x.value) : [];
        let selectedFilters = this.state.selectFilters;
        let intersection = childrenIds.filter((v) => selectedFilters.includes(v));
        let singleDisabled = item.isSingle && intersection.length > 0 && item.value != intersection[0];
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode key={'parent' + item.key} value={'partent' + item.value} title={item.title} disabled checkable={false}>
              {this.filtersTotalTree(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} value={item.value} title={item.title} disabled={singleDisabled} />;
      })
    );
  };

  loopTagging = (taggingTotalTree) => {
    return (
      taggingTotalTree &&
      taggingTotalTree.map((item) => {
        return <TreeNode key={item.get('id')} value={item.get('id')} title={item.get('taggingName')} />;
      })
    );
  };
}
