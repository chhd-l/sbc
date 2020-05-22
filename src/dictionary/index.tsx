import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb } from 'qmkit';
import {
  Form,
  Select,
  Input,
  Button,
  Table,
  Divider,
  message,
  Switch
} from 'antd';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';

const FormItem = Form.Item;
const Option = Select.Option;

const dataSource = [
  {
    key: '1',
    name: 'SH',
    type: 'City',
    value: 'SH',
    discription: 'SH',
    priority: '3',
    isEnabled: true
  },
  {
    key: '2',
    name: 'BJ',
    type: 'City',
    value: 'BJ',
    discription: 'BJ',
    priority: '2',
    isEnabled: false
  },
  {
    key: '3',
    name: 'SZ',
    type: 'City',
    value: 'SZ',
    discription: 'SZ',
    priority: '1',
    isEnabled: true
  }
];

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: 'type',
    dataIndex: 'type',
    key: 'type',
    sorter: (a, b) => a.type.localeCompare(b.type)
  },
  {
    title: 'value',
    dataIndex: 'value',
    key: 'value',
    sorter: (a, b) => a.value.localeCompare(b.value)
  },
  {
    title: 'discription',
    dataIndex: 'discription',
    key: 'discription',
    sorter: (a, b) => a.discription.localeCompare(b.discription)
  },
  {
    title: 'priority',
    dataIndex: 'priority',
    key: 'priority',
    sorter: (a, b) => a.priority - b.priority
  },
  {
    title: 'Is Enabled',
    dataIndex: 'isEnabled',
    key: 'isEnabled',
    sorter: (a, b) => a.isEnabled - b.isEnabled,
    render: (isEnabled) => {
      return <Switch checked={isEnabled} />;
    }
  },
  {
    title: 'Option',
    dataIndex: 'option',
    key: 'option',
    render: () => (
      <span>
        <a>edit</a>&nbsp;
        <a>delete</a>
      </span>
    )
  }
];
export default class ClinicList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'Prescriber ID',
          dataIndex: 'clinicsId',
          key: 'clinicID'
        },
        {
          title: 'Prescriber Name',
          dataIndex: 'clinicsName',
          key: 'clinicName'
        },
        {
          title: 'Prescriber Phone',
          dataIndex: 'phone',
          key: 'clinicPhone'
        },
        {
          title: 'Prescriber City',
          dataIndex: 'primaryCity',
          key: 'clinicCity'
        },
        {
          title: 'Prescriber Zip',
          dataIndex: 'primaryZip',
          key: 'clinicZip'
        },
        {
          title: 'Longitude',
          dataIndex: 'longitude',
          key: 'longitude'
        },
        {
          title: 'Latitude',
          dataIndex: 'latitude',
          key: 'latitude'
        },
        {
          title: 'Prescriber Type',
          dataIndex: 'prescriberType',
          key: 'prescriberType'
        },
        {
          title: 'Reward Rate',
          dataIndex: 'rewardRate',
          key: 'rewardRate'
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <span>
              <Link to={'/clinic-edit/' + record.clinicsId}>Edit</Link>
              <Divider type="vertical" />
              {/* <a onClick={() => this.delClinic(record.clinicsId)}>Delete</a> */}
            </span>
          )
        }
      ],
      clinicList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      searchForm: {
        clinicsId: '',
        clinicsName: '',
        phone: '',
        primaryCity: '',
        primaryZip: ''
      },
      loading: false
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log('收到表单值：', this.props.form.getFieldsValue());
  }
  render() {
    // const { columns } = this.state;
    return (
      <div>
        {/* <BreadCrumb /> */}
        {/*导航面包屑*/}
        <div className="container">
          <Headline title="Dictionary" />
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <FormItem label="Keyword">
              <Input
                placeholder="Please input name or discription"
                style={{ width: 300 }}
              />
            </FormItem>
            <FormItem label="Type">
              <Select placeholder="Please select Type" style={{ width: 300 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
              </Select>
            </FormItem>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: 8 }}
              >
                Reset
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: 8 }}
              >
                New
              </Button>
            </Form.Item>
          </Form>
          <Table dataSource={dataSource} columns={columns} />;
        </div>
      </div>
    );
  }
}
