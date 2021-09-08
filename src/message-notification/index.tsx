import React, { Component } from 'react';
import { BreadCrumb, Headline, Const } from 'qmkit';
import * as webapi from './webapi';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, message, Select, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;
class Notification extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Marketing.NotificationAutomation" />,

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
      loading: false,
      allLoading: false
    };
  }
  componentDidMount() {
    this.getTemplateList();
    this.getNotificationList();
  }

  getNotificationList = () => {
    this.setState({
      allLoading: true
    });
    webapi
      .getNotificationList()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            orderAutomationData: res.context.orderList,
            subscriptionAutomationData: res.context.subscriptionList,
            recommendationAutomationData: res.context.recommendationList,
            priscriberAutomationData: res.context.oktList,
            allLoading: false
          });
        } else {
          this.setState({
            allLoading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          allLoading: false
        });
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
          message.success(<FormattedMessage id="Marketing.OperateSuccessfully" />);
        }
      })
      .catch((err) => {});
  };
  startNotification = (id: string) => {
    webapi
      .startNotification(id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getNotificationList();
          message.success(<FormattedMessage id="Marketing.OperateSuccessfully" />);
        }
      })
      .catch((err) => {});
  };

  getTemplateList = () => {
    webapi.getTemplateList().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          emailTemplateList: res.context.messageTemplateResponseList
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
          message.success(<FormattedMessage id="Marketing.OperateSuccessfully" />);
        }
      })
      .catch((err) => {});
  };

  render() {
    const { title, orderAutomationData, subscriptionAutomationData, recommendationAutomationData, priscriberAutomationData, selectedForm, emailTemplateList, previewHtml, allLoading } = this.state;
    const columns = [
      {
        title: <FormattedMessage id="Marketing.Status" />,
        dataIndex: 'objectStatus',
        key: 'objectStatus',
        width: '40%'
      },
      {
        title: <FormattedMessage id="Marketing.EmailTemplate" />,
        dataIndex: 'emailTemplate',
        key: 'emailTemplate',
        width: '30%'
      },
      {
        title: <FormattedMessage id="Marketing.Operation" />,
        key: 'operation',
        width: '20%',
        render: (text, record) => (
          <span>
            <a onClick={() => this.openSetting(record)}>
              <FormattedMessage id="Marketing.setting" />
            </a>
            <Divider type="vertical" />
            <Switch checkedChildren="on" unCheckedChildren="off" defaultChecked={+record.status === 1 ? true : false} onChange={() => this.changeAutoStatus(record.id, record.status)} />
          </span>
        )
      }
    ];
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <Spin spinning={allLoading}>
          <div className="container-search">
            <Headline title={title} />
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex' }}>
                <div style={{ margin: 'auto 0' }}>
                  <Icon type="mail" style={{ fontSize: 40 }} />
                </div>
                <div style={{ marginLeft: 10 }}>
                  <h3>
                    <FormattedMessage id="Marketing.EmailAutomationOrder" />
                  </h3>
                  <p>
                    <FormattedMessage id="Marketing.SendingEmailOrder" />
                  </p>
                </div>
              </div>
              <Table style={{ marginTop: 20 }} columns={columns} dataSource={orderAutomationData} pagination={false} />
            </div>
            <div style={{ marginTop: 30 }}>
              <div style={{ display: 'flex' }}>
                <div style={{ margin: 'auto 0' }}>
                  <Icon type="mail" style={{ fontSize: 40 }} />
                </div>
                <div style={{ marginLeft: 10 }}>
                  <h3>
                    <FormattedMessage id="Marketing.EmailAutomationSubscription" />
                  </h3>
                  <p>
                    <FormattedMessage id="Marketing.SendingEmailSubscription" />
                  </p>
                </div>
              </div>
              <Table style={{ marginTop: 20 }} columns={columns} dataSource={subscriptionAutomationData} pagination={false} />
            </div>
            <div style={{ marginTop: 30 }}>
              <div style={{ display: 'flex' }}>
                <div style={{ margin: 'auto 0' }}>
                  <Icon type="mail" style={{ fontSize: 40 }} />
                </div>
                <div style={{ marginLeft: 10 }}>
                  <h3>
                    <FormattedMessage id="Marketing.EmailAutomationRecommendation" />
                  </h3>
                  <p>
                    <FormattedMessage id="Marketing.SendingEmailRecommendation" />
                  </p>
                </div>
              </div>
              <Table rowKey="id" style={{ marginTop: 20 }} columns={columns} dataSource={recommendationAutomationData} pagination={false} />
            </div>
            <div style={{ marginTop: 30 }}>
              <div style={{ display: 'flex' }}>
                <div style={{ margin: 'auto 0' }}>
                  <Icon type="mail" style={{ fontSize: 40 }} />
                </div>
                <div style={{ marginLeft: 10 }}>
                  <h3>
                    <FormattedMessage id="Marketing.EmailAutomationPrescriberCreation" />
                  </h3>
                  <p>
                    <FormattedMessage id="Marketing.SendingEmailPrescriberCreation" />
                  </p>
                </div>
              </div>
              <Table rowKey="id" style={{ marginTop: 20 }} columns={columns} dataSource={priscriberAutomationData} pagination={false} />
            </div>
          </div>
        </Spin>
        <Modal
          width="800px"
          title={<FormattedMessage id="Marketing.TemplateSetting" />}
          visible={this.state.visible}
          onOk={this.updateNotification}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" shape="round" onClick={this.handleCancel}>
              <FormattedMessage id="Marketing.Cancel" />
            </Button>,
            <Button key="submit" shape="round" type="primary" onClick={this.updateNotification}>
              <FormattedMessage id="Marketing.Confirm" />
            </Button>
          ]}
        >
          <Row>
            <Col span={6}>
              <Form layout="vertical">
                <FormItem label={<FormattedMessage id="Marketing.Status" />}>
                  <p>{selectedForm.selectedStatus}</p>
                </FormItem>
                <FormItem label={<FormattedMessage id="Marketing.EmailTemplate" />}>
                  <Select value={selectedForm.selectedTemplateId} onChange={(value, option) => this.templateChange(value, option)}>
                    {emailTemplateList &&
                      emailTemplateList.map((item, index) => (
                        <Option title={item.messageTemplate} value={item.templateId} key={index}>
                          {item.messageTemplate}
                        </Option>
                      ))}
                  </Select>
                </FormItem>
              </Form>
            </Col>
            <Col span={18}>
              <Spin spinning={this.state.loading}>
                {previewHtml ? <div dangerouslySetInnerHTML={{ __html: previewHtml }} style={{ zoom: '0.5' }}></div> : null}
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
