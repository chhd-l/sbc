import React from 'react';
import { Form, Row, Col, Input, Button, Select } from 'antd';
import { SelectGroup, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const styles = {
  label: {
    width: 151,
    textAlign: 'center'
  }
} as any;

const { Option } = Select;
const FormItem = Form.Item;

const optionTest = [{
  label: '1',
  value: 'a',
}, {
  label: '2',
  value: 'b',
}, {
  label: '3',
  value: 'c',
},]

// @ts-ignore
@Form.create()
export default class SearchForm extends React.Component<any, any>{
  constructor(props) {
    super(props);
    this.state={
      formValues:{}
    }
  }

  handleSelectChange = (key, value) =>{
    const formVal = Object.assign(this.state.formValues,{
      [key]:value
    })
    this.setState({
      formValues:formVal
    })
  }
  handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        const params = Object.assign(this.state.formValues,{
          ...values
        })
          if (!err) {
              this.props.onSearch({
                  // pageNum: 0,
                  // pageSize: 10,
                  ...params,
              });
          }
      });
  };

  render() {
    let {
      getFieldDecorator,
    } = this.props.form;
    const {serviceTypeDict,appointmentTypeDict} = this.props;
    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
          className="filter-content"
          layout="inline"
        >
          <Row>
            <Col span={8}>
              <FormItem>
                {
                  getFieldDecorator('email')(
                    <Input
                      addonBefore={
                        <p style={styles.label} title={RCi18n({id:'Resources.email'})}>
                          <FormattedMessage id="Resources.email" />
                        </p>
                      }
                      style={{ width: 351 }}
                    />
                  )
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {
                  getFieldDecorator('name')(
                    <Input
                      addonBefore={
                        <p style={styles.label} title={RCi18n({id:'Resources.name'})}>
                          <FormattedMessage id="Resources.name" />
                        </p>
                      }
                      style={{ width: 351 }}
                    />
                  )
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem >
              <SelectGroup
                  style={{ width: 177 }}
                  id="service-type"
                  allowClear
                  getPopupContainer={() => document.getElementById('service-type')}
                  label={
                    <p style={styles.label} title={RCi18n({id:'Resources.service_type'})}>
                      <FormattedMessage id="Resources.service_type" />
                    </p>
                  }
                onChange={(value) =>this.handleSelectChange('serviceTypeId', value ) }
                >
                  {serviceTypeDict?.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                </SelectGroup>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem >
                <SelectGroup
                  style={{ width: 177 }}
                  allowClear
                  id="appointment-type"
                  getPopupContainer={() => document.getElementById('appointment-type')}
                  label={
                    <p style={styles.label} title={RCi18n({id:'Resources.appointment_type'})}>
                      <FormattedMessage id="Resources.appointment_type" />
                    </p>
                  }
                  onChange={(value) =>this.handleSelectChange('appointmentTypeId', value ) }
                >
                    {appointmentTypeDict?.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                </SelectGroup>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem >
                <SelectGroup
                  style={{ width: 177 }}
                  allowClear
                  id="planned-status"
                  getPopupContainer={() => document.getElementById('planned-status')}
                  label={
                    <p style={styles.label} title={RCi18n({id:'Resources.planned_status'})}>
                      <FormattedMessage id="Resources.planned_status" />
                    </p>
                  }
                  onChange={(value) =>this.handleSelectChange('arranged', value ) }
                >
                  <Option value={1}><FormattedMessage id="Product.yes"/></Option>
                  <Option value={0}><FormattedMessage id="Product.No"/></Option>
                </SelectGroup>
              </FormItem>
            </Col>
            <Col span={24} style={{ textAlign: 'center' }}>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="search"
                  shape="round"
                >
                  <FormattedMessage id="Product.search" />
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}