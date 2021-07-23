import React,{Component} from 'react';
import { Radio } from 'antd';
import { FormattedMessage } from 'react-intl';

export default class MyHeader extends Component<any>{
  render(){
    const {active,onChange} = this.props
    return(
      <div className="header-right">
        <span className="mr20">{<FormattedMessage id="Interface.Latest" />}</span>
        <Radio.Group value={active} onChange={onChange} style={{ marginBottom: 16 }} buttonStyle="solid">
          <Radio.Button value="Hour" className="mr20">{<FormattedMessage id="Interface.Hour" />}</Radio.Button>
          <Radio.Button value="Day" className="mr20">{<FormattedMessage id="Interface.Day" />}</Radio.Button>
          <Radio.Button value="Week">{<FormattedMessage id="Interface.Week" />}</Radio.Button>
        </Radio.Group>
      </div>
    )
  }
}
