import React from 'react';
import Index from '../index';
import { render, act, screen, fireEvent } from '@testing-library/react';
import { stringify } from 'querystring';
import { DataGrid, noop, history, AuthWrapper, Const, RCi18n, cache } from 'qmkit';
import userEvent from '@testing-library/user-event';
import { checkAuth } from '../../jest-mcok/checkAuth';

// jest.mock('plume2', () => {
//   return {
//     Relax: (e) => {
//       // console.log('rlesssssss');
//       return e;
//     }
//   };
// });

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

describe('Redirection Index Component Test', () => {
  sessionStorage.setItem('s2b-supplier@functions', JSON.stringify(checkAuth));

  test('Index test1', async () => {
    await act(async () => {
      render(<Index />);
    });
  });
});
