import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon } from 'antd';

import * as webapi from './../webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const { Search } = Input;

class AuditLog extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      auditList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      keyword: ''
    };
  }
  componentDidMount() {
    this.init();
  }
  init = () => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      () => this.getAuditLogList()
    );
  };
  handleTableChange = (pagination) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getAuditLogList()
    );
  };
  searchAuditList = (value) => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        keyword: value
      },
      () => this.getAuditLogList()
    );
  };
  getAuditLogList = () => {
    const { pagination, keyword } = this.state;
    let params = {
      descs: 'dateAdded',
      keyword: keyword,
      module: 'campaign',
      relationId: this.props.automationId,
      type: '',
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    };
    this.setState({
      loading: true
    });
    webapi
      .getAuditLogList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let auditList = res.context.auditList;
          this.setState({
            auditList,
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { auditList, pagination, loading } = this.state;

    const auditLogColumns = [
      {
        title: 'Operation',
        dataIndex: 'action',
        width: '20%'
      },
      {
        title: 'Operator',
        dataIndex: 'createdByUser',
        width: '20%'
      },
      {
        title: 'Operation time',
        dataIndex: 'dateAdded',
        width: '20%',
        render: (text) => <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
      }
    ];

    return (
      <AuthWrapper functionName="f_automation_detail">
        <Card title={'Pet owner communication'} bordered={false} extra={<Search placeholder="input search text" onSearch={(value) => this.searchAuditList(value)} style={{ width: 200 }} />}>
          <Table rowKey="id" loading={loading} columns={auditLogColumns} dataSource={auditList} pagination={pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
        </Card>
      </AuthWrapper>
    );
  }
}

export default Form.create()(AuditLog);
