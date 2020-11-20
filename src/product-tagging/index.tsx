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
      taggingList: [],

      visible: false,
      taggingForm: {
        taggingName: '',
        taggingFontColor: '',
        taggingFillColor: ''
      },
      isEdit: false,
      currentEditTagging: {},
      modalName: '',
      colourList: []
    };
  }
  componentDidMount() {
    this.querySysDictionary('colour');
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
      taggingName: row.taggingName,
      taggingFontColor: row.taggingFontColor,
      taggingFillColor: row.taggingFillColor
    };
    this.setState(
      {
        modalName: 'Edit tagging',
        visible: true,
        taggingForm,
        isEdit: true,
        currentEditTagging: row
      },
      () => {
        form.setFieldsValue({
          taggingName: row.taggingName,
          taggingFillColor: this.getColour(taggingForm.taggingFillColor) ? this.getColour(taggingForm.taggingFillColor).name : '',
          taggingFontColor: this.getColour(taggingForm.taggingFontColor) ? this.getColour(taggingForm.taggingFontColor).name : ''
        });
      }
    );
  };
  handleSubmit = () => {
    const { taggingForm, isEdit, currentEditTagging } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (isEdit) {
          let params = {
            taggingFillColor: taggingForm.taggingFillColor,
            taggingFontColor: taggingForm.taggingFontColor,
            taggingName: taggingForm.taggingName,
            displayStatus: currentEditTagging.displayStatus ? true : false,
            id: currentEditTagging.id
          };
          this.updateTagging(params);
        } else {
          let params = {
            taggingFillColor: taggingForm.taggingFillColor,
            taggingFontColor: taggingForm.taggingFontColor,
            taggingName: taggingForm.taggingName
          };
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
      pageNum: pagination.current - 1
    };
    webapi
      .getTagging(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          const taggingList = res.context.taggingList;
          this.setState({ taggingList, pagination });
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
          this.setState({
            colourList: res.context.sysDictionaryVOS
          });
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
              visible: false
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
            visible: false
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
      displayStatus: checked ? true : false,
      id: row.id
    };
    this.updateTagging(params);
  };

  getColour = (id) => {
    const { colourList } = this.state;
    let colour = colourList.find((item) => +item.id === +id);
    return colour;
  };

  render() {
    const { title, taggingList, visible, modalName, colourList, taggingForm } = this.state;

    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: 'Tagging name',
        dataIndex: 'taggingName',
        key: 'taggingName'
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
              <p>{text}</p>
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
              <p>{text}</p>
            )}
          </div>
        )
      },
      {
        title: 'Display in shop',
        dataIndex: 'displayStatus',
        key: 'displayStatus',
        render: (text, record) => (
          <Popconfirm placement="topLeft" title={ 'Are you sure '+(+text ?'disable':'enable') + ' this item?'} onConfirm={() => this.updateTaggingStatus(!+text, record)} okText="Confirm" cancelText="Cancel">
            <Switch checked={+text ? true : false}></Switch>
          </Popconfirm>
        )
      },
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
                      field: 'taggingName',
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
                    <Option value={item.id} key={item.id}>
                      <div style={{ width: 10, height: 10, backgroundColor: item.valueEn, display: 'inline-block', borderRadius: '25%' }}></div> {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="Tagging fill color">
              {getFieldDecorator('taggingFillColor', {
                rules: [{ required: true }]
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
                    <Option value={item.id} key={item.id}>
                      <div style={{ width: 10, height: 10, backgroundColor: item.valueEn, display: 'inline-block', borderRadius: '25%' }}></div> {item.name}
                    </Option>
                  ))}
                </Select>
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
