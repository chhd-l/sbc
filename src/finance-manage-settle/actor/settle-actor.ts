import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
import moment from 'moment';

export default class SettleActor extends Actor {
  //数据源
  defaultState() {
    return {
      // 数据总条数
      total: 0,
      // 每页显示条数
      pageSize: 10,
      // 当前页的数据列表
      dataList: [],
      // 分类信息
      cateList: [],
      // 当前页码
      current: 1,
      queryParams: {
        startTime: moment(
          new Date(sessionStorage.getItem('defaultLocalDateTime'))
        ).subtract(3, 'months'),
        endTime: moment(
          new Date(sessionStorage.getItem('defaultLocalDateTime'))
        ),
        storeId: null,
        settleStatus: 0
      },
      settlePage: {},
      storeMap: {},
      selected: [],
      checkedSettleIds: [],
      accountDay: '',
      settleQueryParams: {},
      loading: true
    };
  }

  constructor() {
    super();
  }

  @Action('settleStore:accountDay')
  accountDay(state: IMap, accountDay) {
    return state.set('accountDay', accountDay);
  }

  /**
   * 设置分页数据
   */
  @Action('info:setPageData')
  setPageData(state: IMap, res: IPageResponse) {
    const { content, size, totalElements } = res;
    return state.withMutations((state) => {
      state
        .set('total', totalElements)
        .set('pageSize', size)
        .set('dataList', fromJS(content));
    });
  }

  @Action('settleStore:settleQueryParams')
  settleQueryParams(state: IMap, settleQueryParams: IMap) {
    return state.set('settleQueryParams', settleQueryParams);
  }

  @Action('settle:list')
  list(state: IMap, settlePage) {
    return state.set('settlePage', fromJS(settlePage));
  }

  @Action('settle:queryParams')
  queryParams(state: IMap, paramMap) {
    return state.setIn(['queryParams', paramMap['key']], paramMap['value']);
  }

  @Action('settle:storeMap')
  storeMap(state: IMap, storeMap) {
    return state.set('storeMap', fromJS(storeMap));
  }

  @Action('settle:setCheckedSettleIds')
  setCheckedSettleIds(state: IMap, checkedIds) {
    return state.set('checkedSettleIds', fromJS(checkedIds));
  }

  @Action('select:init')
  init(state: IMap, list) {
    return state.set('selected', fromJS(list));
  }

  @Action('list:check')
  check(state: IMap, { index, checked }) {
    // 设置选中
    //state = state.setIn(['dataList', index, 'checked'], checked);

    // 更新已选中的id
    let value = state.getIn(['dataList', index]);
    let selected = state.get('selected');
    let foundIndex = selected.findIndex((v) => v === value.get('id'));
    if (checked) {
      if (foundIndex === -1) {
        selected = selected.push(value.get('id'));
        state = state.set('selected', selected);
      }
    } else {
      if (foundIndex > -1) {
        selected = selected.delete(foundIndex);
        state = state.set('selected', selected);
      }
    }

    return state;
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
