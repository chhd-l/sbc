import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import { Form, DatePicker, Input } from 'antd';
import './index.less';
import {Const, QMMethod} from 'qmkit';

const { RangePicker } = DatePicker;

export default class BasicInformation extends Component<any, any>{

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        };

        const rangeConfig = {
            rules: [
                {
                    required: true,
                    message: (window as any).RCi18n({
                        id: 'Marketing.PleaseSelectStartingAndEndTime'
                    })
                },
                {
                    validator: (_rule, value, callback) => {
                        if (value[0]) {
                            callback();
                        } else {
                            callback(
                                (window as any).RCi18n({
                                    id: 'Marketing.PleaseSelectStartingAndEndTime'
                                })
                            );
                        }
                    }
                }
            ],
        };
        const inputConfig = {
            rules: [
                {
                    required: true,
                    whitespace: true,
                    message:
                        (window as any).RCi18n({
                            id: 'Marketing.PleaseInputPromotionName'
                        })
                },
                { min: 1, max: 40, message:
                        (window as any).RCi18n({
                            id: 'Marketing.40Words'
                        })
                },
                {
                    validator: (rule, value, callback) => {
                        QMMethod.validatorEmoji(rule, value, callback,
                            (window as any).RCi18n({
                                id: 'Marketing.PromotionName'
                            })
                        );
                    }
                }
            ],

        }
        return (
            <div className='BasicInformation-wrap'>
                <div className='BasicInformation-title'>
                    <FormattedMessage id="Subscription.basicInformation" />
                </div>
                <div>
                    <Form.Item label={<FormattedMessage id={'Subscription.Campaign name'}/>}>
                        {getFieldDecorator('marketingName', inputConfig)(<Input />)}
                    </Form.Item>
                    <Form.Item label={<FormattedMessage id={'Subscription.start and end time'} />}>
                        {getFieldDecorator('timers', rangeConfig)(
                            <RangePicker
                                format={Const.DATE_FORMAT}
                                placeholder={[
                                    (window as any).RCi18n({
                                                                                           id: 'Marketing.StartTime'
                                                                                       }), (window as any).RCi18n({
                                                                                           id: 'Marketing.EndTime'
                                                                                       })
                                ]}
                                showTime={{ format: 'HH:mm' }} />)}
                    </Form.Item>
                </div>
            </div>
        );
    }
}
