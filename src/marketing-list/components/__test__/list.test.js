import React from 'react';
import { withRouter, Router, useHistory } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import locals from 'qmkit/lang/files/en-US';
import { IntlProvider } from 'react-intl';
import List from '../list';
import AppStore from '../../store';
import { createMemoryHistory } from 'history';
import { StoreProvider } from 'plume2';

describe('Marketing List Component Test', () => {
  test('Component list', async () => {
    const history = createMemoryHistory();
    // const { debug } = render(
    //   StoreProvider(AppStore, { debug: __DEV__ })(
    //     <IntlProvider locale="en" messages={locals}>
    //       <Router history={history}>
    //         <List key={'1'} />
    //       </Router>
    //     </IntlProvider>
    //   )
    // );
    // const cs = screen.getByTestId('cscscs')
    // expect(cs).toBeInTheDocument();

    // const button = screen.getByTestId('icon');
    // userEvent.click(button);
    // const input = screen.getByTestId('email-input');
    // expect(input).toBeInTheDocument();

    // const closeBtn = screen.getByLabelText('Close');
    // userEvent.click(closeBtn);

    // const saveBtn = screen.getByRole('button', { name: /OK/ });
    // userEvent.click(saveBtn);
    // expect(input).toHaveValue('');

    // userEvent.type(input, email);
    // await waitFor(() => userEvent.click(saveBtn));

    // userEvent.clear(input);
    // userEvent.type(input, 'aa1@bb.cc');
    // await waitFor(() => userEvent.click(saveBtn));

    // userEvent.clear(input);
    // userEvent.type(input, 'aa2@bb.cc');
    // await waitFor(() => userEvent.click(saveBtn));
  });
});
