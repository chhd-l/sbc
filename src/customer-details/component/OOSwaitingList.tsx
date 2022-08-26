import React from 'react';
import { Pagination, Spin, Empty, Table } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Const, cache, RCi18n, util } from 'qmkit';
import { stockNoticeInfo } from './webapi';
const defaultImg = require('../../goods-list/img/none.png');

interface Iprop {
  customerId: string;
}

type center = 'center';

export default class OOSwaitingList extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      ossList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }

  componentDidMount() {
    this.getOssList();
  }

  // componentDidUpdate(prevProps: Readonly<Iprop>, prevState: Readonly<any>, snapshot?: any): void {
  //   this.getOssList();
  // }

  onPageChange = (page) => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: {
          ...pagination,
          current: page
        }
      },
      () => this.getOssList()
    );
  };

  getOssList = () => {
    const { customerId } = this.props;
    const { pagination } = this.state;
    this.setState({ loading: true });
    stockNoticeInfo({
      customerId,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    })
      .then((data) => {
        this.setState({
          loading: false,
          ossList: data.res.context.content,
          pagination: {
            ...pagination,
            total: data.res.context.total
          }
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          ossList: []
        });
      });
  };

  render() {
    const { loading, pagination, ossList } = this.state;
    const columns = [
      {
        title: <FormattedMessage id='PetOwner.Image' />,
        dataIndex: 'goodsImg',
        key: 'goodsImg',
        align: 'center' as center,
        render: (goodsImg) => {
          return (<div
            style={{
              // textAlign: 'left',
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              padding: '16px 0'
            }}
          >
            {/*商品图片*/}
            <img src={goodsImg ? util.optimizeImage(goodsImg) : defaultImg} className="img-item" />
          </div>)
        }
      },
      {
        title: <FormattedMessage id='PetOwner.ProductName' />,
        dataIndex: 'goodsName',
        key: 'goodsName',
        align: 'center' as center,
        render: (goodsName) => (
          <span>{goodsName || ''}</span>
        )
      },
      {
        title: <FormattedMessage id='PetOwner.SKU' />,
        dataIndex: 'goodsInfoNo',
        key: 'goodsInfoNo',
        align: 'center' as center,
        render: (goodsInfoNo) => (
          <span>{goodsInfoNo || <span></span>}</span>
        )
      },
      {
        title: <FormattedMessage id='PetOwner.SPU' />,
        dataIndex: 'goodsNo',
        key: 'goodsNo',
        align: 'center' as center,
        render: (goodsNo) => (
          <span>{goodsNo || <span></span>}</span>
        )
      },
      {
        title: <FormattedMessage id='PetOwner.MarketPrice' />,
        key: 'marketPrice',
        dataIndex: 'marketPrice',
        align: 'center' as center,
        render: (marketPrice) => (
          <span>{marketPrice ? (<span>
            {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)} {marketPrice.toFixed(2)}
          </span>) : ''}</span>
        )
      },
      {
        title: <FormattedMessage id='PetOwner.ProductCategory' />,
        key: 'productCategoryNames',
        dataIndex: 'productCategoryNames',
        align: 'center' as center,
        render: (productCategoryNames) => (
          <span>{productCategoryNames || ''}</span>
        )
      },
      {
        title: <FormattedMessage id='PetOwner.SalesCategory' />,
        key: 'goodsStoreCateNames',
        dataIndex: 'goodsStoreCateNames',
        align: 'center' as center,
        render: (goodsStoreCateNames) => (
          <span>{goodsStoreCateNames || ''}</span>
        )
      },
      {
        title: <FormattedMessage id='PetOwner.Brand' />,
        key: 'brandName',
        dataIndex: 'brandName',
        align: 'center' as center,
        render: (brandName) => (
          <span>{brandName || ''}</span>
        )
      },
      {
        title: <FormattedMessage id='PetOwner.shelves' />,
        key: 'addedFlag',
        dataIndex: 'addedFlag',
        align: 'center' as center,
        render: (addedFlag) => (
          <span>{addedFlag ? <FormattedMessage id='PetOwner.Onshelves' /> : <FormattedMessage id='PetOwner.Offshelves' />}</span>
        )
      },
    ];

    const dataList = [{
      goodsImg: "https://d2cfgssit.z7.web.core.windows.net/RU_391753_master.jpg",
      goodsName: 'sdadad',
      goodsNo: 'sdadada',
      marketPrice: 12.22,
      goodsInfoNo: '2222',
      goodsStoreCateNames: '2222',
      productCategoryNames: "2233",
      brandName: 'sdadad',
      addedFlag: 0
    },
    {
      goodsImg: "https://d2cfgssit.z7.web.core.windows.net/RU_391753_master.jpg",
      goodsName: 'sdadad',
      goodsNo: 'sdadada',
      marketPrice: 12.22,
      goodsInfoNo: '2222',
      goodsStoreCateNames: '2222',
      productCategoryNames: "2233",
      brandName: 'sdadad',
      addedFlag: 1
    },
    ]
    return (
      <div>
        <Spin spinning={loading}>
          <Table dataSource={ossList} columns={columns} loading={loading} pagination={false} />
          {pagination.total > 0 && <Pagination current={pagination.current} total={pagination.total} pageSize={pagination.pageSize} onChange={this.onPageChange} />}
        </Spin>
      </div>
    );
  }
}

