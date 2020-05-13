import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb } from 'qmkit';
import { Form, Select, Table } from 'antd';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const Option = Select.Option;

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
          title: 'Descripetion',
          dataIndex: 'descripetion',
          key: 'descripetion',
          width: '60%'
        },
        {
          title: 'Action',
          key: 'action',
          width: '10%',
          render: (text, record) => (
            <span>
              <a>View</a>
            </span>
          )
        }
      ],
      typeList: [
        {
          id: '1',
          name: 'clinics',
          descripetion:
            'clinics descripetion clinics descripetion clinics descripetion clinics descripetion'
        },
        {
          id: '2',
          name: 'spt',
          descripetion:
            'spt descripetion spt descripetion spt descripetion spt descripetion spt descripetion'
        },
        {
          id: '3',
          name: 'pro',
          descripetion:
            'pro descripetion pro descripetion pro descripetion pro descripetion'
        }
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      loading: false
    };
  }
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
          <Headline title="Prescriber List" />
          {/*搜索条件*/}
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
