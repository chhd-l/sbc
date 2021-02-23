import React from 'react';
import { Breadcrumb } from 'antd';
import { BreadCrumb } from 'qmkit';
import PetItem from './component/pet-item';

export default function EditPetItem(props: any) {
  const pet = {
    id: 1,
    picture: '',
    petsType: '',
    petsName: '',
    petsSex: 1,
    petsBreed: '',
    petsSizeValueName: '',
    sterilized: 1,
    birthOfPets: '',
    customerPetsPropRelations: []
  };
  return (
    <div>
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>Detail</Breadcrumb.Item>
        <Breadcrumb.Item>Edit pet information</Breadcrumb.Item>
      </BreadCrumb>
      <div className="container-search">
        <PetItem pet={pet} />
      </div>
    </div>
  );
}
