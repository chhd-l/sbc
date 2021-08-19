import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper } from 'qmkit';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Radio, Modal, Alert } from 'antd';
import { FormattedMessage } from 'react-intl';

import * as webapi from './webapi';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const { TextArea } = Input;

class PetOwnerTagging extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Pet owner tagging',
      searchForm: {
        taggingName: '',
        taggingType: null
      },
      oldSearchForm: {
        taggingName: '',
        taggingType: null
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      taggingForm: {
        taggingName: '',
        taggingDescription: '',
        taggingType: 0,
        taggingStatus: 0
      },
      taggingList: [],
      loading: false,
      isDisable: false,
      isSubmit: false,
      updateDisableTip: 'The tagging has been associated with pet owner or pet. Please unbind the relationship firstly'
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
        },
        searchForm: {
          taggingName: '',
          taggingType: null
        },
        oldSearchForm: {
          taggingName: '',
          taggingType: null
        }
      },
      () => {
        this.getTaggingList();
      }
    );
  };

  updateTagging = (params) => {
    this.setState({
      loading: true
    });
    webapi
      .editTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operation successful');
          this.setState({
            visible: false,
            loading: false
          });

          this.getTaggingList();
          this.props.form.resetFields();
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failure');
      });
  };
  deleteTagging = (id) => {
    let idList = [];
    idList.push(id);
    let params = {
      idList: idList
    };
    webapi
      .deleteTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operation successful');
          this.getTaggingList();
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };
  onSearchFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };

  onTaggingFormChange = ({ field, value }) => {
    let data = this.state.taggingForm;
    data[field] = value;
    this.setState({
      taggingForm: data
    });
  };

  onSearch = () => {
    const {searchForm} = this.state
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        oldSearchForm:{
          taggingName: searchForm.taggingName,
          taggingType: searchForm.taggingType
        }
      },
      () => {
        this.getTaggingList();
      }
    );
  };
  getTaggingList = () => {
    const { oldSearchForm, pagination } = this.state;
    let params = {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize,
      name: oldSearchForm.taggingName,
      segmentType: oldSearchForm.taggingType
    };
    this.setState({
      loading: true
    });
    webapi
      .getTaggingList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          const { pagination } = this.state;
          let taggingList = res.context.segmentList;
          pagination.total = res.context.total;
          this.setState({
            taggingList,
            loading: false,
            pagination
          });
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };

  openAddPage = () => {
    let taggingForm = {
      taggingName: '',
      taggingDescription: '',
      taggingType: 0,
      taggingStatus: 0
    };
    this.setState({
      modalName: 'Add new tagging',
      visible: true,
      taggingForm,
      isEdit: false,
      loading: false,
      isDisable: false,
      isSubmit: false
    });
  };
  openEditPage = (row) => {
    let taggingForm = {
      taggingName: row.name,
      taggingType: row.segmentType,
      taggingDescription: row.description,
      taggingStatus: row.isPublished
    };
    this.setState({
      modalName: 'Edit tagging',
      visible: true,
      taggingForm,
      isEdit: true,
      currentEditTagging: row,
      loading: false,
      isDisable: +row.customerNum > 0 ? true : false,
      isSubmit: false
    });
  };
  handleSubmit = () => {
    /*
    *如果tagging上面有绑定的人或者宠物，不能修改type 和 status
    */
    const { taggingForm, isEdit, isDisable, currentEditTagging, updateDisableTip } = this.state;
    if (isDisable && (+currentEditTagging.segmentType !== +taggingForm.taggingType || 
      +currentEditTagging.isPublished !== +taggingForm.taggingStatus )) {
      message.error(updateDisableTip);
      return;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {
          name: taggingForm.taggingName,
          segmentType: taggingForm.taggingType,
          description: taggingForm.taggingDescription,
          isPublished: taggingForm.taggingStatus
        };
        if (isEdit) {
          params = Object.assign(params, {
            id: currentEditTagging.id
          });
          this.updateTagging(params);
        } else {
          this.addTagging(params);
        }
      }
    });
  };

  handleClose = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
      isDisable: false,
      isEdit: false,
      isSubmit: false
    });
  };

  addTagging = (params: object) => {
    this.setState({
      loading: true
    });
    webapi
      .addTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operate successful');
          this.props.form.resetFields();
          this.setState(
            {
              visible: false,
              loading: false
            },
            () => this.init()
          );
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  handleTableChange = (pagination) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getTaggingList()
    );
  };

  render() {
    const { loading, title, taggingList, pagination, taggingForm, modalName, visible,searchForm } = this.state;

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

    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: 'Tagging name',
        dataIndex: 'name',
        key: 'name',
        width: '15%'
      },
      {
        title: 'Tagging description',
        dataIndex: 'description',
        key: 'description',
        width: '15%'
      },
      {
        title: 'Tagging type',
        dataIndex: 'segmentType',
        key: 'segmentType',
        width: '15%',
        render: (text) => <p>{+text ? 'Pet' : 'Pet owner'}</p>
      },

      {
        title: 'Count',
        dataIndex: 'customerNum',
        key: 'customerNum',
        width: '10%'
      },

      {
        title: 'Tagging Status',
        dataIndex: 'isPublished',
        key: 'isPublished',
        width: '15%',
        render: (text) => <p>{+text ? 'Enable' : 'Disabled'}</p>
      },

      {
        title: 'Operation',
        dataIndex: '',
        key: 'x',
        width: '10%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title="Edit">
              <a onClick={() => this.openEditPage(record)} className="iconfont iconEdit" style={{ paddingRight: 10 }}></a>
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

    return (
      <AuthWrapper functionName="f_pet_owner_tagging">
        <div>
          <Spin spinning={loading}>
            <BreadCrumb thirdLevel={true}>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </BreadCrumb>
            <div className="container-search">
              <Headline title={title} />
              <Alert type="info" message={<FormattedMessage id="PetOwner.TaggingInstruction" />} />
              <Form layout="inline" style={{ marginBottom: 20 }}>
                <Row>
                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        <Input style={styles.label} disabled defaultValue="Tagging name" />
                        <Input
                          style={styles.wrapper}
                          value={searchForm.taggingName}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onSearchFormChange({
                              field: 'taggingName',
                              value
                            });
                          }}
                        />
                      </InputGroup>
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        <Input style={styles.label} disabled defaultValue="Tagging type" />
                        <Select
                          style={styles.wrapper}
                          value={searchForm.taggingType}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onSearchFormChange({
                              field: 'taggingType',
                              value
                            });
                          }}
                        >
                          <Option value={null}>All</Option>
                          <Option value={0}>Pet owner</Option>
                          <Option value={1}>Pet</Option>
                        </Select>
                      </InputGroup>
                    </FormItem>
                  </Col>

                  <Col span={8} style={{ textAlign: 'center', marginTop: 0 }}>
                    <FormItem>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon="search"
                        shape="round"
                        onClick={(e) => {
                          e.preventDefault();
                          this.onSearch();
                        }}
                      >
                        <span>Search</span>
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className="container-search">
              <Button type="primary" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openAddPage()}>
                <span>Add new tagging</span>
              </Button>

              <Table style={{ paddingRight: 20 }} rowKey="id" columns={columns} dataSource={taggingList} pagination={pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
            </div>

            <Modal
              zIndex={1000}
              width="600px"
              title={modalName}
              visible={visible}
              confirmLoading={loading}
              maskClosable={false}
              onCancel={this.handleClose}
              footer={[
                <Button key="back" onClick={this.handleClose}>
                  Close
                </Button>,
                <Button key="submit" type="primary" onClick={() => this.handleSubmit()}>
                  Submit
                </Button>
              ]}
            >
              <Form {...formItemLayout}>
                <FormItem label="Tagging name">
                  {getFieldDecorator('taggingName', {
                    rules: [
                      { required: true, message: 'Tagging name is required' },
                      {
                        max: 50,
                        message: 'Exceed maximum length!'
                      }
                    ],
                    initialValue: taggingForm.taggingName
                  })(
                    <Input
                      style={{ width: '80%' }}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onTaggingFormChange({
                          field: 'taggingName',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
                <FormItem label="Tagging description">
                  {getFieldDecorator('taggingDescription', {
                    initialValue: taggingForm.taggingDescription,
                    rules: [{ required: true, message: 'Please input tagging description' }]
                  })(
                    <TextArea
                      style={{ width: '80%' }}
                      autoSize={{ minRows: 2, maxRows: 6 }}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onTaggingFormChange({
                          field: 'taggingDescription',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>

                <FormItem label="Tagging type">
                  {getFieldDecorator('taggingType', {
                    initialValue: +taggingForm.taggingType
                  })(
                    <Radio.Group
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onTaggingFormChange({
                          field: 'taggingType',
                          value
                        });
                      }}
                    >
                      <Radio value={0}>Pet owner</Radio>
                      <Radio value={1}>Pet</Radio>
                    </Radio.Group>
                  )}
                </FormItem>

                <FormItem label="Tagging status">
                  {getFieldDecorator('taggingStatus', {
                    initialValue: +taggingForm.taggingStatus
                  })(
                    <Radio.Group
                      // disabled={isDisable}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onTaggingFormChange({
                          field: 'taggingStatus',
                          value
                        });
                      }}
                    >
                      <Radio value={0}>Disabled</Radio>
                      <Radio value={1}>Enable</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Form>
            </Modal>
          </Spin>
        </div>
      </AuthWrapper>
    );
  }
}

const styles = {
  formItemStyle: {
    width: 335
  },
  label: {
    width: 135,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  wrapper: {
    width: 200
  }
} as any;

export default Form.create()(PetOwnerTagging);
