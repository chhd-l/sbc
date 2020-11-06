import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Button, Select, Tree, Row, Col, TreeSelect, message } from 'antd';
import { noop, SelectGroup, TreeSelectGroup } from 'qmkit';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { fromJS, Map } from 'immutable';

const SelectBox = styled.div`
  .ant-select-dropdown-menu-item,
  .ant-select-selection-selected-value {
    max-width: 142px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = Tree.TreeNode;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      likeGoodsName: string;
      likeGoodsInfoNo: string;
      likeGoodsNo: string;
      storeCateId: string;
      brandId: string;
      addedFlag: string;
      likeProductCategory: string;
      onSearch: Function;
      onEditSkuNo: Function;
      onFormFieldChange: Function;
      brandList: IList;
      cateList: IList;
      sourceCateList: IList;
    };
  };

  static relaxProps = {
    // 模糊条件-商品名称
    likeGoodsName: 'likeGoodsName',
    // 模糊条件-SKU编码
    likeGoodsInfoNo: 'likeGoodsInfoNo',
    // 模糊条件-SPU编码
    likeGoodsNo: 'likeGoodsNo',
    // 商品分类
    storeCateId: 'storeCateId',
    // 品牌编号
    likeProductCategory: 'likeProductCategory',
    brandId: 'brandId',
    onSearch: noop,
    onFormFieldChange: noop,
    onEditSkuNo: noop,
    //品牌列表
    brandList: 'brandList',
    //分类列表
    cateList: 'cateList',
    sourceCateList: 'sourceCateList'
  };

  searchBackFun = () => {
    const { likeGoodsName, likeGoodsNo, storeCateId } = this.props.relaxProps;
    console.log(storeCateId, 222222222);
    let from = {
      goodsName: likeGoodsName,
      goodsNo: likeGoodsNo,
      storeCateId: storeCateId
    };
    console.log(from, 111);

    this.props.searchBackFun(from);
  };

  render() {
    const { likeGoodsName, likeProductCategory, likeGoodsNo, sourceCateList, onFormFieldChange, brandList, cateList, onEditSkuNo } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };

    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')}>
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return <TreeNode key={item.get('storeCateId')} value={item.get('storeCateId')} title={item.get('cateName')} />;
      });

    return (
      <Form className="filter-content" layout="inline">
        <Row>
          <Col span={8}>
            <FormItem>
              <Input
                addonBefore={
                  <p style={styles.label}>
                    <FormattedMessage id="product.productName" />
                  </p>
                }
                value={likeGoodsName}
                style={{ width: 300 }}
                onChange={(e: any) => {
                  onFormFieldChange({
                    key: 'likeGoodsName',
                    value: e.target.value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <Input
                addonBefore={
                  <p style={styles.label}>
                    <FormattedMessage id="product.SPU" />
                  </p>
                }
                value={likeGoodsNo}
                style={{ width: 300 }}
                onChange={(e: any) => {
                  onFormFieldChange({
                    key: 'likeGoodsNo',
                    value: e.target.value
                  });
                }}
              />
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem {...formItemLayout} label={<FormattedMessage id="product.platformCategory" />}>
              {getFieldDecorator('cateId', {
                rules: [
                  {
                    required: true,
                    message: 'Please select platform product category'
                  },
                  {
                    validator: (_rule, value, callback) => {
                      if (!value) {
                        callback();
                        return;
                      }

                      let overLen = false;
                      sourceCateList.forEach((val) => {
                        if (val.get('cateParentId') + '' == value) overLen = true;
                        return;
                      });

                      if (overLen) {
                        callback(new Error('Please select the last category'));
                        return;
                      }

                      callback();
                    }
                  }
                ],
                onChange: this._editGoods.bind(this, 'cateId'),
                initialValue: goods.get('cateId') && goods.get('cateId') != '' ? goods.get('cateId') : undefined
              })(
                <TreeSelect
                  getPopupContainer={() => document.getElementById('page-content')}
                  placeholder="Please select category"
                  notFoundContent="No classification"
                  // disabled={cateDisabled}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeDefaultExpandAll
                >
                  {loop(cateList)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <Input
                addonBefore={<p style={styles.label}>Product category</p>}
                value={likeProductCategory}
                style={{ width: 300 }}
                onChange={(e: any) => {
                  onFormFieldChange({
                    key: 'likeProductCategory',
                    value: e.target.value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <SelectBox>
                <SelectGroup
                  getPopupContainer={() => document.getElementById('page-content')}
                  style={styles.wrapper}
                  label={
                    <p style={styles.label}>
                      <FormattedMessage id="product.brand" />
                    </p>
                  }
                  defaultValue="All"
                  showSearch
                  optionFilterProp="children"
                  onChange={(value) => {
                    onFormFieldChange({ key: 'brandId', value });
                  }}
                >
                  <Option key="-1" value="-1">
                    <FormattedMessage id="all" />
                  </Option>
                  {brandList.map((v, i) => {
                    return (
                      <Option key={i} value={v.get('brandId') + ''}>
                        {v.get('nickName')}
                      </Option>
                    );
                  })}
                </SelectGroup>
              </SelectBox>
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
                  this.searchBackFun();
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
    );
  }
}

const styles = {
  label: {
    width: 100,
    textAlign: 'center'
  },
  wrapper: {
    width: 177
  }
} as any;
