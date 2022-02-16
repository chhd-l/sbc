import React from 'react';
import { Row, Col, Table, Breadcrumb, Button, Spin } from 'antd';
import { Headline, BreadCrumb, Const, history } from 'qmkit';
import EditModal from './components/edit-modal';
import { getLandingPageDetail, getResponderList } from './webapi';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

export default class LandingPageDetail extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      landingPage: {},
      responderList: [],
      pagination: { current: 1, pageSize: 10, total: 0 },
      loading: false
    };
  }

  componentDidMount() {
    this.landingPageDetail();
    this.responderList();
  }

  landingPageDetail = () => {
    this.setState({ loading: true });
    getLandingPageDetail(this.props.match?.params?.id).then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          loading: false,
          landingPage: data.res.context ?? {}
        });
      } else {
        this.setState({ loading: false });
      }
    }).catch(() => { this.setState({ loading: false }); });
  };

  responderList = () => {
    this.setState({ loading: true });
    getResponderList({
      landingPageId: this.props.match?.params?.id,
      pageNum: this.state.pagination.current - 1,
      pageSize: this.state.pagination.pageSize
    }).then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          loading: false,
          responderList: data.res.context?.landingPageRegiterSumVOS?.content ?? [],
          pagination: {
            ...this.state.pagination,
            total: data.res.context?.landingPageRegiterSumVOS?.total ?? 0
          }
        });
      } else {
        this.setState({ loading: false });
      }
    }).catch(() => { this.setState({ loading: false }); });
  };

  handlePageChange = (pagination) => {
    this.setState({
      pagination: pagination
    }, this.responderList);
  };

  render() {
    const columns = [
      {
        title: <FormattedMessage id="Survey.pet_owner_account" />,
        dataIndex: 'account',
        key: 'account'
      },
      {
        title: <FormattedMessage id="Survey.pet_owner_name" />,
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: <FormattedMessage id="Survey.pet_owner_type" />,
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: <FormattedMessage id="Survey.email" />,
        dataIndex: 'email',
        key: 'email'
      }
    ];
    const { landingPage, loading, responderList, pagination } = this.state;
    const tablePage = {
      pagination: pagination,
      onChange: this.handlePageChange
    };
    return (
      <Spin spinning={loading}>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item><FormattedMessage id="Marketing.LandingPageDetails" /></Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline title={<FormattedMessage id="Marketing.LandingPageDetails" />} />
          <Row gutter={[24, 12]} style={{fontSize: 14}}>
            <Col span={16}>
              <div style={{backgroundColor:'#fafafa',padding:15}}>
                <div style={{marginBottom: 10}}><strong><FormattedMessage id="Survey.basic_info" /></strong></div>
                <Row>
                  <Col span={12}><FormattedMessage id="Survey.pet_owner_type" />: {landingPage.number}</Col>
                  <Col span={12}><FormattedMessage id="Survey.creation_time" />: {landingPage.registerDate}</Col>
                </Row>
              </div>
            </Col>
            <Col span={8}>
              <div style={{backgroundColor:'#fafafa',padding:15}}>
                <div style={{marginBottom: 10}}><strong><FormattedMessage id="Survey.kpi" /></strong></div>
                <Row>
                  <Col span={12}><FormattedMessage id="Survey.views" />: {landingPage.views}</Col>
                  <Col span={12}><FormattedMessage id="Survey.clicks" />: {landingPage.clicks}</Col>
                </Row>
              </div>
            </Col>
            <Col span={16}>
              <div style={{backgroundColor:'#fafafa',padding:15}}>
                <div style={{marginBottom: 10}}><strong><FormattedMessage id="Marketing.LandingPageContent" /></strong></div>
                <div><FormattedMessage id="Setting.Title" />: {landingPage.title}</div>
                <div><FormattedMessage id="Setting.URL" />: {landingPage.url}</div>
                <div><FormattedMessage id="Setting.Description" />: {landingPage.description}</div>
                <div><FormattedMessage id="Marketing.status" />: {landingPage.status ? <FormattedMessage id="Subscription.Active" /> : <FormattedMessage id="Subscription.Inactive" />}</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="container-search">
          <Headline title={<FormattedMessage id="Survey.responder_list" />} />
          <Table rowKey="id" columns={columns} dataSource={responderList} {...tablePage} />
        </div>
        <div className="bar-button">
          <EditModal id={landingPage.id} title={landingPage.title} url={landingPage.url} description={landingPage.description} callback={this.landingPageDetail} />
          <Button style={{marginLeft: 10}} onClick={() => history.go(-1)}><FormattedMessage id="Marketing.back" /></Button>
        </div>
      </Spin>
    );
  }
};
