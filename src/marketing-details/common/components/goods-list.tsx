import * as React from 'react';
import { Table, Row, Col } from 'antd';
import { Relax } from 'plume2';
import { withRouter } from 'react-router';
import { fromJS } from 'immutable';
import styled from 'styled-components';
import { IList } from 'typings/globalType';

const { Column } = Table;

const GreyBg = styled.div`
  padding: 15px 0;
  color: #333333;
  margin-left: -28px;
  span {
    width: 100px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
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
    };
  };

  static relaxProps = {
    goodsPageContent: ['goodsList', 'goodsInfoPage', 'content'],
    brands: ['goodsList', 'brands'],
    cates: ['goodsList', 'cates'],
    marketingScopeList: 'marketingScopeList'
  };

  render() {
    const {
      goodsPageContent,
      brands,
      cates,
      marketingScopeList
    } = this.props.relaxProps;

    if (!marketingScopeList || !goodsPageContent) {
      return null;
    }
    let dataSource = marketingScopeList.map((scope) => {
      let goodInfo = fromJS(goodsPageContent).find(
        (s) => s.get('goodsInfoId') == scope.get('scopeId')
      );
      if (goodInfo) {
        const cId = goodInfo.get('cateId');
        const cate = fromJS(cates || []).find((s) => s.get('cateId') === cId);
        goodInfo = goodInfo.set('cateName', cate ? cate.get('cateName') : '-');

        const bId = goodInfo.get('brandId');
        const brand = fromJS(brands || []).find(
          (s) => s.get('brandId') === bId
        );
        goodInfo = goodInfo.set(
          'brandName',
          brand ? brand.get('brandName') : '-'
        );
        return goodInfo;
      }
    });

    dataSource = dataSource.filter((goodsInfo) => goodsInfo);

    return (
      <div>
        <GreyBg>
          <Row>
            <Col span={24}>
              <span>已选商品：</span>
            </Col>
          </Row>
        </GreyBg>
        <Table
          dataSource={dataSource.toJS()}
          pagination={false}
          scroll={{ y: 500 }}
          rowKey="goodsInfoId"
        >
          <Column
            width="15%"
            title="SKU code"
            key="goodsInfoNo"
            dataIndex="goodsInfoNo"
          />
          <Column
            width="30%"
            title="商品名称"
            key="goodsInfoName"
            dataIndex="goodsInfoName"
          />
          <Column
            width="15%"
            title="规格"
            key="specText"
            dataIndex="specText"
          />
          <Column
            width="15%"
            title="类目"
            key="cateName"
            dataIndex="cateName"
          />
          <Column
            width="15%"
            title="品牌"
            key="brandName"
            dataIndex="brandName"
          />
          <Column
            width="20%"
            key="priceType"
            title={'单价'}
            render={(rowInfo) => <div>{rowInfo.salePrice}</div>}
          />
        </Table>
      </div>
    );
  }
}
