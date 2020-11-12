import * as React from 'react';
import { Relax } from 'plume2';
import { Table, Input, Row, Col, Checkbox, InputNumber, Form, Button, message, Tooltip, Icon, Select } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List } from 'immutable';
import { noop, ValidConst } from 'qmkit';
import ImageLibraryUpload from './image-library-upload';
import { FormattedMessage } from 'react-intl';
import ProductTooltip from './productTooltip';

const FormItem = Form.Item;
const { Option } = Select;
const FILE_MAX_SIZE = 2 * 1024 * 1024;

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
    editGoodsItem: noop,
    deleteGoodsInfo: noop,
    updateSkuForm: noop,
    updateChecked: noop,
    synchValue: noop,
    clickImg: noop,
    removeImg: noop,
    modalVisible: noop
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
        {this.state.visible == true ? <ProductTooltip visible={this.state.visible} showModal={this.showProduct} /> : <React.Fragment />}
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
      title: <div>Product name</div>,
      key: 'goodsName',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsName' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: 'Please input Product name code'
                    },
                    {
                      min: 1,
                      max: 20,
                      message: '1-20 characters'
                    }
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'goodsName'),
                  initialValue: rowInfo.goodsName
                })(<Input style={{ width: '115px' }} />)}
              </FormItem>
            </Col>
          </Row>
        );
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
      key: 'subSKU',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('subSKU' + rowInfo.id, {
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
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'subSKU'),
                  initialValue: rowInfo.subSKU
                })(
                  <div className="space-between-align">
                    <div style={{ paddingTop: 6 }}>
                      {' '}
                      <Icon style={{ paddingRight: 8, fontSize: '24px', color: 'red', cursor: 'pointer' }} type="plus-circle" onClick={() => this.showProduct(true)} />
                    </div>
                    <div style={{ lineHeight: 2 }}>
                      <div className="space-between-align" style={{ paddingLeft: 5 }}>
                        <span style={{ paddingLeft: 5 }}>856436788</span>
                        <Icon style={{ paddingLeft: 5, paddingRight: 5 }} type="minus" />
                        <Input style={{ width: '40px', height: '20px', textAlign: 'center' }} min={0} max={99} />
                        <Icon style={{ paddingLeft: 5 }} type="plus" />
                        <Icon style={{ fontSize: '18px', color: 'red', paddingLeft: 5 }} type="delete" />
                      </div>
                      <div className="space-between-align" style={{ paddingLeft: 5 }}>
                        <span style={{ paddingLeft: 5 }}>856436788</span>
                        <Icon style={{ paddingLeft: 5, paddingRight: 5 }} type="minus" />
                        <Input style={{ width: '40px', height: '20px', textAlign: 'center' }} min={0} max={99} />
                        <Icon style={{ paddingLeft: 5 }} type="plus" />
                        <Icon style={{ fontSize: '18px', color: 'red', paddingLeft: 5 }} type="delete" />
                      </div>
                    </div>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    /* columns = columns.push({
      title: (
        <div>
          <FormattedMessage id="product.listPrice" />
        </div>
      ),
      key: 'linePrice',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('linePrice_' + rowInfo.id, {
                rules: [
                  {
                    pattern: ValidConst.number,
                    message: '0 or positive integer'
                  }
                ],
                onChange: this._editGoodsItem.bind(
                  this,
                  rowInfo.id,
                  'linePrice'
                ),
                initialValue: rowInfo.linePrice || 0
              })(
                <InputNumber style={{ width: '60px' }} min={0} max={9999999} />
              )}
            </FormItem>
          </Col>
        </Row>
      )
    });*/
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
          UOM
        </div>
      ),
      key: 'UOM',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('UOM' + rowInfo.id, {
                onChange: (e) => this._editGoodsItem(rowInfo.id, 'UOM', e),
                initialValue: goods.get('UOM') === '0' ? '0' : typeof rowInfo.subscriptionStatus === 'number' ? rowInfo.subscriptionStatus + '' : '1'
              })(
                <Select disabled={goods.get('UOM') === '0'} getPopupContainer={() => document.getElementById('page-content')} style={{ width: '115px' }} placeholder="please select status">
                  <Option value="1">UOM1</Option>
                  <Option value="0">UOM2</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      )
    });
    /*if (goods.get('subscriptionStatus') !== '0') {
      columns = columns.push({
        title: (
          <div>
            <FormattedMessage id="product.subscriptionStatus" />
          </div>
        ),
        key: 'subscriptionStatus',
        render: (rowInfo) => (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('subscriptionStatus_' + rowInfo.id, {
                  onChange: (e) =>
                    this._editGoodsItem(rowInfo.id, 'subscriptionStatus', e),
                  initialValue:
                    goods.get('subscriptionStatus') === '0'
                      ? '0'
                      : typeof rowInfo.subscriptionStatus === 'number'
                      ? rowInfo.subscriptionStatus + ''
                      : '1'
                })(
                  <Select
                    disabled={goods.get('subscriptionStatus') === '0'}
                    getPopupContainer={() =>
                      document.getElementById('page-content')
                    }
                    style={{ width: '60px' }}
                    placeholder="please select status"
                  >
                    <Option value="1">Y</Option>
                    <Option value="0">N</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        )
      });
      /!*columns = columns.push({
        title: (
          <div>
            <FormattedMessage id="product.subscriptionPrice" />
          </div>
        ),
        key: 'subscriptionPrice',
        render: (rowInfo) => (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('subscriptionPrice_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      message: 'Please input market price'
                    },
                    {
                      pattern: ValidConst.zeroPrice,
                      message:
                        'Please input the legal amount with two decimal places'
                    },
                    {
                      type: 'number',
                      max: 9999999.99,
                      message: 'The maximum value is 9999999.99',
                      transform: function (value) {
                        return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                      }
                    }
                  ],
                  onChange: this._editGoodsItem.bind(
                    this,
                    rowInfo.id,
                    'subscriptionPrice'
                  ),
                  initialValue: rowInfo.subscriptionPrice || 0
                })(
                  <Input
                    style={{ width: '60px' }}
                    min={0}
                    max={9999999}
                    disabled={rowInfo.subscriptionStatus === 0}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        )
      });*!/
    }*/
    /*columns = columns.push({
      title: (
        <div>
          <FormattedMessage id="Base price" />
          <Select value={baseSpecId || null} onChange={this._handleChange}>
            {goodsSpecs.map((item) => (
              <Option value={item.get('specId')}>{item.get('specName')}</Option>
            ))}
          </Select>
        </div>
      ),
      key: 'basePrice',
      render: (rowInfo) => {
        console.log(rowInfo, 'rowInfo');
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('basePrice_' + rowInfo.id, {
                  rules: [
                    {
                      pattern: ValidConst.number,
                      message: '0 or positive integer'
                    }
                  ],
                  onChange: this._editGoodsItem.bind(
                    this,
                    rowInfo.id,
                    'basePrice'
                  ),
                  initialValue: rowInfo.basePrice || 0
                })(
                  <div>
                    <p>
                      {isNaN(
                        parseFloat(rowInfo.marketPrice) /
                          parseFloat(rowInfo['specId-' + baseSpecId])
                      )
                        ? '0'
                        : (
                            parseFloat(rowInfo.marketPrice) /
                            parseFloat(rowInfo['specId-' + baseSpecId])
                          ).toFixed(2)}
                    </p>
                    <p>
                      {isNaN(
                        parseFloat(rowInfo.subscriptionPrice) /
                          parseFloat(rowInfo['specId-' + baseSpecId])
                      )
                        ? '0'
                        : (
                            parseFloat(rowInfo.subscriptionPrice) /
                            parseFloat(rowInfo['specId-' + baseSpecId])
                          ).toFixed(2)}
                    </p>
                    {/!* <InputNumber
                    style={{ width: '60px' }}
                    min={0}
                    max={9999999}
                    disabled
                  />
                  <InputNumber
                    style={{ width: '60px' }}
                    min={0}
                    max={9999999}
                    disabled={rowInfo.subscriptionStatus === 0}
                  /> *!/}
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });*/

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
              })(<Input style={{ width: '100px' }} min={0} max={9999999} disabled={rowInfo.description === 0} />)}
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
        </div>
      ),
      key: 'subscription',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('subscription' + rowInfo.id, {
                rules: [],
                onChange: this._editGoodsItem.bind(this, rowInfo.id, 'subscription'),
                initialValue: rowInfo.subscription
              })(<Input style={{ width: '100px' }} min={0} max={9999999} disabled={rowInfo.subscription === 0} />)}
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
          Tax Rate
          <br />
          <Checkbox checked={stockChecked} onChange={(e) => this._synchValue(e, 'taxRate')}>
            <FormattedMessage id="allTheSame" />
            &nbsp;
            <Tooltip placement="top" title={'After checking, all SKUs use the same inventory'}>
              <a style={{ fontSize: 14 }}>
                <Icon type="question-circle-o" />
              </a>
            </Tooltip>
          </Checkbox>
        </div>
      ),
      key: 'taxRate',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('taxRate' + rowInfo.id, {
                rules: [
                  {
                    pattern: ValidConst.number,
                    message: '0 or positive integer'
                  }
                ],
                onChange: this._editGoodsItem.bind(this, rowInfo.id, 'taxRate'),
                initialValue: rowInfo.taxRate
              })(<InputNumber style={{ width: '60px' }} min={0} max={9999999} disabled={rowInfo.index > 1 && stockChecked} />)}
            </FormItem>
          </Col>
        </Row>
      )
    });
    // columns = columns.push({
    //   title: '条形码',
    //   key: 'goodsInfoBarcode',
    //   render: (rowInfo) => (
    //     <Row>
    //       <Col span={12}>
    //         <FormItem style={styles.tableFormItem}>
    //           {getFieldDecorator('goodsInfoBarcode_' + rowInfo.id, {
    //             rules: [
    //               {
    //                 max: 20,
    //                 message: '0-20字符'
    //               }
    //             ],
    //             onChange: this._editGoodsItem.bind(
    //               this,
    //               rowInfo.id,
    //               'goodsInfoBarcode'
    //             ),
    //             initialValue: rowInfo.goodsInfoBarcode
    //           })(<Input />)}
    //         </FormItem>
    //       </Col>
    //     </Row>
    //   )
    // });

    columns = columns.push({
      // title: <FormattedMessage id="operation" />,
      key: 'opt',
      render: (rowInfo) =>
        specSingleFlag ? null : (
          // <Button onClick={() => this._deleteGoodsInfo(rowInfo.id)}>
          //   <FormattedMessage id="delete" />
          // </Button>
          <a
            href="#!"
            onClick={() => {
              this._deleteGoodsInfo(rowInfo.id);
            }}
            title="Delete"
            style={{ marginRight: 5 }}
          >
            <span className="icon iconfont iconDelete" style={{ fontSize: 20 }}></span>
          </a>
        )
    });

    return columns.toJS();
  };
  _handleChange = (value) => {
    sessionStorage.setItem('baseSpecId', value);
    this._editGoodsItem(null, 'baseSpecId', value);
    console.log(`selected ${value}`);
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

// import { Table } from 'antd';

// const columns = [
//   {
//     title: 'Name',
//     dataIndex: 'name',
//   },
//   {
//     title: 'Age',
//     dataIndex: 'age',
//   },
//   {
//     title: 'Address',
//     dataIndex: 'address',
//   },
// ];
// const data = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//   },
//   {
//     key: '2',
//     name: 'Jim Green',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sidney No. 1 Lake Park',
//   },
// ];

// ReactDOM.render(
//   <div>
//     <h4>Middle size table</h4>
//     <Table columns={columns} dataSource={data} size="middle" />
//     <h4>Small size table</h4>
//     <Table columns={columns} dataSource={data} size="small" />
//   </div>,
//   mountNode,
// );
