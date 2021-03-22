import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history, util } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon, Modal } from 'antd';

import * as webapi from './../webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const { Search } = Input;

class PetOwnerCommunication extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      petOwnerCommunicationList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      openModalTitle: '',
      petOwnerCommunicationDetailList: [],
      modalPagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      visible: false,
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
      () => this.getpetOwnerCommunicationList()
    );
  };
  getpetOwnerCommunicationList = () => {
    const { pagination } = this.state;
    let params = {
      campaignId: this.props.automationId,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    };
    this.setState({
      loading: true
    });
    webapi.getCommunicationList(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let petOwnerCommunicationList = res.context.workflowStatList;
        pagination.total = res.context.total;
        this.setState({
          pagination,
          petOwnerCommunicationList,
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
        this.getpetOwnerCommunicationDetailList();
      }
    );
  };
  getpetOwnerCommunicationDetailList = () => {
    const { modalPagination, currentRow, keyword } = this.state;
    let params = {
      contactId: currentRow.contactId,
      campaignId: this.props.automationId,
      nodeName: currentRow.nodeName,
      pageSize: modalPagination.pageSize,
      pageNum: modalPagination.current - 1,
      keyword: keyword
    };
    this.setState({
      loading: true
    });
    webapi.getCommunicationDetailList(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let petOwnerCommunicationDetailList = res.context.workflowDetailList;
        modalPagination.total = res.context.total;
        this.setState({
          modalPagination,
          petOwnerCommunicationDetailList,
          loading: false
        });
      } else {
        this.setState({
          loading: false
        });
      }
    });
  };
  handleTableChange = (pagination) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getpetOwnerCommunicationList()
    );
  };
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

  openModal = (row) => {
    let modalPagination = {
      current: 1,
      pageSize: 10,
      total: 0
    };

    this.setState(
      {
        visible: true,
        modalPagination,
        currentRow: row,
        keyword: '',
        openModalTitle: `Pet Owner ID:${row.contactId} Pet Owner Name:${row.contactName}`
      },
      () => this.getpetOwnerCommunicationDetailList()
    );
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
  download = () => {
    const { currentRow, keyword } = this.state;
    let params = {
      campaignId: this.props.automationId,
      contactId: currentRow.contactId,
      keyword: keyword,
      nodeName: currentRow.nodeName
    };
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
    const { petOwnerCommunicationList, loading, pagination, petOwnerCommunicationDetailList, openModalTitle, modalPagination, visible, keyword } = this.state;

    const petOwnerCommunicationColumns = [
      {
        title: 'Pet owner account',
        dataIndex: 'contactId',
        width: '15%'
      },
      {
        title: 'Pet owner name',
        dataIndex: 'contactName',
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
                  this.openModal(record);
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
        width: '15%',
        render: (text) => <p>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
      },
      {
        title: 'Execution time',
        dataIndex: 'executionTime',
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

    return (
      <AuthWrapper functionName="f_automation_detail">
        <Card
          title={'Pet owner communication'}
          bordered={false}
          extra={
            <Tooltip placement="top" title="Refresh">
              <a
                onClick={() => {
                  this.init();
                }}
                className="iconfont iconReset"
                style={{ marginRight: 10 }}
              ></a>
            </Tooltip>
          }
        >
          <Table rowKey="id" loading={loading} columns={petOwnerCommunicationColumns} dataSource={petOwnerCommunicationList} pagination={pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
        </Card>
        <Modal
          title={openModalTitle}
          width={1000}
          visible={visible}
          maskClosable={false}
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
          <div>
            <Search placeholder="input search text" onSearch={(value) => this.searchDetailList(value)} style={{ width: 200 }} />
            <Button type="link" icon="download" size="large" style={{ marginLeft: 10 }} onClick={this.download} />
          </div>
          <Table rowKey="id" loading={loading} columns={communicationDetailColumns} dataSource={petOwnerCommunicationDetailList} pagination={modalPagination} scroll={{ x: '100%' }} onChange={this.handleModalTableChange} />
        </Modal>
      </AuthWrapper>
    );
  }
}

export default Form.create()(PetOwnerCommunication);
