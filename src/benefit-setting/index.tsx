import React from 'react';
import { Link } from 'react-router-dom';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';

import './index.less';

export default class BenefitSetting extends React.Component<any, any> {
    render() {
        return (
            <div className="benefitSetting-wrap">
                <div className="container">
                    <div>
                        <span className="benefitSetting-h1">
                            <FormattedMessage id="Subscription.Membership benefits" />
                        </span>
                        <span className="benefitSetting-hint">
                            <FormattedMessage id="Subscription.Higher retention rare and more repurchases" />
                        </span>
                    </div>
                    <div className="benefitSetting-content">
                        <AuthWrapper functionName="f_benefit_setting">
                            <Link to="/goods-add">
                                <div className="benefitSetting-item">
                                    <div className="benefitSetting-item-content">
                                        {/*<img src={icon1} alt="" />*/}
                                        <i className="iconfont icondata"/>
                                        <div className="benefitSetting-item-text">
                                            <h2>
                                                <FormattedMessage id="Subscription.Consumption gift" />
                                            </h2>
                                            <p>
                                                <FormattedMessage id="Subscription.Buy the products regulary to enjoy the membership gift" />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </AuthWrapper>
                    </div>
                </div>
            </div>
        );
    }
}
