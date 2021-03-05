import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

class AutomationDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      automationId: this.props.match.params.id ? this.props.match.params.id : '',
      title: 'Automation Detail',
      loading: false
    };
  }
  componentDidMount() {}
  init = () => {};

  render() {
    const { loading, title } = this.state;

    return (
      <AuthWrapper functionName="f_automation_detail">
        <div>
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <BreadCrumb thirdLevel={true}>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </BreadCrumb>
            <div className="container"></div>
          </Spin>
        </div>
        <div className="bar-button">
          <Button
            type="primary"
            onClick={() => {
              console.log('save');
            }}
          >
            {<FormattedMessage id="save" />}
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="back" />}
          </Button>
        </div>
      </AuthWrapper>
    );
  }
}

export default Form.create()(AutomationDetail);
