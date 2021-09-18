import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import { Form, DatePicker, Input, Radio } from 'antd';
import './index.less';
import {Const} from 'qmkit';
import moment from 'moment';
import config from '../../../configs';

const { RangePicker } = DatePicker;

export default class BasicInformation extends Component<any, any>{

    constructor(props) {
        super(props);
    }
    

    render() {
        const {initData, form, benefitType} = this.props;
        const { getFieldDecorator, setFieldsValue } = form;
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
            ], initialValue: !!initData  ? [moment(initData.beginTime), moment(initData.endTime)]:undefined

        };
        const inputConfig = {
            rules: [
                {
                    required: true,
                    message:
                        (window as any).RCi18n({
                            id: 'Subscription.PleaseInputCampaignName'
                        })
                },
                { min: 1, max: 40, message:
                        (window as any).RCi18n({
                            id: 'Marketing.40Words'
                        })
                },
            ], initialValue: !!initData ? initData.marketingName : undefined
        }

        return (
            <div className='BasicInformation-wrap'>
                <div className='BasicInformation-title'>
                    <FormattedMessage id={ "Subscription.basicInformation"} />
                </div>
                <div>
                    <Form.Item label={<FormattedMessage id={benefitType === config.CONSUMPTION_GIFT ? 'Subscription.Campaign name' : 'Subscription.WelcomeboxName'}/>}>
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
                    {benefitType === config.WELCOME_BOX && <Form.Item label={<FormattedMessage id={'Subscription.SubscriptionType'} />}>
                        {getFieldDecorator('type')(
                            <Radio.Group>
                                <Radio value="individual"><FormattedMessage id={'Product.Individual'} /></Radio>
                                <Radio value="club"><FormattedMessage id={'Product.Club'} /></Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>}
                </div>
            </div>
        );
    }
}
