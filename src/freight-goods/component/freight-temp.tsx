import React from 'react';
import {
  goodsFreeSaveRequestsQL,
  goodsExpressSaveRequestsQL,
  goodsExpressFormQL,
  goodsFreeFormQL
} from '../ql';

import {
  Form,
  Input,
  Radio,
  TreeSelect,
  Button,
  Table,
  Checkbox,
  Icon,
  Select,
  Modal
} from 'antd';
import {
  QMMethod,
  FindArea,
  ValidConst,
  AreaSelect,
  noop,
  history
} from 'qmkit';
import { fromJS } from 'immutable';
import styled from 'styled-components';
const FormDiv = styled.div`
  .ant-table-content {
    .ant-row {
      margin-bottom: 0;
      input {
        text-align: center;
      }
    }
  }
  .ant-radio-group {
    .radio-item {
      margin-bottom: 5px;
    }
    .ant-row {
      display: inline-block;
      margin-bottom: 0;
      .has-error {
        margin-bottom: 13px;
        .ant-form-explain,
        .show-help-leave,
        .show-help-enter {
          position: absolute;
          width: 200px;
        }
      }
      .has-success {
        .ant-form-explain,
        .show-help-leave,
        .show-help-enter {
          position: absolute;
          width: 200px;
        }
      }
    }
  }
  .pl3 {
    padding-left: 3px;
  }
  .pr3 {
    padding-right: 3px;
  }
  .set-condition {
    .moreForeItem {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .has-error {
      .ant-form-explain,
      .show-help-leave,
      .show-help-enter {
        position: absolute;
        width: 300px;
        text-align: left;
      }
    }
    .has-success {
      .ant-form-explain,
      .show-help-leave,
      .show-help-enter {
        position: absolute;
        width: 300px;
        text-align: left;
      }
    }
  }
  .areaBox {
    .ant-cascader-picker {
      width: 350px;
    }
  }
  .treeSelectBox {
    .ant-row {
      width: 100%;
      .ant-select {
        width: 100%;
      }
    }
  }
`;
const InlineBDiv = styled.div`
  display: inline-block;
`;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const Confirm = Modal.confirm;

const FREIGHT_TEMP = {
  //0: { unit: '件', label: '件', options: '件数' },
  //1: { unit: 'kg', label: '重', options: '重量' },
  //2: { unit: 'm³', label: '体积', options: '体积' }
  0: { unit: 'item', label: 'quantity', options: 'quatity' },
  1: { unit: 'kg', label: 'weight', options: 'weight' },
  2: { unit: 'm³', label: 'volume', options: 'volume' }
};

const PLACE_HOLDER = {
  0: { unit: '1-9999', money: '0.00-9999.99' },
  1: { unit: '0.1-9999.9', money: '0.00-9999.99' },
  2: { unit: '0.1-999.9', money: '0.00-9999.99' }
};

/**
 * 运费模板
 */

export default class FreightTemp extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      // 运费模板名称
      freightTempName: string;
      // 省份Id
      provinceId: number;
      // 城市Id
      cityId: number;
      // 区域Id
      areaId: number;
      // 是否包邮
      freightFreeFlag: number;
      // 计价方式(0: 按件数,1: 按重量,2: 按体积)
      valuationType: number;
      // 单品运费模板指定包邮条件
      goodsFreeSaveRequests: any[];
      // 快递运送
      goodsExpressSaveRequests: any[];
      // 是否指定包邮条件
      specifyTermFlag: number;
      // 是否默认
      defaultFlag: number;
      // 快递配送formId
      goodsExpressForm: string[];
      // 包邮formId
      goodsFreeForm: string[];

      // 区域存储
      areaSave: Function;
      // 存储单品运费模板
      saveGoodsFreight: Function;
      // 修改指定字段值
      changeFieldValue: Function;
      // 更改freeRequest指定字段值
      goodsFreeSaveRequestsFieldValue: Function;
      // 添加运送方式
      shippingTypeAdd: Function;
      // 移除运送方式
      shippingTypeSub: Function;
      // 设置配送地区
      changeAreaIds: Function;
      // 更改expressRequest指定字段值
      goodsExpressSaveRequestsFieldValue: Function;
      // 包邮运费模板新增
      goodsFreeAdd: Function;
      // 包邮运费模板删除
      goodsFreeSub: Function;
      // 更改是否包邮
      changeFreightFree: Function;
      // 更改是否按指定条件包邮
      changeSpecifyTermFlag: Function;
      // 更改指定包邮地区
      changeFreeAreaIds: Function;
      // 更改计价方式
      changeValuationType: Function;
    };
  };

  static relaxProps = {
    freightTempName: 'freightTempName',
    provinceId: 'provinceId',
    cityId: 'cityId',
    areaId: 'areaId',
    freightFreeFlag: 'freightFreeFlag',
    valuationType: 'valuationType',
    goodsFreeSaveRequests: goodsFreeSaveRequestsQL,
    goodsExpressSaveRequests: goodsExpressSaveRequestsQL,
    specifyTermFlag: 'specifyTermFlag',
    defaultFlag: 'defaultFlag',
    goodsExpressForm: goodsExpressFormQL,
    goodsFreeForm: goodsFreeFormQL,

    areaSave: noop,
    saveGoodsFreight: noop,
    changeFieldValue: noop,
    goodsFreeSaveRequestsFieldValue: noop,
    shippingTypeAdd: noop,
    shippingTypeSub: noop,
    changeAreaIds: noop,
    goodsExpressSaveRequestsFieldValue: noop,
    goodsFreeAdd: noop,
    goodsFreeSub: noop,
    changeFreightFree: noop,
    changeSpecifyTermFlag: noop,
    changeFreeAreaIds: noop,
    changeValuationType: noop
  };

  render() {
    let aIds = [];
    const { form } = this.props;
    const {
      freightTempName,
      provinceId,
      cityId,
      areaId,
      freightFreeFlag,
      valuationType,
      goodsFreeSaveRequests,
      goodsExpressSaveRequests,
      specifyTermFlag,
      defaultFlag,

      areaSave,
      changeFieldValue,
      shippingTypeSub,
      changeAreaIds,
      goodsExpressSaveRequestsFieldValue,
      goodsFreeSub,
      goodsFreeAdd,
      changeSpecifyTermFlag,
      changeFreeAreaIds
    } = this.props.relaxProps;
    if (provinceId && cityId && areaId) {
      aIds = [`${provinceId}`, `${cityId}`, `${areaId}`];
    }

    const tProps = {
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      //searchPlaceholder: '请选择地区',
      searchPlaceholder: 'please select the region',
      dropdownStyle: { maxHeight: 400, overflow: 'auto' }
      // style: {
      //   width: 300
      // }
    };

    const { getFieldDecorator } = form;

    return (
      <FormDiv>
        <Form>
          <FormItem {...formItemLayout} label="Template name" required={true}>
            {getFieldDecorator('freightTempName', {
              initialValue: freightTempName,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorTrimMinAndMax(
                      rule,
                      value,
                      callback,
                      'Template name',
                      2,
                      20
                    );
                  }
                }
              ]
            })(
              <Input
                style={{ width: 350 }}
                disabled={defaultFlag == 1}
                //placeholder="模板名称限制2-20个字符"
                placeholder="Template name must be 2-20 characters"
                onChange={(e) =>
                  changeFieldValue({
                    field: 'freightTempName',
                    value: e.target.value
                  })
                }
              />
            )}
          </FormItem>
          <div className="areaBox">
            <FormItem
              {...formItemLayout}
              required={true}
              label="Delivery address"
            >
              {getFieldDecorator('area', {
                initialValue: aIds,
                rules: [
                  {
                    required: true,
                    message: 'Please select the shipping address'
                  }
                ]
              })(
                <AreaSelect
                  // placeholder="请选择发货地址"
                  placeholder="Please select the shipping address"
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  onChange={(value) => areaSave(value)}
                />
              )}
            </FormItem>
          </div>

          <FormItem
            {...formItemLayout}
            label="Who pay the freight"
            required={true}
          >
            <RadioGroup
              onChange={(e: any) => this._changeFreightFreeFlag(e.target.value)}
              value={freightFreeFlag}
            >
              <Radio value={0}>Buyer</Radio>
              <Radio value={1}>Seller</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Pricing based on"
            required={true}
          >
            <RadioGroup
              disabled={freightFreeFlag == 1}
              value={valuationType}
              onChange={(e: any) => this._changeFieldValue(e.target.value)}
            >
              <Radio value={0}>Quantity</Radio>
              <Radio value={1}>Weight</Radio>
              <Radio value={2}>Volume</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem {...formItemLayout} label="Shipping method" required={true}>
            <Radio defaultChecked>Express delivery</Radio>
            <label style={{ color: '#b5b5b5' }}>
              Please set shipping template for express delivery
            </label>
            <Table
              rowKey="id"
              bordered={true}
              pagination={false}
              columns={[
                {
                  title: 'Delivery area',
                  dataIndex: 'destinationArea',
                  key: 'destinationArea',
                  width: '24%',
                  render: (text, record, index) => {
                    return record.defaultFlag == 1 || index == 0 ? (
                      <div>
                        {/* 默认 */}
                        <span style={{ color: '#b5b5b5' }}>
                          Except for designated regions, the freight rates in
                          the rest of the regions are "default freight rates".
                        </span>
                      </div>
                    ) : (
                      <div className="treeSelectBox">
                        <FormItem>
                          {getFieldDecorator(`destinationArea${record.id}`, {
                            initialValue: text,
                            rules: [
                              {
                                required: true,
                                message: 'please select the region'
                              }
                            ]
                          })(
                            <TreeSelect
                              {...tProps}
                              treeData={this._buildExpressAreaData(record.id)}
                              onChange={(value, label) => {
                                changeAreaIds(record.id, value, label);
                              }}
                              filterTreeNode={(input, treeNode) =>
                                treeNode.props.title
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            />
                          )}
                        </FormItem>
                      </div>
                    );
                  }
                },
                {
                  title: `Initial ${FREIGHT_TEMP[valuationType].label}(${FREIGHT_TEMP[valuationType].unit})`,
                  dataIndex: 'freightStartNum',
                  key: 'freightStartNum',
                  width: '16%',
                  render: (text, record) => {
                    return (
                      <FormItem>
                        {getFieldDecorator(
                          `freightStartNum${record.id}${freightFreeFlag}`,
                          {
                            initialValue: text,
                            rules: this._rules(valuationType, 'first', false)
                          }
                        )(
                          <Input
                            disabled={freightFreeFlag == 1}
                            placeholder={PLACE_HOLDER[valuationType].unit}
                            onChange={(e) =>
                              goodsExpressSaveRequestsFieldValue(
                                record.id,
                                'freightStartNum',
                                e.target.value
                              )
                            }
                          />
                        )}
                      </FormItem>
                    );
                  }
                },
                {
                  title: 'Down payment (dollar)',
                  dataIndex: 'freightStartPrice',
                  key: 'freightStartPrice',
                  width: '13%',
                  render: (text, record) => {
                    return (
                      <FormItem>
                        {getFieldDecorator(
                          `freightStartPrice${record.id}${freightFreeFlag}`,
                          {
                            initialValue: text,
                            rules: this._rules(valuationType, '', true)
                          }
                        )(
                          <Input
                            disabled={freightFreeFlag == 1}
                            placeholder={PLACE_HOLDER[valuationType].money}
                            onChange={(e) =>
                              goodsExpressSaveRequestsFieldValue(
                                record.id,
                                'freightStartPrice',
                                e.target.value
                              )
                            }
                          />
                        )}
                      </FormItem>
                    );
                  }
                },
                {
                  title: `Additional ${FREIGHT_TEMP[valuationType].label}(${FREIGHT_TEMP[valuationType].unit})`,
                  dataIndex: 'freightPlusNum',
                  key: 'freightPlusNum',
                  width: '16%',
                  render: (text, record) => {
                    return (
                      <FormItem>
                        {getFieldDecorator(
                          `freightPlusNum${record.id}${freightFreeFlag}`,
                          {
                            initialValue: text,
                            rules: this._rules(valuationType, 'Renewal', false)
                          }
                        )(
                          <Input
                            disabled={freightFreeFlag == 1}
                            placeholder={PLACE_HOLDER[valuationType].unit}
                            onChange={(e) =>
                              goodsExpressSaveRequestsFieldValue(
                                record.id,
                                'freightPlusNum',
                                e.target.value
                              )
                            }
                          />
                        )}
                      </FormItem>
                    );
                  }
                },
                {
                  title: 'Renewal fee (dollar)',
                  dataIndex: 'freightPlusPrice',
                  key: 'freightPlusPrice',
                  width: '15%',
                  render: (text, record) => {
                    return (
                      <FormItem>
                        {getFieldDecorator(
                          `freightPlusPrice${record.id}${freightFreeFlag}`,
                          {
                            initialValue: text,
                            rules: this._rules(valuationType, '', true)
                          }
                        )(
                          <Input
                            disabled={freightFreeFlag == 1}
                            placeholder={PLACE_HOLDER[valuationType].money}
                            onChange={(e) =>
                              goodsExpressSaveRequestsFieldValue(
                                record.id,
                                'freightPlusPrice',
                                e.target.value
                              )
                            }
                          />
                        )}
                      </FormItem>
                    );
                  }
                },
                {
                  title: 'Operation',
                  dataIndex: 'operation',
                  key: 'operation',
                  width: '13%',
                  render: (_text, record, index) => {
                    return record.defaultFlag == 1 || index == 0 ? (
                      <Icon
                        type="plus"
                        onClick={() =>
                          freightFreeFlag == 1 ? noop : this._shippingTypeAdd()
                        }
                        style={
                          freightFreeFlag == 1
                            ? styles.disabledIcon
                            : styles.icon
                        }
                      />
                    ) : (
                      <Icon
                        type="minus"
                        onClick={() => shippingTypeSub(record.id)}
                        style={styles.icon}
                      />
                    );
                  }
                }
              ]}
              dataSource={goodsExpressSaveRequests}
            />
            <Checkbox
              disabled={freightFreeFlag == 1}
              checked={specifyTermFlag == 1}
              onChange={(e) => changeSpecifyTermFlag(e.target.checked ? 1 : 0)}
            >
              Free shipping under certain shipping conditions
            </Checkbox>
            <Table
              rowKey="id"
              bordered={true}
              pagination={false}
              columns={[
                {
                  title: 'Delivery area',
                  dataIndex: 'destinationArea',
                  key: 'destinationArea',
                  width: '24%',
                  render: (_text, record) => {
                    return (
                      <div className="treeSelectBox">
                        <FormItem>
                          {getFieldDecorator(`destinationArea${record.id}`, {
                            initialValue: record.destinationArea,
                            rules: [
                              {
                                required: true,
                                message: 'please select the region'
                              }
                            ]
                          })(
                            <TreeSelect
                              {...tProps}
                              treeData={this._buildFreeAreaData(record.id)}
                              onChange={(value, label) => {
                                changeFreeAreaIds(record.id, value, label);
                              }}
                              filterTreeNode={(input, treeNode) =>
                                treeNode.props.title
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            />
                          )}
                        </FormItem>
                      </div>
                    );
                  }
                },
                {
                  title: 'Shipping method',
                  dataIndex: 'deliverWay',
                  key: 'deliverWay',
                  width: '16%',
                  render: () => {
                    return (
                      <Select defaultValue="1">
                        <Option value="1">Express delivery</Option>
                      </Select>
                    );
                  }
                },
                {
                  title: 'Set shipping conditions',
                  dataIndex: 'conditionType',
                  key: 'conditionType',
                  width: '42%',
                  render: (text, record) => {
                    return (
                      <div className="set-condition">
                        <Select
                          defaultValue="0"
                          value={text.toString()}
                          onChange={(value) => {
                            this._conditionTypeChange(record.id, value);
                          }}
                          style={{ width: 110, marginTop: 3 }}
                        >
                          <Option value="0">
                            {FREIGHT_TEMP[valuationType].options}
                          </Option>
                          <Option value="1">Amount</Option>
                          <Option value="2">
                            {FREIGHT_TEMP[valuationType].options}+Amount
                          </Option>
                        </Select>
                        {this._freeConditions(valuationType, record)}
                      </div>
                    );
                  }
                },
                {
                  title: 'Operation',
                  dataIndex: 'operation',
                  key: 'operation',
                  width: '13%',
                  render: (_text, record, index) => {
                    return index == 0 ? (
                      <Icon
                        type="plus"
                        onClick={() => goodsFreeAdd()}
                        style={styles.icon}
                      />
                    ) : (
                      <Icon
                        type="minus"
                        onClick={() => goodsFreeSub(record.id)}
                        style={styles.icon}
                      />
                    );
                  }
                }
              ]}
              dataSource={specifyTermFlag == 1 ? goodsFreeSaveRequests : []}
            />
          </FormItem>
          <div className="bar-button">
            <Button
              onClick={() => this._save()}
              type="primary"
              style={{ marginRight: 10, marginLeft: 22 }}
            >
              Save
            </Button>
            <Button onClick={() => history.push('/freight')}>Cancel</Button>
          </div>
        </Form>
      </FormDiv>
    );
  }

  /**
   * 保存
   */
  _save = () => {
    const { saveGoodsFreight } = this.props.relaxProps;
    this.props.form.validateFieldsAndScroll(null, (errs) => {
      //如果校验通过
      if (!errs) {
        saveGoodsFreight();
      }
    });
  };

  /**
   * 是否包邮
   */
  _freeConditions = (valuationType, record) => {
    const { form } = this.props;
    const { goodsFreeSaveRequestsFieldValue } = this.props.relaxProps;
    const { getFieldDecorator } = form;
    // 按件数
    if (valuationType == 0) {
      if (record.conditionType == 0) {
        return (
          <FormItem>
            <InlineBDiv>
              <span className="pl3 pr3">Full</span>
              {getFieldDecorator(`conditionOne${record.id}`, {
                initialValue: record.conditionOne,
                rules: this._freeConditionRules(valuationType, false)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionOne',
                      e.target.value
                    )
                  }
                />
              )}
              <span className="pl3">
                {FREIGHT_TEMP[valuationType].unit} Free shipping
              </span>
            </InlineBDiv>
          </FormItem>
        );
      } else if (record.conditionType == 1) {
        return (
          <FormItem>
            <InlineBDiv>
              <span className="pl3 pr3">Full</span>
              {getFieldDecorator(`conditionTwo${record.id}`, {
                initialValue: record.conditionTwo,
                rules: this._freeConditionRules(valuationType, true)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionTwo',
                      e.target.value
                    )
                  }
                />
              )}
              <span className="pl3">yuan Free shipping</span>
            </InlineBDiv>
          </FormItem>
        );
      } else {
        return (
          <div className="moreForeItem">
            <span className="pl3 pr3">Full</span>
            <FormItem>
              {getFieldDecorator(`conditionOne${record.id}`, {
                initialValue: record.conditionOne,
                rules: this._freeConditionRules(valuationType, false)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionOne',
                      e.target.value
                    )
                  }
                />
              )}
            </FormItem>
            <span className="pl3 pr3">
              {FREIGHT_TEMP[valuationType].unit}, And full
            </span>
            <FormItem>
              {getFieldDecorator(`conditionTwo${record.id}`, {
                initialValue: record.conditionTwo,
                rules: this._freeConditionRules(valuationType, true)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionTwo',
                      e.target.value
                    )
                  }
                />
              )}
              <span className="pl3 pr3">More than Yuan Free shipping</span>
            </FormItem>
          </div>
        );
      }
    } else {
      // 按重量 || 按体积
      if (record.conditionType == 0) {
        return (
          <FormItem>
            <InlineBDiv>
              <span className="pl3 pr3">IN</span>
              {getFieldDecorator(`conditionOne${record.id}`, {
                initialValue: record.conditionOne,
                rules: this._freeConditionRules(valuationType, false)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionOne',
                      e.target.value
                    )
                  }
                />
              )}
              <span className="pl3">
                {FREIGHT_TEMP[valuationType].unit}Within free shipping
              </span>
            </InlineBDiv>
          </FormItem>
        );
      } else if (record.conditionType == 1) {
        return (
          <FormItem>
            <InlineBDiv>
              <span className="pl3 pr3">Full</span>
              {getFieldDecorator(`conditionTwo${record.id}`, {
                initialValue: record.conditionTwo,
                rules: this._freeConditionRules(valuationType, true)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionTwo',
                      e.target.value
                    )
                  }
                />
              )}
              <span>yuan free shipping</span>
            </InlineBDiv>
          </FormItem>
        );
      } else {
        return (
          <div className="moreForeItem">
            <span className="pl3 pr3">in</span>
            <FormItem>
              {getFieldDecorator(`conditionOne${record.id}`, {
                initialValue: record.conditionOne,
                rules: this._freeConditionRules(valuationType, false)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionOne',
                      e.target.value
                    )
                  }
                />
              )}
            </FormItem>
            <span className="pl3 pr3">
              {FREIGHT_TEMP[valuationType].unit} Within and full
            </span>
            <FormItem>
              {getFieldDecorator(`conditionTwo${record.id}`, {
                initialValue: record.conditionTwo,
                rules: this._freeConditionRules(valuationType, true)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionTwo',
                      e.target.value
                    )
                  }
                />
              )}
            </FormItem>
            <span className="pl3"> more than yuan free shipping</span>
          </div>
        );
      }
    }
  };

  /**
   * 获取规则
   */
  _rules = (valuationType, text, flag) => {
    let rules = fromJS([]);
    if (this.props.relaxProps.freightFreeFlag == 0) {
      if (flag) {
        rules = fromJS([
          {
            validator: (_rule, value, callback) => {
              if (value || value == '0') {
                if (!ValidConst.zeroPrice.test(value)) {
                  callback(
                    'Please fill in the legal amount with two decimal places'
                  );
                }
                if (!(value < 10000 && value >= 0)) {
                  callback('The maximum value is 9999.99');
                }
              } else {
                callback('Please input the amount');
              }
              callback();
            }
          }
        ]);
      } else {
        rules = fromJS([
          {
            required: true,
            message: `Please input ${text}${FREIGHT_TEMP[valuationType].label}`
          }
        ]);
        if (valuationType == 0) {
          rules = rules.concat(
            fromJS([
              {
                validator: (_rule, value, callback) => {
                  if (value) {
                    if (!ValidConst.noZeroNumber.test(value)) {
                      callback('Please fill in the legal number');
                    }
                    if (!(value <= 9999 && value >= 1)) {
                      callback('Please enter an integer between 1-9999');
                    }
                  }
                  callback();
                }
              }
            ])
          );
        } else if (valuationType == 1) {
          rules = rules.concat([
            {
              validator: (_rule, value, callback) => {
                if (value) {
                  if (!ValidConst.singleDecimal.test(value)) {
                    callback('Please input a valid decimal');
                  }
                  if (!(value < 10000 && value > 0)) {
                    callback('Please input a decimal between 0.1-9999.9');
                  }
                }
                callback();
              }
            }
          ]);
        } else {
          rules = rules.concat([
            {
              validator: (_rule, value, callback) => {
                if (value) {
                  if (!ValidConst.singleDecimal.test(value)) {
                    callback('Please input a valid decimal');
                  }
                  if (!(value < 1000 && value > 0)) {
                    callback('Please input a decimal between 0.1-9999.9');
                  }
                }
                callback();
              }
            }
          ]);
        }
      }
    }

    return rules.toJS();
  };

  /**
   * 包邮条件规则展示
   */
  _freeConditionRules = (valuationType, flag) => {
    let rules = fromJS([]);
    if (this.props.relaxProps.freightFreeFlag == 0) {
      if (flag) {
        rules = fromJS([
          {
            validator: (_rule, value, callback) => {
              if (value) {
                if (!ValidConst.price.test(value)) {
                  callback('Please enter a legal amount');
                }
                if (!(value < 10000000000 && value > 0)) {
                  callback('Please enter an amount between 0.01-9999999999.99');
                }
              } else {
                callback('Please enter the amount');
              }
              callback();
            }
          }
        ]);
      } else {
        rules = fromJS([
          {
            required: true,
            message: `Please input${FREIGHT_TEMP[valuationType].options}`
          }
        ]);
        if (valuationType == 0) {
          rules = rules.concat(
            fromJS([
              {
                validator: (_rule, value, callback) => {
                  if (value) {
                    if (!ValidConst.noZeroNumber.test(value)) {
                      callback('Please enter a valid integer');
                    }
                    if (!(value <= 9999 && value >= 1)) {
                      callback('Please enter an integer between 1-9999');
                    }
                  }
                  callback();
                }
              }
            ])
          );
        } else if (valuationType == 1) {
          // 重量
          rules = rules.concat(
            fromJS([
              {
                validator: (_rule, value, callback) => {
                  if (value) {
                    if (!ValidConst.singleDecimal.test(value)) {
                      callback('Please enter a valid decimal');
                    }
                    if (!(value < 10000 && value > 0)) {
                      callback('Please enter a value between 0.1-9999.9');
                    }
                  }
                  callback();
                }
              }
            ])
          );
        } else {
          rules = rules.concat(
            fromJS([
              {
                validator: (_rule, value, callback) => {
                  if (value) {
                    if (!ValidConst.singleDecimal.test(value)) {
                      callback('Please enter a valid decimal');
                    }
                    if (!(value < 1000 && value > 0)) {
                      callback('Please enter a value between 0.1-999.9');
                    }
                  }
                  callback();
                }
              }
            ])
          );
        }
      }
    }
    return rules.toJS();
  };

  /**
   * 切换计价方式重置表单
   */
  _changeFieldValue = (value) => {
    const self = this;
    const { goodsExpressForm } = this.props.relaxProps;
    Confirm({
      title: 'prompt',
      content:
        'Switching the pricing method, the original freight setting cannot be restored, are you sure to continue?',
      iconType: 'exclamation-circle',
      onOk() {
        self.props.relaxProps.changeValuationType(value);
        self.props.form.resetFields(goodsExpressForm);
      }
    });
  };

  /**
   * 包邮条件更改
   */
  _conditionTypeChange = (id, value) => {
    this.props.relaxProps.goodsFreeSaveRequestsFieldValue(
      id,
      'conditionType',
      value
    );
    const { goodsFreeForm } = this.props.relaxProps;
    this.props.form.resetFields(goodsFreeForm);
  };

  /**
   * 更改是否包邮
   */
  _changeFreightFreeFlag = (value) => {
    const self = this;
    const {
      changeFieldValue,
      changeFreightFree,
      goodsExpressForm
    } = this.props.relaxProps;
    if (value == 1) {
      Confirm({
        title: 'prompt',
        content:
          'Switch the seller to bear the freight. The freight in all areas will be set to 0 yuan and the original freight setting cannot be restored. Are you sure to continue?',
        iconType: 'exclamation-circle',
        onOk() {
          changeFieldValue({ field: 'freightFreeFlag', value });
          changeFieldValue({
            field: 'specifyTermFlag',
            value: 0
          });
          changeFreightFree(value == 1);
          self.props.form.resetFields(goodsExpressForm);
        }
      });
    } else {
      changeFieldValue({ field: 'freightFreeFlag', value });
      changeFreightFree(value == 1);
    }
  };

  /**
   * 新增运费模板
   */
  _shippingTypeAdd = () => {
    this.props.relaxProps.shippingTypeAdd();
  };

  /**
   * 构建配送地区数据
   */
  _buildExpressAreaData = (id) => {
    const { goodsExpressSaveRequests } = this.props.relaxProps;
    const ids = fromJS(goodsExpressSaveRequests)
      .filter((f) => f.get('id') != id)
      .flatMap((m) => m.get('destinationArea'))
      .toJS();
    return FindArea.findProvinceCity(ids);
  };

  /**
   * 构建包邮地区数据
   */
  _buildFreeAreaData = (id) => {
    const { goodsFreeSaveRequests } = this.props.relaxProps;
    const ids = fromJS(goodsFreeSaveRequests)
      .filter((f) => f.get('id') != id)
      .flatMap((m) => m.get('destinationArea'))
      .toJS();
    return FindArea.findProvinceCity(ids);
  };
}

const styles = {
  icon: {
    fontSize: 16,
    color: '#08c',
    fontWeight: 'bolder'
  },
  disabledIcon: {
    fontSize: 16,
    color: '#ccc',
    fontWeight: 'bolder'
  }
} as any;
