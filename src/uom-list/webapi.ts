import { Fetch, Const } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function getUOMCategoryList(params: any = {}) {
  return Promise.resolve({
    res: {
      code: Const.SUCCESS_CODE,
      message: '',
      context: {
        total: 3,
        content:[
        {
          id: 1,
          name: 'Unit',
          description: 'description of unit',
        },
        {
          id: 2,
          name: 'Weight',
          description: 'description of weight',
        },
        {
          id: 3,
          name: 'Length',
          description: 'description of length',
        }
      ]}
    }
  });
}
