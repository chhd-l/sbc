import React, { Component } from 'react';
import { Headline, BreadCrumb, history, Const } from 'qmkit';
import { Breadcrumb, message, Steps, Button, Icon, Form } from 'antd';
import './index.less';
import BasicInformation from './components/basicInformation';
import TargetProduct from './components/targetProduct';
import EntryCriteria from './components/entryCriteria';
import ExitRules from './components/exitRules';
import Details from './components/details';
import * as webapi from './webapi';

const { Step } = Steps;

class SubscriptionPlanUpdate extends Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: '',
      current: 0,
      subscriptionPlan: {
        canCancelPlan: true,
        subscriptionPlanFlag: true,
        canChargeDeliveryFlag: true,
        skipNextDeliveryFlag: true,
        mainProducts: [],
        mainProductIds: [],
        quantity: 100,
        landingFlag: 1
      },
      allSkuProduct: []
    };
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.addField = this.addField.bind(this);
  }

  componentWillMount() {
    const { id } = this.state;
    this.setState({
      title: id ? 'Edit Plan (Food Dispenser)' : 'Add New Plan (Food Dispenser)'
    });
    webapi
      .getAllSkuProducts()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            allSkuProduct: res.context.goodsInfos.content
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });
    if (id) {
      webapi
        .getSubscriptionPlanById(id)
        .then((data) => {
          const { res } = data;
          if (res.code === 'K-000000') {
            if(res.context.status === 0) {
              history.push('/subscription-plan')
            }
            this.setState({
              subscriptionPlan: res.context
            });
          } else {
            message.error(res.message || 'Get Data Failed');
          }
        })
        .catch((err) => {
          message.error(err || 'Get Data Failed');
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
        if(isDraft){
          subscriptionPlan.status = 0 // Draft
        } else {
          subscriptionPlan.status = 1 // Publish
        }
        console.log(subscriptionPlan)
        console.log( JSON.stringify(subscriptionPlan))
        if (id) {
          subscriptionPlan.id = id; // edit by id
          webapi
            .updateSubscriptionPlan(subscriptionPlan)
            .then((data) => {
              const { res } = data;
              if (res.code === 'K-000000') {
                message.success('Operate successfully');
                history.push({ pathname: '/subscriptionPlan-list' });
              } else {
                message.error(res.message || 'Update Failed');
              }
            })
            .catch((err) => {
              message.error(err || 'Update Failed');
            });
        } else {
          webapi
            .addSubscriptionPlan(subscriptionPlan)
            .then((data) => {
              const { res } = data;
              if (res.code === 'K-000000') {
                message.success('Operate successfully');
                history.push({ pathname: '/subscriptionPlan-list' });
              } else {
                message.error(res.message || 'Add Failed');
              }
            })
            .catch((err) => {
              message.error(err || 'Add Failed');
            });
        }
      }
    });
  }
  render() {
    const { current, title, subscriptionPlan, allSkuProduct } = this.state;
    let targetDisabled = false;
    let saveDisabled = false;
    if(current === 1) {
      targetDisabled = !subscriptionPlan.targetProductIds || subscriptionPlan.targetProductIds.length === 0
    }
    if(current === 4) {
      saveDisabled = !subscriptionPlan.mainProductIds || subscriptionPlan.mainProductIds.length === 0
    }
    const steps = [
      {
        title: 'Basic Information',
        controller: <BasicInformation subscriptionPlan={subscriptionPlan} addField={this.addField} form={this.props.form} />
      },
      {
        title: 'Target Product',
        controller: <TargetProduct subscriptionPlan={subscriptionPlan} addField={this.addField} form={this.props.form} allSkuProduct={allSkuProduct} />
      },
      {
        title: 'Entry Criteria',
        controller: <EntryCriteria subscriptionPlan={subscriptionPlan} addField={this.addField} form={this.props.form} />
      },
      {
        title: 'Exit Rules',
        controller: <ExitRules subscriptionPlan={subscriptionPlan} addField={this.addField} form={this.props.form} />
      },
      {
        title: 'Details',
        controller: <Details subscriptionPlan={subscriptionPlan} addField={this.addField} form={this.props.form} allSkuProduct={allSkuProduct} />
      }
    ];
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
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
            {current === steps.length - 1 && (
              <div className="saveBtn">
                <Button  disabled={saveDisabled} style={{ marginRight: 15 }} type="primary" onClick={(e) => this.updateSubscriptionPlan(e, true)}>
                  Save <Icon type="right" />
                </Button>
                <Button disabled={saveDisabled} type="primary" onClick={(e) => this.updateSubscriptionPlan(e, false)}>
                  Publish <Icon type="right" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Form.create()(SubscriptionPlanUpdate);