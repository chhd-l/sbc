import React from 'react';
import { Pagination, Spin, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';

interface Iprop {
  startDate: string;
  endDate: string;
}

export default class SubscribInformation extends React.Component<Iprop, any> {
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
      return (
        <tr className="ant-table-row  ant-table-row-level-0" key={idx}>
          <td colSpan={7} style={{ padding: 0 }}>
            <table className="ant-table-self" style={{ border: '1px solid #ddd' }}>
              <thead>
                <tr>
                  <td colSpan={7}>
                    <div style={styles.orderCon}>
                      <span style={styles.orderId}>432143213243</span>
                      <span style={styles.orderTime}>Subscription time: 2020-07-10</span>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: '40%' }}>images</td>
                  <td style={{ width: '20%' }}>TomTTT</td>
                  <td style={{ width: '20%' }}>Every 4 Weeks</td>
                  <td rowSpan={2} style={{ width: '20%' }}>
                    Active
                  </td>
                </tr>
                <tr>
                  <td style={{ width: '40%' }}>images</td>
                  <td style={{ width: '20%' }}>TomTTT</td>
                  <td style={{ width: '20%' }}>Every 4 Weeks</td>
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
                      <th style={{ width: '40%' }}>Product</th>
                      <th style={{ width: '20%' }}>Product name</th>
                      <th style={{ width: '20%' }}>Frequency</th>
                      <th style={{ width: '20%' }}>Subscription status</th>
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

const styles = {
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
    width: '50%'
  },
  orderTime: {
    display: 'inline-block',
    width: '50%',
    fontSize: 14,
    textAlign: 'right',
    color: '#999'
  }
};
