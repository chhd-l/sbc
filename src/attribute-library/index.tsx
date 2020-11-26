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
      attributeValueList: [],
      isEdit: false,
      currentEditAttribute: {},
      modalName: ''
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
    this.getAttributes();
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
      tempId: this.genID(),
      attributeDetailName: ''
    };

    attributeValueList.push(obj);
    this.setState(
      {
        attributeValueList
      },
      () => {
        this.setAttributeFieldsValue(attributeValueList);
      }
    );
  };
  setAttributeFieldsValue = (arr) => {
    const { form } = this.props;
    if (arr && arr.length > 0) {
      let setObj = {};
      for (let i = 0; i < arr.length; i++) {
        let valueName = 'value_' + (arr[i].id || arr[i].tempId);
        let tempObj = {};

        tempObj[valueName] = arr[i].attributeDetailName;
        setObj = Object.assign(setObj, tempObj);
      }
      form.setFieldsValue(setObj);
    } else {
      this.add();
    }
  };

  genID() {
    let date = moment().format('YYYYMMDDHHmmssSSS');
    return 'AV' + date;
  }

  removeTemp = (id) => {
    const { attributeValueList } = this.state;
    let attributeValueListTemp = attributeValueList.filter((item) => item.tempId !== id);
    this.setState({
      attributeValueList: attributeValueListTemp
    });
  };
  removeRemote = (id) => {
    const { attributeValueList } = this.state;
    webapi
      .deleteAttributesValue({ id: id })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let attributeValueListTemp = attributeValueList.filter((item) => item.id !== id);
          this.setState({
            attributeValueList: attributeValueListTemp
          });
        } else {
          message.error(res.message.toString() || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
      });
  };

  onChangeValue = (id, value) => {
    const { attributeValueList } = this.state;
    attributeValueList.map((item) => {
      if (item.id === id || item.tempId === id) {
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

    attributeForm.attributeName = '';
    attributeForm.attributeType = 'Single choice';

    this.setState(
      {
        modalName: 'Add new attribute',
        attributeValueList: [],
        visibleAttribute: true,
        attributeForm,
        isEdit: false
      },
      () => {
        this.add();
        form.setFieldsValue(attributeForm);
      }
    );
  };
  openEditPage = (row) => {
    const { attributeForm } = this.state;
    const { form } = this.props;

    attributeForm.attributeName = row.attributeName;
    attributeForm.attributeType = row.attributeType;
    this.setState(
      {
        modalName: 'Edit attribute',
        attributeValueList: row.attributesValuesVOList || [],
        visibleAttribute: true,
        attributeForm,
        isEdit: true,
        currentEditAttribute: row
      },
      () => {
        form.setFieldsValue(attributeForm);
        this.setAttributeFieldsValue(this.state.attributeValueList);
      }
    );
  };
  handleSubmit = () => {
    const { attributeForm, attributeValueList, isEdit, currentEditAttribute } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let tempAttributeValueList = [];
        for (let i = 0; i < attributeValueList.length; i++) {
          if (attributeValueList[i].id) {
            let attributeValue = {
              id: attributeValueList[i].id,
              attributeDetailName: attributeValueList[i].attributeDetailName
            };
            tempAttributeValueList.push(attributeValue);
          } else {
            let attributeValue = {
              attributeDetailName: attributeValueList[i].attributeDetailName
            };
            tempAttributeValueList.push(attributeValue);
          }
        }

        if (isEdit) {
          let params = {
            attributeName: attributeForm.attributeName,
            attributeType: attributeForm.attributeType,
            attributesValueList: tempAttributeValueList,
            attributeStatus: currentEditAttribute.attributeStatus ? true : false,
            id: currentEditAttribute.id,
            sort: currentEditAttribute.sort
          };
          this.updateAttributes(params);
        } else {
          let params = {
            attributeName: attributeForm.attributeName,
            attributeType: attributeForm.attributeType,
            attributesValueList: tempAttributeValueList
          };
          this.addAttributes(params);
        }
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
  addAttributes = (params: object) => {
    webapi
      .postAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');

          this.setState(
            {
              visibleAttribute: false
            },
            () => this.getAttributes()
          );
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
          this.getAttributes();
          message.success('Operate successfully');
        } else {
          message.error(res.message.toString() || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
      });
  };

  updateAttributeStatus = (checked, row) => {
    let params = {
      attributeName: row.attributeName,
      attributeStatus: checked ? true : false,
      attributeType: row.attributeType,
      id: row.id,
      sort: row.sort,
      attributesValueList: row.attributesValuesVOList
    };
    this.updateAttributes(params);
  };

  updateAttributes = (params) => {
    webapi
      .putAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            visibleAttribute: false
          });
          this.getAttributes();
          message.success('Operate successfully');
        } else {
          message.error(res.message.toString() || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
      });
  };

  getAttributeValue = (attributeValueList) => {
    let attributeValue = [];
    for (let i = 0; i < attributeValueList.length; i++) {
      attributeValue.push(attributeValueList[i].attributeDetailName);
    }
    return attributeValue.join(';');
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
        <div key={k.tempId}>
          <FormItem
            label={
              index === 0 ? (
                <span>
                  <span
                    style={{
                      color: 'red',
                      fontFamily: 'SimSun',
                      marginRight: '4px',
                      fontSize: '12px'
                    }}
                  >
                    {' '}
                    *
                  </span>
                  Attribute value
                </span>
              ) : (
                ''
              )
            }
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            required={false}
            key={'value_' + (k.id || k.tempId)}
          >
            {getFieldDecorator('value_' + (k.id || k.tempId), {
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
                  this.onChangeValue(k.id || k.tempId, value);
                }}
              />
            )}
            <span>
              {obj.length > 1 ? (
                <>
                  {k.id ? (
                    <Popconfirm placement="topRight" title="Are you sure to delete this item?" onConfirm={() => this.removeRemote(k.id)} okText="Confirm" cancelText="Cancel">
                      <Icon className="dynamic-delete-button" type="minus-circle-o" />
                    </Popconfirm>
                  ) : (
                    <Popconfirm placement="topRight" title="Are you sure to delete this item?" onConfirm={() => this.removeTemp(k.tempId)} okText="Confirm" cancelText="Cancel">
                      <Icon className="dynamic-delete-button" type="minus-circle-o" />
                    </Popconfirm>
                  )}
                </>
              ) : null}
              <Icon className="dynamic-delete-button" type="plus-circle-o" style={{ marginLeft: 8 }} onClick={() => this.add()} />
            </span>
          </FormItem>
        </div>
      ));
      return formItems;
    }
  };

  render() {
    const { title, attributeList, visibleAttribute, attributeValueList, modalName } = this.state;

    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: 'Attribute name',
        dataIndex: 'attributeName',
        key: 'attributeName'
      },
      {
        title: 'Attribute value',
        dataIndex: 'attributeValue',
        key: 'attributeValue',
        width: '30%',
        render: (text, record) => <p>{record.attributesValuesVOList ? this.getAttributeValue(record.attributesValuesVOList) : ''}</p>
      },
      {
        title: 'Status',
        dataIndex: 'attributeStatus',
        key: 'attributeStatus',
        width: '10%',
        render: (text, record) => (
          <Popconfirm placement="topLeft" title={'Are you sure to ' + (+text ? ' disable' : 'enable') + ' this attribute?'} onConfirm={() => this.updateAttributeStatus(!+text, record)} okText="Confirm" cancelText="Cancel">
            <Switch checked={+text ? true : false}></Switch>
          </Popconfirm>
        )
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

        <div className="container-search">
          <Button type="primary" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openAddPage()}>
            <span>Add new attribute</span>
          </Button>
          <Table style={{ paddingRight: 20 }} rowKey="id" columns={columns} dataSource={attributeList} pagination={this.state.pagination} loading={this.state.loading} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
        </div>

        <Modal
          width="600px"
          title={modalName}
          visible={visibleAttribute}
          onCancel={() =>
            this.setState({
              visibleAttribute: false
            })
          }
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
