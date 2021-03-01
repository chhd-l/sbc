import React from 'react';
import { Icon, Button, Form, Row, Col, Input, Select, Radio } from 'antd';
import { Headline } from 'qmkit';
import { getFeedbackByCustomerId } from '../webapi';
import { FormComponentProps } from 'antd/lib/form';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

interface Iprop extends FormComponentProps {
  customerId: string;
}

class FeedBack extends React.Component<Iprop, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      showMore: false,
      editable: false,
      feedback: {}
    };
  }

  componentDidMount() {
    this.getFeedback();
  }

  getFeedback = () => {
    const { customerId } = this.state;
    getFeedbackByCustomerId(customerId).then((data) => {
      this.setState({
        feedback: data.res.context
      });
    });
  };

  showMore = (stat: boolean) => {
    this.setState({
      showMore: stat
    });
  };

  changeEditable = (editable: boolean) => {
    this.setState({
      editable: editable
    });
  };

  render() {
    const { showMore, editable } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="detail-container">
        <div>
          <Headline
            title="Feedback"
            extra={
              <div>
                {showMore ? (
                  <Button type="primary" onClick={() => this.changeEditable(true)}>
                    Edit
                  </Button>
                ) : null}
              </div>
            }
          >
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
          <Form labelAlign="left" className="petowner-feedback-form">
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-highlight">After welcome pack received</span>
              </Col>
              <Col span={18}>
                <Row gutter={8}>
                  <Col span={6}>
                    <div>Rate delivery:</div>
                    <div>(scale from 1 to 5)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'delivery',
                        {}
                      )(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6} offset={4}>
                    <div>Rate the pack:</div>
                    <div>(scale from 1 to 5)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'pack',
                        {}
                      )(
                        <Select disabled={!editable}>
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
                <Row gutter={8}>
                  <Col span={6}>
                    <div>Comments:</div>
                  </Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('com', {})(<TextArea disabled={!editable} cols={6} />)}</FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-highlight">During 2nd delivery confirmation</span>
              </Col>
              <Col span={18}>
                <Row gutter={8}>
                  <Col span={6}>
                    <div>NPS:</div>
                    <div>(scale from 1 to 5)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'nps',
                        {}
                      )(
                        <Select disabled={!editable}>
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
                <Row gutter={8} type="flex" align="middle">
                  <Col span={6}>Delivery schedule fit:</Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'sch',
                        {}
                      )(
                        <Radio.Group disabled={!editable}>
                          <Radio value={1}>Yes</Radio>
                          <Radio value={0}>No</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} offset={6}>
                    <FormItem>{getFieldDecorator('scht', {})(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                <Row gutter={8} type="flex" align="middle">
                  <Col span={6}>Reason of interest of the Club:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('reason', {})(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6}>Comments:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('comm', {})(<TextArea disabled={!editable} cols={6} />)}</FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-highlight">After 3rd delivery, during 4th delivery confirmation</span>
              </Col>
              <Col span={18}>
                <Row gutter={8}>
                  <Col span={6}>
                    <div>NPS:</div>
                    <div>(scale from 1 to 10)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'npss',
                        {}
                      )(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6} offset={4}>
                    <div>Rate PA consultation quality:</div>
                    <div>(scale from 1 to 5)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'pack',
                        {}
                      )(
                        <Select disabled={!editable}>
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
                <Row gutter={8} type="flex" align="middle">
                  <Col span={6}>Unnecessary services:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('unne', {})(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                <Row gutter={8} type="flex" align="middle">
                  <Col span={6}>Necessary services:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('nece', {})(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6}>Comments:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('comm1', {})(<TextArea disabled={!editable} cols={6} />)}</FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-highlight">Feedback 4(completion of Club)</span>
              </Col>
              <Col span={18}>
                <Row gutter={8}>
                  <Col span={6}>
                    <div>NPS:</div>
                    <div>(scale from 1 to 10)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'nps',
                        {}
                      )(
                        <Select disabled={!editable}>
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
                <Row gutter={8} type="flex" align="middle">
                  <Col span={6}>Reason for cancellation of membership:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('rcan', {})(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                <Row gutter={8} type="flex" align="middle">
                  <Col span={6}>Suggestions for improvement:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('sugg', {})(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6}>Comments:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('comm2', {})(<TextArea disabled={!editable} cols={6} />)}</FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-highlight">Feedback for clinics</span>
              </Col>
              <Col span={18}>
                <Row gutter={8}>
                  <Col span={12}>
                    <div className="text-align-center text-highlight">Visit 1</div>
                  </Col>
                  <Col span={12}>
                    <div className="text-align-center text-highlight">Visit 2</div>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6}>
                    <div>Quality of service 1:</div>
                    <div>(scale from 1 to 5)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'qs1',
                        {}
                      )(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6} offset={4}>
                    <div>Quality of service 2:</div>
                    <div>(scale from 1 to 5)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'qs2',
                        {}
                      )(
                        <Select disabled={!editable}>
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
                <Row gutter={8}>
                  <Col span={6}>
                    <div>Veterinarian qualification 1:</div>
                    <div>(scale from 1 to 5)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'vet1',
                        {}
                      )(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6} offset={4}>
                    <div>Veterinarian qualification 2:</div>
                    <div>(scale from 1 to 5)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'vet2',
                        {}
                      )(
                        <Select disabled={!editable}>
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
                <Row gutter={8}>
                  <Col span={6}>
                    <div>Clinics rating 1 of the last visiting clinic:</div>
                    <div>(scale from 1 to 5)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'cv1',
                        {}
                      )(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6} offset={4}>
                    <div>Clinics rating 2 of the last visiting clinic:</div>
                    <div>(scale from 1 to 5)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'cv2',
                        {}
                      )(
                        <Select disabled={!editable}>
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
                <Row gutter={8}>
                  <Col span={6}>
                    <div>Vet clinic check-up 1:</div>
                    <div>(scale from 1 to 5)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'cek1',
                        {}
                      )(
                        <Select disabled={!editable}>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6} offset={4}>
                    <div>Vet clinic check-up 2:</div>
                    <div>(scale from 1 to 5)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator(
                        'cek2',
                        {}
                      )(
                        <Select disabled={!editable}>
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
          {editable && (
            <div>
              <Button type="primary" style={{ marginRight: 10 }}>
                Save
              </Button>
              <Button onClick={() => this.changeEditable(false)}>Cancel</Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Form.create<Iprop>()(FeedBack);
