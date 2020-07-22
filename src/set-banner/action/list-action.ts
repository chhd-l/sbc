import { ViewAction } from 'plume2';

export default class ListAction extends ViewAction {
  setModalVisible = (visible) => {
    this.store.dispatch('listAction:setModalVisible', visible);
  };

  sayHello = (text) => {
    this.store.dispatch('say:hello', text);
  };
}
