import { Button, Checkbox, Form, Input, Modal, Spin } from 'antd';
import { Relax } from 'plume2';
import { noop, ReactEditor } from 'qmkit';
import React from 'react';
import { RCi18n } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { fetchFindFillAutoAllTitle } from '../webapi';
import { FormattedMessage } from 'react-intl';
import { re } from 'mathjs';

@Relax
class PaymentInformation extends React.Component<any, any> {
  chooseItems: Array<any>;
  props: {
    relaxProps?: {
      recommendParams: IMap
      savepetsRecommendParams: Function,
      getFillAutofindAllTitle: Function
      fillAutoList: IList
      loading: boolean,
      funType: boolean
      onChangeStep: Function
    };
  }
  static relaxProps = {
    recommendParams: 'recommendParams',
    fillAutoList: 'fillAutoList',
    savepetsRecommendParams: noop,
    getFillAutofindAllTitle: noop,
    onChangeStep:noop,
    loading: 'loading',
    funType: 'funType'
  };
  constructor(props) {
    super(props);
    const {recommendParams } =props.relaxProps;
    const _re=recommendParams.toJS()
    this.state = {
      index:1,
      visible: false,
      suggest: _re?.suggest??'',
      optimal: _re?.optimal??'',
      paris: _re.paris,
      pickup: _re.pickup,
    }
  }

  _onChange(e, key: string, checked?: boolean) {
    let value = null
    if (checked) {
      value = e.target.checked
    } else {
      if (e && e.target.value) {
        value = e.target.value;
      }
    }
    this.setState({
      [key]: value
    })
  }
  componentDidMount() {

  }
  showTipModal = (type) => {
    const { getFillAutofindAllTitle } = this.props.relaxProps;
    this.setState({ visible: true, type }, () => {
      getFillAutofindAllTitle();
    })
  }
  handleOk = () => {
    const { setFieldsValue } = this.props.form;
    const {recommendParams } = this.props.relaxProps;
    const { type } = this.state;
    let html: any = this.chooseItems.map(item => (`<p>question:${item.tipTitle}</p><p><p>answer:${item.tipContent}</></p>`))
    let _type = `${this.state[type] || ''} ${html.toString()}`
    console.log(type,'typetypetypetypetypetype')
    setFieldsValue({
      [type]: _type
    })
    // setTimeout(() => {
      this.setState({
        index:+new Date(),
        type: undefined,
        visible: false,
        [type]: _type
      }, () => {
        this.chooseItems = []
      })
    // }, 300);

  }
  handleCancel = () => {
    this.setState({ visible: false },()=>{
       this.chooseItems = []
    })
  }
  _onChangeCheckBox = (e) => {
    this.chooseItems = e;
  }
  done=(e)=> {
    e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          console.log(values,'====')
        })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {  loading, funType, fillAutoList ,onChangeStep} = this.props.relaxProps;
    const {suggest,optimal,index,paris,pickup} = this.state;
    console.log(suggest, "recommendParams.get('suggest')")
    const formItemLayout = {
      labelCol: {
        sm: { span: 2 },
      },
      wrapperCol: {
        sm: { span: 5 },
      },
    };

    return (
      <div>
        <Spin spinning={false}>
          <Form onSubmit={this.done}>
            <Form.Item label={<>{RCi18n({ id: 'Prescriber.suggestforyourcat' })}&nbsp;&nbsp;<Button type="primary" size="small" onClick={() => this.showTipModal('suggest')}>{RCi18n({ id: 'Prescriber.Auto.fill.answers' })}</Button></>}>
              {getFieldDecorator('suggest')(
                <ReactEditor
                key={index}
                  id={'name-wrapper-suggest'}
                  toolbars={[]}
                  onContentChange={(e) => this._onChange({ target: { value: e } }, 'suggest')}
                  content={suggest}
                  height={300}
                />
              )}

            </Form.Item>
            <Form.Item label={<>{RCi18n({ id: 'Prescriber.followingoptimalnutrition' })}&nbsp;&nbsp;<Button type="primary" size="small" onClick={() => this.showTipModal('optimal')}>{RCi18n({ id: 'Prescriber.Auto.fill.answers' })}</Button></>}>
              {getFieldDecorator('optimal')(
                <ReactEditor
                key={index}
                  id={'name-wrapper-optimal'}
                  toolbars={[]}
                  onContentChange={(e) => this._onChange({ target: { value: e } }, 'optimal')}
                  content={((!funType && RCi18n({ id: 'Prescriber.Recommendation.optimal' })) || '') + (optimal)}
                  height={300}
                />
              )}

            </Form.Item>
            <Form.Item label={RCi18n({ id: 'Prescriber.Paris' })} {...formItemLayout}>
              {getFieldDecorator('paris', {
                initialValue:paris,
              })(<Checkbox />)}

            </Form.Item>
            <Form.Item label={RCi18n({ id: 'Prescriber.Pick up' })}  {...formItemLayout} >
              {getFieldDecorator('pickup', {
                initialValue: pickup,
                valuePropName:"checked"
              })(<Checkbox   />)}

            </Form.Item>
            <div className="steps-action">

            <Button style={{ marginRight: 15 }} onClick={()=>onChangeStep(2)}>
                <FormattedMessage id="Prescriber.Previous" />
            </Button>
            <Button type="primary" htmlType="submit" >
                <FormattedMessage id="Prescriber.Done" />
            </Button>
            </div>
          </Form>
        </Spin>

        <Modal
          title="Basic Modal"
          width="50%"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div style={{ maxHeight: 400, overflow: 'auto' }}>
            <Checkbox.Group style={{ width: '100%' }} onChange={this._onChangeCheckBox}>
              {fillAutoList && fillAutoList.toJS().map(item => (<div key={item.id} style={{ padding: '5px 0' }}>
                <Checkbox value={item}>{item.tipTitle}</Checkbox>
              </div>))

              }
            </Checkbox.Group>
          </div>

        </Modal>


      </div>
    );
  }
}

export default Form.create()(PaymentInformation)