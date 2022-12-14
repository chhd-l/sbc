import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history, checkMenu, checkAuth } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin, Alert, InputNumber, Tabs, Popconfirm } from 'antd';
import { RCi18n } from 'qmkit';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import AttributeValueList from './attribute-value-list';
import arrayMove from 'array-move';
import './index.less'

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
      modalLoading: false,
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

  onSortEnd=({oldIndex, newIndex})=>{
    this.setState({
      attributeValueList: arrayMove(this.state.attributeValueList, oldIndex, newIndex),
    })
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
        modalName: RCi18n({id:"Product.EditAttribute"}),
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
    this.setState({modalLoading:true});
    webapi
      .postAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(RCi18n({id:'Product.OperateSuccessfully'}));

          this.setState(
            {
              visibleAttribute: false,
              modalLoading: false
            },
            () => this.getAttributes()
          );
        } else {
          this.setState({modalLoading:false});
        }
      })
      .catch((err) => {
        this.setState({modalLoading:false});
      });
  };
  deleteAttributes = (id) => {
    let params = {
      id: id
    };
    this.setState({loading:true});
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
      .catch((err) => {
        
      });
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
    this.setState({modalLoading:true});
    webapi
      .putAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            visibleAttribute: false,
            modalLoading: false
          });
          this.getAttributes();
          message.success(RCi18n({id:'Product.OperateSuccessfully'}));
        } else {
          this.setState({modalLoading:false});
        }
      })
      .catch((err) => {
        this.setState({modalLoading:false});
      });
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
        <Option value="attributeName" title={RCi18n({id:'Product.Attributename'})}><FormattedMessage id="Product.Attributename" /></Option>
        <Option value="displayName" title={RCi18n({id:'Product.Displayname'})}><FormattedMessage id="Product.Displayname" /></Option>
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
        <Option value="attributeValue" title={RCi18n({id:'Product.Attributevalue'})}><FormattedMessage id="Product.Attributevalue" /></Option>
        <Option value="displayValue" title={RCi18n({id:'Product.Displayvalue'})}><FormattedMessage id="Product.Displayvalue" /></Option>
      </Select>
    );
  };

  render() {
    const { title, attributeList, visibleAttribute, attributeValueList, modalName, loading, modalLoading } = this.state;

    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: RCi18n({id:'Product.Attributename'}),
        dataIndex: 'attributeName',
        key: 'attributeName'
      },
      {
        title: RCi18n({id:'Product.Displayname'}),
        dataIndex: 'attributeNameEn',
        key: 'attributeNameEn'
      },
      {
        title: RCi18n({id:'Product.Attributevalue'}),
        dataIndex: 'attributeValue',
        key: 'attributeValue',
        width: '20%',
        render: (text, record) => <p>{record.attributesValuesVOList ? this.getAttributeValue(record.attributesValuesVOList, 'attrbuite') : ''}</p>
      },
      {
        title: RCi18n({id:'Product.Displayvalue'}),
        dataIndex: 'displayValue',
        key: 'displayValue',
        width: '20%',
        render: (text, record) => <p>{record.attributesValuesVOList ? this.getAttributeValue(record.attributesValuesVOList, 'display') : ''}</p>
      },
      {
        title: RCi18n({id:'Product.status'}),
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
        title: RCi18n({id:'Product.operation'}),
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title={RCi18n({id:'Product.Edit'})}>
              <a style={styles.edit} onClick={() => this.openEditPage(record)} className="iconfont iconEdit"></a>
            </Tooltip>
            <Popconfirm placement="topLeft" title={RCi18n({id:'Product.sureDeleteThisItem'})} onConfirm={() => this.deleteAttributes(record.id)} okText="Confirm" cancelText="Cancel">
              <Tooltip placement="top" title={RCi18n({id:'Product.Delete'})}>
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
        {/*???????????????*/}
        <Spin spinning={loading}>
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
                      <FormattedMessage id="Product.search" />
                    </span>
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>

          <div className="container-search">
            <Button type="primary" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openAddPage()}>
              <span><FormattedMessage id="Product.Addnewattribute" /></span>
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
                <FormattedMessage id="Product.Close" />
              </Button>,
              <Button key="submit" loading={modalLoading} type="primary" onClick={() => this.handleSubmit()}>
              <FormattedMessage id="Product.Submit" />
              </Button>
            ]}
          >
            <Form {...formItemLayout}>
              <FormItem label={RCi18n({id:'Product.Attributename'})}>
                {getFieldDecorator('attributeName', {
                  rules: [
                    {
                      required: true,
                      message: RCi18n({id:'Product.PleaseEnterAttributeName'})
                    },
                    {
                      max: 50,
                      message: RCi18n({id:'Product.ExceedMaximumLength'})
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
              <FormItem label={RCi18n({id:'Product.Displayname'})}>
                {getFieldDecorator('attributeNameEn', {
                  rules: [
                    {
                      required: true,
                      message: RCi18n({id:'Product.PleaseEnterDisplayName'})
                    },
                    {
                      max: 50,
                      message: RCi18n({id:'Product.ExceedMaximumLength'})
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
              <FormItem label={RCi18n({id:'Product.Choosetype'})}>
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
                    <Radio value="Single choice"><FormattedMessage id="Product.Singlechoice" /></Radio>
                    <Radio value="Multiple choice"><FormattedMessage id="Product.Multiplechoice" /></Radio>
                  </Radio.Group>
                )}
              </FormItem>
              <div style={{position: 'relative'}}>
              <AttributeValueList
              form={this.props.form}
                list={attributeValueList}
                onChangeValue={(id, value, type)=>this.onChangeValue(id, value, type)}
                add={()=>this.add()}
                removeRemote={(id)=>this.removeRemote(id)}
                removeTemp={(id)=>this.removeTemp(id)}
                onSortEnd={this.onSortEnd}
                distance = {1}
                helperClass='sortableHelper-list'
                useDragHandle
              />
              </div>
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
