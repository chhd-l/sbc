import React, { Component } from 'react';
import { Form } from 'antd';

import BasicInformation from '../basicInformation';
import SetConditions from '../setConditions';
import BenefitList from '../BenefitList';


class BenefitSettingAddFrom extends Component<any, any>{
    props: {
        form: any;
        initData: any;
    };
    constructor(props) {
        super(props);

    }


    render() {
        let { initData } = this.props;

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
                <BasicInformation initData={initData} form={this.props.form} />
                <SetConditions initData={initData} form={this.props.form} />
                <BenefitList initData={initData} form={this.props.form}/>
            </Form>

        </div>);
    }
}

export default Form.create()(BenefitSettingAddFrom)