import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import { Form, DatePicker, Input } from 'antd';
import './index.less';
import {Const} from 'qmkit';
import moment from 'moment';

const { RangePicker } = DatePicker;

export default class BasicInformation extends Component<any, any>{

    constructor(props) {
        super(props);
    }
    

    render() {
        const {initData, form} = this.props;
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
