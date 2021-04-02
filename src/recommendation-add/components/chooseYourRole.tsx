import React from 'react';
import { Row, Col, Form, Input, Select, Spin } from 'antd';
import { SelectGroup } from 'qmkit';
const { Option } = Select;
class ConsumerInformation extends React.Component<any, any> {
  state = {
    options: [
      "Marion Ruffié",
      "Sandrine Nataf-Otsmane",
      "Valérie Dramard",
      "Alexandre Blavier Soler",
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
  
 }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { storeName, expert} = this.props.allParams;
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
              initialValue:expert||"Marion Ruffié"
            })(<SelectGroup
              label="Role"
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

export default ConsumerInformation;
