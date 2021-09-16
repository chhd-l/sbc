import { Fetch, Const } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getUOMList(params: any = {}) {
  return Promise.resolve({
    res: {
      code: Const.SUCCESS_CODE,
      message: '',
      context: {
        total: 3,
        content:[
        {
          id: 1,
          code: '001',
          name: 'Unit',
          category: 'Unit',
          type: 'xxx',
          ratio: 1,
        },
        {
          id: 2,
          code: '001',
          name: 'Unit',
          category: 'Unit',
          type: 'xxx',
          ratio: 1,
        },
        {
          id: 3,
          code: '001',
          name: 'Unit',
          category: 'Unit',
          type: 'xxx',
          ratio: 1,
        }
      ]}
    }
  });
}
