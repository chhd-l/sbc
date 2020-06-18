import React, { Component } from 'react';
import { Table, Divider, Row, Col } from 'antd';
import { WMChart } from 'biz';
import { getClinicById } from './../../prescriber-add/webapi';
import { cache } from 'qmkit';

const prescriberLog = require('./../images/Prescriber.png');

const tradeColumns = [
  {
    title: '日期',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '下单笔数',
    dataIndex: 'orderCount',
    key: 'orderCount'
  },
  {
    title: '下单金额',
    dataIndex: 'orderAmt',
    render: (_text, record) => '￥' + (record.orderAmt || 0).toFixed(2),
    key: 'orderAmt'
  },
  {
    title: '付款订单数',
    dataIndex: 'payOrderCount',
    key: 'payOrderCount'
  },
  {
    title: '付款金额',
    dataIndex: 'payOrderAmt',
    render: (_text, record) => '￥' + (record.payOrderAmt || 0).toFixed(2),
    key: 'payOrderAmt'
  }
];

const customerColumns = [
  {
    title: '日期',
    dataIndex: 'baseDate',
    key: 'baseDate'
  },
  {
    title: '客户总数',
    dataIndex: 'cusAllCount',
    key: 'cusAllCount'
  },
  {
    title: '新增客户数',
    dataIndex: 'cusDayGrowthCount',
    key: 'cusDayGrowthCount'
  }
];

export default class homePrescriber extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      tradeInfo: {},
      prescriber: {},
      tradeData: [],
      flowTrendData: [],
      customerData: [],
      customerGrowTrendData: []
    };
    this.getPrescriberDetail = this.getPrescriberDetail.bind(this);
    this.getPrescriberDetail();
  }

  getPrescriberDetail = async () => {
    let prescriberId = sessionStorage.getItem('PrescriberId');
    if (prescriberId) {
      const { res } = await getClinicById({
        prescriberId: prescriberId
      });
      if (res.code === 'K-000000') {
        this.setState({
          prescriber: res.context
        });
        sessionStorage.setItem(
          cache.PRESCRIBER_DATA,
          JSON.stringify(res.context)
        );
      }
    }
  };

  render() {
    return (
      <div
        className="flowBox todayDataFour"
        style={{ marginLeft: -5, marginRight: -5 }}
      >
        <div
          className="homeItem todayData"
          style={{ width: 'calc(50% - 10px)' }}
        >
          <h3>交易概况&nbsp;今日</h3>
          <div className="dateBg">
            <div className="dataItem">
              <label>付款订单数</label>
              <strong>{this.state.tradeInfo.orderCount || 0}</strong>
            </div>
            <div className="dataItem">
              <label>付款金额</label>
              <strong>
                ￥
                {this.state.tradeInfo.orderCount
                  ? (this.state.tradeInfo.orderCount || 0).toFixed(2)
                  : 0.0}
              </strong>
            </div>
            <div className="dataItem">
              <label>下单笔数</label>
              <strong>{this.state.tradeInfo.orderCount || 0}</strong>
            </div>
            <div className="dataItem">
              <label>下单金额</label>
              <strong>
                ￥
                {this.state.tradeInfo.orderCount
                  ? (this.state.tradeInfo.orderCount || 0).toFixed(2)
                  : 0.0}
              </strong>
            </div>
          </div>
        </div>

        <div
          className="homeItem todayData"
          style={{ width: 'calc(27% - 10px)' }}
        >
          <h3>Reward summary</h3>
          <div className="dateBg">
            <div className="dataItem">
              <label>Reward rate</label>
              <strong>{this.state.tradeInfo.orderCount || 0}%</strong>
            </div>
            <div className="dataItem">
              <label>Reward amount</label>
              <strong>
                ￥
                {this.state.tradeInfo.orderCount
                  ? (this.state.tradeInfo.orderCount || 0).toFixed(2)
                  : 0.0}
              </strong>
            </div>
          </div>
        </div>

        <div
          className="homeItem todayData prescriberInfo"
          style={{ width: 'calc(23% - 10px)', paddingLeft: '0px' }}
        >
          <div>
            <Row>
              <Col span={10}>
                <img src={prescriberLog} alt="" className="prescriberLog" />
              </Col>
              <Col span={2}>
                <Divider type="vertical" />
              </Col>
              <Col span={12}>
                <div className="prescriberWord">
                  <h3>{this.state.prescriber.prescriberName}</h3>
                  <div className="prescriberLable">
                    Prescriber ID: {this.state.prescriber.prescriberId}
                  </div>
                  <div className="prescriberLable">
                    Prescriber Type: {this.state.prescriber.prescriberType}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="homeItem lastTenData">
          <h3>交易报表&nbsp;近10日</h3>
          <Table
            dataSource={this.state.tradeData}
            columns={tradeColumns}
            size="middle"
            pagination={false}
          />
        </div>

        <div className="homeItem lastTenData">
          <h3>交易趋势&nbsp;近10日</h3>
          <WMChart
            title=""
            startTime={new Date()}
            endTime={new Date()}
            dataDesc={[
              { title: '访客数UV', key: 'totalUv' },
              { title: '浏览量PV', key: 'totalPv' },
              { title: '商品访客数', key: 'skuTotalUv' },
              { title: '商品浏览量', key: 'skuTotalPv' }
            ]}
            radioClickBack={() => {}}
            content={this.state.flowTrendData}
            rangeVisible={false}
          />
        </div>

        <div className="homeItem lastTenData">
          <h3>客户增长报表&nbsp;近10日</h3>
          <Table
            dataSource={this.state.customerData}
            columns={customerColumns}
            size="middle"
            pagination={false}
          />
        </div>
        <div className="homeItem lastTenData">
          <h3>客户增长趋势&nbsp;近10日</h3>
          <WMChart
            title=""
            startTime={new Date()}
            endTime={new Date()}
            dataDesc={[
              { title: '客户总数', key: 'cusAllCount' },
              { title: '新增客户数', key: 'cusDayGrowthCount' },
              { title: '注册客户数', key: 'cusDayRegisterCount' }
            ]}
            radioClickBack={() => {}}
            content={this.state.customerGrowTrendData}
            rangeVisible={false}
          />
        </div>
      </div>
    );
  }
}
