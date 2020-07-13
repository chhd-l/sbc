import { action, computed, observable } from 'mobx';

class setBannerStore {
  // 被观察者，你可以理解成Vuex中的State，也就是说，声明一些想要观察的状态，变量。
  // 被观察者可以是：JS基本数据类型、引用类型、普通对象、类实例、数组和映射
  @observable num = 0;
  @observable map = new Map();
  @observable list = ['a', 'b'];
  @observable obj = { name: 'Mobx' };

  // 计算值是可以根据现有的状态或其它计算值衍生出的值.
  // 计算值不接受参数
  @computed
  get retunum() {
    return `${this.num}~~~~~~~~`;
  }

  @computed
  get addNum() {
    return this.num + 10;
  }

  // 使用@action 更改被观察者
  @action.bound
  add() {
    this.num++;
  }
}
export default new setBannerStore();
