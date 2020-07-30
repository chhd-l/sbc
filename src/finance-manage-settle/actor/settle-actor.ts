import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
import moment from 'moment';

export default class SettleActor extends Actor {
  //数据源
  defaultState() {
    return {
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
      settleQueryParams: {}
    };
  }

  constructor() {
    super();
  }

  @Action('settleStore:accountDay')
  accountDay(state: IMap, accountDay) {
    return state.set('accountDay', accountDay);
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
}
