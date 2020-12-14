import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history, AssetManagement } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin, Alert, InputNumber, Tabs, Popconfirm } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import Upload from '../navigation-update/components/upload';

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
      taggingList: [],

      visible: false,
      taggingForm: {
        taggingName: '',
        taggingFontColor: '',
        taggingFillColor: '',
        taggingType: 'Text',
        taggingImgUrl: '',
        displayStatus: false,
        showPage: []
      },
      isEdit: false,
      currentEditTagging: {},
      modalName: '',
      colourList: [],
      shopPageList: [],
      loading: true
    };
  }
  componentDidMount() {
    this.querySysDictionary('colour');
    this.querySysDictionary('shopPage');
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
  setImageUrl = (url) => {
    const { form } = this.props;
    this.onTaggingFormChange({ field: 'taggingImgUrl', value: url });
    form.setFieldsValue({
      taggingImgUrl: url
    });
  };
  onTaggingFormChange = ({ field, value }) => {
    const { form } = this.props;
    let data = this.state.taggingForm;
    data[field] = value;
    this.setState(
      {
        taggingForm: data
      },
      () => {
        form.setFieldsValue({
          taggingFillColor: this.getColour(data.taggingFillColor) ? this.getColour(data.taggingFillColor).name : '',
          taggingFontColor: this.getColour(data.taggingFontColor) ? this.getColour(data.taggingFontColor).name : ''
        });
      }
    );
  };

  openAddPage = () => {
    const { form } = this.props;
    let taggingForm = {
      taggingName: '',
      taggingFontColor: '',
      taggingFillColor: '',
      taggingType: 'Text',
      taggingImgUrl: '',
      displayStatus: false,
      showPage: []
    };
    this.setState(
      {
        modalName: 'Add new tagging',
        visible: true,
        taggingForm,
        isEdit: false,
        loading: false
      },
      () => form.setFieldsValue(taggingForm)
    );
  };
  openEditPage = (row) => {
    const { form } = this.props;
    row.taggingType = row.taggingType ? row.taggingType : 'Text';
    let taggingForm = {
      taggingName: row.taggingName,
      taggingType: row.taggingType,
      taggingFontColor: row.taggingFontColor,
      taggingFillColor: row.taggingFillColor,
      taggingImgUrl: row.taggingImgUrl,
      displayStatus: row.displayStatus,
      showPage: row.showPage ? row.showPage.split(',') : []
    };
    this.setState(
      {
        modalName: 'Edit tagging',
        visible: true,
        taggingForm,
        isEdit: true,
        currentEditTagging: row,
        loading: false
      },
      () => {
        form.setFieldsValue({
          taggingName: row.taggingName,
          taggingFillColor: this.getColour(taggingForm.taggingFillColor) ? this.getColour(taggingForm.taggingFillColor).name : '',
          taggingFontColor: this.getColour(taggingForm.taggingFontColor) ? this.getColour(taggingForm.taggingFontColor).name : '',
          taggingType: row.taggingType,
          taggingImgUrl: row.taggingImgUrl,
          displayStatus: row.displayStatus,
          showPage: row.showPage ? row.showPage.split(',') : []
        });
      }
    );
  };
  handleSubmit = () => {
    const { taggingForm, isEdit, currentEditTagging } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        taggingForm.taggingType = taggingForm.taggingType ? taggingForm.taggingType : 'Text';
        let params = {
          taggingName: taggingForm.taggingName,
          taggingFontColor: taggingForm.taggingType === 'Text' ? taggingForm.taggingFontColor : '',
          taggingFillColor: taggingForm.taggingType === 'Text' ? taggingForm.taggingFillColor : '',
          taggingType: taggingForm.taggingType,
          taggingImgUrl: taggingForm.taggingType === 'Text' ? '' : taggingForm.taggingImgUrl,
          displayStatus: taggingForm.displayStatus,
          showPage: Array.isArray(taggingForm.showPage) ? taggingForm.showPage.join(',') : taggingForm.showPage
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
  getTagging = () => {
    const { searchForm, pagination } = this.state;
    let params = {
      taggingName: searchForm.taggingName,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1,
      loading: false
    };
    webapi
      .getTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          const taggingList = res.context.taggingList;
          this.setState({ taggingList, pagination, loading: false });
        } else {
          message.error(res.message || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
      });
  };
  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({ type: type })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          if (type === 'colour') {
            this.setState({
              colourList: res.context.sysDictionaryVOS,
              loading: false
            });
          }
          if (type === 'shopPage') {
            this.setState({
              shopPageList: res.context.sysDictionaryVOS,
              loading: false
            });
          }
        } else {
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failure');
      });
  };
  addTagging = (params: object) => {
    webapi
      .addTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
          this.setState(
            {
              visible: false,
              loading: false
            },
            () => this.getTagging()
          );
        } else {
          message.error(res.message || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
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
          this.getTagging();
          message.success('Operate successfully');
        } else {
          message.error(res.message.toString() || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
      });
  };

  updateTagging = (params) => {
    webapi
      .updateTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            visible: false,
            loading: false
          });
          this.getTagging();
          message.success('Operate successfully');
        } else {
          message.error(res.message.toString() || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
      });
  };
  updateTaggingStatus = (checked, row) => {
    let params = {
      taggingFillColor: row.taggingFillColor,
      taggingFontColor: row.taggingFontColor,
      taggingName: row.taggingName,
      taggingType: row.taggingType,
      taggingImgUrl: row.taggingImgUrl,
      displayStatus: checked ? true : false,
      id: row.id
    };
    this.updateTagging(params);
  };

  getColour = (value) => {
    const { colourList } = this.state;
    let colour = colourList.find((item) => item.id == value || item.valueEn === value);
    return colour;
  };

  render() {
    const { loading, title, taggingList, visible, modalName, colourList, taggingForm, shopPageList } = this.state;

    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: 'Tagging name',
        dataIndex: 'taggingName',
        key: 'taggingName'
      },
      {
        title: 'Tagging type',
        dataIndex: 'taggingType',
        key: 'taggingType'
      },
      {
        title: 'Tagging fill color',
        dataIndex: 'taggingFillColor',
        key: 'taggingFillColor',
        render: (text) => (
          <div>
            {this.getColour(text) ? (
              <>
                <div style={{ width: 12, height: 12, backgroundColor: this.getColour(text).valueEn, display: 'inline-block', borderRadius: '25%', border: '1px solid', marginRight: 5 }}></div>
                {this.getColour(text).name}
              </>
            ) : (
              <p>-</p>
            )}
          </div>
        )
      },
      {
        title: 'Tagging font color',
        dataIndex: 'taggingFontColor',
        key: 'taggingFontColor',
        render: (text) => (
          <div>
            {this.getColour(text) ? (
              <>
                <div style={{ width: 12, height: 12, backgroundColor: this.getColour(text).valueEn, display: 'inline-block', borderRadius: '25%', border: '1px solid', marginRight: 5 }}></div>
                {this.getColour(text).name}
              </>
            ) : (
              <p>-</p>
            )}
          </div>
        )
      },
      {
        title: 'Tagging image',
        dataIndex: 'taggingImgUrl',
        key: 'taggingImgUrl',
        render: (text) => (text ? <img style={styles.tableImage} src={text} alt="Image" /> : null)
      },
      // {
      //   title: 'Display in shop',
      //   dataIndex: 'displayStatus',
      //   key: 'displayStatus',
      //   render: (text, record) => (
      //     <Popconfirm placement="topLeft" title={'Are you sure to ' + (+text ? 'disable' : 'enable') + ' this item?'} onConfirm={() => this.updateTaggingStatus(!+text, record)} okText="Confirm" cancelText="Cancel">
      //       <Switch checked={+text ? true : false}></Switch>
      //     </Popconfirm>
      //   )
      // },
      {
        title: 'Product count',
        dataIndex: 'productNum',
        key: 'productNum'
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
        <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
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
            <Table style={{ paddingRight: 20 }} rowKey="id" columns={columns} dataSource={taggingList} pagination={this.state.pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
          </div>

          {/* <AssetManagement /> */}

          {visible ? (
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
                <FormItem label="Tagging name">
                  {getFieldDecorator('taggingName', {
                    rules: [
                      { required: true, message: 'Tagging name is required' },
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
                          field: 'taggingName',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
                <FormItem label="Tagging type">
                  {getFieldDecorator('taggingType', {
                    initialValue: taggingForm.taggingType,
                    rules: [{ required: true, message: 'Please selected tagging type' }]
                  })(
                    <Radio.Group
                      name="radiogroup"
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onTaggingFormChange({
                          field: 'taggingType',
                          value
                        });
                      }}
                    >
                      <Radio value="Text">Text</Radio>
                      <Radio value="Image">Image</Radio>
                    </Radio.Group>
                  )}
                </FormItem>

                {taggingForm.taggingType === 'Text' ? (
                  <div>
                    <FormItem label="Tagging font color">
                      {getFieldDecorator('taggingFontColor', {
                        rules: [{ required: true, message: 'Tagging font color is required' }]
                      })(
                        <Select
                          style={{ width: '80%' }}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onTaggingFormChange({
                              field: 'taggingFontColor',
                              value
                            });
                          }}
                        >
                          {colourList.map((item) => (
                            <Option value={item.valueEn} key={item.id}>
                              <div style={{ width: 10, height: 10, backgroundColor: item.valueEn, display: 'inline-block', borderRadius: '25%' }}></div> {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label="Tagging fill color">
                      {getFieldDecorator('taggingFillColor', {
                        rules: [{ required: true, message: 'Tagging fill color is required' }]
                      })(
                        <Select
                          style={{ width: '80%' }}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onTaggingFormChange({
                              field: 'taggingFillColor',
                              value
                            });
                          }}
                        >
                          {colourList.map((item) => (
                            <Option value={item.valueEn} key={item.id}>
                              <div style={{ width: 10, height: 10, backgroundColor: item.valueEn, display: 'inline-block', borderRadius: '25%' }}></div> {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </div>
                ) : (
                  <FormItem label="Tagging Image">
                    {getFieldDecorator('taggingImgUrl', {
                      rules: [{ required: true, message: 'Tagging image is required' }]
                    })(<Upload form={this.props.form} setUrl={this.setImageUrl} defaultValue={taggingForm.taggingImgUrl} />)}
                  </FormItem>
                )}
                <FormItem label="Display in shop">
                  {getFieldDecorator('displayStatus', {
                    initialValue: taggingForm.displayStatus ? true : false
                  })(
                    <Radio.Group
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onTaggingFormChange({
                          field: 'displayStatus',
                          value
                        });
                      }}
                    >
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                {taggingForm.displayStatus ? (
                  <FormItem label="Shop page">
                    {getFieldDecorator('showPage', {
                      rules: [{ required: true, message: 'Please selec shop page' }]
                    })(
                      <Select
                        mode="multiple"
                        style={{ width: '80%' }}
                        onChange={(value) => {
                          value = Array.isArray(value) ? value.join(',') : value;
                          this.onTaggingFormChange({
                            field: 'showPage',
                            value
                          });
                        }}
                      >
                        {shopPageList.map((item) => (
                          <Option value={item.value} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                ) : null}
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

export default Form.create()(AttributeLibrary);
