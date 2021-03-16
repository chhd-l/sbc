import React from 'react';
import { Breadcrumb } from 'antd';
import { BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import PetItem from './component/pet-item';

export default function EditPetItem(props: any) {
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
          <FormattedMessage id="consumer.consumerDetails" />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Edit pet information</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <PetItem petId={props.match.params.id} />
      </div>
    </div>
  );
}
