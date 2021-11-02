import { Button, Checkbox, Collapse, Form, Input, Modal, Spin } from 'antd';
import { Relax } from 'plume2';
import { noop, ReactEditor } from 'qmkit';
import React from 'react';
import { RCi18n } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';
import WriteTipsForm from './writeTipsForm';
const { Panel } = Collapse;

@Relax
class WriteTips extends React.Component<any, any> {
  chooseItems: Array<any>;
  props: {
    form?: any
    relaxProps?: {
      recommendParams: IMap
      savepetsRecommendParams: Function,
      getFillAutofindAllTitle: Function
      fillAutoList: IList
      loading: boolean,
      funType: boolean
      onChangeStep: Function
      fetchFelinSave:Function
    };
  }
  static relaxProps = {
    recommendParams: 'recommendParams',
    fillAutoList: 'fillAutoList',
    savepetsRecommendParams: noop,
    getFillAutofindAllTitle: noop,
    onChangeStep: noop,
    fetchFelinSave:noop,
    loading: 'loading',
    funType: 'funType'
  };

  done = (e) => {
    const {recommendParams,fetchFelinSave}=this.props.relaxProps;
    let _re=recommendParams.toJS()
     let cc= _re.goodsQuantity.map(item=>({
        goodsInfoNo:item.goodsInfoNo,
        quantity:item.quantity||1
      }))
      _re.goodsQuantity=cc; 
   fetchFelinSave({..._re,...e})
  }

  render() {
    const { recommendParams, loading, fillAutoList, onChangeStep, savepetsRecommendParams, getFillAutofindAllTitle }:any = this.props.relaxProps;
    return <WriteTipsForm
      loading={loading}
      recommendParams={recommendParams.toJS()}
      fillAutoList={fillAutoList}
      onChangeStep={onChangeStep}
      savepetsRecommendParams={savepetsRecommendParams}
      getFillAutofindAllTitle={getFillAutofindAllTitle}
      done={this.done}

    />;
  }
}

export default WriteTips