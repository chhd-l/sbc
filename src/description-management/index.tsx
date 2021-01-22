import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AssetManagement } from 'qmkit';
import { Table, Tooltip, Modal, Button, Form, Input, Row, Col, message, Select, Radio, Spin, Switch, Popconfirm } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

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

      visible: false,
      descForm: {
        descName: '',
        dipNameFr: '',
        dipNameEn: '',
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
  }

  onSearchFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
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
      descName: '',
      dipNameFr: '',
      dipNameEn: '',
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
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (isEdit) {
          this.updateDescriptionItem(Object.assign({}, descForm, { id: currentEditTab.id }));
        } else {
          this.addDescriptionItem(Object.assign({}, descForm));
        }
      }
    });
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

  getColour = (value) => {
    const { colourList } = this.state;
    let colour = colourList.find((item) => item.id == value || item.valueEn === value);
    return colour;
  };

  render() {
    const { loading, title, descList, visible, modalName, descForm } = this.state;

    const { getFieldDecorator } = this.props.form;

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

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          <div className="container-search">
            <Headline title={title} />
            <Form layout="inline" style={{ marginBottom: 20 }}>
              <Row>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore="Description name"
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onSearchFormChange({
                          field: 'descName',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <Button
                    type="primary"
                    icon="search"
                    shape="round"
                    onClick={(e) => {
                      e.preventDefault();
                      this.onSearch();
                    }}
                  >
                    <span>
                      <FormattedMessage id="search" />
                    </span>
                  </Button>
                </Col>
              </Row>
            </Form>
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
            <Modal
              zIndex={1000}
              width="600px"
              title={modalName}
              visible={visible}
              confirmLoading={loading}
              maskClosable={false}
              onCancel={() =>
                this.setState({
                  visible: false
                })
              }
              footer={[
                <Button
                  key="back"
                  onClick={() => {
                    this.setState({
                      visible: false
                    });
                  }}
                >
                  Close
                </Button>,
                <Button key="submit" type="primary" onClick={() => this.handleSubmit()}>
                  Confirm
                </Button>
              ]}
            >
              <Form {...formItemLayout}>
                <FormItem label="Description name">
                  {getFieldDecorator('descName', {
                    rules: [{ required: true, message: 'Description name is required' }],
                    initialValue: descForm.descName
                  })(
                    <Input
                      style={{ width: '80%' }}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onDescFormChange({
                          field: 'descName',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
                <FormItem label="Display name">
                  {getFieldDecorator('dipNameFr', {
                    initialValue: descForm.dipNameFr,
                    rules: [{ required: true, message: 'Display name is required' }]
                  })(
                    <Input
                      style={{ width: '80%' }}
                      placeholder="French"
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onDescFormChange({
                          field: 'dipNameFr',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
                <FormItem label="">
                  {getFieldDecorator('dipNameEn', {
                    initialValue: descForm.dipNameEn,
                    rules: [{ required: true, message: 'Display name is required' }]
                  })(
                    <Input
                      style={{ width: '80%' }}
                      placeholder="English"
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onDescFormChange({
                          field: 'dipNameEn',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
                <div className="ant-form-item-required">The number display name is set in shop information</div>
                <FormItem label="Status">
                  {getFieldDecorator('status', {
                    initialValue: descForm.status
                  })(
                    <Switch
                      onChange={(value) => {
                        this.onDescFormChange({
                          field: 'status',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
              </Form>
            </Modal>
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

export default Form.create()(DescriptionManagement);
