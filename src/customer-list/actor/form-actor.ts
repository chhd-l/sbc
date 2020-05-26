import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        //客户名称
        customerName: '',
        //账号
        customerAccount: '',
        //客户类型
        customerType: '',
        //邮箱
        email: '',
        //手机号
        phoneNumber: ''
      }
    };
  }

  @Action('form:customerType')
  checkState(state: IMap, index: string) {
    return state.setIn(['form', 'customerType'], index);
  }

  @Action('form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }
}
