import React from 'react';

import { Form, Input, InputNumber, Radio, TreeSelect, Button } from 'antd';
import { QMMethod, FindArea, ValidConst, noop, history } from 'qmkit';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
const FormDiv = styled.div`
  .ant-form-item-label {
    width: 130px;
  }
  #freightTempName {
    width: 350px;
  }
  .ant-select-selection {
    width: 350px;
  }
  .ant-radio-group {
    .radio-item {
      margin-bottom: 5px;
    }
    .ant-row {
      display: inline-block;
      margin-bottom: 0;
      #satisfyFreight,
      #fixedFreight,
      #minimumDeliveryFee,
      #satisfyPrice {
        width: 100px;
        text-align: center;
      }
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

/**
 * 运费模板
 */
export default class FreightTemp extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      // 运费模板Id
      freightTempId: string;
      // 模板名称
      freightTempName: string;
      // 区域Ids
      destinationArea: IList;
      // 运送方式
      freightType: number;
      // 不满*元
      satisfyPrice: number;
      // 运费
      satisfyFreight: number;
      // 固定运费
      fixedFreight: number;
      // 最低运费
      minimumDeliveryFee: number;
      // 已经被选中的地区Id
      selectedAreas: IList;
      // 是否默认 1默认 0非默认
      defaultFlag: number;
      // 配送地区
      destinationAreaName: IList;

      // 区域设置
      areaIdsSave: Function;
      // 根据字段修改值
      storeFreightFieldsValue: Function;
      // 存储运费模板
      saveStoreFreight: Function;
      // treeData
      treeNode: IList;
    };
  };

  static relaxProps = {
    freightTempId: 'freightTempId',
    freightTempName: 'freightTempName',
    destinationArea: 'destinationArea',
    freightType: 'freightType',
    satisfyPrice: 'satisfyPrice',
    satisfyFreight: 'satisfyFreight',
    fixedFreight: 'fixedFreight',
    minimumDeliveryFee: 'minimumDeliveryFee',
    selectedAreas: 'selectedAreas',
    defaultFlag: 'defaultFlag',
    destinationAreaName: 'destinationAreaName',
    treeNode: 'treeNode',

    areaIdsSave: noop,
    storeFreightFieldsValue: noop,
    saveStoreFreight: noop
  };

  render() {
    const {
      freightTempName,
      destinationArea,
      freightType,
      satisfyPrice,
      satisfyFreight,
      fixedFreight,
      minimumDeliveryFee,
      storeFreightFieldsValue,
      selectedAreas,
      destinationAreaName,
      defaultFlag,
      treeNode
    } = this.props.relaxProps;
    let treeData = treeNode ? treeNode.toJS() : [];

    const tProps = {
      treeData,
      onChange: this._changeArea,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder:
        defaultFlag == 1
          ? destinationAreaName.toJS().toString()
          : 'Please select the region',
      dropdownStyle: { maxHeight: 400, overflow: 'auto' },
      disabled: defaultFlag == 1,
      style: {
        width: 350
      }
    };

    const { getFieldDecorator } = this.props.form;
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
                disabled={defaultFlag == 1}
                placeholder="Template name is limited to 2-20 characters"
                onChange={(e) =>
                  storeFreightFieldsValue({
                    field: 'freightTempName',
                    value: e.target.value
                  })
                }
              />
            )}
          </FormItem>
          {/* <FormItem {...formItemLayout} label="Shipping method" required={true}>
            <Radio defaultChecked>Express delivery</Radio>
            <label style={{ color: '#b5b5b5' }}>
              Please set shipping template for express delivery
            </label>
          </FormItem> */}
          <FormItem {...formItemLayout} label="Location" required={true}>
            {getFieldDecorator('destinationArea', {
              initialValue: destinationArea.toJS(),
              rules: [
                {
                  required: true,
                  message: 'Please select the city'
                }
              ]
            })(
              <TreeSelect
                {...tProps}
                filterTreeNode={(input, treeNode) =>
                  treeNode.props.title
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Charging rule" required={true}>
            <RadioGroup
              defaultValue={freightType}
              value={freightType}
              onChange={(e) => this._changeFreightType(e.target.value)}
            >
              <div className="radio-item">
                <Radio value={0}>If orders less than </Radio>
                <FormItem>
                  {getFieldDecorator('satisfyPrice', {
                    initialValue: satisfyPrice,
                    rules: this._validMoney(freightType, 0)
                  })(
                    <InputNumber
                      disabled={freightType == 1}
                      onChange={(value) =>
                        storeFreightFieldsValue({
                          field: 'satisfyPrice',
                          value: value
                        })
                      }
                    />
                  )}
                </FormItem>
                <span
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginTop: '10px',
                    display: 'inline-block'
                  }}
                >
                  dollar, the freight would be
                </span>
                <FormItem>
                  {getFieldDecorator('satisfyFreight', {
                    initialValue: satisfyFreight,
                    rules: this._validMoney(freightType, 0)
                  })(
                    <InputNumber
                      disabled={freightType == 1}
                      onChange={(value) =>
                        storeFreightFieldsValue({
                          field: 'satisfyFreight',
                          value: value
                        })
                      }
                    />
                  )}
                </FormItem>
                <span style={{ paddingLeft: 10 }}>
                  dollar. Freight after meeting the conditions will be
                  free.Order is judged whether it meets the free shipping
                  conditions according to the amount after excluding the
                  discount.
                </span>
              </div>

              <div className="radio-item">
                <Radio value={1}> Minimum delivery amount is</Radio>
                {/* <span
                  style={{
                    paddingLeft: 23,
                    paddingRight: 17,
                    marginTop: '10px',
                    display: 'inline-block'
                  }}
                >
                  Minimum delivery amount is
                </span> */}
                <FormItem>
                  {getFieldDecorator('minimumDeliveryFee', {
                    initialValue: minimumDeliveryFee,
                    rules: this._validMoney(freightType, 1)
                  })(
                    <InputNumber
                      disabled={freightType === 0}
                      onChange={(value) => {
                        storeFreightFieldsValue({
                          field: 'minimumDeliveryFee',
                          value: value
                        });
                      }}
                    />
                  )}
                </FormItem>
                <span style={{ paddingLeft: 10 }}>dollar.</span>
                <span
                  style={{
                    paddingLeft: 23,
                    paddingRight: 17,
                    marginTop: '10px',
                    display: 'inline-block'
                  }}
                >
                  Fixed shipping
                </span>
                {/* <Radio value={1}>Fixed shipping</Radio> */}
                <FormItem>
                  {getFieldDecorator('fixedFreight', {
                    initialValue: fixedFreight,
                    rules: this._validMoney(freightType, 1)
                  })(
                    <InputNumber
                      disabled={freightType === 0}
                      onChange={(value) => {
                        storeFreightFieldsValue({
                          field: 'fixedFreight',
                          value: value
                        });
                      }}
                    />
                  )}
                </FormItem>
                <span
                  style={{
                    paddingLeft: 10,
                    marginTop: '10px',
                    display: 'inline-block'
                  }}
                >
                  dollar.
                </span>
              </div>
            </RadioGroup>
          </FormItem>
          <div className="bar-button">
            <Button
              onClick={() => this._save()}
              type="primary"
              style={{ marginRight: 20, marginLeft: 22 }}
            >
              Save
            </Button>
            <Button onClick={() => history.goBack()}>Cancel</Button>
          </div>
        </Form>
      </FormDiv>
    );
  }

  /**
   * 存储区域Id
   */
  _changeArea = (value, label) => {
    this.props.relaxProps.areaIdsSave(value, label);
  };

  /**
   * 保存
   */
  _save = () => {
    const {
      saveStoreFreight,
      freightType,
      defaultFlag
    } = this.props.relaxProps;
    let validStr =
      defaultFlag == 1 ? [] : ['freightTempName', 'destinationArea'];
    validStr = validStr.concat(
      freightType == 0 ? ['satisfyPrice', 'satisfyFreight'] : ['fixedFreight']
    );
    this.props.form.validateFieldsAndScroll(validStr, (errs) => {
      //如果校验通过
      if (!errs) {
        saveStoreFreight();
      }
    });
  };

  /**
   * 修改运费方式重置表单
   */
  _changeFreightType = (value) => {
    const { storeFreightFieldsValue } = this.props.relaxProps;
    const { resetFields, validateFields } = this.props.form;
    storeFreightFieldsValue({
      field: 'freightType',
      value: value
    });
    resetFields();
    if (value == 0) {
      storeFreightFieldsValue({
        field: 'fixedFreight',
        value: ''
      });
      validateFields(['satisfyPrice', 'satisfyFreight']);
    } else {
      storeFreightFieldsValue({
        field: 'satisfyPrice',
        value: ''
      });
      storeFreightFieldsValue({
        field: 'satisfyFreight',
        value: ''
      });
      validateFields(['fixedFreight']);
    }
  };

  /**
   * 规则校验
   */
  _validMoney = (_freightType, _flag) => {
    return [
      { required: true, message: 'Please enter the amount' },
      {
        pattern: ValidConst.zeroPrice,
        message: 'Please input the legal amount with two decimal places'
      },
      {
        type: 'number',
        max: 99999999.99,
        message: 'The maximum value is 99999999.99',
        transform: function (value) {
          return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        }
      }
    ];
  };
}
