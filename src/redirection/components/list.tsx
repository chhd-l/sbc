import React, { useEffect, useState } from 'react';
import { Popconfirm, Switch, Table, Tooltip } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { RCi18n } from 'qmkit';
import AddNewRedirectionModal from './AddNewRedirectionModal';

function List(props: any) {
  const { dataSource, Onchange, loading, init } = props;
  const [modalVisable, setModalVisable] = useState(false);
  const [RedirectionData, setRedirectionData] = useState(null);
  const [current, setcurrent] = useState(1);
  const columns = [
    {
      title: <FormattedMessage id='Content.URL' />,
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: <FormattedMessage id='Content.Redirection' />,
      dataIndex: 'redirectionUrl',
      key: 'redirectionUrl',
    },
    {
      title: <FormattedMessage id='Content.RedirectionType' />,
      dataIndex: 'code',
      key: 'code',
      render: (code) => (<div>
        {code === 301 ? <FormattedMessage id='Content.Permanent' /> : <FormattedMessage id='Content.Temporary' />}
      </div>)
    },
    {
      title: <FormattedMessage id='Content.Status' />,
      dataIndex: 'status',
      key: 'status',
      render: (status, rowinfo) => {
        return <Switch checked={status ? true : false} onChange={(e) => statusOnchange(e, rowinfo)} />
      }
    },
    {
      title: <FormattedMessage id='Content.Operation' />,
      key: 'Operation',
      render: (rowinfo) => (
        <div>
          {/* 编辑 */}
          <Tooltip placement="top" title={RCi18n({ id: 'edit' })}>
            <a
              className="iconfont iconEdit"
              style={{ margin: "0 5px" }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setModalVisable(true);
                setRedirectionData(rowinfo);
              }}
            ></a>
          </Tooltip>

          {/* 删除 */}
          <Popconfirm
            placement="topLeft"
            title="Are you sure you want to delete this redirection?"
            onConfirm={() => {
              redirectionUrlDel(rowinfo);
            }}
            okText="Confirm"
            cancelText="Cancel"
          >
            <Tooltip placement="top" title={RCi18n({ id: 'delete' })}>
              <a className="iconfont iconDelete" style={{ margin: "0 5px" }}></a>
            </Tooltip>
          </Popconfirm>
        </div>
      )
    },
  ];

  const statusOnchange = (value, rowinfo) => {
    Onchange(value, rowinfo);
  }
  const redirectionUrlDel = (rowinfo) => {
    props.redirectionDel(rowinfo);
  }
  return (
    <div>
      <Table
        rowKey={'url'}
        dataSource={dataSource || []}
        columns={columns}
        loading={loading}
        pagination={{
          current: current,
          total: dataSource?.length || 0,
          onChange: (page: number, pageSize?: number) => {
            setcurrent(page)
          }
        }}
      />
      {RedirectionData && (
        <AddNewRedirectionModal
          RedirectionData={{
            url: RedirectionData.url,
            redirectionUrl: RedirectionData.redirectionUrl,
            status: RedirectionData.status ? true : false,
            code: RedirectionData.code
          }}
          onCancel={() => setModalVisable(false)}
          visable={modalVisable}
          init={init}
        />
      )}
    </div>
  )
}

export default injectIntl(List);
