import React, { Component } from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import {
  Icon,
  Table,
  Tooltip,
  Divider,
  Switch,
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  Breadcrumb
} from 'antd';

const FormItem = Form.Item;
class MessageDetails extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Message Details'
    };
  }
  componentDidMount() {}

  render() {
    const { title } = this.state;

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>Message Details</Breadcrumb.Item>
        </BreadCrumb>
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
        </div>
      </div>
    );
  }
}
const styles = {} as any;

export default Form.create()(MessageDetails);
