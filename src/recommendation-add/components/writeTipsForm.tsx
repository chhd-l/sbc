import { Button, Checkbox, Collapse, Form, Input, Modal, Radio, Spin  } from 'antd';
import { Const, ReactEditor } from 'qmkit';
import React from 'react';
import { RCi18n } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';
import { acquireContent } from '../webapi';
const { Panel } = Collapse;

class WriteTipsForm extends React.Component<any, any> {
  chooseItems: Array<any>;
  props: {
    form: any;
    recommendParams: IMap;
    savepetsRecommendParams: Function;
    getFillAutofindAllTitle: Function;
    fillAutoList: IList;
    loading: boolean;
    done: Function;
    onChangeStep: Function;
  };

  constructor(props) {
    super(props);
    this.state = {
      index: 1,
      visible: false,
      isSend: undefined,
      pickup: false,
      paris: false,
      suggest: '',
      optimal: '',
      disabled: false,
      chexs: [],
      chooseItems: [],
      chooseItems2: [],
    };
  }

  _onChange = (value, key: string) => {
    const { setFieldsValue } = this.props.form;
    this.setState(
      {
        [key]: value
      },
      () => {
        setFieldsValue({
          [key]: value
        });
      }
    );
  };
  componentDidMount() {
    const { recommendParams }: any = this.props;
    const { setFieldsValue } = this.props.form;

    let o = this.state['optimal'] || '';
    o = o.replace(RCi18n({ id: 'Prescriber.Recommendation.optimal' }), '');
    o = RCi18n({ id: 'Prescriber.Recommendation.optimal' }) + o;
    // let _type = `${o || ''}`;
    this.setState(
      {
        index: +new Date(),
        isSend: recommendParams.isSend,
        suggest: recommendParams.suggest || '',
        disabled: recommendParams.isSend,
        optimal: ''
      },
      () => {
        setFieldsValue({
          suggest: recommendParams.suggest || '',
          optimal: '',
          paris: recommendParams.paris,
          pickup: recommendParams.pickup,
          isSend: recommendParams?.isSend
        });
      }
    );
  }
  showTipModal = (type, fillAutoType) => {
    const { getFillAutofindAllTitle } = this.props;

    if(fillAutoType){
      this.setState({
        chexs: this.state.chooseItems
      })
    } else {
      this.setState({
        chexs: this.state.chooseItems2
      })
    }

    this.setState({ 
      visible: true, 
      type, 
      fillAutoType, 
    }, () => {
      getFillAutofindAllTitle({ fillAutoType });
    });
  };
  handleOk = async () => {
    const { setFieldsValue } = this.props.form;
    const { type, fillAutoType } = this.state;
    if (!type) return;
    let html: string = '';
    if(!fillAutoType) {
      console.log('type',type)
      const { res } = await acquireContent({ categoryId: this.state.chooseItems2, fillAutoType: 1 });
      if (res.code === Const.SUCCESS_CODE) {
        const result = res.context.content;
        this.state.chooseItems2.forEach((item) => {
          let _hh = result[item];
          for (let dd in _hh) {
            html += `
            <p>${dd}</p>
            <p>${_hh[dd]}</p>
            `;
          }
        });
      }
    } else {
      console.log('type',type)
      const { res } = await acquireContent({ categoryId: this.state.chooseItems, fillAutoType: 1 });
      if (res.code === Const.SUCCESS_CODE) {
        const result = res.context.content;
        this.state.chooseItems.forEach((item) => {
          let _hh = result[item];
          for (let dd in _hh) {
            html += `
            <p>${dd}</p>
            <p>${_hh[dd]}</p>
            `;
          }
        });
      }
    }

    let o = this.state[type] || '';
    if (type === 'optimal') {
      o = o.replace(RCi18n({ id: 'Prescriber.Recommendation.optimal' }), '');
      o = RCi18n({ id: 'Prescriber.Recommendation.optimal' }) + o;
    }
    // let _type = `${o || ''} ${html.toString()}`;
    let _type = `${html.toString()}`;
    setFieldsValue({
      [type]: _type
    });
    
    this.setState(
      {
        index: +new Date(),
        type: undefined,
        visible: false,
        [type]: _type,
        chexs: this.state.chooseItems
      }
    );

    if(!fillAutoType) {
      this.setState({chexs: this.state.chooseItems2})
    } else {
      this.setState({chexs: this.state.chooseItems})
    }
  };

  handleCancel = () => {
    if(!this.state.fillAutoType) {
      this.setState({ 
        visible: false,
        chooseItems2: this.state.chexs,
       });
    } else {
      this.setState({ 
        visible: false,
        chooseItems: this.state.chexs,
       });
    }
  };

  _onChangeCheckBox = (e: any) => {
    const value = e.target.value;
    const index = this.state.chooseItems.findIndex((item) => item === value);
    const aaa = index === -1
    ? [...this.state.chooseItems, value]
    : this.state.chooseItems.filter((item) => item !== value);
    this.setState({
      chooseItems: aaa
    })
  };
  _onChangeCheckBox2 = (e: any) => {
    const value = e.target.value;
    const index = this.state.chooseItems2.findIndex((item) => item === value);
    const aaa = index === -1
    ? [...this.state.chooseItems2, value]
    : this.state.chooseItems2.filter((item) => item !== value);
    this.setState({
      chooseItems2: aaa
    })
  };

  done = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.done(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, fillAutoList, onChangeStep } = this.props;
    const { suggest, optimal, index, isSend, type, pickup, paris, chooseItems, chooseItems2 } = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 2 }
      },
      wrapperCol: {
        sm: { span: 5 }
      }
    };
    return (
      <div>
        <Form onSubmit={this.done}>
          <Form.Item
            label={
              <>
                {RCi18n({ id: 'Prescriber.suggestforyourcat' })}&nbsp;&nbsp;
                <Button type="primary" size="small" onClick={() => this.showTipModal('suggest', 1)}>
                  {RCi18n({ id: 'Prescriber.Auto.fill.answers' })}
                </Button>
              </>
            }
          >
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
          <Form.Item
            label={
              <>
                {RCi18n({ id: 'Prescriber.followingoptimalnutrition' })}&nbsp;&nbsp;
                <Button type="primary" size="small" onClick={() => this.showTipModal('optimal', 0)}>
                  {RCi18n({ id: 'Prescriber.Auto.fill.answers' })}
                </Button>
              </>
            }
          >
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
              valuePropName: 'checked'
            })(<Checkbox />)}
          </Form.Item>
          <Form.Item label={RCi18n({ id: 'Prescriber.Pick up' })} {...formItemLayout}>
            {getFieldDecorator('pickup', {
              initialValue: pickup,
              valuePropName: 'checked'
            })(<Checkbox />)}
          </Form.Item>
          <Form.Item>
            <span className="ant-form-item-required"></span>
            {RCi18n({ id: 'Prescriber.Pet agreed' })}
            {getFieldDecorator('isSend', {
              initialValue: isSend,
              rules: [{ required: true, message: RCi18n({ id: 'Prescriber.Pet send email' }) }]
            })(
              <Radio.Group style={{ marginLeft: 10 }}>
                <Radio value={true}>YES</Radio>
                <Radio value={false}>NO</Radio>
              </Radio.Group>
            )}
          </Form.Item>

          <div className="steps-action">
            <Button style={{ marginRight: 15 }} onClick={() => onChangeStep(2)}>
              <FormattedMessage id="Prescriber.Previous" />
            </Button>
            <Button type="primary" htmlType="submit">
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
              {type === 'optimal' ? (
                <Collapse>
                  {fillAutoList &&
                    fillAutoList.toJS().map((item, index) => (
                      <Panel
                        key={item.id}
                        header={
                          <span>
                            {index + 1}、{item.categoryName}&nbsp;&nbsp;&nbsp;&nbsp;
                          </span>
                        }
                      >
                      {item.children &&
                        item.children.length > 0 &&
                        item.children.map((child) => {
                          return (
                            <div key={child.categoryId} style={{ padding: 10 }}>
                              <Checkbox checked={chooseItems2.includes(child.categoryId)} onChange={this._onChangeCheckBox2} value={child.categoryId}>{child.categoryName}</Checkbox>{' '}
                            </div>
                          );
                        })}
                      </Panel>
                    ))}
                </Collapse>
              ) : (
                <Collapse>
                  {fillAutoList &&
                    fillAutoList.toJS().map((item, index) => (
                      <Panel
                        key={item.id}
                        header={
                          <span>
                            {index + 1}、{item.categoryName}&nbsp;&nbsp;&nbsp;&nbsp;
                          </span>
                        }
                      >
                        {item.children &&
                          item.children.length > 0 &&
                          item.children.map((child) => {
                            return (
                              <Collapse key={child.id}  bordered={false}>
                                <Panel
                                  key={child.id}
                                  header={
                                    <span>{child.categoryName}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                  }
                                >
                                {child.children &&
                                  child.children.length > 0 &&
                                  child.children.map((_child) => {
                                    return (
                                      <div key={_child.categoryId} style={{ padding: 10 }}>
                                        <Checkbox checked={chooseItems.includes(_child.categoryId)} value={_child.categoryId}  onChange={this._onChangeCheckBox}>
                                          {_child.categoryName}
                                        </Checkbox>{' '}
                                      </div>
                                    );
                                  })}
                                </Panel>
                              </Collapse>
                            );
                          })}
                      </Panel>
                    ))}
                </Collapse>
              )}
            </div>
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default Form.create({})(WriteTipsForm);
