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
  Select,
  Spin
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
      recommendationAutomationData: [],
      priscriberAutomationData: [],

      visible: false,

      selectedForm: {
        selectedId: '',
        selectedStatus: '',
        selectedTemplateId: '',
        selectedTemplateName: ''
      },

      selectedStatus: '',
      selectedTemplate: '',
      selectedTemplateName: '',
      emailTemplateList: [],
      previewHtml: '',
      loading: false
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
          recommendationAutomationData: res.context.recommendationList,
          priscriberAutomationData: res.context.oktList
        });
      }
    });
  };

  handleCancel = () => {
    const { selectedForm } = this.state;
    this.setState({
      visible: false,
      selectedForm: []
    });
  };
  openSetting = (obj) => {
    const { selectedForm } = this.state;
    selectedForm.selectedId = obj.id;
    selectedForm.selectedStatus = obj.objectStatus;
    selectedForm.selectedTemplateId = obj.templateId;
    selectedForm.selectedTemplateName = obj.emailTemplate;
    this.setState({
      visible: true,
      selectedForm
    });
    if (obj.templateId) {
      this.getEmailTemplateById(obj.templateId);
    }
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
          message.success('Operate successfully');
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
          message.success('Operate successfully');
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
  templateChange = (value, option) => {
    const { selectedForm } = this.state;
    selectedForm.selectedTemplateId = value;
    selectedForm.selectedTemplateName = option.props.children;
    this.setState({
      selectedForm
    });
    this.getEmailTemplateById(value);
  };

  getEmailTemplateById = (id: string) => {
    this.setState({
      loading: true
    });
    let params = {
      templateId: id
    };
    webapi
      .getEmailTemplateById(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let templateData = res.context;
          this.setState({
            loading: false,
            previewHtml: templateData.emailTemplateHtml
          });
        } else {
          message.error(res.message || 'Get Data Failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Get Data Failed');
        this.setState({
          loading: false
        });
      });
  };

  updateNotification = () => {
    const { selectedForm } = this.state;
    let params = {
      id: selectedForm.selectedId,
      templateId: selectedForm.selectedTemplateId,
      emailTemplate: selectedForm.selectedTemplateName
    };
    webapi
      .updateNotification(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState(
            {
              selectedForm: [],
              visible: false
            },
            () => {
              this.getNotificationList();
            }
          );
          message.success('Operate successfully');
        } else {
          message.error(res.message || 'Save Failed');
        }
      })
      .catch((err) => {
        message.error(err || 'Save Failed');
      });
  };

  render() {
    const {
      title,
      orderAutomationData,
      subscriptionAutomationData,
      recommendationAutomationData,
      priscriberAutomationData,
      selectedForm,
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
              dataSource={recommendationAutomationData}
              pagination={false}
            />
          </div>
          <div style={{ marginTop: 30 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ margin: 'auto 0' }}>
                <Icon type="mail" style={{ fontSize: 40 }} />
              </div>
              <div style={{ marginLeft: 10 }}>
                <h3>Email Automation - Prescriber creation</h3>
                <p>
                  Sending Email automatically by the status of Prescriber
                  creation
                </p>
              </div>
            </div>
            <Table
              rowKey="id"
              style={{ marginTop: 20 }}
              columns={columns}
              dataSource={priscriberAutomationData}
              pagination={false}
            />
          </div>
        </div>
        <Modal
          width="800px"
          title="Template Setting"
          visible={this.state.visible}
          onOk={this.updateNotification}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" shape="round" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              shape="round"
              type="primary"
              onClick={this.updateNotification}
            >
              Confirm
            </Button>
          ]}
        >
          <Row>
            <Col span={6}>
              <Form layout="vertical">
                <FormItem label="Status">
                  <p>{selectedForm.selectedStatus}</p>
                </FormItem>
                <FormItem label="Email Template">
                  <Select
                    value={selectedForm.selectedTemplateId}
                    onChange={(value, option) =>
                      this.templateChange(value, option)
                    }
                  >
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
            <Col span={18}>
              <Spin spinning={this.state.loading}>
                {previewHtml ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                    style={{ zoom: '0.5' }}
                  ></div>
                ) : null}
              </Spin>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
const styles = {} as any;

export default Form.create()(Notification);
