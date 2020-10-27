import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin, Alert, InputNumber, Tabs } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

class FilterSortSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Order Setting'
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
          <Headline title={title} />
        </div>
      </div>
    );
  }
}
const styles = {} as any;

export default Form.create()(FilterSortSetting);
