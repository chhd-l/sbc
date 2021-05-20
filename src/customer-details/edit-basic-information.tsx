import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
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
          <Link to="/customer-list">Pet owner</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/customer-list">Pet owner list</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/petowner-details/${customerId}/${customerAccount}`}>Pet owner detail</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Basic information</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <BasicEdit customerId={customerId} customerAccount={customerAccount} />
      </div>
    </div>
  );
}
