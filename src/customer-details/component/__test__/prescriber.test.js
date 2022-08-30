import React from 'react';
import Prescriber from '../prescriber';
import { render, act, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import userEvent from '@testing-library/user-event';
import locals from 'qmkit/lang/files/en-US';

describe('prescriber Test', () => {
  test('prescriber Test', async () => {
    render(
      <IntlProvider>
        <Prescriber />
      </IntlProvider>
    );
  });
  test('prescriber Test1', async () => {
    const wrapper = render(
      <IntlProvider locale="en" messages={locals}>
        <Prescriber
          customerId="123"
          getPrescriberList={() => {}}
          setSelectedRowKeys={() => {}}
          selectedRowKeys={[1, 2, 3, 4]}
          showModer={true}
          setShowModer={() => {}}
          editPrescriberId="12312"
        />
      </IntlProvider>
    );
    const addBtn = screen.getByTestId('addnewBtn');
    userEvent.click(addBtn);
    // const modelBtn = screen.getByTestId('modelBtn');
    // userEvent.click(modelBtn);
    // debug();
    const saveBtn = wrapper.getByRole('button', { name: /OK/ });
    fireEvent.click(saveBtn);
  });
});
