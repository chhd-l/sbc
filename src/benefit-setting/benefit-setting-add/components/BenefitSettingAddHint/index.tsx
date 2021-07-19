import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import {Alert} from 'antd';
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
                                    <FormattedMessage id="Subscription.Consumption gift is set for order type is club, and subscription order is the recurrent by default" />
                                </p>
                                <p>
                                    2、
                                    <FormattedMessage id="Subscription.Consumption gift only delivered one time for the same conditions club" />
                                </p>
                            </div>
                        }
                        type="error"
                    />
                </div>
            </div>
        );
    }
}