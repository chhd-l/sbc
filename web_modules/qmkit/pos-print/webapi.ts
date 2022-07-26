import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function getPrintDictionary() {
    return Fetch<TResult>('/sysdict/querySysDictionary', {
      method: 'POST',
      body: JSON.stringify({
        type: 'PrintMsg'
      })
    });
}



