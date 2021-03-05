import { Actor, Action, IMap } from 'plume2';

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: true,
      confirmLoading: false
    };
  }

  @Action('loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }

  @Action('confirmLoading:start')
  confirmLoadingStart(state: IMap) {
    return state.set('confirmLoading', true);
  }

  @Action('confirmLoading:end')
  confirmLoadingEnd(state: IMap) {
    return state.set('confirmLoading', false);
  }
}
