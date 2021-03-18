import React from 'react';
import { Headline, BreadCrumb } from 'qmkit';
import { Table, Form, Row, Col, Input, DatePicker } from 'antd';

const FormItem = Form.Item;

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
        dataIndex: 'd1',
        key: 'd1'
      },
      {
        title: 'Appointment time',
        dataIndex: 'd2',
        key: 'd2'
      },
      {
        title: 'Pet owner name',
        dataIndex: 'd3',
        key: 'd3'
      },
      {
        title: 'Pet owner email',
        dataIndex: 'd4',
        key: 'd4'
      },
      {
        title: 'Appointment type',
        dataIndex: 'd5',
        key: 'd5'
      },
      {
        title: 'Status',
        dataIndex: 'd6',
        key: 'd6'
      },
      {
        title: 'Operation',
        dataIndex: 'd7',
        key: 'd7'
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
                      this.onSearchFormFieldChange('appointmentNo', value);
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
                  <Input
                    addonBefore={<p style={styles.label}>Email</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onSearchFormFieldChange('email', value);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={styles.label}>Status</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onSearchFormFieldChange('status', value);
                    }}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
          pagination={pagination}
        />
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
