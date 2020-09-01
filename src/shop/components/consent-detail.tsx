import React, { Component } from 'react';
import { Select, Input, Icon, Form, Col } from 'antd';
import '../editcomponents/style.less';
import { Relax } from 'plume2';
import DragTable from '../components/dragTable';
import { FormattedMessage } from 'react-intl';
import { SelectGroup } from 'qmkit';


const { Option } = Select;
const FormItem = Form.Item;





@Relax
export default class StepConsent extends Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      pageType: 'Detail'
    };
  }

  props: {
    histroy?: Object;
    relaxProps?: {
      loading: boolean;
      dataList: any;

    };
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList',

  };
  handleChange = (value)=> {
    console.log(`selected ${value}`);
  }

  pageChange = (e) => {
    this.setState({pageType : e})
  }

  render() {
    return <div className="consent-detail">
      <div className="detail">
        <div className="detail-form space-between">
          <FormItem>
            <SelectGroup
              defaultValue=""
              label="Language"
              style={{ width: 280 }}
              onChange={(value) => {
                value = value === '' ? null : value;
                /*this.onFormChange({
                  field: 'customerTypeId',
                  value
                });*/
              }}
            >
              <Option value="">Englich</Option>
              {/*{customerTypeArr.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}*/}
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              defaultValue=""
              label="Category"
              style={{ width: 280 }}
              onChange={(value) => {
                value = value === '' ? null : value;
                /*this.onFormChange({
                  field: 'customerTypeId',
                  value
                });*/
              }}
            >
              <Option value="">All</Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              defaultValue=""
              label="Customer type"
              style={{ width: 280 }}
              onChange={(value) => {
                value = value === '' ? null : value;
                /*this.onFormChange({
                  field: 'customerTypeId',
                  valuen
                });*/
              }}
            >
              <Option value="">All</Option>
              {/*{customerTypeArr.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}*/}
            </SelectGroup>
          </FormItem>
        </div>
      </div>

    </div>
  }
}
