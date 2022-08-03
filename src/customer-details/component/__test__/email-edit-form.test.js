import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import EmailEditForm from '../email-edit-form';

describe('Customer Email Edit Component Test', () => {
  test('email address should display', () => {
    const email = 'aa@bb.cc';
    render(<EmailEditForm email={email} />);

    expect(screen.getByText(email)).toBeInTheDocument();
  });
});
