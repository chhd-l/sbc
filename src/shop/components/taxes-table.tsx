import React from 'react';
import { Popconfirm, Switch, Tooltip, Table } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
/**
 * 订单收款单列表
 */
class TaxesTable extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }

  props: {
    intl: any;
  };

  static getDerivedStateFromProps(props, state) {
    // 当传入的值发生变化的时候，更新state
    if (JSON.stringify(props.dataList) !== JSON.stringify(state.dataList)) {
      return {
        dataList: props.dataList,
        pagination: props.pagination
      };
    }

    return null;
  }

  updateStatus = (check, row) => {
    let param = {
      id: row.id,
      taxZoneStatus: +check
    };
    this.props.updateFunction(param);
  };

  deleteTax = (id) => {
    this.props.deleteFunction(id);
  };

  handleTableChange = (pagination) => {
    this.props.tableChangeFunction(pagination);
  };
  openEditPage = (row) => {
    this.props.editFunction(row);
  };

  render() {
    const { dataList, pagination } = this.state;
    const columns = [
      {
        title: this.props.intl.formatMessage({ id: 'Setting.Nod' }),
        key: 'index',
        width: '6%',
        render: (text, row, index) => <p>{index + 1}</p>
      },
      {
        title: this.props.intl.formatMessage({ id: 'Setting.ZoneName' }),
        key: 'zoneName',
        dataIndex: 'taxZoneName',
        width: '10%'
      },
      {
        title: this.props.intl.formatMessage({ id: 'Setting.ZoneType' }),
        key: 'zoneType',
        dataIndex: 'taxZoneType',
        width: '10%',
        render: (text) => {
          return <p>{text ? this.props.intl.formatMessage({ id: 'Setting.Countrybased' }) : this.props.intl.formatMessage({ id: 'Setting.Statesbased' })}</p>;
        }
      },
      {
        title: this.props.intl.formatMessage({ id: 'Setting.Raterange' }),
        key: 'taxRate',
        dataIndex: 'taxRate',
        width: '10%'
      },
      {
        title: this.props.intl.formatMessage({ id: 'Setting.Status' }),
        key: 'taxZoneStatus',
        dataIndex: 'taxZoneStatus',
        width: '10%',
        render: (text, row) => {
          let check = +text ? true : false;
          return (
            <Popconfirm
              title={this.props.intl.formatMessage({ id: 'Setting.Areyousureto' }) + (check ? this.props.intl.formatMessage({ id: 'Setting.disable' }) : this.props.intl.formatMessage({ id: 'Setting.enable' })) + this.props.intl.formatMessage({ id: 'Setting.this' }) + ' ?'}
              onConfirm={() => this.updateStatus(!check, row)}
              okText={this.props.intl.formatMessage({ id: 'Setting.Yes' })}
              cancelText={this.props.intl.formatMessage({ id: 'Setting.No' })}
            >
              <Switch checked={check} />
            </Popconfirm>
          );
        }
      },
      {
        title: this.props.intl.formatMessage({ id: 'Setting.Operation' }),
        dataIndex: 'operation',
        className: 'drag-visible',
        width: '8%',
        render: (text, row) => (
          <div>
            <Tooltip placement="top" title={this.props.intl.formatMessage({ id: 'Setting.Edit' })}>
              <a style={{ marginRight: 10 }} className="iconfont iconEdit" onClick={() => this.openEditPage(row)}></a>
            </Tooltip>

            <Popconfirm
              placement="topLeft"
              title={this.props.intl.formatMessage({ id: 'Setting.Areyousuretodelete' })}
              onConfirm={() => this.deleteTax(row.id)}
              okText={this.props.intl.formatMessage({ id: 'Setting.Confirm' })}
              cancelText={this.props.intl.formatMessage({ id: 'Setting.Cancel' })}
            >
              <Tooltip placement="top" title={this.props.intl.formatMessage({ id: 'Setting.Delete' })}>
                <a className="iconfont iconDelete"></a>
              </Tooltip>
            </Popconfirm>
          </div>
        )
      }
    ];
    return <Table rowKey="id" columns={columns} dataSource={dataList} pagination={pagination} onChange={this.handleTableChange}></Table>;
  }
}

export default injectIntl(TaxesTable);
