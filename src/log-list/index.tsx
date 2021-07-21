import React, { Component } from 'react'
import { Headline, BreadCrumb, SelectGroup } from 'qmkit';
import MyDate from './components/MyDate'
import { Form, Row, Col, Input, Button, Select } from 'antd'
import { FormattedMessage } from 'react-intl';
const {Option} = Select

class Loglist extends Component<any, any>{
  constructor(props) {
    super(props);
  }

  handleSubmit = () => {
    const value = this.props.form.getFieldsValue();
    let startDate = value.newdate?value.newdate.format('YYYY-MM-DD'):'';
    let endDate = value.enddate?value.enddate.format('YYYY-MM-DD'):'';
    let obj = {...value,enddate:endDate,newdate:startDate}
    console.log(obj);
    
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={<FormattedMessage id='log-list' />} />
          <Form layout='inline' className="filter-content">
            <Row>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('requestId')(<Input style={{ width: 337 }} addonBefore={<p style={styles.label}>Request ID</p>} />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('system')(
                    <SelectGroup
                      style={{ width: 194 }}
                      label={<p style={styles.label}>System</p>}>
                      <Option value="Datata">Datata</Option>
                      <Option value="Fedex">Fedex</Option>
                      <Option value="Mulesoft">Mulesoft</Option>
                      <Option value="OKTA CIAM">OKTA CIAM</Option>
                      <Option value="WEShare">WEShare</Option>
                    </SelectGroup>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('interface')(<SelectGroup
                    style={{ width: 194 }}
                    label={<p style={styles.label}>Interface</p>}
                  >
                    <Option value="Inventory Synchonization">Inventory Synchonization</Option>
                    <Option value="Order Export">Order Export</Option>
                    <Option value="Price Synchronization">Price Synchronization</Option>
                  </SelectGroup>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator("newdate")(<MyDate label="New Date" style={{ width: 194 }} placeholder=""></MyDate>)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator("enddate")(<MyDate label="End Date" style={{ width: 194 }} placeholder=""></MyDate>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div style={{ margin: "auto", width: 100, padding: "30px 0px 0px" }}>
                  <Button type="primary" onClick={this.handleSubmit}>
                    Search
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="container">

        </div>
      </div>
    )
  }
}

const styles = {
  label: {
    width: 120,
    textAlign: 'center',
  }
} as any

export default Form.create()(Loglist)