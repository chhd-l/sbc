import React from 'react';
import { Icon, Button, Form, Row, Col, Input, Select } from 'antd';
import { Headline } from 'qmkit';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

class FeedBack extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      showMore: false,
      editable: false
    };
  }

  showMore = (stat: boolean) => {
    this.setState({
      showMore: stat
    });
  };

  render() {
    const { showMore, editable } = this.state;
    const { getFieldDecorator } = this.props.form;
    const labelCol1 = {
      xs: { span: 24 },
      sm: { span: 12 }
    };
    const labelCol2 = {
      xs: { span: 24 },
      sm: { span: 12, offset: 6 }
    };
    const wrapperCol = {
      xs: { span: 24 },
      sm: { span: 6 }
    };
    return (
      <div className="detail-container">
        <div>
          <Headline title="Feedback" extra={<div>{showMore && <Button type="primary">Edit</Button>}</div>}>
            <Button
              type="link"
              onClick={() => {
                this.showMore(!showMore);
              }}
            >
              <Icon type={showMore ? 'up' : 'down'} />
            </Button>
          </Headline>
        </div>
        <div style={{ display: showMore ? 'block' : 'none' }}>
          <Form labelAlign="left">
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-highlight">After welcome pack received</span>
              </Col>
              <Col span={18}>
                <Row gutter={8} type="flex" align="middle">
                  <Col span={12}>
                    <FormItem labelCol={labelCol1} wrapperCol={wrapperCol} label="Rate delivery(scale from 1 to 5):">
                      {getFieldDecorator(
                        'delivery',
                        {}
                      )(
                        <Select>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem labelCol={labelCol2} wrapperCol={wrapperCol} label="Rate the pack(scale from 1 to 5):">
                      {getFieldDecorator(
                        'pack',
                        {}
                      )(
                        <Select>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(FeedBack);
