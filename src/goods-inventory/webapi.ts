import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 商品列表
 * @param params
 */
const goodsList = (pageNum, pageSize, stock) => {
  return Fetch(`/inventory/goodsInfo?pageNum=${pageNum}&pageNum=${pageSize}&stock=${stock}`, {
    method: 'GET'
  });
};

const getThreshold = () => {
  return Fetch('/inventory/threshold', {
    method: 'GET'
  });
};

export { goodsList, getThreshold };
