import {IOptions, Store } from 'plume2';
import BenefitSettingAddActor from '../actor/benefit-setting-add-actor'
import * as commonWebapi from '../webapi';
import {Const, history} from 'qmkit';
import {message} from 'antd';

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

    /**
     * 满赠提交，编辑和新增由marketingId是否存在区分
     * @param giftBean
     * @returns {Promise<void>}
     */
    submitFullGift = async (giftBean) => {
        let response;
        if (giftBean.marketingId) {
            response = await commonWebapi.updateFullGift(giftBean);
        } else {
            response = await commonWebapi.addFullGift(giftBean);
        }
        if(response.res && response.res.code === Const.SUCCESS_CODE) {
            message.success((window as any).RCi18n({
                id: 'Marketing.OperateSuccessfully'
            }))
            history.push('/marketing-list');
        } else if(response.res && response.res.code === 'K-080218') {
            message.error(response.res.message)
        }
        return response.res
    };

}


