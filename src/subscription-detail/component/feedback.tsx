import React from 'react';
import { Icon, Button, Form, Row, Col, Input, Select, Radio, message } from 'antd';
import { Headline } from 'qmkit';
import { getFeedbackBySubscriptionId, saveFeedback } from '../webapi';
import { FormComponentProps } from 'antd/lib/form';
import './feedback.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

interface Iprop extends FormComponentProps {
  subscriptionId: string;
}

class FeedBack extends React.Component<Iprop, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      showMore: false,
      editable: false,
      feedback: {}
    };
  }

  componentDidMount() {
    this.getFeedback();
  }

  getFeedback = () => {
    const { subscriptionId } = this.props;
    getFeedbackBySubscriptionId(subscriptionId).then((data) => {
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

  handleSave = () => {
    this.props.form.validateFields((err, fields) => {
      if (!err) {
        this.setState({ loading: true });
        saveFeedback({
          ...fields,
          subscriptionId: this.props.subscriptionId
        })
          .then((data) => {
            message.success('Save feedback successfully');
            this.setState({
              loading: false,
              editable: false
            });
          })
          .catch(() => {
            this.setState({
              loading: false
            });
          });
      }
    });
  };

  render() {
    const { showMore, editable, feedback, loading } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="container-search feedback-container">
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
                      {getFieldDecorator('rateDelivery', {
                        initialValue: feedback.rateDelivery
                      })(
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
                      {getFieldDecorator('ratePack', {
                        initialValue: feedback.ratePack
                      })(
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
                    <FormItem>{getFieldDecorator('rateComments', { initialValue: feedback.rateComments })(<TextArea disabled={!editable} cols={6} />)}</FormItem>
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
                    <div>(scale from 1 to 10)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('nps2rd', {
                        initialValue: feedback.nps2rd
                      })(
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
                      {getFieldDecorator('deliveryScheduleFit_2rd', {
                        initialValue: feedback.deliveryScheduleFit_2rd
                      })(
                        <Radio.Group disabled={!editable}>
                          <Radio value={1}>Yes</Radio>
                          <Radio value={0}>No</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8} offset={6}>
                    <FormItem>{getFieldDecorator('delivery_schedule_fit_reason_2rd', { initialValue: feedback.delivery_schedule_fit_reason_2rd })(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                <Row gutter={8} type="flex" align="middle">
                  <Col span={6}>Reason of interest of the Club:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('interestReason2rd', { initialValue: feedback.interestReason2rd })(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6}>Comments:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('comments2rd', { initialValue: feedback.comments2rd })(<TextArea disabled={!editable} cols={6} />)}</FormItem>
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
                      {getFieldDecorator('nps3rd', {
                        initialValue: feedback.nps3rd
                      })(
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
                      {getFieldDecorator('ratePaConsultationQuality', {
                        initialValue: feedback.ratePaConsultationQuality
                      })(
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
                    <FormItem>{getFieldDecorator('unnecessaryServices', { initialValue: feedback.unnecessaryServices })(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                <Row gutter={8} type="flex" align="middle">
                  <Col span={6}>Necessary services:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('necessaryServices', { initialValue: feedback.necessaryServices })(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={6}>Comments:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('comments3rd', { initialValue: feedback.comments3rd })(<TextArea disabled={!editable} cols={6} />)}</FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={6}>
                <span className="text-highlight">Feedback 4 (completion of Club)</span>
              </Col>
              <Col span={18}>
                <Row gutter={8}>
                  <Col span={6}>
                    <div>NPS:</div>
                    <div>(scale from 1 to 10)</div>
                  </Col>
                  <Col span={4}>
                    <FormItem>
                      {getFieldDecorator('nps4rd', {
                        initialValue: feedback.nps4rd
                      })(
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
                    <FormItem>{getFieldDecorator('reasonForCancellationOfMembership', { initialValue: feedback.reasonForCancellationOfMembership })(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                <Row gutter={8} type="flex" align="middle">
                  <Col span={6}>Suggestions for improvement:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('suggestionsForImprovement', { initialValue: feedback.suggestionsForImprovement })(<Input disabled={!editable} />)}</FormItem>
                  </Col>
                </Row>
                {/* <Row gutter={8}>
                  <Col span={6}>Comments:</Col>
                  <Col span={18}>
                    <FormItem>{getFieldDecorator('comments4rd', { initialValue: feedback.comments4rd })(<TextArea disabled={!editable} cols={6} />)}</FormItem>
                  </Col>
                </Row> */}
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
                      {getFieldDecorator('qualityOfService1', {
                        initialValue: feedback.qualityOfService1
                      })(
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
                      {getFieldDecorator('qualityOfService2', {
                        initialValue: feedback.qualityOfService2
                      })(
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
                      {getFieldDecorator('veterinarianQualification1', {
                        initialValue: feedback.veterinarianQualification1
                      })(
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
                      {getFieldDecorator('veterinarianQualification2', {
                        initialValue: feedback.veterinarianQualification2
                      })(
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
                      {getFieldDecorator('clinicsRating1', {
                        initialValue: feedback.clinicsRating1
                      })(
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
                      {getFieldDecorator('clinicsRating2', {
                        initialValue: feedback.clinicsRating2
                      })(
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
                      {getFieldDecorator('vetClinicCheckup1', {
                        initialValue: feedback.vetClinicCheckup1
                      })(
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
                      {getFieldDecorator('vetClinicCheckup2', {
                        initialValue: feedback.vetClinicCheckup1
                      })(
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
              <Button loading={loading} type="primary" onClick={this.handleSave} style={{ marginRight: 10 }}>
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
