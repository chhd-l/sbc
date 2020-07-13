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
      dataList: IList;
      setlist: any;
      exportSettlementDetailList: Function;
    };
    settleId: number;
  };

  constructor(props) {
    super(props);
  }

  static relaxProps = {
    settleList: 'settleList',
    exportSettlementDetailList: noop,
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    setlist: 'setlist',
    dataList: 'dataList',
    init: noop,
    current: 'current'
  };

  UNSAFE_componentWillMount() {
    //const state = this.props.location.state;

    //console.log(state,11111111111111111111111);
    this.setState({ expandedRows: [] });
  }

  render() {
    const settleList = this.props.relaxProps.setlist
      ? this.props.relaxProps.setlist
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
        title: '',
        dataIndex: [],
        key: 'orderSource',
        width: 20
      },
      {
        title: <FormattedMessage id="OrderTime" />,
        dataIndex: 'tradeState.createTime',
        key: 'createTime',
        render: (value, row) => {
          let newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(value);
          return newDate;
        }
      },
      {
        title: <FormattedMessage id="OrderNumber" />,
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: <FormattedMessage id="OrderAmount" />,
        dataIndex: 'tradePrice.totalPrice',
        key: 'totalPrice'
      },

      {
        title: <FormattedMessage id="RewardRate" />,
        dataIndex: 'orderRewardRate',
        key: 'orderRewardRate',
        render: (value, row) => {
          return value ? value : '--' + '%';
        }
      },
      {
        title: <FormattedMessage id="RewardRemark" />,
        dataIndex: 'firstOrderFlag',
        key: 'firstOrderFlag',
        render: (value, row) => {
          let v = value == 0 ? 'First' : 'Repeat';

          return value ? v : '--';
        }
      },

      {
        title: <FormattedMessage id="RewardAmount" />,
        dataIndex: 'orderRewardAmount',
        key: 'orderRewardAmount',
        render: (value, row) => {
          return value ? value : '--';
        }
      },
      {
        title: '',
        dataIndex: [],
        key: 'clinicsId',
        width: 10
      }
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
