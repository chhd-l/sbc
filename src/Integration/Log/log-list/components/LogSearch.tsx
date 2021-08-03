import React, { Component } from 'react';
import { Input, Form, Row, Col, Select, Button } from 'antd';
import { SelectGroup,RCi18n } from 'qmkit';
import MyDate from './MyDate'

const { Option } = Select

class LogSearch extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  // 获取form各项value
  handleSubmit = () => {
    const value = this.props.form.getFieldsValue();
    let startDate = value.newdate ? value.newdate.format('YYYY-MM-DD') : '';
    let endDate = value.enddate ? value.enddate.format('YYYY-MM-DD') : '';
    let obj = { ...value, enddate: endDate, newdate: startDate };
    // tslint:disable-next-line:no-console
    console.log(obj);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" className="filter-content">
        <Row gutter={24}>
          {/* requestID */}
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('requestId')(<Input addonBefore={<p style={styles.label}>{RCi18n({ id: 'Log.RequestID' })}</p>} />)}
            </Form.Item>
          </Col>
          {/* system */}
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('system', {
                initialValue: '0'
              })(
                <SelectGroup
                  style={styles.selectWidth}
                  label={<p style={styles.label}
                  >{RCi18n({ id: 'Log.System' })}</p>}>
                  <Option value="0">{RCi18n({ id: 'Log.Datata' })}</Option>
                  <Option value="1">{RCi18n({ id: 'Log.Fedex' })}</Option>
                  <Option value="2">{RCi18n({ id: 'Log.Mulesoft' })}</Option>
                  <Option value="3">{RCi18n({ id: 'Log.OKTACIAM' })}</Option>
                  <Option value="4">{RCi18n({ id: 'Log.WEShare' })}</Option>
                </SelectGroup>
              )}
            </Form.Item>
          </Col>
          {/* interface */}
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('interface', {
                initialValue: '0'
              })
                (<SelectGroup
                  style={styles.selectWidth}
                  label={<p style={styles.label}>{RCi18n({ id: 'Log.Interface' })}</p>}>
                  <Option value="0">{RCi18n({ id: 'Log.InventorySynchonization' })}</Option>
                  <Option value="1">{RCi18n({ id: 'Log.OrderExport' })}</Option>
                  <Option value="2">{RCi18n({ id: 'Log.PriceSynchronization' })}</Option>
                </SelectGroup>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          {/* newdate */}
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('newdate')(<MyDate label={<p style={styles.label}>{RCi18n({ id: 'Log.NewDate' })}</p>}></MyDate>)}
            </Form.Item>
          </Col>
          {/* enddate */}
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('enddate')(<MyDate label={<p style={styles.label}>{RCi18n({ id: 'Log.EndDate' })}</p>}></MyDate>)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon="search"
                shape="round" onClick={this.handleSubmit}>
                {RCi18n({ id: 'Log.Search' })}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }
}

const styles = {
  label: {
    width: 151,
    textAlign: 'center',
    padding: '0px'
  },

  selectWidth: {
    width: 194
  }
} as any

export default Form.create()(LogSearch)
