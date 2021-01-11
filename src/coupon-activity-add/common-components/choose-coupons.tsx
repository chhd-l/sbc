import * as React from 'react';
import { Button, Form, InputNumber, Table } from 'antd';
import { AuthWrapper, DataGrid, ValidConst, cache } from 'qmkit';
import CouponsModal from './coupons-modal';

import styled from 'styled-components';

const Column = Table.Column;
const FormItem = Form.Item;

const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
`;

/**
 * 选择优惠券组件
 */
export default class ChooseCoupons extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      // 弹出框可见性
      modalVisible: false
    };
  }

  render() {
    const { coupons, invalidCoupons, form, type } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Button type="primary" icon="plus" onClick={() => this.changeModalVisible(true)}>
          Select coupons
        </Button>
        <span style={{ color: '#999', marginLeft: 8 }}> {'' + (type == 2 ? 'Up to ten coupons' : '')}</span>
        <TableRow>
          <DataGrid
            scroll={{ y: 500 }}
            size="small"
            rowKey={(record) => record.couponId}
            dataSource={coupons}
            pagination={false}
            rowClassName={(record) => {
              if (invalidCoupons.includes(record.couponId)) {
                return 'red';
              }
              return '';
            }}
          >
            <Column title="Coupon name" dataIndex="couponName" key="couponName" width="15%" />

            <Column title={`Coupon  value( ${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)} )`} dataIndex="denominationStr" key="denominationStr" width="15%" />

            <Column
              title="Valid period"
              dataIndex="validity"
              key="validity"
              width="30%"
              render={(value) => {
                if (value) {
                  return value;
                } else {
                  return '-';
                }
              }}
            />

            <Column
              title={
                <div style={{ minWidth: 140 }}>
                  <p>
                    <span style={{ color: 'red' }}>*</span> {type == 0 ? '总张数' : 'Total number'}
                  </p>
                  <p style={{ color: '#999' }}> {type == 0 ? '（1-999999999张）' : ''}</p>
                </div>
              }
              key="totalCount"
              dataIndex="totalCount"
              width="20%"
              render={(value, rowData, index) => {
                const message = type == 0 ? '请输入1-999999999的整数' : '请输入1-10的整数';
                return (
                  <FormItem>
                    {getFieldDecorator('couponId_' + (rowData as any).couponId, {
                      rules: [
                        { required: true, message: '请输入优惠券的的数量' },
                        {
                          pattern: ValidConst.noZeroNineNumber,
                          message: message
                        },
                        {
                          validator: (_rule, value, callback) => {
                            if (type != 0 && value > 10) {
                              callback('请输入1-10的整数');
                            }
                            callback();
                          }
                        }
                      ],
                      onChange: (val) => {
                        this.props.onChangeCouponTotalCount(index, val);
                      },
                      initialValue: value
                    })(<InputNumber min={1} max={999999999} />)}
                  </FormItem>
                );
              }}
            />

            <Column
              title="Operation"
              key="operate"
              width="10%"
              render={(row) => {
                return (
                  <div>
                    <AuthWrapper functionName={'f_coupon_detail'}>
                      <a style={{ textDecoration: 'none' }} href={`/coupon-detail/${row.couponId}`} target="_blank">
                        详情
                      </a>
                    </AuthWrapper>
                    &nbsp;&nbsp;
                    <a onClick={() => this.props.onDelCoupon(row.couponId)}>删除</a>
                  </div>
                );
              }}
            />
          </DataGrid>
        </TableRow>
        {this.state.modalVisible && (
          <CouponsModal
            selectedRows={coupons}
            onOk={(coupons) => {
              this.changeModalVisible(false);
              this.props.onChosenCoupons(coupons);
            }}
            onCancel={() => this.changeModalVisible(false)}
          />
        )}
      </div>
    );
  }

  /**
   * 设置优惠券弹窗可见性
   */
  changeModalVisible = (flag) => {
    this.setState({
      modalVisible: flag
    });
  };
}
