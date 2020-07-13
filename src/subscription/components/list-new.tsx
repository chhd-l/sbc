import React from 'react';
import { Link } from 'react-router-dom';
import {
  Checkbox,
  Spin,
  Pagination,
  Modal,
  Form,
  Input,
  Button,
  Popconfirm,
  message
} from 'antd';
import { FormattedMessage } from 'react-intl';
import * as webapi from './../webapi';
const defaultImg = require('../../goods-list/img/none.png');

export default class ListView extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      allChecked: false,
      loading: false,
      dataList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      searchParams: {}
    };
  }
  componentDidMount() {
    // this.getSubscriptionList()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataList: nextProps.data,
      pagination: nextProps.pagination,
      searchParams: nextProps.searchParams
    });
  }

  onCheckedAll = (checked) => {
    this.setState({
      allChecked: checked
    });
  };

  init = ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const { searchParams } = this.state;
    let params = Object.assign({ pageSize, pageNum }, searchParams);
    this.getSubscriptionList(params);
  };

  getSubscriptionList = (params) => {
    this.setState({
      loading: true
    });
    webapi
      .getSubscriptionList(params)
      .then((data) => {
        let { res } = data;
        if (res.code === 'K-000000') {
          let pagination = {
            current: res.context.currentPage + 1,
            pageSize: 10,
            total: res.context.total
          };
          this.setState(() => {
            return {
              dataList: res.context.subscriptionResponses,
              loading: false,
              pagination: pagination
            };
          });
        } else {
          this.setState({
            loading: false
          });
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error('Unsuccessful');
      });
  };
  onChecked = (index, checked) => {
    console.log(index, checked);
  };

  goodsSum = (array) => {
    let sum = 0;
    for (let index = 0; index < array.length; index++) {
      sum += array[index].subscribeNum;
    }
    return sum;
  };
  cancelAll = (id: String) => {
    this.setState({
      loading: true
    });
    webapi
      .cancelSubscription({ subscribeId: id })
      .then((data) => {
        const { res } = this.state;
        if (res.code === 'K-000000') {
          message.success('Successful');
          this.init();
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error('Unsuccessful');
      });
  };

  render() {
    const { allChecked, loading, pagination, dataList } = this.state;
    return (
      <div>
        <div className="ant-table-wrapper">
          <div className="ant-table ant-table-large ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table
                  style={{ borderCollapse: 'separate', borderSpacing: '0 1em' }}
                >
                  <thead className="ant-table-thead">
                    <tr>
                      <th
                        style={{
                          width: '3%',
                          borderSpacing: 'initial',
                          textAlign: 'center'
                        }}
                      >
                        <Checkbox
                          checked={allChecked}
                          onChange={(e) => {
                            const checked = (e.target as any).checked;
                            this.onCheckedAll(checked);
                          }}
                        />
                      </th>
                      <th style={{ width: '20%' }}>Product</th>
                      <th style={{ width: '10%' }}>Subscription Status</th>
                      <th style={{ width: '12%' }}>
                        <FormattedMessage id="subscription.consumerName" />
                      </th>
                      <th style={{ width: '12%' }}>
                        <FormattedMessage id="subscription.receiver" />
                      </th>
                      <th style={{ width: '14%' }}>
                        <FormattedMessage id="subscription.frequency" />
                      </th>
                      <th style={{ width: '10%' }}>
                        <FormattedMessage id="subscription.quantity" />
                      </th>
                      <th style={{ width: '16%' }}>
                        <FormattedMessage id="subscription.operation" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">
                    {loading
                      ? this._renderLoading()
                      : this._renderContent(dataList)}
                  </tbody>
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
          {pagination.total > 0 ? (
            <Pagination
              current={pagination.current}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onChange={(pageNum, pageSize) => {
                this.init({ pageNum: pageNum - 1, pageSize });
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }

  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={8}>
          <Spin />
        </td>
      </tr>
    );
  }

  _renderContent(dataList) {
    return (
      dataList &&
      dataList.map((v, index) => {
        return (
          <tr
            className="ant-table-row  ant-table-row-level-0"
            key={v.subscribeId}
          >
            <td colSpan={8} style={{ padding: 0 }}>
              <table
                className="ant-table-self"
                style={{ border: '1px solid #ddd' }}
              >
                <thead>
                  <tr>
                    <td colSpan={8} style={{ padding: 0, color: '#999' }}>
                      <div
                        style={{
                          marginTop: 12,
                          borderBottom: '1px solid #F5F5F5',
                          height: 36
                        }}
                      >
                        <span style={{ marginLeft: '1%' }}>
                          <Checkbox
                            onChange={(e) => {
                              const checked = (e.target as any).checked;
                              this.onChecked(index, checked);
                            }}
                          />
                        </span>

                        <div style={{ width: 310, display: 'inline-block' }}>
                          <span style={{ marginLeft: 20, color: '#000' }}>
                            {v.subscribeId}{' '}
                          </span>
                        </div>

                        <span style={{ marginLeft: 60 }}>
                          <FormattedMessage id="subscription.subscriptionDate" />
                          :{v.createTime ? v.createTime : ''}
                        </span>
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {/* product */}
                    <td style={{ width: '3%' }} />
                    <td style={{ width: '20%' }}>
                      {/*商品图片*/}
                      {v.goodsInfo &&
                        v.goodsInfo.map((item, k) =>
                          k < 4 ? (
                            <img
                              src={item.goodsPic ? item.goodsPic : defaultImg}
                              style={styles.imgItem}
                              key={k}
                            />
                          ) : null
                        )}

                      {/*第4张特殊处理*/
                      //@ts-ignore
                      v.goodsInfo && v.goodsInfo.size > 3 ? (
                        <div style={styles.imgBg}>
                          <img
                            //@ts-ignore
                            src={item.goodsPic ? item.goodsPic : defaultImg}
                            style={styles.imgFourth}
                          />
                          <div style={styles.imgNum}>
                            <FormattedMessage id="total" />
                            {v.goodsInfo.size} <FormattedMessage id="piece" />
                          </div>
                        </div>
                      ) : null}
                    </td>

                    {/*subscription status*/}
                    <td style={{ width: '10%' }}>
                      {v.subscribeStatus === '0' ? 'Active' : 'InAction'}
                    </td>
                    {/* consumerName */}
                    <td style={{ width: '12%' }}>
                      {v.customerName ? v.customerName : ''}
                    </td>
                    {/* Recipient */}
                    <td style={{ width: '12%' }}>
                      {v.consignee ? v.consignee.consigneeName : ''}
                    </td>
                    {/*Frequency*/}
                    <td style={{ width: '14%' }}>
                      {v.frequency ? v.frequency : ''}
                    </td>
                    {/* Quantity */}
                    <td style={{ width: '10%' }}>
                      {v.goodsInfo && this.goodsSum(v.goodsInfo)}
                    </td>
                    {/*Operation*/}
                    <td style={{ width: '16%' }} className="operation-td">
                      <Button type="link">
                        <Link to={'/subscription-detail/' + v.subscribeId}>
                          Details
                        </Link>
                      </Button>
                      <Button type="link">
                        <Link to={'/subscription-edit/' + v.subscribeId}>
                          Edit
                        </Link>
                      </Button>
                      {v.subscribeStatus === '0' ? (
                        <Popconfirm
                          placement="topRight"
                          title="Are you sure cancel the subscription?"
                          onConfirm={() => this.cancelAll(v.subscribeId)}
                          okText="Confirm"
                          cancelText="Cancel"
                        >
                          <Button type="link" style={{ fontSize: 16 }}>
                            Cancel All
                          </Button>
                        </Popconfirm>
                      ) : null}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        );
      })
    );
  }
}

const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  },
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    background: '#fff',
    borderRadius: 3
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
  },
  platform: {
    fontSize: 12,
    padding: '1px 3px',
    display: 'inline-block',
    marginLeft: 5,
    border: ' 1px solid #F56C1D',
    color: '#F56C15',
    borderRadius: 5
  }
} as any;
