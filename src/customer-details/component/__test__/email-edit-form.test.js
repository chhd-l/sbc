import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customerEmailExist, customerSaveEmail } from '../webapi';
import EmailEditForm from '../email-edit-form';

jest.mock('../webapi', () => {
  const originalModule = jest.requireActual('../webapi');

  return {
    __esModule: true,
    ...originalModule,
    customerEmailExist: jest.fn(
      (email) =>
        new Promise((resolve) => resolve({ code: 'K-000000', content: { email }, message: '' }))
    ),
    customerSaveEmail: jest.fn(
      () => new Promise((resolve) => resolve({ code: 'K-000000', content: {}, message: '' }))
    )
  };
});

describe('Customer Email Edit Component Test', () => {
  test('email address should display', () => {
    const email = 'aa@bb.cc';
    const wrapper = render(<EmailEditForm email={email} />);
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
    expect(input).toHaveValue(email);
    userEvent.click(saveBtn);
  });
});
