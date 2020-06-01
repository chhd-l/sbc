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
  Switch,
  Modal,
  InputNumber
} from 'antd';
import * as Api from './webapi';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
const { Column } = Table;

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

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
    dataIndex: 'valueEn',
    key: 'valueEn',
    sorter: (a, b) => a.valueEn.localeCompare(b.value)
  },
  {
    title: 'description',
    dataIndex: 'description',
    key: 'description',
    sorter: (a, b) => a.description.localeCompare(b.description)
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
class Dictionary extends Component<any, any> {
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
      loading: false,
      loginInfo: JSON.parse(sessionStorage.getItem('s2b-supplier@login')),
      dataSource: [],
      modalVisible: false
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log('收到表单值：', this.props.form.getFieldsValue());
  }
  componentDidMount() {
    this.getList();
  }
  async getList() {
    let res = await Api.fetchDicList({
      type: '',
      storeId: this.state.loginInfo.storeId
    });
    if (res.res.code === 'K-000000') {
      this.setState({
        dataSource: res.res.context.sysDictionaryVOS.slice(0, 5)
      });
      // dataSource = res.res.context.sysDictionaryVOS.slice(0 , 5)
    }
    console.log(res, 'res');
  }

  saveDic() {
    this.setState({ modalVisible: false });
  }
  render() {
    const { dataSource } = this.state;
    const { getFieldDecorator } = this.props.form;
    console.log(Api, 'Api');
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
                onClick={() => this.setState({ modalVisible: true })}
                type="primary"
                htmlType="submit"
                style={{ marginLeft: 8 }}
              >
                New
              </Button>
            </Form.Item>
          </Form>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{ showSizeChanger: true }}
          ></Table>
          <Modal
            title="New"
            visible={this.state.modalVisible}
            onOk={() => {
              this.saveDic();
            }}
            onCancel={() => this.setState({ modalVisible: false })}
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <FormItem label="Name">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Please input name!' }]
                })(
                  <Input
                    placeholder="Please input name"
                    style={{ width: 300 }}
                  />
                )}
              </FormItem>
              <FormItem label="Type">
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: 'Please select Type!' }]
                })(
                  <Select
                    placeholder="Please select Type"
                    style={{ width: 300 }}
                  >
                    <Option value="86">+86</Option>
                    <Option value="87">+87</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="Description">
                <Input
                  placeholder="Please input discription"
                  style={{ width: 300 }}
                />
              </FormItem>
              <FormItem label="Value">
                <Input
                  placeholder="Please input Value"
                  style={{ width: 300 }}
                />
              </FormItem>
              <FormItem label="ValueEn">
                <Input
                  placeholder="Please input ValueEn"
                  style={{ width: 300 }}
                />
              </FormItem>
              <FormItem label="Priority">
                <InputNumber
                  min={1}
                  max={10}
                  defaultValue={3}
                  onChange={() => {}}
                />
              </FormItem>
              <FormItem label="Is Enabled">
                <Switch checked={false} />
              </FormItem>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Form.create({ name: 'dictionary' })(Dictionary);
