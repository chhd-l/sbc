import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon } from 'antd';

import * as webapi from './../webapi';
import { FormattedMessage } from 'react-intl';

class AutomationExecution extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      automationExecutionList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }
  componentDidMount() {}
  init = () => {};
  handleTableChange = (pagination) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getAutomationExecutionList()
    );
  };
  getAutomationExecutionList = () => {};

  render() {
    const { automationExecutionList, pagination } = this.state;

    const automationExecutionColumns = [
      {
        title: 'Execution time',
        dataIndex: 'executionTime',
        width: '20%'
      },
      {
        title: 'Communication item',
        dataIndex: 'nodeName',
        width: '20%'
      },
      {
        title: 'counts',
        dataIndex: 'counts',
        width: '10%'
      },
      {
        title: 'Successful',
        dataIndex: 'success',
        width: '10%'
      },
      {
        title: 'Failed',
        dataIndex: 'failed',
        width: '10%'
      },
      {
        title: 'Open rate',
        dataIndex: 'openRate',
        width: '10%'
      },
      {
        title: '',
        dataIndex: 'action',
        width: '10%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title="Detail">
              <a
                onClick={() => {
                  console.log('detail');
                }}
                className="iconfont iconDetails"
                style={{ marginRight: 10 }}
              ></a>
            </Tooltip>
          </div>
        )
      }
    ];

    return (
      <AuthWrapper functionName="f_automation_detail">
        <Card title={'Automation Execution'} bordered={false}>
          <Table rowKey="id" columns={automationExecutionColumns} dataSource={automationExecutionList} pagination={pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
        </Card>
      </AuthWrapper>
    );
  }
}

export default Form.create()(AutomationExecution);
