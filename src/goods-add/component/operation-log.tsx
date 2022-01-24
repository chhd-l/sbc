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
  };

  const handleTriggerClick = () => {
    setVisible(true);
    if (list.length === 0) {
      getOperationLogList(pager.current - 1, pager.pageSize);
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
      setPager(Object.assign({}, pager, { total: res.context?.opLogPage?.total ?? 0 }));
    }
    setLoading(false);
  };

  const columns: ColumnProps<any>[] = [
    {
      title: 'Operator',
      dataIndex: 'opAccount',
      key: 'opAccount'
    },
    {
      title: 'Time',
      dataIndex: 'opTime',
      key: 'opTime',
      render: (text) => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
    },
    {
      title: 'Code',
      dataIndex: 'opCode',
      key: 'opCode'
    },
    {
      title: 'Log',
      dataIndex: 'opContext',
      key: 'opContext'
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={handleTriggerClick}>Operation log</Button>
      <Modal
        title="Operation log"
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
