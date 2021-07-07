import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import { Form, Radio, Select } from 'antd';
import './index.less';

const { Option } = Select;
class SetConditions extends Component<any, any>{
    componentDidMount() {
        //初始化setConditions为true
        this.props.form.setFieldsValue({
            setConditions: true
        });
    }

    onChange = (e) => {
        console.log('value', e.target.value);
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
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
        let isSetConditions = getFieldValue('setConditions')


        const inputConfig = {
            rules: [{ required: true,  message: 'Please input your CampaignName!',},]
        }
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <div className='SetConditions-wrap'>
                <div className='SetConditions-title'>
                    <FormattedMessage id="Subscription.setConditions" />
                </div>
                <div className='SetConditions-content'>
                    <Form {...formItemLayout}>
                        <Form.Item label={''}>
                            {getFieldDecorator('setConditions')(
                                <Radio.Group onChange={this.onChange}>
                                    <Radio style={radioStyle} value={true}>
                                        <FormattedMessage id={'Subscription.tags'}/>
                                    </Radio>
                                    <Radio style={radioStyle} value={false}>
                                        <FormattedMessage id={'Subscription.NO threshold'}/>
                                    </Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        <div className='setConditionsSelect-box'>
                            {
                                isSetConditions
                                    ? (
                                        <Form.Item label=''>
                                            {getFieldDecorator('setConditionsSelect', inputConfig)(<Select
                                                mode="multiple"
                                                style={{ width: '100%' }}
                                                placeholder="Please select"
                                            >
                                                <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                            </Select>)}
                                        </Form.Item>
                                    ): null
                            }
                        </div>
                    </Form>

                </div>
            </div>
        );
    }
}
const SetConditionsForm = Form.create()(SetConditions);
export default SetConditionsForm;