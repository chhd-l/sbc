import React from 'react';
import List from '../list.tsx';
import { render, act } from '@testing-library/react';
import { fromJS } from 'immutable';
import { DataGrid, noop, history, AuthWrapper, Const, RCi18n, cache } from 'qmkit';

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

jest.mock('qmkit', () => {
  const originalModule = jest.requireActual('qmkit');
  return {
    __esModule: true,
    ...originalModule,
    AuthWrapper:
      ({ children }) =>
      () =>
        <div>{children}</div>
  };
});

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
const relaxProps = {
  loading: false,
  dataList: fromJS(dataList),
  pageSize: 1,
  total: 1,
  currentPage: 1,
  init: () => {},
  onDelete: () => {},
  customerLevels: [],
  onPause: () => {},
  close: () => {},
  onStart: () => {},
  download: () => {},
  onPageChange: () => {}
};

describe('Marketing List Component Test', () => {
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
