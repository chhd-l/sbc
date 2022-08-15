import React from 'react';
import { screen } from '@testing-library/react';
import renderWithProvider from '@/jest/renderWithProvider';
import { fromJS } from 'immutable';
import List from '../list';

import AppStore from '../../store';

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

test('handles server error', async () => {
  renderWithProvider(<List tabkey={'1'} />, {
    AppStore,
    relaxProps
  });

  const cs = screen.getByTestId('cscscs');
  expect(cs).toBeInTheDocument();
});
