import React from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd';
import { FormattedMessage } from 'react-intl';

const styles = {
  label: {
    width: 151,
    textAlign: 'center'
  }
} as any;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

// @ts-ignore
@Form.create()
export default class SearchForm extends React.Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      formValues: {}
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      const rangeDate = values["startDate"]
      const params = Object.assign(this.state.formValues, {
        ...values,
        startDate: rangeDate[0].format('YYYY-MM-DD'),
        endDate: rangeDate[1].format('YYYY-MM-DD'),
      })
      if (!err) {
        this.props.onSearch({
          pageNum: 0,
          pageSize: 10,
          ...params,
        });
      }
    });
  };

  render() {
    let {
      getFieldDecorator,
    } = this.props.form;
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
                  getFieldDecorator('surveyNumber')(
                    <Input
                      addonBefore={
                        <p style={styles.label}>
                          <FormattedMessage id="Survey.survey_number" />
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
                  getFieldDecorator('title')(
                    <Input
                      addonBefore={
                        <p style={styles.label}>
                          <FormattedMessage id="Survey.title" />
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
                {getFieldDecorator('startDate')(<RangePicker />)}
              </FormItem>
            </Col>
            <Col span={24} style={{ textAlign: 'center', marginTop: "20px" }}>
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