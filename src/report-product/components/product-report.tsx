import React, { Component } from 'react';
import ListSearchForm from './list-search-form';
import ReportList from './report-list';
import * as webapi from '@/report-product/webapi';
export default class ProductReportList extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      productList: [],
      productColumn: []
    };
  }

  componentDidMount() {
    const dataSource = [
      {
        key: '1',
        no: 1,
        product: 'URINARY S/O MODERATE CALORIE Häppchen in Soße',
        sku: '4087',
        salesVolume: 26,
        revenue: 10000,
        rating: 4.9
      },
      {
        key: '2',
        no: 2,
        product: 'URINARY S/O MODERATE CALORIE Häppchen in Soße',
        sku: '4087',
        salesVolume: 26,
        revenue: 10000,
        rating: 4.9
      },
      {
        key: '3',
        no: 3,
        product: 'URINARY S/O MODERATE CALORIE Häppchen in Soße',
        sku: '4087',
        salesVolume: 26,
        revenue: 10000,
        rating: 4.9
      },
      {
        key: '4',
        no: '4',
        product: 'URINARY S/O MODERATE CALORIE Häppchen in Soße',
        sku: '4087',
        salesVolume: 26,
        revenue: 10000,
        rating: 4.9
      },
      {
        key: '5',
        no: 5,
        product: 'URINARY S/O MODERATE CALORIE Häppchen in Soße',
        sku: '4087',
        salesVolume: 26,
        revenue: 10000,
        rating: 4.9
      },
      {
        key: '6',
        no: 6,
        product: 'URINARY S/O MODERATE CALORIE Häppchen in Soße',
        sku: '4087',
        salesVolume: 26,
        revenue: 10000,
        rating: 4.9
      }
    ];
    const columns = [
      {
        title: 'No',
        dataIndex: 'no',
        key: 'no'
      },
      {
        title: 'Product',
        dataIndex: 'product',
        key: 'product'
      },
      {
        title: 'SKU',
        dataIndex: 'sku',
        key: 'sku'
      },
      {
        title: 'Sales volume',
        dataIndex: 'salesVolume',
        key: 'salesVolume'
      },
      {
        title: 'Revenue',
        dataIndex: 'revenue',
        key: 'revenue'
      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        key: 'rating'
      }
    ];
    this.setState({
      productList: dataSource,
      productColumn: columns
    });
    this.getProductList();
  }
  onSearch(params) {
    this.getProductList(params);
  }

  getProductList(params = {}) {
    console.log(params, '------params------');
    this.setState({
      loading: true
    });
    webapi.getAllProductList(params).then((res) => {
      this.setState({
        loading: false
      });
    });
  }
  render() {
    const { loading, productList, productColumn } = this.state;
    return (
      <div className="container">
        <ListSearchForm onSearch={(params) => this.onSearch(params)} />
        <ReportList loading={loading} list={productList} columns={productColumn} />
      </div>
    );
  }
}
