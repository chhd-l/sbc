import React, { Component } from 'react';
import { Headline, BreadCrumb, history, cache, Const } from 'qmkit';
import { Breadcrumb, message, Steps, Button, Icon, Form } from 'antd';
import './index.less';
import BasicInformation from './components/basicInformation';
import TargetProduct from './components/targetProduct';
import EntryCriteria from './components/entryCriteria';
import ExitRules from './components/exitRules';
import Details from './components/details';
import * as webapi from './webapi';
import { edit } from '@/regular-product-add/webapi';

const { Step } = Steps;

class SubscriptionPlanUpdate extends Component<any, any> {
  static propTypes = {};
  static defaultProps = {
    id: null,
    editable: true
  };
  constructor(props) {
    super(props);
    const id = props.id || this.props.match.params.id;
    const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId;
    this.state = {
      id,
      title: id ? 'Edit Plan (Food Dispenser)' : 'Add New Plan (Food Dispenser)',
      current: 0,
      storeId,
      subscriptionPlan: {
        canCancelPlan: true,
        subscriptionPlanFlag: true,
        changeDeliveryDateFlag: true,
        skipNextDeliveryFlag: false,
        mainGoods: [],
        mainGoodsIds: [],
        frequency: [],
        consentIds: [],
        quantity: 100,
        landingFlag: true
      },
      allSkuProduct: [],
      frequencyList: [],
      planTypeList: []
    };
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.addField = this.addField.bind(this);
  }

  componentWillMount() {
    const { id } = this.state;
    webapi.getWeekFrequency().then((data) => {
      const res = data.res;
      if (res.code === Const.SUCCESS_CODE) {
        let defaultFrequency = res.context.sysDictionaryVOS.find((x) => parseInt(x.valueEn) === 4);
        if (!id && defaultFrequency) {
          this.addField('frequency', [defaultFrequency.id]);
        }
        this.setState({
          frequencyList: res.context.sysDictionaryVOS.filter((x) => parseInt(x.valueEn) >= 3 && parseInt(x.valueEn) <= 5)
        });
      }
    });
    webapi.getSubscriptionPlanTypes().then((data) => {
      const res = data.res;
      if (res.code === Const.SUCCESS_CODE) {
        const defaultType = res.context.sysDictionaryVOS.find((vo) => vo.valueEn === 'Product');
        if (!id && defaultType) {
          this.addField('type', defaultType.name);
        }
        this.setState({
          planTypeList: res.context.sysDictionaryVOS
        });
      }
    });
    if (id) {
      webapi.getSubscriptionPlanById(id).then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          if (this.props.editable && res.context.status === 1) {
            history.push('/subscription-plan');
          }
          this.setState({
            subscriptionPlan: {
              ...res.context,
              canCancelPlan: true,
              skipNextDeliveryFlag: false
            }
          });
        }
      });
    }
  }

  next(e) {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        const current = this.state.current + 1;
        this.setState({ current });
      }
    });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  addField(field, value) {
    let data = this.state.subscriptionPlan;
    data[field] = value;
    this.setState({
      subscriptionPlan: data
    });
  }
  updateSubscriptionPlan(e, isDraft) {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        const { subscriptionPlan, id } = this.state;
        if (subscriptionPlan.mainGoods.findIndex((g) => !g.settingPrice || g.settingPrice <= 0) > -1) {
          message.warning('Setting price is required');
          return;
        }
        if (isDraft) {
          subscriptionPlan.status = 0; // Draft
        } else {
          subscriptionPlan.status = 1; // Publish
        }
        subscriptionPlan.storeId = this.state.storeId;
        if (id) {
          subscriptionPlan.id = id; // edit by id
          webapi.updateSubscriptionPlan(subscriptionPlan).then((data) => {
            const { res } = data;
            if (res.code === Const.SUCCESS_CODE) {
              message.success('Operate successfully');
              history.push({ pathname: '/subscription-plan' });
            }
          });
        } else {
          webapi.addSubscriptionPlan(subscriptionPlan).then((data) => {
            const { res } = data;
            if (res.code === Const.SUCCESS_CODE) {
              message.success('Operate successfully');
              history.push({ pathname: '/subscription-plan' });
            }
          });
        }
      }
    });
  }
  render() {
    const editable = this.props.editable;
    const { current, title, subscriptionPlan, allSkuProduct, frequencyList, planTypeList } = this.state;
    let targetDisabled = false;
    let saveDisabled = false;
    if (current === 1) {
      targetDisabled = !subscriptionPlan.targetGoods || subscriptionPlan.targetGoods.length === 0;
    }
    if (current === 4) {
      saveDisabled = !subscriptionPlan.mainGoods || subscriptionPlan.mainGoods.length === 0;
    }
    const steps = [
      {
        title: 'Basic Information',
        controller: <BasicInformation subscriptionPlan={subscriptionPlan} frequencyList={frequencyList} planTypeList={planTypeList} addField={this.addField} form={this.props.form} editable={editable} />
      },
      {
        title: 'Target Product',
        controller: <TargetProduct subscriptionPlan={subscriptionPlan} addField={this.addField} form={this.props.form} allSkuProduct={allSkuProduct} editable={editable} />
      },
      {
        title: 'Entry Criteria',
        controller: <EntryCriteria subscriptionPlan={subscriptionPlan} addField={this.addField} form={this.props.form} editable={editable} />
      },
      {
        title: 'Exit Rules',
        controller: <ExitRules subscriptionPlan={subscriptionPlan} addField={this.addField} form={this.props.form} editable={editable} />
      },
      {
        title: 'Details',
        controller: <Details subscriptionPlan={subscriptionPlan} addField={this.addField} form={this.props.form} allSkuProduct={allSkuProduct} editable={editable} />
      }
    ];
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{editable ? title : subscriptionPlan.name}</Breadcrumb.Item>
        </BreadCrumb>

        <div className="container-search" id="subscriptionPlanStep">
          <Headline title={title} />
          <Steps current={current} labelPlacement="vertical">
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="separation"></div>
          <div className="steps-content">{steps[current].controller}</div>
          <div className="steps-action">
            {current > 0 && (
              <Button style={{ marginRight: 15 }} onClick={() => this.prev()}>
                <Icon type="left" /> Return
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={(e) => this.next(e)} disabled={targetDisabled}>
                Next step <Icon type="right" />
              </Button>
            )}
            {current === steps.length - 1 && editable ? (
              <div className="saveBtn">
                <Button disabled={saveDisabled} style={{ marginRight: 15 }} type="primary" onClick={(e) => this.updateSubscriptionPlan(e, true)}>
                  Save <Icon type="right" />
                </Button>
                <Button disabled={saveDisabled} type="primary" onClick={(e) => this.updateSubscriptionPlan(e, false)}>
                  Publish <Icon type="right" />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
export default Form.create()(SubscriptionPlanUpdate);
