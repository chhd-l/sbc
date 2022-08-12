import React from 'react';
import List from '../list.tsx';
import { render, act } from '@testing-library/react';
import { fromJS } from 'immutable';
import { checkAuth } from '../../../jest-mcok/checkAuth';
import { stringify } from 'querystring';

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

jest.mock('react-intl', () => {
  return {
    FormattedMessage: () => <div>1</div>,
    injectIntl: (e) => e
  };
});

describe('Marketing List Component Test', () => {
  //sessionStorage.setItem('s2b-supplier@functions', JSON,stringify(checkAuth));

  test('Component list', async () => {
    await act(async () => {
      render(<List tabkey={false} relaxProps={relaxProps} />);
    });
  });
  test('Component list', async () => {
    await act(async () => {
      render(<List tabkey="0" relaxProps={relaxProps} />);
    });
  });
  test('Component list', async () => {
    await act(async () => {
      render(<List tabkey="1" relaxProps={relaxProps} />);
    });
  });
  test('Component list', async () => {
    await act(async () => {
      render(<List tabkey="2" relaxProps={relaxProps} />);
    });
  });
  test('Component list', async () => {
    await act(async () => {
      render(<List tabkey="3" relaxProps={relaxProps} />);
    });
  });
  test('Component list', async () => {
    await act(async () => {
      render(<List tabkey="4" relaxProps={relaxProps} />);
    });
  });
  test('Component list', async () => {
    await act(async () => {
      render(<List tabkey="5" relaxProps={relaxProps} />);
    });
  });
});
