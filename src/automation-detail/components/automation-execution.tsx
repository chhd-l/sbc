import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history, util } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon, Modal } from 'antd';

import * as webapi from './../webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const { Search } = Input;

class AutomationExecution extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
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
      visible: false,
      currentRow: {},
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
      () => this.getAutomationExecutionList()
    );
  };

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
        modalPagination: pagination
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
  getAutomationExecutionList = () => {
    const { pagination } = this.state;
    let params = {
      campaignId: this.props.automationId,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    };
    this.setState({
      loading: true
    });
    webapi.getExecutionList(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let automationExecutionList = res.context.workflowStatList;
        pagination.total = res.context.total;
        this.setState({
          pagination,
          automationExecutionList,
          loading: false
        });
      } else {
        this.setState({
          loading: false
        });
      }
    });
  };

  getTestRecordList = () => {
    const { modalPagination } = this.state;
    let params = {
      campaignId: this.props.automationId,
      module: 'Test',
      pageSize: modalPagination.pageSize,
      pageNum: modalPagination.current - 1
    };
    this.setState({
      loading: true
    });
    webapi.getTestList(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let testRecordsList = res.context.workflowInstanceList;
        modalPagination.total = res.context.total;
        this.setState({
          modalPagination,
          testRecordsList,
          loading: false
        });
      } else {
        this.setState({
          loading: false
        });
      }
    });
  };
  getExecutionDetailsList = () => {
    const { modalPagination, currentRow, keyword } = this.state;
    let params = {
      executionTime: currentRow.executionTime,
      campaignId: this.props.automationId,
      nodeName: currentRow.nodeName,
      nodeType: currentRow.nodeType,
      keyword: keyword,
      pageSize: modalPagination.pageSize,
      pageNum: modalPagination.current - 1
    };
    this.setState({
      loading: true
    });
    webapi.getCommunicationDetailList(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let executionDetailsList = res.context.workflowDetailList;
        modalPagination.total = res.context.total;
        this.setState({
          modalPagination,
          executionDetailsList,
          loading: false
        });
      } else {
        this.setState({
          loading: false
        });
      }
    });
  };

  searchDetailList = (value) => {
    this.setState(
      {
        keyword: value,
        modalPagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      () => {
        this.getExecutionDetailsList();
      }
    );
  };
  openModal = (isDetail, row?) => {
    let modalPagination = {
      current: 1,
      pageSize: 10,
      total: 0
    };
    if (!isDetail) {
      this.setState(
        {
          openModalTitle: 'Records of Automation Tests',
          isDetail,
          visible: true,
          modalPagination
        },
        () => this.getTestRecordList()
      );
    } else {
      this.setState(
        {
          openModalTitle: 'Execution details',
          isDetail,
          visible: true,
          modalPagination,
          currentRow: row,
          keyword: ''
        },
        () => this.getExecutionDetailsList()
      );
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
  download = () => {
    const { currentRow } = this.state;
    let params = {
      campaignId: this.props.automationId,
      executionTime: moment(currentRow.executionTime).format('YYYY-MM-DD HH:mm:ss'),
      nodeName: currentRow.nodeName
    };
    // webapi.exportCommunicationList(params)
    this.onExport(params);
  };
  onExport = (params) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          const exportHref = Const.HOST + `/automation/campaign/exportCommunicationList/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('Unsuccessful');
        }
        resolve();
      }, 500);
    });
  };
  render() {
    const { automationExecutionList, loading, pagination, openModalTitle, testRecordsList, modalPagination, isDetail, executionDetailsList, visible } = this.state;

    const automationExecutionColumns = [
      {
        title: 'Execution time',
        dataIndex: 'executionTime',
        width: '15%',
        render: (text) => <p>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
      },
      {
        title: 'Communication type',
        dataIndex: 'nodeType',
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
                  this.openModal(true, record);
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
      // {
      //   title: 'Pet owner account',
      //   dataIndex: 'contactId',
      //   width: '15%'
      // },
      {
        title: 'Pet owner account',
        dataIndex: 'contactName',
        width: '15%'
      },
      {
        title: 'Communication item',
        dataIndex: 'nodeName',
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
        width: '15%',
        render: (text) => <p>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
      },
      {
        title: 'Delivered time',
        dataIndex: 'deliveredTime',
        width: '15%',
        render: (text) => <p>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
      },
      {
        title: 'Click count',
        dataIndex: 'clicksCount',
        width: '10%',
        render: (text) => <p>{text ? text : '-'}</p>
      },
      {
        title: 'Open count',
        dataIndex: 'opensCount',
        width: '10%',
        render: (text) => <p>{text ? text : '-'}</p>
      }
      // {
      //   title: 'Opened time',
      //   dataIndex: 'openedTime',
      //   width: '15%',
      //   render: (text) => <p>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
      // }
    ];

    const testRecordsColumns = [
      {
        title: 'Start time',
        dataIndex: 'startTime',
        width: '20%',
        render: (text) => <p>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
      },
      {
        title: 'End time',
        dataIndex: 'endTime',
        width: '20%',
        render: (text) => <p>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
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
                    this.init();
                  }}
                  className="iconfont iconReset"
                  style={{ marginRight: 10 }}
                ></a>
              </Tooltip>
            </div>
          }
        >
          <Table rowKey="id" loading={loading} columns={automationExecutionColumns} dataSource={automationExecutionList} pagination={pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
        </Card>
        <Modal
          title={openModalTitle}
          maskClosable={false}
          width={isDetail ? 1000 : 600}
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
          {isDetail ? (
            <div>
              <Search placeholder="input search text" onSearch={(value) => this.searchDetailList(value)} style={{ width: 200 }} />
              <Button type="link" icon="download" size="large" style={{ marginLeft: 10 }} onClick={this.download} />
            </div>
          ) : null}
          <Table rowKey="id" loading={loading} columns={isDetail ? executionDetailsColumns : testRecordsColumns} dataSource={isDetail ? executionDetailsList : testRecordsList} pagination={modalPagination} scroll={{ x: '100%' }} onChange={this.handleModalTableChange} />
        </Modal>
      </AuthWrapper>
    );
  }
}

export default Form.create()(AutomationExecution);
