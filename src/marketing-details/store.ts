import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { message } from 'antd';
import MarketingActor from './common/actor/marketing-actor';
import GiftActor from './gift-details/actor/gift-actor';
import { Const, util } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new MarketingActor(), new GiftActor()];
  }

  init = async (marketingId?: string) => {
    const marketing = await webapi.fetchMarketingInfo(marketingId);
    if (marketing.res.code == Const.SUCCESS_CODE) {
      this.dispatch('marketingActor:init', marketing.res.context);

      if (marketing.res.context.marketingType == '2') {
        const gift = await webapi.fetchGiftList({ marketingId: marketingId });
        if (gift.res.code == Const.SUCCESS_CODE) {
          this.dispatch('giftActor:init', fromJS(gift.res.context));
        }
      }
    }

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
    this.dispatch('marketingActor:level', fromJS(levelList));
  };
}
