import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customerEmailExist, customerSaveEmail } from '../webapi';
import EmailEditForm from '../email-edit-form';

import { IntlProvider } from 'react-intl';
import locals from 'qmkit/lang/files/en-US';

jest.mock('../webapi', () => {
  const originalModule = jest.requireActual('../webapi');

  return {
    __esModule: true,
    ...originalModule,
    customerEmailExist: jest.fn(
      (email) =>
        new Promise((resolve) =>
          resolve({ res: { code: 'K-000000', context: email === 'aa@bb.cc', message: '' } })
        )
    ),
    customerSaveEmail: jest.fn(
      (customerId, email) =>
        new Promise((resolve) =>
          resolve({ res: { code: 'K-000000', context: email === 'aa2@bb.cc', message: '' } })
        )
    )
  };
});

describe('Customer Email Edit Component Test', () => {
  test('email address modify component should act properly', async () => {
    const email = 'aa@bb.cc';
    const wrapper = render(
      <IntlProvider locale="en" messages={locals}>
        <EmailEditForm customerId="12345" email={email} disableEdit={false} />
      </IntlProvider>
    );
    expect(screen.getByText(email)).toBeInTheDocument();

    const button = screen.getByTestId('icon');
    userEvent.click(button);
    const input = screen.getByTestId('email-input');
    expect(input).toBeInTheDocument();

    const closeBtn = screen.getByLabelText('Close');
    userEvent.click(closeBtn);

    const saveBtn = screen.getByRole('button', { name: /OK/ });
    userEvent.click(saveBtn);
    expect(input).toHaveValue('');

    userEvent.type(input, email);
    await waitFor(() => userEvent.click(saveBtn));

    userEvent.clear(input);
    userEvent.type(input, 'aa1@bb.cc');
    await waitFor(() => userEvent.click(saveBtn));

    userEvent.clear(input);
    userEvent.type(input, 'aa2@bb.cc');
    await waitFor(() => userEvent.click(saveBtn));
  });
});
