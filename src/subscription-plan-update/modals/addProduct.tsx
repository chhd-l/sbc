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
    this.state = {
      visible: false,
      selectedRowKeys: [],

      brandList: [],
      serchForm: {},
      productCategories: [],

      loading: false,
      skuProducts: [],
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

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visible, selectedRowKeys } = nextProps;

    if (visible !== prevState.visible) {
      return {
        visible: visible,
        selectedRowKeys: selectedRowKeys
      };
    }

    return null;
  }

  componentDidMount() {
    webapi
      .getBrandList()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            brandList: res.context
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });

    webapi
      .getProductCategoryList()
      .then((data) => {
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
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
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
    let params = Object.assign(serchForm, {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    });
    this.setState({
      loading: true
    });
    webapi
      .getSkuProducts(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.goodsInfos.total;
          res.context.goodsInfos.content.map((item) => {
            item.key = item.goodsInfoId;
          });
          this.setState({
            skuProducts: res.context.goodsInfos.content,
            pagination: pagination,
            loading: false
          });
        } else {
          message.error(res.message || 'Get Data Failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Get Data Failed');
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
    this.setState({selectedRowKeys });
  }

  handleOk() {
    this.props.updateTable(this.state.selectedRowKeys);
  }
  handleCancel() {
    this.props.updateTable();
  }
  render() {
    const { visible, loading, brandList, productCategories, skuProducts, selectedRowKeys } = this.state;
    const columns = [
      {
        title: 'Image',
        dataIndex: 'goodsInfoImg',
        key: 'goodsInfoImg',
        render: (text) => <img src={text} alt="" style={{ width: 20 }} />,
        width: '10%'
      },
      {
        title: 'SKU',
        dataIndex: 'goodsInfoNo',
        key: 'goodsInfoNo',
        width: '15%'
      },
      {
        title: 'Product name',
        dataIndex: 'goodsInfoName',
        key: 'goodsInfoName',
        width: '20%'
      },
      {
        title: 'Specification',
        dataIndex: 'specName',
        key: 'specName',
        width: '15%'
      },
      {
        title: 'Product category',
        dataIndex: 'goodsCateName',
        key: 'goodsCateName',
        width: '15%'
      },
      {
        title: 'Brand',
        dataIndex: 'brandName',
        key: 'brandName',
        width: '15%'
      },
      {
        title: 'Price',
        dataIndex: 'marketPrice',
        key: 'marketPrice',
        width: '10%'
      }
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <div>
        <Modal className="addTargetProductModal" width="1100px" maskClosable={false} title="Add products" visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} okText="Confirm" cancelText="Cancel">
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={
                      <p className="formLable">
                        <FormattedMessage id="product.SKU" />
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
                        <FormattedMessage id="product.productName" />
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
                          <FormattedMessage id="product.brand" />
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
                      label={<p className="formLable">Product category</p>}
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
                      <FormattedMessage id="product.search" />
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
            loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
            onChange={this.handleTableChange}
          />
        </Modal>
      </div>
    );
  }
}
