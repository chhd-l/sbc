import * as React from 'react';
import { fromJS, List } from 'immutable';
import { DataGrid, cache, noop, Const, RCi18n } from 'qmkit';
import { Table } from 'antd';
const Column = Table.Column;
import { Relax } from 'plume2';
import moment from 'moment';
declare type IList = List<any>;
const baseConfigUrl = '';
@Relax
export default class SelectedGoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  props: {
    relaxProps?: {
      detailProductList: any;
      productForm: any;
      onCreateLink: Function;
    };
  };

  static relaxProps = {
    detailProductList: 'detailProductList',
    productForm: 'productForm',
    onCreateLink: noop
  };

  render() {
    const { detailProductList } = this.props.relaxProps;
    let linkBaseUrl = JSON.parse(sessionStorage.getItem(cache.SYSTEM_BASE_CONFIG) || '{}').supplierWebsite ?? '';
    if (!linkBaseUrl.endsWith('/')) {
      linkBaseUrl += '/';
    }

    return (
      <div className="user">
        <div className="text flex-start">
          <span>{RCi18n({id:'Order.RecommendationNo'})}: {detailProductList.recommendationId ? detailProductList.recommendationId : '--'}</span>
          <span>{RCi18n({id:'Order.RecommendationrReasons'})}: {detailProductList.recommendationReasons ? detailProductList.recommendationReasons : '--'}</span>
        </div>
        <div className="text flex-start">
          <span>{RCi18n({id:'Order.FirstName'})}: {detailProductList.consumerFirstName ? detailProductList.consumerFirstName : '--'}</span>
          <span>{RCi18n({id:'Order.LastName'})}: {detailProductList.consumerLastName ? detailProductList.consumerLastName : '--'}</span>
        </div>
        <div className="text flex-start">
          <span>{RCi18n({id:'Order.Email'})}: {detailProductList.consumerEmail ? detailProductList.consumerEmail : '--'}</span>
          <span>{RCi18n({id:'Order.Phonenumber'})}: {detailProductList.consumerPhoneNumber ? detailProductList.consumerPhoneNumber : '--'}</span>
        </div>

        <div className="text flex-start">
          <span>{RCi18n({id:'Order.CreatedTime'})}: {detailProductList.createTime ? moment(detailProductList.createTime).format('YYYY-MM-DD') : '--'}</span>
          <span>
          {RCi18n({id:'Order.Link'})}:{' '}
            <p style={{ display: 'contents', wordBreak: 'break-all' }}>
              {linkBaseUrl}
              recommendation/
              {detailProductList.base64Id ? detailProductList.base64Id : '--'}
            </p>
          </span>
        </div>
      </div>
    );
  }
}
