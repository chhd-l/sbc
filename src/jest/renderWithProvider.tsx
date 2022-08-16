import React from 'react';
import { Router } from 'react-router-dom';
import { render, RenderOptions } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { StoreProvider } from 'plume2';
import { IntlProvider } from 'react-intl';

const renderWithProvider = (
  ui: React.ReactElement,
  {
    relaxProps,
    AppStore,
    ...options
  }: Omit<RenderOptions, 'queries'> & {
    relaxProps?: any;
    AppStore?: any;
  }
) => {
  const history = createMemoryHistory();
  const Provider = StoreProvider(AppStore, { debug: __DEV__ })(IntlProvider);
  const renderProvider = ({ children }) => {
    return (
      <Provider>
        <Router history={history}>{React.cloneElement(children, { relaxProps })}</Router>
      </Provider>
    );
  };
  return render(ui, { wrapper: renderProvider, ...options });
};
export default renderWithProvider;
