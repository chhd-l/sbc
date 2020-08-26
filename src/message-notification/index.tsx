import React, { Component } from 'react';
import { BreadCrumb, Headline, Const } from 'qmkit';
import * as webapi from './webapi';
import {
  Icon,
  Table,
  Tooltip,
  Divider,
  Switch,
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  message,
  Select
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
class Notification extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Notification Automation',

      orderAutomationData: [],

      subscriptionAutomationData: [],
      RecommendationAutomationData: [],

      visible: false,
      selectedStatus: '',
      selectedTemplate: '',
      emailTemplateList: [],
      previewHtml: ''
    };
  }
  componentDidMount() {
    this.getTemplateList();
    this.getNotificationList();
  }

  getNotificationList = () => {
    webapi.getNotificationList().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          orderAutomationData: res.context.orderList,
          subscriptionAutomationData: res.context.subscriptionList,
          RecommendationAutomationData: res.context.recommendationList
        });
      }
    });
  };
  handleOk = () => {
    this.setState({
      visible: false,
      selectedStatus: ''
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
      selectedStatus: ''
    });
  };
  openSetting = (obj) => {
    this.setState({
      visible: true,
      selectedStatus: obj.objectStatus,
      selectedTemplate: obj.templateId
    });
  };
  changeAutoStatus = (id, status) => {
    if (+status === 1) {
      this.closeNotification(id);
    } else {
      this.startNotification(id);
    }
  };
  closeNotification = (id: string) => {
    webapi
      .closeNotification(id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getNotificationList();
          message.success(res.message || 'Update Successful');
        } else {
          message.error(res.message || 'Update Failed');
        }
      })
      .catch((err) => {
        message.error(err || 'Update Failed');
      });
  };
  startNotification = (id: string) => {
    webapi
      .startNotification(id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getNotificationList();
          message.success(res.message || 'Update Successful');
        } else {
          message.error(res.message || 'Update Failed');
        }
      })
      .catch((err) => {
        message.error(err || 'Update Failed');
      });
  };

  getTemplateList = () => {
    webapi.getTemplateList().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          emailTemplateList: res.context.emailTemplateResponseList
        });
      }
    });
  };
  templateChange = (value) => {
    this.setState({
      selectedTemplate: value
    });

    this.getEmailTemplateById(value);
  };

  getEmailTemplateById = (id: string) => {
    let params = {
      templateId: id
    };
    webapi.getEmailTemplateById(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let templateData = res.context.context;
        this.setState({
          previewHtml: templateData.emailTemplateHtml
        });
      }
    });
  };

  render() {
    const {
      title,
      orderAutomationData,
      subscriptionAutomationData,
      RecommendationAutomationData,
      emailTemplateList,
      previewHtml
    } = this.state;
    const columns = [
      {
        title: 'Status',
        dataIndex: 'objectStatus',
        key: 'objectStatus',
        width: '40%'
      },
      {
        title: 'Email Template',
        dataIndex: 'emailTemplate',
        key: 'emailTemplate',
        width: '30%'
      },
      {
        title: 'Operation',
        key: 'operation',
        width: '20%',
        render: (text, record) => (
          <span>
            <a onClick={() => this.openSetting(record)}>setting</a>
            <Divider type="vertical" />
            <Switch
              checkedChildren="on"
              unCheckedChildren="off"
              defaultChecked={+record.status === 1 ? true : false}
              onChange={() => this.changeAutoStatus(record.id, record.status)}
            />
          </span>
        )
      }
    ];
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ margin: 'auto 0' }}>
                <Icon type="mail" style={{ fontSize: 40 }} />
              </div>
              <div style={{ marginLeft: 10 }}>
                <h3>Email Automation - Order</h3>
                <p>Sending Email automatically by the status of Order</p>
              </div>
            </div>
            <Table
              style={{ marginTop: 20 }}
              columns={columns}
              dataSource={orderAutomationData}
              pagination={false}
            />
          </div>
          <div style={{ marginTop: 30 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ margin: 'auto 0' }}>
                <Icon type="mail" style={{ fontSize: 40 }} />
              </div>
              <div style={{ marginLeft: 10 }}>
                <h3>Email Automation - Subscription</h3>
                <p>Sending Email automatically by the status of Subscription</p>
              </div>
            </div>
            <Table
              style={{ marginTop: 20 }}
              columns={columns}
              dataSource={subscriptionAutomationData}
              pagination={false}
            />
          </div>
          <div style={{ marginTop: 30 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ margin: 'auto 0' }}>
                <Icon type="mail" style={{ fontSize: 40 }} />
              </div>
              <div style={{ marginLeft: 10 }}>
                <h3>Email Automation - Recommendation</h3>
                <p>
                  Sending Email automatically by the status of Recommendation
                </p>
              </div>
            </div>
            <Table
              rowKey="id"
              style={{ marginTop: 20 }}
              columns={columns}
              dataSource={RecommendationAutomationData}
              pagination={false}
            />
          </div>
        </div>
        <Modal
          width="600px"
          title="Template Setting"
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
              Cofirm
            </Button>
          ]}
        >
          <Row>
            <Col span={8}>
              <Form layout="vertical">
                <FormItem label="Status">
                  <p>{this.state.selectedStatus}</p>
                </FormItem>
                <FormItem label="Email Template">
                  <Select onChange={(value) => this.templateChange(value)}>
                    {emailTemplateList &&
                      emailTemplateList.map((item, index) => (
                        <Option value={item.templateId} key={index}>
                          {item.emailTemplate}
                        </Option>
                      ))}
                  </Select>
                </FormItem>
              </Form>
            </Col>
            <Col span={16}>
              {previewHtml ? (
                <div dangerouslySetInnerHTML={{ __html: previewHtml }}></div>
              ) : null}
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
const styles = {} as any;

export default Form.create()(Notification);
