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
      productCategoryList: [],
      selectedRowKeys: [],
      attributeList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }
  componentDidMount() {
    this.getGoodsCates();
    this.getAttributes();
  }
  removeChildrenIsNull = (objArr) => {
    let tempString = JSON.stringify(objArr);
    let returnString = tempString.replaceAll(',"children":[]', '');
    return JSON.parse(returnString);
  };
  openBindAttribute = (id) => {
    this.getSelectedListById(id);
  };
  handleOk = () => {
    console.log('ok');
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  getAttributes = () => {
    const { pagination } = this.state;
    let params = {
      attributeStatus: true,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    };
    webapi
      .getAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          const attributeList = res.context.attributesList;
          this.setState({ attributeList, pagination });
        } else {
          message.error(res.message || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
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
      productCategoryList: newDataList
    });
  }

  start = () => {
    this.setState({
      selectedRowKeys: []
    });
  };
  onSelectChange = (selectedRowKeys, selectedRows) => {
    debugger;
    this.setState({ selectedRowKeys });
  };

  getSelectedListById = (id) => {
    webapi.getSelectedListById(id).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let selectedRows = res.context;
        let selectedRowKeys = [];
        for (let i = 0; i < selectedRows.length; i++) {
          selectedRowKeys.push(selectedRows[i].id);
        }
        this.setState({
          selectedRowKeys,
          visible: true
        });
      }
    });
  };
  relationAttributes = () => {
    let params = {};
    webapi.relationAttributes(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        console.log(res);
      }
    });
  };

  render() {
    const { title, productCategoryList, selectedRowKeys, attributeList } = this.state;
    const columns = [
      {
        title: 'Category name',
        dataIndex: 'cateName',
        key: 'cateName'
      },
      {
        title: 'Category images',
        dataIndex: 'cateImg',
        key: 'cateImg',
        render: (text) => <div>{text ? <img src={text} alt="" style={{ width: 30 }} /> : '-'}</div>
      },
      {
        title: 'Operation',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <div>
            {record.cateGrade === 3 ? (
              <Tooltip placement="top" title="Bind attribute">
                <a style={styles.edit} className="iconfont iconbtn-addsubvisionsaddcategory" onClick={() => this.openBindAttribute(record.cateId)}></a>
              </Tooltip>
            ) : (
              '-'
            )}
          </div>
        )
      }
    ];
    const columns_attribute = [
      {
        title: 'Attribute name',
        dataIndex: 'attributeName',
        key: 'attributeName'
      }
    ];
    const description = (
      <div>
        <p>Product category is set by RC staff, you can associate attribute to product category.</p>
      </div>
    );

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <Alert message={description} type="info" />

          <Table rowKey="cateId" columns={columns} dataSource={this.removeChildrenIsNull(productCategoryList)} />
        </div>
        <Modal title="Bind attribute" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={this.start} disabled={!hasSelected}>
                Reload
              </Button>
              <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
            </div>
            <Table rowKey="id" rowSelection={rowSelection} columns={columns_attribute} dataSource={attributeList} />
          </div>
        </Modal>
      </div>
    );
  }
}
const styles = {} as any;

export default Form.create()(PeoductCategory);
