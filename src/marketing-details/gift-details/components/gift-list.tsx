import * as React from 'react';
import { Table, Row, Col } from 'antd';
import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import { fromJS } from 'immutable';
import { IList } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';
import { cache } from 'qmkit';
const { Column } = Table;

import styled from 'styled-components';
import { FORMERR } from 'dns';

const GreyBg = styled.div`
  padding: 15px 0 15px;
  color: #333333;
  margin-left: -28px;
  span {
    width: 200px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;

@withRouter
@Relax
export default class GiftList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      levelList: IList;
      giftList: IList;
      brands: IList;
      cates: IList;
      subType: any;
    };
  };

  static relaxProps = {
    levelList: 'levelList',
    giftList: 'giftList',
    brands: ['goodsList', 'brands'],
    cates: ['goodsList', 'cates'],
    subType: 'subType'
  };

  render() {
    const { levelList, giftList, brands, cates, subType } = this.props.relaxProps;

    let skuList = fromJS(giftList);
    let brandList = fromJS(brands ? brands : []);
    let cateList = fromJS(cates ? cates : []);
    let dataSource = levelList.map((level) => {
      level = level.set(
        'fullGiftDetailList',
        level.get('fullGiftDetailList').map((gift) => {
          const sku = skuList.find((s) => s.get('goodsInfoId') === gift.get('productId'));
          gift = gift.set('sku', sku);

          const cId = sku.get('cateId');
          const cate = cateList.find((s) => s.get('cateId') === cId);
          gift = gift.set('cateName', cate ? cate.get('cateName') : '');

          const bId = sku.get('brandId');
          const brand = brandList.find((s) => s.get('brandId') === bId);
          gift = gift.set('brandName', brand ? brand.get('brandName') : '');
          return gift;
        })
      );
      return level;
    });
    return (
      <div>
        {dataSource.toJS().map((level) => (
          <div key={Math.rdmValue()}>
            <GreyBg>
              <Row>
                <Col span={24}>
                  <Col span={6}>
                    <span>
                      <FormattedMessage id="Marketing.Rules" />:
                    </span>
                  </Col>
                  <Col span={18}>
                    <FormattedMessage id="Marketing.Full" />
                    {level.fullAmount ? level.fullAmount : level.fullCount}
                    {subType == '4' ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : 'Items'} {level.giftType == '1' ? <FormattedMessage id="Marketing.AnOptionalOne" /> : <FormattedMessage id="Marketing.TheDefaultAllGive" />}
                  </Col>
                </Col>
              </Row>
            </GreyBg>

            <Table dataSource={level.fullGiftDetailList} pagination={false} rowKey="giftDetailId">
              <Column width="10%" title={<FormattedMessage id="Marketing.SKUCode" />} key="goodsInfoNo" render={(rowInfo) => <div>{rowInfo.sku.goodsInfoNo}</div>} />
              <Column width="25%" title={<FormattedMessage id="Marketing.ProductName" />} key="goodsInfoName" render={(rowInfo) => <div>{rowInfo.sku.goodsInfoName}</div>} />
              <Column width="10%" title={<FormattedMessage id="Marketing.Specification" />} key="specText" render={(rowInfo) => <div>{rowInfo.sku.specText ? rowInfo.sku.specText : '-'}</div>} />
              <Column width="12%" title={<FormattedMessage id="Marketing.Category" />} key="cateName" render={(rowInfo) => <div>{rowInfo.cateName ? rowInfo.cateName : '-'}</div>} />
              <Column width="10%" title={<FormattedMessage id="Marketing.Brand" />} key="brandName" render={(rowInfo) => <div>{rowInfo.brandName ? rowInfo.brandName : '-'}</div>} />
              <Column width="12%" key="priceType" title={<FormattedMessage id="Marketing.Price" />} render={(rowInfo) => <div>{rowInfo.sku.salePrice}</div>} />
              <Column width="8%" title={<FormattedMessage id="Marketing.Inventory" />} key="stock" render={(rowInfo) => <div>{rowInfo.sku.stock}</div>} />
              <Column width="15%" title={<FormattedMessage id="Marketing.GiveTheNumber" />} key="productNum" dataIndex="productNum" />
            </Table>
          </div>
        ))}
      </div>
    );
  }
}
