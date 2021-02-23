import React from 'react';
import { Breadcrumb } from 'antd';
import { BreadCrumb } from 'qmkit';
import BasicInfomation from './component/basic-infomation';

export default function EditBasicInfo(props: any) {
  const customerId = props.match.params.id || '';
  return (
    <div>
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>Detail</Breadcrumb.Item>
        <Breadcrumb.Item>Edit basic information</Breadcrumb.Item>
      </BreadCrumb>
      <div className="container-search">
        <BasicInfomation customerId={customerId} />
      </div>
    </div>
  );
}
