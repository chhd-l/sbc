import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        //活动名称
        marketingName: '',
        //活动类型
        marketingSubType: null,
        //
        subType: null,
        //市
        startTime: null,
        //区
        endTime: null,
        //目标客户
        promotionType: '0',
        //查询类型
        queryTab: '0',

        marketingStatus: '0',
        //未删除
        delFlag: 0,
        defaultLocalDateTime: ''
      }
    };
  }

  @Action('form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }

  @Action('form:defaultLocalDateTime')
  defaultLocalDateTime(state: IMap, time) {
    return state.set('defaultLocalDateTime', time);
  }
}
