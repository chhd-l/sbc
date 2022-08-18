import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Interaction from '../interaction';

import { IntlProvider } from 'react-intl';

const form = {
  getFieldDecorator: () => {
    console.log(2);
  }
};

describe('Test', () => {
  test('interactionTest', async () => {
    render(<Interaction form={form} />);
    const consentTest = screen.getByTestId('interactionTest');
  });
});
