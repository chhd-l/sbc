import React from 'react';
import { Breadcrumb } from 'antd';
import { BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import PetItem from './component/pet-item';

export default function EditPetItem(props: any) {
  return (
    <div>
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>
          <FormattedMessage id="consumer.consumerDetails" />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Edit pet information</Breadcrumb.Item>
      </BreadCrumb>
      <div>
        <PetItem petId={props.match.params.id} />
      </div>
    </div>
  );
}
