import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
import moment from 'moment';
interface ISettleInvoiceResponse {
  content: Array<any>;
  pageSize: number;
  total: number;
}
export default class SettleDetailActor extends Actor {
  Link;
  //数据源
  defaultState() {
    return {
      sharing: {
        firstName: '',
        lastName: '',
        emailChecked: '',
        email: '',
        phoneNumber: '',
        pageNum: 0,
        pageSize: 10,
        current: 1,
        total: 0
      },
      onProductForm: {
        a: '',
        b: ''
      }
    };
  }

  //初始化
  @Action('list:init')
  init(state: IMap, res) {
    return state.set('dataList', fromJS(res));
    const { content, pageSize, total } = res;
    /* return state.withMutations((state) => {
      state
        .set('total', total)
        .set('pageSize', pageSize)
        .set('dataList', fromJS(content));
    });*/
  }

  //productList初始化
  @Action('productList:productInit')
  productInit(state: IMap, res) {
    return state.set('productList', fromJS(res));
  }

  //Sharing send
  @Action('detail:sharing')
  sharing(state: IMap, res) {
    return state.set('sharing', res);
  }

  //product:onProductForm
  @Action('product:productForm')
  productForm(state: IMap, res) {
    return state.set('productForm', res);
  }

  //loading
  @Action('loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }
}
