import React, { Component } from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Breadcrumb, Tabs } from 'antd';
import Information from '@/Integration/components/Information';
import Tab from '@/Integration/components/tab';
import '@/Integration/components/index.less'
const { TabPane } = Tabs;

export default class InterfaceView extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activeKey: '0',
      activeTableKey: '0',
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      dataSource: [],
      columns: [
        {
          title: <FormattedMessage id="Interface.RequestID" />,
          dataIndex: 'RequestID',
          key: 'RequestID'
        }
      ]
    };
  }

  onStateTabChange = (key) => {
    this.setState({
      activeKey: key
    });
  };

  onStateTableChange = (key) => {
    this.setState({
      activeTableKey: key
    });
  };

  onSearchPage = (pagination) => {

  };

  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{<FormattedMessage id="Interface.PriceSynchronization" />}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-info">
          <Headline title={<FormattedMessage id="Interface.PriceSynchronization" />} />
          <Tabs defaultActiveKey={this.state.activeKey} onChange={(key) => this.onStateTabChange(key)}>
            {/* Information */}
            <TabPane tab={<FormattedMessage id="Interface.Information" />} key="0">
              <Information />
            </TabPane>
            {/* Statistics */}
            <TabPane tab={<FormattedMessage id="Interface.Statistics" />} key="1">

            </TabPane>
          </Tabs>
        </div>
        {
          this.state.activeKey === '0' ? (
            <div className="container">
              <Tabs defaultActiveKey={this.state.activeTableKey} onChange={(key) => this.onStateTableChange(key)}>
                {/* Information */}
                <TabPane tab={<FormattedMessage id="Interface.AllRequests" />} key="0" />
                {/* Statistics */}
                <TabPane tab={<FormattedMessage id="Interface.Error" />} key="1" />
              </Tabs>
              {/* 表格 */}
              <Tab
                dataSource={this.state.dataSource}
                pagination={this.state.pagination}
                onChange={this.onSearchPage}
                columns={this.state.columns}
              />
            </div>
          ) : null
        }
      </div>
    );
  }
}
