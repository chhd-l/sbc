import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin, Alert, InputNumber, Tabs, Popconfirm } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

class AttributeLibrary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Product tagging',
      searchForm: {
        taggingName: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },

      visible: false,
      taggingForm: {
        taggingName: '',
        taggingFontColor: '',
        taggingFillColor: ''
      },
      isEdit: false,
      currentEditTagging: {},
      modalName: ''
    };
  }
  componentDidMount() {
    this.getTagging();
  }

  onSearchFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };

  onSearch = () => {
    this.getTagging();
  };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getTagging()
    );
  };
  onTaggingFormChange = ({ field, value }) => {
    let data = this.state.taggingForm;
    data[field] = value;
    this.setState({
      taggingForm: data
    });
  };

  openAddPage = () => {
    const { form } = this.props;
    let taggingForm = {
      taggingName: '',
      taggingFontColor: '',
      taggingFillColor: ''
    };
    this.setState(
      {
        modalName: 'Add new tagging',
        visible: true,
        taggingForm,
        isEdit: false
      },
      () => form.setFieldsValue(taggingForm)
    );
  };
  openEditPage = (row) => {
    const { form } = this.props;
    let taggingForm = {
      taggingName: '',
      taggingFontColor: '',
      taggingFillColor: ''
    };
    this.setState(
      {
        modalName: 'Edit attribute',
        visible: true,
        taggingForm,
        isEdit: true,
        currentEditAttribute: row
      },
      () => {
        form.setFieldsValue(taggingForm);
      }
    );
  };
  handleSubmit = () => {
    console.log('submit');
  };
  getTagging = () => {
    const { searchForm, pagination } = this.state;
    let params = {
      taggingName: searchForm.attributeName,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    };
    webapi
      .getTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          const attributeList = res.context.attributesList;
          this.setState({ attributeList, pagination });
        } else {
          message.error(res.message || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
      });
  };
  addTagging = (params: object) => {
    // webapi
    //   .postTagging(params)
    //   .then((data) => {
    //     const { res } = data;
    //     if (res.code === Const.SUCCESS_CODE) {
    //       message.success('Operate successfully');
    //       this.setState(
    //         {
    //           visible: false
    //         },
    //         () => this.getTagging()
    //       );
    //     } else {
    //       message.error(res.message || 'Operation failed');
    //     }
    //   })
    //   .catch((err) => {
    //     message.error(err.toString() || 'Operation failed');
    //   });
  };
  deleteTagging = (id) => {
    // let params = {
    //   id: id
    // };
    // webapi
    //   .deleteTagging(params)
    //   .then((data) => {
    //     const { res } = data;
    //     if (res.code === Const.SUCCESS_CODE) {
    //       this.getTagging();
    //       message.success('Operate successfully');
    //     } else {
    //       message.error(res.message.toString() || 'Operation failed');
    //     }
    //   })
    //   .catch((err) => {
    //     message.error(err.toString() || 'Operation failed');
    //   });
  };

  updateTagging = (params) => {
    // webapi
    //   .putTagging(params)
    //   .then((data) => {
    //     const { res } = data;
    //     if (res.code === Const.SUCCESS_CODE) {
    //       this.setState({
    //         visible: false
    //       });
    //       this.getTagging();
    //       message.success('Operate successfully');
    //     } else {
    //       message.error(res.message.toString() || 'Operation failed');
    //     }
    //   })
    //   .catch((err) => {
    //     message.error(err.toString() || 'Operation failed');
    //   });
  };
  updateTaggingStatus = (checked, row) => {};

  render() {
    const { title, taggingList, visible, modalName } = this.state;

    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: 'Tagging name',
        dataIndex: 'attributeName',
        key: 'attributeName'
      },
      {
        title: 'Tagging fill color',
        dataIndex: 'attributeValue',
        key: 'attributeValue'
      },
      {
        title: 'Tagging font color',
        dataIndex: 'attributeValue',
        key: 'attributeValue'
      },
      {
        title: 'Display in shop',
        dataIndex: 'attributeStatus',
        key: 'attributeStatus',
        width: '10%',
        render: (text, record) => (
          <Popconfirm placement="topLeft" title={'Are you sure to' + (+text ? 'disable' : 'enable') + 'this attribute?'} onConfirm={() => this.updateTaggingStatus(!+text, record)} okText="Confirm" cancelText="Cancel">
            <Switch checked={+text ? true : false}></Switch>
          </Popconfirm>
        )
      },
      {
        title: 'Product count',
        dataIndex: 'attributeValue',
        key: 'attributeValue'
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
            <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteTagging(record.id)} okText="Confirm" cancelText="Cancel">
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
        <div className="container-search">
          <Headline title={title} />
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore="Tagging name"
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onSearchFormChange({
                        field: 'taggingName',
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
        </div>

        <div className="container-search">
          <Button type="primary" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openAddPage()}>
            <span>Add new tagging</span>
          </Button>
          <Table style={{ paddingRight: 20 }} rowKey="id" columns={columns} dataSource={taggingList} pagination={this.state.pagination} loading={this.state.loading} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
        </div>

        <Modal
          width="600px"
          title={modalName}
          visible={visible}
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
              Submit
            </Button>
          ]}
        >
          <Form {...formItemLayout}>
            <FormItem label="Tagging Name">
              {getFieldDecorator('taggingName', {
                rules: [
                  { required: true },
                  {
                    max: 50,
                    message: 'Exceed maximum length!'
                  }
                ]
              })(
                <Input
                  style={{ width: '80%' }}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onTaggingFormChange({
                      field: 'attributeName',
                      value
                    });
                  }}
                />
              )}
            </FormItem>
            <FormItem label="Tagging font color">
              {getFieldDecorator('taggingFontColor', {
                rules: [{ required: true }]
              })(
                <Input
                  style={{ width: '80%' }}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onTaggingFormChange({
                      field: 'taggingFontColor',
                      value
                    });
                  }}
                />
              )}
            </FormItem>
            <FormItem label="Tagging fill color">
              {getFieldDecorator('taggingFillColor', {
                rules: [{ required: true }]
              })(
                <Input
                  style={{ width: '80%' }}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onTaggingFormChange({
                      field: 'taggingFillColor',
                      value
                    });
                  }}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

export default Form.create()(AttributeLibrary);
