import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';
// type TResult = {
//   code: string;
//   message: string;
//   context: any;
// };

//new

// 获取Attributes 列表
export function getAttributes(filterParams = {}) {
  return Fetch<TResult>('/attribute_library/attributes', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
// 新增 attributes
export function postAttributes(filterParams = {}) {
  return Fetch<TResult>('/attribute_library/attribute', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
// 修改 attributes
export function putAttributes(filterParams = {}) {
  return Fetch<TResult>('/attribute_library/attribute', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
// 删除 attributes
export function deleteAttributes(filterParams = {}) {
  return Fetch<TResult>('/attribute_library/attribute', {
    method: 'DELETE',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 删除 attributesValue
export function deleteAttributesValue(filterParams = {}) {
  return Fetch<TResult>('/attribute_library/attribute_value', {
    method: 'DELETE',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
