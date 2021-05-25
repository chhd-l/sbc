import React from 'react';
import { Headline, BreadCrumb, history, SelectGroup, Const, ExportModal, QRScaner } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Form, Row, Col, Input, DatePicker, Button, Select, Tooltip, message, Modal } from 'antd';
import { getAppointmentList, updateAppointmentById, exportAppointmentList, findAppointmentByAppointmentNo } from './webapi';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { RCi18n } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

export default class AppointmentList extends React.Component<any, any> {
  state: any;

  constructor(props: any) {
    super(props);
    let lastParams = { current: 1 };
    if(sessionStorage.getItem('remember-appointment-list-params')) {
      lastParams = JSON.parse(sessionStorage.getItem('appointment-list-params') || '{\"current\": 1 }');
    }
    const { current, ...rest } = lastParams;
    this.state = {
      loading: false,
      list: [],
      searchForm: rest,
      pagination: {
        current: current,
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
      },
      showScan: false,
      scanedInfo: {},
      showCard: false
    };
  }

  componentDidMount() {
    this.getAppointmentList();
  }

  componentWillUnmount() {
    //删掉需要记住筛选参数的标记
    sessionStorage.removeItem('remember-appointment-list-params');
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
          },
          selectedRowKeys: []
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  onSearch = () => {
    const { pagination, searchForm } = this.state;
    sessionStorage.setItem('appointment-list-params', JSON.stringify({ ...searchForm, current: 1 }));
    this.onTableChange({
      ...pagination,
      current: 1
    });
  };

  onTableChange = (pagination) => {
    const { searchForm } = this.state;
    sessionStorage.setItem('appointment-list-params', JSON.stringify({ ...searchForm, current: pagination.current }));
    this.setState(
      {
        pagination: pagination
      },
      () => this.getAppointmentList()
    );
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

  updateAppointmentStatus = (record: any, status: number) => {
    const { list } = this.state;
    this.setState({ loading: true });
    const appointment = list.find((r) => r.id === record.id) || {};
    updateAppointmentById({
      ...record,
      status: status
    })
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          appointment.status = status;
          this.setState({
            loading: false,
            list,
            showCard: false
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
      message.error(RCi18n({id:'Appointment.NRHF'}));
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
  };

  onExportSelected = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      message.error(RCi18n({id:'Appointment.NAHBS'}));
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
    return exportAppointmentList({ ids: selectedRowKeys });
  };

  findByApptNo = (apptNo: string) => {
    findAppointmentByAppointmentNo(apptNo).then((data) => {
      if (data.res.code === Const.SUCCESS_CODE && data.res.context.settingVO.id) {
        this.setState({
          scanedInfo: data.res.context.settingVO,
          showCard: true
        });
      } else {
        message.error(RCi18n({id:'Appointment.NAHBS'}));
      }
    });
  };

  onCloseCard = () => {
    this.setState({
      showCard: false
    });
  };

  render() {
    const columns = [
      {
        title: RCi18n({id:'Appointment.No.'}),
        dataIndex: 'apptNo',
        key: 'd1'
      },
      {
        title: RCi18n({id:'Appointment.Time'}),
        dataIndex: 'apptTime',
        key: 'd2',
        render: (text, record) => <div>{`${moment(record.apptDate, 'YYYYMMDD').format('YYYY-MM-DD')} ${record.apptTime}`}</div>
      },
      {
        title:  RCi18n({id:'Appointment.PON'}),
        dataIndex: 'consumerName',
        key: 'd3'
      },
      {
        title:  RCi18n({id:'Appointment.Pet OE'}),
        dataIndex: 'consumerEmail',
        key: 'd4'
      },
      {
        title: RCi18n({id:'Appointment.Phone number'}),
        dataIndex: 'consumerPhone',
        key: 'd8'
      },
      {
        title: RCi18n({id:'Appointment.Type'}),
        dataIndex: 'type',
        key: 'd5',
        render: (text) => <div>{text === '0' ? RCi18n({id:'Appointment.Online'}) : text === '1' ? RCi18n({id:'Appointment.Offline'}) : ''}</div>
      },
      {
        title: RCi18n({id:'Appointment.Operation'}),
        dataIndex: 'status',
        key: 'd6',
        render: (text) => <div>{text === 0 ? RCi18n({id:'Appointment.Booked'}) : text === 1 ? RCi18n({id:'Appointment.Arrived'})  : text === 2 ? RCi18n({id:'Appointment.Canceled'}) : ''}</div>
      },
      {
        title: RCi18n({id:'Appointment.Operatio'}),
        dataIndex: 'status',
        key: 'd7',
        render: (text, record) => (
          <>
            <Tooltip title={RCi18n({id:'Appointment.Edit'})}>
              <Link to={`/appointment-update/${record.id}`} className="iconfont iconEdit" style={{ padding: '0 5px' }}></Link>
            </Tooltip>
            {text === 0 && (
              <Tooltip title={RCi18n({id:'Appointment.Arrived'})}>
                <Button type="link" size="small" onClick={() => this.updateAppointmentStatus(record, 1)} style={{ padding: '0 5px' }}>
                  <i className="iconfont iconEnabled"></i>
                </Button>
              </Tooltip>
            )}
            {text === 0 && (
              <Tooltip title={RCi18n({id:'Appointment.Cancel'})}>
                <Button type="link" size="small" onClick={() => this.updateAppointmentStatus(record, 2)} style={{ padding: '0 5px' }}>
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
    const { loading, list, pagination, searchForm } = this.state;
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={<FormattedMessage id="Appointment.list" />} />
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={styles.label}>{<FormattedMessage id="Appointment.No." />}</p>}
                    defaultValue={searchForm.apptNo}
                    onChange={(e) => {
                      const value = (e.target as any).value || undefined;
                      this.onSearchFormFieldChange('apptNo', value);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={styles.label}>{<FormattedMessage id="Appointment.PON" />}</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value || undefined;
                      this.onSearchFormFieldChange('consumerName', value);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <DatePicker format="YYYYMMDD" defaultValue={searchForm.apptDate ? moment(searchForm.apptDate, 'YYYYMMDD') : null} placeholder={RCi18n({id:'Appointment.Start time'})} onChange={(date, dateStr) => this.onSearchFormFieldChange('apptDate', dateStr || undefined)} />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={styles.label}>{<FormattedMessage id="Appointment.Email" />}</p>}
                    defaultValue={searchForm.consumerEmail}
                    onChange={(e) => {
                      const value = (e.target as any).value || undefined;
                      this.onSearchFormFieldChange('consumerEmail', value);
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <SelectGroup
                    defaultValue={searchForm.status}
                    label={<p style={styles.label}>{<FormattedMessage id="Appointment.Status" />}</p>}
                    style={{ width: 203 }}
                    onChange={(value) => {
                      value = value || undefined;
                      this.onSearchFormFieldChange('status', value);
                    }}
                  >
                    <Option value="">{<FormattedMessage id="Appointment.All" />}</Option>
                    <Option value="0">{<FormattedMessage id="Appointment.Booked" />}</Option>
                    <Option value="1">{<FormattedMessage id="Appointment.Arrived" />}</Option>
                    <Option value="2">{<FormattedMessage id="Appointment.Canceled" />}</Option>
                  </SelectGroup>
                </FormItem>
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
          <Row style={{ marginBottom: 10 }} type="flex" justify="space-between">
            <Col>
              <Button style={{ marginRight: 10 }} onClick={this.onOpenExportModal}>
                {<FormattedMessage id="Appointment.Batch export" />}
              </Button>
              <Button type="primary" onClick={() => history.push('/appointment-add')}>
                {<FormattedMessage id="Appointment.Add new" />}
              </Button>
            </Col>
            <Col>
              <QRScaner id="scan" onScanEnd={this.findByApptNo}>
                <Button type="primary">
                {<FormattedMessage id="Appointment.STC" />}
                </Button>
              </QRScaner>              
            </Col>
          </Row>
          <Table
            rowKey="id"
            className="table-overflow"
            scroll={{ x: true }}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={list}
            loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
            pagination={pagination}
            onChange={this.onTableChange}
          />
        </div>
        <ExportModal data={this.state.exportModalData} onHide={this.onCloseExportModal} handleByParams={this.state.exportModalData.exportByParams} handleByIds={this.state.exportModalData.exportByIds} />
        <Modal title="Consumer information" visible={this.state.showCard} okText="Arrived" onCancel={this.onCloseCard} onOk={() => this.updateAppointmentStatus(this.state.scanedInfo, 1)}>
          <p>{<FormattedMessage id="Appointment.PON" />}: {this.state.scanedInfo.consumerName}</p>
          <p>{<FormattedMessage id="Appointment.Consumer phone'" />}: {this.state.scanedInfo.consumerPhone}</p>
          <p>{<FormattedMessage id="Appointment.Consumer.email" />}: {this.state.scanedInfo.consumerEmail}</p>
          <p>
          {<FormattedMessage id="Appointment.Time" />}: {this.state.scanedInfo.apptDate ? `${moment(this.state.scanedInfo.apptDate, 'YYYYMMDD').format('YYYY-MM-DD')}` : ''} {this.state.scanedInfo.apptTime}
          </p>
        </Modal>
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
