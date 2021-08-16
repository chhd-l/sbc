import React, { Component } from 'react';
import { Modal, Form, Input, Button, Select, Tree, Row, Col, TreeSelect, message, Table } from 'antd';
import { noop, SelectGroup, TreeSelectGroup, util, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';

const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = Tree.TreeNode;

export default class addTargetProduct extends Component<any, any> {
  constructor(props) {
    super(props);
    const defaultSelectedKeys = (this.props.selectedRowKeys || []).map((row) => row.goodsInfoId);
    this.state = {
      visible: false,
      selectedRowKeys: defaultSelectedKeys,

      brandList: [],
      serchForm: {},
      productCategories: [],

      loading: false,
      skuProducts: [],
      clearExsit: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onFormFieldChange = this.onFormFieldChange.bind(this);
    this.getProductCategoryNodes = this.getProductCategoryNodes.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.getSkuProductList = this.getSkuProductList.bind(this);
  }

  componentDidMount() {
    webapi.getBrandList().then((data) => {
      const res = data.res;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          brandList: res.context
        });
      }
    });

    webapi.getProductCategoryList().then((data) => {
      const res = data.res;
      if (res.code === Const.SUCCESS_CODE) {
        let newCategoryList = res.context.map((item) => {
          return {
            id: item.cateId,
            parentId: item.cateParentId === 0 ? null : item.cateParentId,
            cateName: item.cateName
          };
        });
        let treeData = util.setChildrenData(newCategoryList);
        this.setState({
          productCategories: treeData
        });
      }
    });

    this.getSkuProductList();
  }

  handleTableChange(pagination: any) {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getSkuProductList()
    );
  }
  onSearch() {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      () => this.getSkuProductList()
    );
  }
  getSkuProductList() {
    const { serchForm, pagination } = this.state;
    const { exsit } = this.props;
    let params = Object.assign(serchForm, {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize,
      selectedGoodIds: exsit && exsit.length ? exsit.map((item) => item.goodsInfoId) : [],
      filterStock: true
    });
    this.setState({
      loading: true
    });
    webapi
      .getSkuProducts(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let total = res.context.goodsInfos.total;
          let productData = res.context.goodsInfos.content;
          pagination.total = total;
          productData.map((item) => {
            item.key = item.goodsInfoId;
          });
          this.setState({
            skuProducts: productData,
            pagination: pagination,
            loading: false
          });
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  }

  onFormFieldChange(key, value) {
    let data = this.state.serchForm;
    data[key] = value;
    this.setState({
      serchForm: data
    });
  }

  getProductCategoryNodes(productCategories) {
    return (
      productCategories &&
      productCategories.length > 0 &&
      productCategories.map((item) => {
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode key={item.id} value={item.id} title={item.cateName} disabled={true}>
              {this.getProductCategoryNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} value={item.id} title={item.cateName} />;
      })
    );
  }

  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  handleOk() {
    const { skuProducts, selectedRowKeys } = this.state;
    this.props.updateTable(skuProducts.filter((p) => selectedRowKeys.includes(p.goodsInfoId)));
  }
  handleCancel() {
    this.props.updateTable();
  }
  render() {
    const { loading, brandList, productCategories, skuProducts, selectedRowKeys, clearExsit } = this.state;
    const { visible } = this.props;
    const columns = [
      {
        title: <FormattedMessage id="Subscription.Image"/>,
        dataIndex: 'goodsInfoImg',
        key: 'goodsInfoImg',
        render: (text) => <img src={text} alt="" style={{ width: 20 }} />,
        width: '10%'
      },
      {
        title: <FormattedMessage id="Subscription.SKU"/>,
        dataIndex: 'goodsInfoNo',
        key: 'goodsInfoNo',
        width: '15%'
      },
      {
        title: <FormattedMessage id="Subscription.ProductName"/>,
        dataIndex: 'goodsInfoName',
        key: 'goodsInfoName',
        width: '20%'
      },
      {
        title: <FormattedMessage id="Subscription.Specification"/>,
        dataIndex: 'specName',
        key: 'specName',
        width: '15%'
      },
      {
        title: <FormattedMessage id="Subscription.ProductCategory"/>,
        dataIndex: 'goodsCateName',
        key: 'goodsCateName',
        width: '15%'
      },
      {
        title: <FormattedMessage id="Subscription.Brand"/>,
        dataIndex: 'brandName',
        key: 'brandName',
        width: '15%'
      },
      {
        title: <FormattedMessage id="Subscription.Price"/>,
        dataIndex: 'marketPrice',
        key: 'marketPrice',
        width: '10%'
      }
    ];
    const rowSelection = {
      columnTitle: ' ', // hide all check
      getCheckboxProps: (record) => ({
        disabled: selectedRowKeys && selectedRowKeys.length >= 1 && record.goodsInfoId !== selectedRowKeys[0],
        name: record.name
      }),
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <div>
        <Modal className="addTargetProductModal" width="1100px" maskClosable={false} title={<FormattedMessage id="Subscription.AddProducts"/>} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} okText={<FormattedMessage id="Subscription.Confirm"/>} cancelText={<FormattedMessage id="Subscription.Cancel"/>}>
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={
                      <p className="formLable">
                        <FormattedMessage id="Subscription.SKU" />
                      </p>
                    }
                    style={{ width: 300 }}
                    onChange={(e: any) => {
                      this.onFormFieldChange('goodsInfoNo', e.target.value);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={
                      <p className="formLable">
                        <FormattedMessage id="Subscription.productName" />
                      </p>
                    }
                    style={{ width: 300 }}
                    onChange={(e: any) => {
                      this.onFormFieldChange('goodsName', e.target.value);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  {
                    <SelectGroup
                      allowClear
                      getPopupContainer={() => document.getElementById('page-content')}
                      label={
                        <p className="formLable">
                          <FormattedMessage id="Subscription.brand" />
                        </p>
                      }
                      defaultValue="All"
                      style={{ width: '177px' }}
                      showSearch
                      optionFilterProp="children"
                      onChange={(value) => {
                        this.onFormFieldChange('brandId', value);
                      }}
                    >
                      {brandList.map((item, index) => {
                        return (
                          <Option key={index} value={item.brandId + ''}>
                            {item.nickName}
                          </Option>
                        );
                      })}
                    </SelectGroup>
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  {
                    <TreeSelectGroup
                      allowClear
                      getPopupContainer={() => document.getElementById('page-content')}
                      label={<p className="formLable"><FormattedMessage id="Subscription.ProductCategory"/></p>}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeDefaultExpandAll
                      onChange={(value) => {
                        this.onFormFieldChange('goodsCateId', value);
                      }}
                    >
                      {this.getProductCategoryNodes(productCategories)}
                    </TreeSelectGroup>
                  }
                </FormItem>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon="search"
                    shape="round"
                    onClick={(e) => {
                      e.preventDefault();
                      this.onSearch();
                    }}
                  >
                    <span>
                      <FormattedMessage id="Subscription.search" />
                    </span>
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={skuProducts}
            pagination={this.state.pagination}
            loading={loading}
            onChange={this.handleTableChange}
          />
        </Modal>
      </div>
    );
  }
}
