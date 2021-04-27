import * as React from 'react';
import { Relax } from 'plume2';
import { Table, Input, Row, Col, Checkbox, InputNumber, Form, Button, message, Tooltip, Icon, Select } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List, Map } from 'immutable';
import { noop, ValidConst, cache } from 'qmkit';
import ImageLibraryUpload from './image-library-upload';
import { FormattedMessage } from 'react-intl';
import ProductTooltipSKU from './productTooltip-sku';
import * as _ from 'lodash';
import { RCi18n } from 'qmkit';
const FormItem = Form.Item;
const { Option } = Select;
const FILE_MAX_SIZE = 2 * 1024 * 1024;
const { TextArea } = Input;
@Relax
export default class SkuTable extends React.Component<any, any> {
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(SkuForm);
    this.state = {
      visible: false,
      EANList: [],
      goodsInfoNo: [],
      specType: false,
    };
  }

  props: {
    relaxProps?: {
      goodsSpecs: IList;
      goodsList: IList;
      stockChecked: boolean;
      marketPriceChecked: boolean;
      specSingleFlag: boolean;
      spuMarketPrice: number;
      priceOpt: number;
      initStoreCateList: any;
      goodsInfos: any;
      addSkUProduct: any;
      goodsId: any;
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
      onProductselectSku: Function;
      onEditSubSkuItem: Function;
      editGoods: Function;
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
    initStoreCateList: 'initStoreCateList',
    goodsInfos: 'goodsInfos',
    goodsId: 'goodsId',
    editGoods: noop,
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
      visible: false,
      pid: '',
      id: ''
    };
  }

  /*static getDerivedStateFromProps(nextProps, prevState) {
    const { goodsList } = nextProps.relaxProps;
    // 当传入的type发生变化的时候，更新state
    goodsList.toJS().map((item,)=>{

      if (item.goodsInfoNo !== prevState.goodsInfoNo) {
        console.log(item.goodsInfoNo,1111);

        return {


        };
      }
    })


    // 否则，对于state不进行任何操作
    return null;
  }*/


  render() {
    const { goodsList, onProductselectSku, addSkUProduct, goodsId } = this.props.relaxProps;

    if (goodsId == undefined && this.state.specType == false) {
      if ( goodsList.toJS().length == 0 ) {
        let a = []
        onProductselectSku(a)
      }else {
        if (addSkUProduct.length>0) {
          //let b = goodsList.toJS().filter((item, i)=>item.goodsInfoNo == addSkUProduct.map(o=>{ return o.pid}))
          let b = addSkUProduct.filter(i => goodsList.toJS().some(j => j.goodsInfoNo === i.pid))
          onProductselectSku(b)
        }
      }
    }


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
        {this.state.visible == true ? <ProductTooltipSKU id={this.state.id} pid={this.state.pid} visible={this.state.visible} showModal={this.showProduct} /> : <React.Fragment />}
        <Form>
          <Table size="small" rowKey="id" dataSource={goodsList.toJS()} columns={columns} pagination={false} />
        </Form>
      </div>
    );
  }

  showProduct = (res, e, id) => {
    let type = res.type == 1 ? true : false;
    if (e) {
      this.setState({
        pid: e,
        id: id
      });
    }
    this.setState({
      visible: type
    });
  };

  addEAN = (res, e) => {
    let EANList = [];
    this.setState({
      EANList: EANList
    });
  };

  edit = (e) => {}
  _getColumns = () => {
    const { getFieldDecorator } = this.props.form;
    const { goodsSpecs, goodsList, stockChecked, marketPriceChecked, modalVisible, clickImg, removeImg, specSingleFlag, spuMarketPrice, priceOpt, goods, baseSpecId } = this.props.relaxProps;

    let columns: any = List();

    // 未开启规格时，不需要展示默认规格
    if (!specSingleFlag) {
      columns = goodsSpecs
        .map((item) => {
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
    }
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
        const { addSkUProduct } = this.props.relaxProps;

        let a = '';

        if (rowInfo.goodsInfoNo == '') {
          a = addSkUProduct[rowInfo.index - 1] ? addSkUProduct[rowInfo.index - 1].pid : '';
        } else {
          a = rowInfo.goodsInfoNo;
        }

        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoNo_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: RCi18n({id:'Product.PleaseInputSKU'})
                    },
                    {
                      min: 1,
                      max: 20,
                      message: RCi18n({id:'Product.Characters'})
                    }
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'goodsInfoNo'),
                  initialValue: a
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
          <p><FormattedMessage id="Product.SubSKU" /></p>
          <p style={{ fontSize: '12px', color: '#ccc' }}><FormattedMessage id="Product.MaximumProducts" /></p>
        </div>
      ),
      key: 'goodsInfoBundleRels',
      render: (rowInfo) => {
        const { addSkUProduct } = this.props.relaxProps;
        return (
          <Row>
            <Col span={16}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoBundleRels' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: RCi18n({id:'Product.PleaseInputSKU'})
                    },
                    {
                      pattern: ValidConst.number,
                      message: RCi18n({id:'Product.positiveInteger'})
                    }
                  ]
                })(
                  <div className="space-between-align">
                    <div style={{ paddingTop: 6 }}>
                      {' '}
                      <Icon style={{ paddingRight: 8, fontSize: '24px', color: 'red', cursor: 'pointer' }} type="plus-circle" onClick={(e) => this.showProduct({ type: 1 }, rowInfo.goodsInfoNo, rowInfo.id )} />
                    </div>
                    <div style={{ lineHeight: 2 }}>
                      {addSkUProduct &&
                      addSkUProduct.map((i, index) => {
                        return (
                          i.pid == rowInfo.goodsInfoNo &&
                          i.targetGoodsIds.map((item, index) => {
                            return (
                              <div className="space-between-align" key={item.subGoodsInfoNo} style={{ paddingLeft: 5 }}>
                                <span style={{ paddingLeft: 5, paddingRight: 5 }}>{item.subGoodsInfoNo}</span>
                                <InputNumber
                                  style={{ width: '60px', height: '28px', textAlign: 'center' }}
                                  defaultValue={item.bundleNum}
                                  key={item.subGoodsInfoNo}
                                  min={1}
                                  onChange={(e) => {
                                    if (i.pid == rowInfo.goodsInfoNo) {
                                      const target = i.targetGoodsIds.filter((a, o) => item.subGoodsInfoNo === a.subGoodsInfoNo)[0];
                                      if (target) {
                                        target['bundleNum'] = e;
                                      }
                                      let res = _.unionBy([target], i.targetGoodsIds, 'subGoodsInfoId');
                                      this._editGoodsItem(rowInfo.id, 'goodsInfoBundleRels', res);
                                    }
                                  }}
                                  onFocus={() => this.onfocus()}
                                  onBlur={() => this.onblur()}
                                />
                                <a style={{ paddingLeft: 5 }} className="iconfont iconDelete" onClick={() => this.onDel(item, i.pid, rowInfo.id)}></a>
                              </div>
                            );
                          })
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

    //External SKU
    columns = columns.push({
      title: <FormattedMessage id="Product.ExternalSKU" />,
      key: 'externalSku',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('externalSku' + rowInfo.id, {
                  rules: [
                    /*{
                      required: true,
                      message: 'Please input EAN code'
                    },*/
                    /*{
                      pattern: ValidConst.noMinus,
                      message: 'Please enter the correct value'
                    }*/
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'externalSku'),
                  initialValue: rowInfo.externalSku
                })(<Input style={{ width: '116px' }} maxLength={45} onFocus={() => this.onfocus()} onBlur={() => this.onblur()} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    //EAN
    columns = columns.push({
      title: <FormattedMessage id="Product.EAN" />,
      key: 'goodsInfoBarcode',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoBarcode' + rowInfo.id, {
                  rules: [
                    /*{
                      required: true,
                      message: 'Please input EAN code'
                    },*/
                    /*{
                      pattern: ValidConst.noMinus,
                      message: 'Please enter the correct value'
                    }*/
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'goodsInfoBarcode'),
                  initialValue: rowInfo.goodsInfoBarcode
                })(<Input style={{ width: '116px' }} onFocus={() => this.onfocus()} onBlur={() => this.onblur()} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: <FormattedMessage id="Product.Weightvalue" />,
      key: 'goodsInfoWeight',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoWeight' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      message: RCi18n({id:'Product.Inputweightvalue'})
                    }
                    /*{
                      pattern: ValidConst.noMinus,
                      message: 'Please enter the correct value'
                    }*/
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'goodsInfoWeight'),
                  initialValue: rowInfo.goodsInfoWeight || 0
                })(<Input type="number" style={{ width: '121px' }} min={0} onFocus={() => this.onfocus()} onBlur={() => this.onblur()} onKeyUp={(e) => this.noMinus(e)} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: <FormattedMessage id="Product.Weightunit" />,
      key: 'goodsInfoUnit',
      render: (rowInfo) => {
        return (
          // <Select onChange = {(e) => this._editGoodsItem(rowInfo.id, 'goodsInfoUnit', e)}>
          //   <Option value="kg">kg</Option>
          //   <Option value="g">g</Option>
          //   <Option value="lb">lb</Option>
          // </Select>
         /* <select className="ant-input" value={rowInfo.goodsInfoUnit}  onChange = {(e) => this._editGoodsItem(rowInfo.id, 'goodsInfoUnit', e)}>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="lb">lb</option>
          </select>*/

         /* <Row>
            <Col span={6}>
              <Select defaultValue={rowInfo.goodsInfoUnit ? rowInfo.goodsInfoUnit : 'kg'}
                      value={rowInfo.goodsInfoUnit}
                      onChange = {(e) => this._editGoodsItem(rowInfo.id, 'goodsInfoUnit', e)}
                      getPopupContainer={() => document.getElementById('page-content')} style={{ width: '81px' }} >
                <Option value="kg">kg</Option>
                <Option value="g">g</Option>
                <Option value="lb">lb</Option>
              </Select>


            </Col>
          </Row>*/
          <Row>
            <Col span={6}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoUnit' + rowInfo.id, {
                  onChange: (e) => this._editGoodsItem(rowInfo.id, 'goodsInfoUnit', e),
                  initialValue: rowInfo.goodsInfoUnit ? rowInfo.goodsInfoUnit : 'kg'
                })(
                  <Select getPopupContainer={() => document.getElementById('page-content')} style={{ width: '81px' }}
                  onFocus={() => this.onfocus()} onBlur={() => this.onblur()}>
                    <Option value="kg">kg</Option>
                    <Option value="g">g</Option>
                    <Option value="lb">lb</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    /*columns = columns.push({
      title: 'Pack size',
      key: 'packSize',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('packSize_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: 'Please input packSize code'
                    },
                    {
                      min: 1,
                      max: 20,
                      message: '1-20 characters'
                    }
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'packSize'),
                  initialValue: rowInfo.packSize
                })(<Input style={{ width: '115px' }} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });*/

    columns = columns.push({
      title: (
        <div>
         <FormattedMessage id="Product.Subscription" />
        </div>
      ),
      key: 'subscriptionStatus',
      render: (rowInfo) => {

        // goods.get('subscriptionStatus') == 0?rowInfo.subscriptionStatus = '0' : rowInfo.subscriptionStatus!=null?rowInfo.subscriptionStatus:rowInfo.subscriptionStatus = '1'
        rowInfo.subscriptionStatus = goods.get('subscriptionStatus') == 0 ? '0' : rowInfo.subscriptionStatus != null ? rowInfo.subscriptionStatus : '1';

        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('subscriptionStatus_' + rowInfo.id, {
                  onChange: (e) => this._editGoodsItem(rowInfo.id, 'subscriptionStatus', Number(e)),
                  initialValue: rowInfo.subscriptionStatus == 0 ? '0' : '1'
                })(
                  <Select disabled={goods.get('subscriptionStatus') == 0 ? true : false || goodsList.toJS().length == 1? true : false }
                          getPopupContainer={() => document.getElementById('page-content')}
                          style={{ width: '81px' }}
                          placeholder="please select status"
                          onFocus={() => this.onfocus()}
                          onBlur={() => this.onblur()}
                  >
                    <Option value="1">Y</Option>
                    <Option value="0">N</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });


    columns = columns.push({
      title:
        <div>
         <FormattedMessage id="Product.subscriptionType"/>
        </div>
      ,
      key: 'promotions',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12} key={goods.get('promotions')}>
              <FormItem style={styles.tableFormItem}>
                <Select  onChange={ (e) => this._editGoodsItem(rowInfo.id, 'promotions', e)}
                         style={{ width: 100 }}
                         defaultValue={rowInfo.promotions}
                         getPopupContainer={() => document.getElementById('page-content')}
                         placeholder={<FormattedMessage id="Product.selectType" />}
                         disabled={goods.get('promotions') == 'autoship'}
                         onFocus={() => this.onfocus()}
                         onBlur={() => this.onblur()}
                >
                  <Option value='autoship'><FormattedMessage id="Product.Auto ship" /></Option>
                  <Option value='club'><FormattedMessage id="Product.Club" /></Option>
                </Select>

              </FormItem>
            </Col>
            {/*<Col span={12} key={goods.get('promotions')}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('promotions' + rowInfo.id, {
                  onChange: (e) => this._editGoodsItem(rowInfo.id, 'promotions', e),
                  initialValue: rowInfo.promotions
                })(
                  <Select style={{ width: 100 }}  getPopupContainer={() => document.getElementById('page-content')}  placeholder="please select type" disabled={goods.get('promotions') == 'autoship'} >
                    <Option value='club'>Club</Option>
                    <Option value='autoship'>Auto ship</Option>
                  </Select>
                )}

              </FormItem>
            </Col>*/}
          </Row>
        );
      }
    });

    columns = columns.push({
      title: (
        <div style={{marginRight: '81px'}}><FormattedMessage id="Product.On/Off shelves" /></div>
      ),
      key: 'addedFlag',
      render: (rowInfo) => {

        return (
          <Col span={8}>
            <FormItem style={styles.tableFormItem}>
              {goodsList.toJS().length == 1 ? ( <div>
                <span className="icon iconfont iconOffShelves" style={{ fontSize: 20, color: "#cccccc" }}></span>
              </div> ) : (<>
                  {goods.get('addedFlag') == 0 ? ( <span className="icon iconfont iconOnShelves" style={{ fontSize: 20, color: "#cccccc" }}></span>) : (
                    <>
                      {rowInfo.addedFlag == 1 ? (
                        <div onClick={() => this._editGoodsItem(rowInfo.id, 'addedFlag', 0)}>
                          <span className="icon iconfont iconOffShelves" style={{ fontSize: 20, color: "#E1021A" }}></span>
                        </div>
                      ) : null}
                      {rowInfo.addedFlag == 0? (
                        <div onClick={() => this._editGoodsItem(rowInfo.id, 'addedFlag', 1)}>
                          <span className="icon iconfont iconOnShelves" style={{ fontSize: 20, color: "#E1021A" }}></span>
                        </div>
                      ) : null}</>)}
                </>
              )}
            </FormItem>
          </Col>
        );
      }
    });

    /*columns = columns.push({
      title: (
        <div>

        </div>
      ),
      key: 'subscriptionStatus',
      render: (rowInfo) => (
        <Row>
        </Row>
      )
    });*/
    /*let a = columns.toJS()
    let b = a.splice(a.length-5,1)
    a.splice(3,0,b[0])*/
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

  _getSubSkulist = (id: string) => {
    const { addSkUProduct } = this.props.relaxProps;
    if (addSkUProduct) {
      addSkUProduct.map((item) => {
        return <div>{item.goodsInfoNo}</div>;
      });
    }
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
  _editGoodsItem = (id: string, key: string, e: any) => {
    const { editGoodsItem, synchValue, editGoods, goodsList, addSkUProduct } = this.props.relaxProps;
    const checked = this.props.relaxProps[`${key}Checked`];
    if (e && e.target) {
      e = e.target.value;
    }


    if (key == "goodsInfoBundleRels") {
      let minStock = []
      for (let i = 0; i<e.length; i++) {
        minStock.push(e[i].subStock / e[i].bundleNum)
      }

      let tempMinStock = Math.min.apply(Math, minStock)
      tempMinStock = Number(String(tempMinStock).replace(/\.\d+/g, ''))

      if (goodsList.toJS().length == 1 && addSkUProduct.length == 1 && addSkUProduct[0].targetGoodsIds.length == 1) {
        let id = goodsList.toJS()[0].id

        let marketPrice = addSkUProduct[0].targetGoodsIds[0].marketPrice * addSkUProduct[0].targetGoodsIds[0].bundleNum
        let subscriptionPrice = addSkUProduct[0].targetGoodsIds[0].subscriptionPrice * addSkUProduct[0].targetGoodsIds[0].bundleNum
        editGoodsItem(id, key, e);
        editGoodsItem(id, 'marketPrice', marketPrice);
        editGoodsItem(id, 'subscriptionPrice', subscriptionPrice);
      }
      editGoodsItem(id, 'stock', tempMinStock);
    }else {
      editGoodsItem(id, key, e);
    }


    if(key == "addedFlag") {
      if(goodsList.toJS().length >1) {
        let goods = Map({
          ['addedFlag']: fromJS(2)
        });
        editGoods(goods);
      }
    }

    if (key == 'promotions' || key == 'goodsInfoBundleRels' ) {
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

  onDel = (item, pid, id) => {
    const { addSkUProduct, onProductselectSku, goodsList, editGoodsItem } = this.props.relaxProps;
    let a = [];
    let b = [];
    let c = [];
    let minStock = []
    let tempMinStock = 0
    addSkUProduct.map((i) => {
      if (i.pid == pid) {
        i.targetGoodsIds.map((o) => {
          if (o.subGoodsInfoNo !== item.subGoodsInfoNo) {
            a.push(o);
            minStock.push(o.subStock / o.bundleNum)
          }
        });
        if (minStock.length != 0) {
          tempMinStock = Math.min.apply(Math, minStock)
          tempMinStock = Number(String(tempMinStock).replace(/\.\d+/g, ''))
        }else {
          tempMinStock = 0
        }
        b.push({
          pid: pid,
          targetGoodsIds: a,
          mStock: tempMinStock
        });

      } else {
        c.push(i);
      }
    });
    goodsList.toJS().map((item,i)=>{
      if (i == 0) {
        if(goodsList.toJS().length == 1 && a.length == 1) {
          editGoodsItem(item.id, 'marketPrice', a[0].marketPrice);
          editGoodsItem(item.id, 'subscriptionPrice', a[0].subscriptionPrice);
        }else {
          editGoodsItem(item.id, 'marketPrice', item.marketPrice);
          editGoodsItem(item.id, 'subscriptionPrice', item.subscriptionPrice);
        }
      }else {
        editGoodsItem(item.id, 'marketPrice', item.marketPrice);
        editGoodsItem(item.id, 'subscriptionPrice', item.subscriptionPrice);
      }
    })

    editGoodsItem(id, 'stock', tempMinStock);
    editGoodsItem(id, 'goodsInfoBundleRels', a);

    let d = b.concat(c);

    let e = d.filter(i => goodsList.toJS().some(j => j.goodsInfoNo === i.pid))

    if (e.length == 1 && e[0].targetGoodsIds.length == 0) {
      e = []
    }else {
      e = d
    }
    onProductselectSku(e);
  };

  noMinus = (e) => {
    let val = e.target.value;
    if (val.indexOf('.') != -1) {
      let str = val.substr(val.indexOf('.') + 1);
      if (str.indexOf('.') != -1) {
        val = val.substr(0, val.indexOf('.') + str.indexOf('.') + 1);
      }
    }
    e.target.value = val.replace(/[^\d^\.]+/g, '');
  };


  getArrDifference = (arr1, arr2) => {
    return arr1.concat(arr2).filter(function(v, i, arr) {
      return arr.indexOf(v) === arr.lastIndexOf(v);
    });
  }

  onfocus = () => {
    this.setState({
      specType: true
    })
  }

  onblur = () => {
    this.setState({
      specType: false
    })
  }

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
