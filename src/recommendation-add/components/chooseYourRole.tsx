import React from 'react';
import { Row, Col, Form, Input, Select, Spin } from 'antd';
import { noop, SelectGroup } from 'qmkit';
import { Relax } from 'plume2';
import { RCi18n } from 'qmkit';
const { Option } = Select;

@Relax
export default class ChooseYourRole extends React.Component<any, any> {
  props: {
    form: any,
    relaxProps?: {
        felinReco:any,
        onChangePestsForm:Function,
        getGoodsInfoPage:Function
      };
}
static relaxProps = {
    felinReco: 'felinReco',
    onChangePestsForm:noop,
    getGoodsInfoPage:noop
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
  const { felinReco,onChangePestsForm ,getGoodsInfoPage} = this.props.relaxProps;
    if(!felinReco.expert){
      onChangePestsForm({...felinReco,expert:this.state.options[0]},'felinReco')
    }
    getGoodsInfoPage()
 }
 _onChange(e) {
  const { felinReco,onChangePestsForm } = this.props.relaxProps;
  if (e && e.target) {
      e = e.target.value;
  }
  onChangePestsForm({...felinReco,expert:e},'felinReco')
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
      
        <Form  style={{ width: 300 }}>
          {/* <Form.Item>
            {getFieldDecorator('storeName', {
              initialValue:storeName||'L’Atelier Felin',
            })(<SelectGroup
              label="Role"
              getPopupContainer={(trigger: any) => trigger.parentNode}
              style={{ width: 180 }}
            >
              <Option value="L’Atelier Felin">
                L’Atelier Felin
                </Option>
            </SelectGroup>)}

          </Form.Item> */}
          <Form.Item>
            {getFieldDecorator('expert', {
              initialValue:felinReco.expert||"Marion Ruffié",
              onChange:(e)=>this._onChange(e)
            })(<SelectGroup
              label={RCi18n({id:'Prescriber.Role'})}
              getPopupContainer={(trigger: any) => trigger.parentNode}
              style={{ width: 180 }}
            >
              {options}
            </SelectGroup>)}

          </Form.Item>
        </Form>
      </div>

    );
  }
}
