import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { RCi18n } from 'qmkit';
import BatchExport from './components/batch-export';
import type { fieldDataType, labelDataType } from './data.d';
import { orderSeachField, subscriptionSeachField } from './common';
import './index.less';

interface BatchExportPageState {
  fieldData: fieldDataType[];
  selectData?: labelDataType[];
  title: string;
  breadcrumb1: string;
  breadcrumb2: string;
}
export default class BatchExportPage extends Component<any, BatchExportPageState> {
  state: BatchExportPageState = {
    fieldData: [],
    selectData: [],
    title: '',
    breadcrumb1: '',
    breadcrumb2: ''
  };
  
  componentDidMount() {
    const { from } = this.props.match.params;
    if(from === 'order-list') {
      this.setState({
        fieldData: orderSeachField,
        title: 'orders',
        breadcrumb1: RCi18n({ id: 'Menu.Order' }),
        breadcrumb2: RCi18n({ id: 'Menu.Order list' }),
        selectData: [
          {name: 'Oder line', value: 'oderline'},
          {name: 'Address', value: 'address'},
          {name: 'PO+pet', value: 'po'},
          {name: 'Promotion', value: 'promotion'},
          {name: 'Subsription', value: 'subsription'},
          {name: 'Partner', value: 'partner'},
        ]
      })
    } else if(from === 'subscription-list'){
      let frequencyItem = subscriptionSeachField.find(item => item.key === 'cycleTypeId_autoship');
      frequencyItem.options = {
        cycleTypeId_autoship: JSON.parse(sessionStorage.getItem('frequencyList')),
        cycleTypeId_club: JSON.parse(sessionStorage.getItem('frequencyListClub'))
      }
      this.setState({
        fieldData: subscriptionSeachField,
        title: 'subscriptions',
        breadcrumb1: RCi18n({ id: 'Menu.Subscription' }),
        breadcrumb2: RCi18n({ id: 'Menu.Subscription List' }),
      })
    }
  }
  render() {
    const {fieldData, selectData, title, breadcrumb1, breadcrumb2} = this.state;
    return (
      <div className="batch_export_page">
        <Breadcrumb>
          <Breadcrumb.Item>
            <a onClick={() => this.props.history.goBack()}>
              {breadcrumb1}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a onClick={() => this.props.history.goBack()}>
              {breadcrumb2}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{RCi18n({ id: 'Order.batchExport' })}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container" style={{padding: 0}}>
          <BatchExport {...this.props} fieldData={fieldData} selectData={selectData} title={title}/>
        </div>
      </div>
    )
  }
}
