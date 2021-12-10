import { Button, Checkbox, Collapse, Form, Input, Modal, Radio, Spin } from 'antd';
import { Relax } from 'plume2';
import { Const, noop, ReactEditor } from 'qmkit';
import React from 'react';
import { RCi18n } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';
import { acquireContent } from '../webapi'
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
      isSend:0,
      pickup:false,
      paris:false,
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
      isSend: (recommendParams?.isSend??false)?1: 0,
      suggest: recommendParams.suggest || '',
      disabled: recommendParams.isSend,
      optimal: _type,
    }, () => {
      setFieldsValue({
        suggest: recommendParams.suggest || '',
        optimal: _type,
        paris: recommendParams.paris,
        pickup: recommendParams.pickup,
        isSend: (recommendParams?.isSend??false)?1: 0
      })
    })

  }
  showTipModal = (type, fillAutoType) => {
    const { getFillAutofindAllTitle } = this.props;
    this.setState({ visible: true, type }, () => {
      getFillAutofindAllTitle({ fillAutoType });
    })
  }
  handleOk = async () => {
    const { setFieldsValue } = this.props.form;
    const { type } = this.state;
    if (!type) return;
    let html: string = '';
    const { res } = await acquireContent({ categoryId: this.chooseItems, fillAutoType: 1 })
    if (res.code === Const.SUCCESS_CODE) {
      const result = res.context.content;
      this.chooseItems.forEach((item) => {
        let _hh = result[item];
        for (let dd in _hh) {
          html += `
          <p>${dd}.</p>
          <p>${_hh[dd]}</p>
          `
        }
      })
    }

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
    const { suggest, optimal, index, isSend, type,pickup,paris } = this.state;
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
          <Form.Item label={<>{RCi18n({ id: 'Prescriber.suggestforyourcat' })}&nbsp;&nbsp;<Button type="primary" size="small" onClick={() => this.showTipModal('suggest', 1)}>{RCi18n({ id: 'Prescriber.Auto.fill.answers' })}</Button></>}>
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
          <Form.Item label={<>{RCi18n({ id: 'Prescriber.followingoptimalnutrition' })}&nbsp;&nbsp;<Button type="primary" size="small" onClick={() => this.showTipModal('optimal', 0)}>{RCi18n({ id: 'Prescriber.Auto.fill.answers' })}</Button></>}>
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
              initialValue: paris,
              valuePropName: "checked",
            })(<Checkbox />)}

          </Form.Item>
          <Form.Item label={RCi18n({ id: 'Prescriber.Pick up' })}  {...formItemLayout} >
            {getFieldDecorator('pickup', {
              initialValue: pickup,
              valuePropName: "checked",
            })(<Checkbox />)}
          </Form.Item>
          <Form.Item >
          The customer has agreed to send the email
            {getFieldDecorator('isSend', {
              initialValue: isSend,
              rules: [{ required: true, message: RCi18n({ id: 'selectfillDate' }) }],
        
            })(<Radio.Group style={{marginLeft:10}}>
                <Radio value={1}>YES</Radio>
                <Radio value={0}>NO</Radio>
              </Radio.Group>

            )}
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
              {type === 'optimal' ? <Collapse>
                {fillAutoList && fillAutoList.toJS().map((item, index) => (
                  <Panel key={item.id} header={<span>{index + 1}、{item.categoryName}&nbsp;&nbsp;&nbsp;&nbsp;</span>} >
                    <Checkbox.Group style={{ width: '100%' }} onChange={this._onChangeCheckBox}>
                      {item.children && item.children.length > 0 && item.children.map(child => {
                        return <div style={{ padding: 10 }}><Checkbox value={child.categoryId}>{child.categoryName}</Checkbox> </div>
                      })}

                    </Checkbox.Group>
                  </Panel>))}
              </Collapse> : <div>
                <Collapse>
                  {fillAutoList && fillAutoList.toJS().map((item, index) => (
                    <Panel key={item.id} header={<span>{index + 1}、{item.categoryName}&nbsp;&nbsp;&nbsp;&nbsp;</span>} >

                      {item.children && item.children.length > 0 && item.children.map(child => {
                        return <Collapse bordered={false}>
                          <Panel key={child.id} header={<span>{child.categoryName}&nbsp;&nbsp;&nbsp;&nbsp;</span>} >
                            <Checkbox.Group style={{ width: '100%' }} onChange={this._onChangeCheckBox}>
                              {child.children && child.children.length > 0 && child.children.map(_child => {
                                return <div style={{ padding: 10 }}><Checkbox value={_child.categoryId}>{_child.categoryName}</Checkbox> </div>
                              })}

                            </Checkbox.Group>
                          </Panel>

                        </Collapse>
                      })}

                    </Panel>))}
                </Collapse>


              </div>}

            </div>
          </Spin>
        </Modal>


      </div>
    );
  }
}

export default Form.create({})(WriteTipsForm)