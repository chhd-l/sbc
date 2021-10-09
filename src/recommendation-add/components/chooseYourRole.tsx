import React from 'react';
import { Row, Col, Form, Input, Select, Spin, Button } from 'antd';
import { noop, SelectGroup } from 'qmkit';
import { Relax } from 'plume2';
import { RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
const { Option } = Select;

@Relax
class ChooseYourRole extends React.Component<any, any> {
  props: {
    relaxProps?: {
      felinReco: any,
      onChangeStep: Function
      onChangePestsForm: Function,
      getGoodsInfoPage: Function
    };
  }
  static relaxProps = {
    felinReco: 'felinReco',
    onChangeStep: noop,
    onChangePestsForm: noop,
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
    fetching: false
  };

  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    const { felinReco, onChangePestsForm, getGoodsInfoPage } = this.props.relaxProps;
    if (!felinReco.expert) {
      onChangePestsForm({ ...felinReco, expert: this.state.options[0] }, 'felinReco')
    }
    getGoodsInfoPage()
  }
  submit = (e) => {
    const { felinReco, onChangePestsForm } = this.props.relaxProps;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        onChangePestsForm({ ...felinReco, ...values }, 'felinReco')
        this.props.relaxProps.onChangeStep(1);
      }
    });
  }
  render() {
    const { felinReco } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
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
              initialValue: felinReco.expert || "Marion Ruffié",
            })(<SelectGroup
              label={RCi18n({ id: 'Prescriber.Role' })}
              getPopupContainer={(trigger: any) => trigger.parentNode}
              style={{ width: 180 }}
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