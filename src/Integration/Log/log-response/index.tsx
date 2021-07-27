import React, { Component } from 'react'
import { BreadCrumb, Headline, } from 'qmkit'
import { Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom'
import ReactJson from 'react-json-view';

export default class Response extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          id: 1,
          time: '2021-06-21 06:45:27.944',
          error: '{' +

            '\n\"id\": \"70989930191138816\"' + ',' +

            '\n\"sn\": \"70989929016733696\"' + ',' +

            '\n\"countryCode\": \"RU\"' +
            '\n}'
        }
      ]
    }
  }
  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item><Link to="/log-detail/1/2">{<FormattedMessage id="Log.RequestDetail" />}</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{<FormattedMessage id="Log.ResponseLog" />}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-info">
          <Headline title={<FormattedMessage id="Log.ResponseLog" />} />
          <div> <ReactJson
            src={JSON.parse(this.state.list[0].error)}
            name={false}
            style={{ fontFamily: 'Sans-Serif' }}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
            collapseStringsAfterLength={180}
          />
          </div>
        </div>
      </div>
    )
  }
}