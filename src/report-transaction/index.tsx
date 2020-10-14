import React, { Component } from 'react';
import { BreadCrumb, Headline, SelectGroup, history, Const } from 'qmkit';
import { Form, Spin, Row, Col, Select, Input, Button, message, Tooltip, Divider, Table, Popconfirm } from 'antd';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

export default class ProductReport extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Transaction',
      loading: false
    };
  }
  componentDidMount() {}

  render() {
    const { title } = this.state;

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} extra={<div></div>} />
        </div>
        <div className="container"></div>
      </div>
    );
  }
}
const styles = {} as any;
