import React, { Component } from 'react';
import { Relax, IMap } from 'plume2';
import { cache, RCi18n } from 'qmkit';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Checkbox, Col, Form, Row, Table } from 'antd';
import { IList } from 'typings/globalType';
import { Const, QMFloat } from 'qmkit';
import styled from 'styled-components';
import { fromJS } from 'immutable';
const FormDiv = styled.div`
  h3 {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: normal;
  }
  .bubbleBox {
    width: 50%;
    margin-bottom: -8px;
    span {
      border: 1px solid #ddd;
      border-radius: 3px;
      padding: 0 10px;
      display: inline-block;
      line-height: 28px;
      margin: 0 10px 8px 0;
    }
  }
`;
const FormItem = Form.Item;
const { Column } = Table;
const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 10
  }
};

const columns = [
  {
    title: <FormattedMessage id="Marketing.SKUCode" />,
    dataIndex: 'goodsInfoNo',
    key: 'goodsInfoNo',
    width: '20%'
  },
  {
    title: <FormattedMessage id="Marketing.ProductName" />,
    dataIndex: 'goodsInfoName',
    key: 'goodsInfoName',
    width: '40%'
  },
  {
    title: <FormattedMessage id="Marketing.Specifications" />,
    dataIndex: 'specText',
    key: 'specText',
    width: '20%'
  },
  {
    title: <FormattedMessage id="Marketing.Price" />,
    key: 'marketPrice',
    dataIndex: 'marketPrice',
    render: (text) => <span>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + QMFloat.addZero(text)}</span>,
    width: '20%'
  }
];
const style = {
  marginLeft: 20,
  display: 'flex'
}
const checkboxStyle = {


}
const checkboxContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
}
const PROMOTION_TYPE = {
  0:  RCi18n({
    id: 'Marketing.All'
  }),
  1:  RCi18n({
    id: 'Marketing.Autoship'
  }),
  2:
    RCi18n({
      id: 'Marketing.Club'
    }),
  3: RCi18n({
    id: 'Marketing.Singlepurchase'
  })
}

@Relax
export default class CouponBasicInfo extends Component<any, any> {
  props: {
    relaxProps?: {
      // 优惠券分类
      couponCates: IList;
      // 优惠券信息
      coupon: IMap;
      // 商品品牌
      skuBrands: IList;
      // 商品分类
      skuCates: IList;
      // 商品
      skus: IList;
      goodsList: any;
      currentCategary: any;
      currentAttribute: any;
      currentGroup: any;
    };
  };

  static relaxProps = {
    couponCates: 'couponCates',
    coupon: 'coupon',
    skuBrands: 'skuBrands',
    skuCates: 'skuCates',
    skus: 'skus',
    goodsList: 'goodsList',
    currentCategary: 'currentCategary',
    currentAttribute: 'currentAttribute',
    currentGroup: 'currentGroup'
  };

  render() {
    const { couponCates, coupon, skuBrands, skuCates, skus, goodsList,currentCategary,currentAttribute, currentGroup } = this.props.relaxProps;
    const { couponName, rangeDayType, startTime, endTime, effectiveDays, denomination, fullBuyType,
      fullBuyPrice, scopeType, couponDesc, couponPurchaseType, isSuperimposeSubscription, scopeIds,
      couponPromotionType, fullbuyCount,couponJoinLevel, emailSuffixList,fullGiftDetailList
    } = coupon.toJS();
    console.log(coupon.toJS())
    let dataSource = fromJS([])
    // const goodsInfoPage = goodsList.goodsInfoPage.content
    if (scopeType === 4) {
      const cates = goodsList.get('cates')
      const brands = goodsList.get('brands')
      console.log(cates)
      let array = []
      scopeIds.map((scope) => {
        if(goodsList.get('goodsInfoPage')) {
          let goodInfo = fromJS(goodsList.get('goodsInfoPage').get('content')).find((s) => s.get('goodsInfoId') == scope);
          if (goodInfo) {
            const cId = goodInfo.get('cateId');
            const cate = fromJS(cates || []).find((s) => s.get('cateId') === cId);
            goodInfo = goodInfo.set('cateName', cate ? cate.get('cateName') : '-');

            const bId = goodInfo.get('brandId');
            const brand = fromJS(brands || []).find((s) => s.get('brandId') === bId);
            goodInfo = goodInfo.set('brandName', brand ? brand.get('brandName') : '-');
            array.push(goodInfo.toJS())
          }
        }
      });
      dataSource = fromJS(array).filter((goodsInfo) => goodsInfo);
    }
    /**
     *  gift列表获取
     */
    let giftDataSource = []
    let giftIds = fullGiftDetailList?.map(item=>{
      return item.productId
    })
    if(couponPromotionType === 2){
      const cates = goodsList.get('cates')
      const brands = goodsList.get('brands')
      if(goodsList.get('goodsInfoPage')){
        goodsList.get('goodsInfoPage')?.toJS().content.forEach(item=>{
          if(giftIds.includes(item?.goodsInfoId)){
            item.brandName = brands.toJS().find((s) => s.brandId === item.brandId)?.brandName
            item.cateName = cates.toJS().find((s) => s.cateId === item.cateId)?.cateName
            item.productNum = fullGiftDetailList.find((s) => s.productId === item.goodsInfoId)?.productNum
            giftDataSource.push(item)
          }
        })
      }
    }
    return (
      <FormDiv>
        <Form>
          <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.CouponName" />}>
            <div style={style}>{couponName}</div>
          </FormItem>
          <FormItem labelCol={{span:3}} wrapperCol={{span: 21}} label={<FormattedMessage id="Marketing.PromotionType" />}>
            <div style={style}>{PROMOTION_TYPE[couponPurchaseType]}
              {
                couponPurchaseType != 3 &&
                <Checkbox className="checkboxStyle"checked={isSuperimposeSubscription === 0} disabled={true}>
                  <div >
                    <FormattedMessage id="Marketing.Idontwanttocumulate" />
                  </div>
                </Checkbox>
              }
            </div>
          </FormItem>
          {/* <FormItem {...formItemLayout} label="Coupon classify">
            <div className="bubbleBox">
              {couponCates.map((cate) => (
                <span key={cate}>{cate}</span>
              ))}
            </div>
          </FormItem> */}
          <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.StartAndEndTime" />}>
            <div style={style}>{this._buildRangeDayType(rangeDayType, startTime, endTime, effectiveDays)}</div>
          </FormItem>
          {
            couponPromotionType === 0 &&
            <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.Coupon" />}>
              <div style={style}>{`${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}${denomination}`}</div>
            </FormItem>
          }
          {
            couponPromotionType !== 3 ? (
              <>
                <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.Threshold" />}>
                  <div style={style}>{this._buildFullBuyType(fullBuyType, fullBuyPrice, fullbuyCount)}</div>
                </FormItem>
                <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.Products" />}>
                  <div style={style}>
                    {/*{this._buildSkus(scopeType, skuBrands, skuCates, skus)}*/}

                    {
                      scopeType === 0 ? <span  className="left-span"><FormattedMessage id="Marketing.all" /></span> :
                        scopeType === 4 && dataSource.size > 0?
                          <Table dataSource={ dataSource.toJS()} pagination={false} scroll={{ y: 500 }} rowKey="goodsInfoId" className="goods-table">
                            <Column  align="center" title={<FormattedMessage id="Marketing.SKUCode" />} key="goodsInfoNo" dataIndex="goodsInfoNo" />
                            <Column  align="center" title={<FormattedMessage id="Marketing.ProductName" />} key="goodsInfoName" dataIndex="goodsInfoName" />
                            <Column  align="center" title={<FormattedMessage id="Marketing.Specification" />} key="specText" dataIndex="specText" />
                            <Column  align="center" title={<FormattedMessage id="Marketing.Category" />} key="cateName" dataIndex="cateName" />
                            <Column  align="center" title={<FormattedMessage id="Marketing.Brand" />} key="brandName" dataIndex="brandName" />
                            <Column  align="center" key="priceType" title={<FormattedMessage id="Marketing.price" />} render={(rowInfo) => <div>{rowInfo.salePrice}</div>} />
                          </Table> :  scopeType === 5 ?
                          currentCategary && currentCategary.map(item=> (
                            <span className="coupon-mgr10" key={item.storeCateId}>{item.get('cateName')}</span>
                          ))
                          :
                          currentAttribute && currentAttribute.map(item=> (
                            <span key={item.id} className="coupon-mgr10" >{item.get('attributeName') || item.get('attributeDetailName')} </span>
                          ))
                    }

                  </div>
                </FormItem>
                <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.TargetConsumer" />}>
                  <div style={style}>
                    { couponJoinLevel == 0 && <span className="left-span"><FormattedMessage id="Marketing.all" /></span> }
                    { couponJoinLevel == -3 && <span className="left-span">{currentGroup && currentGroup.get('name')}</span> }
                    { couponJoinLevel == -4 && <span className="left-span">{emailSuffixList[0]}</span> }
                  </div>
                </FormItem>
                <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.InstructionsForUse" />}>
                  <div
                    style={{ wordBreak: 'break-all', marginLeft: 20}}
                    dangerouslySetInnerHTML={{
                      __html: couponDesc ? couponDesc.replace(/\n/g, '<br/>') : ''
                    }}
                  />
                </FormItem>
              </>
            ) : (
              <>
                <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.Freeshippingtype" />}>
                  {
                    fullBuyType === 1 ?
                      <div style={style}><FormattedMessage id="Marketing.Orderreach" /> &nbsp;{`${fullBuyPrice}${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}`}</div> :
                      <div style={style}> <FormattedMessage id="Marketing.Orderreach" />&nbsp;{`${fullbuyCount}`}&nbsp;<FormattedMessage id="Marketing.items" /></div>
                  }
                </FormItem>
                <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.Products" />}>
                  <div style={style}>
                    {/*{this._buildSkus(scopeType, skuBrands, skuCates, skus)}*/}

                    {
                      scopeType === 0 ? <span  className="left-span"><FormattedMessage id="Marketing.all" /></span> :
                        scopeType === 4 && dataSource.size > 0?
                          <Table dataSource={ dataSource.toJS()} pagination={false} scroll={{ y: 500 }} rowKey="goodsInfoId" className="goods-table">
                            <Column  align="center" title={<FormattedMessage id="Marketing.SKUCode" />} key="goodsInfoNo" dataIndex="goodsInfoNo" />
                            <Column  align="center" title={<FormattedMessage id="Marketing.ProductName" />} key="goodsInfoName" dataIndex="goodsInfoName" />
                            <Column  align="center" title={<FormattedMessage id="Marketing.Specification" />} key="specText" dataIndex="specText" />
                            <Column  align="center" title={<FormattedMessage id="Marketing.Category" />} key="cateName" dataIndex="cateName" />
                            <Column  align="center" title={<FormattedMessage id="Marketing.Brand" />} key="brandName" dataIndex="brandName" />
                            <Column  align="center" key="priceType" title={<FormattedMessage id="Marketing.price" />} render={(rowInfo) => <div>{rowInfo.salePrice}</div>} />
                          </Table> :  scopeType === 5 ?
                          currentCategary && currentCategary.map(item=> (
                            <span className="coupon-mgr10" key={item.storeCateId}>{item.get('cateName')}</span>
                          ))
                          :
                          currentAttribute && currentAttribute.map(item=> (
                            <span key={item.id} className="coupon-mgr10" >{item.get('attributeName') || item.get('attributeDetailName')} </span>
                          ))
                    }

                  </div>
                </FormItem>
                <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.TargetConsumer" />}>
                  <div style={style}>
                    {
                      couponJoinLevel == 0 ?
                        <span className="left-span"><FormattedMessage id="Marketing.all" /></span> : couponJoinLevel == -3 ?
                        <span className="left-span">{currentGroup && currentGroup.get('name')}</span>
                        : couponJoinLevel == -4 ?
                          <span className="left-span">
                            {emailSuffixList && emailSuffixList.toJS()[0]}
                          </span>: null
                    }
                  </div>
                </FormItem>
              </>
            )
          }

          {
            couponPromotionType === 2 &&
            (<FormItem  labelCol={{span:3}} wrapperCol={{span: 21}} label={<FormattedMessage id="Marketing.Gift" />}>
              <Table dataSource={giftDataSource} pagination={false} rowKey="giftDetailId">
                <Column width="10%" title={<FormattedMessage id="Marketing.SKUCode" />} key="goodsInfoNo" render={(rowInfo) => <div>{rowInfo.goodsInfoNo}</div>} />
                <Column width="25%" title={<FormattedMessage id="Marketing.ProductName" />} key="goodsInfoName" render={(rowInfo) => <div>{rowInfo.goodsInfoName}</div>} />
                <Column width="10%" title={<FormattedMessage id="Marketing.Specification" />} key="specText" render={(rowInfo) => <div>{rowInfo.specText ? rowInfo.specText : '-'}</div>} />
                <Column width="12%" title={<FormattedMessage id="Marketing.Category" />} key="cateName" render={(rowInfo) => <div>{rowInfo.cateName ? rowInfo.cateName : '-'}</div>} />
                <Column width="10%" title={<FormattedMessage id="Marketing.Brand" />} key="brandName" render={(rowInfo) => <div>{rowInfo.brandName ? rowInfo.brandName : '-'}</div>} />
                <Column width="12%" key="priceType" title={<FormattedMessage id="Marketing.Price" />} render={(rowInfo) => <div>{rowInfo.salePrice}</div>} />
                <Column width="8%" title={<FormattedMessage id="Marketing.Inventory" />} key="stock" render={(rowInfo) => <div>{rowInfo.stock}</div>} />
                <Column width="15%" title={<FormattedMessage id="Marketing.GiveTheNumber" />} key="productNum" dataIndex="productNum" />
              </Table>
            </FormItem>)
          }
        </Form>
      </FormDiv>
    );
  }

  /**
   * 构建起止时间结构
   */
  _buildRangeDayType = (rangeDayType, beginTime, endTime, effectiveDays) => {
    if (rangeDayType === 0) {
      return moment(beginTime).format(Const.TIME_FORMAT).toString() + ' ~ ' + moment(endTime).format(Const.TIME_FORMAT).toString();
    } else if (rangeDayType === 1) {
      return `Valid for ${effectiveDays} days from the day of collection`;
    }
  };

  /**
   * 构建使用门槛结构
   */
  _buildFullBuyType = (fullBuyType, fullBuyPrice, fullbuyCount) => {
    if (fullBuyType === 0) {
      return 'No threshold';
    } else if (fullBuyType === 1) {
      return `Over ${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}${fullBuyPrice} is available`;
    }else if (fullBuyType === 2) {
      return `Over ${fullbuyCount}${(window as any).RCi18n({ id: 'Marketing.items' })} is available`;
    }
  };

  /**
   * 构建商品结构
   */
  _buildSkus = (scopeType, skuBrands, skuCates, skus) => {
    if (scopeType === 0) {
      return 'All products';
    } else if (scopeType === 1) {
      return (
        <div>
          <h3>按品牌</h3>
          <div className="bubbleBox">{skuBrands.size == 0 ? '-' : skuBrands.map((brand, index) => <span key={index}>{brand}</span>)}</div>
        </div>
      );
    } else if (scopeType === 3) {
      return (
        <div>
          <h3>按店铺分类</h3>
          <div className="bubbleBox">{skuCates.size == 0 ? '-' : skuCates.map((cate, index) => <span key={index}>{cate}</span>)}</div>
        </div>
      );
    } else if (scopeType === 4) {
      const { goodsInfoPage } = skus.toJS(); //cates, brands,
      let skuList = goodsInfoPage.content;
      skuList = skuList.map((i) => {
        if (!i.specText) {
          i.specText = '-';
        }
        return i;
      });
      return (
        <div>
          {/* <h3>自定义选择</h3> */}
          <Table pagination={false} rowKey={(record: any) => record.skuId} columns={columns} dataSource={skuList} bordered scroll={{ y: 216 }} />
        </div>
      );
    }
  };
}
