import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history, AuthWrapper } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin, Alert, InputNumber } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';


class OrderSplitSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Menu.Split order setting" />,
      configForm: {
        isSplit:false
      },
      loading: false,
    };
  }
  componentDidMount() {
  }


  render() {
    const { title, loading,configForm } = this.state;



    /*const columns = [
      {
        title: 'Category',
        dataIndex: 'parentCateName',
        key: 'parentCateName',
        width: '33%'
      },
      {
        title: 'Parent category',
        dataIndex: 'cateName',
        key: 'cateName',
        width: '33%'
      },

      {
        title: 'Need prescriber',
        dataIndex: 'prescriberFlag',
        key: 'prescriberFlag',
        width: '33%',
      }
    ];*/

    return (
      <AuthWrapper functionName="f_split_order_setting">
        <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
            <div style={{ margin: 20 }}>
              <p style={{ marginRight: 20, width: 140, textAlign: 'end', display: 'inline-block' }}><FormattedMessage id="Order.whetherToSplitOrder" />:</p>
              <Radio.Group disabled value={configForm.isSplit}>
                <Radio value={true}><FormattedMessage id="Order.yes" /></Radio>
                <Radio value={false}><FormattedMessage id="Order.no" /></Radio>
              </Radio.Group>
            </div>
        </div>
        </Spin>
      </AuthWrapper>
    );
  }
}

export default Form.create()(OrderSplitSetting);
