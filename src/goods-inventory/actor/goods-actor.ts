import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface IOrderInvoiceResponse {
  content: Array<any>;
  size: number;
  total: number;
}

export default class GoodsActor extends Actor {
  defaultState() {
    return {
      // 商品分页数据
      getThreshold: '',
      // 商品SKU全部数据
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前的客户列表
      dataList: [],
      current: 1,
      loading: true,
      stock: 10
    };
  }

  @Action('list:init')
  init(state: IMap, res: IOrderInvoiceResponse) {
    const { content, size, total } = res;
    return state.withMutations((state) => {
      state.set('total', total).set('pageSize', size).set('dataList', content);
    });
  }

  @Action('goodsActor:getThreshold')
  getThreshold(state, getThreshold) {
    return state.set('getThreshold', getThreshold);
  }

  @Action('goodsActor:stock')
  stock(state, stock) {
    return state.set('stock', stock);
  }

  @Action('current')
  current(state: IMap, current: number) {
    return state.set('current', current);
  }

  @Action('loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }
}
