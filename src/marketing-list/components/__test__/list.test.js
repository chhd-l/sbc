import React from 'react';
import { withRouter, Router, useHistory } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import locals from 'qmkit/lang/files/en-US';
import { IntlProvider } from 'react-intl';
import List from '../list';
import MarketingList from '../../index';
import { checkAuth } from '../../../jest-mcok/checkAuth';
import AppStore from '../../store';
import { createMemoryHistory } from 'history';
import { StoreProvider } from 'plume2';
const Provider = StoreProvider(AppStore, { debug: __DEV__ })(IntlProvider);

describe('Marketing List Component Test', () => {
  sessionStorage.setItem('s2b-supplier@functions', JSON.stringify(checkAuth));
  test('Component list', async () => {
    const dataList = [
      {
        marketingId: 1585,
        promotionCode: 'pp315og00100054767',
        publicStatus: '1',
        marketingName: 'AAAAAAAAAAAAAAA',
        subType: 1,
        beginTime: '2022-09-14 16:54:16.000',
        endTime: '2022-09-30 16:54:16.000',
        joinLevel: '-5',
        isPause: 0,
        marketingStatus: 3,
        marketingScopeList: [],
        marketingJoinLevel: 1,
        marketingType: 0,
        promotionType: 0,
        appliesType: null,
        joinLevelList: [-5],
        createName: 'Royal France',
        promotionDescription: ''
      },
      {
        marketingId: 1582,
        promotionCode: 'SAVE10',
        publicStatus: '0',
        marketingName: 'dsadadad',
        subType: 1,
        beginTime: '2022-08-09 14:22:14.000',
        endTime: '2022-08-13 14:22:14.000',
        joinLevel: '0',
        isPause: 0,
        marketingStatus: 1,
        marketingScopeList: [],
        marketingJoinLevel: 0,
        marketingType: 0,
        promotionType: 0,
        appliesType: null,
        joinLevelList: [0],
        createName: 'Royal France',
        promotionDescription: ''
      },
      {
        marketingId: 1578,
        promotionCode: 'k1c9on009585831674',
        publicStatus: '1',
        marketingName: 'Gift',
        subType: 5,
        beginTime: '2022-08-04 01:04:04.000',
        endTime: '2022-08-27 18:04:04.000',
        joinLevel: '0',
        isPause: 0,
        marketingStatus: 1,
        marketingScopeList: [
          {
            marketingScopeId: 2980,
            marketingId: 1578,
            scopeId: '2c91808576903fd801769045d551011f',
            number: 1
          },
          {
            marketingScopeId: 2981,
            marketingId: 1578,
            scopeId: '2c91808576903fd801769045f53d0181',
            number: 1
          },
          {
            marketingScopeId: 2982,
            marketingId: 1578,
            scopeId: '2c91808576903fd801769046028101b3',
            number: 1
          }
        ],
        marketingJoinLevel: 0,
        marketingType: 2,
        promotionType: 0,
        appliesType: null,
        joinLevelList: [0],
        createName: 'Royal France',
        promotionDescription: ''
      },
      {
        marketingId: 1575,
        promotionCode: '034on4o09490155681',
        publicStatus: '0',
        marketingName: 'AAAAAA',
        subType: 1,
        beginTime: '2022-08-02 15:30:16.000',
        endTime: '2022-08-05 15:30:16.000',
        joinLevel: '-5',
        isPause: 0,
        marketingStatus: 4,
        marketingScopeList: [],
        marketingJoinLevel: 1,
        marketingType: 0,
        promotionType: 0,
        appliesType: null,
        joinLevelList: [-5],
        createName: 'Royal France',
        promotionDescription: ''
      },
      {
        marketingId: 1574,
        promotionCode: 'qonh10g09474438476',
        publicStatus: '0',
        marketingName: 'pet type - guest',
        subType: 1,
        beginTime: '2022-08-02 11:08:23.000',
        endTime: '2022-08-03 05:09:41.000',
        joinLevel: '-5',
        isPause: 0,
        marketingStatus: 4,
        marketingScopeList: [],
        marketingJoinLevel: 1,
        marketingType: 0,
        promotionType: 0,
        appliesType: null,
        joinLevelList: [-5],
        createName: 'Royal France',
        promotionDescription: ''
      },
      {
        marketingId: 1573,
        promotionCode: '4f6b2j809474391823',
        publicStatus: '0',
        marketingName: 'pet type - club',
        subType: 7,
        beginTime: '2022-08-02 11:06:33.000',
        endTime: '2022-08-06 11:06:33.000',
        joinLevel: '-5',
        isPause: 0,
        marketingStatus: 4,
        marketingScopeList: [],
        marketingJoinLevel: 1,
        marketingType: 1,
        promotionType: 2,
        appliesType: 0,
        joinLevelList: [-5],
        createName: 'Royal France',
        promotionDescription: ''
      },
      {
        marketingId: 1572,
        promotionCode: 'hr1vl0o09474054970',
        publicStatus: '0',
        marketingName: 'pet type - normal',
        subType: 1,
        beginTime: '2022-08-02 11:06:09.000',
        endTime: '2022-08-06 11:06:09.000',
        joinLevel: '-5',
        isPause: 0,
        marketingStatus: 4,
        marketingScopeList: [],
        marketingJoinLevel: 1,
        marketingType: 0,
        promotionType: 0,
        appliesType: null,
        joinLevelList: [-5],
        createName: 'Royal France',
        promotionDescription: ''
      }
    ];
    const history = createMemoryHistory();
    // console.log('Provider', Provider)
    console.log('------------------1111111111111111-------------------');
    // await Provider.store.relaxProps.onTabChange(1);
    const { debug } = render(
      // <Provider locale="en" messages={locals}>
      //   <MarketingList />
      // </Provider>
      // <Provider locale="en" messages={locals}>
      //   <Router history={history}>
      //     {/* <div>2</div> */}
      //     <MarketingList />
      //   </Router>
      // </Provider>

      <Provider locale="en" messages={locals}>
        <Router history={history}>
          <List tabkey={'1'} />
        </Router>
      </Provider>
    );

    debug();
    // const cs = screen.getByTestId('cscscs');
    // expect(cs).toBeInTheDocument();

    // const button = screen.getByTestId('icon');
    // userEvent.click(button);
    // const input = screen.getByTestId('email-input');
    // expect(input).toBeInTheDocument();

    // const closeBtn = screen.getByLabelText('Close');
    // userEvent.click(closeBtn);

    // const saveBtn = screen.getByRole('button', { name: /OK/ });
    // userEvent.click(saveBtn);
    // expect(input).toHaveValue('');

    // userEvent.type(input, email);
    // await waitFor(() => userEvent.click(saveBtn));

    // userEvent.clear(input);
    // userEvent.type(input, 'aa1@bb.cc');
    // await waitFor(() => userEvent.click(saveBtn));

    // userEvent.clear(input);
    // userEvent.type(input, 'aa2@bb.cc');
    // await waitFor(() => userEvent.click(saveBtn));
  });
});
