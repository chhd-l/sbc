import React, { Component } from 'react';
import { Form } from 'antd';

import BasicInformation from '../basicInformation';
import SetConditions from '../setConditions';
import BenefitList from '../BenefitList';


class BenefitSettingAddFrom extends Component<any, any>{
    constructor(props) {
        super(props);
    }

    render() {

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

        return (<div>
            <Form {...formItemLayout}>
                <BasicInformation form={this.props.form} />
                <SetConditions form={this.props.form} />
                <BenefitList form={this.props.form}/>
            </Form>

        </div>);
    }
}

export default Form.create()(BenefitSettingAddFrom)