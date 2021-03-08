import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon, Modal } from 'antd';

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
      },
      openModalTitle: 'Pet owner communication detail',
      petOwnerCommunicationDetailList: [],
      modalPagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      visible: false
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
  getpetOwnerCommunicationDetailList = () => {};
  handleModalTableChange = (pagination) => {
    this.setState(
      {
        modalpPagination: pagination
      },
      () => {
        this.getpetOwnerCommunicationDetailList();
      }
    );
  };
  openModal = () => {
    this.setState({
      visible: true
    });
  };
  handleClose = () => {
    this.setState({
      visible: false,

      modalPagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    });
  };

  render() {
    const { petOwnerCommunicationList, pagination, petOwnerCommunicationDetailList, openModalTitle, modalPagination, visible } = this.state;

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
                  this.openModal();
                }}
                className="iconfont iconDetails"
                style={{ marginRight: 10 }}
              ></a>
            </Tooltip>
          </div>
        )
      }
    ];

    const communicationDetailColumns = [
      {
        title: 'Communication item',
        dataIndex: 'nodeName',
        width: '15%'
      },

      {
        title: 'Templates',
        dataIndex: 'templateName',
        width: '15%'
      },
      {
        title: 'Send time',
        dataIndex: 'sendTime',
        width: '15%'
      },
      {
        title: 'Execution time',
        dataIndex: 'executionTime',
        width: '15%'
      },
      {
        title: 'Delivered time',
        dataIndex: 'deliveredTime',
        width: '15%'
      },
      {
        title: 'openedTime',
        dataIndex: 'openedTime',
        width: '15%'
      }
    ];

    return (
      <AuthWrapper functionName="f_automation_detail">
        <Card
          title={'Pet owner communication'}
          bordered={false}
          extra={
            <Tooltip placement="top" title="Refresh">
              <a
                onClick={() => {
                  this.getpetOwnerCommunicationList();
                }}
                className="iconfont iconReset"
                style={{ marginRight: 10 }}
              ></a>
            </Tooltip>
          }
        >
          <Table rowKey="id" columns={petOwnerCommunicationColumns} dataSource={petOwnerCommunicationList} pagination={pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
        </Card>
        <Modal
          title={openModalTitle}
          visible={visible}
          onCancel={() => this.handleClose()}
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.handleClose();
              }}
            >
              Close
            </Button>
          ]}
        >
          <Table rowKey="id" columns={communicationDetailColumns} dataSource={petOwnerCommunicationDetailList} pagination={modalPagination} scroll={{ x: '100%' }} onChange={this.handleModalTableChange} />
        </Modal>
      </AuthWrapper>
    );
  }
}

export default Form.create()(PetOwnerCommunication);
