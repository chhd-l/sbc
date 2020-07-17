import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface IGoodsEvaluateResponse {
  content: Array<any>;
  total: number;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      // 当前的数据总数
      total: 1, //测试， 之后修改为0
      // 当前的分页条数
      pageSize: 10,
      // 当前页数，从1开始
      currentPage: 1,
      modalVisible: false,
      visible: {
        isTrue: false
      },
      // 表格数据
      tableDatas: [
        {
          id: 1,
          pcImage:
            'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202004291813187993.png',
          mobileImage:
            'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202004291813187993.png'
        },
        {
          id: 1,
          pcImage:
            'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202004291813187993.png',
          mobileImage:
            'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202004291813187993.png'
        },
        {
          id: 1,
          pcImage:
            'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202004291813187993.png',
          mobileImage:
            'https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202004291813187993.png'
        }
      ]
    };
  }
  @Action('list:page')
  page(state: IMap, page: IMap) {
    return state.set('currentPage', page.get('currentPage'));
  }

  @Action('list:tableDatas')
  TableDataChange(state: IMap, params) {
    return state.update('tableDatas', params);
  }

  @Action('list:uploadModalStatusChange')
  uploadModalStatusChange(state: IMap, visible) {
    return state.set('modalVisible', visible);
  }

  @Action('list:visible')
  visible(state: IMap, modalVisible) {
    console.log(modalVisible, 11111111111111111111111111111);
    return state.set('visible', fromJS(modalVisible));
  }
}
