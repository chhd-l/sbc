import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

//new

// 分页获取 tagging list
export function getDescriptionList(filterParams = {}) {
  // return Fetch<TResult>('/goods_tagging/taggings', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     ...filterParams
  //   })
  // });
  return Promise.resolve<TResult>({
    code: 'K-000000',
    message: '',
    context: {
      total: 2,
      descList: [
        {
          id: 1,
          descName: 'Description',
          dipNameFr: 'Description_fr',
          dipNameEn: 'Description_en',
          status: true
        },
        {
          id: 2,
          descName: 'Benifit',
          dipNameFr: 'benifit_fr',
          dipNameEn: 'benifit_en',
          status: false
        },
        {
          id: 3,
          descName: 'testname',
          dipNameFr: 'test_fr',
          dipNameEn: 'test_en',
          status: true
        }
      ]
    }
  });
}

// 新增 tagging
export function addDescriptionItem(filterParams = {}) {
  // return Fetch<TResult>('/goods_tagging/tagging', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     ...filterParams
  //   })
  // });
  return Promise.resolve<TResult>({
    code: 'K-000000',
    message: '',
    context: {}
  });
}

// 修改 tagging
export function updateDescriptionItem(filterParams = {}) {
  // return Fetch<TResult>('/goods_tagging/tagging', {
  //   method: 'PUT',
  //   body: JSON.stringify({
  //     ...filterParams
  //   })
  // });
  return Promise.resolve<TResult>({
    code: 'K-000000',
    message: '',
    context: {}
  });
}

// 删除 tagging
export function deleteDescriptionItem(filterParams = {}) {
  // return Fetch<TResult>('/goods_tagging/tagging', {
  //   method: 'DELETE',
  //   body: JSON.stringify({
  //     ...filterParams
  //   })
  // });
  return Promise.resolve<TResult>({
    code: 'K-000000',
    message: '',
    context: {}
  });
}
