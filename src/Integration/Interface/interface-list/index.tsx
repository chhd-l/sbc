import React, { Component } from 'react';
import { BreadCrumb, Headline, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Input, Row, Col, Select, Button, Tooltip, Icon } from 'antd';
import Tab from '@/Integration/components/tab';

const { Option } = Select;

class InterfaceList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      list: [
        {
        InterfaceID:1,
        id:1
      },{
        InterfaceID:1,
        id:2
      },{
        InterfaceID:1,
        id:3
      },{
        InterfaceID:1,
        id:4
      },{
        InterfaceID:1,
        id:5
      },{
        InterfaceID:1,
        id:6
      },{
        InterfaceID:1,
        id:7
      },{
        InterfaceID:1,
        id:8
      },{
        InterfaceID:1,
        id:9
      },{
        InterfaceID:1,
        id:10
      },{
        InterfaceID:1,
        id:11
      },{
        InterfaceID:1,
        id:12
      },{
        InterfaceID:1,
        id:13
      },{
        InterfaceID:1,
        id:14
      }
      ],
      columns : [
        {
          title: 'Interface ID',
          dataIndex: 'InterfaceID',
          key: 'InterfaceID'
        },
        {
          title: 'Name',
          dataIndex: 'Name',
          key: 'Name'
        },
        {
          // title: <FormattedMessage id="Product.ProductCount" />,
          title: 'Provider',
          dataIndex: 'Provider',
          key: 'Provider'
        },
        {
          title: 'Invoker',
          dataIndex: 'Invoker',
          key: 'Invoker'
        },
        {
          title: 'Data Flow',
          dataIndex: 'DataFlow',
          key: 'DataFlow'
        },
        {
          title: 'URL',
          dataIndex: 'URL',
          key: 'URL'
        },
        {
          title: 'Method',
          dataIndex: 'Method',
          key: 'Method'
        },
        {
          title: 'Type',
          dataIndex: 'Type',
          key: 'Type'
        },
        {
          title: <FormattedMessage id="Product.Operation" />,
          dataIndex: 'Operation',
          key: 'Operation',
          render:(text, record)=> (
            <div>
              <Tooltip placement="top" title={<FormattedMessage id="Product.Edit" />}>
                <a style={styles.edit} onClick={() => this.openView(record)} className="iconfont iconsearch"/>
              </Tooltip>
            </div>
          )
        }
      ]
    };
  }
  openView = (row) =>{
    console.log(row);
  }
  onSearch = () => {
    console.log(this.props.form.getFieldsValue());
  };
  onSearchPage = (pagination)=>{
    this.setState({
      pagination:pagination
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={<FormattedMessage id="Interface.InterfaceList" />} />
          {/*搜索*/}
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('interfaceName', {
                    rules: [{ required: true, message: 'Please input your interfaceName!' }]
                  })(
                    <Input
                      addonBefore={
                        <p style={styles.label}>
                          <FormattedMessage id="Interface.InterfaceName" />
                        </p>
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('Provider', {
                    rules: [{ required: true, message: 'Please input your interfaceName!' }]
                  })(
                    <SelectGroup
                      label={<p style={styles.label}>{<FormattedMessage id="Interface.Provider" />}</p>}
                      style={{ width: 194 }}
                    >
                      <Option value="0">{<FormattedMessage id="Appointment.Booked" />}</Option>
                      <Option value="1">{<FormattedMessage id="Appointment.Arrived" />}</Option>
                      <Option value="2">{<FormattedMessage id="Appointment.Canceled" />}</Option>
                    </SelectGroup>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('Invoker', {
                    rules: [{ required: true, message: 'Please input your interfaceName!' }]
                  })(
                    <SelectGroup
                      label={<p style={styles.label}>{<FormattedMessage id="Interface.Invoker" />}</p>}
                      style={{ width: 194 }}
                    >
                      <Option value="0">{<FormattedMessage id="Appointment.Booked" />}</Option>
                      <Option value="1">{<FormattedMessage id="Appointment.Arrived" />}</Option>
                      <Option value="2">{<FormattedMessage id="Appointment.Canceled" />}</Option>
                    </SelectGroup>
                  )}
                </Form.Item>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button type="primary" onClick={this.onSearch}>
                  {<FormattedMessage id="Appointment.Search" />}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="container">
          <Tab
            dataSource={this.state.list}
            pagination={this.state.pagination}
            onChange={this.onSearchPage}
            columns={this.state.columns}
          />
        </div>
      </div>
    );
  }
}


const styles = {
  label: {
    width: 151,
    textAlign: 'center'
  },
  wrapper: {
    width: 177
  }
} as any;

export default Form.create()(InterfaceList);
