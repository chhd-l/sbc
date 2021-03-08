import React from 'react';
import { Headline } from 'qmkit';
import { Alert, Table, Button, Switch, Modal, Form, Input, Select } from 'antd';

export default class Fields extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      list: [],
      visible: false
    };
  }

  handleOk = () => {
    this.setState({
      visible: false
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const { loading, list, visible } = this.state;
    const columns = [
      {
        tilte: 'Sequence',
        dataIndex: 'no',
        key: 'c1'
      },
      {
        title: 'Field name',
        dataIndex: 'no',
        key: 'c2'
      },
      {
        title: 'Field type',
        dataIndex: 'no',
        key: 'c3'
      },
      {
        title: 'Input type',
        dataIndex: 'no',
        key: 'c4'
      },
      {
        title: 'Max length',
        dataIndex: 'no',
        key: 'c5'
      },
      {
        title: 'Required',
        dataIndex: 'no',
        key: 'c6',
        render: (_, record) => <Switch />
      },
      {
        title: 'Enable',
        dataIndex: 'no',
        key: 'c7',
        render: (_, record) => <Switch />
      }
    ];
    return (
      <div className="container-search">
        <Headline title="Address setting" />
        <Alert type="info" message="Address setting is for address adding and address edit of shop and store portal" />
        <Button type="primary" style={{ marginBottom: 10 }}>
          Manage display
        </Button>
        <Table rowKey="id" loading={loading} columns={columns} dataSource={list} />
        <Modal title="Edit field" visible={visible} okText="Save" cancelText="Cancel" onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form>
            <Form.Item label="Field name">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Input type">
              <Select>
                <Select.Option value="1" key="1">
                  Free text
                </Select.Option>
                <Select.Option value="2" key="2">
                  Search box
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Data source">
              <Select>
                <Select.Option value="1">API</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="API name">
              <Select>
                <Select.Option value="1">Dadata</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
