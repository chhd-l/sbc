import { customerEmailExist, customerSaveEmail, returnDQE } from '../webapi';

jest.mock('qmkit', () => {
  return {
    __esModule: true,
    Fetch: jest.fn(() => new Promise((resolve) => resolve('K-000000')))
  };
});

test('customer modify email should call existing check function', () => {
  const email = 'aa@bb.cc';
  expect(customerEmailExist(email)).resolves.toBe('K-000000');
});

test('customer save new email should call save function', () => {
  const email = 'aa@bb.cc';
  expect(customerSaveEmail(email)).resolves.toBe('K-000000');
});

test('customer save new email should call save function', () => {
  const email = 'aa@bb.cc';
  expect(returnDQE('idVoie', 'pays', 'streetNumber')).resolves.toBe('K-000000');
});
