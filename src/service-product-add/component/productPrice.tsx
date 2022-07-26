import * as React from 'react';
import { Relax } from 'plume2';
import { Table, Input, Row, Col, Checkbox, InputNumber, Form, Button, message, Tooltip, Icon, Select } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List } from 'immutable';
import { noop, ValidConst, cache, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const FILE_MAX_SIZE = 2 * 1024 * 1024;

const limitDecimals = (value: string | number): string => {
  const reg = /^(\-)*(\d+)\.(\d\d\d\d\d).*$/;
  if(typeof value === 'string') {
    return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
  } else {
    return ''
  }
};

@Relax
export default class ProductPrice extends React.Component<any, any> {
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
      getGoodsId: any;
      selectedBasePrice: any;
      setSelectedBasePrice: Function;
      editGoodsItem: Function;
      updateChecked: Function;
      synchValue: Function;
      addSkUProduct: any;
      clickImg: Function;
      removeImg: Function;
      modalVisible: Function;
      goods: IMap;
      deleteGoodsInfo: Function;
      updateSkuForm: Function;
      baseSpecId: Number;
      subscriptionStatus: any;
      updateBasePrice: Function;
      setDefaultBaseSpecId: Function;
      updateAllBasePrice: Function;
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
    selectedBasePrice: 'selectedBasePrice',
    addSkUProduct: 'addSkUProduct',
    baseSpecId: 'baseSpecId',
    subscriptionStatus: 'subscriptionStatus',
    getGoodsId: 'getGoodsId',
    editGoodsItem: noop,
    deleteGoodsInfo: noop,
    updateSkuForm: noop,
    updateChecked: noop,
    synchValue: noop,
    clickImg: noop,
    removeImg: noop,
    modalVisible: noop,
    updateAllBasePrice: noop,
    updateBasePrice: noop,
    setDefaultBaseSpecId: noop,
    setSelectedBasePrice: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(SkuForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const { goods } = this.props.relaxProps;

    return (
      <WrapperForm
        {...{ relaxProps: this.props.relaxProps }}
      />
    );
  }
}
let precisions = 2
class SkuForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      priceType: ''
    };
  }

  onPriceType = (res) => {
    this.setState({
      priceType: res
    });
  };

  componentDidMount() {
    //this._handleBasePriceChange
    const { goodsList } = this.props.relaxProps;
  }

  render() {
    const { goodsList, goods, goodsSpecs, baseSpecId, addSkUProduct } = this.props.relaxProps;
    // const {  } = this.state


    const columns = this._getColumns();
    return (
      <div style={{ marginBottom: 20 }}>
        <Form>
          <Table size="small" dataSource={goodsList.toJS()} rowKey="id" columns={columns} pagination={false} />
        </Form>
      </div>
    );
  }

  _getColumns = () => {
    const { getFieldDecorator } = this.props.form;
    const { goodsSpecs, addSkUProduct, marketPriceChecked, specSingleFlag, spuMarketPrice, priceOpt, goods, baseSpecId } = this.props.relaxProps;
    let columns: any = List();

    // 未开启规格时，不需要展示默认规格
    if (!specSingleFlag) {
      if (baseSpecId) {
        const _goodsSpecs = goodsSpecs.toJS();
        let selectedItem;
        _goodsSpecs.forEach((item) => {
          if (item.mockSpecId === baseSpecId) {
            selectedItem = item;
          }
        });
        if (selectedItem) {
          columns = columns.push({
            title: sessionStorage.getItem(cache.SYSTEM_GET_WEIGHT),
            key: selectedItem.specId,
            dataIndex: 'specId-' + selectedItem.specId,
            render: (rowInfo) => {
              return (
                <Row>
                  <Col span={12}>
                    <FormItem style={{ paddingTop: 28 }}>{rowInfo}</FormItem>
                  </Col>
                </Row>
              );
            }
          });
        }
      }
    }

    columns = columns.unshift({
      key: 'index' + 1,
      title: '',
      render: (_text, _rowInfo, index) => {
        return index + 1;
      }
    });

    columns = columns.push({
      key: 'goodsInfoNo' + 'index',
      title: <FormattedMessage id="product.SKU" />,
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
    columns = columns.push({
      key: 'index',
      title: <FormattedMessage id="Product.Purchasetype" />,
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              <div>
                {goods.get('subscriptionStatus') == 1 ? (
                  <div>
                      <span>
                        <FormattedMessage id="Product.OneOff" />
                      </span>
                    {rowInfo.subscriptionStatus != 0 || rowInfo.subscriptionStatus != null ? (
                      <p>
                        <span><FormattedMessage id="Product.Subscription" /></span>
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div>
                    <span><FormattedMessage id="Product.OneOff" /></span>
                  </div>
                )}
              </div>
            </FormItem>
          </Col>
        </Row>
      )
    });

    columns = columns.push({
      key: 'linePrice',
      title: (
        <div>
          <FormattedMessage id="product.purchasePrice" />
        </div>
      ),
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <div className="flex-start-align">
              <span style={{paddingRight:'3px'}}>{sessionStorage.getItem('s2b-supplier@systemGetConfig:')}</span>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('linePrice_' + rowInfo.id, {
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'linePrice'),
                  initialValue: rowInfo.linePrice || 0
                })(<InputNumber disabled min={0} max={9999999.99} precision={2}
                />)}
              </FormItem>
            </div>
          </Col>
        </Row>
      )
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              fontSize: '12px',
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
            }}
          >
            *
          </span>
          <FormattedMessage id="product.marketPrice" />
          <br />
        </div>
      ),
      key: 'marketPrice',
      render: (rowInfo) => {

        let marketPrice =  rowInfo.marketPrice ? rowInfo.marketPrice : 0
        let subscriptionPrice =  rowInfo.subscriptionPrice ? rowInfo.subscriptionPrice : 0

        return (
          <Row>
            <Col span={12}>
              {goods.get('subscriptionStatus') == 1 ? (
                <div>
                  <div className="flex-start-align">
                    <span style={{paddingRight:'3px'}}>{sessionStorage.getItem('s2b-supplier@systemGetConfig:')}</span>
                    <FormItem style={styles.tableFormItem}>
                      {getFieldDecorator('marketPrice_' + rowInfo.id, {
                        rules: [
                          {
                            required: true,
                            message: RCi18n({id:'Product.inputMarketPrice'})
                          }
                        ],

                        onChange: (e) => this._editGoodsItem(rowInfo.id, 'marketPrice', e, rowInfo.subscriptionStatus === 0 ? false : true),
                        initialValue: marketPrice
                      })(
                        <InputNumber
                          min={0}
                          //disabled={(rowInfo.index > 1 && marketPriceChecked) || (!rowInfo.aloneFlag && priceOpt == 0 && spuMarketPrice)}
                          formatter={limitDecimals}
                          max={9999999.99}
                          parser={limitDecimals}
                          // step={0.01}
                        />
                      )}
                    </FormItem>
                  </div>
                  {rowInfo.subscriptionStatus != 0 || rowInfo.subscriptionStatus != null ? (
                    <div className="flex-start-align">
                      <span style={{paddingRight:'3px'}}>{sessionStorage.getItem('s2b-supplier@systemGetConfig:')}</span>
                      <FormItem style={styles.tableFormItem}>
                        {getFieldDecorator('subscriptionPrice_' + rowInfo.id, {
                          rules: [
                            {
                              required: true,
                              message: RCi18n({id:'Product.subscriptionPrice'})
                            },
                          ],
                          onChange: this._editGoodsItem.bind(this, rowInfo.id, 'subscriptionPrice'),
                          initialValue: subscriptionPrice
                        })(
                          <InputNumber
                            min={0}
                            parser={limitDecimals}
                            max={9999999.99}
                            //precision={2}
                            disabled={rowInfo.subscriptionStatus === 0}
                            formatter={limitDecimals}
                            // step={0.01}
                            //formatter={(value) => `${sessionStorage.getItem('s2b-supplier@systemGetConfig:') ? sessionStorage.getItem('s2b-supplier@systemGetConfig:') : ''} ${value}`}
                          />
                        )}
                      </FormItem>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="flex-start-align">
                  <span style={{paddingRight:'3px'}}>{sessionStorage.getItem('s2b-supplier@systemGetConfig:')}</span>
                  <FormItem style={styles.tableFormItem}>
                    {getFieldDecorator('marketPrice_' + rowInfo.id, {
                      rules: [
                        {
                          required: true,
                          message: RCi18n({id:'Product.inputMarketPrice'})
                        }
                      ],

                      onChange: (e) => this._editGoodsItem(rowInfo.id, 'marketPrice', e, false),
                      initialValue: marketPrice
                    })(
                      <InputNumber
                        min={0}
                        max={9999999.99}
                        formatter={limitDecimals}
                        parser={limitDecimals}
                      />
                    )}
                  </FormItem>
                </div>
              )}
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: '',
      width: '5%',
      key: 'goodsNo',
    });

    return columns.toJS();
  };
  _getBasePrice = (id, price, spec) => {
    if (isNaN(parseFloat(price) / parseFloat(spec))) {
      return '0';
    } else {
      const { editGoodsItem } = this.props.relaxProps;
      const value = (parseFloat(price) / parseFloat(spec)).toFixed(2);
      editGoodsItem(id, 'basePrice', value);
      return value;
    }
  };
  _getSubscriptionBasePrice = (id, price, spec) => {
    if (isNaN(parseFloat(price) / parseFloat(spec))) {
      return '0';
    } else {
      const { editGoodsItem } = this.props.relaxProps;
      const value = (parseFloat(price) / parseFloat(spec)).toFixed(2);
      editGoodsItem(id, ' subscriptionBasePrice', value);
      return value;
    }
  };
  _handleChange = (value) => {
    const { updateAllBasePrice } = this.props.relaxProps;
    sessionStorage.setItem('baseSpecId', value);
    this._editGoodsItem(null, 'baseSpecId', value);
    updateAllBasePrice(value);
  };
  _deleteGoodsInfo = (id: string) => {
    const { deleteGoodsInfo } = this.props.relaxProps;
    deleteGoodsInfo(id);
  };

  _handleBasePriceChange = (e) => {
    const { setSelectedBasePrice } = this.props.relaxProps;
    setSelectedBasePrice(e);
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
        message.error(RCi18n({id:'Product.lessThan2M'}));
        return false;
      }
    } else {
      message.error(RCi18n({id:'Product.FileFormatError'}));
      return false;
    }
  };

  /**
   * 修改商品属性
   */
  _editGoodsItem = (id: string, key: string, e: any, flag?: any) => {
    const { editGoodsItem, synchValue, updateBasePrice } = this.props.relaxProps;
    const checked = this.props.relaxProps[`${key}Checked`];
    if (e && e.target) {
      e = e.target.value;
    }

    editGoodsItem(id, key, e);

    if (key == 'marketPrice') {
      editGoodsItem(id, 'flag', flag);
    }

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
    updateBasePrice(id, key, e);
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

  formatNum = (num) =>{
    let numMatch = String(num).match(/\d*(\.\d{0,4})?/);
    return (numMatch[0] += numMatch[1] ? '0000'.substr(0, 5 - numMatch[1].length) : '.0000');
  }
}

const styles = {
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  tableFormItem: {
    padding: '2px',
    marginBottom: '0px'
  }
};
