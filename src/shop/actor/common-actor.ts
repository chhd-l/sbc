import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class CommonActor extends Actor {
  defaultState() {
    return {
      //tab页签,与步骤类型不同
      tabsStep: '5',
      // 当前步骤
      currentStep: 0,
      // 是否同意注册协议
      agree: false,
      // 是否通过协议页面
      pass: false,
      //头部提示
      header: {
        // 首条开始信息
        preTxt: '',
        // 首条尾部信息
        postTxt: '',
        // 底部文字
        text: '',
        // 蓝色
        errTxt: '',
        // 底部蓝色
        bottomErrTxt: '',
        // 按钮是否展示
        btnShow: false,
        // 按钮文本
        btnTxt: ''
      },
      businessEnter: ''
    };
  }

  /**
   * 设置当前步骤
   */
  @Action('common: current')
  currentStep(state: IMap, currentStep: number) {
    return state.set('currentStep', currentStep);
  }

  @Action('common: businessEnter')
  businessEnter(state: IMap, businessEnter: string) {
    return state.set('businessEnter', businessEnter);
  }

  /**
   * 同意/拒绝 注册协议
   * @param state
   */
  @Action('common: agree')
  agreeOrNot(state: IMap) {
    const agree = !state.get('agree');
    if (!agree) {
      state = state.set('pass', agree);
    }
    return state.set('agree', agree);
  }

  /**
   * 通过注册协议页面
   * @param state
   */
  @Action('common: pass')
  pass(state: IMap) {
    const agree = state.get('agree');
    if (agree) {
      state = state.set('pass', agree);
    }
    return state;
  }

  /**
   * 头部信息单个字段
   * @param state
   * @param param1
   */
  @Action('common: header')
  onHeaderChange(state: IMap, header) {
    return state.set('header', fromJS(header));
  }

  /**
   * 设置当前页签
   */
  @Action('common:current:tab')
  currentTab(state: IMap, currentTab: string) {
    return state.set('tabsStep', currentTab);
  }
}
