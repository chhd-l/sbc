import React, { Component } from 'react';
import { BreadCrumb, Headline, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Input, Row, Col, Select, Button, Tooltip } from 'antd';
import Tab from '@/Integration/components/tab';
import {Link} from 'react-router-dom'
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
      num:2,
      dataSource: [
        {
        InterfaceID:1,
        id:1
      },{
        InterfaceID:1,
        id:2
      }
      ],
      columns : [
        {
          title: <FormattedMessage id="Interface.InterfaceID" />,
          dataIndex: 'InterfaceID',
          key: 'InterfaceID'
        },
        {
          title: <FormattedMessage id="Interface.Name" />,
          dataIndex: 'Name',
        },
        {
          title: <FormattedMessage id="Interface.Provider" />,
          dataIndex: 'Provider',
        },
        {
          title: <FormattedMessage id="Interface.Invoker" />,
          dataIndex: 'Invoker',
        },
        {
          title: <FormattedMessage id="Interface.DataFlow" />,
          dataIndex: 'DataFlow',
        },
        {
          title: <FormattedMessage id="Interface.URL" />,
          dataIndex: 'URL',
        },
        {
          title: <FormattedMessage id="Interface.Method" />,
          dataIndex: 'Method',
        },
        {
          title: <FormattedMessage id="Interface.Type" />,
          dataIndex: 'Type',
        },
        {
          title: <FormattedMessage id="Interface.Operation" />,
          dataIndex: 'Operation',
          render:(text, record)=> (
            <div>
              <Tooltip placement="top" title={<FormattedMessage id="Interface.search" />}>
                <Link to={'/interface-detail/'+record.id} className="iconfont iconsearch"/>
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
                <Button type="primary"
                        htmlType="submit"
                        icon="search"
                        shape="round" onClick={this.onSearch}>
                  {<FormattedMessage id="Appointment.Search" />}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="container">
          <Tab
            rowKey={({ id })=>id}
            dataSource={this.state.dataSource}
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
  }
} as any;

export default Form.create()(InterfaceList);
