import React, { Component } from 'react';
import { Relax, IMap } from 'plume2';
import { cache, RCi18n } from 'qmkit';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Checkbox, Col, Form, Row, Table } from 'antd';
import { IList } from 'typings/globalType';
import { Const, QMFloat } from 'qmkit';
import styled from 'styled-components';
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
  marginLeft: 20
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
    };
  };

  static relaxProps = {
    couponCates: 'couponCates',
    coupon: 'coupon',
    skuBrands: 'skuBrands',
    skuCates: 'skuCates',
    skus: 'skus',
  };

  render() {
    const { couponCates, coupon, skuBrands, skuCates, skus } = this.props.relaxProps;
    const { couponName, rangeDayType, startTime, endTime, effectiveDays, denomination, fullBuyType, fullBuyPrice, scopeType, couponDesc, couponPurchaseType, isSuperimposeSubscription} = coupon.toJS();
   debugger
    return (
      <FormDiv>
        <Form>
          <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.CouponName" />}>
            <div style={style}>{couponName}</div>
          </FormItem>
          <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.PromotionType" />}>
            <div style={checkboxContainerStyle}>{PROMOTION_TYPE[couponPurchaseType]}
              {
                couponPurchaseType === 0 &&
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
          <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.Coupon" />}>
            <div style={style}>{`${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}${denomination}`}</div>
          </FormItem>
          <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.Threshold" />}>
            <div style={style}>{this._buildFullBuyType(fullBuyType, fullBuyPrice)}</div>

          </FormItem>
          <FormItem {...formItemLayout} label={<FormattedMessage id="Marketing.Products" />}>
            <div style={style}>
              {this._buildSkus(scopeType, skuBrands, skuCates, skus)}
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
  _buildFullBuyType = (fullBuyType, fullBuyPrice) => {
    if (fullBuyType === 0) {
      return 'No threshold';
    } else if (fullBuyType === 1) {
      return `Over ${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}${fullBuyPrice} is available`;
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
