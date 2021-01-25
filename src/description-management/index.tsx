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
        descName: ''
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
        id: 0,
        descName: '',
        dipNames: [],
        status: false
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
    let data = this.state.searchForm;
    this.setState({
      searchForm: {
        descName: value
      }
    });
  };

  onSearch = () => {
    this.getDescriptionList();
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
      id: 0,
      descName: '',
      dipNames: this.state.languageList.map((lan, idx) => ({
        label: idx === 0 ? 'Display name' : ' ',
        key: lan.value,
        value: '',
        placeholder: lan.valueEn,
        rules: [{ required: true, message: 'Display name is required' }]
      })),
      status: false
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
      descName: row.descName,
      dipNameFr: row.dipNameFr,
      dipNameEn: row.dipNameEn,
      status: row.status
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
  handleSubmit = () => {
    const { descForm, isEdit, currentEditTab } = this.state;
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     if (isEdit) {
    //       this.updateDescriptionItem(Object.assign({}, descForm, { id: currentEditTab.id }));
    //     } else {
    //       this.addDescriptionItem(Object.assign({}, descForm));
    //     }
    //   }
    // });
  };
  getDescriptionList = () => {
    const { searchForm, pagination } = this.state;
    this.setState({
      loading: true
    });
    let params = {
      descName: searchForm.descName,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    };
    webapi
      .getDescriptionList(params)
      .then((res) => {
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          const descList = res.context.descList;
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
  addDescriptionItem = (params: object) => {
    this.setState({
      loading: true
    });
    webapi
      .addDescriptionItem(params)
      .then((res) => {
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
          this.setState(
            {
              visible: false,
              loading: false
            },
            () => this.getDescriptionList()
          );
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
    let idList = [];
    idList.push(id);
    let params = {
      idList: idList
    };
    this.setState({
      loading: true
    });
    webapi
      .deleteDescriptionItem(params)
      .then((res) => {
        if (res.code === Const.SUCCESS_CODE) {
          this.getDescriptionList();
          message.success('Operate successfully');
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

  updateDescriptionItem = (params) => {
    this.setState({
      loading: true
    });
    webapi
      .updateDescriptionItem(params)
      .then((res) => {
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            visible: false,
            loading: false
          });
          this.getDescriptionList();
          message.success('Operate successfully');
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
  updateDescriptionStatus = (checked, row) => {
    let params = {
      descName: row.descName,
      dipNameFr: row.dipNameFr,
      dipNameEn: row.dipNameEn,
      id: row.id,
      status: checked
    };
    this.updateDescriptionItem(params);
  };

  render() {
    const { loading, title, descList, visible, modalName, descForm } = this.state;

    const columns = [
      {
        title: 'Description name',
        dataIndex: 'descName',
        key: 'descName'
      },
      {
        title: 'Display name',
        dataIndex: 'dipNameEn',
        key: 'dipNameEn'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => <Switch onChange={(value) => this.updateDescriptionStatus(value, record)} checked={text} />
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
            <SearchForm descName={this.state.searchForm.descName} onChangeDescName={this.onSearchFormChange} onSearch={this.onSearch} />
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
              name={modalName}
              visible={visible}
              loading={loading}
              descName={descForm.descName}
              dipName={descForm.dipNames}
              status={descForm.status}
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
