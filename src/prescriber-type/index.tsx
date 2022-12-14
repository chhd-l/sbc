import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, Const } from 'qmkit';
import { Table, Button, Divider, message, Modal, Popconfirm, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const { confirm } = Modal;

export default class ClinicList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      columns: [
        {
          title: <FormattedMessage id="Prescriber.Name" />,
          dataIndex: 'name',
          key: 'name',
          width: '30%',
          ellipsis: true
        },
        {
          title: <FormattedMessage id="Prescriber.Description" />,
          dataIndex: 'description',
          key: 'description',
          width: '60%',
          ellipsis: true
        },
        {
          title: <FormattedMessage id="Prescriber.Action" />,
          key: 'action',
          width: '10%',
          render: (text, record) => (
            <span>
              <Tooltip placement="top" title={<FormattedMessage id="Prescriber.Edit" />}>
                <Link className="iconfont iconEdit" to={'/prescriber-type-edit/' + record.id}></Link>
              </Tooltip>

              <Divider type="vertical" />

              <Popconfirm placement="topLeft" title={<FormattedMessage id="Prescriber.deleteThisItem" />} onConfirm={() => this.delClinicType(record.id)} okText={<FormattedMessage id="Prescriber.Confirm" />} cancelText={<FormattedMessage id="Prescriber.Cancel" />}>
                <Tooltip placement="top" title={<FormattedMessage id="Prescriber.Delete" />}>
                  <a type="link" className="iconfont iconDelete"></a>
                </Tooltip>
              </Popconfirm>
              {/* <a onClick={() => this.showConfirm(record.id)}>Delete</a> */}
            </span>
          )
        }
      ],
      typeList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      loading: false
    };
  }

  componentDidMount() {
    const { pagination } = this.state;
    let params = {
      type: 'clinicType',
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    };
    this.getTypeList(params);
  }

  getTypeList = (params) => {
    const { pagination } = this.state;

    webapi
      .getClinicsDictionaryListPage(params)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          let typeList = res.context.prescriberDictionaryVOList;

          if (typeList.length > 0) {
            pagination.total = res.context.total;
            pagination.current = res.context.currentPage + 1;
            this.setState({
              pagination: pagination,
              typeList: typeList
            });
          } else if (typeList.length === 0 && res.context.total > 0) {
            pagination.current = res.context.currentPage;
            let params = {
              type: 'clinicType',
              pageNum: res.context.currentPage - 1,
              pageSize: pagination.pageSize
            };
            this.getTypeList(params);
          } else {
            pagination.total = res.context.total;
            pagination.current = res.context.currentPage + 1;
            this.setState({
              pagination: pagination,
              typeList: typeList
            });
          }
        }
      })
      .catch((err) => {});
  };
  delClinicType = async (id) => {
    const { res } = await webapi.delClinicsDictionary({
      id: id
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success(<FormattedMessage id="Prescriber.OperateSuccessfully" />);
      const { pagination } = this.state;
      let params = {
        type: 'clinicType',
        pageNum: pagination.current - 1,
        pageSize: pagination.pageSize
      };
      this.getTypeList(params);
    }
  };
  handleTableChange = (pagination: any) => {
    let params = {
      type: 'clinicType',
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    };

    this.getTypeList(params);
  };

  showConfirm(id) {
    const that = this;
    confirm({
      title: <FormattedMessage id="Prescriber.deleteThisItem" />,
      onOk() {
        return that.delClinicType(id);
      },
      onCancel() {}
    });
  }

  render() {
    const { columns } = this.state;
    return (
      <div>
        <BreadCrumb />
        {/*???????????????*/}
        <div className="container-search">
          <Headline title={<FormattedMessage id="Prescriber.PrescriberType" />} />
          {/*????????????*/}
          <Button style={{ backgroundColor: '#e2001a', color: '#FFFFFF' }}>
            <Link to="/prescriber-type-add">
              <FormattedMessage id="Prescriber.Add" />
            </Link>
          </Button>
        </div>
        <div className="container">
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={this.state.typeList}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}
