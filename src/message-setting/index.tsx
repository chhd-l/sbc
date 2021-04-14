import React, { Component } from 'react';
import { AuthWrapper, BreadCrumb, Const, Headline } from 'qmkit';
import { Card, Button, Modal, Form, Input, Alert, Switch, Row, Col, Popconfirm, message, Spin, Radio, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import * as webapi from './webapi';
import settingForm from '@/distribution-setting/components/setting-form';
const FormItem = Form.Item;
const Option = Select.Option;
class MessageSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      // this.props.intl.formatMessage({id:'Order.offline.consumerEmail'})

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
      senderList:[],
      settingForm:{
        fromEmail:''
      },
      currentSettingForm: {
      }
    };
  }
  componentDidMount() {
    this.getSettingList()
  }

  getSettingList = () => {
    this.setState({
      loading: true
    })
    webapi.getApiSettingList().then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        console.log(res);
        let settingList = res.context.list 
        
        this.setState({
          loading: false,
          emailApiList:settingList
        })
      }
    }).catch(err => {
      this.setState({
        loading: false
      })
      message.error(err.toString() || 'Operation failure')
    })
  }


  saveSetting = () => {
    const { settingForm } = this.state
    let params = {
      id: settingForm.id,
      fromEmail:settingForm.fromEmail
    }
    webapi.saveApiSetting(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        message.success(res.message)
        this.getSettingList()
        this.setState({
          visible: false
        },()=>{
          this.props.form.resetFields()
        })
        
        
      }else{
        this.setState({
          loading: false
        })
      }
    }).catch(err => {
      this.setState({
        loading: false
      })
      message.error(err.toString() || 'Operation failure')
    })
  }
  openEditModal=(item)=>{
    this.setState({
      loading: true
    })
    webapi.getApiSenderList(item.emailType).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        console.log(res);
        let senderList = res.context.list
        this.setState({
          settingForm:item,
          loading: false,
          senderList,
          visible:true
        })
      }
    }).catch(err => {
      this.setState({
        loading: false
      })
      message.error(err.toString() || 'Operation failure')
    })
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.settingForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  handleOk = () => {
    this.props.form.validateFields((err) => {
      if (!err) {
        this.saveSetting()
      }
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false
    },()=>{
      this.props.form.resetFields()
    });
  };

  changeSettingStatus = (id) => {
    let params={
      id: id,
      status: 1,
    }
    webapi.updateApiSettingStatus(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        message.success(res.message)
        this.getSettingList()
      }else{
        this.setState({
          loading: false
        })
      }
    }).catch(err => {
      this.setState({
        loading: false
      })
      message.error(err.toString() || 'Operation failure')
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const { emailApiList, settingForm, loading,senderList } = this.state;
    return (
      <AuthWrapper functionName="f_message_setting">
        <div>
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
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
                    <Col span={8}>
                      <Card
                        size="small"
                        extra={
                          <a style={styles.btn}
                            onClick={() =>
                              this.openEditModal(item)
                            }
                          >
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
                            <Popconfirm title={this.props.intl.formatMessage({ id: 'Marketing.Message.editTips' })}
                              disabled={+item.status === 1}
                              onConfirm={() => this.changeSettingStatus(item.id)}
                              okText={this.props.intl.formatMessage({ id: 'Marketing.Yes' })}
                              cancelText={this.props.intl.formatMessage({ id: 'Marketing.No' })}>
                              <Switch checked={+item.status === 1} disabled={+item.status === 1} size="small" />
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
              title={<FormattedMessage id="Marketing.SendGridApiSetting" />}
              visible={this.state.visible}
              maskClosable={false}
              // onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="back" shape="round" onClick={this.handleCancel}>
                  <FormattedMessage id="Marketing.Cancel" />
                </Button>,
                <Button key="submit" shape="round" type="primary" onClick={this.handleOk}>
                  <FormattedMessage id="Marketing.Confirm" />
                </Button>
              ]}
            >
              <Form layout="vertical">
                <FormItem label={<FormattedMessage id="Marketing.Tips" />} style={styles.formItem}>
                  <Alert message={this.props.intl.formatMessage({ id: 'Marketing.Message.settingTips' })} type="warning" />
                </FormItem>
                <FormItem label={<FormattedMessage id="Marketing.Sender" />} style={styles.formItem}>
                  {getFieldDecorator('fromEmail', {
                    rules: [{ required: true, message: <FormattedMessage id="Marketing.PleaseInputSender" /> }],
                    initialValue: settingForm.fromEmail
                  })(
                    <Select
                      onChange={(value) => {
                        this.onFormChange({
                          field: 'fromEmail',
                          value
                        });
                      }}
                    >
                      {
                        senderList&&senderList.map((item,index)=>(
                          <Option value={item.senderEmail} key={index}>{item.senderEmail}</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
                <FormItem label={<FormattedMessage id="Marketing.AccessKeyID" />} style={styles.formItem}>
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
                <FormItem label={<FormattedMessage id="Marketing.AccessKeySecret" />} style={styles.formItem}>
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
    textAlign: 'center',
  },
  center: {
    textAlign: 'center',

  },
  img: {
    width: 200,
    verticalAlign: 'middle',
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
    bottom: '10px',
  }
} as any;

export default Form.create()(injectIntl(MessageSetting));
