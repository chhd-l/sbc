import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb } from 'antd';

import * as webapi from './webapi';

const { Search } = Input;
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
        pageSize: 10,
        total: 0
      },

      tagDetail: {},
      petOwnerList: [],
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
                  </div>
                }
              />
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
  }
} as any;

export default Form.create()(TagManagementDetail);
