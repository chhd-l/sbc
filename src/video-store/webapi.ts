import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';

import {TResult} from 'qmkit/type';
/**
 * 获取类目列表
 */
export const getCateList = () => {
  return Fetch<TResult>('/store/resourceCates');
};

/**
 * 分页获取视频列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchVideos(params = {}) {
  return Fetch<TResult>('/store/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 删除
 */
export const deleteVideo = (params: { videoIds: string[] }) => {
  return Fetch('/store/resource', {
    method: 'DELETE',
    body: JSON.stringify({
      resourceIds: params
    })
  });
};

/**
 * 添加分类
 */
export const addCate = (formData: IMap) => {
  return Fetch('/store/resourceCate', {
    method: 'POST',
    body: JSON.stringify(formData.toJS())
  });
};

/**
 * 移动视频
 */
export const moveVideo = (formData) => {
  return Fetch('/store/resource/resourceCate', {
    method: 'PUT',
    body: JSON.stringify(formData)
  });
};

/**
 * 修改
 */
export const updateVideo = (params: {}) => {
  return Fetch('/store/resource', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
