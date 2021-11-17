import { Form, Icon, Input, Button, Checkbox, Select, TimePicker, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';

class FormSchedular extends React.Component {
    props: {
        form: any
        handleSubmit: Function
        onCancel:Function
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const blockSlotVO = {
                    "id": "",
                    "startTime": moment(values.startTime).format('YYYYMMDD HH:mm'),
                    "endTime": moment(values.endTime).format('YYYYMMDD HH:mm'),
                    "dateNo": moment(values.endTime).format('YYYYMMDD'),
                    "notes": values.nates
                }
                this.props.handleSubmit({blockSlotVO})
                console.log('Received values of form: ', blockSlotVO);
            }
        });
    };

    // {
    //   "expertId": "",
    //   "blockSlotVO": {
    //     "id": "",
    //     "startTime": "20200101 10:15",
    //     "endTime": "20200101 11:00",
    //     "dateNo": "",
    //     "notes": ""
    //   }
    // }

    handleOpenChange = open => {
        if (open) {
            this.setState({ mode: 'time' });
        }
    };
    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }
    handlePanelChange = (value, mode) => {
        this.setState({ mode });
    };
    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current <= moment().day(1).endOf('day');
    }
    disabledDateTime = (e) => {
        //   console.log(e,'----',moment(e).format('YYYY-MM-DD HH:mm'))

        return this.range(0, 24).splice(0, moment().hour());
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                sm: { span: 6 },
            },
            wrapperCol: {
                sm: { span: 18 },
            },
        };
        return (
            <Form labelAlign="left" {...formItemLayout} onSubmit={this.handleSubmit} className="login-form" >

                <Form.Item label="Type">
                    {getFieldDecorator('bookType', {
                        initialValue: '1',
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Select
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="1">{<FormattedMessage id="Appointment.Blocked" />}</Select.Option>
                            {/* <Select.Option value="1">{<FormattedMessage id="Appointment.Arrived" />}</Select.Option>
                            <Select.Option value="2">{<FormattedMessage id="Appointment.Canceled" />}</Select.Option> */}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Start">
                    {getFieldDecorator('startTime', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <TimePicker minuteStep={15} disabledHours={this.disabledDateTime} style={{ width: '100%' }} format='HH:mm' />
                        // <DatePicker disabledDate={this.disabledDate}
                        //     disabledTime={this.disabledDateTime}
                        //     format="YYYY-MM-DD HH:mm"
                        //     style={{ width: '100%' }}
                        //     showTime={{
                        //         format: 'HH:mm',
                        //         defaultValue: moment('HH:00:00', 'HH:mm'),
                        //         minuteStep: 15
                        //     }} />
                    )}
                </Form.Item>

                <Form.Item label="End">
                    {getFieldDecorator('endTime', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <TimePicker minuteStep={15} disabledHours={this.disabledDateTime} style={{ width: '100%' }} format='HH:mm' />

                    )}
                </Form.Item>

                <Form.Item label="Notes">
                    {getFieldDecorator('notes', {
                        valuePropName: 'checked',
                    })(<Input.TextArea rows={4} />)}
                </Form.Item>
                <div style={{ textAlign: 'center' }}>
                    <Button type="primary" style={{ width: 100 }} htmlType="submit">Ok</Button>
                    <Button htmlType="reset" onClick={()=>this.props.onCancel()} style={{ width: 100, marginLeft: 15 }}>Cancel</Button>
                </div>
            </Form>
        );
    }
}

export default Form.create({ name: 'normal_login' })(FormSchedular);
