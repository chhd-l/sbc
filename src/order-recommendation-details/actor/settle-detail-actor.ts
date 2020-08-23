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
        consumerFirstName: '',
        consumerLastName: '',
        emailConsent: '',
        consumerEmail: '',
        consumerPhoneNumber: '',
        pageNum: 0,
        pageSize: 10,
        current: 1,
        total: 0
      },
      onProductForm: {
        pageNum: 0,
        pageSize: 10,
        current: 1,
        total: 0
      },
      productselect: [], //添加选中商品
      createLink: {
        recommendationReasons: '',
        recommendationGoodsInfoRels: []
      },
      getLink: '',
      send: ''
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
  sharing(state: IMap, { field, value }) {
    return state.setIn(['sharing', field], value);
    //return state.set('sharing', res);
  }

  //product:onProductForm
  @Action('product:productForm')
  productForm(state: IMap, res) {
    return state.set('productForm', res);
  }

  //product select
  @Action('product:productselect')
  productselect(state: IMap, res) {
    return state.set('productselect', res);
  }

  //create Link
  @Action('create:createLink')
  createLink(state: IMap, { field, value }) {
    return state.setIn(['createLink', field], value);
  }

  //get Link
  @Action('get:getLink')
  getLink(state: IMap, res) {
    return state.set('getLink', res);
  }

  //Send
  @Action('get:send')
  send(state: IMap, res) {
    return state.set('send', res);
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
