import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AssetManagement, AuthWrapper } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Modal, Button, Form, Input, Row, Col, message, Select, Radio, Spin, Tabs, Popconfirm, Switch } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

class TagManagementList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Tag management list',
      searchForm: {
        tagName: '',
        tagDescription: '',
        publishedStatus: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }
  componentDidMount() {}
  updateTagPublishedStatus = (status, row) => {
    console.log(status, row);
  };
  deleteTag = (id) => {
    console.log(id);
  };
  onSearchFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  onSearch = () => {
    const { searchForm, pagination } = this.state;
    console.log(searchForm, pagination);
  };

  render() {
    const { loading, title, taggingList, visible, modalName, colourList, taggingForm, shopPageList, images } = this.state;

    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: 'Tag name',
        dataIndex: 'tagName',
        key: 'tagName',
        width: '15%'
      },
      {
        title: 'Tag description',
        dataIndex: 'tagDescription',
        key: 'tagDescription',
        width: '15%'
      },
      {
        title: 'Is published',
        dataIndex: 'isPublished',
        key: 'isPublished',
        width: '10%',
        render: (text, record) => (
          <Popconfirm placement="topLeft" title={'Are you sure to ' + (+text ? 'disable' : 'enable') + ' this item?'} onConfirm={() => this.updateTagPublishedStatus(!+text, record)} okText="Confirm" cancelText="Cancel">
            <Switch checked={+text ? true : false}></Switch>
          </Popconfirm>
        )
      },
      {
        title: 'Pet owner',
        dataIndex: 'petOwner',
        key: 'petOwner',
        width: '10%'
      },
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '10%'
      },

      {
        title: 'Operation',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title="Detail">
              <Link to={'/subscription-detail/' + record.id} className="iconfont iconDetails"></Link>
            </Tooltip>

            <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteTag(record.id)} okText="Confirm" cancelText="Cancel">
              <Tooltip placement="top" title="Delete">
                <a className="iconfont iconDelete"></a>
              </Tooltip>
            </Popconfirm>
          </div>
        )
      }
    ];

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

    return (
      <AuthWrapper functionName="f_tag_management_list">
        <div>
          <BreadCrumb />
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <div className="container-search">
              <Headline title={title} />
              <Form layout="inline" style={{ marginBottom: 20 }}>
                <Row>
                  <Col span={8}>
                    <FormItem>
                      <Input
                        addonBefore="Tag name"
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onSearchFormChange({
                            field: 'tagName',
                            value
                          });
                        }}
                      />
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem>
                      <Input
                        addonBefore="Tag description"
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onSearchFormChange({
                            field: 'tagDescription',
                            value
                          });
                        }}
                      />
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem>
                      <Input
                        addonBefore="Publish status"
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onSearchFormChange({
                            field: 'publishStatus',
                            value
                          });
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
                          this.onSearch();
                        }}
                      >
                        <span>
                          <FormattedMessage id="search" />
                        </span>
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
          </Spin>
        </div>
      </AuthWrapper>
    );
  }
}
const styles = {
  edit: {
    paddingRight: 10
  },
  tableImage: {
    width: '60px',
    height: '60px',
    padding: '5px',
    border: '1px solid rgb(221, 221, 221)',
    background: 'rgb(255, 255, 255)'
  }
} as any;

export default Form.create()(TagManagementList);
