import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin, Alert, InputNumber, Tabs } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

class AttributeLibrary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Attribute library',
      searchForm: {
        attributeName: '',
        attributeValue: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      attributeList: []
    };
  }
  componentDidMount() {}

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  onSearch = () => {
    console.log('search');
  };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.onSearch()
    );
  };

  render() {
    const { title, attributeList } = this.state;
    const columns = [
      {
        title: 'Attribute name',
        dataIndex: 'attributeName',
        key: 'attributeName'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: 'Operation',
        dataIndex: '',
        key: 'x',
        render: (rowInfo) => (
          <div>
            <Tooltip placement="top" title="Edit">
              <a style={styles.edit} className="iconfont iconEdit"></a>
            </Tooltip>
            <Tooltip placement="top" title="Delete">
              <a className="iconfont iconDelete">{/*<FormattedMessage id="delete" />*/}</a>
            </Tooltip>
          </div>
        )
      }
    ];

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <Form layout="inline" style={{ marginBottom: 20 }}>
            <Row>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore="Attribute name"
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'attributeName',
                        value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore="Attribute value"
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'attributeValue',
                        value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="search"
                  shape="round"
                  onClick={(e) => {
                    e.preventDefault();
                    this.onSearch();
                  }}
                >
                  <span>
                    <FormattedMessage id="search" />
                  </span>
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        <div className="container">
          <Button
            type="primary"
            htmlType="submit"
            onClick={(e) => {
              e.preventDefault();
              this.onSearch();
            }}
          >
            <span>Add new attribute</span>
          </Button>
          <Table style={{ paddingRight: 20 }} rowKey="id" columns={columns} dataSource={attributeList} pagination={this.state.pagination} loading={this.state.loading} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
        </div>
      </div>
    );
  }
}
const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

export default Form.create()(AttributeLibrary);
