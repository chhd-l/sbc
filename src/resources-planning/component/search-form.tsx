import React from 'react';
import { Form, Row, Col, Input, Button, Select } from 'antd';
import { SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const styles = {
  label: {
    width: 151,
    textAlign: 'center'
  },
  wrapper: {
    width: 177
  }
} as any;

const { Option } = Select;
const FormItem = Form.Item;

// @ts-ignore
@Form.create()
export default class SearchForm extends React.Component<any, any>{
  constructor(props) {
    super(props);
  }

  // handleSubmit = e => {
  //     e.preventDefault();
  //     this.props.form.validateFields((err, values) => {
  //         if (!err) {
  //             console.log('Received values of form: ', values);
  //             this.props.onSearch({
  //                 pageNum: 0,
  //                 pageSize: 10,
  //                 ...values,
  //             });
  //         }
  //     });
  // };

  render() {
    let {
      getFieldDecorator,
    } = this.props.form;

    return (
      <div>
        <Form
          // onSubmit={this.handleSubmit}
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
                        <p style={styles.label}>
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
                        <p style={styles.label}>
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
                  allowClear
                  // getPopupContainer={() => document.getElementById('page-content')}
                  // style={styles.wrapper}
                  label={
                    <p style={styles.label}>
                      <FormattedMessage id="Resources.service_type" />
                    </p>
                  }
                  // showSearch
                  optionFilterProp="children"
                  // onChange={(value) => {
                  //   onFormFieldChange({ key: 'brandId', value });
                  // }}
                >
                 <Option  value='all'>all</Option>
                </SelectGroup>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem >
                <SelectGroup
                style={{ width: 177 }}
                  allowClear
                  // getPopupContainer={() => document.getElementById('page-content')}
                  // style={styles.wrapper}
                  label={
                    <p style={styles.label}>
                      <FormattedMessage id="Resources.appointment_type" />
                    </p>
                  }
                  // showSearch
                  optionFilterProp="children"
                  // onChange={(value) => {
                  //   onFormFieldChange({ key: 'brandId', value });
                  // }}
                >
                 <Option  value='all'>all</Option>
                </SelectGroup>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem >
                <SelectGroup
                style={{ width: 177 }}
                  allowClear
                  // getPopupContainer={() => document.getElementById('page-content')}
                  // style={styles.wrapper}
                  label={
                    <p style={styles.label}>
                      <FormattedMessage id="Resources.planned_status" />
                    </p>
                  }
                  // showSearch
                  optionFilterProp="children"
                  // onChange={(value) => {
                  //   onFormFieldChange({ key: 'brandId', value });
                  // }}
                >
                 <Option  value='yes'>Yes</Option>
                 <Option  value='no'>No</Option>
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