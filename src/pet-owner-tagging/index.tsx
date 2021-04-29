import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, RCi18n } from 'qmkit';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Radio, Modal } from 'antd';

import * as webapi from './webapi';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const { TextArea } = Input;

class PetOwnerTagging extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: RCi18n({id:'PetOwner.PetOwnerTagging'}),
      searchForm: {
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
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      () => {
        this.getTaggingList();
      }
    );
  };
  getTaggingList = () => {
    const { searchForm, pagination } = this.state;
    let params = {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize,
      name: searchForm.taggingName,
      segmentType: searchForm.taggingType
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
    const { taggingForm, isEdit, isDisable, currentEditTagging, updateDisableTip } = this.state;
    if (isDisable && (currentEditTagging.segmentType !== taggingForm.taggingType || 
      currentEditTagging.isPublished !==taggingForm.taggingStatus )) {
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
            () => this.getTaggingList()
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
    const { loading, title, taggingList, pagination, taggingForm, modalName, visible, isSubmit, isDisable, updateDisableTip } = this.state;

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
        title: RCi18n({id:'PetOwner.TaggingName'}),
        dataIndex: 'name',
        key: 'name',
        width: '15%'
      },
      {
        title: RCi18n({id:'PetOwner.TaggingDescription'}),
        dataIndex: 'description',
        key: 'description',
        width: '15%'
      },
      {
        title: RCi18n({id:'PetOwner.TaggingType'}),
        dataIndex: 'segmentType',
        key: 'segmentType',
        width: '15%',
        render: (text) => <p>{+text ? 'Pet' : 'Pet owner'}</p>
      },

      {
        title: RCi18n({id:'PetOwner.Count'}),
        dataIndex: 'customerNum',
        key: 'customerNum',
        width: '10%'
      },

      {
        title: RCi18n({id:'PetOwner.TaggingStatus'}),
        dataIndex: 'isPublished',
        key: 'isPublished',
        width: '15%',
        render: (text) => <p>{+text ? 'Enable' : 'Disabled'}</p>
      },

      {
        title: RCi18n({id:'PetOwner.Operation'}),
        dataIndex: '',
        key: 'x',
        width: '10%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title={RCi18n({id:'PetOwner.Edit'})}>
              <a onClick={() => this.openEditPage(record)} className="iconfont iconEdit" style={{ paddingRight: 10 }}></a>
            </Tooltip>

            <Popconfirm placement="topLeft" title={RCi18n({id:'PetOwner.AreYouSureToDelete'})} onConfirm={() => this.deleteTagging(record.id)} okText="Confirm" cancelText="Cancel">
              <Tooltip placement="top" title={RCi18n({id:'PetOwner.Delete'})}>
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
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <BreadCrumb thirdLevel={true}>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </BreadCrumb>
            <div className="container-search">
              <Headline title={title} />
              <Form layout="inline" style={{ marginBottom: 20 }}>
                <Row>
                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        <Input style={styles.label} disabled defaultValue={RCi18n({id:'PetOwner.TaggingNameLabel'})} />
                        <Input
                          style={styles.wrapper}
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
                        <Input style={styles.label} disabled defaultValue={RCi18n({id:'PetOwner.TaggingTypeLabel'})} />
                        <Select
                          style={styles.wrapper}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onSearchFormChange({
                              field: 'taggingType',
                              value
                            });
                          }}
                        >
                          <Option value={null}>{RCi18n({id:'PetOwner.All'})}</Option>
                          <Option value={0}>{RCi18n({id:'PetOwner.PetOwner'})}</Option>
                          <Option value={1}>{RCi18n({id:'PetOwner.Pet'})}</Option>
                        </Select>
                      </InputGroup>
                    </FormItem>
                  </Col>

                  <Col span={8} style={{ textAlign: 'center', marginTop: 10 }}>
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
                        <span>{RCi18n({id:'PetOwner.Search'})}</span>
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className="container-search">
              <Button type="primary" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openAddPage()}>
                <span>{RCi18n({id:'PetOwner.AddNewTagging'})}</span>
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
                <FormItem label={RCi18n({id:'PetOwner.TaggingNameLabel'})}>
                  {getFieldDecorator('taggingName', {
                    rules: [
                      { required: true, message: RCi18n({id:'PetOwner.TaggingNameIsRequired'}) },
                      {
                        max: 50,
                        message: RCi18n({id:'PetOwner.ExceedMaximumLength'})
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
                <FormItem label={RCi18n({id:'PetOwner.TaggingDescription'})}>
                  {getFieldDecorator('taggingDescription', {
                    initialValue: taggingForm.taggingDescription,
                    rules: [{ required: true, message: RCi18n({id:'PetOwner.PleaseInputTaggingDescription'}) }]
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

                <FormItem label={RCi18n({id:'PetOwner.TaggingType'})}>
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

                <FormItem label={RCi18n({id:'PetOwner.TaggingStatus'})}>
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
