import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { RCi18n } from 'qmkit';
import BatchExport from './components/batch-export';
import type { fieldDataType, labelDataType } from './data.d';
import './index.less';

interface BatchExportPageState {
  fieldData: fieldDataType[];
  selectData?: labelDataType[];
}
export default class BatchExportPage extends Component<any, BatchExportPageState> {
  state: BatchExportPageState = {
    fieldData: [
      {
        label: [
          {
            value: 'id',
            name: RCi18n({ id: 'Order.OrderNumber' })
          },
          {
            value: 'subscribeId',
            name: RCi18n({ id: 'Order.subscriptionNumber' })
          }
        ],
        key: 'id',
      },
      {
        label: [
          {
            value: 'buyerName',
            name: RCi18n({ id: 'Order.consumerName' })
          },
          {
            value: 'buyerAccount',
            name: RCi18n({ id: 'Order.consumerAccount' })
          }
        ],
        key: 'buyerName',
      },
      {
        label: [
          {
            value: 'consigneeName',
            name: RCi18n({ id: 'Order.recipient' })
          },
          {
            value: 'consigneePhone',
            name: RCi18n({ id: 'Order.recipientPhone' })
          }
        ],
        key: 'consigneeName',
      },
      {
        label: [
          {
            value: 'orderType',
            name: RCi18n({ id: 'Order.orderType' })
          },
          {
            value: 'orderSource',
            name: RCi18n({ id: 'Order.orderSource' })
          }
        ],
        key: 'orderType',
        options: {
          orderType: [
            { value: 'SINGLE_PURCHASE', name: RCi18n({ id: 'Order.Singlepurchase' }) },
            { value: 'SUBSCRIPTION', name: RCi18n({ id: 'Order.subscription' }) },
            { value: 'MIXED_ORDER', name: RCi18n({ id: 'Order.mixedOrder' }) }
          ],
          orderSource: [
            { value: 'FGS', name: RCi18n({ id: 'Order.fgs' }) },
            { value: 'L_ATELIER_FELIN', name: RCi18n({ id: 'Order.felin' }) }
          ]
        }
      }
    ],
    selectData: [
      {name: 'Oder line', value: 'oderline'},
      {name: 'Address', value: 'address'},
      {name: 'PO+pet', value: 'po'},
      {name: 'Promotion', value: 'promotion'},
      {name: 'Subsription', value: 'subsription'},
      {name: 'Partner', value: 'partner'},
    ]
  };
  render() {
    return (
      <div className="batch_export_page">
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/order-list">
              {RCi18n({ id: 'Menu.Order' })}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/order-list">
              {RCi18n({ id: 'Menu.Order list' })}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{RCi18n({ id: 'Order.batchExport' })}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container" style={{padding: 0}}>
          <BatchExport fieldData={this.state.fieldData} selectData={this.state.selectData}/>
        </div>
      </div>
    )
  }
}
