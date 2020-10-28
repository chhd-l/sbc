import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin, Alert, InputNumber, Tabs } from 'antd';

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
  componentDidMount() {}

  onSearchFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  onAttributeFormChange = ({ field, value }) => {
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

  genID() {
    let date = moment().format('YYYYMMDDHHmmssSSS');
    return 'AV' + date;
  }

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
        <div key={k.id}>
          <FormItem label={index === 0 ? 'Attribute value' : ''} {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)} required={false} key={'value' + k.id}>
            {getFieldDecorator(`value[${k.id}]`, {
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
                  this.onChangeValue(k.id, value);
                }}
              />
            )}
            <span>
              {obj.length > 1 ? <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => this.remove(k.id)} /> : null}

              <Icon className="dynamic-delete-button" type="plus-circle-o" style={{ marginLeft: 8 }} onClick={() => this.add()} />
            </span>
          </FormItem>
        </div>
      ));
      return formItems;
    }
  };

  remove = (id) => {
    const { attributeValueList } = this.state;
    let attributeValueListTemp = attributeValueList.filter((item) => item.id !== id);
    console.log('temp', attributeValueListTemp);
    console.log('org', attributeValueList);
    this.setState({
      attributeValueList: attributeValueListTemp
    });
  };
  deleteCategory = (id) => {
    const { attributeValueList } = this.state;
    let attributeValueListTemp = attributeValueList.filter((item) => item.id !== id);
    this.setState({
      attributeValueList: attributeValueListTemp
    });
  };

  add = () => {
    const { attributeValueList } = this.state;
    let obj = {
      id: this.genID(),
      value: ''
    };
    attributeValueList.push(obj);
    this.setState({
      attributeValueList
    });
    // this.props.form.setFieldsValue({

    // })
  };
  onChangeValue = (id, value) => {
    const { attributeValueList } = this.state;
    attributeValueList.map((item) => {
      if (item.id === id) {
        item.value = value;
        return item;
      }
    });

    this.setState({
      attributeValueList
    });
  };
  openAddPage = () => {
    const { attributeValueList } = this.state;
    if (attributeValueList.length < 1) {
      this.add();
    }

    this.setState({
      visibleAttribute: true
    });
  };
  handleSubmit = (e) => {
    debugger;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        console.log(
          'Merged values:',
          keys.map((key) => names[key])
        );
        this.setState({
          visibleAttribute: false
        });
      }
    });
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
        key: 'status'
      },
      {
        title: 'Operation',
        dataIndex: '',
        key: 'x',
        render: (rowInfo) => (
          <div>
            <Tooltip placement="top" title="Edit">
              <a style={styles.edit} className="iconfont iconEdit"></a>
            </Tooltip>
            <Tooltip placement="top" title="Delete">
              <a className="iconfont iconDelete">{/*<FormattedMessage id="delete" />*/}</a>
            </Tooltip>
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
                  htmlType="submit"
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
          <Button type="primary" htmlType="submit" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openAddPage()}>
            <span>Add new attribute</span>
          </Button>
          <Table style={{ paddingRight: 20 }} rowKey="id" columns={columns} dataSource={attributeList} pagination={this.state.pagination} loading={this.state.loading} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
        </div>

        <Modal
          width="600px"
          title="Add new attribute"
          visible={visibleAttribute}
          onOk={(e) => this.handleSubmit(e)}
          onCancel={() => {
            this.setState({
              visibleAttribute: false
            });
          }}
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
                rules: [
                  { required: true },
                  {
                    max: 50,
                    message: 'Exceed maximum length!'
                  }
                ]
              })(
                <Radio.Group
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onAttributeFormChange({
                      field: 'attributeType',
                      value
                    });
                  }}
                  value={this.state.value}
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
