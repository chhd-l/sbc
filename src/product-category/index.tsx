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
      firstCount: 0,
      secondCount: 0,
      thirdCount: 3,
      productCategoryList: []
    };
  }
  componentDidMount() {
    this.getGoodsCates();
  }
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
  getGoodsCates = () => {
    webapi.getGoodsCates().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.init(res.context);
      }
    });
  };
  init(cates) {
    // const firstCount = cates.reduce((obj,item)=>{
    //   debugger
    //   if (!obj[item]) {
    //     obj[item] = 0;
    //   }
    //   obj[item]++;
    //   return obj;
    // });
    // const firstCount = cates.count((f) => f.get('cateGrade') == 1);
    // const secondCount = cates.count((f) => f.get('cateGrade') == 2);
    // const thirdCount = cates.count((f) => f.get('cateGrade') == 3);
    // 改变数据形态，变为层级结构

    const newDataList = cates
      .filter((item) => item.cateParentId == 0)
      .map((data) => {
        const children = cates
          .filter((item) => item.cateParentId == data.cateId)
          .map((childrenData) => {
            const lastChildren = cates
              .filter((item) => item.cateParentId == childrenData.cateId)
              .sort((c1, c2) => {
                return c1.sort - c2.sort;
              });
            if (lastChildren.length > 0) {
              childrenData.children = lastChildren;
            }
            return childrenData;
          })
          .sort((c1, c2) => {
            return c1.sort - c2.sort;
          });
        if (children.length > 0) {
          data.children = children;
        }
        return data;
      })
      .sort((c1, c2) => {
        return c1.sort - c2.sort;
      });
    this.setState({
      // firstCount,
      // secondCount,
      // thirdCount,
      productCategoryList: newDataList
    });
  }

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
