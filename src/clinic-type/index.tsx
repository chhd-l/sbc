import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb } from 'qmkit';
import { Table, Button, Divider, message, Modal } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';

const { confirm } = Modal;

export default class ClinicList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: '30%'
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          width: '60%'
        },
        {
          title: 'Action',
          key: 'action',
          width: '10%',
          render: (text, record) => (
            <span>
              <Link to={'/clinic-type-edit/' + record.id}>Edit</Link>
              <Divider type="vertical" />
              <a onClick={() => this.showConfirm(record.id)}>Delete</a>
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
        if (res.code === 'K-000000') {
          let typeList = res.context.clinicsDictionaryVOList;

          if (typeList.length > 0) {
            pagination.total = res.context.total;
            pagination.current = res.context.currentPage + 1;
            this.setState({
              pagination: pagination,
              typeList: typeList
            });
          }
          if (typeList.length === 0 && pagination.total > 0) {
            pagination.current = res.context.currentPage;
            let params = {
              type: 'clinicType',
              pageNum: res.context.currentPage - 1,
              pageSize: pagination.pageSize
            };
            this.getTypeList(params);
          }
        } else {
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
      });
  };
  delClinicType = async (id) => {
    const { res } = await webapi.delClinicsDictionary({
      id: id
    });
    if (res.code === 'K-000000') {
      message.success('Successful');
      const { pagination } = this.state;
      let params = {
        type: 'clinicType',
        pageNum: pagination.current - 1,
        pageSize: pagination.pageSize
      };
      this.getTypeList(params);
    } else {
      message.error('Unsuccessful');
    }
    console.log(this.state.typeList);
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
      title: 'Are you sure to delete this item?',
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
        {/*导航面包屑*/}
        <div className="container">
          <Headline title="Prescriber Type" />
          {/*搜索条件*/}
          <Button style={{ backgroundColor: '#e2001a', color: '#FFFFFF' }}>
            <Link to="/clinic-type-add">Add</Link>
          </Button>
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
