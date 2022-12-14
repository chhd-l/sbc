import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, Button, Table, Tree } from 'antd';
import { DataGrid, SelectGroup, TreeSelectGroup, QMMethod, Const } from 'qmkit';
import * as webapi from '../webapi';
import { fromJS, Set } from 'immutable';
import { FormattedMessage } from 'react-intl';

import Store from '../store';
import { cache } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;
const TreeNode = Tree.TreeNode;

const goodsOptionSelect = (
  <Select style={{ width: 100 }} getPopupContainer={() => document.getElementById('modal-head')}>
    <Option value="0">
      <FormattedMessage id="Order.spuCode" />
    </Option>
    <Option value="1">
      <FormattedMessage id="Order.skuCode" />
    </Option>
  </Select>
);

class SearchForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
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
    const params = fromJS(this.props.searchParam) as any;
    const likeGoodsNo = params.get('noType') === '0' ? params.get('likeGoodsNo') : params.get('likeGoodsInfoNo');
    const { getFieldDecorator } = this.props.form;
    const { cates, brands } = this.props;

    return (
      <div id="modal-head">
        <Form className="filter-content" layout="inline">
          <FormItem>
            <div style={{ marginBottom: 16 }}>
              {getFieldDecorator('likeGoodsNo', {
                initialValue: likeGoodsNo
              })(
                <Input
                  addonBefore={getFieldDecorator('noType', {
                    initialValue: params.get('noType')
                  })(goodsOptionSelect)}
                />
              )}
            </div>
          </FormItem>

          <FormItem>
            {getFieldDecorator('likeGoodsName', {
              initialValue: params.get('likeGoodsName')
            })(<Input addonBefore={<FormattedMessage id="Order.productName" />} />)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('cateId', {
              initialValue: params.get('cateId').toString()
            })(
              <TreeSelectGroup getPopupContainer={() => document.getElementById('modal-head')} dropdownStyle={{ zIndex: 1053 }} label={<FormattedMessage id="catogery" />}>
                <TreeNode key="0" value="0" title={<FormattedMessage id="all" />}>
                  {this.loop(fromJS(cates), fromJS(cates), 0)}
                </TreeNode>
              </TreeSelectGroup>
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('brandId', {
              initialValue: params.get('brandId').toString()
            })(
              <FormattedMessage id="Order.brand">
                {(txt) => (
                  <SelectGroup getPopupContainer={() => document.getElementById('modal-head')} label={txt.toString()} dropdownStyle={{ zIndex: 1053 }}>
                    <Option key="0" value="0">
                      <FormattedMessage id="Order.all" />
                    </Option>
                    {brands.map((v) => (
                      <Option key={v.brandId} value={v.brandId + ''}>
                        {v.brandName}
                      </Option>
                    ))}
                  </SelectGroup>
                )}
              </FormattedMessage>
            )}
          </FormItem>

          <Button
            type="primary"
            icon="search"
            shape="round"
            htmlType="submit"
            onClick={(e) => {
              e.preventDefault();
              const values = this.props.form.getFieldsValue();
              const params = {};
              for (let key in values) {
                if (values[key]) {
                  params[key] = values[key];
                }
              }
              this.props.onSearch(params);
            }}
          >
            <span>
              <FormattedMessage id="Order.search" />
            </span>
          </Button>
        </Form>
      </div>
    );
  }
}

/**
 * 商品添加
 */
export default class GoodsAdd extends React.Component<any, any> {
  checked: { goodsId?: Array<Object> };

  _store: Store;

  static defaultProps = {
    selectedCustomerId: '',
    //选中的商品Id 格式:'add_' + goodsInfoId
    selectedKeys: fromJS([]),
    //选中的商品信息
    selectedRows: fromJS([]),
    //已选的商品的价格区间
    intervals: fromJS([])
  };

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this.state = {
      loading: true,
      selectedRows: props.selectedRows,
      selectedRowKeys: props.selectedKeys.toJS(),
      total: 0,
      //查询sku返回的数据
      res: {
        //列表展示的spu
        spus: [],
        //列表展示的sku
        skus: [],
        //列表展示的品牌
        _brands: [],
        //列表展示的分类
        _cates: []
      },
      //选中的区间价格
      intervals: fromJS([]),
      //全部价格区间
      allIntervals: fromJS([]),
      //搜索项中的分类
      cates: [],
      //搜索项中的品牌
      brands: [],
      //每页多少条数据
      pageSize: 10,
      //当前页
      pageNum: 0,
      searchParam: {
        //搜索参数
        //编码类型 0:spu编码 1:SKU编码
        noType: '0',
        //SKU编码
        likeGoodsInfoNo: '',
        //SPU编码
        likeGoodsNo: '',
        //商品名称
        likeGoodsName: '',
        //分类Id
        cateId: 0,
        //品牌Id
        brandId: 0
      }
    };
    this._store = ctx['_plume$Store'];
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      selectedRows: nextProps.selectedRows,
      selectedRowKeys: nextProps.selectedKeys.toJS()
    });
  }

  componentDidMount() {
    this.init();
  }

  render() {
    const { loading, total } = this.state;
    const { skus, spus, _brands, _cates } = this.state.res;
    const Search = React.createElement(Form.create({})(SearchForm), {
      cates: this.state.cates,
      brands: this.state.brands,
      onSearch: this._handleSearch,
      clearSelected: this._clearSelected,
      searchParam: this.state.searchParam
    } as any);

    return (
      <div className="content">
        {/*search*/}
        {Search}

        <DataGrid
          loading={loading}
          rowKey={(record) => 'add_' + record.goodsInfoId}
          dataSource={skus}
          pagination={{
            total,
            current: this.state.pageNum + 1,
            pageSize: this.state.pageSize,
            onChange: (pageNum, pageSize) => {
              const param = {
                pageNum: --pageNum,
                pageSize: pageSize
              };
              this._pageSearch(param);
            }
          }}
          rowSelection={{
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
              const sRows = fromJS(this.state.selectedRows).filter((f) => f);
              let rows = (sRows.isEmpty() ? Set([]) : sRows.toSet()).concat(fromJS(selectedRows).toSet()).toList();
              rows = selectedRowKeys.map((key) => rows.filter((row) => 'add_' + row.get('goodsInfoId') == key).first()).filter((f) => f);
              let intervals = this.state.allIntervals.filter((interval) => selectedRowKeys.findIndex((row) => row == 'add_' + interval.get('goodsInfoId')) >= 0);
              this.setState({
                selectedRows: rows,
                selectedRowKeys,
                intervals
              });
            },
            onSelect: (record, selected) => {
              const goodsInfoId = record.goodsInfoId;
              let oldIntervals = fromJS(this.state.intervals || []);
              if (selected) {
                const selectedIntervals = this.state.allIntervals.filter((i) => i && i.get('goodsInfoId') == goodsInfoId) || fromJS([]);
                oldIntervals = QMMethod.distinct(oldIntervals, selectedIntervals, 'intervalPriceId');
              } else {
                oldIntervals = oldIntervals.filter((i) => i && i.get('goodsInfoId') != goodsInfoId);
              }
              const intervals = this.state.intervals;
              this.setState({
                intervals: oldIntervals.merge(intervals)
              });
            },
            getCheckboxProps: (record) => ({
              //如果validFlag === 0 标识该商品不是有效的商品,可能存在情况是=>无货,起订量大于库存etc..
              //该情况下商品checkbox置灰,禁止选中
              disabled: record.goodsStatus !== 0
            })
          }}
        >
          <Column title={<FormattedMessage id="Order.SKUcode" />} dataIndex="goodsInfoNo" key="goodsInfoNo" width="15%" />

          <Column title={<FormattedMessage id="Order.ProductName" />} dataIndex="goodsInfoName" key="goodsInfoName" width="20%" />

          <Column title={<FormattedMessage id="Order.Weight" />} dataIndex="specText" key="specText" width="20%" />

          <Column
            title={<FormattedMessage id="Order.catogery" />}
            key="goodsCate"
            render={(rowInfo) => {
              const cId = fromJS(spus)
                .find((s) => s.get('goodsId') === rowInfo.goodsId)
                .get('cateId');
              const cate = fromJS(_cates).find((s) => s.get('cateId') === cId);
              return cate ? cate.get('cateName') : '';
            }}
          />

          <Column
            title={<FormattedMessage id="Order.brand" />}
            key="goodsBrand"
            render={(rowInfo) => {
              const bId = fromJS(spus)
                .find((s) => s.get('goodsId') === rowInfo.goodsId)
                .get('brandId');
              if (bId) {
                const brand = fromJS(_brands).find((s) => s.get('brandId') === bId);
                return brand ? brand.get('brandName') : '';
              } else {
                return '';
              }
            }}
          />

          <Column
            title={<FormattedMessage id="Order.Price" />}
            key="marketPrice"
            render={(rowInfo) => {
              const priceType = fromJS(spus)
                .filter((s) => s.get('goodsId') === rowInfo.goodsId)
                .first()
                .get('priceType');
              return priceType === 1 ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + (rowInfo.intervalMinPrice || 0).toFixed(2) + '-' + (rowInfo.intervalMaxPrice || 0).toFixed(2) : sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + (rowInfo.salePrice || 0).toFixed(2);
            }}
          />
        </DataGrid>
      </div>
    );
  }

  _handleSearch = (params) => {
    this.init(params);
  };

  _clearSelected = () => {
    this.setState({
      selectedRowKeys: fromJS([]),
      selectedRows: fromJS([]),
      intervals: fromJS([])
    });
  };

  _pageSearch = ({ pageNum, pageSize }) => {
    const params = this.state.searchParam;
    this.init({ ...params, pageNum, pageSize });
    this.setState({
      pageNum,
      pageSize
    });
  };

  init = async (params = {} as any) => {
    //保存搜索信息
    const { noType, likeGoodsNo, likeGoodsName, cateId, brandId } = params;
    let searchParam = {} as any;
    if (noType === '0') {
      searchParam.likeGoodsNo = likeGoodsNo ? likeGoodsNo : '';
      searchParam.likeGoodsInfoNo = '';
    } else if (noType === '1') {
      searchParam.likeGoodsInfoNo = likeGoodsNo ? likeGoodsNo : '';
      searchParam.likeGoodsNo = '';
    }
    searchParam.likeGoodsName = likeGoodsName ? likeGoodsName : '';
    searchParam.cateId = cateId ? cateId : 0;
    searchParam.brandId = brandId ? brandId : 0;
    searchParam.noType = noType ? noType : '0';
    this.setState({ searchParam });

    searchParam.pageNum = params.pageNum;
    searchParam.pageSize = params.pageSize;
    let { res } = await webapi.fetchGoodsList({
      customerId: this.props.selectedCustomerId,
      ...searchParam
    });
    if ((res as any).code == Const.SUCCESS_CODE) {
      res = (res as any).context;
      const fetchBrand = await webapi.fetchBrandList();
      const fetchCates = await webapi.fetchCateList();

      const { brands: _brands, cates: _cates, goodses: spus, goodsIntervalPrices: allIntervals } = res as any;

      const { totalElements: total, content: skus, number: pageNum, size: pageSize } = (res as any).goodsInfoPage;

      //关联生效中的营销活动
      const { res: goodsMarketings } = await webapi.fetchGoodsMarketings({
        goodsInfoIds: skus.map((sku) => sku.goodsInfoId),
        customerId: this.props.selectedCustomerId
      });
      skus.map((sku) => {
        sku.marketings = goodsMarketings[sku.goodsInfoId];
        sku.marketings = sku.marketings && sku.marketings.length > 0 ? sku.marketings : undefined;
        if (sku.marketings) {
          sku.marketingId = sku.marketings[0].marketingId; //默认选中第一个
        }
        return sku;
      });

      const { res: brandsRes } = fetchBrand as any;
      const { context: brands } = brandsRes;
      const { res: catesRes } = fetchCates as any;
      const { context: cates } = catesRes;

      this.setState({
        loading: false,
        res: {
          skus,
          _brands,
          _cates,
          spus
        },
        allIntervals: fromJS(allIntervals || []).concat(this.state.allIntervals),
        total,
        brands,
        cates,
        pageNum,
        pageSize
      });
    }
  };

  /**
   * 获取选中的商品信息
   * @returns {Promise<any>}
   */
  getSelectRows = async () => {
    const { selectedRows } = this.state;
    return fromJS(selectedRows);
  };

  /**
   * 获取选中的商品keys
   * @returns {Promise<any>}
   */
  getSelectKeys = async () => {
    const { selectedRowKeys } = this.state;
    return fromJS(selectedRowKeys);
  };

  /**
   * 获取区间价格
   * @returns {Promise<any>}
   */
  getIntervalPrices = async () => {
    const { intervals } = this.state;
    return intervals;
  };
}
