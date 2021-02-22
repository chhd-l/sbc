import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper } from 'qmkit';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Row, Col, message, Select, Spin, Breadcrumb, Card, Avatar, Pagination, Icon, Popconfirm, Empty } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

import AddPetOwner from './components/add-pet-owner';

const { Search } = Input;
const { Meta } = Card;

class TagManagementDetail extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Tag management detail',
      id: this.props.match.params.id,
      pagination: {
        current: 1,
        pageSize: 9,
        total: 0
      },
      tagDetail: {
        tagName: '',
        tagDescription: '',
        // createdBy:'',
        createdTime: '',
        // modifiedBy:'',
        lastModified: ''
      },
      keyword: '',
      petOwnerList: [],
      loading: false,
      visible: false
    };
  }
  componentDidMount() {
    this.getTagDetail(this.state.id);
    this.getIncludePetOwnerList();
  }
  getTagDetail = (id) => {
    this.setState({
      loading: true
    });
    webapi
      .getTagDetail(id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let tempObj = res.context;
          let tagDetail = {
            tagName: tempObj.name,
            tagDescription: tempObj.description,
            // createdBy:'',
            createdTime: tempObj.createTime,
            // modifiedBy:'',
            lastModified: tempObj.updateTime
          };
          this.setState({
            tagDetail,
            loading: false
          });
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };
  onSearch = (value) => {
    this.setState(
      {
        keyword: value,
        pagination: {
          current: 1,
          pageSize: 9,
          total: 0
        }
      },
      () => this.getIncludePetOwnerList()
    );
  };
  onPageChange = (page, pageSize) => {
    console.log(page, pageSize);
  };
  deletePetOwner = (id) => {
    webapi
      .deletePetOwnerBindTag({ id })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operation successful');
          this.getIncludePetOwnerList();
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };
  getIncludePetOwnerList = () => {
    const { pagination, keyword, id } = this.state;
    let params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1,
      keyword: keyword,
      segmentId: id
    };
    this.setState({
      loading: true
    });
    webapi
      .getBindPetOwner(params)
      .then((data) => {
        const { res } = data;
        this.setState({
          loading: true
        });
        if (res.code === Const.SUCCESS_CODE) {
          let petOwnerList = res.context.segmentCustomerRelList;
          pagination.total = res.context.total;
          this.setState({
            petOwnerList,
            loading: false,
            pagination
          });
          message.success(res.message || 'Operation successful');
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };

  render() {
    const { loading, title, tagDetail, petOwnerList, pagination, visible, id, keyword } = this.state;

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
                {/* <Col span={10}>
                  <p style={styles.detailDesc}>
                    Created by:
                    <span style={styles.detailValue}>{tagDetail.createdBy}</span>
                  </p>
                </Col> */}
                <Col span={10}>
                  <p style={styles.detailDesc}>
                    Created on:
                    <span style={styles.detailValue}>{tagDetail.createdTime}</span>
                  </p>
                </Col>
                {/* <Col span={10}>
                  <p style={styles.detailDesc}>
                    Modified by:
                    <span style={styles.detailValue}>{tagDetail.modifiedBy}</span>
                  </p>
                </Col> */}
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
                    <Search
                      placeholder="Please input keyword"
                      value={keyword}
                      onChange={(e) => {
                        let value = e.target.value;
                        this.setState({ keyword: value });
                      }}
                      onSearch={(value) => this.onSearch(value)}
                      style={{ width: 200, marginRight: 20 }}
                    />
                    <AddPetOwner tagId={id} refreshFunction={this.onSearch} />
                  </div>
                }
              />
              <Row>
                {petOwnerList && petOwnerList.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : null}
                {petOwnerList &&
                  petOwnerList.map((item, index) => (
                    <Col span={8}>
                      <Card style={{ width: 330, marginTop: 16 }} key={index}>
                        <Meta avatar={<Avatar size={64} icon="user" />} title={<div>{item.customer.customerDetail && item.customer.customerDetail.firstName + ' ' + item.customer.customerDetail.lastName}</div>} description={<div>{item.customer.customerAccount}</div>} />
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

                          <Popconfirm placement="topRight" title={'Are you sure to delete this item?'} onConfirm={() => this.deletePetOwner(item.id)} okText="Confirm" cancelText="Cancel">
                            <span style={styles.deleteStyle} className="iconfont iconDelete"></span>
                          </Popconfirm>
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
    color: '#221357',
    marginLeft: 10
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
