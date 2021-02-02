import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AssetManagement } from 'qmkit';
import { Table, Tooltip, Modal, Button, Form, Input, Row, Col, message, Select, Radio, Spin, Switch, Popconfirm } from 'antd';

import SearchForm from './components/search-form';
import CreateForm from './components/create-form';

import * as webapi from './webapi';
import { getDictionaryByType } from './../shop/webapi';

import { FormattedMessage } from 'react-intl';
import Search from 'antd/lib/input/Search';

const FormItem = Form.Item;
const Option = Select.Option;

class DescriptionManagement extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Description management',
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
        discriptionName: '',
        translateList: [],
        displayStatus: false
      },
      isEdit: false,
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
    const { res } = await getDictionaryByType('language');
    if (res.code === Const.SUCCESS_CODE && res.context && res.context.sysDictionaryVOS) {
      this.setState({
        languageList: res.context.sysDictionaryVOS
      });
    } else {
      message.error('Fetching language setting failed!');
    }
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
      translateList: this.state.languageList.map((lan) => ({
        label: `Display name(${lan.valueEn})`,
        languageId: lan.id,
        languageName: lan.valueEn,
        translateName: '',
        rules: [{ required: true, message: 'Display name is required' }]
      })),
      displayStatus: false
    };
    this.setState({
      modalName: 'Add new tab',
      visible: true,
      descForm,
      isEdit: false,
      loading: false
    });
  };
  openEditPage = (row) => {
    let descForm = {
      id: row.id,
      descriptionName: row.descriptionName,
      translateList: this.state.languageList.map((lan) => {
        const tl = row.translateList.find((x) => x.languageId == lan.id) || {};
        return {
          label: `Display name(${lan.valueEn})`,
          languageId: lan.id,
          languageName: lan.valueEn,
          translateName: tl.translateName || '',
          rules: [{ required: true, message: 'Display name is required' }]
        };
      }),
      displayStatus: row.displayStatus
    };
    this.setState({
      modalName: 'Edit tab',
      visible: true,
      descForm,
      isEdit: true,
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
          message.error(res.message || 'Operation failed');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failed');
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
          message.success(res.message || 'Operate successfully');
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message.toString() || 'Operation failed');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failed');
      });
  };

  updateDescriptionStatus = (row, status) => {
    let params = {
      id: row.id,
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
          message.error(res.message || 'Operation failed');
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        message.error(err || 'Operation failed');
      });
  };

  render() {
    const { loading, title, descList, visible, modalName, descForm } = this.state;

    const columns = [
      {
        title: 'Description name',
        dataIndex: 'descriptionName',
        key: 'descriptionName'
      },
      {
        title: 'Display name',
        key: 'dipName',
        render: (text, record) => <div>{record.translateList && record.translateList.length ? record.translateList[0]['translateName'] : ''}</div>
      },
      {
        title: 'Status',
        dataIndex: 'displayStatus',
        key: 'status',
        render: (text, record) => <Switch onChange={(value) => this.updateDescriptionStatus(record, value)} checked={text} />
      },
      {
        title: 'Operation',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title="Edit">
              <a style={styles.edit} onClick={() => this.openEditPage(record)} className="iconfont iconEdit"></a>
            </Tooltip>
            <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteDescriptionItem(record.id)} okText="Confirm" cancelText="Cancel">
              <Tooltip placement="top" title="Delete">
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
        <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          <div className="container-search">
            <Headline title={title} />
            <SearchForm descName={this.state.searchForm.descriptionName} onChangeDescName={this.onSearchFormChange} onSearch={this.onSearch} />
            <div>
              <Button type="primary" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openAddPage()}>
                <span>Add new description</span>
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
