import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import './index.less';

export default class BenefitList extends Component<any, any>{

    render() {
        return (
            <div className='BenefitList-wrap'>
                <div className='BenefitList-title'>
                    <FormattedMessage id="Subscription.benefits" />
                </div>
                <div className='BenefitList-main'>
                    我是表格
                </div>
            </div>
        );
    }
}