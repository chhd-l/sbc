import React from 'react';
import { Relax } from 'plume2';
import { Button, Popconfirm, Dropdown, Icon, Menu } from 'antd';
import { noop, ExportModal, AuthWrapper, checkAuth } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onBatchConfirm: Function;
      onShow: Function;
      exportModalData: any;
      onHideExportModal: Function;
      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
    };
  };

  static relaxProps = {
    onBatchConfirm: noop,
    onShow: noop,
    exportModalData: 'exportModalData',
    onHideExportModal: noop,
    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop
  };

  render() {
    const {
      onShow,
      onHideExportModal,
      exportModalData
    } = this.props.relaxProps;

    return (
      <div className="handle-bar">
        <AuthWrapper functionName="editOrderInvoices">
          <Button type="primary" onClick={() => onShow()}>
            {<FormattedMessage id="BulkExport" />}
          </Button>
        </AuthWrapper>
        {/* <AuthWrapper functionName="editOrderInvoices">
          <Button type="primary" onClick={() => onShow()}>
            {<FormattedMessage id="Refresh" />}
          </Button>
        </AuthWrapper>*/}
      </div>
    );
  }

  _handleBatchExport() {
    const {
      onExportByParams,
      onExportByIds,
      onExportModalChange
    } = this.props.relaxProps;
    onExportModalChange({
      visible: true,
      byParamsTitle: '导出筛选出的开票纪录',
      byIdsTitle: '导出选中的开票纪录',
      exportByParams: onExportByParams,
      exportByIds: onExportByIds
    });
  }
}
