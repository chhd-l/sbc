import React from 'react';
import { Breadcrumb } from 'antd';
import { BreadCrumb } from 'qmkit';
import BasicInfomation from './component/basic-infomation';
import { FormattedMessage } from 'react-intl';

export default function EditBasicInfo(props: any) {
  const customerId = props.match.params.id || '';
  return (
    <div>
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>
          <FormattedMessage id="PetOwner.Detail" />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FormattedMessage id="PetOwner.EditBasicInformation" />
        </Breadcrumb.Item>
      </BreadCrumb>
      <div className="container-search">
        <BasicInfomation customerId={customerId} />
      </div>
    </div>
  );
}
