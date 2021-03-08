import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon } from 'antd';

import * as webapi from './../webapi';
import { FormattedMessage } from 'react-intl';

class PetOwnerCommunication extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      petOwnerCommunicationList: [],
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
      () => this.getpetOwnerCommunicationList()
    );
  };
  getpetOwnerCommunicationList = () => {};

  render() {
    const { petOwnerCommunicationList, pagination } = this.state;

    const petOwnerCommunicationColumns = [
      {
        title: 'Pet owner account',
        dataIndex: 'pet',
        width: '15%'
      },
      {
        title: 'Pet owner name',
        dataIndex: 'pet',
        width: '15%'
      },
      {
        title: 'Communication item',
        dataIndex: 'nodeName',
        width: '15%'
      },
      {
        title: 'counts',
        dataIndex: 'counts',
        width: '8%'
      },
      {
        title: 'Successful',
        dataIndex: 'success',
        width: '8%'
      },
      {
        title: 'Failed',
        dataIndex: 'failed',
        width: '8%'
      },
      {
        title: 'Open rate',
        dataIndex: 'openRate',
        width: '8%'
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
        <Card title={'Pet owner communication'} bordered={false}>
          <Table rowKey="id" columns={petOwnerCommunicationColumns} dataSource={petOwnerCommunicationList} pagination={pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
        </Card>
      </AuthWrapper>
    );
  }
}

export default Form.create()(PetOwnerCommunication);
