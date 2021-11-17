import { Spin } from 'antd'
import React, { Component } from 'react'
import { noop } from 'qmkit';
import { Relax } from 'plume2';
import { IMap, IList } from 'typings/globalType';
import moment from 'moment';
import FillinPetInfoForm from './fillinPetInfoForm';
@Relax
class FillinPetInfo extends Component {
    props: {

        relaxProps?: {
            recommendParams: IMap,
            savepetsRecommendParams: Function,
            onChangeStep: Function
            findByApptNo: Function,
            funType: boolean,
            petsList: any
        };
    }
    static relaxProps = {
        recommendParams: 'recommendParams',
        savepetsRecommendParams: noop,
        findByApptNo: noop,
        onChangeStep:noop,
        funType: 'funType',
        petsList: 'petsList'
    };
    state = {
        loading: false,
    }
    componentDidMount() {
        const { recommendParams, savepetsRecommendParams } = this.props.relaxProps;
        if (!recommendParams.get('fillDate')) {
            let _re=recommendParams.toJS();
            savepetsRecommendParams({ ..._re, fillDate: moment().format('YYYY-MM-DD') })
        }

    }

    render() {
        let { recommendParams, petsList, funType, savepetsRecommendParams, findByApptNo,onChangeStep } = this.props.relaxProps;
        let _c = recommendParams.toJS()
        const { loading } = this.state
        return (
            <Spin spinning={loading}>
                <FillinPetInfoForm
                    onChangeStep={onChangeStep}
                    savepetsRecommendParams={savepetsRecommendParams}
                    findByApptNo={findByApptNo}
                    recommendParams={_c}
                    petsList={petsList.toJS()}
                    funType={funType} />


            </Spin>
        )
    }
}

export default FillinPetInfo;
