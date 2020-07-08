import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { fromJS } from 'immutable';
import { Tooltip, Table } from 'antd';
import { withRouter } from 'react-router';
import { DataGrid, noop, FindArea } from 'qmkit';
import { List } from 'immutable';
import { FormattedMessage } from 'react-intl';

declare type IList = List<any>;

const Column = Table.Column;

//默认每页展示的数量
const CUSTOMER_STATUS = {
  0: '启用',
  1: '禁用'
};

@withRouter
@Relax
export default class SelfCustomerList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      selfDataList: IList;
      selfTotal: number;
      selfPageSize: number;
      selfCurrentPage: number;
      initForSelf: Function;
      selfForm: any;
      supplierNameMap: IMap;
      getSupplierNameByCustomerId: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    selfTotal: 'selfTotal',
    selfPageSize: 'selfPageSize',
    selfCurrentPage: 'selfCurrentPage',
    selfDataList: 'selfDataList',
    initForSelf: noop,
    selfForm: 'selfForm',
    supplierNameMap: 'supplierNameMap',
    getSupplierNameByCustomerId: noop
  };

  UNSAFE_componentWillMount() {
    this.setState({
      tooltipVisible: {},
      rejectDomVisible: false
    });
  }

  render() {
    const {
      loading,
      selfDataList,
      selfPageSize,
      selfTotal,
      selfCurrentPage,
      initForSelf,
      selfForm,
      supplierNameMap
    } = this.props.relaxProps;

    return (
      <DataGrid
        loading={loading}
        rowKey="customerId"
        className="resetTable"
        pagination={{
          current: selfCurrentPage,
          pageSize: selfPageSize,
          total: selfTotal,
          onChange: (pageNum, pageSize) => {
            initForSelf({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={selfDataList.toJS()}
      >
        <Column
          title={<FormattedMessage id="consumerName" />}
          key="customerName"
          dataIndex="customerName"
          render={(customerName) => (customerName ? customerName : '-')}
        />

        <Column
          title={<FormattedMessage id="accountNumber" />}
          key="customerAccount"
          dataIndex="customerAccount"
        />

        <Column
          title={<FormattedMessage id="platformLevel" />}
          key="customerLevelName"
          dataIndex="customerLevelName"
          render={(customerLevelName) =>
            customerLevelName ? customerLevelName : '-'
          }
        />
        {/* 
        <Column
          title="成长值"
          key='growthValue'
          dataIndex='growthValue'
        /> */}

        <Column
          title={<FormattedMessage id="area" />}
          width="166px"
          render={(rowData) => {
            const data = fromJS(rowData);
            const provinceId = data.get('provinceId')
              ? data.get('provinceId').toString()
              : '';
            const cityId = data.get('cityId')
              ? data.get('cityId').toString()
              : '';
            const areaId = data.get('areaId')
              ? data.get('areaId').toString()
              : '';
            return provinceId
              ? FindArea.addressInfo(provinceId, cityId, areaId)
              : '-';
          }}
        />

        <Column
          title={<FormattedMessage id="contactPerson" />}
          key="contactName"
          dataIndex="contactName"
          render={(contactName) => (contactName ? contactName : '-')}
        />

        <Column
          title={<FormattedMessage id="contactPhoneNumber" />}
          key="contactPhone"
          dataIndex="contactPhone"
          render={(contactPhone) => (contactPhone ? contactPhone : '-')}
        />

        <Column
          title={<FormattedMessage id="consumerType" />}
          key="customerType"
          dataIndex="customerType"
          render={(customerType, record) =>
            customerType == 1 ? (
              <div>
                <p>商家客户</p>
                <Tooltip
                  placement="top"
                  title={
                    supplierNameMap.get((record as any).customerId)
                      ? supplierNameMap.get((record as any).customerId)
                      : ''
                  }
                  visible={
                    this.state.tooltipVisible[(record as any).customerId]
                      ? this.state.tooltipVisible[(record as any).customerId]
                      : false
                  }
                >
                  <a
                    href="javascript:void(0);"
                    onMouseEnter={() =>
                      this._renderToolTips((record as any).customerId, true)
                    }
                    onMouseOut={() =>
                      this._renderToolTips((record as any).customerId, false)
                    }
                  >
                    <FormattedMessage id="view" />
                  </a>
                </Tooltip>
              </div>
            ) : (
              <div>{<FormattedMessage id="platformConsumers" />}</div>
            )
          }
        />

        <Column
          title={<FormattedMessage id="approvalStatus" />}
          key="checkState"
          dataIndex="checkState"
          render={(checkState, record) => {
            let statusString = <div>-</div>;
            if (checkState == 0) {
              statusString = (
                <div>{<FormattedMessage id="pendingReview" />}</div>
              );
            } else if (checkState == 1) {
              statusString = <div>{<FormattedMessage id="audited" />}</div>;
            } else if (checkState == 2) {
              statusString = (
                <div>
                  <p>{<FormattedMessage id="reviewFailed" />}</p>
                  <Tooltip placement="top" title={record['rejectReason']}>
                    <a href="javascript:void(0);">原因</a>
                  </Tooltip>
                </div>
              );
            }
            return statusString;
          }}
        />

        {selfForm.get('checkState') === '' ||
        selfForm.get('checkState') === '-1' ||
        selfForm.get('checkState') === '1' ? (
          <Column
            title={<FormattedMessage id="accountStatus" />}
            key="customerStatus"
            dataIndex="customerStatus"
            render={(customerStatus, rowData) => {
              const data = fromJS(rowData);
              if (data.get('checkState') == 1) {
                if (customerStatus == 1) {
                  return (
                    <div>
                      <p>{<FormattedMessage id="disabled" />}</p>
                      <Tooltip placement="top" title={rowData['forbidReason']}>
                        <a href="javascript:void(0);">原因</a>
                      </Tooltip>
                    </div>
                  );
                } else {
                  return <p>{<FormattedMessage id="enable" />}</p>;
                }
              } else {
                return <span>-</span>;
              }
            }}
          />
        ) : null}

        <Column
          title={<FormattedMessage id="auditors" />}
          key="employeeName"
          dataIndex="employeeName"
          render={(employeeName) => (employeeName ? employeeName : '-')}
        />
      </DataGrid>
    );
  }

  _renderToolTips = async (customerId, visible) => {
    let { tooltipVisible } = this.state;
    const {
      supplierNameMap,
      getSupplierNameByCustomerId
    } = this.props.relaxProps;
    let newState = {};
    if (visible && !supplierNameMap.get(customerId)) {
      await getSupplierNameByCustomerId(customerId);
    }
    tooltipVisible[customerId] = visible;
    newState['tooltipVisible'] = tooltipVisible;
    this.setState(newState);
  };
}
