import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface MarketingResponse {
  content: Array<any>;
  totalElements: number;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前的客户列表
      dataList: [],
      //当前页
      currentPage: 1
    };
  }

  @Action('listActor:init')
  init(state: IMap, res: MarketingResponse) {
    let { content, totalElements } = res;
    debugger
    content.forEach(
      (item, index) => {
        if(item.marketingName === '40% скидка'  ||  item.marketingName === '25% скидка' || item.marketingName === 'gift_071602') {
          content.splice(index, 1)
          totalElements--
        }
      }
    )
    return state.withMutations((state) => {
      state.set('total', totalElements).set('dataList', fromJS(content));
    });
  }

  @Action('list:currentPage')
  currentPage(state: IMap, current) {
    return state.set('currentPage', current);
  }

  @Action('list:total')
  totalPage(state: IMap, total) {
    return state.set('total', total);
  }

  @Action('list:reset')
  reset(state: IMap) {
    return state.set('dataList', []);
  }
}
