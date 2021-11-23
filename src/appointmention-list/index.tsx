import React from 'react';
import { Headline, BreadCrumb, history, SelectGroup, Const, ExportModal, QRScaner } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Form, Row, Col, Input, DatePicker, Button, Select, Tooltip, message, Modal, Icon, Popconfirm } from 'antd';
import { apptList, apptCancel, apptArrived, updateAppointmentById, getAllDict, exportAppointmentList, findAppointmentByAppointmentNo } from './webapi';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { RCi18n } from 'qmkit';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class Appointment extends React.Component<any, any> {
  state: any;

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
      serviceType: {},
      appointmentType: {},
      expertType: {},
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

 async componentDidMount() {
    this.getAppointmentList();
      this.initDict()
  }
  initDict=async()=>{
    const appointmentType=await getAllDict('appointment_type')
    const expertType=await getAllDict('expert_type')
    const serviceType=await getAllDict('service_type')
    this.setState({
      expertType,
      appointmentType,
      serviceType
    })
}
  componentWillUnmount() {
    //删掉需要记住筛选参数的标记
  }

  getAppointmentList = () => {
    const { searchForm, pagination } = this.state;
    this.setState({ loading: true });
    apptList({ ...searchForm, pageNum: pagination.current - 1, pageSize: pagination.pageSize })
      .then((data: any) => {
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

  onSearch = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { pagination } = this.state;
        this.onTableChange({
          ...pagination,
          current: 1
        }, values);
      }
    });

  };

  onTableChange = (pagination, values = {}) => {
    // sessionStorage.setItem('appointmention-list-params', JSON.stringify({ ...values, current: pagination.current }));
    this.setState(
      {
        searchForm: values,
        pagination: pagination
      },
      () => this.getAppointmentList()
    );
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
      message.error(RCi18n({ id: 'Appointment.NRHF' }));
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
  };

  onExportSelected = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      message.error(RCi18n({ id: 'Appointment.NAHBS' }));
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
        message.error(RCi18n({ id: 'Appointment.NAHBS' }));
      }
    });
  };

  onCloseCard = () => {
    this.setState({
      showCard: false
    });
  };
  confirm = async (e, type) => {
    console.log(e);
    let result:any={};
    switch (type) {
      case 'cancel':
        result = await apptCancel({id:e.id,status:2});
        break;
      case 'arrived':
        result= await apptArrived({id:e.id,status:1});
        break
      default:
        break;
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('successed');
      this.getAppointmentList()
    }

  }

  cancel = (e) => {
    console.log(e);
    message.error('Click on No');
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { serviceType,
      appointmentType,
      expertType, } = this.state;
    let status = {
      "0": RCi18n({id:'Order.offline.booked'}),
      "1": RCi18n({id:'Order.offline.arrived'}),
      "2": RCi18n({id:'Order.offline.canceled'}),
    }
    const columns = [
      {
        title: RCi18n({ id: 'Appointment.No.' }),
        dataIndex: 'apptNo',
        key: 'apptNo',
        ellipsis: true,
        render: (text, record) => {
          return (<Tooltip title={text}>
          <div style={{width:100,textOverflow:'ellipsis',overflow:'hidden'}}>{text}</div>
        </Tooltip>)
        }
      },
      {
        title: 'Order No',//RCi18n({id:'Appointment.No.'}),
        dataIndex: 'goodsInfoId',
        key: 'goodsInfoId',
        // width:150,
        ellipsis: true,
        render: (text, record) => {
          return (<Tooltip title={text}>
          <div style={{width:100,textOverflow:'ellipsis',overflow:'hidden'}}>{text}</div>
        </Tooltip>)
        }
      },
      {
        title: RCi18n({ id: 'Appointmention.Time' }),
        dataIndex: 'apptTime',
        key: 'apptTime',
        render: (text, record) => {
          if(text&&text.includes('#')){
            let time=text.split('#');
            let begin=moment(moment(time[0],'YYYY-MM-DD HH:mm')).format('YYYY-MM-DD HH:mm'),
            end=moment(moment(time[1],'YYYY-MM-DD HH:mm')).format('HH:mm');
           return (<div>{begin}-{end}</div>)
          }else{
            return '';
          }
        }
      },
      {
        title: RCi18n({ id: 'Appointment.PON' }),
        dataIndex: 'consumerName',
        key: 'consumerName',
        width:'130px'

      },
      {
        title: RCi18n({ id: 'Appointment.Pet OE' }),
        dataIndex: 'consumerEmail',
        key: 'consumerEmail'
      },
      {
        title: RCi18n({ id: 'Appointment.Phone number' }),
        dataIndex: 'consumerPhone',
        key: 'consumerPhone'
      },
      {
        title: RCi18n({ id: 'Appointmention.Type' }),
        dataIndex: 'apptTypeId',
        key: 'apptTypeId',
        render: (text) => <div>{(appointmentType?.objValue??{})[text]}</div>
      },
      {
        title: RCi18n({ id: 'Appointmention.Status' }),
        dataIndex: 'status',
        key: 'status',
        render: (text) => <div>{status[text]}</div>
      },
      {
        title: RCi18n({ id: 'Appointmention.Expert.type' }),
        dataIndex: 'expertTypeId',
        key: 'expertTypeId',
        render: (text) => <div>{(expertType?.objValue??{})[text]}</div>
      },
      {
        title: RCi18n({ id: 'Appointmention.Expert.name' }),
        dataIndex: 'expertNames',
        key: 'expertNames',
        // render: (text) => <div>{}</div>
      },

      {
        title: RCi18n({ id: 'Appointment.Operation' }),
        dataIndex: 'Operation',
        width: 170,
        key: 'd7',
        render: (text, record) => (
          <>
            <Tooltip title={RCi18n({ id: 'Appointment.Details' })}>
              <Link to={`/appointment-details/${record.id}`} className="iconfont " style={{ padding: '0 5px' }}><Icon type="eye" /></Link>
            </Tooltip>



            {[0].includes(record.status) && <Tooltip title={RCi18n({ id: 'Appointment.Edit' })}>
              <Link to={`/appointment-update/${record.id}`} className="iconfont iconEdit" style={{ padding: '0 5px' }}></Link>
            </Tooltip>}
            {[1].includes(record.status) && <Tooltip title={RCi18n({ id: 'Appointment.Prescription' })}>
              <Link to={`/recommendation`} className="iconfont " style={{ padding: '0 5px' }}><Icon type="profile" /></Link>
            </Tooltip>
            }

            {[0].includes(record.status) && <Tooltip title={RCi18n({ id: 'Appointment.Arrived' })}>
              {/* <Button type="link" size="small" onClick={() => this.updateAppointmentStatus(record, 1)} style={{ padding: '0 5px' }}>
                <i className="iconfont iconEnabled"></i>
              </Button> */}
           
              <Popconfirm
                title="Are you sure arrived this task?"
                onConfirm={() => this.confirm(record,'arrived')}
                onCancel={this.cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" size="small" style={{ padding: '0 5px' }}>
                <i className="iconfont iconEnabled"></i>
                </Button>
              </Popconfirm>
           
            </Tooltip>}
            {[1].includes(record.status) && <Tooltip title={RCi18n({ id: 'Appointment.Pay' })}>
              <Button type="link" size="small" onClick={() => this.updateAppointmentStatus(record, 1)} style={{ padding: '0 5px' }}>
                <Icon type="pay-circle" />
              </Button>
            </Tooltip>}
            {[0].includes(record.status) && <Tooltip title={RCi18n({ id: 'Appointment.Cancel' })}>
              <Popconfirm
                title="Are you sure cancel this task?"
                onConfirm={() => this.confirm(record,'cancel')}
                onCancel={this.cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" size="small" style={{ padding: '0 5px' }}>
                  <Icon type="close-circle" />
                </Button>
              </Popconfirm>

            </Tooltip>
            }


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
          <Form className="filter-content" onSubmit={this.onSearch}>
            <Row style={{ display: "flex", flexWrap: "wrap" }} gutter={30}>
              <Col span={8}>
                <FormItem >
                  {getFieldDecorator('apptNo', {})(
                    <Input
                      addonBefore={<p style={styles.label}>{<FormattedMessage id="Appointment.No." />}</p>}
                    />
                  )}

                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('apptTypeId', {})(
                    <SelectGroup
                      label={<p style={styles.label}>{<FormattedMessage id="Appointment.type" />}</p>}
                      style={{ width: '100%' }}
                    >
                      <Option value="">{<FormattedMessage id="Appointment.All" />}</Option>
                      {(appointmentType?.list??[]).map(item => <Option value={item.id} >{item.name}</Option>)}
                      {/* <Option value="1">{<FormattedMessage id="Appointment.Arrived" />}</Option>
                      <Option value="2">{<FormattedMessage id="Appointment.Canceled" />}</Option> */}
                    </SelectGroup>
                  )}
                </FormItem>

              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('status', {})(
                    <SelectGroup
                      label={<p style={styles.label}>{<FormattedMessage id="Appointment.Status" />}</p>}
                      style={{ width: '100%' }}
                    >
                      <Option value="">{<FormattedMessage id="Appointment.All" />}</Option>
                      <Option value="0">{<FormattedMessage id="Appointment.Booked" />}</Option>
                      <Option value="1">{<FormattedMessage id="Appointment.Arrived" />}</Option>
                      <Option value="2">{<FormattedMessage id="Appointment.Canceled" />}</Option>
                    </SelectGroup>
                  )}
                </FormItem>

              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('consumerName', {})(
                    <Input
                      addonBefore={<p style={styles.label}>{<FormattedMessage id="Appointment.PON" />}</p>}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('consumerPhone', {})(
                    <Input
                      addonBefore={<p style={styles.label}>{<FormattedMessage id="Appointment.Phone number" />}</p>}
                    />
                  )}

                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('consumerEmail', {})(
                    <Input
                      addonBefore={<p style={styles.label}>{<FormattedMessage id="Appointment.Email" />}</p>}
                    />
                  )}

                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('expertNames', {})(
                    <Input
                      addonBefore={<p style={styles.label}>{<FormattedMessage id="Prescriber.Expert name" />}</p>}
                    />
                    // <SelectGroup
                    //   label={<p style={styles.label}>{<FormattedMessage id="Prescriber.Expert name" />}</p>}
                    //   style={{ width: '100%' }}
                    // >
                    //   <Option value="">{<FormattedMessage id="Appointment.All" />}</Option>
                    //   <Option value="0">{<FormattedMessage id="Appointment.Booked" />}</Option>
                    //   <Option value="1">{<FormattedMessage id="Appointment.Arrived" />}</Option>
                    //   <Option value="2">{<FormattedMessage id="Appointment.Canceled" />}</Option>
                    // </SelectGroup>
                  )}
                </FormItem>

              </Col>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('apptDate', {})(
                    <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder={RCi18n({ id: 'Appointment.Start time' })} />
                  )}
                </FormItem>
              </Col>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button type="primary" htmlType="submit">
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
            loading={loading}
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
export default Form.create()(Appointment);
const styles = {
  label: {
    width: 120,
    textAlign: 'center'
  },
  wrapper: {
    width: 157
  }
} as any;
