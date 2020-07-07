import React from 'react';
import { Link } from 'react-router-dom';
import { Checkbox, Spin, Pagination, Modal, Form, Input } from 'antd';
import { FormattedMessage } from 'react-intl';
const defaultImg = require('../../goods-list/img/none.png');

export default class ListView extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      allChecked: '',
      loading: false,
      dataList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }
  onCheckedAll = (checked) => {
    this.setState({
      allChecked: checked
    });
  };
  init = ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    console.log(pageNum, pageSize);
  };
  onChecked = (index, checked) => {
    console.log(index, checked);
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
                      <th style={{ width: '5%' }}>
                        <Checkbox
                          checked={allChecked}
                          onChange={(e) => {
                            const checked = (e.target as any).checked;
                            this.onCheckedAll(checked);
                          }}
                        />
                      </th>
                      <th style={{ width: '17%' }}>
                        <FormattedMessage id="subscription.orderNumber" />
                      </th>
                      <th style={{ width: '17%' }}>
                        <FormattedMessage id="subscription.orderData" />
                      </th>
                      <th style={{ width: '17%' }}>
                        <FormattedMessage id="subscription.consumerName" />
                      </th>
                      <th style={{ width: '10%' }}>
                        <FormattedMessage id="subscription.receiver" />
                      </th>
                      <th style={{ width: '12%' }}>
                        <FormattedMessage id="subscription.frequency" />
                      </th>
                      <th style={{ width: '12%' }}>
                        <FormattedMessage id="subscription.quantity" />
                      </th>
                      <th style={{ width: '12%' }}>
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
              current={pagination.currentPage}
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
          <tr className="ant-table-row  ant-table-row-level-0" key={v.id}>
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
                            checked={v.get('checked')}
                            onChange={(e) => {
                              const checked = (e.target as any).checked;
                              this.onChecked(index, checked);
                            }}
                          />
                        </span>

                        <div style={{ width: 310, display: 'inline-block' }}>
                          <span style={{ marginLeft: 20, color: '#000' }}>
                            {v.id}{' '}
                          </span>
                        </div>

                        <span style={{ marginLeft: 60 }}>
                          <FormattedMessage id="subscription.subscriptionDate" />
                          :{v.subscriptionDate ? v.subscriptionDate : ''}
                        </span>
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {/* product */}
                    <td style={{ width: '3%' }} />
                    <td
                      style={{
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '16px 0',
                        width: '100'
                      }}
                    >
                      {/*商品图片*/}
                      {v.productImgList.map((v, k) =>
                        k < 4 ? (
                          <img
                            src={v.get('pic') ? v.get('pic') : defaultImg}
                            style={styles.imgItem}
                            key={k}
                          />
                        ) : null
                      )}

                      {/*第4张特殊处理*/
                      //@ts-ignore
                      v.get('tradeItems').concat(gifts).size > 3 ? (
                        <div style={styles.imgBg}>
                          <img
                            //@ts-ignore
                            src={v.get('pic') ? v.get('pic') : defaultImg}
                            style={styles.imgFourth}
                          />
                          <div style={styles.imgNum}>
                            <FormattedMessage id="total" />
                            {v.get('tradeItems').size}{' '}
                            <FormattedMessage id="piece" />
                          </div>
                        </div>
                      ) : null}
                    </td>
                    <td style={{ width: '14%' }}>
                      {v.getIn(['buyer', 'name'])}
                    </td>
                    {/*subscription status*/}
                    <td style={{ width: '17%' }}>{v.status}</td>
                    {/* consumerName */}
                    <td style={{ width: '10%' }}>{v.consumerName}</td>
                    {/* Recipient */}
                    <td style={{ width: '12%' }}>{v.consumerName}</td>
                    {/*Frequency*/}
                    <td style={{ width: '12%' }}>{v.consumerName}</td>
                    {/*Operation*/}
                    <td
                      style={{ width: '12%', paddingRight: 22 }}
                      className="operation-td"
                    >
                      {v.consumerName}
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
