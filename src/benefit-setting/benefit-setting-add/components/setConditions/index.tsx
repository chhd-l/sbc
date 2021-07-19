import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import { Form, Radio, Select } from 'antd';
import './index.less';
import {Const, noop} from 'qmkit';
import * as commonWebapi from '@/benefit-setting/webapi';

const { Option } = Select;

export default class SetConditions extends Component<any, any>{

    constructor(props) {
        super(props);
        this.state = {
            allGroups: []
        }
    }
    componentDidMount() {
        this.getAllGroups();
    }

    getAllGroups = async () => {
        const { res } = await commonWebapi.getAllGroups({
            pageNum: 0,
            pageSize: 1000000,
            segmentType: 0,
            isPublished: 1
        });

        // @ts-ignore
        if (res.code == Const.SUCCESS_CODE) {
            // this.dispatch('marketing:allGroups', res.context.segmentList);
            // @ts-ignore
            this.setState({
                allGroups: res.context.segmentList
            })
        } else {
            // message.error('load group error.');
        }
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        let { allGroups } = this.state;
        let { initData } = this.props;

        let isTags = getFieldValue('isTags');

        const selectConfig = {
            rules: [{
                required: true,
                message: (window as any).RCi18n({
                    id: 'Subscription.PleaseSelectYourTags!'
                })
            }],
            initialValue: !!initData && (initData.joinLevel === '-3') ? initData.segmentIds[0] : null,
        }
        const radioConfig = {
            initialValue: !!initData ? (initData.joinLevel === '-3') : false
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
                    <div className='setConditions-isTags-warp'>
                        <Form.Item label={''}>
                            {getFieldDecorator('isTags', radioConfig)(
                                <Radio.Group
                                    // onChange={e => this.onTagChange(e)}
                                >
                                    <Radio style={radioStyle} value={true}>
                                        <FormattedMessage id={'Subscription.tags'}/>
                                    </Radio>
                                    <Radio style={radioStyle} value={false}>
                                        <FormattedMessage id={'Subscription.NO threshold'}/>
                                    </Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    </div>

                    <div className='setConditions-segmentIds-warp'>
                            {
                                isTags
                                    ? (
                                        <Form.Item label=''>
                                            {getFieldDecorator('segmentIds', selectConfig)(
                                                <Select
                                                    // allowClear
                                                    style={{ width: '100%' }}
                                                    placeholder="Please select"
                                                    // onChange={this.onSegmentIdChange}
                                                >
                                                    {(allGroups.length > 0) &&
                                                    allGroups.map((item) => (
                                                        <Option key={item.id} value={item.id}>
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
