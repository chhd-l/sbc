import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history, AuthWrapper } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin, Alert, InputNumber } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

class OrderSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Audit Setting',
      isAudit: false,
      isPetInfo: false,
      visibleAuditConfig: false,
      configData: []
    };
  }
  componentDidMount() {}
  save = () => {
    console.log('save');
  };

  render() {
    const { title, isAudit, isPetInfo, visibleAuditConfig, configData } = this.state;
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
    const columns = [
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: '33%'
      },
      {
        title: 'Superior category',
        dataIndex: 'superiorCategory',
        key: 'superiorCategory',
        width: '33%'
      },

      {
        title: 'Need audit',
        dataIndex: 'needAudit',
        key: 'needAudit',
        width: '33%',
        render: () => <Switch checked></Switch>
      }
    ];

    return (
      <AuthWrapper functionName="f_order_audit_setting">
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <Form layout="horizontal" {...formItemLayout} labelAlign="left">
            <FormItem label="No audit required">
              <Switch
                size="small"
                checked={!isAudit}
                onClick={(checked) => {
                  this.setState({
                    isAudit: !checked
                  });
                }}
              ></Switch>
            </FormItem>
            <FormItem label="Audit according to product category">
              <Switch
                size="small"
                checked={isAudit}
                onClick={(checked) => {
                  this.setState({
                    isAudit: checked
                  });
                }}
              ></Switch>
              {isAudit ? (
                <Tooltip placement="top" title="Edit">
                  <a
                    onClick={() => {
                      this.setState({
                        visibleAuditConfig: true
                      });
                    }}
                    style={{ marginLeft: 10 }}
                    href="javascript:void(0)"
                    className="iconfont iconEdit"
                  ></a>
                </Tooltip>
              ) : null}
            </FormItem>
            <FormItem label="Pet information as a reference">
              <Switch
                size="small"
                checked={isPetInfo}
                onClick={(checked) => {
                  this.setState({
                    isPetInfo: checked
                  });
                }}
              ></Switch>
            </FormItem>
          </Form>
        </div>
        <Modal
          width="800px"
          title="Please select the product category to be reviewed."
          visible={visibleAuditConfig}
          onOk={() => {
            this.setState({
              visibleAuditConfig: false
            });
          }}
          onCancel={() => {
            this.setState({
              visibleAuditConfig: false
            });
          }}
        >
          <p>
            <span
              style={{
                color: 'red',
                fontFamily: 'SimSun',
                marginRight: '4px',
                fontSize: '12px'
              }}
            >
              *
            </span>
            Signed category 2 categories have been signed then maximum is 200 categories
          </p>
          <Table rowKey="id" columns={columns} dataSource={configData} pagination={false}></Table>
        </Modal>
        <div className="bar-button">
          <Button type="primary" shape="round" style={{ marginRight: 10 }} onClick={() => this.save()}>
            {<FormattedMessage id="save" />}
          </Button>
        </div>
      </AuthWrapper>
    );
  }
}

export default Form.create()(OrderSetting);
