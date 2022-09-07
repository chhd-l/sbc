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
    FormattedMessage: ({ id }) => <span>{id}</span>,
    injectIntl: (e) => e
  };
});

jest.mock('../../redirection/webapi', () => {
  const originalModule = jest.requireActual('../../redirection/webapi');
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

describe('Redirection import Test', () => {
  sessionStorage.setItem('s2b-supplier@functions', JSON.stringify(checkAuth));
  sessionStorage.setItem('s2b-supplier@menus', JSON.stringify(menus));
  window.token = 'sdadadadad';
  window.open = jest.fn();

  test('Redirection import Test1', async () => {
    const history = createMemoryHistory();
    const onCancel = jest.fn();
    const init = jest.fn();
    // const redirectionDel = jest.fn();
    await act(async () => {
      const { debug } = await render(
        <Router history={{ ...history }}>
          <Index />
        </Router>
      );
      // debug();
      const download = screen.getByTestId('download');
      await userEvent.click(download);
      const downloadnext = screen.getByTestId('downloadnext');
      await userEvent.click(downloadnext);
      const file = document.querySelector('input[type="file"]');
      // console.log('file', file);
      // order.offline.paymenttype
      //   {
      //     "file": {
      //         "uid": "rc-upload-1662453976460-7",
      //         "lastModified": 1662454026555,
      //         "lastModifiedDate": "2022-09-06T08:47:06.555Z",
      //         "name": "URL_redirection_template_202209060847.xls",
      //         "size": 226304,
      //         "type": "application/vnd.ms-excel",
      //         "percent": 100,
      //         "originFileObj": {
      //             "uid": "rc-upload-1662453976460-7"
      //         },
      //         "status": "done",
      //         "response": {
      //             "code": "K-000000",
      //             "message": "操作成功",
      //             "context": [],
      //             "defaultLocalDateTime": "2022-09-06 10:50:33.426"
      //         },
      //         "xhr": {}
      //     },
      //     "fileList": [
      //         {
      //             "uid": "rc-upload-1662453976460-7",
      //             "lastModified": 1662454026555,
      //             "lastModifiedDate": "2022-09-06T08:47:06.555Z",
      //             "name": "URL_redirection_template_202209060847.xls",
      //             "size": 226304,
      //             "type": "application/vnd.ms-excel",
      //             "percent": 100,
      //             "originFileObj": {
      //                 "uid": "rc-upload-1662453976460-7"
      //             },
      //             "status": "done",
      //             "response": {
      //                 "code": "K-000000",
      //                 "message": "操作成功",
      //                 "context": [],
      //                 "defaultLocalDateTime": "2022-09-06 10:50:33.426"
      //             },
      //             "xhr": {}
      //         }
      //     ]
      // }

      fireEvent.change(file, {
        target: {
          files: new File(['sdsajdsa'], 'shsjsj', { type: 'xls/xlsx' })
        }
      });
      debug();
    });
  });

  test('Redirection import Test2', async () => {
    const history = createMemoryHistory();
    const onCancel = jest.fn();
    const init = jest.fn();
    window.token = '';
    await act(async () => {
      const { debug } = await render(
        <Router history={{ ...history }}>
          <Index />
        </Router>
      );
      // debug();
      const download = screen.getByTestId('download');
      await userEvent.click(download);
    });
  });
});
