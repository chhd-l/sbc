import React from 'react';
import { Pagination, Spin, Badge } from 'antd';
import { FormattedMessage } from 'react-intl';

interface Iprop {
  startDate: string;
  endDate: string;
}

interface Istyle {
  [key: string]: React.CSSProperties;
}

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
                      <span style={styles.orderNo}>4321543154335</span>
                      <span style={styles.orderTime}>
                        <FormattedMessage id="PetOwner.OrderTime" />: 2020-07-10
                      </span>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: '30%' }}>
                    <FormattedMessage id="PetOwner.images" />
                  </td>
                  <td style={{ width: '10%' }}>
                    <FormattedMessage id="PetOwner.Tom" />
                  </td>
                  <td style={{ width: '10%' }}>$1312.00</td>
                  <td style={{ width: '10%' }}>12</td>
                  <td style={{ width: '20%' }}>
                    <FormattedMessage id="PetOwner.PRESCRIPTIMD" />
                  </td>
                  <td style={{ width: '10%' }}>
                    <FormattedMessage id="PetOwner.NotShipped" />
                  </td>
                  <td style={{ width: '10%' }}>
                    <Badge color="green" text="To be received" />
                  </td>
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
                      <th style={{ width: '30%' }}>
                        <FormattedMessage id="PetOwner.Product" />
                      </th>
                      <th style={{ width: '10%' }}>
                        <FormattedMessage id="PetOwner.Recipient" />
                      </th>
                      <th style={{ width: '10%' }}>
                        <FormattedMessage id="PetOwner.Amount" />
                      </th>
                      <th style={{ width: '10%' }}>
                        <FormattedMessage id="PetOwner.Quantity" />
                      </th>
                      <th style={{ width: '20%' }}>
                        <FormattedMessage id="PetOwner.PrescriberName" />
                      </th>
                      <th style={{ width: '10%' }}>
                        <FormattedMessage id="PetOwner.ShippingStatus" />
                      </th>
                      <th style={{ width: '10%' }}>
                        <FormattedMessage id="PetOwner.OrderStatus" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">{loading ? this._renderLoading() : this._renderContent(orderList)}</tbody>
                </table>
              </div>
              {!loading && pagination.total === 0 ? (
                <div className="ant-table-placeholder">
                  <span>
                    <i className="anticon anticon-frown-o" />
                    <FormattedMessage id="PetOwner.noData" />
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
  }
};
