import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper } from 'qmkit';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Row, Col, message, Select, Spin, Breadcrumb, Card, Avatar, Pagination, Icon } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const { Search } = Input;
const { Meta } = Card;
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

class TagManagementDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Tag management detail',
      id: this.props.match.params.id,
      pagination: {
        current: 1,
        pageSize: 9,
        total: 10
      },

      tagDetail: {},
      petOwnerList: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }],
      loading: false
    };
  }
  componentDidMount() {
    this.getTagDeatail(this.state.id);
  }
  getTagDeatail = (id) => {
    console.log(id);
  };
  onSearch = (value) => {
    console.log(value);
  };
  onPageChange = (page, pageSize) => {
    console.log(page, pageSize);
  };
  deletePetOwner = (id) => {
    console.log(id);
  };

  render() {
    const { loading, title, tagDetail, petOwnerList, pagination } = this.state;

    const { getFieldDecorator } = this.props.form;

    return (
      <AuthWrapper functionName="f_tag_management_detail">
        <div>
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <BreadCrumb thirdLevel={true}>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </BreadCrumb>
            <div className="container-search">
              <Headline title={tagDetail.tagName} />
              <Row style={{ marginBottom: 20 }}>
                <Col span={20}>
                  <p style={styles.detailDesc}>
                    Tag description:
                    <span style={styles.detailValue}>{tagDetail.tagDescription}</span>
                  </p>
                </Col>
                <Col span={10}>
                  <p style={styles.detailDesc}>
                    Created by:
                    <span style={styles.detailValue}>{tagDetail.createdBy}</span>
                  </p>
                </Col>
                <Col span={10}>
                  <p style={styles.detailDesc}>
                    Created on:
                    <span style={styles.detailValue}>{tagDetail.createdTime}</span>
                  </p>
                </Col>
                <Col span={10}>
                  <p style={styles.detailDesc}>
                    Modified by:
                    <span style={styles.detailValue}>{tagDetail.modifiedBy}</span>
                  </p>
                </Col>
                <Col span={10}>
                  <p style={styles.detailDesc}>
                    Last Modified:
                    <span style={styles.detailValue}>{tagDetail.lastModified}</span>
                  </p>
                </Col>
              </Row>
            </div>
            <div className="container-search">
              <Headline
                title={'Pet owner list (' + pagination.total + ')'}
                extra={
                  <div>
                    <Search placeholder="Please input keyword" onSearch={(value) => this.onSearch(value)} style={{ width: 200 }} />
                    <Button type="primary" style={{ marginLeft: 20 }}>
                      <p>New</p>
                    </Button>
                  </div>
                }
              />
              <Row>
                {petOwnerList &&
                  petOwnerList.map((item, index) => (
                    <Col span={8}>
                      <Card style={{ width: 330, marginTop: 16 }} key={index}>
                        <Meta avatar={<Avatar size={64} icon="user" />} title="Card title" description="This is the description" />
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 10
                          }}
                        >
                          <Link to={'/pet-owner-detail/' + item.id} style={styles.linkStyle}>
                            <Icon type="eye" />
                          </Link>

                          <span style={styles.deleteStyle} className="iconfont iconDelete" onClick={() => this.deletePetOwner(item.id)}></span>
                        </div>
                      </Card>
                    </Col>
                  ))}
              </Row>
              {pagination.total ? <Pagination style={{ marginBottom: 20 }} current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={this.onPageChange} /> : null}
            </div>

            <div className="bar-button">
              <Link to={'/tag-management-edit/' + this.state.id}>
                <Button type="primary">{<FormattedMessage id="edit" />}</Button>
              </Link>
              <Button style={{ marginLeft: 20 }} onClick={() => (history as any).go(-1)}>
                {<FormattedMessage id="back" />}
              </Button>
            </div>
          </Spin>
        </div>
      </AuthWrapper>
    );
  }
}

const styles = {
  detailDesc: {
    color: 'rgba(0, 0, 0, 0.45)',
    lineHeight: 2
  },
  detailValue: {
    color: '#221357'
  },
  deleteStyle: {
    color: '#e2001a',
    marginLeft: 10,
    cursor: 'pointer'
  },
  linkStyle: {
    cursor: 'pointer',
    color: '#221357'
  }
} as any;

export default Form.create()(TagManagementDetail);
