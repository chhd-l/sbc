import React, { Component } from 'react';
import {Breadcrumb, Tabs, Form, Alert, Spin, Button} from 'antd';
import { StoreProvider} from 'plume2';
import {FormattedMessage} from 'react-intl';

import {BreadCrumb} from 'qmkit';
import BenefitSettingAddHint from './components/BenefitSettingAddHint';
import BenefitSettingAddFrom from './components/BenefitSettingAddFrom';

import AppStore from './store';
import './index.less';

@StoreProvider(AppStore, { debug: true })
export default class BenefitSettingAdd extends Component<any, any> {
    store: AppStore;
    form: any;
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }
    componentDidMount() {
        this.store.getAllGroups();
    }

    onSubmit = () => {
        let form = this.form.props.form;
        let {getFieldsValue} = form;
        console.log('values', getFieldsValue());
    }

    goBack = () => {
        this.props.history.goBack()
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

                        <BenefitSettingAddFrom
                            wrappedComponentRef={(form) => this.form = form}
                            {...{
                                store: this.store,
                            }}
                        />

                        <div className="bar-button" style={{marginLeft:'-20px'}}>
                            <Button
                                onClick={this.onSubmit}
                                type="primary"
                                style={{ marginRight: 10 }}
                            >
                                <FormattedMessage id="Subscription.Save" />
                            </Button>
                            <Button onClick={this.goBack} style={{ marginRight: 10 }}>
                                <FormattedMessage id="Subscription.Cancel" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}