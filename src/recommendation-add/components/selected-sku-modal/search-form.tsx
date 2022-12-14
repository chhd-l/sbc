import * as React from 'react';
import { fromJS } from 'immutable';

import { Form, Input, Select, Button, Tree } from 'antd';
import { TreeSelectGroup, SelectGroup, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';

import * as webapi from './webapi';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

enum LIKE_TYPE {
  LIKE_GOODS_NO = 'likeGoodsNo',
  LIKE_GOODS_INFO_NO = 'goodsSku'
}

export default class SearchForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      cates: [],
      brands: [],
      searchParams: {
        brandId: undefined,
        cateId: undefined,
        likeValue: undefined,
        goodsName: undefined
      },
      likeType: LIKE_TYPE.LIKE_GOODS_INFO_NO
    };
  }

  componentDidMount() {
   // this.init();
  }

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        searchParams: {
          brandId: 0,
          cateId: 0,
          likeValue: '',
          goodsName: ''
        }
      });
    }
  }

  //分类循环方法  使用tree-select组件,把扁平化数据转换成适应TreeSelect的数据
  loop = (oldCateList, cateList, parentCateId) =>
    cateList
      .toSeq()
      .filter((cate) => cate.get('cateParentId') === parentCateId)
      .map((item) => {
        const childCates = oldCateList.filter((cate) => cate.get('cateParentId') == item.get('cateId'));
        if (childCates && childCates.count()) {
          return (
            <TreeNode key={item.get('cateId').toString()} value={item.get('cateId').toString()} title={item.get('cateName').toString()}>
              {this.loop(oldCateList, childCates, item.get('cateId'))}
            </TreeNode>
          );
        }
        return <TreeNode key={item.get('cateId').toString()} value={item.get('cateId').toString()} title={item.get('cateName').toString()} />;
      });

  render() {
    const { searchParams } = this.state;
    const { cates, brands } = this.state;

    return (
      <div id="modal-head">
        <Form className="filter-content" layout="inline">
          <FormItem>
            <div style={{ marginBottom: 16 }}>
              <Input addonBefore={this.goodsOptionSelect()} value={searchParams.likeValue} onChange={(e) => this.paramsOnChange('likeValue', e.target.value)} />
            </div>
          </FormItem>

          <FormItem>
            <Input addonBefore={RCi18n({id:'Product.Productname'})} value={searchParams.goodsName} onChange={(e) => this.paramsOnChange('goodsName', e.target.value)} />
          </FormItem>

          {/* <FormItem>
            <TreeSelectGroup getPopupContainer={() => document.getElementById('modal-head')} label="Product category" dropdownStyle={{ zIndex: 1053 }} onChange={(value) => this.paramsOnChange('cateId', value)} value={searchParams.cateId.toString()}>
              <TreeNode key="0" value="0" title="All">
                {this.loop(fromJS(cates), fromJS(cates), 0)}
              </TreeNode>
            </TreeSelectGroup>
          </FormItem>

          <FormItem>
            <SelectGroup getPopupContainer={() => document.getElementById('modal-head')} label="Brand" dropdownStyle={{ zIndex: 1053 }} onChange={(val) => this.paramsOnChange('brandId', val)} value={searchParams.brandId.toString()}>
              <Option key="0" value="0">
                All
              </Option>
              {brands.map((v) => (
                <Option key={v.brandId} value={v.brandId + ''}>
                  {v.brandName}
                </Option>
              ))}
            </SelectGroup>
          </FormItem> */}

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
              <FormattedMessage id="Product.Search"/>
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }

  init = async () => {
    const fetchBrand = await webapi.fetchBrandList();
    const fetchCates = await webapi.fetchCateList();

    const { res: brandsRes } = fetchBrand as any;
    const { context: brands } = brandsRes;
    const { res: catesRes } = fetchCates as any;
    const { context: cates } = catesRes;

    this.setState({ brands: brands, cates: cates });
  };

  paramsOnChange = (key, value) => {
    let { searchParams } = this.state;
    searchParams[key] = value.replace(/^\s+|\s+$/g,"")||undefined;
    this.setState({ searchParams: searchParams });
  };

  searchBackFun = () => {
    const { searchParams, likeType } = this.state;
    let { likeValue, ...rest } = searchParams;
    rest[likeType == LIKE_TYPE.LIKE_GOODS_INFO_NO ? LIKE_TYPE.LIKE_GOODS_INFO_NO : LIKE_TYPE.LIKE_GOODS_NO] = likeValue;
    
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
      {/* <Option value={LIKE_TYPE.LIKE_GOODS_NO}>SPU Code</Option> */}
      <Option value={LIKE_TYPE.LIKE_GOODS_INFO_NO} title={RCi18n({id:'Product.SKU'})}>{RCi18n({id:'Product.SKU'})}</Option>
    </Select>
  );
}
