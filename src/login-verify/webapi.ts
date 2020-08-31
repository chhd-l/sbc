import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getPrescriberById(id: string) {
  return Fetch<TResult>('/prescriber/getPrescriberById', {
    method: 'POST',
    body: JSON.stringify({ id: id })
  });
}

export function verifyUser(prescriberId: string, prescriberName) {
  return Fetch<TResult>('/prescriber/verifyUser', {
    method: 'POST',
    body: JSON.stringify({
      prescriberId: prescriberId,
      prescriberName: prescriberName
    })
  });
}

export function saveConsent(filterParams = {}) {
  return Fetch<TResult>('/prescriber/saveConsent', {
    method: 'POST',
    body: JSON.stringify({ ...filterParams })
  });
}
