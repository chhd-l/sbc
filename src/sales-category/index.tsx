import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin, Alert, InputNumber, Tabs } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import SalesCategoryModal from './components/sales-category-modal';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

class SalesCategory extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Sales Category',
      salesCategoryList: [
        {
          id: 1,
          categoryName: 'John Brown1',
          productNumber: 32,
          dispalyInShop: 0,
          children: [
            {
              id: 4,
              categoryName: 'John Brown1',
              productNumber: 32,
              dispalyInShop: 0,
              children: []
            },
            {
              id: 5,
              categoryName: 'John Brown2',
              productNumber: 32,
              dispalyInShop: 0,
              children: []
            },
            {
              id: 6,
              categoryName: 'John Brown3',
              productNumber: 32,
              dispalyInShop: 0,
              children: []
            }
          ]
        },
        {
          id: 2,
          categoryName: 'John Brown2',
          productNumber: 32,
          dispalyInShop: 0,
          children: []
        },
        {
          id: 3,
          categoryName: 'John Brown3',
          productNumber: 32,
          dispalyInShop: 0,
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

  render() {
    const { title, salesCategoryList } = this.state;
    const description = (
      <div>
        <p>Store category is the classification of products within the scope of your store. Up to 2 levels can be added. When there is No categories, all products will be classified into the default classification.</p>
      </div>
    );
    const columns = [
      {
        title: 'Category name',
        dataIndex: 'categoryName',
        key: 'categoryName'
      },
      {
        title: 'Number of product',
        dataIndex: 'productNumber',
        key: 'productNumber'
      },
      {
        title: 'Display in shop',
        dataIndex: 'dispalyInShop',
        key: 'dispalyInShop',
        render: () => <Switch></Switch>
      },
      {
        title: 'Operation',
        dataIndex: '',
        key: 'x',
        render: (rowInfo) => (
          <div>
            <Tooltip placement="top" title="Add subcategory">
              <a style={styles.edit} className="iconfont iconbtn-addsubvisionsaddcategory"></a>
            </Tooltip>
            <Tooltip placement="top" title="Edit">
              <a style={styles.edit} className="iconfont iconEdit"></a>
            </Tooltip>
            <Tooltip placement="top" title="Delete">
              <a className="iconfont iconDelete">{/*<FormattedMessage id="delete" />*/}</a>
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
          <Alert message={description} type="error" />

          <SalesCategoryModal></SalesCategoryModal>
        </div>
        <div className="container-search">
          <Table rowKey="id" columns={columns} dataSource={this.removeChildrenIsNull(salesCategoryList)} />
        </div>
      </div>
    );
  }
}
const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

export default Form.create()(SalesCategory);
