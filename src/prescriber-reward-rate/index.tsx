import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, Const } from 'qmkit';
import { Form, Select, Table, Button, Row, Col, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';
const FormItem = Form.Item;
const Option = Select.Option;

const { Column } = Table;

export default class RewardRate extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      timeZone: '',
      sectionList: []
    };
    this.addSection = this.addSection.bind(this);
    this.queryClinicsReward();
  }

  queryClinicsReward = async () => {
    const { res } = await webapi.queryClinicsReward();
    if (res.code === Const.SUCCESS_CODE) {
      if (res.context.length > 0) {
        this.setState({
          sectionList: res.context,
          timeZone: res.context[0].timeZone
        });
      }
    }
  };

  addSection() {
    let section = {
      timeZone: this.state.timeZone,
      tempId: new Date(sessionStorage.getItem('defaultLocalDateTime')).valueOf(),
      orderAmount: '',
      rewardRate: ''
    };
    let sectionList = this.state.sectionList;
    sectionList.push(section);
    this.setState({
      sectionList: sectionList
    });
  }
  saveRewardRate = async (row) => {
    if (!row.timeZone) {
      message.error('Time Zone can not be empty');
      return;
    }
    if (!row.orderAmount) {
      message.error('Order Amount can not be empty');
      return;
    }
    if (!row.rewardRate) {
      message.error('Reward Rate can not be empty');
      return;
    }
    if (row.id) {
      const { res } = await webapi.updateClinicsReward(row);
      if (res.code === Const.SUCCESS_CODE) {
        message.success('update success');
      }
    } else {
      const { res } = await webapi.addClinicsReward(row);
      if (res.code === Const.SUCCESS_CODE) {
        message.success('Add successfully');
      }
    }
  };
  deleteRewardRate = async (row) => {
    if (row.id) {
      const { res } = await webapi.delClinicsReward({ id: row.id });
      if (res.code === Const.SUCCESS_CODE) {
        message.success('delete success');
        let data = this.state.sectionList;
        data = data.filter((item) => {
          if (item.id !== row.id) {
            return item;
          }
        });
        this.setState({
          sectionList: data
        });
      }
    } else {
      let data = this.state.sectionList;
      data = data.filter((item) => {
        if (item.tempId !== row.tempId) {
          return item;
        }
      });
      this.setState({
        sectionList: data
      });
    }
  };
  selectTimeZone = (value) => {
    let data = this.state.sectionList;
    data = data.map((item) => {
      item.timeZone = value;
      return item;
    });
    this.setState({
      timeZone: value,
      sectionList: data
    });
  };
  onDataChange = ({ id, field, value }) => {
    let data = this.state.sectionList;
    let findData = data.find((item) => {
      return item.id === id || item.tempId === id;
    });
    if (findData) {
      findData[field] = value;
      this.setState({
        sectionList: data
      });
    }
  };

  render() {
    const { columns } = this.state;
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container">
          <Headline title="Reward Rate" />
          {/*区间价价table*/}
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          <label style={{ minWidth: '200px', marginRight: '10px' }}>Time Zome:</label>
          Every
          <Select value={this.state.timeZone} onChange={(value) => this.selectTimeZone(value)} style={{ minWidth: '200px', marginLeft: '10px' }}>
            <Option value="Year" key="year">
              Year
            </Option>
            <Option value="Month" key="month">
              Month
            </Option>
            <Option value="Week" key="week">
              Week
            </Option>
          </Select>
          <Table style={{ paddingTop: '10px' }} pagination={false} rowKey="intervalPriceId" dataSource={this.state.sectionList} footer={() => <Button onClick={() => this.addSection()}>+ Add section</Button>}>
            <Column
              title={
                <div>
                  <span
                    style={{
                      color: 'red',
                      fontFamily: 'SimSun',
                      marginRight: '4px',
                      fontSize: '12px'
                    }}
                  >
                    *
                  </span>
                  Order Amount
                </div>
              }
              key="orderAmount"
              width={180}
              render={(rowInfo, _i, index) => {
                return (
                  <Row>
                    <Col span={10}>
                      <FormItem style={{ marginBottom: 0 }}>
                        <Input
                          value={rowInfo.orderAmount}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            const id = rowInfo.id ? rowInfo.id : rowInfo.tempId;
                            this.onDataChange({
                              id,
                              field: 'orderAmount',
                              value
                            });
                          }}
                          addonBefore=" ≥ "
                        />
                      </FormItem>
                    </Col>
                  </Row>
                );
              }}
            />
            <Column
              title={
                <div>
                  <span
                    style={{
                      color: 'red',
                      fontFamily: 'SimSun',
                      marginRight: '4px',
                      fontSize: '12px'
                    }}
                  >
                    *
                  </span>
                  Reward Rate
                </div>
              }
              key="rewardRate"
              width={180}
              render={(rowInfo) => {
                return (
                  <Row>
                    <Col span={10}>
                      <FormItem style={{ marginBottom: 0 }}>
                        <Input
                          value={rowInfo.rewardRate}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            const id = rowInfo.id ? rowInfo.id : rowInfo.tempId;
                            this.onDataChange({
                              id: id,
                              field: 'rewardRate',
                              value
                            });
                          }}
                          addonAfter="%"
                        />
                      </FormItem>
                    </Col>
                  </Row>
                );
              }}
            />
            <Column
              title={<FormattedMessage id="operation" />}
              key="opt"
              width={80}
              render={(rowInfo, _x, i) => {
                return (
                  <div>
                    <Button style={{ marginRight: '10px' }} onClick={() => this.saveRewardRate(rowInfo)}>
                      Save
                    </Button>
                    <Button onClick={() => this.deleteRewardRate(rowInfo)}>Delete</Button>
                  </div>
                );
              }}
            />
          </Table>
        </div>
      </div>
    );
  }
}
