import React, { Component } from 'react';
import { BreadCrumb, Headline, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Input, Row, Col, Select, Button, Tooltip } from 'antd';
import Tab from '@/Integration/components/tab';
import { Link } from 'react-router-dom';

const { Option } = Select;
import { goodsList } from './webapi';

class InterfaceList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      pagination: {
        current: 1,
        pageNum: 0,
        pageSize: 10,
        total: 0
      },
      num: 2,
      dataSource: [],
      columns: [
        {
          title: <FormattedMessage id="Interface.InterfaceID" />,
          dataIndex: 'goodsId',
          key: 'goodsId'
        },
        {
          title: <FormattedMessage id="Interface.Name" />,
          dataIndex: 'goodsNo'
        },
        {
          title: <FormattedMessage id="Interface.Provider" />,
          dataIndex: 'Provider'
        },
        {
          title: <FormattedMessage id="Interface.Invoker" />,
          dataIndex: 'Invoker'
        },
        {
          title: <FormattedMessage id="Interface.DataFlow" />,
          dataIndex: 'DataFlow'
        },
        {
          title: <FormattedMessage id="Interface.URL" />,
          dataIndex: 'URL'
        },
        {
          title: <FormattedMessage id="Interface.Method" />,
          dataIndex: 'Method'
        },
        {
          title: <FormattedMessage id="Interface.Type" />,
          dataIndex: 'Type'
        },
        {
          title: <FormattedMessage id="Interface.Operation" />,
          dataIndex: 'Operation',
          render: (text, record) => (
            <div>
              <Tooltip placement="top" title={<FormattedMessage id="Interface.search" />}>
                <Link to={{ pathname: '/interface-detail', state: { id: record.id, activeKey: '1' } }}
                      className="iconfont iconsearch" />
              </Tooltip>
            </div>
          )
        }
      ]
    };
  }

  UNSAFE_componentWillMount() {
    this.getPageList();
  }

  getPageList = async () => {
    this.setState({ loading: true });
    const { res } = await goodsList(this.state.pagination);
    let newPagination = Object.assign(this.state.pagination, { 'total': res.context?.goodsPage?.total??0 });
    this.setState({ loading: false });
    this.setState({
      dataSource: res.context?.goodsPage.content??[],
      pagination: newPagination
    });
  };

  openView = (row) => {
    console.log(row);
  };
  onSearch = () => {
    let searchParams = {
      pageNum: 0,
      current: 1
    }
    this.setState({
      pagination: Object.assign(this.state.pagination,{...searchParams})
    });
    this.getPageList();
  };
  onSearchPage = (pagination) => {
    this.setState({
      pagination:Object.assign(this.state.pagination,pagination)
    });
    this.getPageList();
  };

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
                        shape="round"
                        onClick={this.onSearch}>
                  {<FormattedMessage id="Appointment.Search" />}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="container">
          <Tab
            loading={this.state.loading}
            dataSource={this.state.dataSource}
            pagination={this.state.pagination}
            onChange={this.onSearchPage}
            columns={this.state.columns}
            rowKey={(record) => record.goodsId}
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
