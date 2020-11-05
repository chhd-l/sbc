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
      title: 'Attribute library',
      searchForm: {
        attributeName: '',
        attributeValue: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      attributeList: [],
      visibleAttribute: false,
      attributeForm: {
        attributeName: '',
        attributeType: ''
      },
      attributeValueList: []
    };
  }
  componentDidMount() {
    this.getAttributes();
  }

  onSearchFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };

  onSearch = () => {
    console.log('search');
  };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.onSearch()
    );
  };
  onAttributeFormChange = ({ field, value }) => {
    let data = this.state.attributeForm;
    data[field] = value;
    this.setState({
      attributeForm: data
    });
  };
  add = () => {
    const { attributeValueList } = this.state;
    const { form } = this.props;
    let obj = {
      attributeId: this.genID(),
      attributeDetailName: ''
    };

    attributeValueList.push(obj);
    this.setState(
      {
        attributeValueList
      },
      () => {
        let setObj = {};
        let valueName = 'value_' + obj.attributeId;
        setObj[valueName] = obj.attributeDetailName;
        form.setFieldsValue(setObj);
      }
    );
  };

  genID() {
    let date = moment().format('YYYYMMDDHHmmssSSS');
    return 'AV' + date;
  }

  remove = (id) => {
    const { attributeValueList } = this.state;
    let attributeValueListTemp = attributeValueList.filter((item) => item.attributeId !== id);
    this.setState({
      attributeValueList: attributeValueListTemp
    });
  };

  onChangeValue = (id, value) => {
    const { attributeValueList } = this.state;
    attributeValueList.map((item) => {
      if (item.attributeId === id) {
        item.attributeDetailName = value;
        return item;
      }
    });

    this.setState({
      attributeValueList
    });
  };
  openAddPage = () => {
    const { attributeForm } = this.state;
    const { form } = this.props;

    (attributeForm.attributeName = ''), (attributeForm.attributeType = 'Single choice');
    this.setState(
      {
        attributeValueList: [],
        visibleAttribute: true,
        attributeForm
      },
      () => {
        this.add();
        form.setFieldsValue(attributeForm);
      }
    );
  };
  openEditPage = (row) => {
    console.log(row);
  };
  handleSubmit = () => {
    const { attributeForm, attributeValueList } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(attributeForm);
        console.log(attributeValueList);
        debugger;
        let params = {
          attributeName: attributeForm.attributeName,
          attributeType: attributeForm.attributeType,
          attributesValueList: attributeValueList
        };
        console.log(params);
        this.setState({
          visibleAttribute: false
        });
      }
    });
  };
  getAttributes = () => {
    const { searchForm, pagination } = this.state;
    let params = {
      attributeName: searchForm.attributeName,
      attributeValue: searchForm.attributeValue,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    };
    webapi
      .getAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          const attributeList = res.context.attributesList;
          this.setState({ attributeList });
        } else {
          message.error(res.message || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
      });
  };
  addAttributes = (params: object) => {
    webapi
      .postAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          console.log(res);
        } else {
          message.error(res.message || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
      });
  };
  deleteAttributes = (id) => {
    let params = {
      id: id
    };
    webapi
      .deleteAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          console.log(res);
        } else {
          message.error(res.message.toString() || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
      });
  };

  updateAttributeStatus = (id) => {
    let params = {
      id: id
    };
    webapi
      .putAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          console.log(res);
        } else {
          message.error(res.message.toString() || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
      });
  };

  renderForm = (obj) => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 6 }
      }
    };
    if (obj && obj.length > 0) {
      const formItems = obj.map((k, index) => (
        <div key={k.attributeId}>
          <FormItem label={index === 0 ? 'Attribute value' : ''} {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)} required={false} key={'value' + k.id}>
            {getFieldDecorator('value_' + k.attributeId, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input Attribute value.'
                }
              ]
            })(
              <Input
                placeholder="Attribute value"
                style={{ width: '80%', marginRight: 8 }}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onChangeValue(k.attributeId, value);
                }}
              />
            )}
            <span>
              {obj.length > 1 ? <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => this.remove(k.attributeId)} /> : null}

              <Icon className="dynamic-delete-button" type="plus-circle-o" style={{ marginLeft: 8 }} onClick={() => this.add()} />
            </span>
          </FormItem>
        </div>
      ));
      return formItems;
    }
  };

  render() {
    const { title, attributeList, visibleAttribute, attributeValueList } = this.state;

    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: 'Attribute name',
        dataIndex: 'attributeName',
        key: 'attributeName'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => <Switch checked={+text ? true : false} onClick={() => this.updateAttributeStatus(record.id)}></Switch>
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
            <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteAttributes(record.id)} okText="Confirm" cancelText="Cancel">
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
                    addonBefore="Attribute name"
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onSearchFormChange({
                        field: 'attributeName',
                        value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore="Attribute value"
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onSearchFormChange({
                        field: 'attributeValue',
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

        <div className="container">
          <Button type="primary" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openAddPage()}>
            <span>Add new attribute</span>
          </Button>
          <Table style={{ paddingRight: 20 }} rowKey="id" columns={columns} dataSource={attributeList} pagination={this.state.pagination} loading={this.state.loading} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
        </div>

        <Modal
          width="600px"
          title="Add new attribute"
          visible={visibleAttribute}
          footer={[
            <Button
              key="back"
              onClick={() => {
                this.setState({
                  visibleAttribute: false
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
            <FormItem label="Attribute Name">
              {getFieldDecorator('attributeName', {
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
                    this.onAttributeFormChange({
                      field: 'attributeName',
                      value
                    });
                  }}
                />
              )}
            </FormItem>
            <FormItem label="Choose type">
              {getFieldDecorator('attributeType', {
                rules: [{ required: true }]
              })(
                <Radio.Group
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onAttributeFormChange({
                      field: 'attributeType',
                      value
                    });
                  }}
                  style={{ width: '80%' }}
                >
                  <Radio value="Single choice">Single choice</Radio>
                  <Radio value="Multiple choice">Multiple choice</Radio>
                </Radio.Group>
              )}
            </FormItem>
            {this.renderForm(attributeValueList)}
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
