import React, { useState, useEffect } from 'react';
import { Button, Modal, Table, message } from 'antd';
import { Const, RCi18n } from 'qmkit';
import { getOperationLog } from '../webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { ColumnProps } from 'antd/es/table';

interface IProp {
  goodsId: string;
};

const OperationLog: React.FC<IProp> = (props: IProp) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pager, setPager] = useState({ total: 0, current: 1, pageSize: 10 });
  const [list, setList] = useState([]);

  const handleClose = () => {
    setVisible(false);
    setList([]);
    setPager({ total: 0, current: 1, pageSize: 10 });
  };

  const handleTriggerClick = () => {
    setVisible(true);
    if (list.length === 0) {
      getOperationLogList(0, pager.pageSize);
    }
  };

  const handelPageChange = (current: number) => {
    setPager(Object.assign({}, pager, { current }));
    getOperationLogList(current - 1, pager.pageSize);
  };

  const getOperationLogList = async (pageNum: number, pageSize: number) => {
    setLoading(true);
    const { res } = await getOperationLog({ goodsId: props.goodsId, pageNum, pageSize });
    if (res.code === Const.SUCCESS_CODE) {
      setList(res.context?.opLogPage?.content ?? []);
      setPager(Object.assign({}, pager, { total: res.context?.opLogPage?.total ?? 0, current: pageNum + 1 }));
    }
    setLoading(false);
  };

  const columns: ColumnProps<any>[] = [
    {
      title: <FormattedMessage id="Subscription.operatorColumns.Operator" />,
      dataIndex: 'opAccount',
      key: 'opAccount'
    },
    {
      title: <FormattedMessage id="Subscription.operatorColumns.Time" />,
      dataIndex: 'opTime',
      key: 'opTime',
      render: (text) => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
    },
    {
      title: <FormattedMessage id="Subscription.operatorColumns.OperationCategory" />,
      dataIndex: 'opCode',
      key: 'opCode'
    },
    {
      title: <FormattedMessage id="Subscription.operatorColumns.OperationLog" />,
      dataIndex: 'opContext',
      key: 'opContext'
    }
  ];

  return (
    <div style={{marginBottom:16}}>
      <Button type="primary" onClick={handleTriggerClick}><FormattedMessage id="Order.Operation Log" /></Button>
      <Modal
        title={<FormattedMessage id="Order.Operation Log" />}
        width={880}
        visible={visible}
        footer={null}
        onCancel={handleClose}
      >
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={{
            ...pager,
            onChange: handelPageChange
          }}
        />
      </Modal>
    </div>
  );
};

export default OperationLog;
