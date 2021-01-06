import React from 'react';

import { Table, Button, Tooltip } from 'antd';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';
import { AuthWrapper, cache, noop, util } from 'qmkit';

import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

const DateTable = styled.div`
  .ant-table-thead > tr.ant-table-row-hover > td,
  .ant-table-tbody > tr.ant-table-row-hover > td,
  .ant-table-thead > tr:hover > td,
  .ant-table-tbody > tr:hover > td {
    background-color: #ffffff;
  }
  .tableRowCss {
    height: 80px !important;
    word-wrap: break-word;
    word-break: break-word;
  }
  .ant-table-thead {
    th {
      height: 38px;
      padding: 0;
    }
  }
`;

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      settleList: IList;
      exportSettlementDetailList: Function;
    };
    settleId: number;
  };

  static relaxProps = {
    settleList: 'settleList',
    exportSettlementDetailList: noop
  };

  UNSAFE_componentWillMount() {
    this.setState({ expandedRows: [] });
  }

  render() {
    const settleList = this.props.relaxProps.settleList
      ? this.props.relaxProps.settleList.toJS()
      : [];
    const { exportSettlementDetailList } = this.props.relaxProps;
    return (
      <div>
        <AuthWrapper functionName="f_sett_det_exp">
          <Button
            style={{ marginBottom: 20, marginTop: 20 }}
            disabled={settleList.length == 0}
            onClick={() => exportSettlementDetailList(this.props.settleId)}
          >
            {<FormattedMessage id="exportDetails" />}
          </Button>
        </AuthWrapper>
        <DateTable>
          <Table
            size="small"
            columns={this._renderColumns()}
            dataSource={settleList}
            pagination={false}
            onExpandedRowsChange={(expandedRows) => {
              this._onExpandedRowsChange(expandedRows);
            }}
            scroll={{ y: 600 }}
            rowClassName={() => {
              return 'tableRowCss';
            }}
          />
        </DateTable>
      </div>
    );
  }

  _onExpandedRowsChange = (expandedRows) => {
    this.setState({ expandedRows: expandedRows });
  };

  _renderColumns = (): any[] => {
    const currencySymbol = sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : '$';
    return [
      {
        title: 'Order number',
        key: 'tradeCode',
        dataIndex: 'tradeCode',
        /*render: (value, row) => {
          return this._handleRowSpan(row, value);
        },*/
        width: 160
      },
      {
        title: 'Payment credited',
        dataIndex: 'practicalPrice',
        key: 'practicalPrice',
        render: (value) => {
          return <p>{currencySymbol +''+ value}</p>
        },
        width: 120
      },
      /*{
        title: 'Order number',
        dataIndex: 'tradeCode',
        key: 'tradeCode',
        render: (value, row) => {
          return this._handleRowSpan(row, value);
        },
        width: 110
      },*/
      {
        title: 'Product name',
        dataIndex: 'goodsName',
        key: 'goodsName',
        render: (value, row, a) => {
          return row.goodsViewList.map((item, i) => {
            return (
              <Tooltip
                overlayStyle={{
                  overflowY: 'auto'
                  //height: 100
                }}
                placement="bottomLeft"
                title={row.goodsViewList.map((a, n) => {
                  return (
                    <p style={{ display: 'block', width: '100%' }} key={n}>
                      {a.goodsName}
                    </p>
                  );
                })}
              >
                {i <= 1 ? <div>{item.goodsName}</div> : ''}
              </Tooltip>
            );
          });
        },
        width: 160
      },
      {
        title: 'Product SKU',
        dataIndex: 'skuNo',
        key: 'skuNo',
        render: (value, row) => {
          return row.goodsViewList.map((item, i) => {
            return (
              <Tooltip
                overlayStyle={{
                  overflowY: 'auto'
                  //height: 100
                }}
                placement="bottomLeft"
                title={row.goodsViewList.map((a, n) => {
                  return (
                    <p style={{ display: 'block', width: '100%' }} key={n}>
                      {a.skuNo}
                    </p>
                  );
                })}
              >
                {i <= 1 ? <div>{item.skuNo}</div> : ''}
              </Tooltip>
            );
          });
        },
        width: 100

        /*render: (value, row) => {
          return (
            <div style={{ maxWidth: 200 }}>
              <span
                style={{
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {row.skuNo}
              </span>
              <span
                style={{
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {value}
              </span>
              <span
                style={{
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {row.specDetails}
              </span>
            </div>
          );
        }*/
      },
      /*{
        title: 'Product price',
        dataIndex: 'goodsPrice',
        key: 'goodsPrice',
        width: 100,
        render: (value) => {
          return util.FORMAT_YUAN(value.toFixed(2));
        }
      },*/
      {
        title: 'Product quantity',
        dataIndex: 'num',
        key: 'num',
        render: (value, row) => {
          return row.goodsViewList.map((item, i) => {
            return (
              <Tooltip
                overlayStyle={{
                  overflowY: 'auto'
                  //height: 100
                }}
                placement="bottomLeft"
                title={row.goodsViewList.map((a, n) => {
                  return (
                    <p style={{ display: 'block', width: '100%' }} key={n}>
                      {a.num}
                    </p>
                  );
                })}
              >
                {i <= 1 ? <div>{item.num}</div> : ''}
              </Tooltip>
            );
          });
        },
        width: 100
      }
      /*{
        title: 'Quantity',
        dataIndex: 'num',
        key: 'num',
        width: 50
      },

      {
        title: 'Freight',
        dataIndex: 'deliveryPrice',
        key: 'deliveryPrice',
        render: (value, row) => {
          return this._handleRowSpan(row, util.FORMAT_YUAN(value));
        },
        width: 100
      }*/
      // {
      //   title: '店铺应收金额',
      //   key: 'storePrice',
      //   dataIndex: 'storePrice',
      //   fixed: 'right',
      //   render: (value, row) => {
      //     return this._handleRowSpan(row, util.FORMAT_YUAN(value));
      //   },
      //   width: 140
      // }
    ];
  };

  _handleRowSpan = (row, value) => {
    const { expandedRows } = this.state;
    if (expandedRows.length != 0) {
      if (row.key.startsWith('p_') && expandedRows.indexOf(row.key) != -1) {
        return {
          children: value,
          props: { rowSpan: row.children ? row.children.length + 1 : 1 }
        };
      } else if (row.key.startsWith('c_')) {
        let isChild = false;
        expandedRows.forEach((rowKey) => {
          if (rowKey.split('_')[1] == rowKey.split('_')[1]) {
            isChild = true;
          }
        });
        if (isChild) {
          return {
            props: { rowSpan: 0 }
          };
        }
      }
    }
    return value;
  };
}
