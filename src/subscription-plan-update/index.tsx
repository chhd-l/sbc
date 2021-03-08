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
import { FormattedMessage } from 'react-intl';

const { Step } = Steps;

class Subscription extends Component<any, any> {
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
      title: id ? <FormattedMessage id="Subscription.index.EditPlan" /> : <FormattedMessage id="Subscription.index.AddNewPlan" />,
      current: 0,
      storeId,
      Subscription: {
        canCancelPlan: true,
        SubscriptionFlag: true,
        changeDeliveryDateFlag: true,
        skipNextDeliveryFlag: true,
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
    webapi
      .getWeekFrequency()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          let defaultFrequency = res.context.sysDictionaryVOS.find((x) => parseInt(x.valueEn) === 4);
          if (!id && defaultFrequency) {
            this.addField('frequency', [defaultFrequency.id]);
          }
          this.setState({
            frequencyList: res.context.sysDictionaryVOS.filter((x) => parseInt(x.valueEn) >= 3 && parseInt(x.valueEn) <= 5)
          });
        } else {
          message.error(res.message || <FormattedMessage id="Subscription.index.GetDataFailed" />);
        }
      })
      .catch(() => {
        message.error(<FormattedMessage id="Subscription.index.GetDataFailed" />);
      });
    webapi
      .getSubscriptionTypes()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          const defaultType = res.context.sysDictionaryVOS.find((vo) => vo.valueEn === 'Product');
          if (!id && defaultType) {
            this.addField('type', defaultType.name);
          }
          this.setState({
            planTypeList: res.context.sysDictionaryVOS
          });
        } else {
          message.error(res.message || <FormattedMessage id="Subscription.index.GetDataFailed" />);
        }
      })
      .catch(() => {
        message.error(<FormattedMessage id="Subscription.index.GetDataFailed" />);
      });
    if (id) {
      webapi
        .getSubscriptionById(id)
        .then((data) => {
          const { res } = data;
          if (res.code === 'K-000000') {
            if (res.context.status === 1) {
              history.push('/subscription-plan');
            }
            this.setState({
              Subscription: res.context
            });
          } else {
            message.error(res.message || <FormattedMessage id="Subscription.index.GetDataFailed" />);
          }
        })
        .catch((err) => {
          message.error(err || <FormattedMessage id="Subscription.index.GetDataFailed" />);
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
    let data = this.state.Subscription;
    data[field] = value;
    this.setState({
      Subscription: data
    });
  }
  updateSubscription(e, isDraft) {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        const { Subscription, id } = this.state;
        if (isDraft) {
          Subscription.status = 0; // Draft
        } else {
          Subscription.status = 1; // Publish
        }
        Subscription.storeId = this.state.storeId;
        if (id) {
          Subscription.id = id; // edit by id
          webapi
            .updateSubscription(Subscription)
            .then((data) => {
              const { res } = data;
              if (res.code === 'K-000000') {
                message.success(<FormattedMessage id="Subscription.index.OperateSuccessfully" />);
                history.push({ pathname: '/subscription-plan' });
              } else {
                message.error(res.message || <FormattedMessage id="Subscription.index.UpdateFailed" />);
              }
            })
            .catch((err) => {
              message.error(err || <FormattedMessage id="Subscription.index.UpdateFailed" />);
            });
        } else {
          webapi
            .addSubscription(Subscription)
            .then((data) => {
              const { res } = data;
              if (res.code === 'K-000000') {
                message.success(<FormattedMessage id="Subscription.index.OperateSuccessfully" />);
                history.push({ pathname: '/subscription-plan' });
              } else {
                message.error(res.message || <FormattedMessage id="Subscription.index.AddFailed" />);
              }
            })
            .catch((err) => {
              message.error(err || <FormattedMessage id="Subscription.index.AddFailed" />);
            });
        }
      }
    });
  }
  render() {
    const editable = this.props.editable;
    const { current, title, Subscription, allSkuProduct, frequencyList, planTypeList } = this.state;
    let targetDisabled = false;
    let saveDisabled = false;
    if (current === 1) {
      targetDisabled = !Subscription.targetGoods || Subscription.targetGoods.length === 0;
    }
    if (current === 4) {
      saveDisabled = !Subscription.mainGoods || Subscription.mainGoods.length === 0;
    }
    const steps = [
      {
        title: <FormattedMessage id="Subscription.index.BasicInformation" />,
        controller: <BasicInformation Subscription={Subscription} frequencyList={frequencyList} planTypeList={planTypeList} addField={this.addField} form={this.props.form} editable={editable} />
      },
      {
        title: <FormattedMessage id="Subscription.index.TargetProduct" />,
        controller: <TargetProduct Subscription={Subscription} addField={this.addField} form={this.props.form} allSkuProduct={allSkuProduct} editable={editable} />
      },
      {
        title: <FormattedMessage id="Subscription.index.EntryCriteria" />,
        controller: <EntryCriteria Subscription={Subscription} addField={this.addField} form={this.props.form} editable={editable} />
      },
      {
        title: <FormattedMessage id="Subscription.index.ExitRules" />,
        controller: <ExitRules Subscription={Subscription} addField={this.addField} form={this.props.form} editable={editable} />
      },
      {
        title: <FormattedMessage id="Subscription.index.Details" />,
        controller: <Details Subscription={Subscription} addField={this.addField} form={this.props.form} allSkuProduct={allSkuProduct} editable={editable} />
      }
    ];
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{editable ? title : Subscription.name}</Breadcrumb.Item>
        </BreadCrumb>

        <div className="container-search" id="SubscriptionStep">
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
                <Icon type="left" /> <FormattedMessage id="Subscription.index.Return" />
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={(e) => this.next(e)} disabled={targetDisabled}>
                <FormattedMessage id="Subscription.index.NextStep" /> <Icon type="right" />
              </Button>
            )}
            {current === steps.length - 1 && editable ? (
              <div className="saveBtn">
                <Button disabled={saveDisabled} style={{ marginRight: 15 }} type="primary" onClick={(e) => this.updateSubscription(e, true)}>
                  <FormattedMessage id="Subscription.index.Save" /> <Icon type="right" />
                </Button>
                <Button disabled={saveDisabled} type="primary" onClick={(e) => this.updateSubscription(e, false)}>
                  <FormattedMessage id="Subscription.index.Publish" /> <Icon type="right" />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
export default Form.create()(Subscription);
