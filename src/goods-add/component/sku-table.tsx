import * as React from 'react';
import { Relax } from 'plume2';
import { Table, Input, Row, Col, Checkbox, InputNumber, Form, Button, message, Tooltip, Icon, Select } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List } from 'immutable';
import { noop, ValidConst } from 'qmkit';
import ImageLibraryUpload from './image-library-upload';
import { FormattedMessage } from 'react-intl';
import ProductTooltipSKU from './productTooltip-sku';
import * as _ from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;
const FILE_MAX_SIZE = 2 * 1024 * 1024;
const { TextArea } = Input;
@Relax
export default class SkuTable extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      goodsSpecs: IList;
      goodsList: IList;
      stockChecked: boolean;
      marketPriceChecked: boolean;
      specSingleFlag: boolean;
      spuMarketPrice: number;
      priceOpt: number;
      editGoodsItem: Function;
      deleteGoodsInfo: Function;
      updateSkuForm: Function;
      updateChecked: Function;
      synchValue: Function;
      clickImg: Function;
      removeImg: Function;
      modalVisible: Function;
      goods: IMap;
      baseSpecId: Number;
      addSkUProduct: any;
      onProductselectSku: Function;
      onEditSubSkuItem: Function;
    };
  };

  static relaxProps = {
    // 商品基本信息
    goods: 'goods',
    goodsSpecs: 'goodsSpecs',
    goodsList: 'goodsList',
    stockChecked: 'stockChecked',
    marketPriceChecked: 'marketPriceChecked',
    specSingleFlag: 'specSingleFlag',
    spuMarketPrice: ['goods', 'marketPrice'],
    priceOpt: 'priceOpt',
    baseSpecId: 'baseSpecId',
    addSkUProduct: 'addSkUProduct',
    editGoodsItem: noop,
    deleteGoodsInfo: noop,
    updateSkuForm: noop,
    updateChecked: noop,
    synchValue: noop,
    clickImg: noop,
    removeImg: noop,
    modalVisible: noop,
    onProductselectSku: noop,
    onEditSubSkuItem: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(SkuForm);
    this.state = {
      visible: false
    };
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const { updateSkuForm } = this.props.relaxProps;
    return (
      <WrapperForm
        // ref={(form) => updateSkuForm(form)}
        {...{ relaxProps: this.props.relaxProps }}
      />
      // <SkuForm />
    );
  }
}

class SkuForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      visible: false
    };
  }

  render() {
    const { goodsList, goods, goodsSpecs, baseSpecId } = this.props.relaxProps;
    // const {  } = this.state
    const columns = this._getColumns();
    // if(this.state.count < 100) {
    //   let count = this.state.count + 1
    //   this.setState({count: count})
    // }else {
    //   return false
    // }
    return (
      <div style={{ marginBottom: 20 }}>
        {this.state.visible == true ? <ProductTooltipSKU visible={this.state.visible} showModal={this.showProduct} /> : <React.Fragment />}
        <Form>
          <Table size="small" rowKey="id" dataSource={goodsList.toJS()} columns={columns} pagination={false} />
        </Form>
      </div>
    );
  }

  showProduct = (res) => {
    this.setState({
      visible: res
    });
  };
  _getColumns = () => {
    const { getFieldDecorator } = this.props.form;
    const { goodsSpecs, stockChecked, marketPriceChecked, modalVisible, clickImg, removeImg, specSingleFlag, spuMarketPrice, priceOpt, goods, baseSpecId } = this.props.relaxProps;

    let columns: any = List();

    // 未开启规格时，不需要展示默认规格
    if (!specSingleFlag) {
      columns = goodsSpecs
        .map((item) => {
          console.log(item.get('specId'), 'specid....');
          return {
            title: item.get('specName'),
            dataIndex: 'specId-' + item.get('specId'),
            key: item.get('specId')
          };
        })
        .toList();
    }
    //console.log(columns.toJS(), 'columns');
    columns = columns.unshift({
      title: (
        <div>
          {/* <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span> */}
          <FormattedMessage id="product.image" />
        </div>
      ),
      key: 'img',
      className: 'goodsImg',
      render: (rowInfo) => {
        const images = fromJS(rowInfo.images ? rowInfo.images : []);
        return <ImageLibraryUpload images={images} modalVisible={modalVisible} clickImg={clickImg} removeImg={removeImg} imgCount={1} imgType={1} skuId={rowInfo.id} />;
      }
    });

    columns = columns.unshift({
      title: '',
      key: 'index',
      render: (_text, _rowInfo, index) => {
        return index + 1;
      }
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          <FormattedMessage id="product.SKU" />
        </div>
      ),
      key: 'goodsInfoNo',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoNo_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: 'Please input SKU code'
                    },
                    {
                      min: 1,
                      max: 20,
                      message: '1-20 characters'
                    }
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'goodsInfoNo'),
                  initialValue: rowInfo.goodsInfoNo
                })(<Input style={{ width: '115px' }} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    //Sub-SKU
    columns = columns.push({
      title: (
        <div>
          <p>Sub-SKU</p>
          <p style={{ fontSize: '12px', color: '#ccc' }}>Maximum 10 products</p>
        </div>
      ),
      key: 'goodsInfoBundleRels',
      render: (rowInfo) => {
        const { addSkUProduct } = this.props.relaxProps;
        this._editGoodsItem(rowInfo.id, 'goodsInfoBundleRels', addSkUProduct);

        return (
          <Row>
            <Col span={16}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoBundleRels' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: 'Please input SKU code'
                    },
                    {
                      min: 1,
                      max: 20,
                      message: '1-20 characters'
                    }
                  ],
                  //onChange:  (e) => this._editGoodsItem(rowInfo.id, 'goodsInfoBundleRels', e),
                  initialValue: rowInfo.goodsInfoBundleRels
                })(
                  <div className="space-between-align">
                    <div style={{ paddingTop: 6 }}>
                      {' '}
                      <Icon style={{ paddingRight: 8, fontSize: '24px', color: 'red', cursor: 'pointer' }} type="plus-circle" onClick={() => this.showProduct(true)} />
                    </div>
                    <div style={{ lineHeight: 2 }}>
                      {addSkUProduct &&
                        addSkUProduct.map((item, index) => {
                          return (
                            <div className="space-between-align" key={item.goodsInfoNo} style={{ paddingLeft: 5 }}>
                              <span style={{ paddingLeft: 5, paddingRight: 5 }}>{item.goodsInfoNo}</span>
                              <InputNumber
                                style={{ width: '60px', height: '25px', textAlign: 'center' }}
                                defaultValue={0}
                                key={item.goodsInfoNo}
                                min={0}
                                onChange={(e) => {
                                  const target = addSkUProduct.filter((a, i) => item.subGoodsInfoId === a.subGoodsInfoId)[0];
                                  if (target) {
                                    target['bundleNum'] = e;
                                  }
                                  let res = _.unionBy([target], addSkUProduct, 'subGoodsInfoId');
                                  // this._editSubSkuItem(rowInfo.id, 'goodsInfoBundleRels', res)
                                  this._editGoodsItem(rowInfo.id, 'goodsInfoBundleRels', res);
                                }}
                              />
                              <a style={{ paddingLeft: 5 }} className="iconfont iconDelete" onClick={() => this.onDel(item, index)}></a>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });
    columns = columns.push({
      title: <div>Description</div>,
      key: 'description',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('description_' + rowInfo.id, {
                rules: [
                  // {
                  //   pattern: ValidConst.number,
                  //   message: '0 or positive integer'
                  // }
                ],
                onChange: this._editGoodsItem.bind(this, rowInfo.id, 'description'),
                initialValue: rowInfo.description
              })(<TextArea rows={2} style={{ width: '300px' }} disabled={rowInfo.description === 0} />)}
            </FormItem>
          </Col>
        </Row>
      )
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          Subscription
          {/* <br />
          <Checkbox checked={stockChecked} onChange={(e) => this._synchValue(e, 'subscriptionStatus')}>
            <FormattedMessage id="allTheSame" />
            &nbsp;
            <Tooltip placement="top" title={'After checking, all subscription status use the same inventory'}>
              <a style={{ fontSize: 14 }}>
                <Icon type="question-circle-o" />
              </a>
            </Tooltip>
          </Checkbox> */}
        </div>
      ),
      key: 'subscriptionStatus',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('subscriptionStatus_' + rowInfo.id, {
                onChange: (e) => this._editGoodsItem(rowInfo.id, 'subscriptionStatus', e),
                initialValue: goods.get('subscriptionStatus') === '0' ? '0' : typeof rowInfo.subscriptionStatus === 'number' ? rowInfo.subscriptionStatus + '' : '1'
              })(
                <Select disabled={goods.get('subscriptionStatus') === '0'} getPopupContainer={() => document.getElementById('page-content')} style={{ width: '115px' }} placeholder="please select status">
                  <Option value="1">Y</Option>
                  <Option value="0">N</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      )
    });

    return columns.toJS();
  };
  _handleChange = (value) => {
    sessionStorage.setItem('baseSpecId', value);
    this._editGoodsItem(null, 'baseSpecId', value);
  };
  _deleteGoodsInfo = (id: string) => {
    const { deleteGoodsInfo } = this.props.relaxProps;
    deleteGoodsInfo(id);
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.gif') || fileName.endsWith('.jpeg')) {
      if (file.size < FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('The file size must be less than 2M');
        return false;
      }
    } else {
      message.error('File format error');
      return false;
    }
  };

  /**
   * 修改商品属性
   */
  _editGoodsItem = (id: string, key: string, e: any) => {
    const { editGoodsItem, synchValue } = this.props.relaxProps;
    const checked = this.props.relaxProps[`${key}Checked`];
    if (e && e.target) {
      e = e.target.value;
    }
    //console.log(id);
    //console.log(key);
    console.log(e);
    editGoodsItem(id, key, e);

    if (key == 'stock' || key == 'marketPrice' || key == 'subscriptionPrice') {
      // 是否同步库存
      if (checked) {
        // 修改store中的库存或市场价
        synchValue(key);
        // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
        const fieldsValue = this.props.form.getFieldsValue();
        // 同步库存/市场价
        let values = {};
        Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
          if (field.indexOf(`${key}_`) === 0) {
            values[field] = e;
          }
        });
        // update
        this.props.form.setFieldsValue(values);
      }
    }
  };

  _editSubSkuItem = (id: string, key: string, e: any) => {
    const { onEditSubSkuItem } = this.props.relaxProps;

    onEditSubSkuItem(e);
    console.log(e, 44444);
  };

  /**
   * 修改商品图片属性
   */
  _editGoodsImageItem = (id: string, key: string, { fileList }) => {
    let msg = null;
    if (fileList != null) {
      fileList.forEach((file) => {
        if (file.status == 'done' && file.response != null && file.response.message != null) {
          msg = file.response.message;
        }
      });

      if (msg != null) {
        //如果上传失败，只过滤成功的图片
        message.error(msg);
        fileList = fileList.filter((file) => file.status == 'done' && file.response != null && file.response.message == null);
      }
    }
    const { editGoodsItem } = this.props.relaxProps;
    editGoodsItem(id, key, fromJS(fileList));
  };

  /**
   * 同步库存
   */
  _synchValue = async (e, key) => {
    const { updateChecked, goodsList } = this.props.relaxProps;
    await updateChecked(key, e.target.checked);
    const goodsInfo = goodsList.get(0);
    if (goodsInfo) {
      this._editGoodsItem(goodsInfo.get('id'), key, goodsInfo.get(key));
    }
  };

  onDel = (item, index) => {
    const { addSkUProduct, onProductselectSku } = this.props.relaxProps;
    let getSkUProduct = addSkUProduct.filter((a) => a != item);
    onProductselectSku(getSkUProduct);
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  tableFormItem: {
    marginBottom: '0px',
    padding: '2px'
  }
};
