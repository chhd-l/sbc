import React, { Component } from 'react';
import { Relax } from 'plume2';
import { noop, checkAuth, util } from 'qmkit';
import { Map, fromJS } from 'immutable';
import {
  Icon,
  Table,
  Tooltip,
  Divider,
  Switch,
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  Breadcrumb,
  Tag,
  message,
  Select,
  Radio,
  DatePicker,
  Spin,
  Alert,
  InputNumber,
  Tabs,
  Popconfirm
} from 'antd';
import { DndComponentClass, DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { RCi18n } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';

const FormItem = Form.Item;

class AttributeValueList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { list } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 11 }
      },
      wrapperCol: {
        sm: { span: 12 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        sm: { span: 12, offset: 11 }
      }
    };
    const secondFormItemWithOutLabel = {
      wrapperCol: {
        sm: { span: 20, offset: 0 }
      }
    };
    console.log(list, 'attributeValueList===');
    return (
      <>
        <div>
          {list.length
            ? list.map((k, index) => (
                <div key={k.tempId}>
                  <Row>
                    <Col span={13}>
                      <FormItem
                        label={
                          index === 0 ? (
                            <span>
                              <span
                                style={{
                                  color: 'red',
                                  fontFamily: 'SimSun',
                                  marginRight: '4px',
                                  fontSize: '12px'
                                }}
                              >
                                {' '}
                                *
                              </span>
                              <FormattedMessage id="Product.AttributeValue" />
                              &nbsp;
                              <Tooltip title={RCi18n({ id: 'Order.modifiedErr' })}>
                                <Icon type="question-circle-o" />
                              </Tooltip>
                            </span>
                          ) : (
                            ''
                          )
                        }
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        required={false}
                        key={'value_' + (k.id || k.tempId)}
                      >
                        {getFieldDecorator('attributeValue_' + (k.id || k.tempId), {
                          validateTrigger: ['onChange', 'onBlur'],
                          rules: [
                            {
                              required: true,
                              whitespace: true,
                              message: RCi18n({ id: 'Product.PleaseInputAttributeValue' })
                            }
                          ],
                          initialValue: k.attributeDetailName
                        })(
                          <Input
                            placeholder={RCi18n({ id: 'Product.Attributevalue' })}
                            disabled={!checkAuth('f_attribute_value_edit')}
                            style={{ marginRight: 8 }}
                            onChange={(e) => {
                              const value = e.target.value;
                              this.props.onChangeValue(k.id || k.tempId, value, 'attribute');
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={7}>
                      <FormItem {...secondFormItemWithOutLabel}>
                        {getFieldDecorator('displayValue_' + (k.id || k.tempId), {
                          validateTrigger: ['onChange', 'onBlur'],
                          rules: [
                            {
                              required: true,
                              whitespace: true,
                              message: RCi18n({ id: 'Product.PleaseInputDisplayValue' })
                            }
                          ],
                          initialValue: k.attributeDetailNameEn
                        })(
                          <Input
                            placeholder={RCi18n({ id: 'Product.DisplayValue' })}
                            style={{ marginRight: 8 }}
                            disabled={!checkAuth('f_attribute_value_edit')}
                            onChange={(e) => {
                              const value = e.target.value;
                              this.props.onChangeValue(k.id || k.tempId, value, 'display');
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    {checkAuth('f_attribute_value_edit') ? (
                      <Col span={2} style={{ marginTop: '10px' }}>
                        <span>
                          {list.length > 1 ? (
                            <>
                              {k.id ? (
                                <Popconfirm
                                  placement="topRight"
                                  title="Are you sure to delete this item?"
                                  onConfirm={() => this.props.removeRemote(k.id)}
                                  okText="Confirm"
                                  cancelText="Cancel"
                                >
                                  <Icon className="dynamic-delete-button" type="minus-circle-o" />
                                </Popconfirm>
                              ) : (
                                <Popconfirm
                                  placement="topRight"
                                  title="Are you sure to delete this item?"
                                  onConfirm={() => this.props.removeTemp(k.tempId)}
                                  okText="Confirm"
                                  cancelText="Cancel"
                                >
                                  <Icon className="dynamic-delete-button" type="minus-circle-o" />
                                </Popconfirm>
                              )}
                            </>
                          ) : null}
                          <Icon
                            className="dynamic-delete-button"
                            type="plus-circle-o"
                            style={{ marginLeft: 8 }}
                            onClick={() => this.props.add()}
                          />
                        </span>
                      </Col>
                    ) : null}
                  </Row>
                </div>
              ))
            : null}
        </div>
      </>
    );
  }
}

export default AttributeValueList;
