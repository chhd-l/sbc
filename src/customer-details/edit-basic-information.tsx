import React from 'react';
import { Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import BasicEdit from './component/basic-edit';

import './index.less';

export default function EditBasicInfo(props: any) {
  const customerId = props.match.params.id || '';
  const customerAccount = props.match.params.account || '';
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/customer-list">Pet owner</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/customer-list">Pet owner list</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href={`/petowner-details/${customerId}/${customerAccount}`}>Pet owner detail</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Edit basic information</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <BasicEdit customerId={customerId} customerAccount={customerAccount} />
      </div>
    </div>
  );
}
