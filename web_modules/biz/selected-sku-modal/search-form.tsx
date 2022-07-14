import * as React from 'react';
import { fromJS } from 'immutable';

import { Form, Input, Select, Button, Tree } from 'antd';
import { TreeSelectGroup, SelectGroup, RCi18n, cache } from 'qmkit';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

enum LIKE_TYPE {
  LIKE_GOODS_NO = 'likeGoodsNo',
  LIKE_GOODS_INFO_NO = 'likeGoodsInfoNo'
}

export default class SearchForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      cates: [],
      brands: [],
      searchParams: {
        brandId: 0,
        cateId: 0,
        likeValue: '',
        likeGoodsName: ''
      },
      cateIdDisabled: false,
      likeType: LIKE_TYPE.LIKE_GOODS_INFO_NO
    };
  }

  componentDidMount() {
    const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || '';
    const { searchParams } = this.state;
    const { isSubsrciptionEdit } = this.props;

    if (
      (storeId === 123457909 || storeId === 123457907 || storeId === 123457911) &&
      isSubsrciptionEdit
    ) {
      this.setState(
        {
          ...searchParams,
          promotions: 'club',
          subscriptionStatus: 1
        },
        () => {
          this.init();
        }
      );
    } else {
      this.init();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        searchParams: {
          brandId: 0,
          cateId: 0,
          likeValue: '',
          likeGoodsName: ''
          // promotions: 'club',
          // subscriptionStatus: 1
        }
      });
    }
  }

  //分类循环方法  使用tree-select组件,把扁平化数据转换成适应TreeSelect的数据
  loop = (oldCateList, cateList, parentCateId) => {
    const { pageType } = this.props;
    return cateList
      .toSeq()
      .filter((cate) => cate.get('cateParentId') === parentCateId)
      .map((item) => {
        const childCates = oldCateList.filter(
          (cate) => cate.get('cateParentId') == item.get('cateId')
        );
        if (childCates && childCates.count()) {
          return (
            <TreeNode
              key={item.get('cateId').toString()}
              value={item.get('cateId').toString()}
              title={item.get('cateName').toString()}
              disabled={['addProduct'].includes(pageType) && ['Leaflet', 'Leaflets', 'Commercial Leaflet'].includes(item.get('cateName').toString())}
            >
              {this.loop(oldCateList, childCates, item.get('cateId'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId').toString()}
            value={item.get('cateId').toString()}
            title={item.get('cateName').toString()}
            disabled={['addProduct'].includes(pageType) && ['Leaflet', 'Leaflets', 'Commercial Leaflet'].includes(item.get('cateName').toString())}
          />
        );
      });
  }

  render() {
    const { searchParams } = this.state;
    const { cates, brands, cateIdDisabled } = this.state;
    const { isSubsrciptionEdit } = this.props;
    const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || '';

    return (
      <div id="modal-head">
        <Form className="filter-content" layout="inline">
          <FormItem>
            <div style={{ marginBottom: 16 }}>
              <Input
                addonBefore={this.goodsOptionSelect()}
                value={searchParams.likeValue}
                onChange={(e) => this.paramsOnChange('likeValue', e.target.value)}
              />
            </div>
          </FormItem>

          <FormItem>
            <Input
              addonBefore={RCi18n({ id: 'Product.ProductName' })}
              value={searchParams.likeGoodsName}
              onChange={(e) => this.paramsOnChange('likeGoodsName', e.target.value)}
            />
          </FormItem>

          <FormItem>
            <TreeSelectGroup
              getPopupContainer={() => document.getElementById('modal-head')}
              label={RCi18n({ id: 'Product.Productcategory' })}
              dropdownStyle={{ zIndex: 1053 }}
              onChange={(value) => this.paramsOnChange('cateId', value)}
              value={searchParams.cateId.toString()}
              disabled={cateIdDisabled}
            >
              <TreeNode key="0" value="0" title="All">
                {this.loop(fromJS(cates), fromJS(cates), 0)}
              </TreeNode>
            </TreeSelectGroup>
          </FormItem>

          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('modal-head')}
              label={RCi18n({ id: 'Product.Brand' })}
              dropdownStyle={{ zIndex: 1053 }}
              onChange={(val) => this.paramsOnChange('brandId', val)}
              value={searchParams.brandId.toString()}
            >
              <Option key="0" value="0">
                All
              </Option>
              {brands.map((v) => (
                <Option key={v.brandId} value={v.brandId + ''}>
                  {v.brandName}
                </Option>
              ))}
            </SelectGroup>
          </FormItem>
          {/* 法国、俄罗斯、土耳其需要subscriptionStatus和subscriptionType筛选条件 */}
          {(storeId == 123457909 || storeId == 123457907 || storeId == 123457911) &&
            isSubsrciptionEdit ? (
            <>
              <FormItem>
                <SelectGroup
                  getPopupContainer={() => document.getElementById('modal-head')}
                  label={<FormattedMessage id="product.subscriptionStatus" />}
                  dropdownStyle={{ zIndex: 1053 }}
                  onChange={(val) => this.paramsOnChange('subscriptionStatus', val)}
                  value={searchParams?.subscriptionStatus === 0 ? 0 : 1}
                >
                  <Option value={1}>
                    <FormattedMessage id="Product.Y" />
                  </Option>
                  <Option value={0}>
                    <FormattedMessage id="Product.N" />
                  </Option>
                </SelectGroup>
              </FormItem>
              <FormItem>
                <SelectGroup
                  getPopupContainer={() => document.getElementById('modal-head')}
                  label={RCi18n({ id: 'Product.subscriptionType' })}
                  dropdownStyle={{ zIndex: 1053 }}
                  onChange={(val) => this.paramsOnChange('promotions', val)}
                  value={
                    searchParams?.promotions?.toString()
                      ? searchParams?.promotions?.toString()
                      : 'club'
                  }
                >
                  <Option value="autoship">
                    <FormattedMessage id="Product.Auto ship" />
                  </Option>
                  <Option value="club">
                    <FormattedMessage id="Product.Club" />
                  </Option>
                </SelectGroup>
              </FormItem>
            </>
          ) : null}

          <FormItem>
            <Button
              style={{ marginTop: '6px' }}
              type="primary"
              icon="search"
              shape="round"
              htmlType="submit"
              onClick={(e) => {
                e.preventDefault();
                this.searchBackFun();
              }}
            >
              {RCi18n({ id: 'Product.Search' })}
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }

  init = async () => {
    const { goodsCate } = this.props;
    const fetchBrand = await webapi.fetchBrandList();
    const fetchCates = await webapi.fetchCateList();

    const { res: brandsRes } = fetchBrand as any;
    const { context: brands } = brandsRes;
    const { res: catesRes } = fetchCates as any;
    const { context: cates } = catesRes;

    let defaultGoodsCategoryId = 0,
      isGoodsCategoryDisabled = false;
    if (goodsCate) {
      defaultGoodsCategoryId =
        (cates.find((ca) => (ca.cateName || '').toLowerCase() === goodsCate) ?? {})['cateId'] ?? 0;
      isGoodsCategoryDisabled = !!defaultGoodsCategoryId;
    }

    this.setState(
      {
        brands: brands,
        cates: cates,
        searchParams: {
          ...this.state.searchParams,
          cateId: defaultGoodsCategoryId
        },
        cateIdDisabled: isGoodsCategoryDisabled
      },
      () => {
        if (defaultGoodsCategoryId) {
          this.searchBackFun();
        }
      }
    );
  };

  paramsOnChange = (key, value) => {
    let { searchParams } = this.state;
    searchParams[key] = value;
    this.setState({ searchParams: searchParams });
  };

  searchBackFun = () => {
    const { searchParams, likeType } = this.state;
    let { likeValue, ...rest } = searchParams;
    rest[
      likeType == LIKE_TYPE.LIKE_GOODS_INFO_NO
        ? LIKE_TYPE.LIKE_GOODS_INFO_NO
        : LIKE_TYPE.LIKE_GOODS_NO
    ] = likeValue;
    this.props.searchBackFun(rest);
  };

  goodsOptionSelect = () => (
    <Select
      value={this.state.likeType}
      style={{ width: 100 }}
      onChange={(val) => {
        this.setState({ likeType: val });
      }}
      getPopupContainer={() => document.getElementById('modal-head')}
    >
      <Option value={LIKE_TYPE.LIKE_GOODS_NO} title={RCi18n({ id: 'Order.spuCode' })}>
        {RCi18n({ id: 'Order.spuCode' })}
      </Option>
      <Option value={LIKE_TYPE.LIKE_GOODS_INFO_NO} title={RCi18n({ id: 'Product.SKUCode' })}>
        {RCi18n({ id: 'Product.SKUCode' })}
      </Option>
    </Select>
  );
}
