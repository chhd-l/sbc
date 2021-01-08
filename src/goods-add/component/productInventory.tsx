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
export default class ProductInventory extends React.Component<any, any> {
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

  render() {
    const { goodsList } = this.props.relaxProps;
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
    const { goodsSpecs, addSkUProduct, specSingleFlag, baseSpecId } = this.props.relaxProps;

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
      title: '',
      key: 'index',
      render: (_text, _rowInfo, index) => {
        return index + 1;
      }
    });

    columns = columns.push({
      title: <FormattedMessage id="product.SKU" />,
      key: 'goodsInfoNo',
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
          <FormattedMessage id="product.inventory" />
        </div>
      ),
      key: 'stock',
      render: (rowInfo) => {
        let a = null;
        let b = null;
        let c = 0;
        a = (addSkUProduct && addSkUProduct.filter((i) => i.pid == rowInfo.goodsInfoNo)[0]) || null;
        c = a.minStock - rowInfo.maxStock >= 0 ? rowInfo.stock : a.minStock;
        if (a) {
          b = a.minStock - rowInfo.maxStock >= 0 ? a.minStock : rowInfo.maxStock;
        } else {
          b = 999999;
        }
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('stock_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      message: 'Please input inventory'
                    },
                    {
                      pattern: ValidConst.number,
                      message: 'Please enter the correct value'
                    }
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'stock'),
                  initialValue: c
                })(<InputNumber style={{ width: '121px' }} min={0} max={b} />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: 'UOM',
      key: 'goodsMeasureUnit',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsMeasureUnit_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: 'Please input UOM'
                    }
                  ],
                  onChange: this._editGoodsItem.bind(this, rowInfo.id, 'goodsMeasureUnit'),
                  initialValue: rowInfo.goodsMeasureUnit
                })(<Input style={{ width: '115px' }} />)}
              </FormItem>
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
