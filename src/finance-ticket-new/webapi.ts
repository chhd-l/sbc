import { Fetch } from 'qmkit';
import {TResult2 as TResult } from 'qmkit/type';

// type TResult = {
//   code: string;
//   message: string;
// };

// 查询开票项目
export const fetchFinaceTicket = (params = {}) => {
  return Fetch('/account/invoiceProjects', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

// 查询开票类型
export const fetchInvoiceType = () => {
  return Fetch('/account/invoice/switch');
};

// 保存支持的开票类型
export const addInvoiceType = invoiceType => {
  return Fetch<TResult>('/account/invoice/switch', {
    method: 'PUT',
    body: JSON.stringify(invoiceType)
  });
};

// 新增开票项目
export const addFinaceTicket = (params = {}) => {
  return Fetch<TResult>('/account/invoiceProject', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

// 编辑开票项目
export const editFinaceTicket = (params = {}) => {
  return Fetch<TResult>('/account/invoiceProject', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

// 删除项目
export const deleteFinaceTicket = (projectId: string) => {
  return Fetch<TResult>(`/account/invoiceProject`, {
    method: 'DELETE',
    body: JSON.stringify({
      projectId: projectId
    })
  });
};
