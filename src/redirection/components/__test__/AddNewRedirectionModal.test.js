import React from 'react';
import AddNewRedirectionModal from '../AddNewRedirectionModal';
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
    redirectionUrlUpdByUrl: jest.fn(
      ({ code, redirectionUrl, status, url, encodeUrl }) =>
        new Promise((resolve) =>
          resolve({
            res: {
              code: 'K-000000',
              defaultLocalDateTime: '2022-08-30 11:34:42.385',
              message: 'operate successfully '
            }
          })
        )
    ),
    redirectionUrlAdd: jest.fn(
      ({ code, redirectionUrl, status, url, encodeUrl }) =>
        new Promise((resolve) =>
          resolve({
            res: {
              code: 'K-000000',
              defaultLocalDateTime: '2022-08-30 11:34:42.385',
              message: 'operate successfully '
            }
          })
        )
    )
  };
});

describe('Redirection AddNewRedirectionModal Component Test', () => {
  sessionStorage.setItem('s2b-supplier@functions', JSON.stringify(checkAuth));
  sessionStorage.setItem('s2b-supplier@menus', JSON.stringify(menus));

  test('AddNewRedirectionModal add1', async () => {
    const history = createMemoryHistory();
    const onCancel = jest.fn();
    const init = jest.fn();
    // const redirectionDel = jest.fn();
    await act(async () => {
      const { debug } = await render(
        <Router history={{ ...history }}>
          {/* RedirectionData, visable, onCancel, init */}
          <AddNewRedirectionModal
            RedirectionData={null}
            visable={true}
            onCancel={onCancel}
            init={init}
          />
        </Router>
      );
      // debug();
      const url = screen.getByTestId('url');
      await userEvent.type(
        url,
        'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R2'
      );
      const encodeUrl = screen.getByTestId('encodeUrl');
      await userEvent.type(
        encodeUrl,
        'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
      );
      const redirectionUrl = screen.getByTestId('redirectionUrl');
      await userEvent.type(redirectionUrl, 'https://shopsit.royalcanin.com/fr/shop');
      const switchBtn = screen.getAllByRole('switch')[0];
      await userEvent.click(switchBtn);
      const Confirm = screen.getByText('Confirm');
      await userEvent.click(Confirm);
    });
  });

  test('AddNewRedirectionModal add2', async () => {
    jest.mock('../../webapi', () => {
      const originalModule = jest.requireActual('../../webapi');
      return {
        __esModule: true,
        ...originalModule,
        redirectionUrlUpdByUrl: jest.fn(
          ({ code, redirectionUrl, status, url, encodeUrl }) =>
            new Promise((resolve) =>
              resolve({
                res: {
                  code: 'K-000000',
                  defaultLocalDateTime: '2022-08-30 11:34:42.385',
                  message: 'operate successfully '
                }
              })
            )
        ),
        redirectionUrlAdd: jest.fn(
          ({ code, redirectionUrl, status, url, encodeUrl }) =>
            new Promise((resolve) =>
              resolve({
                res: {
                  code: 'K-090006',
                  defaultLocalDateTime: '2022-08-30 11:34:42.385',
                  message: 'operate successfully '
                }
              })
            )
        )
      };
    });
    const history = createMemoryHistory();
    const onCancel = jest.fn();
    const init = jest.fn();
    // const redirectionDel = jest.fn();
    await act(async () => {
      const { debug } = await render(
        <Router history={{ ...history }}>
          {/* RedirectionData, visable, onCancel, init */}
          <AddNewRedirectionModal
            RedirectionData={null}
            visable={true}
            onCancel={onCancel}
            init={init}
          />
        </Router>
      );
      // debug();
      const url = screen.getByTestId('url');
      await userEvent.type(
        url,
        'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R2'
      );
      const encodeUrl = screen.getByTestId('encodeUrl');
      await userEvent.type(
        encodeUrl,
        'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
      );
      const redirectionUrl = screen.getByTestId('redirectionUrl');
      await userEvent.type(redirectionUrl, 'https://shopsit.royalcanin.com/fr/shop');
      const switchBtn = screen.getAllByRole('switch')[0];
      await userEvent.click(switchBtn);
      const Confirm = screen.getByText('Confirm');
      await userEvent.click(Confirm);
    });
  });

  test('AddNewRedirectionModal upd1', async () => {
    const history = createMemoryHistory();
    const onCancel = jest.fn();
    const init = jest.fn();
    // const redirectionDel = jest.fn();
    await act(async () => {
      const { debug } = await render(
        <Router history={{ ...history }}>
          {/* RedirectionData, visable, onCancel, init */}
          <AddNewRedirectionModal
            RedirectionData={{
              url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R1',
              redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
              status: false,
              code: 301,
              encodeUrl:
                'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
            }}
            visable={true}
            onCancel={onCancel}
            init={init}
          />
        </Router>
      );

      // debug();
      const switchBtn = screen.getAllByRole('switch')[0];
      // console.log('switchBtn', switchBtn);
      await userEvent.click(switchBtn);
      const Confirm = screen.getByText('Confirm');
      await userEvent.click(Confirm);
    });
  });
  jest.mock('../../webapi', () => {
    const originalModule = jest.requireActual('../../webapi');
    return {
      __esModule: true,
      ...originalModule,
      redirectionUrlUpdByUrl: jest.fn(
        ({ code, redirectionUrl, status, url, encodeUrl }) =>
          new Promise((resolve) =>
            resolve({
              res: {
                code: 'K-000001',
                defaultLocalDateTime: '2022-08-30 11:34:42.385',
                message: 'operate Unsuccessful '
              }
            })
          )
      )
    };
  });
  test('AddNewRedirectionModal upd2', async () => {
    const history = createMemoryHistory();
    const onCancel = jest.fn();
    const init = jest.fn();

    await act(async () => {
      const { debug } = await render(
        <Router history={{ ...history }}>
          {/* RedirectionData, visable, onCancel, init */}
          <AddNewRedirectionModal
            RedirectionData={{
              url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R1',
              redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
              status: false,
              code: 301,
              encodeUrl:
                'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
            }}
            visable={true}
            onCancel={onCancel}
            init={init}
          />
        </Router>
      );
      // debug();
      const switchBtn = screen.getAllByRole('switch')[0];
      await userEvent.click(switchBtn);
      const Confirm = screen.getByText('Confirm');
      await userEvent.click(Confirm);
    });
  });
});
