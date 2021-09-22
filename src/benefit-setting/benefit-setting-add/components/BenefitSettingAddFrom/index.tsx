import React, { Component } from 'react';
import { Form } from 'antd';

import config from '../../../configs';
import BasicInformation from '../basicInformation';
import SetConditions from '../setConditions';
import BenefitList from '../BenefitList';
import ProductList from '../ProductList';


class BenefitSettingAddFrom extends Component<any, any>{
    props: {
        form: any;
        initData: any;
        benefitType: number;
    };
    constructor(props) {
        super(props);

    }


    render() {
        let { initData, benefitType } = this.props;

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
                <BasicInformation benefitType={benefitType} initData={initData} form={this.props.form} />
                <SetConditions initData={initData} form={this.props.form} />
                {benefitType === config.CONSUMPTION_GIFT
                  ? <BenefitList initData={initData} form={this.props.form}/>
                  : <ProductList
                        form={this.props.form}
                        selectedRows={[]}
                        onChangeBack={() => {}}
                   />
                }
            </Form>

        </div>);
    }
}

export default Form.create()(BenefitSettingAddFrom)