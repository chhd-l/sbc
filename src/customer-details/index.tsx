import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  message,
  Table,
  Row,
  Col
} from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const { Column } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class CustomerDetails extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Tabs>
        <TabPane tab="Basic infomation" key="basic"></TabPane>
        <TabPane tab="Pet infomation" key="pet"></TabPane>
        <TabPane tab="Delivery Rate" key="delivery"></TabPane>
        <TabPane tab="Billing Rate" key="billing"></TabPane>
      </Tabs>
    );
  }
}
export default Form.create()(CustomerDetails);
