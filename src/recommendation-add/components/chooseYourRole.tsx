import React from 'react';
import { Row, Col, Form, Input, Select, Spin, Button } from 'antd';
import { noop, SelectGroup } from 'qmkit';
import { Relax } from 'plume2';
import { RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { IMap } from 'typings/globalType';
const { Option } = Select;

@Relax
class ChooseYourRole extends React.Component<any, any> {
  props: {
    form:any
    relaxProps?: {
      recommendParams:IMap,
      onChangeStep: Function
      savepetsRecommendParams: Function,
      getGoodsInfoPage: Function
    };
  }
  static relaxProps = {
    recommendParams: 'recommendParams',
    onChangeStep: noop,
    savepetsRecommendParams: noop,
    getGoodsInfoPage: noop
  };
  state = {
    options: [
      "Marion Ruffié",
      "Sandrine Nataf-Otsmane",
      "Valérie Dramard",
      // "Alexandre Blavier Soler",
      "Alexandre Blavier",
      "Franck Peron",
      "Marie Anne Hours",
      "Thierry Labessan",
      "Herve Page",
      "Magali Vedel-Hilaire",
      "Claire Nelaton",
      "Pauline Bouissou",
      "Camille De Decker",
      "Mathilde Thierry",
    ],
    fetching: false,
    expert:''
  };

  constructor(props) {
    super(props);
  }
  async componentDidMount() {
  }
  _onChange=(value)=>{
    this.setState({
      expert:value
    })
   
  }
  submit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { recommendParams, savepetsRecommendParams,onChangeStep } = this.props.relaxProps;
        let _re=recommendParams.toJS();
        savepetsRecommendParams({ ..._re, ...values})
       setTimeout(() => {
        onChangeStep(1);
       }, 300);
      }
    });
  }
  render() {
    const { recommendParams } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    const {expert}=this.state
    const options = this.state.options.map((d, index) => (
      <Option key={index} value={d}>
        {d}
      </Option>
    ));
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>

        <Form style={{ width: 300 }} onSubmit={this.submit}>
          <Form.Item>
            {getFieldDecorator('expert', {
              initialValue: expert||recommendParams.get('expert') || "Marion Ruffié",
              onChange:(e)=>this._onChange(e)
            })(<SelectGroup
              label={RCi18n({ id: 'Prescriber.Role' })}
              getPopupContainer={(trigger: any) => trigger.parentNode}
              style={{ width: 180 }}
              disabled={recommendParams.get('felinRecoId')}
            >
              {options}
            </SelectGroup>)}

          </Form.Item>
          <Form.Item>
          <div className="steps-action">
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="Prescriber.Next" />
            </Button>
          </div>
          </Form.Item>
        </Form>
      </div>

    );
  }
}
export default Form.create()(ChooseYourRole)

