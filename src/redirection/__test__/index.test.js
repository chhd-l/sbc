import React from 'react';
import Index from '../index';
import { render, act, screen, fireEvent } from '@testing-library/react';
import { stringify } from 'querystring';
import { DataGrid, noop, history, AuthWrapper, Const, RCi18n, cache } from 'qmkit';
import userEvent from '@testing-library/user-event';
import { checkAuth, menus } from '../../jest-mcok/checkAuth';
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

jest.mock('../webapi', () => {
  const originalModule = jest.requireActual('../webapi');
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
                    code: 301
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

describe('Redirection Index Component Test', () => {
  sessionStorage.setItem('s2b-supplier@functions', JSON.stringify(checkAuth));
  sessionStorage.setItem('s2b-supplier@menus', JSON.stringify(menus));

  test('Index test1', async () => {
    const history = createMemoryHistory();

    await act(async () => {
      const { debug } = render(
        <Router history={{ ...history }}>
          <Index />
        </Router>
      );
      // debug();
      const searchInput = screen.getByTestId('searchUrl');
      await userEvent.type(searchInput, '2');
      const searchBtn = screen.getByTestId('searchBtn');
      userEvent.click(searchBtn);
      const statusOnchangeBtn = screen.getByTestId('statusOnchange');
      await userEvent.click(statusOnchangeBtn);
      const redirectionDelBtn = screen.getByTestId('redirectionDel');
      await userEvent.click(redirectionDelBtn);
    });
  });

  test('Index test2', async () => {
    jest.mock('../webapi', () => {
      const originalModule = jest.requireActual('../webapi');
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
                    redirectionUrlVOList: []
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

    const history = createMemoryHistory();
    await act(async () => {
      const { debug } = render(
        <Router history={{ ...history }}>
          <Index />
        </Router>
      );
      // debug();
      const searchInput = screen.getByTestId('searchUrl');
      await userEvent.type(searchInput, '2');
      const searchBtn = screen.getByTestId('searchBtn');
      userEvent.click(searchBtn);
    });
  });
  // test('Index test3', async () => {
  //   jest.mock('../webapi', () => {
  //     const originalModule = jest.requireActual('../webapi');
  //     return {
  //       __esModule: true,
  //       ...originalModule,
  //       redirectionUrlQuery: jest.fn(
  //         ({ url }) =>
  //           new Promise((resolve) =>
  //             resolve({
  //               res: {
  //                 "code": "K-000000",
  //                 "message": "operate successfully ",
  //                 "context": {
  //                   "redirectionUrlVOList": [, {
  //                     "url": "https://shopsit.royalcanin.com/fr/shop/cavalier-king-charles-adulte-39680150",
  //                     "redirectionUrl": "https://shopsit.royalcanin.com/fr/shop",
  //                     "status": 0,
  //                     "code": 301,
  //                   }]
  //                 },
  //                 "defaultLocalDateTime": "2022-08-30 10:04:28.987"
  //               }
  //             })
  //           )
  //       ),
  //       redirectionUrlUpdByUrl: jest.fn(
  //         ({ code, redirectionUrl, status, url }) =>
  //           new Promise((resolve) =>
  //             resolve({
  //               res: {
  //                 code: "K-000000",
  //                 defaultLocalDateTime: "2022-08-30 11:34:42.385",
  //                 message: "operate successfully "
  //               }
  //             })
  //           )
  //       ),
  //       redirectionUrlDelByUrl: jest.fn(
  //         ({ code, redirectionUrl, status, url }) =>
  //           new Promise((resolve) =>
  //             resolve({
  //               res: {
  //                 code: "K-000000",
  //                 defaultLocalDateTime: "2022-08-30 11:34:42.385",
  //                 message: "operate successfully "
  //               }
  //             })
  //           )
  //       )
  //     };
  //   });

  //   const history = createMemoryHistory();
  //   await act(async () => {
  //     const { debug } = render(
  //       <Router history={{ ...history }}>
  //         <Index />
  //       </Router>
  //     );
  //     // debug();
  //     const searchInput = screen.getByTestId('searchUrl');
  //     await userEvent.type(searchInput, '2');
  //     const searchBtn = screen.getByTestId('searchBtn');
  //     userEvent.click(searchBtn);
  //   });
  // });
  // test('Index test4', async () => {
  //   jest.mock('../webapi', () => {
  //     const originalModule = jest.requireActual('../webapi');
  //     return {
  //       __esModule: true,
  //       ...originalModule,
  //       redirectionUrlQuery: jest.fn(
  //         ({ url }) =>
  //           new Promise((resolve) =>
  //             resolve({
  //               res: {
  //                 "code": "K-000000",
  //                 "message": "operate successfully ",
  //                 "context": {
  //                   "redirectionUrlVOList": [, {
  //                     "url": "https://shopsit.royalcanin.com/fr/shop/urinary-so-mousse-1254",
  //                     "redirectionUrl": "https://shopsit.royalcanin.com/fr/shop/urinary-so-loaf-1254",
  //                     "status": 1,
  //                     "code": 302,
  //                   }]
  //                 },
  //                 "defaultLocalDateTime": "2022-08-30 10:04:28.987"
  //               }
  //             })
  //           )
  //       ),
  //       redirectionUrlUpdByUrl: jest.fn(
  //         ({ code, redirectionUrl, status, url }) =>
  //           new Promise((resolve) =>
  //             resolve({
  //               res: {
  //                 code: "K-000000",
  //                 defaultLocalDateTime: "2022-08-30 11:34:42.385",
  //                 message: "operate successfully "
  //               }
  //             })
  //           )
  //       ),
  //       redirectionUrlDelByUrl: jest.fn(
  //         ({ code, redirectionUrl, status, url }) =>
  //           new Promise((resolve) =>
  //             resolve({
  //               res: {
  //                 code: "K-000000",
  //                 defaultLocalDateTime: "2022-08-30 11:34:42.385",
  //                 message: "operate successfully "
  //               }
  //             })
  //           )
  //       )
  //     };
  //   });

  //   const history = createMemoryHistory();
  //   await act(async () => {
  //     const { debug } = render(
  //       <Router history={{ ...history }}>
  //         <Index />
  //       </Router>
  //     );
  //     // debug();
  //     const searchInput = screen.getByTestId('searchUrl');
  //     await userEvent.type(searchInput, '2');
  //     const searchBtn = screen.getByTestId('searchBtn');
  //     userEvent.click(searchBtn);
  //   });
  // });

  // test('Index test5', async () => {
  //   jest.mock('../webapi', () => {
  //     const originalModule = jest.requireActual('../webapi');
  //     return {
  //       __esModule: true,
  //       ...originalModule,
  //       redirectionUrlQuery: jest.fn(
  //         ({ url }) =>
  //           new Promise((resolve) =>
  //             resolve({
  //               res: {
  //                 "code": "K-000000",
  //                 "message": "operate successfully ",
  //                 "context": {
  //                   "redirectionUrlVOList": [, {
  //                     "url": "https://shopsit.royalcanin.com/fr/shop/medium-puppy-en-sauce-1098",
  //                     "redirectionUrl": "https://shopsit.royalcanin.com/fr/shop/medium-puppy-chunks-in-gravy-1098",
  //                     "status": 0,
  //                     "code": 302,
  //                   }]
  //                 },
  //                 "defaultLocalDateTime": "2022-08-30 10:04:28.987"
  //               }
  //             })
  //           )
  //       ),
  //       redirectionUrlUpdByUrl: jest.fn(
  //         ({ code, redirectionUrl, status, url }) =>
  //           new Promise((resolve) =>
  //             resolve({
  //               res: {
  //                 code: "K-000000",
  //                 defaultLocalDateTime: "2022-08-30 11:34:42.385",
  //                 message: "operate successfully "
  //               }
  //             })
  //           )
  //       ),
  //       redirectionUrlDelByUrl: jest.fn(
  //         ({ code, redirectionUrl, status, url }) =>
  //           new Promise((resolve) =>
  //             resolve({
  //               res: {
  //                 code: "K-000000",
  //                 defaultLocalDateTime: "2022-08-30 11:34:42.385",
  //                 message: "operate successfully "
  //               }
  //             })
  //           )
  //       )
  //     };
  //   });

  //   const history = createMemoryHistory();
  //   await act(async () => {
  //     const { debug } = render(
  //       <Router history={{ ...history }}>
  //         <Index />
  //       </Router>
  //     );
  //     // debug();
  //     const searchInput = screen.getByTestId('searchUrl');
  //     await userEvent.type(searchInput, '2');
  //     const searchBtn = screen.getByTestId('searchBtn');
  //     userEvent.click(searchBtn);
  //   });
  // });
});
