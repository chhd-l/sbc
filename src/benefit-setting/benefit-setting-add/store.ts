import {IOptions, Store, ViewAction} from 'plume2';
import BenefitSettingAddActor from '../actor/benefit-setting-add-actor'
import * as commonWebapi from '../webapi';
import {Const} from 'qmkit';

export default class AppStore extends Store {

    constructor(props: IOptions) {
        super(props);
        if (__DEV__) {
            (window as any)._store = this;
        }
    }
    /**
     * 聚合Actor
     * 通过reduce 各个actor的defaultState
     * 聚合出store的state作为source data.
     */
    bindActor() {
        //plume2@1.0.0直接传递Actor的class
        return [new BenefitSettingAddActor()];
    }

    bindViewAction() {
        return {};
    }

    getAllGroups = async () => {
        const { res } = await commonWebapi.getAllGroups({
            pageNum: 0,
            pageSize: 1000000,
            segmentType: 0,
            isPublished: 1
        });

        // @ts-ignore
        if (res.code == Const.SUCCESS_CODE) {
            // @ts-ignore
            this.dispatch('marketing:allGroups', res.context.segmentList);
        } else {
            // message.error('load group error.');
        }
    };

    giftBeanOnChange = (bean) => {
        this.dispatch('marketing:formObj', bean);
    };

}