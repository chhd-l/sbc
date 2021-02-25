import React from 'react';
import { Pagination, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import { fetchOrderList } from '../../order-list/webapi';
import moment from 'moment';
import { Const, cache } from 'qmkit';
const defaultImg = require('../../goods-list/img/none.png');

interface Iprop {
  startDate: string;
  endDate: string;
  customerAccount: string;
}

interface Istyle {
  [key: string]: React.CSSProperties;
}

const deliverStatus = (status) => {
  if (status == 'NOT_YET_SHIPPED') {
    return <FormattedMessage id="order.notShipped" />;
  } else if (status == 'SHIPPED') {
    return <FormattedMessage id="order.allShipments" />;
  } else if (status == 'PART_SHIPPED') {
    return <FormattedMessage id="order.partialShipment" />;
  } else if (status == 'VOID') {
    return <FormattedMessage id="order.invalid" />;
  } else {
    return <FormattedMessage id="order.unknown" />;
  }
};

const flowState = (status) => {
  if (status == 'INIT') {
    return <FormattedMessage id="order.pendingReview" />;
  } else if (status == 'GROUPON') {
    return <FormattedMessage id="order.toBeFormed" />;
  } else if (status == 'AUDIT' || status == 'DELIVERED_PART') {
    return <FormattedMessage id="order.toBeDelivered" />;
  } else if (status == 'DELIVERED') {
    return <FormattedMessage id="order.toBeReceived" />;
  } else if (status == 'CONFIRMED') {
    return <FormattedMessage id="order.received" />;
  } else if (status == 'COMPLETED') {
    return <FormattedMessage id="order.completed" />;
  } else if (status == 'VOID') {
    return <FormattedMessage id="order.outOfDate" />;
  }
};

export default class OrderInformation extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      orderList: [1, 2, 3],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }

  componentDidMount() {
    this.getOrderList();
  }

  componentDidUpdate(prevProps) {
    if (this.props.startDate !== prevProps.startDate || this.props.endDate !== prevProps.endDate) {
      this.getOrderList();
    }
  }

  onPageChange = (page) => {
    const { pagination } = this.state;
    this.setState(
      {
        pagiantion: {
          ...pagination,
          current: page
        }
      },
      () => this.getOrderList()
    );
  };

  getOrderList = () => {
    const { startDate, endDate, customerAccount } = this.props;
    const { pagination } = this.state;
    this.setState({ loading: true });
    fetchOrderList({
      orderType: 'NORMAL_ORDER',
      buyerAccount: customerAccount,
      beginTime: startDate,
      endTime: endDate,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    })
      .then((data) => {
        this.setState({
          loading: false,
          orderList: data.res.context.content,
          pagiantion: {
            ...pagination,
            total: data.res.context.total
          }
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          orderList: []
        });
      });
  };

  _renderLoading = () => {
    return (
      <tr style={styles.loading}>
        <td colSpan={7}>
          <Spin indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />} />
        </td>
      </tr>
    );
  };

  _renderContent = (dataList) => {
    return dataList.map((item, idx) => {
      const imgList = item.tradeItems.concat(item.gifts || []);
      const tradePrice = item.tradePrice.totalPrice || 0;
      const num = imgList.reduce((prev: number, curr: any) => prev + curr.num, 0);
      return (
        <tr className="ant-table-row  ant-table-row-level-0" key={idx}>
          <td colSpan={7} style={{ padding: 0 }}>
            <table className="ant-table-self" style={{ border: '1px solid #ddd' }}>
              <thead>
                <tr>
                  <td colSpan={7}>
                    <div style={styles.orderCon}>
                      <span style={styles.orderId}>{item.id}</span>
                      <span style={styles.orderNo}>{item.parentId}</span>
                      <span style={styles.orderTime}>Order time: {moment(item.tradeState.createTime).format(Const.TIME_FORMAT)}</span>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: '30%' }}>
                    <div
                      style={{
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'flex-end',
                        flexWrap: 'wrap',
                        padding: '16px 0'
                      }}
                    >
                      {/*商品图片*/}
                      {imgList.map((v: any, k: number) => (k < 4 ? <img src={v.get('pic') ? v.get('pic') : defaultImg} className="img-item" key={k} /> : null))}
                      {
                        /*最后一张特殊处理*/
                        //@ts-ignore
                        imgList.length > 4 ? (
                          <div style={styles.imgBg}>
                            <img
                              //@ts-ignore
                              src={imgList[3]['pic'] ? imgList[3]['pic'] : defaultImg}
                              style={styles.imgFourth}
                            />
                            //@ts-ignore
                            <div style={styles.imgNum}>
                              <FormattedMessage id="total" /> {imgList.length}
                              <FormattedMessage id="items" />
                            </div>
                          </div>
                        ) : null
                      }
                    </div>
                  </td>
                  <td style={{ width: '10%' }}>{item.consignee.name}</td>
                  <td style={{ width: '10%' }}>
                    {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)} {tradePrice.toFixed(2)}
                  </td>
                  <td style={{ width: '10%' }}>{num}</td>
                  <td style={{ width: '20%' }}>{item.buyer.name}</td>
                  <td style={{ width: '10%' }}>{deliverStatus(item.tradeState.deliverStatus)}</td>
                  <td style={{ width: '10%' }}>{flowState(item.tradeState.flowState)}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      );
    });
  };

  render() {
    const { loading, pagination, orderList } = this.state;
    return (
      <div>
        <div className="ant-table-wrapper">
          <div className="ant-table ant-table-large ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table style={{ borderCollapse: 'separate', borderSpacing: '0 1em' }}>
                  <thead className="ant-table-thead">
                    <tr>
                      <th style={{ width: '30%' }}>Product</th>
                      <th style={{ width: '10%' }}>Recipient</th>
                      <th style={{ width: '10%' }}>Amount</th>
                      <th style={{ width: '10%' }}>Quantity</th>
                      <th style={{ width: '20%' }}>Prescriber name</th>
                      <th style={{ width: '10%' }}>Shipping status</th>
                      <th style={{ width: '10%' }}>Order status</th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">{loading ? this._renderLoading() : this._renderContent(orderList)}</tbody>
                </table>
              </div>
              {!loading && pagination.total === 0 ? (
                <div className="ant-table-placeholder">
                  <span>
                    <i className="anticon anticon-frown-o" />
                    <FormattedMessage id="noData" />
                  </span>
                </div>
              ) : null}
            </div>
          </div>
          {pagination.total > 0 ? <Pagination current={pagination.current} total={pagination.total} pageSize={pagination.pageSize} onChange={(pageNum, pageSize) => {}} /> : null}
        </div>
      </div>
    );
  }
}

const styles: Istyle = {
  loading: {
    textAlign: 'center',
    height: 300
  },
  orderCon: {
    fontSize: 0,
    padding: '10px 20px'
  },
  orderId: {
    display: 'inline-block',
    fontSize: 14,
    width: '15%'
  },
  orderNo: {
    display: 'inline-block',
    width: '60%',
    fontSize: 14,
    color: '#666'
  },
  orderTime: {
    display: 'inline-block',
    width: '25%',
    fontSize: 14,
    textAlign: 'right',
    color: '#999'
  },
  imgFourth: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 3
  },
  imgBg: {
    position: 'relative',
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    borderRadius: 3
  },
  imgNum: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    background: 'rgba(0,0,0,0.6)',
    borderRadius: 3,
    fontSize: 9,
    color: '#fff'
  }
};
