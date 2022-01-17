import { Form, Icon, Input, Button, Checkbox, Select, TimePicker, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import   './index.less'
class FormSchedular extends React.Component {
    props: {
        form: any
        handleSubmit: Function
        onCancel:Function,
        dateNo:any
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const blockSlotVO = {
                    "id": "",
                    "startTime": moment(values.startTime).format('HH:mm'),
                    "endTime": moment(values.endTime).format('HH:mm'),
                    "dateNo": moment(values.endTime).format('YYYYMMDD'),
                    "notes": values.nates
                }
                this.props.handleSubmit(blockSlotVO)
                console.log('Received values of form: ', blockSlotVO);
            }
        });
    };

    compareToFirstTime = (rule, value, callback) => {
        const { form } = this.props;
        let startTime=form.getFieldValue('startTime')
        // let endTime=
       let isOver= moment(value).diff(moment(startTime),'minutes')
        console.log(isOver)
    //    return
        if (value && isOver<0) {
          callback('Two time that you enter is inconsistent!');
        } else {
          callback();
        }
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
        let _b= moment(moment(this.props.dateNo).format('YYYY-MM-DD 17:00')).diff(moment(moment().format('YYYY-MM-DD 17:00')),'minutes')
        if(_b>0){
            return [...this.range(0, 24).splice(0,10), ...this.range(0, 24).splice(17,9)]
        }else{
        return [...this.range(0, 24).splice(0,10),...this.range(0, 24).splice(0,(moment().hour())), ...this.range(0, 24).splice(17,9)]
        }
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
            <Form labelAlign="left" {...formItemLayout} onSubmit={this.handleSubmit} className="blocked-form" >

                <Form.Item label="Type">
                    {getFieldDecorator('bookType', {
                        initialValue: '1',
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Select
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="1">{<FormattedMessage id="Appointment.Blocked" />}</Select.Option>
                          
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Start">
                    {getFieldDecorator('startTime', {
                        rules: [{ required: true, message: 'Please input your startTime!' }],
                    })(
                        <TimePicker getPopupContainer={(trigger: any) => trigger.parentNode}  popupStyle={{width:200}} minuteStep={15} disabledHours={this.disabledDateTime} style={{ width: '100%' }} format='HH:mm' />
                 
                    )}
                </Form.Item>

                <Form.Item label="End">
                    {getFieldDecorator('endTime', {
                        rules: [{ required: true, message: 'Please input your endTime!' },
                        {
                            validator: this.compareToFirstTime,
                          },
                    ],

                    })(
                        <TimePicker getPopupContainer={(trigger: any) => trigger.parentNode} className="className-time" popupStyle={{width:200}} minuteStep={15} disabledHours={this.disabledDateTime} style={{ width: '100%' }} format='HH:mm' />

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
