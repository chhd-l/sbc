import * as React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Select, Row, Col, Alert } from 'antd';
import { noop, FindArea } from 'qmkit';
import { IMap, IList } from 'typings/globalType';
import { Map, fromJS } from 'immutable';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const { Option } = Select;
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

@Relax
export default class Logistics extends React.Component<any, any> {
  WrapperForm: any;
  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(LogisticsForm);
  }
  props: {
    relaxProps?: {
      updateLogisticsForm: Function;
      goods: IMap;
      editGoods: Function;
      freightList: IList;
      selectTempExpress: IMap;
      selectTemp: IMap;
      setGoodsFreight: Function;
    };
  };
  static relaxProps = {
    updateLogisticsForm: noop,
    goods: 'goods',
    editGoods: noop,
    freightList: 'freightList',
    selectTempExpress: 'selectTempExpress',
    selectTemp: 'selectTemp',
    setGoodsFreight: noop
  };
  render() {
    const WrapperForm = this.WrapperForm;
    return (
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
          <FormattedMessage id="product.logisticsInformation" />
        </div>
        <div>
          <WrapperForm
            ref={(form) => (this['_form'] = form)}
            //ref={(form) => updateLogisticsForm(form)}
            {...{ relaxProps: this.props.relaxProps }}
          />
        </div>
      </div>
    );
  }
}

class LogisticsForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { updateLogisticsForm } = this.props.relaxProps;
    updateLogisticsForm(this.props.form);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { goods, selectTemp, freightList } = this.props.relaxProps;
    const provinceId = selectTemp.get('provinceId') ? selectTemp.get('provinceId').toString() : '';
    const cityId = selectTemp.get('cityId') ? selectTemp.get('cityId').toString() : '';
    const areaId = selectTemp.get('areaId') ? selectTemp.get('areaId').toString() : '';
    const deliveryAddress = provinceId ? FindArea.addressInfo(provinceId, cityId, areaId) : '-';
    const express = this._freightExpress();
    let freightExists = false;
    if (goods.get('freightTempId') != null) {
      freightList.map((item) => {
        if (item.get('freightTempId') + '' == goods.get('freightTempId').toString()) {
          freightExists = true;
        }
      });
    }
    return (
      <Form>
        <Row type="flex" justify="start" gutter={16}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="product.shippinTemplate" />}>
              <div>
                {getFieldDecorator(
                  'freightTempId',
                  freightExists
                    ? {
                        rules: [
                          {
                            required: true,
                            message: 'Please select shipping template'
                          }
                        ],
                        onChange: this._editGoods.bind(this, 'freightTempId'),
                        initialValue: goods.get('freightTempId').toString()
                      }
                    : {
                        rules: [
                          {
                            required: true,
                            message: 'Please select shipping template'
                          }
                        ],
                        onChange: this._editGoods.bind(this, 'freightTempId')
                      }
                )(this._getFreightSelect())}
              </div>
              {/* <div>
                {  
                goods.get('freightTempId') && (
                  <div style={{ paddingTop: 10 }}>
                    <Alert
                      message={
                        <ul>
                          {(selectTemp.get('deliverWay') as number) == 1 ? (
                            <li>????????????</li>
                          ) : null}
                          <li>
                            ???????????????{express}&nbsp;&nbsp;&nbsp;&nbsp;
                            <a
                              style={{ textDecoration: 'none' }}
                              href={`/goods-freight-edit/${goods.get(
                                'freightTempId'
                              )}`}
                              target="view_window"
                            >
                              ????????????
                            </a>
                          </li>
                          <li>????????????{deliveryAddress}</li>
                        </ul>
                      }
                    />
                  </div>
                )}
              </div> */}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start" gutter={16}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="product.logisticsWeight" />}>
              {getFieldDecorator('goodsWeight', {
                rules: [
                  {
                    required: true,
                    message: 'Please input logistics weight'
                  },
                  {
                    pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,3})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9]{1,2})?$)/,
                    message: 'Please input the legal number with three decimal places'
                  },
                  {
                    type: 'number',
                    min: 0.001,
                    message: 'The minimum value is 0.001',
                    transform: function (value) {
                      return isNaN(parseFloat(value)) ? 0.001 : parseFloat(value);
                    }
                  },
                  {
                    type: 'number',
                    max: 9999.999,
                    message: 'The maximum value is 9999.999',
                    transform: function (value) {
                      return isNaN(parseFloat(value)) ? 0.001 : parseFloat(value);
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsWeight'),
                initialValue: goods.get('goodsWeight') && goods.get('goodsWeight').toString()
              })(<Input placeholder="Not less than 0.001" />)}
            </FormItem>
          </Col>
          <Col span={2}>
            <div style={{ padding: 10 }}>kg</div>
          </Col>
        </Row>
        <Row type="flex" justify="start" gutter={16}>
          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="product.logisticsVolumn" />}>
              {getFieldDecorator('goodsCubage', {
                rules: [
                  {
                    required: true,
                    message: 'Please input logistics volume'
                  },
                  {
                    pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,6})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9]{1,5})?$)/,
                    message: 'Please input the legal number of six decimal places'
                  },
                  {
                    type: 'number',
                    min: 0.000001,
                    message: 'The minimum value is 0.000001',
                    transform: function (value) {
                      return isNaN(parseFloat(value)) ? 0.000001 : parseFloat(value);
                    }
                  },
                  {
                    type: 'number',
                    max: 999.999999,
                    message: 'The maximum value is 999.999999',
                    transform: function (value) {
                      return isNaN(parseFloat(value)) ? 0.000001 : parseFloat(value);
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'goodsCubage'),
                initialValue: goods.get('goodsCubage') && goods.get('goodsCubage').toString()
              })(<Input placeholder="Not less than 0.000001" />)}
            </FormItem>
          </Col>
          <Col span={2}>
            <div style={{ padding: 10 }}>m??</div>
          </Col>
        </Row>
      </Form>
    );
  }
  /**
   * spu????????????
   */
  _editGoods = (key: string, e) => {
    const { editGoods, setGoodsFreight, updateLogisticsForm } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    let goods = Map({
      [key]: fromJS(e)
    });
    if (key === 'freightTempId') {
      setGoodsFreight(e, true);
    }
    updateLogisticsForm(this.props.form);
    editGoods(goods);
  };
  /**
   * ??????????????????????????????
   */
  _freightExpress = () => {
    const { selectTempExpress } = this.props.relaxProps;
    const { valuationType, freightStartNum, freightStartPrice, freightPlusNum, freightPlusPrice } = selectTempExpress.toJS();
    let express = '';
    if ((valuationType as number) == 0) {
      express = freightStartNum + '??????' + freightStartPrice + '??????' + '?????????' + freightPlusNum + '?????????' + freightPlusPrice + '???';
    } else if ((valuationType as number) == 1) {
      express = freightStartNum + 'kg???' + freightStartPrice + '??????' + '?????????' + freightPlusNum + 'kg??????' + freightPlusPrice + '???';
    } else if ((valuationType as number) == 2) {
      express = freightStartNum + 'm?????' + freightStartPrice + '??????' + '?????????' + freightPlusNum + 'm????????' + freightPlusPrice + '???';
    }
    return express;
  };
  /**
   * select?????????
   */
  _getFreightSelect = () => {
    const { freightList } = this.props.relaxProps;
    return (
      <Select showSearch getPopupContainer={() => document.getElementById('page-content')} placeholder="Please select a shipping template" notFoundContent="No shipping template">
        {freightList.map((item) => {
          return (
            <Option key={item.get('freightTempId')} value={item.get('freightTempId') + ''}>
              {item.get('freightTempName')}
            </Option>
          );
        })}
      </Select>
    );
  };
}
