import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import {Alert} from 'antd';
import config from '../../../configs';
import './index.less';

export default class BenefitSettingAddHint extends Component<any, any>{

    render() {
        return (
            <div className='BenefitSettingAdd-hint'>
                <p><FormattedMessage id="Subscription.Creating Consumption gift" /></p>
                <div className='BenefitSettingAdd-hint-box'>
                    <Alert
                        message={
                            <div>
                                <p>
                                    1、
                                    <FormattedMessage id={this.props.benefitType === config.CONSUMPTION_GIFT ? "Subscription.Consumption gift is set for order type is club, and subscription order is the recurrent by default" : "Subscription.WelcomeboxHint1"} />
                                </p>
                                <p>
                                    2、
                                    <FormattedMessage id={this.props.benefitType === config.CONSUMPTION_GIFT ? "Subscription.Consumption gift only delivered one time for the same conditions club" : "Subscription.WelcomeboxHint2"} />
                                </p>
                            </div>
                        }
                        type="info"
                    />
                </div>
            </div>
        );
    }
}