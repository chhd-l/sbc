import React, { Component } from 'react';
import {Breadcrumb, Tabs, Form, Alert, Spin, Button} from 'antd';
import './index.less';
import {AuthWrapper, BreadCrumb} from 'qmkit';
import {FormattedMessage} from 'react-intl';
import BasicInformation from './components/basicInformation';
import BenefitSettingAddHint from './components/BenefitSettingAddHint';
import SetConditions from './components/setConditions';
import BenefitList from './components/BenefitList';

export default class BenefitSettingAdd extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }


    render() {
        let { loading } = this.state;
        return (
            <Spin spinning={loading}>
                <div className='BenefitSettingAdd-wrap'>
                    <BreadCrumb thirdLevel={true}>
                        <Breadcrumb.Item><FormattedMessage id="Subscription.Consumption gift" /></Breadcrumb.Item>
                    </BreadCrumb>
                    <div className='container'>
                        <BenefitSettingAddHint />

                        <BasicInformation  />

                        <SetConditions  />

                        <BenefitList/>

                        <div className="bar-button" style={{marginLeft:'-20px'}}>
                            <Button type="primary" style={{ marginRight: 10 }}>
                                <FormattedMessage id="Subscription.Save" />
                            </Button>
                            <Button style={{ marginRight: 10 }}>
                                <FormattedMessage id="Subscription.Cancel" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}