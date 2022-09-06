import React from 'react';
import List from '../list';
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
    FormattedMessage: () => <div>1</div>,
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
    ),
    redirectionUrlUpdByUrl: jest.fn(
      ({ code, redirectionUrl, status, url }) =>
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
    redirectionUrlDelByUrl: jest.fn(
      ({ code, redirectionUrl, status, url }) =>
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

describe('Redirection List Component Test', () => {
  sessionStorage.setItem('s2b-supplier@functions', JSON.stringify(checkAuth));
  sessionStorage.setItem('s2b-supplier@menus', JSON.stringify(menus));

  test('List test1', async () => {
    const history = createMemoryHistory();
    const Onchange = jest.fn();
    const init = jest.fn();
    const redirectionDel = jest.fn();
    const onPageChange = jest.fn();
    await act(async () => {
      const { debug } = render(
        <Router history={{ ...history }}>
          <List
            pageNum={1}
            total={20}
            dataSource={[
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R16',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 1,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R15',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R14',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 302,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R13',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 1,
                code: 302,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R12',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R11',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R10',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R9',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R8',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R7',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R6',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R5',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R4',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R3',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R2',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              },
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R1',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              }
            ]}
            loading={false}
            Onchange={Onchange}
            init={init}
            redirectionDel={redirectionDel}
            onPageChange={onPageChange}
          />
        </Router>
      );
      // debug();
      const next = screen.getByTitle('Next Page');
      await userEvent.click(next);
      const switchBtn = screen.getAllByRole('switch')[0];
      console.log('switchBtn', switchBtn);
      await userEvent.click(switchBtn);
      const iconEdit = screen.getAllByTestId('iconEdit')[0];
      await userEvent.click(iconEdit);
      const Cancel = screen.getByText('Cancel');
      await userEvent.click(Cancel);
      const iconDelete = screen.getAllByTestId('iconDelete')[0];
      await userEvent.click(iconDelete);
    });
  });

  test('List test2', async () => {
    const history = createMemoryHistory();
    const Onchange = jest.fn();
    const init = jest.fn();
    const redirectionDel = jest.fn();
    const onPageChange = jest.fn();
    await act(async () => {
      const { debug } = render(
        <Router history={{ ...history }}>
          <List
            pageNum={0}
            dataSource={null}
            loading={false}
            Onchange={Onchange}
            init={init}
            redirectionDel={redirectionDel}
            onPageChange={onPageChange}
            total={0}
          />
        </Router>
      );
    });
  });

  test('List test3', async () => {
    const history = createMemoryHistory();
    const Onchange = jest.fn();
    const init = jest.fn();
    const redirectionDel = jest.fn();
    const onPageChange = jest.fn();
    await act(async () => {
      const { debug } = render(
        <Router history={{ ...history }}>
          <List
            pageNum={1}
            dataSource={[
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R0',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 301,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              }
            ]}
            loading={false}
            Onchange={Onchange}
            init={init}
            redirectionDel={redirectionDel}
            onPageChange={onPageChange}
            total={1}
          />
        </Router>
      );
      debug();
      const iconEdit = screen.getByTestId('iconEdit');
      await userEvent.click(iconEdit);
    });
  });

  test('List test4', async () => {
    const history = createMemoryHistory();
    const Onchange = jest.fn();
    const init = jest.fn();
    const redirectionDel = jest.fn();
    const onPageChange = jest.fn();
    await act(async () => {
      const { debug } = render(
        <Router history={{ ...history }}>
          <List
            pageNum={1}
            dataSource={[
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R0',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 0,
                code: 302,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              }
            ]}
            loading={false}
            Onchange={Onchange}
            init={init}
            redirectionDel={redirectionDel}
            onPageChange={onPageChange}
            total={1}
          />
        </Router>
      );
    });
  });

  test('List test5', async () => {
    const history = createMemoryHistory();
    const Onchange = jest.fn();
    const init = jest.fn();
    const redirectionDel = jest.fn();
    const onPageChange = jest.fn();
    await act(async () => {
      const { debug } = render(
        <Router history={{ ...history }}>
          <List
            pageNum={1}
            dataSource={[
              {
                url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R0',
                redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                status: 1,
                code: 302,
                encodeUrl:
                  'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
              }
            ]}
            loading={false}
            Onchange={Onchange}
            init={init}
            redirectionDel={redirectionDel}
            onPageChange={onPageChange}
            total={1}
          />
        </Router>
      );
    });
  });
});
