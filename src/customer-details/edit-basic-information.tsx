import React from 'react';
import { Breadcrumb } from 'antd';
import { BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import BasicEdit from './component/basic-edit';

import './index.less';

export default function EditBasicInfo(props: any) {
  const customerId = props.match.params.id || '';
  const customerAccount = props.match.params.account || '';
  return (
    <div>
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>
          <FormattedMessage id="consumer.consumerDetails" />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Edit basic information</Breadcrumb.Item>
      </BreadCrumb>
      <div>
        <BasicEdit customerId={customerId} customerAccount={customerAccount} />
      </div>
    </div>
  );
}
