import * as React from 'react';
import { fromJS, List } from 'immutable';
import { DataGrid, cache, noop, Const } from 'qmkit';
import { Table } from 'antd';
const Column = Table.Column;
import { Relax } from 'plume2';
import moment from 'moment';
declare type IList = List<any>;

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

    return (
      <div className="user">
        <div className="text flex-start">
          <span>
            First name:{' '}
            {detailProductList.consumerFirstName
              ? detailProductList.consumerFirstName
              : '--'}
          </span>
          <span>
            Last name:{' '}
            {detailProductList.consumerLastName
              ? detailProductList.consumerLastName
              : '--'}
          </span>
        </div>
        <div className="text flex-start">
          <span>
            E-mail:{' '}
            {detailProductList.consumerEmail
              ? detailProductList.consumerEmail
              : '--'}
          </span>
          <span>
            Phone number:{' '}
            {detailProductList.consumerPhoneNumber
              ? detailProductList.consumerPhoneNumber
              : '--'}
          </span>
        </div>
        <div className="text flex-start">
          <span>
            Create time:{' '}
            {detailProductList.createTime
              ? moment(detailProductList.createTime).format('YYYY-MM-DD')
              : '--'}
          </span>
          <span>
            Recommendation reasons:{' '}
            {detailProductList.recommendationReasons
              ? detailProductList.recommendationReasons
              : '--'}
          </span>
        </div>
        <div className="text flex-start">
          <span>
            Link:
            https://shopuat.466920.com/recommendation/MjAyMDA4MjYxMzU2NDE3MTI1
          </span>
          <span></span>
        </div>
      </div>
    );
  }
}
