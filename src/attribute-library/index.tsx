import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history, checkMenu, checkAuth } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin, Alert, InputNumber, Tabs, Popconfirm } from 'antd';
import { RCi18n } from 'qmkit';
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
      title: RCi18n({id:'Product.AttributeLibrary'}),
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
        attributeNameEn: '',
        attributeType: ''
      },
      attributeValueList: [],
      isEdit: false,
      currentEditAttribute: {},
      modalName: '',
      loading: true,
      nameSelect: 'attributeName',
      valueSelect: 'attributeValue'
    };
  }
  componentDidMount() {
    this.getAttributes();
  }

  onSearchFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data,
      loading: false
    });
  };

  onSearch = () => {
    this.getAttributes();
  };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination,
        loading: false
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
        attributeValueList,
        loading: false
      },
      () => {
        this.setAttributeFieldsValue(attributeValueList);
      }
    );
  };
  setAttributeFieldsValue = (arr) => {
    const { form } = this.props;
    if (arr && arr.length > 0) {
      let attributeObj = {};
      for (let i = 0; i < arr.length; i++) {
        let valueName = 'attributeValue_' + (arr[i].id || arr[i].tempId);
        let tempObj = {};

        tempObj[valueName] = arr[i].attributeDetailName;
        attributeObj = Object.assign(attributeObj, tempObj);
      }
      form.setFieldsValue(attributeObj);

      let displayObj = {};
      for (let i = 0; i < arr.length; i++) {
        let valueName = 'displayValue_' + (arr[i].id || arr[i].tempId);
        let tempObj = {};

        tempObj[valueName] = arr[i].attributeDetailNameEn;
        displayObj = Object.assign(displayObj, tempObj);
      }
      form.setFieldsValue(displayObj);
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
      attributeValueList: attributeValueListTemp,
      loading: false
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
            attributeValueList: attributeValueListTemp,
            loading: false
          });
        } else {
        }
      })
      .catch((err) => {});
  };

  onChangeValue = (id, value, type) => {
    const { attributeValueList } = this.state;
    attributeValueList.map((item) => {
      if (item.id === id || item.tempId === id) {
        if (type === 'attribute') {
          item.attributeDetailName = value;
          return item;
        } else if (type === 'display') {
          item.attributeDetailNameEn = value;
          return item;
        }
      }
    });

    this.setState({
      attributeValueList,
      loading: false
    });
  };
  openAddPage = () => {
    const { attributeForm } = this.state;
    const { form } = this.props;

    attributeForm.attributeName = '';
    attributeForm.attributeNameEn = '';
    attributeForm.attributeType = 'Single choice';

    this.setState(
      {
        modalName: RCi18n({id:'Product.Addnewattribute'}),
        attributeValueList: [],
        visibleAttribute: true,
        attributeForm,
        isEdit: false,
        loading: false
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
    attributeForm.attributeNameEn = row.attributeNameEn;
    attributeForm.attributeType = row.attributeType;
    this.setState(
      {
        modalName: 'Edit attribute',
        attributeValueList: row.attributesValuesVOList || [],
        visibleAttribute: true,
        attributeForm,
        isEdit: true,
        currentEditAttribute: row,
        loading: false
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
              attributeDetailName: attributeValueList[i].attributeDetailName,
              attributeDetailNameEn: attributeValueList[i].attributeDetailNameEn
            };
            tempAttributeValueList.push(attributeValue);
          } else {
            let attributeValue = {
              attributeDetailName: attributeValueList[i].attributeDetailName,
              attributeDetailNameEn: attributeValueList[i].attributeDetailNameEn
            };
            tempAttributeValueList.push(attributeValue);
          }
        }

        if (isEdit) {
          let params = {
            attributeName: attributeForm.attributeName,
            attributeNameEn: attributeForm.attributeNameEn,
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
            attributeNameEn: attributeForm.attributeNameEn,
            attributeType: attributeForm.attributeType,
            attributesValueList: tempAttributeValueList
          };
          this.addAttributes(params);
        }
      }
    });
  };
  getAttributes = () => {
    const { searchForm, pagination, nameSelect, valueSelect } = this.state;
    let params = {
      attributeName: nameSelect === 'attributeName' ? searchForm.attributeName : '',
      displayName: nameSelect === 'displayName' ? searchForm.attributeName : '',
      attributeValue: valueSelect === 'attributeValue' ? searchForm.attributeValue : '',
      displayValue: valueSelect === 'displayValue' ? searchForm.attributeValue : '',
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    };
    this.setState({
      loading: true
    });
    webapi
      .getAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          const attributeList = res.context.attributesList;
          setTimeout(() => {
            this.setState({
              attributeList,
              pagination,
              loading: false
            });
          }, 100);
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
      });
  };
  addAttributes = (params: object) => {
    webapi
      .postAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(RCi18n({id:'Product.OperateSuccessfully'}));

          this.setState(
            {
              visibleAttribute: false,
              loading: false
            },
            () => this.getAttributes()
          );
        } else {
        }
      })
      .catch((err) => {});
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
          message.success(RCi18n({id:'Product.OperateSuccessfully'}));
        } else {
        }
      })
      .catch((err) => {});
  };

  updateAttributeStatus = (checked, row) => {
    let params = {
      attributeName: row.attributeName,
      attributeNameEn: row.attributeNameEn,
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
            visibleAttribute: false,
            loading: false
          });
          this.getAttributes();
          message.success(RCi18n({id:'Product.OperateSuccessfully'}));
        } else {
        }
      })
      .catch((err) => {});
  };

  getAttributeValue = (attributeValueList, type) => {
    let attributeValue = [];
    for (let i = 0; i < attributeValueList.length; i++) {
      if (type === 'attrbuite' && attributeValueList[i].attributeDetailName) {
        attributeValue.push(attributeValueList[i].attributeDetailName);
      } else if (type === 'display' && attributeValueList[i].attributeDetailNameEn) {
        attributeValue.push(attributeValueList[i].attributeDetailNameEn);
      }
    }
    return attributeValue.join(';');
  };

  renderForm = (obj) => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 11 }
      },
      wrapperCol: {
        sm: { span: 12 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        sm: { span: 12, offset: 11 }
      }
    };
    const secondFormItemWithOutLabel = {
      wrapperCol: {
        sm: { span: 20, offset: 0 }
      }
    };
    if (obj && obj.length > 0) {
      const formItems = obj.map((k, index) => (
        <div key={k.tempId}>
          <Row>
            <Col span={13}>
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
                      Attribute value&nbsp;
                      <Tooltip title="Attribute value' is input from other system, which can not be modified, but you can modify 'display name'. If you want to modify 'attribute value', you could contact us.">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  ) : (
                    ''
                  )
                }
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                required={false}
                key={'value_' + (k.id || k.tempId)}
              >
                {getFieldDecorator('attributeValue_' + (k.id || k.tempId), {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: RCi18n({id:'Product.PleaseInputAttributeValue'})
                    }
                  ]
                })(
                  <Input
                    placeholder={RCi18n({id:'Product.Attributevalue'})}
                    disabled={!checkAuth('f_attribute_value_edit')}
                    style={{ marginRight: 8 }}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onChangeValue(k.id || k.tempId, value, 'attribute');
                    }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem {...secondFormItemWithOutLabel}>
                {getFieldDecorator('displayValue_' + (k.id || k.tempId), {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: RCi18n({id:'Product.PleaseInputDisplayValue'})
                    }
                  ]
                })(
                  <Input
                    placeholder="Display value"
                    style={{ marginRight: 8 }}
                    disabled={!checkAuth('f_attribute_value_edit')}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onChangeValue(k.id || k.tempId, value, 'display');
                    }}
                  />
                )}
              </FormItem>
            </Col>
            {checkAuth('f_attribute_value_edit') ? (
              <Col span={2} style={{ marginTop: '10px' }}>
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
              </Col>
            ) : null}
          </Row>
        </div>
      ));
      return formItems;
    }
  };

  _renderNameSelect = () => {
    return (
      <Select
        onChange={(val, a) => {
          this.setState({
            nameSelect: val
          });
        }}
        value={this.state.nameSelect}
        style={styles.label}
      >
        <Option value="attributeName">Attribute name</Option>
        <Option value="displayName">Display name</Option>
      </Select>
    );
  };

  _renderValueSelect = () => {
    return (
      <Select
        onChange={(val, a) => {
          this.setState({
            valueSelect: val
          });
        }}
        value={this.state.valueSelect}
        style={styles.label}
      >
        <Option value="attributeValue">Attribute value</Option>
        <Option value="displayValue">Display value</Option>
      </Select>
    );
  };

  render() {
    const { title, attributeList, visibleAttribute, attributeValueList, modalName, loading } = this.state;

    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: 'Attribute name',
        dataIndex: 'attributeName',
        key: 'attributeName'
      },
      {
        title: 'Display name',
        dataIndex: 'attributeNameEn',
        key: 'attributeNameEn'
      },
      {
        title: 'Attribute value',
        dataIndex: 'attributeValue',
        key: 'attributeValue',
        width: '20%',
        render: (text, record) => <p>{record.attributesValuesVOList ? this.getAttributeValue(record.attributesValuesVOList, 'attrbuite') : ''}</p>
      },
      {
        title: 'Display value',
        dataIndex: 'displayValue',
        key: 'displayValue',
        width: '20%',
        render: (text, record) => <p>{record.attributesValuesVOList ? this.getAttributeValue(record.attributesValuesVOList, 'display') : ''}</p>
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
        <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          <div className="container-search">
            <Headline title={title} />
            <Form layout="inline" style={{ marginBottom: 20 }}>
              <Row>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={this._renderNameSelect()}
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
                      addonBefore={this._renderValueSelect()}
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
            <Table style={{ paddingRight: 20 }} rowKey="id" columns={columns} dataSource={attributeList} pagination={this.state.pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
          </div>

          <Modal
            width="800px"
            title={modalName}
            visible={visibleAttribute}
            onCancel={() => {
              this.getAttributes();
              this.setState({
                visibleAttribute: false
              });
            }}
            footer={[
              <Button
                key="back"
                onClick={() => {
                  this.getAttributes();
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
              <FormItem label="Attribute name">
                {getFieldDecorator('attributeName', {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter attribute name'
                    },
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
              <FormItem label="Display name">
                {getFieldDecorator('attributeNameEn', {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter display name'
                    },
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
                        field: 'attributeNameEn',
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
        </Spin>
      </div>
    );
  }
}
const styles = {
  edit: {
    paddingRight: 10
  },
  label: {
    width: 160,
    textAlign: 'center'
  }
} as any;

export default Form.create()(AttributeLibrary);
