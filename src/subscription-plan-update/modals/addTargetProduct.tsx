import React, { Component } from 'react';
import { Modal, Form, Input, Button, Select, Tree, Row, Col, TreeSelect, message } from 'antd';
import { noop, SelectGroup, TreeSelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = Tree.TreeNode;

export default class addTargetProduct extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      brandList: [],
      serchForm: {},
      productCategories: []
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onFormFieldChange = this.onFormFieldChange.bind(this);
    this.searchProducts = this.searchProducts.bind(this);
    this.getProductCategoryNodes = this.getProductCategoryNodes.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visible } = nextProps;

    if (visible !== prevState.visible) {
      return {
        visible: visible
      };
    }

    return null;
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
            <TreeNode key={item.cateId} value={item.cateId} title={item.cateName} disabled={true}>
              {this.getProductCategoryNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.cateId} value={item.cateId} title={item.cateName} />;
      })
    );
  }

  searchProducts() {}

  handleOk() {
    this.setState({
      visible: false
    });
  }
  handleCancel() {
    this.setState({
      visible: false
    });
  }
  render() {
    const { visible, brandList, productCategories } = this.state;
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
                      this.onFormFieldChange('likeGoodsNo', e.target.value);
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
                      this.onFormFieldChange('likeGoodsName', e.target.value);
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
                      showSearch
                      optionFilterProp="children"
                      onChange={(value) => {
                        this.onFormFieldChange('brandId', value);
                      }}
                    >
                      {brandList.map((v, i) => {
                        return (
                          <Option key={i} value={v.get('brandId') + ''}>
                            {v.get('nickName')}
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
                      this.searchProducts();
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
        </Modal>
      </div>
    );
  }
}
