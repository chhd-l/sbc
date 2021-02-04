import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb } from 'antd';

import * as webapi from './webapi';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

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
      },
      tagList: [],
      loading: false
    };
  }
  componentDidMount() {
    this.getTagList();
  }
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
  getTagList = () => {
    let tagList = [];
    let tag = {
      tagName: 'test_1',
      tagDescription: 'test_1',
      publishedStatus: false,
      id: 123,
      petOwner: 5
    };
    tagList.push(tag);
    this.setState({
      tagList
    });
  };

  handleTableChange = (pagination) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getTagList()
    );
  };

  render() {
    const { loading, title, tagList, pagination } = this.state;

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
        width: '10%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title="Detail">
              <Link to={'/tag-management-detail/' + record.id} className="iconfont iconDetails" style={{ paddingRight: 10 }}></Link>
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

    return (
      <AuthWrapper functionName="f_tag_management_list">
        <div>
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <BreadCrumb thirdLevel={true}>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </BreadCrumb>
            <div className="container-search">
              <Headline title={title} />
              <Form layout="inline" style={{ marginBottom: 20 }}>
                <Row>
                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        <Input style={styles.label} disabled defaultValue="Tag name" />
                        <Input
                          style={styles.wrapper}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onSearchFormChange({
                              field: 'tagName',
                              value
                            });
                          }}
                        />
                      </InputGroup>
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        <Input style={styles.label} disabled defaultValue="Tag description" />
                        <Input
                          style={styles.wrapper}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onSearchFormChange({
                              field: 'tagDescription',
                              value
                            });
                          }}
                        />
                      </InputGroup>
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem>
                      <InputGroup compact style={styles.formItemStyle}>
                        <Input style={styles.label} disabled defaultValue="Publish status" />
                        <Select
                          style={styles.wrapper}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onSearchFormChange({
                              field: 'publishStatus',
                              value
                            });
                          }}
                        >
                          <Option value="">All</Option>
                          <Option value="published">Published</Option>
                          <Option value="unpublished">Unpublished</Option>
                        </Select>
                      </InputGroup>
                    </FormItem>
                  </Col>
                  <Col span={24} style={{ textAlign: 'center', marginTop: 10 }}>
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
                        <span>Search</span>
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className="container-search">
              <Link to={'/tag-management-add'}>
                <Button type="primary" style={{ marginBottom: 20 }}>
                  <p>New</p>
                </Button>
              </Link>

              <Table style={{ paddingRight: 20 }} rowKey="id" columns={columns} dataSource={tagList} pagination={pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
            </div>
          </Spin>
        </div>
      </AuthWrapper>
    );
  }
}

const styles = {
  formItemStyle: {
    width: 335
  },
  label: {
    width: 135,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  wrapper: {
    width: 200
  },
  successPoint: {
    display: 'inline-block',
    width: 7,
    height: 7,
    margin: '0 5px 2px 0',
    background: '#008900',
    borderRadius: '50%'
  },
  warningPoint: {
    display: 'inline-block',
    width: 7,
    height: 7,
    margin: '0 5px 2px 0',
    background: '#EE8B00',
    borderRadius: '50%'
  }
} as any;

export default Form.create()(TagManagementList);
