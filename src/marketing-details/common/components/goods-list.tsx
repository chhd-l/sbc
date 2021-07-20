import * as React from 'react';
import { Table, Row, Col } from 'antd';
import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import { fromJS } from 'immutable';
import styled from 'styled-components';
import { IList } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';
const { Column } = Table;

const GreyBg = styled.div`
  padding: 15px 0;
  color: #333333;
  margin-left: -28px;
  span {
    width: 200px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 20px 0 0;
  }
`;

@withRouter
@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      goodsPageContent: IList;
      brands: IList;
      cates: IList;
      marketingScopeList: IList;
      scopeType: any;
      currentCategary: any;
      currentAttribute: any;
    };
  };

  static relaxProps = {
    goodsPageContent: ['goodsList', 'goodsInfoPage', 'content'],
    brands: ['goodsList', 'brands'],
    cates: ['goodsList', 'cates'],
    marketingScopeList: 'marketingScopeList',
    scopeType: 'scopeType',
    currentCategary: 'currentCategary',
    currentAttribute: 'currentAttribute'
  };

  render() {
    const { goodsPageContent, brands, cates, marketingScopeList, scopeType, currentCategary, currentAttribute } = this.props.relaxProps;
    let dataSource = fromJS([])
    if (scopeType === 1) {
        dataSource = marketingScopeList.map((scope) => {
        let goodInfo = fromJS(goodsPageContent).find((s) => s.get('goodsInfoId') == scope.get('scopeId'));
        if (goodInfo) {
          const cId = goodInfo.get('cateId');
          const cate = fromJS(cates || []).find((s) => s.get('cateId') === cId);
          goodInfo = goodInfo.set('cateName', cate ? cate.get('cateName') : '-');

          const bId = goodInfo.get('brandId');
          const brand = fromJS(brands || []).find((s) => s.get('brandId') === bId);
          goodInfo = goodInfo.set('brandName', brand ? brand.get('brandName') : '-');
          return goodInfo;
        }
      });
      dataSource = dataSource.filter((goodsInfo) => goodsInfo);
    }

    return (
      <div>
        <GreyBg>
          <Row>
            <Col span={6}>
              <span>
                <FormattedMessage id="Marketing.SelectedGoods" />:
              </span>
            </Col>
            <Col  span={18}>
              {
                scopeType === 0 ? <span  className="left-span"><FormattedMessage id="Marketing.all" /></span> :
                  scopeType === 1 ?
                    <Table dataSource={dataSource.toJS()} pagination={false} scroll={{ y: 500 }} rowKey="goodsInfoId" className="goods-table">
                      <Column  align="center" title={<FormattedMessage id="Marketing.SKUCode" />} key="goodsInfoNo" dataIndex="goodsInfoNo" />
                      <Column  align="center" title={<FormattedMessage id="Marketing.ProductName" />} key="goodsInfoName" dataIndex="goodsInfoName" />
                      <Column  align="center" title={<FormattedMessage id="Marketing.Specification" />} key="specText" dataIndex="specText" />
                      <Column  align="center" title={<FormattedMessage id="Marketing.Category" />} key="cateName" dataIndex="cateName" />
                      <Column  align="center" title={<FormattedMessage id="Marketing.Brand" />} key="brandName" dataIndex="brandName" />
                      <Column  align="center" key="priceType" title={<FormattedMessage id="Marketing.price" />} render={(rowInfo) => <div>{rowInfo.salePrice}</div>} />
                    </Table> :  scopeType === 2 ?
                    currentCategary && currentCategary.map(item=> (
                      <span className="more-left-span" key={item.storeCateId}>{item.get('cateName')}</span>
                    ))
                    :
                    currentAttribute && currentAttribute.map(item=> (
                      <span key={item.id} className="more-left-span" >{item.get('attributeName') || item.get('attributeDetailName')} </span>
                    ))
              }
            </Col>
          </Row>
        </GreyBg>
      </div>
    );
  }
}
