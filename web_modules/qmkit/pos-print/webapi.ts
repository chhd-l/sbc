import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getPrintDictionary() {
    return Fetch<TResult>('/sysdict/querySysDictionary', {
      method: 'POST',
      body: JSON.stringify({
        type: 'PrintMsg'
      })
    });
}



