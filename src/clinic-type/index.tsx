import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb } from 'qmkit';
import { Table, Button, Divider, message } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';

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
              <a onClick={() => this.delClinicType(record.id)}>Delete</a>
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
    this.getTypeList('clinicType');
  }
  getTypeList = async (type) => {
    const { res } = await webapi.getClinicsDictionaryList({
      type: type
    });
    if (res.code === 'K-000000') {
      this.setState({
        typeList: res.context
      });
    } else {
      message.error(res.message || 'get data faild');
    }
    console.log(this.state.typeList);
  };
  delClinicType = async (id) => {
    const { res } = await webapi.delClinicsDictionary({
      id: id
    });
    if (res.code === 'K-000000') {
      message.success(res.message || 'delete data success');
      this.getTypeList('clinicType');
    } else {
      message.error(res.message || 'delete data faild');
    }
    console.log(this.state.typeList);
  };
  handleTableChange(pagination: any) {
    console.log(pagination);
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
          <Button>
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
