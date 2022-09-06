import React from 'react';
import SearchHead from '../search-head';
import { render, act, screen, fireEvent } from '@testing-library/react';
import { stringify } from 'querystring';
import { DataGrid, noop, history, AuthWrapper, Const, RCi18n, cache } from 'qmkit';
import userEvent from '@testing-library/user-event';
import { checkAuth, menus } from '../../../jest-mcok/checkAuth';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
// import { Popconfirm, Switch, Table, Tooltip } from 'antd';
// import enUSLang from '../../../web_modules/qmkit/lang/files/en-US';

jest.mock('react-router', () => {
  return {
    withRouter: (e) => e
  };
});

jest.mock('react-intl', () => {
  return {
    FormattedMessage: ({ id }) => <span>{id}</span>,
    injectIntl: (e) => e
  };
});

jest.mock('../../webapi', () => {
  const originalModule = jest.requireActual('../../webapi');
  return {
    __esModule: true,
    ...originalModule,
    redirectionUrlQuery: jest.fn(
      ({ url }) =>
        new Promise((resolve) =>
          resolve({
            res: {
              code: 'K-000000',
              message: 'operate successfully ',
              context: {
                redirectionUrlVOList: [
                  {
                    url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R0',
                    redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                    status: 1,
                    code: 301,
                    encodeUrl:
                      'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
                  }
                ]
              },
              defaultLocalDateTime: '2022-08-30 10:04:28.987'
            }
          })
        )
    )
  };
});

describe('Redirection SearchHead Component Test', () => {
  sessionStorage.setItem('s2b-supplier@functions', JSON.stringify(checkAuth));
  sessionStorage.setItem('s2b-supplier@menus', JSON.stringify(menus));
  window.token = 'ssssssssssss';
  window.open = jest.fn();

  test('SearchHead test1', async () => {
    const history = createMemoryHistory();
    const onSearch = jest.fn();
    const init = jest.fn();
    await act(async () => {
      // const user = userEvent.setup();
      const { debug } = await render(
        <Router history={{ ...history }}>
          <SearchHead onSearch={onSearch} init={init} />
        </Router>
      );
      // debug();
      const hoverbtn = screen.getByTestId('hoverbtn');
      await fireEvent.mouseOver(hoverbtn);
      console.log('hoverbtn', hoverbtn);
      debug();
      const searchUrl = screen.getByTestId('searchUrl');
      await userEvent.type(searchUrl, 'sys');
      const searchBtn = screen.getByTestId('searchBtn');
      await userEvent.click(searchBtn);
      const AddNewRedirectionBtn = screen.getByTestId('AddNewRedirection');
      await userEvent.click(AddNewRedirectionBtn);
      const Cancel = screen.getByText('Cancel');
      await userEvent.click(Cancel);

      const testToDownTempl = screen.getByTestId('testToDownTempl');
      await userEvent.click(testToDownTempl);

      // await user.hover(hoverbtn);

      // await userEvent.click(hoverbtn);

      // const toDownTempl = screen.getByTestId('toDownTempl');
      // await userEvent.click(toDownTempl);
    });
  });
});
