import React from 'react';
import { render, act, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Prescriber from '../prescriber';

jest.mock('react-intl', () => {
  return {
    FormattedMessage: ({ id }) => <span>{id}</span>
  };
});
jest.mock('../webapi', () => {
  const originalModule = jest.requireActual('../webapi');

  return {
    __esModule: true,
    ...originalModule,
    fetchAddPrescriber: jest.fn(
      (customerId, prescriberIds, defaultPrescriberFlag) =>
        new Promise((resolve) => resolve({ res: { code: 'K-000000', message: '' } }))
    ),
    fetchClinicList: jest.fn(
      (attributeStatus, enabled, pageNum, pageSize, prescriberId, prescriberName, prescriberType) =>
        new Promise((resolve) =>
          resolve({
            res: {
              code: 'K-000000',
              context: {
                content: [
                  {
                    auditAuthority: null,
                    auditStatus: '1',
                    business: null,
                    creationTime: '2022-08-30 05:42:00.000',
                    defaultFlag: '0',
                    delFlag: 0,
                    delTime: null,
                    description: null,
                    distance: null,
                    email: null,
                    enabled: true,
                    enabledText: null,
                    encryptCode: '1183ef48c5cfc28c903688792f42354e',
                    headImg: null,
                    id: 'P20220830054158357',
                    language: null,
                    latitude: '',
                    location: '',
                    longitude: '',
                    operatingPeriod: null,
                    parentPrescriberId: null,
                    phone: '',
                    preferredChannel: null,
                    prescriberCode: '',
                    prescriberId: '0517',
                    prescriberIntroduction: null,
                    prescriberName: 'Test_L05',
                    prescriberOwner: 'admin',
                    prescriberType: 'Shelter',
                    primaryCity: '',
                    primaryCountry: null,
                    primaryDistrict: null,
                    primaryRegion: null,
                    primaryZip: '',
                    primaryZipPlus4: null,
                    qrCodeLink: 'https://d2cfgssit.z7.web.core.windows.net/202208300541599658.jpg',
                    qrCodeLink2: 'https://d2cfgssit.z7.web.core.windows.net/202208300542001261.jpg',
                    recommendationCode: null,
                    requency: null,
                    rewardType: null,
                    rewardTypeText: null,
                    secondaryEmail: null,
                    shopPhotosList: null,
                    stars: null,
                    storeId: 123457910,
                    updateTime: null,
                    url: 'https://shopsit.royalcanin.com/us/?clinic=0517',
                    url2: 'https://shopsit.royalcanin.com/us/?code=1183ef48c5cfc28c903688792f42354e',
                    website: null
                  },
                  {
                    auditAuthority: null,
                    auditStatus: '1',
                    business: null,
                    creationTime: '2022-08-30 05:42:00.000',
                    defaultFlag: '0',
                    delFlag: 0,
                    delTime: null,
                    description: null,
                    distance: null,
                    email: null,
                    enabled: true,
                    enabledText: null,
                    encryptCode: '1183ef48c5cfc28c903688792f42354e',
                    headImg: null,
                    id: 'P20220830054158357',
                    language: null,
                    latitude: '',
                    location: '',
                    longitude: '',
                    operatingPeriod: null,
                    parentPrescriberId: null,
                    phone: '',
                    preferredChannel: null,
                    prescriberCode: '',
                    prescriberId: '0517',
                    prescriberIntroduction: null,
                    prescriberName: 'Test_L05',
                    prescriberOwner: 'admin',
                    prescriberType: 'Shelter',
                    primaryCity: '',
                    primaryCountry: null,
                    primaryDistrict: null,
                    primaryRegion: null,
                    primaryZip: '',
                    primaryZipPlus4: null,
                    qrCodeLink: 'https://d2cfgssit.z7.web.core.windows.net/202208300541599658.jpg',
                    qrCodeLink2: 'https://d2cfgssit.z7.web.core.windows.net/202208300542001261.jpg',
                    recommendationCode: null,
                    requency: null,
                    rewardType: null,
                    rewardTypeText: null,
                    secondaryEmail: null,
                    shopPhotosList: null,
                    stars: null,
                    storeId: 123457910,
                    updateTime: null,
                    url: 'https://shopsit.royalcanin.com/us/?clinic=0517',
                    url2: 'https://shopsit.royalcanin.com/us/?code=1183ef48c5cfc28c903688792f42354e',
                    website: null
                  },
                  {
                    auditAuthority: null,
                    auditStatus: '1',
                    business: null,
                    creationTime: '2022-08-30 05:42:00.000',
                    defaultFlag: '0',
                    delFlag: 0,
                    delTime: null,
                    description: null,
                    distance: null,
                    email: null,
                    enabled: true,
                    enabledText: null,
                    encryptCode: '1183ef48c5cfc28c903688792f42354e',
                    headImg: null,
                    id: 'P20220830054158357',
                    language: null,
                    latitude: '',
                    location: '',
                    longitude: '',
                    operatingPeriod: null,
                    parentPrescriberId: null,
                    phone: '',
                    preferredChannel: null,
                    prescriberCode: '',
                    prescriberId: '0517',
                    prescriberIntroduction: null,
                    prescriberName: 'Test_L05',
                    prescriberOwner: 'admin',
                    prescriberType: 'Shelter',
                    primaryCity: '',
                    primaryCountry: null,
                    primaryDistrict: null,
                    primaryRegion: null,
                    primaryZip: '',
                    primaryZipPlus4: null,
                    qrCodeLink: 'https://d2cfgssit.z7.web.core.windows.net/202208300541599658.jpg',
                    qrCodeLink2: 'https://d2cfgssit.z7.web.core.windows.net/202208300542001261.jpg',
                    recommendationCode: null,
                    requency: null,
                    rewardType: null,
                    rewardTypeText: null,
                    secondaryEmail: null,
                    shopPhotosList: null,
                    stars: null,
                    storeId: 123457910,
                    updateTime: null,
                    url: 'https://shopsit.royalcanin.com/us/?clinic=0517',
                    url2: 'https://shopsit.royalcanin.com/us/?code=1183ef48c5cfc28c903688792f42354e',
                    website: null
                  }
                ],
                empty: false,
                first: true,
                last: false,
                number: 0,
                numberOfElements: 10,
                size: 10,
                sort: null,
                total: 11,
                totalElements: 11,
                totalPages: 2
              },
              defaultLocalDateTime: '2022-08-30 06:15:51.964',
              message: 'operate successfully '
            }
          })
        )
    ),
    fetchUpdPrescriber: jest.fn(
      (customerId, oldPrescriberId, updatePrescriberId) =>
        new Promise((resolve) => resolve({ res: { code: 'K-000000', message: '' } }))
    )
  };
});
describe('prescriber Test', () => {
  test('Prescriber', () => {
    render(
      <Prescriber
        customerId="123123"
        getPrescriberList={() => {}}
        setSelectedRowKeys={() => {}}
        selectedRowKeys="[1,2,3]"
        showModer={true}
        setShowModer={() => {}}
        editPrescriberId="123123"
      />
    );

    const btn1 = screen.getByTestId('addnewBtn');
    fireEvent.click(btn1);

    const btn2 = screen.getByRole('button', { name: /OK/ });
    fireEvent.click(btn2);

    const btn3 = screen.getByRole('button', { name: /Cancel/ });
    fireEvent.click(btn3);

    const inputChange = screen.getByTestId('inputOnchange');
    fireEvent.change(inputChange, { target: { value: '887766' } });

    const inputChange1 = screen.getByTestId('inputOnchange1');
    fireEvent.change(inputChange1, { target: { value: 'test01' } });

    const onSearch = screen.getByTestId('onSearch');
    fireEvent.click(onSearch);
  });
  test('Prescriber1', () => {
    render(
      <Prescriber
        customerId="123123"
        getPrescriberList={() => {}}
        setSelectedRowKeys={() => {}}
        selectedRowKeys="[1,2,3]"
        setShowModer={() => {}}
        editPrescriberId="123123"
      />
    );
    const btn1 = screen.getByTestId('addnewBtn');
    fireEvent.click(btn1);

    const btn2 = screen.getByRole('button', { name: /OK/ });
    fireEvent.click(btn2);
  });
});
