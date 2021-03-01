import React, { Component } from 'react';
import { Modal, Form, Input, Button, Select, Tree, Row, Col, TreeSelect, message, Table } from 'antd';
import { noop, SelectGroup, TreeSelectGroup, util, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';

const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = Tree.TreeNode;

export default class addConsent extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedRowKeys: [],
      serchForm: {},
      loading: false,
      consentList: []
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onFormFieldChange = this.onFormFieldChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.getConsentList = this.getConsentList.bind(this);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { visible, selectedRowKeys } = nextProps;

    if (visible !== prevState.visible) {
      return {
        visible: visible,
        selectedRowKeys: selectedRowKeys
      };
    }

    return null;
  }

  componentDidMount() {
    this.getConsentList();
  }

  getConsentList() {
    const { serchForm } = this.state;
    this.setState({
      loading: true
    });
    webapi
      .getConsents(serchForm)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          res.context.consentVOList.map((item) => {
            item.key = item.id;
          });
          this.setState({
            consentList: res.context.consentVOList,
            loading: false
          });
          this.props.getAllConsent(res.context.consentVOList);
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  }

  onFormFieldChange(key, value) {
    let data = this.state.serchForm;
    data[key] = value;
    this.setState({
      serchForm: data
    });
  }
  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  handleOk() {
    this.props.updateTable(this.state.selectedRowKeys);
  }
  handleCancel() {
    this.props.updateTable();
  }
  render() {
    const { visible, loading, consentList, selectedRowKeys } = this.state;
    const columns = [
      {
        title: 'Consent title',
        dataIndex: 'consentTitle',
        key: 'consentTitle',
        render: (text) => {
          let html = { __html: text };
          return <div dangerouslySetInnerHTML={html}></div>;
        }
      },
      {
        title: 'Consent Id',
        dataIndex: 'consentId',
        key: 'consentId'
      },
      {
        title: 'Consent code',
        dataIndex: 'consentCode',
        key: 'consentCode'
      },
      {
        title: 'Consent type',
        dataIndex: 'consentType',
        key: 'consentType'
      },
      {
        title: 'Category',
        dataIndex: 'consentCategory',
        key: 'consentCategory'
      },
      {
        title: 'Field type',
        dataIndex: 'filedType',
        key: 'filedType'
      }
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <div>
        <Modal className="addTargetProductModal" width="1100px" maskClosable={false} title="Add consents" visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} okText="Confirm" cancelText="Cancel">
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                  <SelectGroup
                    label={<p className="formLable">Category</p>}
                    allowClear={true}
                    style={{ width: 280 }}
                    onChange={(value) => {
                      this.onFormFieldChange('consentCategory', value);
                    }}
                  >
                    <Option value="Prescriber">Prescriber</Option>
                    <Option value="Consumer">Consumer</Option>
                  </SelectGroup>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <SelectGroup
                    allowClear={true}
                    label={<p className="formLable">Field type</p>}
                    style={{ width: 280 }}
                    onChange={(value) => {
                      value = value === '' ? null : value;
                      this.onFormFieldChange('filedType', value);
                    }}
                  >
                    <Option value="Optional">Optional</Option>
                    <Option value="Required">Required</Option>
                  </SelectGroup>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <SelectGroup
                    allowClear={true}
                    label={<p className="formLable">Consent type</p>}
                    style={{ width: 280 }}
                    onChange={(value, index) => {
                      value = value === '' ? null : value;

                      this.onFormFieldChange('consentType', value);
                    }}
                  >
                    <Option value="E-mail in">Email in</Option>
                    <Option value="E-mail out">Email out</Option>
                  </SelectGroup>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p className="formLable">Consent id</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormFieldChange('consentId', value);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p className="formLable">Consent code</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormFieldChange('consentCode', value);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p className="formLable">Consent title</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormFieldChange('consentTitle', value);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon="search"
                    shape="round"
                    onClick={(e) => {
                      e.preventDefault();
                      this.getConsentList();
                    }}
                  >
                    <span>
                      <FormattedMessage id="product.search" />
                    </span>
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={consentList}
            pagination={false}
            loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
          />
        </Modal>
      </div>
    );
  }
}
