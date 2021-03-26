import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, Const } from 'qmkit';
import { Row, Spin, Table, Radio, Col, Switch } from 'antd';

export default class PrescriberSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      prescriberSettingData: []
    };
  }
  render() {
    let columns = [
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category'
      },
      {
        title: 'Parent Category',
        dataIndex: 'parentCategory',
        key: 'parentCategory'
      },
      {
        title: 'Need Prescriber',
        dataIndex: 'needPrescriber',
        key: 'needPrescriber'
      }
    ];
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title="Prescriber Setting" />
          <Row className="tipBox">Please select the product category to be reviewed.</Row>
          <Row>
            <span className="ant-form-item-required">Sigase category 4 categories have been signed then maximum is 20 categories</span>
          </Row>
          <Row>
            <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
              <Table dataSource={this.state.prescriberSettingData} columns={columns} />
            </Spin>
          </Row>
          <Row>
            <Col span={8}>Selection Type</Col>
            <Col span={16}>
              <Radio.Group>
                <Radio value={1}>Prescriber Map</Radio>
                <Radio value={2}>Recommendation Code</Radio>
              </Radio.Group>
            </Col>
          </Row>
          <Row>
            <Col span={8}>If prescriber is not mandatory</Col>
            <Col span={16}>
              <Switch></Switch>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
