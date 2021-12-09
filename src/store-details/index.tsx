import React from 'react';
import { Form, Input, Select } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

export default class StoreDetail extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const formItemLayout = {
      labelCol: {
        sm: { span: 24 },
        xs: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 24 },
        xs: { span: 12 },
      }
    };
    return (
      <div>
        <BreadCrumb />
        <Headline title="Store contact information" />
      </div>
    );
  }
}
