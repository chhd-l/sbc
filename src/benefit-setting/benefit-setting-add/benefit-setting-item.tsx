import React, { Component } from 'react';
import {Breadcrumb, Spin, Button, message} from 'antd';
import { StoreProvider} from 'plume2';
import {FormattedMessage} from 'react-intl';
import {BreadCrumb, Const, history} from 'qmkit';
import config from '../configs';

import BenefitSettingAddHint from './components/BenefitSettingAddHint';
import BenefitSettingAddFrom from './components/BenefitSettingAddFrom';

import AppStore from './store';
import './index.less';
import { makeRandom, getMarketingInfo }from '../webapi';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class BenefitSettingAdd extends Component<any, any> {
    store: AppStore;
    form: any;
    promotionCode: any;
    marketingId: any;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            initData: null
        }
    }

    componentDidMount() {
        this.store.getAllGroups();
        this.promotionCode = this.getPromotionCode();
        const { marketingId } = this.props.match && this.props.match.params ? this.props.match.params : null;
        this.marketingId = marketingId;
        // marketingId 有值为编辑状态，
        if (marketingId) {
            this.initData(marketingId)
        }
    }

    initData = async (marketingId) => {
        if (!marketingId) return;
        this.setState({
            loading: true,
        })
        const { res } = await getMarketingInfo(marketingId);
        this.setState({
            loading: false,
        })
        if (res.code == Const.SUCCESS_CODE) {
            this.setState({
                initData: res.context
            })
            // 初始化 SetConditions
            this.store.giftBeanOnChange({
                isTags: res.context.joinLevel === '-3',
                segmentIds: res.context.joinLevel === '-3' ? res.context.segmentIds[0] : undefined,
            })

        } else {
        }

    };

    getPromotionCode = () => {
        if (!this.state.promotionCode) {
            let randomNumber = ('0'.repeat(8) + parseInt(String(Math.pow(2, 40) * Math.random())).toString(32)).slice(-8);
            let timeStamp = new Date(sessionStorage.getItem('defaultLocalDateTime')).getTime().toString().slice(-10);
            let promotionCode = randomNumber + timeStamp;
            this.setState({
                promotionCode: promotionCode,
                promotionCode2: promotionCode
            });
            return promotionCode;
        } else {
            return this.state.promotionCode;
        }
    };

    getFullGiftLevelList = (values: any) => {
        if (!values) return [];
        let defaultFullGiftLevel = {
            fullAmount: null,
            // fullCount: null,
            giftType: 1,
            fullGiftDetailList: []
        }
        let { benefitList } = values;

        return benefitList.map(item => {
            return {
                ...defaultFullGiftLevel,
                key: makeRandom(),
                deliveryNumber: Number(item.deliveryNumber) || [],
                fullGiftDetailList: item.gifts || []
            }
        })

    }

    onSubmit = () => {
        let form = this.form.props.form;
        let {
            initData
        } = this.state;
        let { benefitType } = this.props;
        let errorObject = {};

        form.validateFields((err, values) => {
            form.validateFields

            console.log('Received values of form: ', values);
            if (!err) {
                //满赠规则具体内容校验
                if (!values.benefitList) {
                    errorObject['gif-errors'] = {
                        value: null,
                        errors: [new Error('Delivery number cannot be empty')]
                    };
                    return form.setFields(errorObject);
                }
                values.benefitList.forEach((item, index) => {
                    if (!item.gifts) {
                        errorObject['gif-errors'] = {
                            value: null,
                            errors: [new Error('A full gift cannot be empty')]
                        };
                    }
                })
                if (errorObject['gif-errors']) {
                  return form.setFields(errorObject);
                }

                // values.isTags 为true , 获取segmentName
                let segmentName = values.isTags
                    ? this.state.allGroups.toJS().find(element => element.id === values.segmentIds).name
                    : undefined
                // 是否是编辑状态
                let isEdit =  (!!this.marketingId) && initData;

                let params = {
                    "marketingName": values.marketingName,
                    "fullGiftLevelList": this.getFullGiftLevelList(values),
                    "segmentIds": values.isTags && values.segmentIds ? [values.segmentIds]:[],
                    "beginTime": values.timers[0].format(Const.DATE_FORMAT) + ':00', // "2021-07-01 10:42:00",
                    "endTime": values.timers[1].format(Const.DATE_FORMAT) + ':00',
                    "joinLevel": values.isTags && values.segmentIds ? -3 : 0,  // joinLevel = -3 指定人群  0 全部人群
                    "segmentName": values.isTags ? segmentName : null,

                    "promotionCode": isEdit && initData ? initData.promotionCode : this.promotionCode,
                    "marketingId": this.marketingId ? this.marketingId : undefined,
                    "storeId": isEdit ? initData.storeId : undefined,

                    "isClub":false,
                    "marketingType":2,
                    "emailSuffixList":[],
                    "scopeType":0,
                    "subType": benefitType === config.CONSUMPTION_GIFT ? 12 : 13,
                    "publicStatus":1,
                    "promotionType": benefitType === config.CONSUMPTION_GIFT ? 0 : values.type === 'individual' ? 4 : 2,
                }
                this.setState({loading: true});
                this.store.submitFullGift(params).then(() => {
                    this.setState({loading: false});
                    // 新增或编辑成功，跳转路由
                    this.props.history('/marketing-list');
                }).catch(() => {
                    this.setState({loading: false});
                })
            }
        });
    }

    goBack = () => {
        this.props.history.goBack()
    }


    render() {
        let { loading, initData } = this.state;

        return (
            <Spin spinning={loading}>
                <div className='BenefitSettingAdd-wrap'>
                    <BreadCrumb thirdLevel={true}>
                        <Breadcrumb.Item>
                          <FormattedMessage id={this.props.benefitType === config.CONSUMPTION_GIFT ? "Subscription.Consumption gift" : "Subscription.Welcomebox"} />
                        </Breadcrumb.Item>
                    </BreadCrumb>
                    <div className='container'>

                        <BenefitSettingAddHint benefitType={this.props.benefitType} />

                        <BenefitSettingAddFrom
                            initData={initData}
                            benefitType={this.props.benefitType}
                            wrappedComponentRef={(form) => this.form = form}
                        />

                        <div className="bar-button" style={{marginLeft:'-20px'}}>
                            <Button
                                onClick={this.onSubmit}
                                type="primary"
                                style={{ marginRight: 10 }}
                            >
                                <FormattedMessage id="Subscription.Save" />
                            </Button>
                            <Button onClick={this.goBack} style={{ marginRight: 10 }}>
                                <FormattedMessage id="Subscription.Cancel" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}