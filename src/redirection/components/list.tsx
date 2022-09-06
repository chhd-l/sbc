import React, { useEffect, useState } from 'react';
import { Popconfirm, Switch, Table, Tooltip } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import AddNewRedirectionModal from './AddNewRedirectionModal';

function List(props: any) {
  const { dataSource, Onchange, loading, init, pageNum, redirectionDel, onPageChange, total } = props;
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
      title: <FormattedMessage id='Content.encodeUrl' />,
      dataIndex: 'encodeUrl',
      key: 'encodeUrl',
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
        return <Switch checked={status ? true : false} onChange={(e) => Onchange(e, rowinfo)} />
      }
    },
    {
      title: <FormattedMessage id='Content.Operation' />,
      key: 'Operation',
      render: (rowinfo) => {
        // console.log('rowinfo', rowinfo)
        return (
          <div className='ssss'>
            {/* 编辑 */}
            <Tooltip placement="top" title={(window as any).RCi18n({ id: 'edit' })}>
              <a
                data-testid="iconEdit"
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
                redirectionDel(rowinfo);
              }}
              okText="Confirm"
              cancelText="Cancel"
            >
              <Tooltip placement="top" title={(window as any).RCi18n({ id: 'delete' })}>
                <a data-testid="iconDelete" className="iconfont iconDelete" style={{ margin: "0 5px" }}></a>
              </Tooltip>
            </Popconfirm>
          </div>
        )
      }
    },
  ];
  // console.log({ dataSource, Onchange, loading, init, pageNum, redirectionDel });
  // useEffect(() => {
  //   if (pageNum === 1) {
  //     setcurrent(pageNum)
  //   }

  // }, [pageNum])
  return (
    <div>
      <Table
        rowKey={'url'}
        dataSource={dataSource || []}
        columns={columns}
        loading={loading}
        pagination={{
          current: pageNum,
          total: total || 0,
          onChange: (page: number, pageSize?: number) => {
            setcurrent(page);
            onPageChange(page, pageSize)
          }
        }}
      />
      {RedirectionData && (
        <AddNewRedirectionModal
          RedirectionData={{
            url: RedirectionData.url,
            redirectionUrl: RedirectionData.redirectionUrl,
            status: RedirectionData.status ? true : false,
            code: RedirectionData.code,
            encodeUrl: RedirectionData?.encodeUrl ?? ''
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
