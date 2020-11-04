import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin, Alert, InputNumber, Tabs } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

class PeoductCategory extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Product category',
      visible: false,
      productCategoryList: [
        {
          id: 1,
          productName: 'John Brown1',
          categoryImages: 32,
          categoryDiscount: 0,
          children: [
            {
              id: 4,
              productName: 'John Brown1',
              categoryImages: 32,
              categoryDiscount: 0,
              children: []
            },
            {
              id: 5,
              productName: 'John Brown2',
              categoryImages: 32,
              categoryDiscount: 0,
              children: []
            },
            {
              id: 6,
              productName: 'John Brown3',
              categoryImages: 32,
              categoryDiscount: 0,
              children: []
            }
          ]
        },
        {
          id: 2,
          productName: 'John Brown2',
          categoryImages: 32,
          categoryDiscount: 0,
          children: []
        },
        {
          id: 3,
          productName: 'John Brown3',
          categoryImages: 32,
          categoryDiscount: 0,
          children: []
        }
      ]
    };
  }
  componentDidMount() {}
  removeChildrenIsNull = (objArr) => {
    let tempString = JSON.stringify(objArr);
    let returnString = tempString.replaceAll(',"children":[]', '');
    return JSON.parse(returnString);
  };
  handleOk = () => {
    console.log('ok');
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const { title, productCategoryList } = this.state;
    const columns = [
      {
        title: 'Product name',
        dataIndex: 'productName',
        key: 'productName'
      },
      {
        title: 'Category images',
        dataIndex: 'categoryImages',
        key: 'categoryImages'
      },
      {
        title: 'categoryDiscount',
        dataIndex: 'categoryDiscount',
        key: 'categoryDiscount'
      },
      {
        title: 'Operation',
        dataIndex: '',
        key: 'x',
        render: (rowInfo) => (
          <div>
            <Tooltip placement="top" title="Bind attribute">
              <a style={styles.edit} className="iconfont iconbtn-addsubvisionsaddcategory"></a>
            </Tooltip>
          </div>
        )
      }
    ];

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />

          <Table rowKey="id" columns={columns} dataSource={this.removeChildrenIsNull(productCategoryList)} />
        </div>
        <Modal title="Bind attribute" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}></Modal>
      </div>
    );
  }
}
const styles = {} as any;

export default Form.create()(PeoductCategory);
