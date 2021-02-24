import React from 'react';
import { Icon, Button, Form, Row, Col, Input, Select, Radio } from 'antd';
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
      sm: { span: 14 }
    };
    const labelCol2 = {
      xs: { span: 24 },
      sm: { span: 14, offset: 4 }
    };
    const labelCol3 = {
      xs: { span: 24 },
      sm: { span: 6 }
    };
    const wrapperCol = {
      xs: { span: 24 },
      sm: { span: 6 }
    };
    const wrapperCol2 = {
      xs: { span: 24 },
      sm: { span: 18 }
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
                <Row>
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
                  <Col span={24}>
                    <FormItem labelCol={labelCol3} wrapperCol={wrapperCol2} label="Comments:">
                      {getFieldDecorator('com', {})(<TextArea cols={6} />)}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-highlight">During 2nd delivery confirmation</span>
              </Col>
              <Col span={18}>
                <Row>
                  <Col span={12}>
                    <FormItem labelCol={labelCol1} wrapperCol={wrapperCol} label="NPS(scale from 1 to 10):">
                      {getFieldDecorator(
                        'nps',
                        {}
                      )(
                        <Select>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem labelCol={labelCol1} wrapperCol={wrapperCol} label="Delivery schedule fit:">
                      {getFieldDecorator(
                        'sch',
                        {}
                      )(
                        <Radio.Group>
                          <Radio value={1}>Yes</Radio>
                          <Radio value={0}>No</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={9} offset={3}>
                    <FormItem>{getFieldDecorator('scht', {})(<Input />)}</FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem labelCol={labelCol3} wrapperCol={wrapperCol2} label="Reason of interest of the Club:">
                      {getFieldDecorator('reason', {})(<Input />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem labelCol={labelCol3} wrapperCol={wrapperCol2} label="Comments:">
                      {getFieldDecorator('comm', {})(<TextArea cols={6} />)}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-highlight">After 3rd delivery, during 4th delivery confirmation</span>
              </Col>
              <Col span={18}>
                <Row>
                  <Col span={12}>
                    <FormItem labelCol={labelCol1} wrapperCol={wrapperCol} label="NPS(scale from 1 to 10):">
                      {getFieldDecorator(
                        'npss',
                        {}
                      )(
                        <Select>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem labelCol={labelCol2} wrapperCol={wrapperCol} label="Rate PA consultation quality(scale from 1 to 5):">
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
                  <Col span={24}>
                    <FormItem labelCol={labelCol3} wrapperCol={wrapperCol2} label="Unnecessary services:">
                      {getFieldDecorator('unne', {})(<Input />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem labelCol={labelCol3} wrapperCol={wrapperCol2} label="Necessary services:">
                      {getFieldDecorator('nece', {})(<Input />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem labelCol={labelCol3} wrapperCol={wrapperCol2} label="Comments:">
                      {getFieldDecorator('comm1', {})(<TextArea cols={6} />)}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-highlight">Feedback 4(completion of Club)</span>
              </Col>
              <Col span={18}>
                <Row>
                  <Col span={12}>
                    <FormItem labelCol={labelCol1} wrapperCol={wrapperCol} label="NPS(scale from 1 to 10):">
                      {getFieldDecorator(
                        'nps',
                        {}
                      )(
                        <Select>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem labelCol={labelCol3} wrapperCol={wrapperCol2} label="Reason for cancellation of membership:">
                      {getFieldDecorator('rcan', {})(<Input />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem labelCol={labelCol3} wrapperCol={wrapperCol2} label="Suggestions for improvement:">
                      {getFieldDecorator('sugg', {})(<Input />)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem labelCol={labelCol3} wrapperCol={wrapperCol2} label="Comments:">
                      {getFieldDecorator('comm2', {})(<TextArea cols={6} />)}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-highlight">Feedback for clinics</span>
              </Col>
              <Col span={18}>
                <Row>
                  <Col span={12}>
                    <div className="text-align-center text-highlight">Visit 1</div>
                  </Col>
                  <Col span={12}>
                    <div className="text-align-center text-highlight">Visit 2</div>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem labelCol={labelCol1} wrapperCol={wrapperCol} label="Quality of service 1(scale from 1 to 5):">
                      {getFieldDecorator(
                        'qs1',
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
                    <FormItem labelCol={labelCol2} wrapperCol={wrapperCol} label="Quality of service 2(scale from 1 to 5):">
                      {getFieldDecorator(
                        'qs2',
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
                    <FormItem labelCol={labelCol1} wrapperCol={wrapperCol} label="Veterinarian qualification 1(scale from 1 to 5):">
                      {getFieldDecorator(
                        'vet1',
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
                    <FormItem labelCol={labelCol2} wrapperCol={wrapperCol} label="Veterinarian qualification 2(scale from 1 to 5):">
                      {getFieldDecorator(
                        'vet2',
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
                    <FormItem labelCol={labelCol1} wrapperCol={wrapperCol} label="Clinics rating 1 of the last visiting clinic(scale from 1 to 5):">
                      {getFieldDecorator(
                        'cv1',
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
                    <FormItem labelCol={labelCol2} wrapperCol={wrapperCol} label="Clinics rating 2 of the last visiting clinic(scale from 1 to 5):">
                      {getFieldDecorator(
                        'cv2',
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
                    <FormItem labelCol={labelCol1} wrapperCol={wrapperCol} label="Vet clinic check-up 1(scale from 1 to 5):">
                      {getFieldDecorator(
                        'cek1',
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
                    <FormItem labelCol={labelCol2} wrapperCol={wrapperCol} label="Vet clinic check-up 2(scale from 1 to 5):">
                      {getFieldDecorator(
                        'cek2',
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
