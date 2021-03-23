import React from 'react';
import { Headline, BreadCrumb, history, SelectGroup } from 'qmkit';
import { Table, Form, Row, Col, Input, DatePicker, Button, Select } from 'antd';
import { getAppointmentList } from './webapi';

const FormItem = Form.Item;
const Option = Select.Option;

export default class AppointmentList extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      list: [],
      searchForm: {},
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }

  componentDidMount() {
    this.getAppointmentList();
  }

  getAppointmentList = () => {
    const { searchForm, pagination } = this.state;
    this.setState({ loading: true });
    getAppointmentList({ ...searchForm, pageNum: pagination.current - 1, pageSize: pagination.pageSize })
      .then((data) => {
        this.setState({
          loading: false,
          list: data.res.context.page.content,
          pagination: {
            ...pagination,
            total: data.res.context.page.total
          }
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  onSearchFormFieldChange = (field, value) => {
    const { searchForm } = this.state;
    this.setState({
      searchForm: {
        ...searchForm,
        [field]: value
      }
    });
  };

  render() {
    const columns = [
      {
        title: 'Appointment no',
        dataIndex: 'apptNo',
        key: 'd1'
      },
      {
        title: 'Appointment time',
        dataIndex: 'apptTime',
        key: 'd2'
      },
      {
        title: 'Pet owner name',
        dataIndex: 'consumerName',
        key: 'd3'
      },
      {
        title: 'Pet owner email',
        dataIndex: 'consumerEmail',
        key: 'd4'
      },
      {
        title: 'Phone number',
        dataIndex: 'consumerPhone',
        key: 'd8'
      },
      {
        title: 'Appointment type',
        dataIndex: 'type',
        key: 'd5',
        render: (text) => <div>{text === 0 ? 'Online' : text === 1 ? 'Offline' : ''}</div>
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'd6',
        render: (text) => <div>{text === 0 ? 'Booked' : text === 1 ? 'Arrived' : text === 2 ? 'Canceled' : ''}</div>
      },
      {
        title: 'Operation',
        dataIndex: 'status',
        key: 'd7',
        render: (text, record) => (
          <>
            <Button type="link" size="small">
              <i className="iconfont iconDetails"></i>
            </Button>
            {text === 0 && (
              <Button type="link" size="small">
                <i className="iconfont iconEnabled"></i>
              </Button>
            )}
            {text === 0 && (
              <Button type="link" size="small">
                <i className="iconfont iconbtn-disable"></i>
              </Button>
            )}
          </>
        )
      }
    ];
    const { loading, list, pagination } = this.state;
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title="Appointment list" />
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={styles.label}>Appointment no.</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onSearchFormFieldChange('apptNo', value);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={styles.label}>Pet owner name</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onSearchFormFieldChange('consumerName', value);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <DatePicker format="YYYYMMDD" placeholder="Start time" onChange={(date, dateStr) => this.onSearchFormFieldChange('apptDate', dateStr)} />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={styles.label}>Email</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onSearchFormFieldChange('consumerEmail', value);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <SelectGroup
                    defaultValue=""
                    label={<p style={styles.label}>Status</p>}
                    style={{ width: 80 }}
                    onChange={(value) => {
                      value = value === '' ? null : value;
                      this.onSearchFormFieldChange(status, value);
                    }}
                  >
                    <Option value="">All</Option>
                    <Option value="0">Booked</Option>
                    <Option value="1">Arrived</Option>
                    <Option value="2">Canceled</Option>
                  </SelectGroup>
                </FormItem>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button type="primary" onClick={this.getAppointmentList}>
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="container">
          <div style={{ marginBottom: 10 }}>
            <Button type="primary" onClick={() => history.push('/appointment-add')}>
              Add new
            </Button>
          </div>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={list}
            loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
            pagination={pagination}
          />
        </div>
      </div>
    );
  }
}

const styles = {
  label: {
    width: 120,
    textAlign: 'center'
  },
  wrapper: {
    width: 157
  }
} as any;
