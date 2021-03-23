import React from 'react';
import { Headline, BreadCrumb, history, SelectGroup, Const, ExportModal } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Form, Row, Col, Input, DatePicker, Button, Select, Tooltip, message } from 'antd';
import { getAppointmentList, updateAppointmentById, exportAppointmentList } from './webapi';
import { ExportableNode } from 'ts-morph';

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
      },
      selectedRowKeys: [],
      exportModalData: {
        visible: false,
        byParamsTitle: 'Export filtered appointments',
        byIdsTitle: 'Export selected appointments',
        exportByParams: this.onExportSearchParams,
        exportByIds: this.onExportSelected
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

  updateAppointmentStatus = (id: number, status: number) => {
    const { list } = this.state;
    this.setState({ loading: true });
    const appointment = list.find((r) => r.id === id);
    updateAppointmentById({
      ...appointment,
      status: status
    })
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          appointment.status = status;
          this.setState({
            loading: false,
            list
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  onSelectedRowKeys = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys
    });
  };

  onOpenExportModal = () => {
    const { exportModalData } = this.state;
    this.setState({
      exportModalData: {
        ...exportModalData,
        visible: true
      }
    });
  };

  onCloseExportModal = () => {
    const { exportModalData } = this.state;
    this.setState({
      exportModalData: {
        ...exportModalData,
        visible: false
      }
    });
  };

  onExportSearchParams = () => {
    const { searchForm, pagination } = this.state;
    if (pagination.total > 0) {
      return exportAppointmentList(searchForm);
    } else {
      message.error('no record has found');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
  };

  onExportSelected = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      message.error('no appointment has been selected');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
    return exportAppointmentList({ ids: selectedRowKeys });
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
        render: (text) => <div>{text === '0' ? 'Online' : text === '1' ? 'Offline' : ''}</div>
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
            <Tooltip title="Edit">
              <Link to={`/appointment-update/${record.id}`} className="iconfont iconEdit" style={{ padding: '0 5px' }}></Link>
            </Tooltip>
            {text === 0 && (
              <Tooltip title="Arrived">
                <Button type="link" size="small" onClick={() => this.updateAppointmentStatus(record.id, 1)} style={{ padding: '0 5px' }}>
                  <i className="iconfont iconEnabled"></i>
                </Button>
              </Tooltip>
            )}
            {text === 0 && (
              <Tooltip title="Cancel">
                <Button type="link" size="small" onClick={() => this.updateAppointmentStatus(record.id, 2)} style={{ padding: '0 5px' }}>
                  <i className="iconfont iconbtn-disable"></i>
                </Button>
              </Tooltip>
            )}
          </>
        )
      }
    ];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectedRowKeys
    };
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
            <Button style={{ marginRight: 10 }} onClick={this.onOpenExportModal}>
              Batch export
            </Button>
            <Button type="primary" onClick={() => history.push('/appointment-add')}>
              Add new
            </Button>
          </div>
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={list}
            loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
            pagination={pagination}
          />
        </div>
        <ExportModal data={this.state.exportModalData} onHide={this.onCloseExportModal} handleByParams={this.state.exportModalData.exportByParams} handleByIds={this.state.exportModalData.exportByIds} />
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
