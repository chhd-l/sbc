import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { message } from 'antd';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import FormActor from './actor/form-actor';
import CustomerLevelActor from './actor/customer-level-actor';
import { Const, util } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new ListActor(), new LoadingActor(), new FormActor(), new CustomerLevelActor()];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    const query = this.state().get('form').toJS();
    // if (query.marketingSubType === '-1') {
    //   query.marketingSubType = null;
    // }
    const { res } = await webapi.fetchList({ ...query, pageNum, pageSize });
    let levelList = [];
    if (util.isThirdStore()) {
      const levRes = await webapi.getUserLevelList();
      if (levRes.res.code != Const.SUCCESS_CODE) {
        return;
      }
      levelList = levRes.res.context.storeLevelVOList;
      // 店铺等级转成平台等级格式,方便后面的业务逻辑公用
      levelList.forEach((level) => {
        level.customerLevelId = level.storeLevelId;
        level.customerLevelName = level.levelName;
      });
    }

    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('form:defaultLocalDateTime', res.defaultLocalDateTime);
        this.dispatch('listActor:init', res.context);
        this.dispatch('list:currentPage', pageNum + 1);
        this.dispatch('list:total', res.context.total);
        this.dispatch('customerLevel:init', fromJS(levelList));
        this.dispatch('select:init', []);
      });
    } else {
      this.dispatch('loading:end');
    }
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    this.dispatch('form:field', { field: 'queryTab', value: index });
    this.init();
  };

  onFormChange = ({ field, value }) => {
    //如果是省市区级联
    if (field == 'area') {
      this.transaction(() => {
        ['provinceId', 'cityId', 'areaId'].forEach((v, index) => {
          this.dispatch('form:field', {
            field: v,
            value: value[index]
          });
        });
      });
      return;
    }
    this.dispatch('form:field', { field, value });
  };

  onSearch = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  onDelete = async (marketingId) => {
    this.dispatch('loading:start');
    const { res } = await webapi.deleteMarketing(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('loading:end');

      message.success('Operate successfully');
    } else {
      this.dispatch('loading:end');
    }
    this.init();
  };

  onPause = async (marketingId) => {
    this.dispatch('loading:start');
    const { res } = await webapi.pause(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('Operate successfully');
    }
    this.dispatch('loading:end');
    this.init();
  };

  close = async (marketingId) => {
    this.dispatch('loading:start');
    const { res } = await webapi.close(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('close successful');
    }
    this.dispatch('loading:end');
    this.init();
  };

  download = async (marketingId) => {
    // const { res } = await webapi.close(marketingId);
    // if (res.code == Const.SUCCESS_CODE) {
    //   message.success('download successful');
    // }
    message.success('download successful');
  };
  onStart = async (marketingId) => {
    this.dispatch('loading:start');
    const { res } = await webapi.start(marketingId);
    setTimeout(()=>{
      if (res.code == Const.SUCCESS_CODE) {
        message.success('Operate successfully');
      }
      this.dispatch('loading:end');
      this.init();
    }, 1000)
  };
}
