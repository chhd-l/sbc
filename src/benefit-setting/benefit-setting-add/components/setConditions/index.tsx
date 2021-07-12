import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import { Form, Radio, Select } from 'antd';
import { Relax} from 'plume2';
import './index.less';
import {noop} from 'qmkit';

const { Option } = Select;

@Relax
export default class SetConditions extends Component<any, any>{

    props: {
        form: any;
        relaxProps?: {
            allGroups: any;
            formObj: any;
            giftBeanOnChange: Function;
        };
    };
    static relaxProps = {
        allGroups: 'allGroups',
        formObj: 'formObj',
        giftBeanOnChange: noop,

    };

    onChange = (e) => {
        console.log('value', e.target.value);
    }

    handleChange = (value) => {
        console.log(`selected ${value}`);
    }

    onBeanChange = (params) => {
        const { formObj, giftBeanOnChange } = this.props.relaxProps;
        giftBeanOnChange(formObj.merge(params));
    };

    onTagChange = (e) => {
        this.onBeanChange({
            isTags: e.target.value,
        });
    };

    onSegmentIdChange = (segmentIds) => {
        this.onBeanChange({
            segmentIds
        })
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {
            allGroups,
            formObj,
        } = this.props.relaxProps;

        let isTags = getFieldValue('isTags')

        const selectConfig = {
            rules: [{ required: true,  message: 'Please Select your tags!'}],
            initialValue: formObj.get('segmentIds') || '',
        }
        const radioConfig = {
            initialValue: formObj.get('isTags') || true
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
                        <Form.Item label={''}>
                            {getFieldDecorator('isTags', radioConfig)(
                                <Radio.Group onChange={e => this.onTagChange(e)}>
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
                                isTags
                                    ? (
                                        <Form.Item label=''>
                                            {getFieldDecorator('segmentObj', selectConfig)(
                                                <Select
                                                    style={{ width: '100%' }}
                                                    placeholder="Please select"
                                                    onChange={this.onSegmentIdChange}
                                                >
                                                    {allGroups.size > 0 &&
                                                    allGroups.toJS().map((item) => (
                                                        <Option key={item.id} value={JSON.stringify(item)}>
                                                            {item.name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            )
                                            }
                                        </Form.Item>
                                    )
                                    : null
                            }
                        </div>
                </div>
            </div>
        );
    }
}
