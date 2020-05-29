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
import { BreadCrumb } from 'qmkit';
import BasicInfomation from './component/basic-infomation';
import PetInfomation from './component/pet-infomation';
import DeliveryInformation from './component/delivery-information';
import BillingInfomation from './component/billing-infomation';

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
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container">
          <Tabs defaultActiveKey="basic">
            <TabPane tab="Basic infomation" key="basic">
              <BasicInfomation></BasicInfomation>
            </TabPane>
            <TabPane tab="Pet infomation" key="pet">
              <PetInfomation></PetInfomation>
            </TabPane>
            <TabPane tab="Delivery infomation" key="delivery">
              <DeliveryInformation></DeliveryInformation>
            </TabPane>
            <TabPane tab="Billing infomation" key="billing">
              <BillingInfomation></BillingInfomation>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
export default Form.create()(CustomerDetails);
