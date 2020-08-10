import React from 'react';
import { Form, Alert, Select } from 'antd';
import { FindArea, cache } from 'qmkit';
const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

export default class FreightForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { freightTempId, selectTemp } = this.props.relaxProps;
    const provinceId = selectTemp.get('provinceId')
      ? selectTemp.get('provinceId').toString()
      : '';
    const cityId = selectTemp.get('cityId')
      ? selectTemp.get('cityId').toString()
      : '';
    const areaId = selectTemp.get('areaId')
      ? selectTemp.get('areaId').toString()
      : '';
    const deliveryAddress = provinceId
      ? FindArea.addressInfo(provinceId, cityId, areaId)
      : '-';
    const express = this._freightExpress();
    return (
      <Form>
        <FormItem {...formItemLayout} label="Freight template">
          <div>
            {getFieldDecorator('freightTempId', {
              initialValue: freightTempId
                ? freightTempId.toString()
                : freightTempId,
              rules: [
                { required: true, message: 'Please select shipping template' }
              ],
              onChange: this._editFreightTemp.bind(this, 'freightTempId')
            })(this._getFreightSelect())}
          </div>
          <div>
            {freightTempId && (
              <div style={{ paddingTop: 10 }}>
                <Alert
                  message={
                    <ul>
                      {(selectTemp.get('deliverWay') as number) == 1 ? (
                        <li>Express delivery</li>
                      ) : null}
                      <li>
                        Default shipping cost:{express}&nbsp;&nbsp;&nbsp;&nbsp;
                        <a
                          style={{ textDecoration: 'none' }}
                          href={`/goods-freight-edit/${freightTempId}`}
                          target="view_window"
                        >
                          See details
                        </a>
                      </li>
                      <li>Delivery place:{deliveryAddress}</li>
                    </ul>
                  }
                />
              </div>
            )}
          </div>
        </FormItem>
      </Form>
    );
  }
  /**
   * 选中模板的值
   */
  _editFreightTemp = (_key: string, e) => {
    const { setFreightTempId, setGoodsFreight } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    setFreightTempId(e);
    setGoodsFreight(e, true);
  };
  /**
   * 提示框显示转换
   */
  _freightExpress = () => {
    const { selectTempExpress } = this.props.relaxProps;
    const {
      valuationType,
      freightStartNum,
      freightStartPrice,
      freightPlusNum,
      freightPlusPrice
    } = selectTempExpress.toJS();
    let express = '';
    if ((valuationType as number) == 0) {
      express =
        // freightStartNum +
        // '件内' +
        // freightStartPrice +
        // '元，' +
        // '每增加' +
        // freightPlusNum +
        // '件，加' +
        // freightPlusPrice +
        // '元';
        `${freightStartPrice} ${sessionStorage.getItem(
          cache.SYSTEM_GET_CONFIG_NAME
        )} within ${freightStartNum} pieces, plus ${freightPlusNum} ${sessionStorage.getItem(
          cache.SYSTEM_GET_CONFIG_NAME
        )} for every additional ${freightPlusNum} pieces`;
    } else if ((valuationType as number) == 1) {
      express =
        // freightStartNum +
        // 'kg内' +
        // freightStartPrice +
        // '元，' +
        // '每增加' +
        // freightPlusNum +
        // 'kg，加' +
        // freightPlusPrice +
        // '元';
        `${freightStartPrice} ${sessionStorage.getItem(
          cache.SYSTEM_GET_CONFIG_NAME
        )} within ${freightStartNum} kg, plus ${freightPlusNum} ${sessionStorage.getItem(
          cache.SYSTEM_GET_CONFIG_NAME
        )} for every additional ${freightPlusNum} kg`;
    } else if ((valuationType as number) == 2) {
      express =
        // freightStartNum +
        // 'm³内' +
        // freightStartPrice +
        // '元，' +
        // '每增加' +
        // freightPlusNum +
        // 'm³，加' +
        // freightPlusPrice +
        // '元';
        `${freightStartPrice} ${sessionStorage.getItem(
          cache.SYSTEM_GET_CONFIG_NAME
        )} within ${freightStartNum} m³, plus ${freightPlusNum} ${sessionStorage.getItem(
          cache.SYSTEM_GET_CONFIG_NAME
        )} for every additional ${freightPlusNum} m³`;
    }
    return express;
  };
  /**
   * select选中框
   */
  _getFreightSelect = () => {
    const { freightList } = this.props.relaxProps;
    return (
      <Select
        showSearch
        placeholder="Please select a shipping template"
        notFoundContent="No shipping template"
      >
        {freightList.map((item) => {
          return (
            <Option
              key={item.get('freightTempId')}
              value={item.get('freightTempId') + ''}
            >
              {item.get('freightTempName')}
            </Option>
          );
        })}
      </Select>
    );
  };
}
