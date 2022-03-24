import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AssetManagement } from 'qmkit';
import { Table, Tooltip, Modal, Button, Form, Input, Row, Col, message, Select, Radio, Spin, Switch, Popconfirm } from 'antd';

import SearchForm from './components/search-form';
import CreateForm from './components/create-form';

import * as webapi from './webapi';
//import { getDictionaryByType } from './../shop/webapi';

import { FormattedMessage } from 'react-intl';
import Search from 'antd/lib/input/Search';

const FormItem = Form.Item;
const Option = Select.Option;

class DescriptionManagement extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Product.DescriptionManagement" />,
      searchForm: {
        descriptionName: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      descList: [],
      languageList: [],
      visible: false,
      descForm: {
        id: '',
        descriptionName: '',
        contentType: 'text',
        translateList: [],
        displayStatus: false
      },
      currentEditTab: {},
      modalName: '',
      loading: true
    };
  }
  componentDidMount() {
    this.getDescriptionList();
    this.getLanguageList();
  }

  getLanguageList = async () => {
    const lanList = await webapi.getStoreLanguageList();
    this.setState({
      languageList: lanList
    });
  };

  onSearchFormChange = (value) => {
    this.setState({
      searchForm: {
        descriptionName: value
      }
    });
  };

  onSearch = () => {
    const { pagination } = this.state;
    pagination.current = 1;
    this.setState(
      {
        pagination
      },
      () => this.getDescriptionList()
    );
  };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getDescriptionList()
    );
  };
  onDescFormChange = ({ field, value }) => {
    let data = this.state.taggingForm;
    data[field] = value;
    this.setState({
      descForm: data
    });
  };

  openAddPage = () => {
    let descForm = {
      id: undefined,
      descriptionName: '',
      contentType: 'text',
      translateList: this.state.languageList.map((lan, idx) => ({
        label: idx === 0 ? 'Display name' : ' ',
        languageId: lan.id,
        languageName: lan.valueEn,
        translateName: ''
      })),
      displayStatus: false
    };
    this.setState({
      modalName: 'Add new tab',
      visible: true,
      descForm,
      loading: false
    });
  };
  openEditPage = (row) => {
    let descForm = {
      id: row.id,
      descriptionName: row.descriptionName,
      contentType: row.contentType || 'text',
      translateList: this.state.languageList.map((lan, idx) => {
        const tl = row.translateList.find((x) => x.languageId == lan.id) || {};
        return {
          label: idx === 0 ? 'Display name' : ' ',
          languageId: lan.id,
          languageName: lan.valueEn,
          translateName: tl.translateName || ''
        };
      }),
      displayStatus: row.displayStatus
    };
    this.setState({
      modalName: 'Edit tab',
      visible: true,
      descForm,
      currentEditTab: row,
      loading: false
    });
  };
  handleSubmit = (msg) => {
    message.success(msg);
    this.setState(
      {
        visible: false,
        loading: false
      },
      () => this.getDescriptionList()
    );
  };
  getDescriptionList = () => {
    const { searchForm, pagination } = this.state;
    this.setState({
      loading: true
    });
    let params = {
      descriptionName: searchForm.descriptionName,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    };
    webapi
      .getDescriptionList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          const descList = res.context.descriptionList;
          this.setState({ descList, pagination, loading: false });
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || <FormattedMessage id="Product.OperationFailed" />);
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || <FormattedMessage id="Product.OperationFailed" />);
      });
  };
  deleteDescriptionItem = (id) => {
    this.setState({
      loading: true
    });
    webapi
      .deleteDescriptionItem(id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getDescriptionList();
          message.success(res.message || <FormattedMessage id="Product.OperateSuccessfully" />);
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message.toString() || <FormattedMessage id="Product.OperationFailed" />);
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || <FormattedMessage id="Product.OperationFailed" />);
      });
  };

  updateDescriptionStatus = (row, status) => {
    let params = {
      id: row.id,
      contentType: row.contentType,
      descriptionName: row.descriptionName,
      translateList: row.translateList,
      displayStatus: status
    };
    this.setState({ loading: true });
    webapi
      .updateDescriptionItem(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getDescriptionList();
        } else {
          this.setState({ loading: false });
          message.error(res.message || <FormattedMessage id="Product.OperationFailed" />);
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        message.error(err || <FormattedMessage id="Product.OperationFailed" />);
      });
  };

  render() {
    const { loading, title, descList, visible, modalName, descForm } = this.state;

    const columns = [
      {
        title: <FormattedMessage id="Product.DescriptionName" />,
        dataIndex: 'descriptionName',
        key: 'descriptionName',
        width: '20%'
      },
      {
        title: <FormattedMessage id="Product.DisplayName" />,
        dataIndex: 'displayName',
        key: 'displayName',
        width: '35%'
      },
      {
        title: <FormattedMessage id="Product.DescriptionType" />,
        dataIndex: 'contentType',
        key: 'contentType',
        width: '20%',
        render: (text) => (text ? <FormattedMessage id={text === 'text' ? 'Product.html' : 'Product.json'} /> : '')
      },
      {
        title: <FormattedMessage id="Product.Status" />,
        dataIndex: 'displayStatus',
        key: 'status',
        width: '10%',
        render: (text, record) => <Switch onChange={(value) => this.updateDescriptionStatus(record, value)} checked={text} />
      },
      {
        title: <FormattedMessage id="Product.Operation" />,
        dataIndex: '',
        key: 'x',
        width: '15%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title={<FormattedMessage id="Product.Edit" />}>
              <a style={styles.edit} onClick={() => this.openEditPage(record)} className="iconfont iconEdit"></a>
            </Tooltip>
            <Popconfirm placement="topLeft" title={<FormattedMessage id="Product.deleteThisItem" />} onConfirm={() => this.deleteDescriptionItem(record.id)} okText={<FormattedMessage id="Product.Confirm" />} cancelText={<FormattedMessage id="Product.Cancel" />}>
              <Tooltip placement="top" title={<FormattedMessage id="Product.Delete" />}>
                <a className="iconfont iconDelete"></a>
              </Tooltip>
            </Popconfirm>
          </div>
        )
      }
    ];

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <Spin spinning={loading}>
          <div className="container-search">
            <Headline title={title} />
            <SearchForm descName={this.state.searchForm.descriptionName} onChangeDescName={this.onSearchFormChange} onSearch={this.onSearch} />
            <div>
              <Button type="primary" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openAddPage()}>
                <span>
                  <FormattedMessage id="Product.AddNewDescription" />
                </span>
              </Button>
            </div>
          </div>

          <div className="container-search">
            <Table style={{ paddingRight: 20 }} rowKey="id" columns={columns} dataSource={descList} pagination={this.state.pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
          </div>

          {visible ? (
            <CreateForm
              id={descForm.id}
              name={modalName}
              visible={visible}
              loading={loading}
              descriptionName={descForm.descriptionName}
              contentType={descForm.contentType}
              translateList={descForm.translateList}
              displayStatus={descForm.displayStatus}
              onSubmit={this.handleSubmit}
              onCancel={() => {
                this.setState({ visible: false });
              }}
              onChangeFormVisibility={(visible) => {
                this.setState({ visible });
              }}
              onChangeFormLoading={(loading) => {
                this.setState({ loading });
              }}
            />
          ) : null}
        </Spin>
      </div>
    );
  }
}
const styles = {
  edit: {
    paddingRight: 10
  },
  tableImage: {
    width: '60px',
    height: '60px',
    padding: '5px',
    border: '1px solid rgb(221, 221, 221)',
    background: 'rgb(255, 255, 255)'
  }
} as any;

export default DescriptionManagement;
