import { Button, Form, Icon, Input, message, Modal, Popconfirm, Radio, Tooltip } from 'antd';
import moment from 'moment';
import { Const } from 'qmkit';
import React from 'react';
import * as webapi from './../webapi';

const FormItem = Form.Item;
class AddCustomizedfilter extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      attributeForm: {
        attributeName: '',
        choiceStatus: ''
      },
      visibleAttribute: false,
      attributeValueList: [],
      isEdit: this.props.type === 'edit' ? true : false,
      currentEditAttribute: {}
    };
  }
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
    return 'CV' + date;
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
      .deleteFilterValue({ id: id })
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
    attributeForm.choiceStatus = 'Single choice';

    this.setState(
      {
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
  openEditPage = () => {
    const { attributeForm } = this.state;
    const { form, currentSelected } = this.props;
    attributeForm.attributeName = currentSelected.attributeName;
    attributeForm.choiceStatus = currentSelected.choiceStatus;
    this.setState(
      {
        attributeValueList: currentSelected.storeGoodsFilterValueVOList || [],
        visibleAttribute: true,
        attributeForm,
        isEdit: true,
        currentEditAttribute: currentSelected
      },
      () => {
        form.setFieldsValue(attributeForm);
        this.setAttributeFieldsValue(this.state.attributeValueList);
      }
    );
  };

  addCustomizeFilter = (params) => {
    webapi
      .addCustomizeToFilter(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
          this.props.refreshList();
          this.setState({ visibleAttribute: false });
        } else {
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failure');
      });
  };
  updateCustomizeFilter = (params) => {
    webapi
      .updateFilter(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
          this.props.refreshList();
          this.setState({ visibleAttribute: false });
        } else {
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failure');
      });
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
            choiceStatus: attributeForm.choiceStatus,
            storeGoodsFilterValueVOList: tempAttributeValueList,
            id: currentEditAttribute.id,
            sort: currentEditAttribute.sort,
            filterStatus: currentEditAttribute.filterStatus,
            filterType: '1'
          };
          this.updateCustomizeFilter(params);
        } else {
          let params = {
            attributeName: attributeForm.attributeName,
            choiceStatus: attributeForm.choiceStatus,
            storeGoodsFilterValueVOList: tempAttributeValueList,
            filterStatus: '1',
            filterType: '1'
          };
          this.addCustomizeFilter(params);
        }
      }
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
    const { visibleAttribute, attributeValueList, isEdit } = this.state;
    const { getFieldDecorator } = this.props.form;
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
      <div style={{ display: 'inline-block' }}>
        {isEdit ? (
          <Tooltip placement="top" title="Edit">
            <a style={styles.edit} onClick={() => this.openEditPage()} className="iconfont iconEdit"></a>
          </Tooltip>
        ) : (
          <Button type="primary" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openAddPage()}>
            <span>Add customized filter</span>
          </Button>
        )}

        <Modal
          width="600px"
          title={isEdit ? 'Edit customized filter' : 'Add customized filter'}
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
            <FormItem label="Filter Name">
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
              {getFieldDecorator('choiceStatus', {
                rules: [{ required: true }]
              })(
                <Radio.Group
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onAttributeFormChange({
                      field: 'choiceStatus',
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
    paddingRight: 20
  }
} as any;
export default Form.create()(AddCustomizedfilter);
