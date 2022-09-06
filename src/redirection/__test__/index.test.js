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
                    url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R16',
                    redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                    status: 1,
                    code: 301,
                    encodeUrl:
                      'https://www.shop.royalcanin.com.tr/tr/kitten-jelly-%28x12%29-415001020_INNERBOX_12_UNIT_TR.html'
                  }
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R15',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 0,
                  //   code: 301
                  // },
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R14',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 0,
                  //   code: 302
                  // },
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R13',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 1,
                  //   code: 302
                  // },
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R12',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 0,
                  //   code: 301
                  // },
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R11',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 0,
                  //   code: 301
                  // },
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R10',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 0,
                  //   code: 301
                  // },
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R9',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 0,
                  //   code: 301
                  // },
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R8',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 0,
                  //   code: 301
                  // },
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R7',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 0,
                  //   code: 301
                  // },
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R6',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 0,
                  //   code: 301
                  // },
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R5',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 0,
                  //   code: 301
                  // },
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R4',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 0,
                  //   code: 301
                  // },
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R3',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 0,
                  //   code: 301
                  // },
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R2',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 0,
                  //   code: 301
                  // },
                  // {
                  //   url: 'https://shopsit.royalcanin.com/fr/shop/light-weight-care-25240300R1',
                  //   redirectionUrl: 'https://shopsit.royalcanin.com/fr/shop',
                  //   status: 0,
                  //   code: 301
                  // }
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
      await userEvent.click(searchBtn);
      const switchBtn = screen.getAllByRole('switch')[0];
      await userEvent.click(switchBtn);
      await userEvent.click(switchBtn);
      const iconDelete = screen.getAllByTestId('iconDelete')[0];
      await userEvent.click(iconDelete);
      const Confirm = screen.getByText('Confirm');
      await userEvent.click(Confirm);
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
  //     await userEvent.type(searchInput, '3');
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
