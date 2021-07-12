import React, { Component } from 'react';
import {Breadcrumb, Spin, Button, message} from 'antd';
import { StoreProvider} from 'plume2';
import {FormattedMessage} from 'react-intl';
import {BreadCrumb, Const, history} from 'qmkit';

import BenefitSettingAddHint from './components/BenefitSettingAddHint';
import BenefitSettingAddFrom from './components/BenefitSettingAddFrom';

import AppStore from './store';
import './index.less';
import { makeRandom }from '../webapi';
import {fromJS} from 'immutable';

@StoreProvider(AppStore, { debug: true })
export default class BenefitSettingAdd extends Component<any, any> {
    store: AppStore;
    form: any;
    promotionCode: any;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,


        }
    }

    componentDidMount() {
        this.store.getAllGroups();
        this.promotionCode = this.getPromotionCode()
    }

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
            key: makeRandom(),
            fullAmount: null,
            fullCount: null,
            giftType: 1,
            fullGiftDetailList: []
        }
        let { benefitList } = values;

        return benefitList.map(item => {
            return {
                ...defaultFullGiftLevel,
                deliveryNumber: Number(item.deliveryNumber) || [],
                fullGiftDetailList: item.gifts || []
            }
        })

    }

    onSubmit = () => {
        let form = this.form.props.form;
        let errorObject = {};

        form.validateFields((err, values) => {
            // 遍历gif的错误 todo item.gifts
            console.log('Received values of form: ', values);

            values.benefitList.forEach((item, index) => {
                if (!item.gifts || item.gifts.length === 0) {
                    errorObject[`gifts_${index}`] = {
                        value: null,
                        errors: [new Error('A full gift cannot be empty')]
                    };
                }
            })
            if (!err) {
                //满赠规则具体内容校验
                if (Object.keys(errorObject).length != 0) {
                  return form.setFields(errorObject);
                }
                let segmentObj = JSON.parse(values.segmentObj)

                let params = {
                    "marketingName": values.marketingName,
                    "fullGiftLevelList": this.getFullGiftLevelList(values),
                    "segmentIds": values.isTags && segmentObj.id ? [segmentObj.id]:[],
                    "beginTime": values.timers[0].format('YYYY-MM-DD hh:mm:ss'), // "2021-07-01 10:42:00",
                    "endTime": values.timers[1].format('YYYY-MM-DD hh:mm:ss'),
                    "promotionCode": this.promotionCode,
                    "joinLevel": values.isTags && segmentObj.id ? -3 : 0,  // joinLevel = -3 指定人群  0 全部人群
                    "segmentName": values.isTags && segmentObj.name ? segmentObj.name: null,

                    "isClub":false,
                    "marketingType":2,
                    "emailSuffixList":[],
                    "scopeType":0,
                    "subType":12,
                    "publicStatus":1,
                    "promotionType": 0
                }
                debugger;
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
        let { loading } = this.state;
        return (
            <Spin spinning={loading}>
                <div className='BenefitSettingAdd-wrap'>
                    <BreadCrumb thirdLevel={true}>
                        <Breadcrumb.Item><FormattedMessage id="Subscription.Consumption gift" /></Breadcrumb.Item>
                    </BreadCrumb>
                    <div className='container'>

                        <BenefitSettingAddHint />

                        <BenefitSettingAddFrom
                            wrappedComponentRef={(form) => this.form = form}
                            {...{
                                store: this.store,
                            }}
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