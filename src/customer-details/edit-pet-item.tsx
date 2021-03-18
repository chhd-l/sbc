import React from 'react';
import { Breadcrumb } from 'antd';
import { BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import PetItem from './component/pet-item';

import './index.less';

export default function EditPetItem(props: any) {
  const customerId = props.match.params.id || '';
  const customerAccount = props.match.params.account || '';
  const petId = props.match.params.petid || '';
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
        <Breadcrumb.Item>Edit pet information</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <PetItem petId={petId} />
      </div>
    </div>
  );
}
