import React from 'react';
import { Pagination, Spin, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';

interface Iprop {
  startDate: string;
  endDate: string;
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
                    <Row>
                      <Col span={6}>321321321321</Col>
                      <Col span={12}>432143214321</Col>
                      <Col span={6}>Order time: 2020-7-10</Col>
                    </Row>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: '30%' }}>images</td>
                  <td style={{ width: '10%' }}>Tom</td>
                  <td style={{ width: '10%' }}>$1312.00</td>
                  <td style={{ width: '10%' }}>12</td>
                  <td style={{ width: '20%' }}>PRESCRIP TIMD</td>
                  <td style={{ width: '10%' }}>Not shipped</td>
                  <td style={{ width: '10%' }}>To be recieved</td>
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

const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  }
};
