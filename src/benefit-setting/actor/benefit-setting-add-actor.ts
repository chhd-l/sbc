import {Actor, Action, IMap} from 'plume2';
import {fromJS} from 'immutable';

/**
 * 是的，这就是一个Actor简单世界。
 */
export default class BenefitSettingAddActor extends Actor {
    /**
     * 领域的初始数据，该数据会被自动的转化为immutable
     */
    defaultState() {
        //返回的对象会被自动的转化成immutable，
        //除非有特殊数据结构如(Set, OrderedMap之类)
        //不需要特殊指定immutable数据结构
        return {
            formObj: {
                isTags: false,
                segmentIds: undefined,
                gifts: []
            },
            allGroups: []
        };
    }

    /**
     * 通过@Action来建立store的dispatch和actor的handler之间的关联
     */
    @Action('marketing:allGroups')
    getAllGroups(state, allGroups) {
        return state.set('allGroups', fromJS(allGroups));
    }

    @Action('marketing:formObj')
    getGiftBean(state: IMap, res) {
        return state.set('formObj', fromJS(res));
    }


}