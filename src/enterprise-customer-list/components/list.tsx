import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { fromJS, List } from 'immutable';
import { message, Tooltip } from 'antd';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthWrapper, Const, DataGrid, FindBusiness, noop } from 'qmkit';

declare type IList = List<any>;
import { Table } from 'antd';

const Column = Table.Column;

//默认每页展示的数量
const CUSTOMER_STATUS = {
  0: '启用',
  1: '禁用'
};

const STATUS = (status) => {
  if (status === 0) {
    return 1;
  } else if (status === 1) {
    return 0;
  }
};

const STATUS_OPERATE = (status) => {
  if (status === 0) {
    return '禁用';
  } else if (status === 1) {
    return '启用';
  }
};

@withRouter
@Relax
export default class CustomerList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      onSelect: Function;
      selected: IList;
      init: Function;
      onDelete: Function;
      //审核客户
      onCustomerStatus: Function;
      //启用/禁用
      onCheckStatus: Function;
      form: any;
      supplierNameMap: IMap;
      getSupplierNameByCustomerId: Function;
      setRejectModalVisible: Function;
      setForbidModalVisible: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    selected: 'selected',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    onSelect: noop,
    init: noop,
    onDelete: noop,
    onCustomerStatus: noop,
    onCheckStatus: noop,
    form: 'form',
    supplierNameMap: 'supplierNameMap',
    getSupplierNameByCustomerId: noop,
    setRejectModalVisible: noop,
    setForbidModalVisible: noop
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
      dataList,
      pageSize,
      total,
      currentPage,
      selected,
      onSelect,
      init,
      form,
      supplierNameMap
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={{ spinning: loading, indicator:<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px',height: '90px' }} alt="" /> }}
        rowKey="customerId"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title="Consumer name"
          key="customerName"
          dataIndex="customerName"
          render={(customerName) => (customerName ? customerName : '-')}
        />

        <Column
          title="Account number"
          key="customerAccount"
          dataIndex="customerAccount"
          render={(customerAccount, rowData) =>
            fromJS(rowData).get('isDistributor') == 1 ? (
              <div>
                <p>{customerAccount ? customerAccount : '-'}</p>
                <span style={styles.platform}>分销员</span>
              </div>
            ) : (
              <p>{customerAccount ? customerAccount : '-'}</p>
            )
          }
        />

        <Column
          title="Company type"
          key="businessNatureType"
          dataIndex="businessNatureType"
          render={(businessNatureType) =>
            businessNatureType
              ? FindBusiness.findBusinessNatureName(businessNatureType)
              : '-'
          }
        />

        <Column
          title="Company name"
          key="enterpriseName"
          dataIndex="enterpriseName"
          render={(enterpriseName) => (enterpriseName ? enterpriseName : '-')}
        />

        <Column
          title="Contact person"
          key="contactName"
          dataIndex="contactName"
          render={(contactName) => (contactName ? contactName : '-')}
        />

        <Column
          title="Contact information"
          key="contactPhone"
          dataIndex="contactPhone"
          render={(contactPhone) => (contactPhone ? contactPhone : '-')}
        />

        <Column
          title="Platform level"
          key="customerLevelName"
          dataIndex="customerLevelName"
          render={(customerLevelName) =>
            customerLevelName ? customerLevelName : '-'
          }
        />
        <Column
          title="Growth value"
          key="growthValue"
          dataIndex="growthValue"
          render={(growthValue) => (growthValue ? growthValue : 0)}
        />

        <Column
          title="Approval status"
          key="enterpriseCheckState"
          dataIndex="enterpriseCheckState"
          render={(enterpriseCheckState, record) => {
            let statusString = <div>-</div>;
            if (enterpriseCheckState == 1) {
              statusString = <div>待审核</div>;
            } else if (enterpriseCheckState == 2) {
              statusString = <div>已审核</div>;
            } else if (enterpriseCheckState == 3) {
              statusString = (
                <div>
                  <p>审核未通过</p>
                  <Tooltip
                    placement="top"
                    title={record['enterpriseCheckReason']}
                  >
                    <a href="javascript:void(0);">原因</a>
                  </Tooltip>
                </div>
              );
            }
            return statusString;
          }}
        />

        {form.get('enterpriseCheckState') === '' ||
        form.get('enterpriseCheckState') === '-1' ||
        form.get('enterpriseCheckState') === '2' ? (
          <Column
            title="Account status"
            key="customerStatus"
            dataIndex="customerStatus"
            render={(customerStatus, rowData) => {
              const data = fromJS(rowData);
              if (data.get('enterpriseCheckState') == 2) {
                if (customerStatus == 1) {
                  return (
                    <div>
                      <p>禁用</p>
                      <Tooltip placement="top" title={rowData['forbidReason']}>
                        <a href="javascript:void(0);">原因</a>
                      </Tooltip>
                    </div>
                  );
                } else {
                  return <span>{CUSTOMER_STATUS[customerStatus]}</span>;
                }
              } else {
                return <span>-</span>;
              }
            }}
          />
        ) : null}

        <Column
          title="Auditors"
          key="employeeName"
          dataIndex="employeeName"
          render={(employeeName) => (employeeName ? employeeName : '-')}
        />
      </DataGrid>
    );
  }
}

const styles = {
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  }
};
