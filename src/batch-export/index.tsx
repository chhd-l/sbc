import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { RCi18n } from 'qmkit';
import BatchExport from './components/batch-export';
import type { fieldDataType, labelDataType } from './data.d';
import { orderSeachField, subscriptionSeachField } from './common';
import { getOrderSelect } from './webapi';
import './index.less';

interface BatchExportPageState {
  fieldData: fieldDataType[];
  selectData?: labelDataType[];
  title: string;
  breadcrumb1: string;
  breadcrumb2: string;
  exportType: number;
  isServiceOrder: Boolean;
}
export default class BatchExportPage extends Component<any, BatchExportPageState> {
  state: BatchExportPageState = {
    fieldData: [],
    selectData: [],
    title: '',
    breadcrumb1: '',
    breadcrumb2: '',
    exportType: 1, // 1-order 2-sub
    isServiceOrder: false
  };

  componentDidMount() {
    const { from } = this.props.match.params;
    if (from === 'order-list' || from === 'service-order-list') {
      getOrderSelect().then(({ res }) => {
        let selectData = res.context.map((item) => {
          return {
            name: item.desc,
            value: item.value
          };
        });
        this.setState({ selectData });
      });
      this.setState({
        fieldData: orderSeachField,
        title: RCi18n({ id: 'Public.orders' }),
        breadcrumb1: RCi18n({ id: 'Menu.Order' }),
        breadcrumb2: RCi18n({ id: 'Menu.Order list' }),
        exportType: 1,
        isServiceOrder: from === 'service-order-list'
      });
    } else if (from === 'subscription-list') {
      let frequencyItem = subscriptionSeachField.find(
        (item) => item.key === 'cycleTypeId_autoship'
      );
      frequencyItem.options = {
        cycleTypeId_autoship: JSON.parse(sessionStorage.getItem('frequencyList')),
        cycleTypeId_club: JSON.parse(sessionStorage.getItem('frequencyListClub'))
      };
      this.setState({
        fieldData: subscriptionSeachField,
        title: RCi18n({ id: 'Public.subscriptions' }),
        breadcrumb1: RCi18n({ id: 'Menu.Subscription' }),
        breadcrumb2: RCi18n({ id: 'Menu.Subscription List' }),
        exportType: 2,
        isServiceOrder: false
      });
    }
  }
  render() {
    const { fieldData, selectData, title, breadcrumb1, breadcrumb2, exportType, isServiceOrder } =
      this.state;
    return (
      <div className="batch_export_page">
        <Breadcrumb>
          <Breadcrumb.Item>
            <a onClick={() => this.props.history.goBack()}>{breadcrumb1}</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => this.props.history.goBack()}>{breadcrumb2}</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{RCi18n({ id: 'Order.batchExport' })}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container" style={{ padding: 0 }}>
          <BatchExport
            {...this.props}
            fieldData={fieldData}
            selectData={selectData}
            title={title}
            exportType={exportType}
            isServiceOrder={isServiceOrder}
          />
        </div>
      </div>
    );
  }
}
