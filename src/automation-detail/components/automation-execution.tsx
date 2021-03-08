import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon, Modal } from 'antd';

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
      },
      openModalTitle: 'Records of Automation Tests',
      testRecordsList: [],
      executionDetailsList: [],
      modalPagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      isDetail: false,
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
      () => this.getAutomationExecutionList()
    );
  };
  handleModalTableChange = (pagination) => {
    this.setState(
      {
        modalpPagination: pagination
      },
      () => {
        if (this.state.isDetail) {
          this.getExecutionDetailsList();
        } else {
          this.getTestRecordList();
        }
      }
    );
  };
  getAutomationExecutionList = () => {};
  getTestRecordList = () => {};
  getExecutionDetailsList = () => {};
  openModal = (isDetail, id?) => {
    if (isDetail) {
      this.setState({
        openModalTitle: 'Records of Automation Tests',
        isDetail,
        visible: true
      });
    } else {
      this.setState({
        openModalTitle: 'Execution details',
        isDetail,
        visible: true
      });
    }
  };
  handleClose = () => {
    this.setState({
      visible: false,
      testRecordsList: [],
      executionDetailsList: [],
      modalPagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    });
  };
  render() {
    const { automationExecutionList, pagination, openModalTitle, testRecordsList, modalPagination, isDetail, executionDetailsList, visible } = this.state;

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
                  this.openModal(true, record.id);
                }}
                className="iconfont iconDetails"
                style={{ marginRight: 10 }}
              ></a>
            </Tooltip>
          </div>
        )
      }
    ];

    const executionDetailsColumns = [
      {
        title: 'Pet owner account',
        dataIndex: 'petOwnerAccount',
        width: '15%'
      },
      {
        title: 'Pet owner name',
        dataIndex: 'petOwnerName',
        width: '10%'
      },
      {
        title: 'Communication item',
        dataIndex: 'communicationItem',
        width: '15%'
      },
      {
        title: 'Templates',
        dataIndex: 'templateName',
        width: '10%'
      },
      {
        title: 'Send time',
        dataIndex: 'sendTime',
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

    const testRecordsColumns = [
      {
        title: 'Start time',
        dataIndex: 'startTime',
        width: '20%'
      },
      {
        title: 'End time',
        dataIndex: 'endTime',
        width: '20%'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        width: '20%'
      }
    ];

    return (
      <AuthWrapper functionName="f_automation_detail">
        <Card
          title={'Automation Execution'}
          bordered={false}
          extra={
            <div>
              <Tooltip placement="top" title="Test Record">
                <a
                  onClick={() => {
                    this.openModal(false);
                  }}
                  className="iconfont iconDetails"
                  style={{ marginRight: 10 }}
                ></a>
              </Tooltip>

              <Tooltip placement="top" title="Refresh">
                <a
                  onClick={() => {
                    this.getAutomationExecutionList();
                  }}
                  className="iconfont iconReset"
                  style={{ marginRight: 10 }}
                ></a>
              </Tooltip>
            </div>
          }
        >
          <Table rowKey="id" columns={automationExecutionColumns} dataSource={automationExecutionList} pagination={pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
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
          <Table rowKey="id" columns={isDetail ? executionDetailsColumns : testRecordsColumns} dataSource={isDetail ? executionDetailsList : testRecordsList} pagination={modalPagination} scroll={{ x: '100%' }} onChange={this.handleModalTableChange} />
        </Modal>
      </AuthWrapper>
    );
  }
}

export default Form.create()(AutomationExecution);
