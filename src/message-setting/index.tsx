import React, { Component } from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import { Card, Button, Modal, Form, Input, Alert, Switch, Row, Col, Popconfirm } from 'antd';
import { FormattedMessage,injectIntl } from 'react-intl';
const FormItem = Form.Item;
class MessageSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      // this.props.intl.formatMessage({id:'Order.offline.consumerEmail'})
      
      emailApiList: [
        {
          apiName: 'SendGrid',
          imgUrl: 'https://d2cstgstorage.z13.web.core.windows.net/202104120251509449.png',
          isOpen:true
        },
        {
          apiName: 'SendSay',
          imgUrl: 'https://d2cstgstorage.z13.web.core.windows.net/202104120250527111.png',
          isOpen:false
        }
      ],
      settingForm: {
        sender: '',
        accessKeyId: '',
        accessKeySecret: '',
        enable: false
      }
    };
  }
  componentDidMount() { }

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
        this.setState({
          visible: false
        });
      }
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false
    });
  };
  changeSettingStatus = (id) => {
    console.log('');
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const { emailApiList } = this.state;
    return (
      <div>
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
                      <a
                        style={styles.btn}
                        onClick={() =>
                          this.setState({
                            visible: true
                          })
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

                      <p style={{ fontWeight: 600 }}>{item.apiName}</p>
                      <div style={ styles.switchPositionStyle}>
                        <Popconfirm title={this.props.intl.formatMessage({id:'Marketing.Message.editTips'})}
                          disabled={+item.isOpen === 1}
                          onConfirm={() => this.changeSettingStatus(item.id)} 
                          okText={this.props.intl.formatMessage({id:'Marketing.Yes'})} 
                          cancelText={this.props.intl.formatMessage({id:'Marketing.No'})}>
                          <Switch checked={+item.isOpen === 1} disabled={+item.isOpen === 1} size="small" />
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
          onOk={this.handleOk}
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
              <Alert message={this.props.intl.formatMessage({id:'Marketing.Message.settingTips'})} type="warning" />
            </FormItem>
            <FormItem label={<FormattedMessage id="Marketing.Sender" />} style={styles.formItem}>
              {getFieldDecorator('sender', {
                rules: [{ required: true, message: <FormattedMessage id="Marketing.PleaseInputSender" /> }]
              })(
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'sender',
                      value
                    });
                  }}
                />
              )}
            </FormItem>
            <FormItem label={<FormattedMessage id="Marketing.AccessKeyID" />} style={styles.formItem}>
              {getFieldDecorator('accessKeyId', {
                rules: [{ required: true, message: <FormattedMessage id="Marketing.PleaseInputAccessKeyID" /> }]
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
              {getFieldDecorator('accessKeySecret', {
                rules: [{ required: true, message: <FormattedMessage id="Marketing.PleaseInputAccessKeySecret" /> }]
              })(
                <Input
                  disabled
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'accessKeySecret',
                      value
                    });
                  }}
                />
              )}
            </FormItem>

          </Form>
        </Modal>
      </div>
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
  switchPositionStyle:{
    position: 'absolute',
    right: '10px',
    bottom: '10px',
  }
} as any;

export default Form.create()(injectIntl(MessageSetting));
