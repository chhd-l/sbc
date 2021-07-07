import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import { Form, DatePicker, Input } from 'antd';
import './index.less';

const { RangePicker } = DatePicker;

class BasicInformation extends Component<any, any>{

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
            rules: [{ type: 'array', required: true, message: 'Please select time!' }],
        };
        const inputConfig = {
            rules: [
                {
                    required: true,
                    message: 'Please input your CampaignName!',
                },
            ]
        }
        return (
            <div className='BasicInformation-wrap'>
                <div className='BasicInformation-title'>
                    <FormattedMessage id="Subscription.basicInformation" />
                </div>
                <Form {...formItemLayout}>
                    <Form.Item label={<FormattedMessage id={'Subscription.Campaign name'}/>}>
                        {getFieldDecorator('CampaignName', inputConfig)(<Input />)}
                    </Form.Item>
                    <Form.Item label={<FormattedMessage id={'Subscription.start and end time'} />}>
                        {getFieldDecorator('range-picker', rangeConfig)(<RangePicker />)}
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
const BasicInformationForm = Form.create()(BasicInformation);
export default BasicInformationForm;