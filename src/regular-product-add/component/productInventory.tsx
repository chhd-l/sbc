import { Col, Form, InputNumber, message, Row, Select, Table } from 'antd';
import { fromJS, List } from 'immutable';
import { Relax } from 'plume2';
import { Const, noop, RCi18n, ValidConst } from 'qmkit';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { IList, IMap } from 'typings/globalType';
const { Option } = Select;

const FormItem = Form.Item;
const FILE_MAX_SIZE = 2 * 1024 * 1024;

@Relax
export default class ProductInventory extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      goodsSpecs: IList;
      deleteGoodsInfo: Function;
      updateSkuForm: Function;
      synchValue: Function;
      clickImg: Function;
      goodsList: IList;
      updateChecked: Function;
      removeImg: Function;
      baseSpecId: Number;
      uomList: IList;
      stockChecked: boolean;
      spuMarketPrice: number;
      marketPriceChecked: boolean;
      specSingleFlag: boolean;
      goods: IMap;
      updateInventoryForm: Function;
      priceOpt: number;
      editGoodsItem: Function;
      modalVisible: Function;
      priceForm: any;
    };
  };

  static relaxProps = {
    // 商品基本信息
    goods: 'goods',
    goodsSpecs: 'goodsSpecs',
    goodsList: 'goodsList',
    updateSkuForm: noop,
    updateChecked: noop,
    stockChecked: 'stockChecked',
    editGoodsItem: noop,
    marketPriceChecked: 'marketPriceChecked',
    modalVisible: noop,
    uomList: 'uomList',
    specSingleFlag: 'specSingleFlag',
    baseSpecId: 'baseSpecId',
    deleteGoodsInfo: noop,
    synchValue: noop,
    clickImg: noop,
    spuMarketPrice: ['goods', 'marketPrice'],
    priceOpt: 'priceOpt',
    removeImg: noop,
    updateInventoryForm: noop,
    priceForm: 'priceForm'
  };

  //
  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(SkuForm);
  }

  //

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

//

class SkuForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  //
  componentDidMount() {
    const { updateInventoryForm } = this.props.relaxProps;
    updateInventoryForm(this.props.form);
  }

//
  handleChange(value) {}

  render() {
    const { goodsList, goods, goodsSpecs, baseSpecId } = this.props.relaxProps;
    // const {  } = this.state
    let columns = this._getColumns();

    return (
      //
      <div style={{ marginBottom: 20 }}>
        <Form>

          <Table
            size="small"
            rowKey="id"
            dataSource={goodsList.toJS()}
            columns={columns}
            pagination={false}
          />

        </Form>
      </div>
    );
  }

  _getColumns = () => {

    let { getFieldDecorator } = this.props.form;

    const {
      goodsSpecs,
      stockChecked,
      modalVisible,
      spuMarketPrice,
      priceOpt,
      marketPriceChecked,
      baseSpecId,
      clickImg,
      specSingleFlag,
      goods,
      removeImg,
      uomList
    } = this.props.relaxProps;

    const disableFields = Const.SITE_NAME === 'MYVETRECO';

    let columns: any = List();

    // 未开启规格时，不需要展示默认规格

    if (!specSingleFlag) {
      
      columns = goodsSpecs
        .map((item, i) => {
          return {
            title: item.get('specName'),
            dataIndex: 'specId-' + item.get('specId'),
            key: item.get('specId'),
            render: (rowInfo) => {
              return rowInfo;
            }
          };
        })
        .toList();
        //
    }

    columns = columns.unshift({
      title: '',
      key: 'index' + 2,
      render: (_text, _rowInfo, index) => {
        return index + 1;
      }
    });

    columns = columns.push({

      title: <FormattedMessage id="product.SKU" />,
      key: 'goodsInfoNo' + 'subscriptionPrice',
      //
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={{ paddingTop: 28 }}>{rowInfo.goodsInfoNo}</FormItem>
            </Col>
          </Row>
        );
      }
    });

    //Stocking UOM
    columns = columns.push({


      title: <FormattedMessage id="Product.StockingUOM" />,




      key: 'stockUomId',
      width: '10%',





      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('stockUomId_' + rowInfo.id, {
                  rules: [],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'stockUomId'),
                  initialValue: rowInfo.stockUomId || null
                })(
                  
                  <Select
                    disabled={disableFields}
                    getPopupContainer={() => document.getElementById('page-content')}
                    style={{ width: 100 }}
                  >
                    {uomList.map((item) => (
                      <Option
                        value={item.get('id')}
                        key={item.get('id')}
                        title={item.get('uomName')}
                      >
                        {item.get('uomName')}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>



            </Col>
          </Row>
        );
      }
    });

    //Conversion factor
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

          <FormattedMessage id="Product.ConversionFactor" />
        </div>
      ),
      key: 'factor',
      render: (rowInfo) => {
        return (
          <Row>

            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('factor_' + rowInfo.id, {
                  rules: [],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'factor'),
                  initialValue: rowInfo.factor || 1
                })(

                  <InputNumber
                    disabled={disableFields}
                    min={1}
                    step={1}
                    precision={0}
                    style={{ width: 100 }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    //Pricing UOM -disabled
    columns = columns.push({

      title: <FormattedMessage id="Product.PricingUOM" />,
      key: 'priceUomId',

      width: '10%',

      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                <Select value={rowInfo.priceUomId} disabled style={{ width: 100 }}>

                  {uomList.map((item) => (
                    <Option value={item.get('id')} key={item.get('id')} title={item.get('uomName')}>
                      {item.get('uomName')}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      //
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
          <FormattedMessage id="Product.StockingInventory" />
          <br />
          {/*<Checkbox checked={stockChecked} onChange={(e) => this._synchValue(e, 'stock')}>
            <FormattedMessage id="allTheSame" />
            &nbsp;
            <Tooltip placement="top" title={'After checking, all SKUs use the same inventory'}>
              <a style={{ fontSize: 14 }}>
                <Icon type="question-circle-o" />
              </a>
            </Tooltip>
          </Checkbox>*/}
        </div>
      ),
      key: 'externalStock',

      render: (rowInfo) => (
        <Row>
          <Col span={12}>

            <FormItem style={styles.tableFormItem}>

              {getFieldDecorator('externalStock_' + rowInfo.id, {
                rules: [
                  {
                    validator: (_rule, value, callback) => {
                      if (!value && value !== 0) {
                        callback(RCi18n({ id: 'Product.PleaseInputInventory' }));
                      }
                      if (!ValidConst.zeroNumber.test(value)) {
                        callback(RCi18n({ id: 'Product.PleaseEnterTheCorrect' }));
                      }
                      callback();
                    }
                  }
                ],

                onChange: this._editGoodsItem.bind(this, rowInfo.id, 'externalStock'),
                initialValue: rowInfo.externalStock
              })(
                <InputNumber
                  style={{ width: 100 }}
                  min={0}
                  max={999999999}
                  disabled={disableFields || (rowInfo.index > 1 && stockChecked)}
                />
              )}
            </FormItem>

          </Col>
        </Row>
      )
    });

    //Stocking inventory
    columns = columns.push({
      title: <FormattedMessage id="Product.PricingInventory" />,
      key: 'stock',
      render: (rowInfo) => {

        let stock = 0;
        if (rowInfo.externalStock && rowInfo.factor) {
          stock = Math.floor(rowInfo.externalStock / rowInfo.factor);
        }
        this._editGoodsItem(rowInfo.id, 'stock', stock);
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                <InputNumber value={stock} disabled />
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: RCi18n({ id: 'Product.Inventory Alert' }),
      key: 'virtualAlert',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('virtualAlert_' + rowInfo.id, {
                rules: [
                  {
                    pattern: ValidConst.number,
                    message: RCi18n({ id: 'Product.PleaseEnterTheCorrect' })
                  }
                ],
                onChange: this._editGoodsItem.bind(this, rowInfo.id, 'virtualAlert'),
                initialValue: rowInfo.virtualAlert
              })(
                <InputNumber
                  disabled={disableFields}
                  style={{ width: 100 }}
                  min={0}
                  max={999999999}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      )
    });
    columns = columns.push({
      title: '',
      key: '1',
      width: '5%'
    });

    return columns.toJS();
  };

  _deleteGoodsInfo = (id: string) => {
    const { deleteGoodsInfo } = this.props.relaxProps;
    deleteGoodsInfo(id);
  };


  _handleChange = (value) => {
    sessionStorage.setItem('baseSpecId', value);
    this._editGoodsItem(null, 'baseSpecId', value);
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {

    let fileName = file.name.toLowerCase();

    // 支持的图片格式：jpg、jpeg、png、gif

    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif') ||
      fileName.endsWith('.jpeg')
    ) {
      if (file.size < FILE_MAX_SIZE) {
        return true;
      } else {
        message.error(RCi18n({ id: 'Product.lessThan2M' }));
        return false;
      }
    } else {
      message.error(RCi18n({ id: 'Product.FileFormatError' }));
      return false;
    }
  };

  /**
   * 修改商品属性
   */

  _editGoodsItem = (id: string, key: string, e: any) => {
    const checked = this.props.relaxProps[`${key}Checked`];
    let { editGoodsItem, synchValue, priceForm, goodsList } = this.props.relaxProps;

    if (e && e.target) {
      e = e.target.value;
    }

    //factor更新，需要更新marketPrice, subscriptionPrice, basePrice, subscriptionBasePrice, linePrice
    if (key === 'factor') {
      const goodsItem = goodsList.toJS().find((g) => g.id === id);

      const {
        subscriptionBasePrice,
        subscriptionPrice,
        marketPrice,
        linePrice,
        basePrice,
        factor
      } = goodsItem;

      const newMarketPrice = marketPrice
        ? (marketPrice * parseInt(e)) / parseInt(factor)
        : marketPrice;

      const newSubscriptionPrice = subscriptionPrice
        ? (subscriptionPrice * parseInt(e)) / parseInt(factor)
        : subscriptionPrice;

      const newBasePrice = basePrice ? (basePrice * parseInt(e)) / parseInt(factor) : basePrice;
      const newSubscriptionBasePrice = subscriptionBasePrice
        ? (subscriptionBasePrice * parseInt(e)) / parseInt(factor)
        : subscriptionBasePrice;

      const newLinePrice = linePrice ? (linePrice * parseInt(e)) / parseInt(factor) : linePrice;

      editGoodsItem(id, 'marketPrice', newMarketPrice);
      editGoodsItem(id, 'subscriptionPrice', newSubscriptionPrice);
      
      editGoodsItem(id, 'basePrice', newBasePrice);

      editGoodsItem(id, 'subscriptionBasePrice', newSubscriptionBasePrice);

      editGoodsItem(id, 'linePrice', newLinePrice);

      if (priceForm.getFieldsValue) {
        priceForm.setFieldsValue({
          [`marketPrice_${id}`]: newMarketPrice,
          [`subscriptionPrice_${id}`]: newSubscriptionPrice,
          [`basePrice_${id}`]: newBasePrice,
          [`subscriptionBasePrice_${id}`]: newSubscriptionBasePrice,
          [`linePrice_${id}`]: newLinePrice
        });
      }
    }

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
        fileList = fileList.filter(
          (file) => file.status == 'done' && file.response != null && file.response.message == null
        );
      }
    }

    let { editGoodsItem } = this.props.relaxProps;
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
}

let styles = {
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
