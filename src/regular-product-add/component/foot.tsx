import * as React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop, history, AuthWrapper } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@Relax
export default class Foot extends React.Component<any, any> {
  props: {
    goodsFuncName: string;
    priceFuncName: string;
    tabType: string;
    relaxProps?: {
      validMain: Function;
      saveMain: Function;
      saveAll: Function;
      saveLoading: boolean;
      activeTabKey: string;
      onMainTabChange: Function;
      saveSeoSetting: Function;
    };
  };

  static relaxProps = {
    validMain: noop,
    saveMain: noop,
    saveAll: noop,
    saveLoading: 'saveLoading',
    activeTabKey: 'activeTabKey',
    onMainTabChange: noop,
    saveSeoSetting: noop
  };
  _saveSeoSetting = () => {
    const { saveSeoSetting } = this.props.relaxProps;
    const goodsId = 'ff80808175b1a9b80175b50910f10004';
    saveSeoSetting(goodsId);
  };
  render() {
    const { saveLoading, activeTabKey } = this.props.relaxProps;
    return (
      <div className="bar-button">
        {this.props.tabType == 'main' ? (
          <AuthWrapper key="001" functionName={this.props.goodsFuncName}>
            <Button type="primary" onClick={() => this._next(this.props.tabType)} style={{ marginRight: 10 }} loading={saveLoading}>
              Next
            </Button>
          </AuthWrapper>
        ) : this.props.tabType == 'price' ? (
          <AuthWrapper key="002" functionName={this.props.goodsFuncName}>
            <Button type="primary" onClick={() => this._prev(this.props.tabType)} style={{ marginRight: 10 }} loading={saveLoading}>
              Prev
            </Button>
            <Button type="primary" onClick={() => this._next(this.props.tabType)} style={{ marginRight: 10 }} loading={saveLoading}>
              Next
            </Button>
          </AuthWrapper>
        ) : this.props.tabType == 'inventory' ? (
          <AuthWrapper key="003" functionName={this.props.goodsFuncName}>
            <Button type="primary" onClick={() => this._prev(this.props.tabType)} style={{ marginRight: 10 }} loading={saveLoading}>
              Prev
            </Button>
            <Button type="primary" onClick={() => this._savePrice()} style={{ marginRight: 10 }} loading={saveLoading}>
              Next
            </Button>
          </AuthWrapper>
        ) : this.props.tabType == 'related' ? (
          <AuthWrapper key="004" functionName={this.props.priceFuncName}>
            <Button type="primary" onClick={() => this._prev(this.props.tabType)} style={{ marginRight: 10 }} loading={saveLoading}>
              Prev
            </Button>
            <Button type="primary" onClick={() => this._next(this.props.tabType)} style={{ marginRight: 10 }} loading={saveLoading}>
              Next
            </Button>
          </AuthWrapper>
        ) : (
          <AuthWrapper key="005" functionName={this.props.priceFuncName}>
            <Button type="primary" onClick={() => this._prev(this.props.tabType)} style={{ marginRight: 10 }} loading={saveLoading}>
              Prev
            </Button>
            <Button type="primary" onClick={this._saveSeoSetting} style={{ marginRight: 10 }} loading={saveLoading}>
              Save
            </Button>
          </AuthWrapper>
        )}
        {/*{activeTabKey === 'main' || activeTabKey === 'price' || activeTabKey === 'inventory' ? (
          [
            <AuthWrapper key="001" functionName={this.props.goodsFuncName}>
              <Button type="primary" onClick={this._next} style={{ marginRight: 10 }} loading={saveLoading}>
               Next
              </Button>
            </AuthWrapper>
            // <AuthWrapper key="002" functionName={this.props.priceFuncName}>
            //   <Button
            //     onClick={this._next}
            //     style={{ marginLeft: 10 }}
            //     loading={saveLoading}
            //   >
            //     <FormattedMessage id="product.next" />
            //   </Button>
            // </AuthWrapper>
          ]
        ) : (
          <AuthWrapper functionName={this.props.priceFuncName}>
            <Button type="primary" onClick={this._savePrice} style={{ marginRight: 10 }} loading={saveLoading}>
              Save
            </Button>
          </AuthWrapper>
        )}*/}
      </div>
    );
  }

  _save = async () => {
    const { saveMain } = this.props.relaxProps;
    const result = await saveMain();
    if (result) {
      history.push('/goods-list');
    }
  };

  _savePrice = async () => {
    const { saveAll } = this.props.relaxProps;
    saveAll();
    this._next('');
  };

  _prev = (res) => {
    this.props.onPrev(res);
  };

  _next = (res) => {
    this.props.onNext(res);
    // const { activeTabKey, onNext} = this.props.relaxProps;
    /*const result = validMain();
    if (result) {
      this.props.relaxProps.onMainTabChange('price');
    }*/
  };
}
