import { Checkbox, Col, DatePicker, Form, Input, Radio, Row, Select } from 'antd'
import React, { Component } from 'react'
const { Option } = Select;
import { querySysDictionary } from '../webapi'
export default class FillinPetInfo extends Component {
    props: {
        form: any
    }
    state = {
        lifeList: [],
        activityList: [],
        activity: '',
        lifestyle: '',
        weightObj: {
            measure: '',
            measureUnit: '',
            type: 2
        }
    }

    async componentDidMount() {
        let { res: lifestyleOptions } = await querySysDictionary({ type: 'Lifestyle' });
        let { res: activityOptions } = await querySysDictionary({ type: 'Activity' });
        let lifeList = lifestyleOptions.context.sysDictionaryVOS.map((el) => {
            el.value = el.valueEn;
            return el;
        });
        let activityList = activityOptions.context.sysDictionaryVOS.map((el) => {
            el.value = el.valueEn;
            return el
        });
        this.setState({
            lifeList,
            activityList
        });
        console.log(lifestyleOptions)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { lifeList, activityList, } = this.state
        const options = [
            { label: 'Mix breed', value: 1 },
            { label: 'Unknow', value: 2 }
        ];
        return (
            <Form style={{ width: '50%', margin: '0 auto' }}>
                <Row gutter={20}>
                    <Col span={8}>
                        <Form.Item label="Date:">
                            {getFieldDecorator('select1', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Expert name:">
                            {getFieldDecorator('select2', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="pour[First Name Last Name]:">
                            {getFieldDecorator('select3', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={20} >
                    <Form.Item label="">
                        <span className="ant-form-text">Information sur le chat:</span>
                    </Form.Item>
                    <Col span={12}>
                        <Form.Item label="Name:">
                            {getFieldDecorator('petsName', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Gender:">
                            {getFieldDecorator('petsSex', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Radio.Group >
                                <Radio value={1}>Female</Radio>
                                <Radio value={2}>Male</Radio>
                            </Radio.Group>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Date of birth:">
                            {getFieldDecorator('birthOfPets', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Breed:">
                            {getFieldDecorator('petsBreed', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('select8', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Checkbox.Group options={options} defaultValue={['Apple']} />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Sensitvities:">
                            {getFieldDecorator('sensitivity', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Select>
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>

                            </Select>)}
                        </Form.Item>


                    </Col>
                    <Col span={12}>
                        <Form.Item label="Lifestyle">
                            {getFieldDecorator('lifestyle', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Select >
                                {lifeList.map((item) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Activity:">
                            {getFieldDecorator('activity', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Select>
                                {activityList.map((item) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>


                        <Form.Item label="Weight">
                            <Row gutter={20}>
                                <Col span={12}>
                                    {getFieldDecorator('weight', {
                                        rules: [{ required: true, message: 'Please select your country!' }],
                                    })(<Input />)}
                                </Col>
                                <Col span={12}>
                                    {getFieldDecorator('weightCategory', {

                                    })(<Select >
                                        <Option value="jack">Kg</Option>
                                        <Option value="lucy">g</Option>
                                    </Select>)}
                                </Col>
                            </Row>
                        </Form.Item>





                    </Col>
                    <Col span={12}>
                        <Form.Item label="Sterilzed">
                            {getFieldDecorator('sterilized', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Radio.Group >
                                <Radio value={1}>Yes</Radio>
                                <Radio value={0}>No</Radio>
                            </Radio.Group>)}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>


        )
    }
}
