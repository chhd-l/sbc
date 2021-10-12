import { Button, Checkbox, Collapse, Form, Input, Modal, Spin } from 'antd';
import { Relax } from 'plume2';
import { noop, ReactEditor } from 'qmkit';
import React from 'react';
import { RCi18n } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';
const { Panel } = Collapse;

class WriteTipsForm extends React.Component<any, any> {
  chooseItems: Array<any>;
  props: {
    form: any
    recommendParams: IMap
    savepetsRecommendParams: Function,
    getFillAutofindAllTitle: Function
    fillAutoList: IList
    loading: boolean
    done: Function
    onChangeStep: Function
  }

  constructor(props) {
    super(props);
    this.state = {
      index: 1,
      visible: false,
      suggest: '',
      optimal: '',
      disabled: false
    }
  }

  _onChange = (value, key: string) => {
    this.setState({
      [key]: value
    })
  }
  componentDidMount() {
    const { recommendParams }: any = this.props;
    const { setFieldsValue } = this.props.form;

    let o = this.state['optimal'] || '';
      o = o.replace(RCi18n({ id: 'Prescriber.Recommendation.optimal' }), '');
      o = RCi18n({ id: 'Prescriber.Recommendation.optimal' }) + o;
    let _type = `${o || ''}`
    this.setState({
      index: +new Date(),
      suggest: recommendParams.suggest || '',
      disabled: recommendParams.isSend,
      optimal: _type,
    }, () => {
      setFieldsValue({
        suggest: recommendParams.suggest || '',
        optimal: _type,
        paris: recommendParams.paris,
        pickup: recommendParams.pickup,
        isSend: recommendParams.isSend||false
      })
    })

  }
  showTipModal = (type) => {
    const { getFillAutofindAllTitle } = this.props;
    this.setState({ visible: true, type }, () => {
      getFillAutofindAllTitle();
    })
  }
  handleOk = () => {
    const { setFieldsValue } = this.props.form;
    const { type } = this.state;
    if (!type) return;
    let html: any = this.chooseItems.map(item => (`<p>${item.tipContent}</p>`))
    let o = this.state[type] || '';
    if (type === 'optimal') {
      o = o.replace(RCi18n({ id: 'Prescriber.Recommendation.optimal' }), '');
      o = RCi18n({ id: 'Prescriber.Recommendation.optimal' }) + o;
    }
    let _type = `${o || ''} ${html.toString()}`
    setFieldsValue({
      [type]: _type
    })
    this.setState({
      index: +new Date(),
      type: undefined,
      visible: false,
      [type]: _type
    }, () => {
      this.chooseItems = []
    })

  }
  handleCancel = () => {
    this.setState({ visible: false }, () => {
      this.chooseItems = []
    })
  }
  _onChangeCheckBox = (e) => {
    this.chooseItems = e;
  }
  done = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.done(values);
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, fillAutoList, onChangeStep } = this.props;
    const { suggest, optimal, index, disabled,activeKey } = this.state;
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
        <Form onSubmit={this.done}>
          <Form.Item label={<>{RCi18n({ id: 'Prescriber.suggestforyourcat' })}&nbsp;&nbsp;<Button type="primary" size="small" onClick={() => this.showTipModal('suggest')}>{RCi18n({ id: 'Prescriber.Auto.fill.answers' })}</Button></>}>
            {getFieldDecorator('suggest')(
              <ReactEditor
                key={index}
                id={'name-wrapper-suggest'}
                toolbars={[]}
                onContentChange={(e) => this._onChange(e, 'suggest')}
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
                onContentChange={(e) => this._onChange(e, 'optimal')}
                content={optimal}
                height={300}
              />
            )}

          </Form.Item>
          <Form.Item label={RCi18n({ id: 'Prescriber.Paris' })} {...formItemLayout}>
            {getFieldDecorator('paris', {
              initialValue: true,
              valuePropName: "checked",
            })(<Checkbox />)}

          </Form.Item>
          <Form.Item label={RCi18n({ id: 'Prescriber.Pick up' })}  {...formItemLayout} >
            {getFieldDecorator('pickup', {
              initialValue: true,
              valuePropName: "checked",
            })(<Checkbox />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('isSend', {
              initialValue: true,
              valuePropName: "checked",
              onChange: (e) => {
                this.setState({
                  disabled: e.target.checked
                })
              }

            })(<Checkbox>The customer has agreed to send the email</Checkbox>)}
            <Button disabled={!disabled} size="small" type="primary">Send</Button>
          </Form.Item>
          <div className="steps-action">

            <Button style={{ marginRight: 15 }} onClick={() => onChangeStep(2)}>
              <FormattedMessage id="Prescriber.Previous" />
            </Button>
            <Button type="primary" htmlType="submit" >
              <FormattedMessage id="Prescriber.Done" />
            </Button>
          </div>
        </Form>


        <Modal
          title={RCi18n({ id: 'Prescriber.Auto.fill.question' })}
          width="50%"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Spin spinning={loading}>
            <div style={{ maxHeight: 400, overflow: 'auto', minHeight: 300 }}>
              <Checkbox.Group style={{ width: '100%' }} onChange={this._onChangeCheckBox}>
                <Collapse>
                  {fillAutoList && fillAutoList.toJS().map((item, index) => (
                    <Panel key={item.id} header={<span>{index + 1}、{item.tipTitle}&nbsp;&nbsp;&nbsp;&nbsp;<Checkbox value={item}></Checkbox></span>} >
                      {item.tipContent}
                    </Panel>))}
                </Collapse>
              </Checkbox.Group>

            </div>
          </Spin>
        </Modal>


      </div>
    );
  }
}

export default Form.create({})(WriteTipsForm)