import React from 'react';

import { Table, Button } from 'antd';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';
import { AuthWrapper, noop, util } from 'qmkit';

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
       {/* <AuthWrapper functionName="f_sett_det_exp">
          <Button
            style={{ marginBottom: 20 }}
            disabled={settleList.length == 0}
            onClick={() => exportSettlementDetailList(this.props.settleId)}
          >
            {<FormattedMessage id="exportDetails" />}
          </Button>
        </AuthWrapper>*/}
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
    return [
      /*{
        title: 'Serial Number',
        key: 'index',
        dataIndex: 'index',
        render: (value, row) => {
          return this._handleRowSpan(row, value);
        },
        width: 80
      },*/
      {
        title: <FormattedMessage id="OrderTime" />,
        dataIndex: 'finalTime',
        key: 'finalTime',
        render: (value, row) => {
          return this._handleRowSpan(row, value);
        },
      },
      {
        title:  <FormattedMessage id="OrderNumber" />,
        dataIndex: 'tradeCode',
        key: 'tradeCode',
        render: (value, row) => {
          return this._handleRowSpan(row, value);
        },
      },
      {
        title: <FormattedMessage id="OrderAmount" />,
        dataIndex: 'orderType',
        key: 'orderType',
      },
      /*{
        title: 'Product code/name/weight',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 220,
        render: (value, row) => {
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
        }
      },*/
      {
        title: <FormattedMessage id="RewardRate" />,
        dataIndex: 'cateName',
        key: 'cateName',
      },
      {
        title: 'Product Price',
        dataIndex: 'goodsPrice',
        key: 'goodsPrice',
        render: (value) => {
          return util.FORMAT_YUAN(value.toFixed(2));
        },
      },
      {
        title: <FormattedMessage id="RewardRemark" />,
        dataIndex: 'num',
        key: 'num',
      },

      {
        title: <FormattedMessage id="RewardAmount" />,
        dataIndex: 'deliveryPrice',
        key: 'deliveryPrice',
        render: (value, row) => {
          return this._handleRowSpan(row, util.FORMAT_YUAN(value));
        },
      }
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
