import React, { Component } from 'react';
import { BreadCrumb, Headline } from 'qmkit';
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
  Col
} from 'antd';

const FormItem = Form.Item;
class Notification extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Notification Automation',

      orderAutomationData: [
        {
          status: 'Out of date',
          emailTemplate: 'RC-US 12115',
          isOpen: '1'
        },
        {
          status: 'Order Confirmation',
          emailTemplate: 'RC-US 12115',
          isOpen: '1'
        },
        {
          status: 'Hava been shipped',
          emailTemplate: 'RC-US 12115',
          isOpen: '0'
        },
        {
          status: 'Partial shipment',
          emailTemplate: 'RC-US 12115',
          isOpen: '1'
        },
        {
          status: 'To be recived',
          emailTemplate: 'RC-US 12115',
          isOpen: '1'
        }
      ],

      subscriptionAutomationData: [
        {
          status: 'New subscription order is coming',
          emailTemplate: 'RC-US 12115',
          isOpen: '1'
        },
        {
          status: 'Information has been changed',
          emailTemplate: 'RC-US 12115',
          isOpen: '1'
        },
        {
          status: 'Cancelled',
          emailTemplate: 'RC-US 12115',
          isOpen: '0'
        },
        {
          status: 'New subscription',
          emailTemplate: 'RC-US 12115',
          isOpen: '1'
        }
      ],
      visible: false,
      selectedStatus: ''
    };
  }
  componentDidMount() {}
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
  openSetting = (selectedStatus) => {
    this.setState({
      visible: true,
      selectedStatus: selectedStatus
    });
  };

  render() {
    const {
      title,
      orderAutomationData,
      subscriptionAutomationData
    } = this.state;
    const columns = [
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
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
            <a onClick={() => this.openSetting(record.status)}>setting</a>
            <Divider type="vertical" />
            <Switch
              checkedChildren="on"
              unCheckedChildren="off"
              defaultChecked={record.isOpen === '1' ? true : false}
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
                  <Input />
                </FormItem>
              </Form>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
const styles = {} as any;

export default Form.create()(Notification);
