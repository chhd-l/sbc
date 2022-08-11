import React from 'react';
import { withRouter, Router, useHistory } from 'react-router-dom';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import locals from 'qmkit/lang/files/en-US';
import { IntlProvider } from 'react-intl';
import List from '../list';
import MarketingList from '../../index';
import { checkAuth } from '../../../jest-mcok/checkAuth';
import AppStore from '../../store';
import { createMemoryHistory } from 'history';
import { StoreProvider } from 'plume2';
import { fromJS } from 'immutable';
const Provider = StoreProvider(AppStore, { debug: __DEV__ })(IntlProvider);

describe('Marketing List Component Test', () => {
  sessionStorage.setItem('s2b-supplier@functions', JSON.stringify(checkAuth));

  jest.mock('plume2', () => {
    return {
      Relax: (e) => {
        console.log('rlesssssss');
        return e;
      }
    };
  });

  jest.mock('react-router', () => {
    return {
      withRouter: (e) => e
    };
  });

  test('Component list', async () => {
    await act(async () => {
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
          marketingStatus: 1,
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

      const { debug } = render(
        <Provider locale="en" messages={locals}>
          <Router history={history}>
            <List tabkey={'1'} relaxProps={{ dataList: fromJS(dataList) }} />
          </Router>
        </Provider>
      );
      //console.log(wrapper)
      // debug();
    });

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
