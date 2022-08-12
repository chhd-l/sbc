import React from 'react';
import List from '../list.tsx';
import { render, act, screen, fireEvent } from '@testing-library/react';
import { fromJS } from 'immutable';
import { checkAuth } from '../../../jest-mcok/checkAuth';
import { stringify } from 'querystring';
import { DataGrid, noop, history, AuthWrapper, Const, RCi18n, cache } from 'qmkit';
import userEvent from '@testing-library/user-event';

jest.mock('plume2', () => {
  return {
    Relax: (e) => {
      // console.log('rlesssssss');
      return e;
    }
  };
});

jest.mock('react-router', () => {
  return {
    withRouter: (e) => e
  };
});

jest.mock('react-intl', () => {
  return {
    FormattedMessage: () => <div>1</div>,
    injectIntl: (e) => e
  };
});

let dataList = [
  {
    marketingId: 1581,
    promotionCode: 'SAVE11',
    publicStatus: '0',
    marketingName: 'test',
    subType: 1,
    beginTime: '2022-08-09 14:13:24.000',
    endTime: '2022-08-13 14:13:24.000',
    joinLevel: '0',
    isPause: 0,
    marketingStatus: 1,
    marketingScopeList: [],
    marketingJoinLevel: 0,
    marketingType: 0,
    promotionType: 0,
    appliesType: null,
    joinLevelList: [0],
    createName: 'Royal America',
    promotionDescription: ''
  }
  // {
  //   "marketingId": 1579,
  //   "promotionCode": "pqj5cq809897288952",
  //   "publicStatus": "1",
  //   "marketingName": "adadada",
  //   "subType": 1,
  //   "beginTime": "2022-08-08 14:30:53.000",
  //   "endTime": "2022-08-16 14:30:53.000",
  //   "joinLevel": "-5",
  //   "isPause": 0,
  //   "marketingStatus": 1,
  //   "marketingScopeList": [],
  //   "marketingJoinLevel": 1,
  //   "marketingType": 0,
  //   "promotionType": 0,
  //   "appliesType": null,
  //   "joinLevelList": [-5],
  //   "createName": "Royal America",
  //   "promotionDescription": ""
  // }, {
  //   "marketingId": 1545,
  //   "promotionCode": "NEWPET20",
  //   "publicStatus": "0",
  //   "marketingName": "First Order Discount",
  //   "subType": 16,
  //   "beginTime": "2022-07-01 09:26:00.000",
  //   "endTime": "2099-04-30 09:26:00.000",
  //   "joinLevel": "-1",
  //   "isPause": 0,
  //   "marketingStatus": 1,
  //   "marketingScopeList": [],
  //   "marketingJoinLevel": -1,
  //   "marketingType": 1,
  //   "promotionType": 0,
  //   "appliesType": 0,
  //   "joinLevelList": [-1],
  //   "createName": "Royal France",
  //   "promotionDescription": ""
  // }, {
  //   "marketingId": 1546,
  //   "promotionCode": "SAVE10",
  //   "publicStatus": "0",
  //   "marketingName": "First Order Discount",
  //   "subType": 16,
  //   "beginTime": "2022-07-01 09:26:00.000",
  //   "endTime": "2099-04-30 09:26:00.000",
  //   "joinLevel": "-1",
  //   "isPause": 0,
  //   "marketingStatus": 1,
  //   "marketingScopeList": [],
  //   "marketingJoinLevel": -1,
  //   "marketingType": 1,
  //   "promotionType": 0,
  //   "appliesType": 0,
  //   "joinLevelList": [-1],
  //   "createName": "Royal France",
  //   "promotionDescription": ""
  // }, {
  //   "marketingId": 1547,
  //   "promotionCode": "SAVE10STAFF",
  //   "publicStatus": "0",
  //   "marketingName": "First Order Discount",
  //   "subType": 16,
  //   "beginTime": "2022-07-01 09:26:00.000",
  //   "endTime": "2099-04-30 09:26:00.000",
  //   "joinLevel": "-1",
  //   "isPause": 0,
  //   "marketingStatus": 1,
  //   "marketingScopeList": [],
  //   "marketingJoinLevel": -1,
  //   "marketingType": 1,
  //   "promotionType": 0,
  //   "appliesType": 0,
  //   "joinLevelList": [-1],
  //   "createName": "Royal France",
  //   "promotionDescription": ""
  // }, {
  //   "marketingId": 1548,
  //   "promotionCode": "SAVE15",
  //   "publicStatus": "0",
  //   "marketingName": "First Order Discount",
  //   "subType": 16,
  //   "beginTime": "2022-07-01 09:26:00.000",
  //   "endTime": "2099-04-30 09:26:00.000",
  //   "joinLevel": "-1",
  //   "isPause": 0,
  //   "marketingStatus": 1,
  //   "marketingScopeList": [],
  //   "marketingJoinLevel": -1,
  //   "marketingType": 1,
  //   "promotionType": 0,
  //   "appliesType": 0,
  //   "joinLevelList": [-1],
  //   "createName": "Royal France",
  //   "promotionDescription": ""
  // },
  // {
  //   "marketingId": 2000,
  //   "promotionCode": "aaa",
  //   "publicStatus": "1",
  //   "marketingName": "First Order Discount",
  //   "subType": 12,
  //   "beginTime": "2022-07-01 09:26:00.000",
  //   "endTime": "2099-04-30 09:26:00.000",
  //   "joinLevel": "-1",
  //   "isPause": 0,
  //   "marketingStatus": 1,
  //   "marketingScopeList": [],
  //   "marketingJoinLevel": -1,
  //   "marketingType": 1,
  //   "promotionType": 0,
  //   "appliesType": 0,
  //   "joinLevelList": [-1],
  //   "createName": "Royal France",
  //   "promotionDescription": ""
  // },
  // {
  //   "marketingId": 2001,
  //   "promotionCode": "bbb",
  //   "publicStatus": "0",
  //   "marketingName": "First Order Discount",
  //   "subType": 13,
  //   "beginTime": "2022-07-01 09:26:00.000",
  //   "endTime": "2099-04-30 09:26:00.000",
  //   "joinLevel": "-1",
  //   "isPause": 0,
  //   "marketingStatus": 1,
  //   "marketingScopeList": [],
  //   "marketingJoinLevel": -1,
  //   "marketingType": 1,
  //   "promotionType": 0,
  //   "appliesType": 0,
  //   "joinLevelList": [-1],
  //   "createName": "Royal France",
  //   "promotionDescription": ""
  // }
];
const relaxProps = {
  loading: false,
  dataList: fromJS(dataList),
  pageSize: 1,
  total: 1,
  currentPage: 1,
  init: () => {},
  onDelete: () => {},
  customerLevels: [],
  onPause: () => {},
  close: () => {},
  onStart: () => {},
  download: () => {},
  onPageChange: () => {}
};

describe('Marketing List Component Test', () => {
  sessionStorage.setItem('s2b-supplier@functions', JSON.stringify(checkAuth));

  test('Component list', async () => {
    const obj = {
      storeId: 123457910
    };
    sessionStorage.setItem('s2b-supplier@login', JSON.stringify(obj));
    await act(async () => {
      render(<List tabkey="2" relaxProps={relaxProps} />);
    });
  });
  test('Component list', async () => {
    const obj = {
      storeId: 123457910
    };
    sessionStorage.setItem('s2b-supplier@login', JSON.stringify(obj));
    await act(async () => {
      render(<List tabkey="3" relaxProps={relaxProps} />);
    });
  });
  test('Component list', async () => {
    const obj = {
      storeId: 123457910
    };
    sessionStorage.setItem('s2b-supplier@login', JSON.stringify(obj));
    await act(async () => {
      render(<List tabkey="4" relaxProps={relaxProps} />);
    });
  });
  test('Component list', async () => {
    const obj = {
      storeId: 123457910
    };
    sessionStorage.setItem('s2b-supplier@login', JSON.stringify(obj));
    await act(async () => {
      render(<List tabkey="5" relaxProps={relaxProps} />);
    });
  });

  test('Component list', async () => {
    const obj = {
      storeId: 123457910
    };
    sessionStorage.setItem('s2b-supplier@login', JSON.stringify(obj));
    await act(async () => {
      render(<List tabkey={false} relaxProps={relaxProps} />);
    });
  });
  test('Component list', async () => {
    const obj = {
      storeId: 123457910
    };
    sessionStorage.setItem('s2b-supplier@login', JSON.stringify(obj));
    await act(async () => {
      render(<List tabkey="0" relaxProps={relaxProps} />);
    });
  });
  test('Component list', async () => {
    const obj = {
      storeId: 123457909
    };
    sessionStorage.setItem(cache.LOGIN_DATA, JSON.stringify(obj));
    relaxProps.dataList = fromJS([
      {
        marketingId: 1579,
        promotionCode: 'pqj5cq809897288952',
        publicStatus: '1',
        marketingName: 'adadada',
        subType: 1,
        beginTime: '2022-08-08 14:30:53.000',
        endTime: '2022-08-16 14:30:53.000',
        joinLevel: '-5',
        isPause: 0,
        marketingStatus: 1,
        marketingScopeList: [],
        marketingJoinLevel: 1,
        marketingType: 0,
        promotionType: 0,
        appliesType: null,
        joinLevelList: [-5],
        createName: 'Royal America',
        promotionDescription: ''
      }
    ]);
    await act(async () => {
      render(<List tabkey="0" relaxProps={relaxProps} />);
    });
    const iconEdit_three = screen.getByTestId('iconEdit_three');
    // console.log('iconEdit', iconEdit);
    fireEvent.click(iconEdit_three);
    userEvent.click(screen.getByRole('button', { name: /Confirm/i }));
    userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
  });
  test('Component list', async () => {
    const obj = {
      storeId: 123457909
    };
    sessionStorage.setItem(cache.LOGIN_DATA, JSON.stringify(obj));
    relaxProps.dataList = fromJS([
      {
        marketingId: 1579,
        promotionCode: 'pqj5cq809897288952',
        publicStatus: '1',
        marketingName: 'adadada',
        subType: 12,
        beginTime: '2022-08-08 14:30:53.000',
        endTime: '2022-08-16 14:30:53.000',
        joinLevel: '-5',
        isPause: 0,
        marketingStatus: 1,
        marketingScopeList: [],
        marketingJoinLevel: 1,
        marketingType: 0,
        promotionType: 0,
        appliesType: null,
        joinLevelList: [-5],
        createName: 'Royal America',
        promotionDescription: ''
      }
    ]);
    await act(async () => {
      render(<List tabkey="1" relaxProps={relaxProps} />);
    });
  });
  test('Component list', async () => {
    const obj = {
      storeId: 123457910
    };
    sessionStorage.setItem(cache.LOGIN_DATA, JSON.stringify(obj));
    relaxProps.dataList = fromJS([
      {
        marketingId: 1579,
        promotionCode: 'pqj5cq809897288952',
        publicStatus: '1',
        marketingName: 'adadada',
        subType: 13,
        beginTime: '2022-08-08 14:30:53.000',
        endTime: '2022-08-16 14:30:53.000',
        joinLevel: '-5',
        isPause: 0,
        marketingStatus: 1,
        marketingScopeList: [],
        marketingJoinLevel: 1,
        marketingType: 0,
        promotionType: 0,
        appliesType: null,
        joinLevelList: [-5],
        createName: 'Royal America',
        promotionDescription: ''
      }
    ]);
    await act(async () => {
      render(<List tabkey="1" relaxProps={relaxProps} />);
    });
    const iconbtn_stop = screen.getByTestId('iconbtn-stop');
    // console.log('iconbtn_stop', iconbtn_stop);
    fireEvent.click(iconbtn_stop);
    const iconbtn_cancelall = screen.getByTestId('iconbtn-cancelall');
    // console.log('iconbtn_cancelall', iconbtn_cancelall);
    fireEvent.click(iconbtn_cancelall);
    const iconView = screen.getByTestId('iconView');
    // console.log('iconbtn_cancelall', iconbtn_cancelall);
    fireEvent.click(iconView);
    const iconbtn_offshelf = screen.getByTestId('iconbtn-offshelf');
    // console.log('iconbtn_offshelf', iconbtn_offshelf);
    fireEvent.click(iconbtn_offshelf);
    // iconEdit
    const iconEdit = screen.getByTestId('iconEdit');
    // console.log('iconEdit', iconEdit);
    fireEvent.click(iconEdit);
  });
  test('Component list', async () => {
    const obj = {
      storeId: 123457909
    };
    sessionStorage.setItem(cache.LOGIN_DATA, JSON.stringify(obj));
    relaxProps.dataList = fromJS([
      {
        marketingId: 1579,
        promotionCode: 'pqj5cq809897288952',
        publicStatus: '1',
        marketingName: 'adadada',
        subType: 1,
        beginTime: '2022-08-08 14:30:53.000',
        endTime: '2022-08-16 14:30:53.000',
        joinLevel: '-5',
        isPause: 0,
        marketingStatus: 2,
        marketingScopeList: [],
        marketingJoinLevel: 1,
        marketingType: 0,
        promotionType: 0,
        appliesType: null,
        joinLevelList: [-5],
        createName: 'Royal America',
        promotionDescription: ''
      }
    ]);
    await act(async () => render(<List tabkey="1" relaxProps={relaxProps} />));

    const iconbtn_open = screen.getByTestId('iconbtn-open');
    fireEvent.click(iconbtn_open);
    const iconEdit_two = screen.getByTestId('iconEdit_two');
    fireEvent.click(iconEdit_two);
  });
  test('Component list', async () => {
    const obj = {
      storeId: 123457910
    };
    sessionStorage.setItem(cache.LOGIN_DATA, JSON.stringify(obj));
    relaxProps.dataList = fromJS([
      {
        marketingId: 1579,
        promotionCode: 'pqj5cq809897288952',
        publicStatus: '1',
        marketingName: 'adadada',
        subType: 12,
        beginTime: '2022-08-08 14:30:53.000',
        endTime: '2022-08-16 14:30:53.000',
        joinLevel: '-5',
        isPause: 0,
        marketingStatus: 3,
        marketingScopeList: [],
        marketingJoinLevel: 1,
        marketingType: 0,
        promotionType: 0,
        appliesType: null,
        joinLevelList: [-5],
        createName: 'Royal America',
        promotionDescription: ''
      }
    ]);
    await act(async () => {
      render(<List tabkey="1" relaxProps={relaxProps} />);
    });
    // iconDelete
    const iconDelete = screen.getByTestId('iconDelete');
    // console.log('iconbtn_open', iconbtn_open)
    fireEvent.click(iconDelete);
    // DeleteConfirm
    // const Cancel = screen.getByT('button');
    // fireEvent.click(Cancel);
    userEvent.click(screen.getByRole('button', { name: /Confirm/i }));
    userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    //   const Confirm = screen.getByRole('button', {/ Confirm / i});
    // fireEvent.click(Confirm);
  });
});
