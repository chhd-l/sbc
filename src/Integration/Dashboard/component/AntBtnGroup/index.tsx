import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';
import { Radio} from 'antd';

import './index.less';

export default class AntBtnGroup extends Component<any, any>{

    render() {
        let {
            active,
            onChange=() => {},
        } = this.props;

        return (
            <div className='AntBtnGroup-wrap'>
                <span className="AntBtnGroup-hint">{<FormattedMessage id="Interface.Latest" />}</span>
                <Radio.Group value={active} onChange={onChange} buttonStyle="solid">
                    <Radio.Button value="Hour" className="mr20">{<FormattedMessage id="Interface.Hour" />}</Radio.Button>
                    <Radio.Button value="Day" className="mr20">{<FormattedMessage id="Interface.Day" />}</Radio.Button>
                    <Radio.Button value="Week">{<FormattedMessage id="Interface.Week" />}</Radio.Button>
                </Radio.Group>
            </div>
        );
    }
}