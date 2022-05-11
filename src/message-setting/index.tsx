import React, { Component } from 'react';
import { AuthWrapper, BreadCrumb, Const, Headline, RCi18n } from 'qmkit';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Alert,
  Switch,
  Row,
  Col,
  Popconfirm,
  message,
  Spin,
  Radio,
  Select,
  AutoComplete,
  Tag,
  Tooltip,
  Icon
} from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import * as webapi from './webapi';
import settingForm from '@/distribution-setting/components/setting-form';

import TextArea from 'antd/lib/input/TextArea';
import EmailReciver from './components/EmailReciver';
const FormItem = Form.Item;
const Option = Select.Option;
class MessageSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      // RCi18n({id:'Order.offline.consumerEmail'})

      emailApiList: [
        // {
        //   apiName: 'SendGrid',
        //   imgUrl: 'https://d2cstgstorage.z13.web.core.windows.net/202104120251509449.png',
        //   isOpen: true
        // },
        // {
        //   apiName: 'SendSay',
        //   imgUrl: 'https://d2cstgstorage.z13.web.core.windows.net/202104120250527111.png',
        //   isOpen: false
        // }
      ],
      senderList: [],
      settingForm: {
        fromEmail: ''
      },
      currentSend: '',
      currentSettingForm: {},
      tags: ['Unremovable', 'Tag 2', 'Tag 3'],
      inputVisible: false,
      inputValue: ''
    };
  }
  componentDidMount() {
    this.getSettingList();
  }

  getSettingList = () => {
    this.setState({
      loading: true
    });
    webapi
      .getApiSettingList()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          console.log(res);
          let settingList = res.context.list.map((item) => {
            item.reciverEmails = item.reciverEmails?.split(',');
            item.ccReciverEmails = item.ccReciverEmails?.split(',');
            return item;
          });

          this.setState({
            loading: false,
            emailApiList: settingList
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || RCi18n({ id: 'Setting.Operationfailure' }));
      });
  };

  saveSetting = () => {
    const { settingForm } = this.state;
    let params = {
      id: settingForm.id,
      fromEmail: settingForm.fromEmail,
      reciverEmails: settingForm?.reciverEmails?.join(','),
      ccReciverEmails: settingForm?.ccReciverEmails?.join(',')
    };
    webapi
      .saveApiSetting(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message);
          this.getSettingList();
          this.setState(
            {
              visible: false,
              senderList: []
            },
            () => {
              this.props.form.resetFields();
            }
          );
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
        message.error(err.toString() || RCi18n({ id: 'Setting.Operationfailure' }));
      });
  };
  openEditModal = (item) => {
    this.setState({
      loading: true,
      currentSend: item.emailTypeName
    });
    webapi
      .getApiSenderList(item.emailType)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let senderList = res.context.list;
          // senderList 去重; 重复邮件名会引发UI 框架bug
          let senderListTemp = [];
          senderList.forEach((item) => {
            senderListTemp.push(item.senderEmail);
          });
          senderList = [...new Set(senderListTemp)];
          this.setState({
            settingForm: item,
            loading: false,
            senderList,
            visible: true
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || RCi18n({ id: 'Setting.Operationfailure' }));
      });
  };

  onFormChange = ({ field, value }) => {
    const emailRegExp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    let data = this.state.settingForm;
    if (field === 'reciverEmails' || field === 'ccReciverEmails') {
      if (emailRegExp.test(value)) {
        data[field]?.push(value);
        data[field] = [...new Set(data[field])];
      }
    } else {
      data[field] = value;
    }
    this.props.form.setFieldsValue({ ...data, inputValue: '' });
    this.setState({
      searchForm: data
    });
  };
  handleOk = () => {
    this.props.form.validateFields((err) => {
      if (!err) {
        this.saveSetting();
      }
    });
  };

  handleCancel = (e) => {
    this.setState(
      {
        visible: false,
        senderList: []
      },
      () => {
        this.props.form.resetFields();
      }
    );
  };

  changeSettingStatus = (id) => {
    let params = {
      id: id,
      status: 1
    };
    webapi
      .updateApiSettingStatus(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message);
          this.getSettingList();
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
        message.error(err.toString() || RCi18n({ id: 'Setting.Operationfailure' }));
      });
  };

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter((tag) => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    let { settingForm } = this.state;
    let reciverEmails = settingForm?.reciverEmails;
    reciverEmails?.split(',').push(e.target.value);
    reciverEmails = reciverEmails?.join(',');
    this.setState({ inputValue: e.target.value, settingForm: { ...settingForm, reciverEmails } });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: ''
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;

    const {
      emailApiList,
      settingForm,
      loading,
      senderList,
      currentSend,
      inputVisible,
      inputValue
    } = this.state;
    const emailRegExp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    // /^(\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]{2,4}\s*?,?\s*?)+$/;
    return (
      <AuthWrapper functionName="f_message_setting">
        <div>
          <Spin spinning={loading}>
            {/*导航面包屑*/}
            <BreadCrumb />
            <div className="container-search">
              <Headline title="Email Setting" />
              <h4>
                <FormattedMessage id="Marketing.EmailApi" />
              </h4>
              <Row>
                {emailApiList &&
                  emailApiList.map((item, index) => (
                    <Col span={8} key={index}>
                      <Card
                        size="small"
                        extra={
                          <a style={styles.btn} onClick={() => this.openEditModal(item)}>
                            <FormattedMessage id="Marketing.Edit" />
                          </a>
                        }
                        style={{ width: 300 }}
                        key={index}
                      >
                        <div style={styles.center}>
                          <div style={styles.imgCenter}>
                            <img style={styles.img} src={item.imgUrl} alt="" />
                          </div>

                          <p style={{ fontWeight: 600 }}>{item.emailTypeName}</p>
                          <div style={styles.switchPositionStyle}>
                            <Popconfirm
                              title={RCi18n({ id: 'Marketing.Message.editTips' })}
                              disabled={+item.status === 1}
                              onConfirm={() => this.changeSettingStatus(item.id)}
                              okText={RCi18n({ id: 'Marketing.Yes' })}
                              cancelText={RCi18n({ id: 'Marketing.No' })}
                            >
                              <Switch
                                checked={+item.status === 1}
                                disabled={+item.status === 1}
                                size="small"
                              />
                            </Popconfirm>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </div>
            <Modal
              width="450px"
              title={<FormattedMessage id="Marketing.EmailApiSetting" />}
              visible={this.state.visible}
              maskClosable={false}
              // onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="back" onClick={this.handleCancel}>
                  <FormattedMessage id="Marketing.Cancel" />
                </Button>,
                <Button key="submit" type="primary" onClick={this.handleOk}>
                  <FormattedMessage id="Marketing.Confirm" />
                </Button>
              ]}
            >
              <Form layout="vertical">
                <FormItem label={<FormattedMessage id="Marketing.Tips" />} style={styles.formItem}>
                  <Alert
                    message={
                      currentSend === 'SendGrid'
                        ? RCi18n({ id: 'Marketing.Message.settingTips' })
                        : RCi18n({ id: 'Marketing.sendsayTip' })
                    }
                    type="warning"
                  />
                </FormItem>
                <FormItem
                  label={<FormattedMessage id="Marketing.Sender" />}
                  style={styles.formItem}
                >
                  {getFieldDecorator('fromEmail', {
                    rules: [
                      {
                        required: true,
                        type: 'email',
                        message: <FormattedMessage id="Order.offline.consumerEmailRequired" />
                      }
                    ],
                    initialValue: settingForm.fromEmail
                  })(
                    <AutoComplete
                      dataSource={senderList}
                      onChange={(value) => {
                        this.onFormChange({
                          field: 'fromEmail',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
                <FormItem
                  label={<FormattedMessage id="Marketing.AccessKeyID" />}
                  style={styles.formItem}
                >
                  {getFieldDecorator('accessKeyId', {
                    initialValue: settingForm.apiKeyId
                  })(
                    <Input
                      disabled
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'accessKeyId',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
                <FormItem
                  label={<FormattedMessage id="Marketing.AccessKeySecret" />}
                  style={styles.formItem}
                >
                  {getFieldDecorator('apiKey', {
                    initialValue: settingForm.apiKey
                  })(
                    <Input.TextArea
                      disabled
                      autoSize={{ minRows: 2, maxRows: 4 }}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'apiKey',
                          value
                        });
                      }}
                    />
                  )}
                </FormItem>
                <FormItem
                  label={<FormattedMessage id="Marketing.reciverEmails" />}
                  style={styles.formItem}
                >
                  <div
                  // style={{
                  //   display: settingForm?.reciverEmails ? 'block' : 'none'
                  // }}
                  >
                    {getFieldDecorator(`reciverEmails`)(<EmailReciver />)}
                  </div>
                </FormItem>
                <FormItem
                  label={<FormattedMessage id="Marketing.ccReciverEmails" />}
                  style={styles.formItem}
                >
                  {getFieldDecorator('ccReciverEmails', {
                    rules: [
                      {
                        pattern: emailRegExp,
                        message: <FormattedMessage id="Order.offline.consumerEmailRequired" />
                      }
                    ],
                    initialValue: settingForm.ccReciverEmails
                  })(
                    <Input.TextArea
                      autoSize={{ minRows: 2, maxRows: 4 }}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'ccReciverEmails',
                          value
                        });
                      }}
                    />
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
  imgCenter: {
    margin: '0 auto',
    width: '200px',
    height: '100px',
    lineHeight: '100px',
    textAlign: 'center'
  },
  center: {
    textAlign: 'center'
  },
  img: {
    width: 200,
    verticalAlign: 'middle'
  },

  btn: {
    margin: 0,
    padding: 0
  },
  formItem: {
    marginBottom: 0
  },
  switchPositionStyle: {
    position: 'absolute',
    right: '10px',
    bottom: '10px'
  }
} as any;

export default Form.create()(injectIntl(MessageSetting));
