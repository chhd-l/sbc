import React, { Component } from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import { Card, Button, Modal, Form, Input, Alert, Switch } from 'antd';

const FormItem = Form.Item;
class MessageSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      tips:
        'Please go to SendGrid to activate Email,and set up your AccessKeyId and AccessKeySecret in the SendGrid.',
      emailApiList: [
        {
          apiName: 'SendGrid',
          imgUrl:
            'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202008140907121972.png'
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
  componentDidMount() {}

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
        console.log(this.state.settingForm);
        this.setState({
          visible: false
        });
      }
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const { tips, emailApiList } = this.state;
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb />
        <div className="container-search">
          <Headline title="Email Setting" />
          <h5>Email Api</h5>
          {emailApiList &&
            emailApiList.map((item, index) => (
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
                    Edit
                  </a>
                }
                style={{ width: 300 }}
                key={index}
              >
                <div style={styles.center}>
                  <img style={styles.img} src={item.imgUrl} alt="" />
                  <p style={styles.font}>{item.apiName}</p>
                </div>
              </Card>
            ))}
        </div>
        <Modal
          width="450px"
          title="SendGrid Api Setting"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" shape="round" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              shape="round"
              type="primary"
              onClick={this.handleOk}
            >
              Confirm
            </Button>
          ]}
        >
          <Form layout="vertical">
            <FormItem label="Tips" style={styles.formItem}>
              <Alert message={tips} type="warning" />
            </FormItem>
            <FormItem label="Sender" style={styles.formItem}>
              {getFieldDecorator('sender', {
                rules: [{ required: true, message: 'Please input Sender!' }]
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
            <FormItem label="Access Key ID" style={styles.formItem}>
              {getFieldDecorator('accessKeyId', {
                rules: [
                  { required: true, message: 'Please input Access Key ID!' }
                ]
              })(
                <Input
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
            <FormItem label="Access Key Secret" style={styles.formItem}>
              {getFieldDecorator('accessKeySecret', {
                rules: [
                  { required: true, message: 'Please input Access Key Secret!' }
                ]
              })(
                <Input
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
            <FormItem label="Enable" style={styles.formItem}>
              {getFieldDecorator('enable', {
                valuePropName: 'checked'
              })(
                <Switch
                  checkedChildren="on"
                  unCheckedChildren="off"
                  onChange={(checked) => {
                    this.onFormChange({
                      field: 'enable',
                      value: checked
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
  center: {
    textAlign: 'center'
  },
  img: {
    width: 200
  },
  font: {
    fontWeight: 600
  },
  btn: {
    margin: 0,
    padding: 0
  },
  formItem: {
    marginBottom: 0
  }
} as any;

export default Form.create()(MessageSetting);
