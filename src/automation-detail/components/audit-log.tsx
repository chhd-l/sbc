import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon } from 'antd';

import * as webapi from './../webapi';
import { FormattedMessage } from 'react-intl';

const { Search } = Input;

class AuditLog extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      auditLogList: [],
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
      () => this.getauditLogList()
    );
  };
  getauditLogList = () => {};

  render() {
    const { auditLogList, pagination } = this.state;

    const auditLogColumns = [
      {
        title: 'Operation',
        dataIndex: 'operation',
        width: '20%'
      },
      {
        title: 'operator',
        dataIndex: 'operator',
        width: '20%'
      },
      {
        title: 'Operation time',
        dataIndex: 'operationTime',
        width: '20%'
      }
    ];

    return (
      <AuthWrapper functionName="f_automation_detail">
        <Card title={'Pet owner communication'} bordered={false} extra={<Search placeholder="input search text" onSearch={(value) => console.log(value)} style={{ width: 200 }} />}>
          <Table rowKey="id" columns={auditLogColumns} dataSource={auditLogList} pagination={pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
        </Card>
      </AuthWrapper>
    );
  }
}

export default Form.create()(AuditLog);
