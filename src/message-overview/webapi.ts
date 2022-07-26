import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function getOverview() {
  return Fetch<TResult>('/message/listSendGridOverview', {
    method: 'POST'
  });
}
