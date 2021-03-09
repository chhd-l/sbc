import * as React from 'react';
import { Relax } from 'plume2';
import { Table, Input, Row, Col, Checkbox, InputNumber, Form, Button, message, Tooltip, Icon, Select } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List } from 'immutable';
import { cache, noop, ValidConst } from 'qmkit';
import ImageLibraryUpload from './image-library-upload';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const { Option } = Select;
const FILE_MAX_SIZE = 2 * 1024 * 1024;

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
      addSkUProduct: any;
      selectedBasePrice: any;
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
      subscriptionStatus: any;
      updateBasePrice: Function;
      updateAllBasePrice: Function;
      setDefaultBaseSpecId: Function;
      setSelectedBasePrice: Function;
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
    subscriptionStatus: 'subscriptionStatus',
    getGoodsId: 'getGoodsId',
    addSkUProduct: 'addSkUProduct',
    selectedBasePrice: 'selectedBasePrice',
    editGoodsItem: noop,
    deleteGoodsInfo: noop,
    updateSkuForm: noop,
    updateChecked: noop,
    synchValue: noop,
    clickImg: noop,
    removeImg: noop,
    modalVisible: noop,
    updateBasePrice: noop,
    updateAllBasePrice: noop,
    setDefaultBaseSpecId: noop,
    setSelectedBasePrice: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(SkuForm);
    this.state = {};
  }
  componentDidMount() {
    const { setDefaultBaseSpecId, getGoodsId } = this.props.relaxProps;
    // if (!getGoodsId) {
    //   setDefaultBaseSpecId();
    // }
  }
  render() {
    const WrapperForm = this.WrapperForm;
    const { goods } = this.props.relaxProps;

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
      priceType: ''
    };
  }

  onPriceType = (res) => {
    this.setState({
      priceType: res
    });
  };

  render() {
    const { goodsList, goods, goodsSpecs, baseSpecId } = this.props.relaxProps;
    // const {  } = this.state
    const columns = this._getColumns();
    return (
      <div style={{ marginBottom: 20 }}>
        <Form>
          <Table size="small" rowKey="id" dataSource={goodsList.toJS()} columns={columns} pagination={false} />
        </Form>
      </div>
    );
  }

  _getColumns = () => {
    const { getFieldDecorator } = this.props.form;
    const { goodsSpecs, selectedBasePrice, stockChecked, marketPriceChecked, modalVisible, clickImg, removeImg, specSingleFlag, spuMarketPrice, priceOpt, goods, baseSpecId } = this.props.relaxProps;

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
            dataIndex: 'specId-' + selectedItem.specId,
            key: selectedItem.specId,
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
      // else {
      //   columns = goodsSpecs
      //     .map((item) => {
      //       return {
      //         title: item.get('specName'),
      //         dataIndex: 'specId-' + item.get('specId'),
      //         key: item.get('specId')
      //       };
      //     })
      //     .toList();
      // }
    }

    columns = columns.unshift({
      title: '',
      key: 'index',
      render: (_text, _rowInfo, index) => {
        return index + 1;
      }
    });

    columns = columns.push({
      title: <FormattedMessage id="Product.SKU" />,
      key: 'goodsInfoNo' + 'index',
      render: (rowInfo) => {
        //let a = addSkUProduct[rowInfo.index-1]?addSkUProduct[rowInfo.index-1].pid:''
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
      title: <FormattedMessage id="Product.PurchaseType" />,
      key: 'subscriptionStatus',
      render: (rowInfo) => (
        <Row className="purchase-row">
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              <div>
                {goods.get('subscriptionStatus') == 1 ? (
                  <div>
                    <p>
                      <span>
                        <FormattedMessage id="Product.OneOff" />
                      </span>
                    </p>
                    {rowInfo.subscriptionStatus != 0 || rowInfo.subscriptionStatus != null ? (
                      <p>
                        <span>
                          <FormattedMessage id="Product.Subscription" />
                        </span>
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p>
                    <span>
                      <FormattedMessage id="Product.OneOff" />
                    </span>
                  </p>
                )}
              </div>
            </FormItem>
          </Col>
        </Row>
      )
    });

    columns = columns.push({
      title: (
        <div>
          <FormattedMessage id="Product.listPrice" />
        </div>
      ),
      key: 'linePrice',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('linePrice_' + rowInfo.id, {
                // rules: [
                //   {
                //     pattern: ValidConst.number,
                //     message: 'Please enter the correct value'
                //   }
                // ],
                onChange: this._editGoodsItem.bind(this, rowInfo.id, 'linePrice'),
                initialValue: rowInfo.linePrice || 0
              })(<InputNumber min={0} max={9999999} formatter={(value) => `${sessionStorage.getItem('s2b-supplier@systemGetConfig:') ? sessionStorage.getItem('s2b-supplier@systemGetConfig:') : ''} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />)}
            </FormItem>
          </Col>
        </Row>
      )
    });
    // columns = columns.push({
    //   title: <FormattedMessage id="product.purchasePrice" />,
    //   key: 'goodsInfoNo' + 'index',
    //   render: (rowInfo) => {
    //     return (
    //       <Row>
    //         <Col span={12}>
    //           <FormItem style={styles.tableFormItem}>
    //             {getFieldDecorator('purchasePrice_' + rowInfo.id, {
    //               rules: [
    //                 {
    //                   pattern: ValidConst.number,
    //                   message: 'Please enter the correct value'
    //                 }
    //               ],
    //               initialValue: rowInfo.linePrice || 0
    //             })(<InputNumber style={{ width: '60px' }} min={0} max={9999999} />)}
    //           </FormItem>
    //         </Col>
    //       </Row>
    //     );
    //   }
    // });

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
          <FormattedMessage id="Product.marketPrice" />
        </div>
      ),
      key: 'marketPrice',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            {goods.get('subscriptionStatus') == 1 ? (
              <div className="flex-content-center">
                <FormItem style={styles.tableFormItem}>
                  {getFieldDecorator('marketPrice_' + rowInfo.id, {
                    rules: [
                      {
                        required: true,
                        message: <FormattedMessage id="Product.inputMarketPrice" />
                      }
                      // {
                      //   pattern: ValidConst.zeroPrice,
                      //   message: 'Please input the legal amount with two decimal places'
                      // },
                      // {
                      //   type: 'number',
                      //   max: 9999999.99,
                      //   message: 'The maximum value is 9999999.99',
                      //   transform: function (value) {
                      //     return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                      //   }
                      // }
                    ],

                    onChange: (e) => this._editGoodsItem(rowInfo.id, 'marketPrice', e, rowInfo.subscriptionStatus === 0 ? false : true),
                    initialValue: rowInfo.marketPrice || 0
                  })(
                    <InputNumber
                      min={0}
                      max={9999999.99}
                      precision={2}
                      disabled={(rowInfo.index > 1 && marketPriceChecked) || (!rowInfo.aloneFlag && priceOpt == 0 && spuMarketPrice)}
                      formatter={(value) => `${sessionStorage.getItem('s2b-supplier@systemGetConfig:') ? sessionStorage.getItem('s2b-supplier@systemGetConfig:') : ''} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                    // <Input style={{ width: '60px' }} disabled={(rowInfo.index > 1 && marketPriceChecked) || (!rowInfo.aloneFlag && priceOpt == 0 && spuMarketPrice)} />
                  )}
                </FormItem>
                {rowInfo.subscriptionStatus != 0 || rowInfo.subscriptionStatus != null ? (
                  <FormItem style={styles.tableFormItem}>
                    {getFieldDecorator('subscriptionPrice_' + rowInfo.id, {
                      rules: [
                        {
                          required: true,
                          message: <FormattedMessage id="Product.subscriptionPrice" />
                        },
                        {
                          pattern: ValidConst.zeroPrice,
                          message: <FormattedMessage id="Product.theLegalAmount" />
                        },
                        {
                          type: 'number',
                          max: 9999999.99,
                          message: <FormattedMessage id="Product.maximum9" />,
                          transform: function (value) {
                            return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                          }
                        }
                      ],
                      onChange: this._editGoodsItem.bind(this, rowInfo.id, 'subscriptionPrice'),
                      initialValue: rowInfo.subscriptionPrice || 0
                    })(
                      <InputNumber
                        min={0}
                        max={9999999.99}
                        precision={2}
                        disabled={rowInfo.subscriptionStatus === 0}
                        formatter={(value) => `${sessionStorage.getItem('s2b-supplier@systemGetConfig:') ? sessionStorage.getItem('s2b-supplier@systemGetConfig:') : ''} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                      // <Input style={{ width: '60px' }} min={0} max={9999999} disabled={rowInfo.subscriptionStatus === 0} />
                    )}
                  </FormItem>
                ) : null}
              </div>
            ) : (
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('marketPrice_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      message: <FormattedMessage id="Product.inputMarketPrice" />
                    }
                    // {
                    //   pattern: ValidConst.zeroPrice,
                    //   message: 'Please input the legal amount with two decimal places'
                    // },
                    // {
                    //   type: 'number',
                    //   max: 9999999.99,
                    //   message: 'The maximum value is 9999999.99',
                    //   transform: function (value) {
                    //     return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                    //   }
                    // }
                  ],

                  onChange: (e) => this._editGoodsItem(rowInfo.id, 'marketPrice', e, false),
                  initialValue: rowInfo.marketPrice || 0
                })(
                  <InputNumber
                    min={0}
                    max={9999999.99}
                    precision={2}
                    disabled={(rowInfo.index > 1 && marketPriceChecked) || (!rowInfo.aloneFlag && priceOpt == 0 && spuMarketPrice)}
                    formatter={(value) => `${sessionStorage.getItem('s2b-supplier@systemGetConfig:') ? sessionStorage.getItem('s2b-supplier@systemGetConfig:') : ''} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                  // <Input style={{ width: '60px' }} disabled={(rowInfo.index > 1 && marketPriceChecked) || (!rowInfo.aloneFlag && priceOpt == 0 && spuMarketPrice)} />
                )}
              </FormItem>
            )}
          </Col>
        </Row>
      )
    });

    columns = columns.push({
      title: (
        <div>
          <FormattedMessage id="Product.Baseprice" />
          {/*<Select value={selectedBasePrice} onChange={this._handleBasePriceChange}>
            {goodsSpecs.map((item) => (item.get('specName') === sessionStorage.getItem(cache.SYSTEM_GET_WEIGHT) && item.get('specValues').size > 0 ? <Option value={item.get('mockSpecId')}>{sessionStorage.getItem(cache.SYSTEM_GET_WEIGHT)}</Option> : null))}
            <Option value={'weightValue'}>Weight value</Option>
            <Option value={'None'}>None</Option>
          </Select>*/}
        </div>
      ),
      key: 'basePrice',
      render: (rowInfo, a, b) => {
        const { goodsList, goods } = this.props.relaxProps;

        if (goodsList.toJS()[b].goodsInfoWeight != 0) {
          this._handleBasePriceChange(goodsList.toJS()[b].goodsInfoWeight);
        } else {
          this._handleBasePriceChange('None');
        }
        return (
          <Row>
            <Col span={12}>
              {goods.get('subscriptionStatus') == 1 ? (
                <FormItem style={styles.tableFormItem}>
                  {getFieldDecorator('basePrice_' + rowInfo.id, {
                    rules: [
                      {
                        pattern: ValidConst.number,
                        message: <FormattedMessage id="Product.PleaseEnterTheCorrect" />
                      }
                    ],
                    onChange: this._editGoodsItem.bind(this, rowInfo.id, 'basePrice'),
                    initialValue: rowInfo.basePrice || 0
                  })(
                    selectedBasePrice != 'None' ? (
                      <div>
                        <p>{rowInfo.basePrice ? sessionStorage.getItem('s2b-supplier@systemGetConfig:') + ' ' + rowInfo.basePrice : ''}</p>
                        <p>{rowInfo.subscriptionBasePrice ? sessionStorage.getItem('s2b-supplier@systemGetConfig:') + ' ' + rowInfo.subscriptionBasePrice : ''}</p>
                      </div>
                    ) : (
                      <p></p>
                    )
                  )}
                </FormItem>
              ) : (
                <FormItem style={styles.tableFormItem}>
                  {getFieldDecorator('basePrice_' + rowInfo.id, {
                    rules: [
                      {
                        pattern: ValidConst.number,
                        message: <FormattedMessage id="Product.PleaseEnterTheCorrect" />
                      }
                    ],
                    onChange: this._editGoodsItem.bind(this, rowInfo.id, 'basePrice'),
                    initialValue: rowInfo.basePrice || 0
                  })(
                    <div>
                      <p>{rowInfo.basePrice ? sessionStorage.getItem('s2b-supplier@systemGetConfig:') + ' ' + rowInfo.basePrice : ''}</p>
                    </div>
                  )}
                </FormItem>
              )}
            </Col>
          </Row>
        );
      }
    });
    columns = columns.push({
      title: '',
      key: 'id',
      width: '5%'
    });

    return columns.toJS();
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
        message.error(<FormattedMessage id="Product.lessThan2M" />);
        return false;
      }
    } else {
      message.error(<FormattedMessage id="Product.FileFormatError" />);
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
