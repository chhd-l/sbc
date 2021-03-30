import { Checkbox, Col, DatePicker, Form, Input, Radio, Row, Select } from 'antd'
import React, { Component } from 'react'
const { Option } = Select;
export default class FillinPetInfo extends Component {
    props: {
        form: any
    }


    render() {
        const { getFieldDecorator } = this.props.form
        const options = [
            { label: 'Mix breed', value: 1 },
            { label: 'Unknow', value: 2 }
        ];
        return (
            <Form style={{width:'50%',margin:'0 auto'}}>
                <Row gutter={20}>
                    <Col span={8}>
                        <Form.Item label="Date:">
                            {getFieldDecorator('select1', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<DatePicker  style={{width:'100%'}}/>)}
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
                            {getFieldDecorator('select4', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Gender:">
                            {getFieldDecorator('select5', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Radio.Group >
                                <Radio value={1}>Female</Radio>
                                <Radio value={2}>Male</Radio>
                            </Radio.Group>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Date of birth:">
                            {getFieldDecorator('select6', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Breed:">
                            {getFieldDecorator('select7', {
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
                            {getFieldDecorator('select9', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Input />)}
                        </Form.Item>


                    </Col>
                    <Col span={12}>
                        <Form.Item label="Lifestyle">
                            {getFieldDecorator('select10', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Select defaultValue="lucy" >
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                                <Option value="disabled" disabled>
                                    Disabled
                            </Option>
                                <Option value="Yiminghe">yiminghe</Option>
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Activity:">
                            {getFieldDecorator('select11', {
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Select defaultValue="lucy">
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                                <Option value="disabled" disabled>
                                    Disabled
                        </Option>
                                <Option value="Yiminghe">yiminghe</Option>
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item label="Weight">
                                    {getFieldDecorator('select12', {
                                        rules: [{ required: true, message: 'Please select your country!' }],
                                    })(<Input />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Weight">
                                    {getFieldDecorator('select13', {
                                        rules: [{ required: true, message: 'Please select your country!' }],
                                    })(<Select defaultValue="lucy">
                                        <Option value="jack">Kg</Option>
                                        <Option value="lucy">g</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
                                    </Select>)}
                                </Form.Item>
                            </Col>
                        </Row>


                    </Col>
                    <Col span={12}>
                        <Form.Item label="Sterilzed">
                            {getFieldDecorator('select14', {
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
