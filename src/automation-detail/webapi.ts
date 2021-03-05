import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
export function getOverview() {
  return Fetch<TResult>('/message/listSendGridOverview', {
    method: 'POST'
  });
}
