import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, util, Const, cache } from 'qmkit';
import { Form, Select, Input, Button, Table, Divider, message, Modal, Tooltip, Row, Col, Upload, Popconfirm } from 'antd';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './index.less';
import { RCi18n } from 'qmkit';

const { confirm } = Modal;
const FormItem = Form.Item;
const Option = Select.Option;

export default class ClinicList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    console.log(cache.MAP_MODE, '==cache.MAP_MODE');
    this.state = {
      isMapMode: sessionStorage.getItem(cache.MAP_MODE) === '1' ? true : false,

      prescriberList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      searchForm: {
        prescriberId: '',
        prescriberName: '',
        phone: '',
        primaryCity: '',
        primaryZip: '',
        prescriberType: '',
        enabled: 'true',
        prescriberCode: ''
      },
      cityArr: [],
      typeArr: [],
      loading: true
    };
    this.onFormChange = this.onFormChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
  }
  componentDidMount() {
    webapi.getListSystemConfig().then((data) => {
      const res = data.res;
      if (res.code === Const.SUCCESS_CODE) {
        if (res.context) {
          let selectType = res.context.find(x=>x.configType === 'selection_type') 
          this.setState({
            isMapMode: selectType && selectType.status === 0
          }, () => {
            sessionStorage.setItem(cache.MAP_MODE, this.state.isMapMode ? '1' : '0')
            this.querySysDictionary('city');
            this.queryClinicsDictionary('clinicType');
            this.init();
          })
        }
      }
    })
  }
  init = async ({ pageNum, pageSize } = { pageNum: 1, pageSize: 10 }) => {
    this.setState({
      loading: true
    });
    const query = this.state.searchForm;
    query.enabled = query.enabled.toString() === 'true' ? true : query.enabled.toString() === 'false' ? false : '';
    pageNum = pageNum - 1;
    const { res } = await webapi.fetchClinicList({
      ...query,
      pageNum,
      pageSize
    });
    if (res.code === Const.SUCCESS_CODE) {
      let pagination = this.state.pagination;
      let prescriberList = res.context.content;
      if (prescriberList.length > 0) {
        pagination.total = res.context.total;
        pagination.current = res.context.number + 1;
        this.setState({
          pagination: pagination,
          prescriberList: prescriberList,
          loading: false
        });
      } else if (prescriberList.length === 0 && res.context.total > 0) {
        pagination.current = res.context.number;
        let params = {
          pageNum: res.context.number,
          pageSize: pagination.pageSize,
          loading: false
        };
        this.init(params);
      } else {
        pagination.total = res.context.total;
        pagination.current = res.context.number + 1;
        this.setState({
          pagination: pagination,
          prescriberList: prescriberList,
          loading: false
        });
      }
    }
  };
  queryClinicsDictionary = async (type: String) => {
    const { res } = await webapi.queryClinicsDictionary({
      type: type
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.setState({
        typeArr: res.context
      });
    }
  };
  querySysDictionary = async (type: String) => {
    const { res } = await webapi.querySysDictionary({
      type: type
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.setState({
        cityArr: res.context.sysDictionaryVOS
      });
    }
  };
  delClinic = async (id) => {
    const { res } = await webapi.deleteClinic({
      id: id
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success(<FormattedMessage id="Prescriber.OperateSuccessfully" />);
      this.init({ pageNum: this.state.pagination.current, pageSize: 10 });
    }
  };
  enableAndDisable = async (id) => {
    // message.info('API under development');
    const { res } = await webapi.enableAndDisable(id);
    if (res.code === Const.SUCCESS_CODE) {
      message.success(<FormattedMessage id="Prescriber.OperateSuccessfully" />);
      this.init({ pageNum: this.state.pagination.current, pageSize: 10 });
    }
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };

  onSearch = () => {
    const { pagination } = this.state;
    pagination.pageNum = 1;
    this.setState({
      pagination: pagination
    });
    this.init({ pageNum: 1, pageSize: 10 });
  };
  handleTableChange(pagination: any) {
    this.setState({
      pagination: pagination
    });
    this.init({ pageNum: pagination.current, pageSize: 10 });
  }
  // onExport = () => {
  //   const query = this.state.searchForm;
  //   query.enabled =
  //     query.enabled === 'true'
  //       ? true
  //       : query.enabled === 'false'
  //       ? false
  //       : null;
  //   webapi.exportPrescriber(query).then((data) => {
  //     this.download(data);
  //   });
  // };
  // download(response) {
  //   const data = response.data;
  //   if (!response) {
  //     return;
  //   }
  //   // const fileName = response.headers['content-disposition'].split(';')[1].split('=')[1]
  //   const fileName = 'test.xls';
  //   const url = window.URL.createObjectURL(new Blob([data]));
  //   const link = document.createElement('a');
  //   link.style.display = 'none';
  //   link.href = url;
  //   link.setAttribute('download', fileName);

  //   document.body.appendChild(link);
  //   link.click();
  // }
  onUpload = (info)=>{
    const {file} = info
    if (file.status !== 'uploading') {
    }
    console.info('infoinfoinfo', info)
    if (file.status === 'done'&&file.response&&file.response.code=='K-000000') {
        this.init()
        message.success(`${file.name} file uploaded successfully`);
    } else if (file.status === 'error' || file.status === 'done') {
      message.error(`${file.name} file upload failed:${file.response.message}`);
    }
  }
  onExport = () => {
    const params = this.state.searchForm;
    return new Promise((resolve) => {
      setTimeout(() => {
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          const exportHref = Const.HOST + `/prescriber/exportPrescriber/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error(<FormattedMessage id="Prescriber.Unsuccessful" />);
        }

        resolve();
      }, 500);
    });
  };

  showConfirm(id) {
    const that = this;
    confirm({
      title: <FormattedMessage id="Prescriber.deleteThisItem" />,
      onOk() {
        return that.delClinic(id);
      },
      onCancel() {}
    });
  }

  render() {
    const { cityArr, typeArr, searchForm } = this.state;
    const columns = [
      {
        title: <FormattedMessage id={Const.SITE_NAME === 'MYVETRECO' ? "Clinic.ClinicId" : "Prescriber.PrescriberID"} />,
        dataIndex: 'prescriberId',
        key: 'prescriberID',
      },
      {
        title: <FormattedMessage id={Const.SITE_NAME === 'MYVETRECO' ? "Clinic.ClinicName" : "Prescriber.PrescriberName"} />,
        dataIndex: 'prescriberName',
        key: 'prescriberName',
        ellipsis: true
      },
      {
        title: <FormattedMessage id={Const.SITE_NAME === 'MYVETRECO' ? "Clinic.ClinicPhone" : "Prescriber.PrescriberPhone"} />,
        dataIndex: 'phone',
        key: 'prescriberPhone',
      },
      {
        title: <FormattedMessage id={Const.SITE_NAME === 'MYVETRECO' ? "Clinic.ClinicCity" : "Prescriber.PrescriberCity"} />,
        dataIndex: 'primaryCity',
        key: 'prescriberCity',
      },
      {
        title: <FormattedMessage id={Const.SITE_NAME === 'MYVETRECO' ? "Clinic.ClinicType" : "Prescriber.PrescriberType"} />,
        dataIndex: 'prescriberType',
        key: 'prescriberType',
        render: (text, record) => <span>{text}</span>
      }
    ];
    if (Const.SITE_NAME === 'MYVETRECO') {
      columns.push({
        title: <FormattedMessage id="Prescriber.Action" />,
        dataIndex: 'id',
        key: 'action',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title={<FormattedMessage id="Prescriber.Details" />}>
              <Link to={'/prescriber-edit/' + record.id} className="iconfont iconDetails"></Link>
            </Tooltip>
            {record.defaultFlag != '1' ? <>
              <Divider type="vertical" />
              <Popconfirm placement="topLeft" title={<FormattedMessage id="Setting.Areyousuretodelete" />} onConfirm={() => this.delClinic(record.id)} okText={<FormattedMessage id="Setting.Confirm" />} cancelText={<FormattedMessage id="Setting.Cancel" />}>
                <Tooltip placement="top" title={RCi18n({id:"Prescriber.Delete"})}>
                  <a type="link" className="iconfont iconDelete"></a>
                </Tooltip>
              </Popconfirm>
            </> : null}
          </div>
        )
      });
    } else {
      columns.push({
        title: <FormattedMessage id="Prescriber.RecommendationCode" />,
        dataIndex: 'prescriberCode',
        key: 'prescriberCode',
        render: (text, record) => <p>{this.state.isMapMode ? '--' : text}</p>
      });
      columns.push({
        title: <FormattedMessage id="Prescriber.PrescriberStatus" />,
        dataIndex: 'enabled',
        key: 'enabled',
        render: (text, record) => <p>{record.enabled ? RCi18n({id:'Prescriber.Enabled'}) :RCi18n({id:'Disabled'})}</p>
      });
      columns.push({
        title: <FormattedMessage id="Prescriber.Action" />,
        dataIndex: 'id',
        key: 'action',
        render: (text, record) => record.prescriberName && record.prescriberType ? (
          <div>
            <Tooltip placement="top" title={<FormattedMessage id="Prescriber.Details" />}>
              <Link to={'/prescriber-edit/' + record.id} className="iconfont iconDetails"></Link>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip placement="top" title={record.enabled ? RCi18n({id:'Disable'}) : RCi18n({id:'Enable'})}>
              <a onClick={() => this.enableAndDisable(record.id)} className="iconfont iconbtn-disable"></a>
            </Tooltip>
          </div>
        ) : null
      });
    }
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div id="inputs" className="container-search">
          <Headline title={<FormattedMessage id={Const.SITE_NAME === "MYVETRECO" ? "Menu.Clinic list" : "Prescriber.PrescriberList"} />} />
          {/*搜索条件*/}
          <Form layout="inline">
            <Row id="input-lable-wwidth">
              {/* <div className="space-around"> */}
              {/* <div style={{ flex: 1, lineHeight: 3.5 }}> */}
              <Col span={8}>
                <FormItem style={styles.formItemStyle}>
                  <Input
                    addonBefore={
                      <p className="prescriber-iput-lable" title={RCi18n({id:Const.SITE_NAME === "MYVETRECO" ? 'Clinic.ClinicId' : 'Prescriber.prescriberId'})}>
                        <FormattedMessage id={Const.SITE_NAME === "MYVETRECO" ? "Clinic.ClinicId":"Prescriber.prescriberId"} />
                      </p>
                    }
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'prescriberId',
                        value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8} id="select-group-width">
                {/* <div style={{ flex: 1, lineHeight: 3.5 }}> */}
                <FormItem style={styles.formItemStyle}>
                  <Input
                    addonBefore={
                      <p className="PrescriberCity" title={RCi18n({id:Const.SITE_NAME === "MYVETRECO" ?'Clinic.ClinicCity':'Prescriber.PrescriberCity'})}>
                        <FormattedMessage id={Const.SITE_NAME === "MYVETRECO" ?"Clinic.ClinicCity":"Prescriber.PrescriberCity"} />
                      </p>
                    }
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'primaryCity',
                        value
                      });
                    }}
                  />
                  {/*<SelectGroup
                    className="PrescriberCity"
                    defaultValue=""
                    label="Prescriber city"
                    onChange={(value) => {
                      value = value === '' ? null : value;
                      this.onFormChange({
                        field: 'primaryCity',
                        value
                      });
                    }}
                  >
                    <Option value="">
                      <FormattedMessage id="all" />
                    </Option>
                    {cityArr.map((item) => (
                      <Option value={item.valueEn} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </SelectGroup>*/}
                </FormItem>
              </Col>
              <Col span={8} id="select-group-width">
                {/* <div style={{ flex: 1, lineHeight: 3.5 }}> */}
                <FormItem style={styles.formItemStyle}>
                  <SelectGroup
                    defaultValue=""
                    getPopupContainer={() => document.getElementById('page-content')}
                    label={<FormattedMessage id={Const.SITE_NAME === "MYVETRECO" ?"Clinic.ClinicType":"Prescriber.PrescriberType"} />}
                    // style={{ width: 80 }}
                    onChange={(value) => {
                      value = value === '' ? null : value;
                      this.onFormChange({
                        field: 'prescriberType',
                        value
                      });
                    }}
                    style={styles.wrapper}
                  >
                    <Option value="">
                      <FormattedMessage id="Prescriber.All" />
                    </Option>
                    {typeArr.map((item) => (
                      <Option value={item.valueEn} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </SelectGroup>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem style={styles.formItemStyle}>
                  <Input
                    addonBefore={
                      <p className="prescriber-iput-lable" title={RCi18n({id:Const.SITE_NAME === "MYVETRECO" ?'Clinic.ClinicName':'Prescriber.prescriberName'})}>
                        <FormattedMessage id={Const.SITE_NAME === "MYVETRECO" ?"Clinic.ClinicName":"Prescriber.prescriberName"} />
                      </p>
                    }
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'prescriberName',
                        value
                      });
                    }}
                  />
                </FormItem>
              </Col>

              {Const.SITE_NAME === "MYVETRECO" ? null : <Col span={8}>
                <FormItem style={styles.formItemStyle}>
                  <Input
                    addonBefore={
                      <p className="prescriber-iput-lable" title={RCi18n({id:'Prescriber.prescriberZip'})}>
                        <FormattedMessage id="Prescriber.prescriberZip" />
                      </p>
                    }
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'primaryZip',
                        value
                      });
                    }}
                  />
                </FormItem>
              </Col>}
              <Col span={8}>
                <FormItem style={styles.formItemStyle}>
                  <Input
                    addonBefore={
                      <p className="prescriber-iput-lable" title={RCi18n({id:Const.SITE_NAME === "MYVETRECO" ?'Clinic.ClinicPhone':'Prescriber.prescriberPhone'})}>
                        <FormattedMessage id={Const.SITE_NAME === "MYVETRECO" ?"Clinic.ClinicPhone":"Prescriber.prescriberPhone"} />
                      </p>
                    }
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'phone',
                        value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              {Const.SITE_NAME === "MYVETRECO" ? null : <Col span={8} id="select-group-width">
                <FormItem style={styles.formItemStyle}>
                  <SelectGroup
                    defaultValue="true"
                    label={<FormattedMessage id="Prescriber.PrescriberStatus" />}
                    getPopupContainer={() => document.getElementById('page-content')}
                    // style={{ width: 80 }}
                    onChange={(value) => {
                      value = value === '' ? '' : value;
                      this.onFormChange({
                        field: 'enabled',
                        value
                      });
                    }}
                    style={styles.wrapper}
                  >
                    <Option value="">
                      <FormattedMessage id="Prescriber.All" />{' '}
                    </Option>
                    <Option value="true" key="enabled">
                      <FormattedMessage id="Prescriber.enabled" />
                    </Option>
                    <Option value="false" key="disabled">
                      <FormattedMessage id="Prescriber.disabled" />
                    </Option>
                  </SelectGroup>
                </FormItem>
              </Col>}
              {Const.SITE_NAME === "MYVETRECO" ? null : <Col span={8}>
                <FormItem style={styles.formItemStyle}>
                  <Input
                    addonBefore={
                      <p className="prescriber-iput-lable" title={RCi18n({id:'Prescriber.RecommendationCode'})}>
                        <FormattedMessage id="Prescriber.RecommendationCode" />
                      </p>
                    }
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'prescriberCode',
                        value
                      });
                    }}
                  />
                </FormItem>
              </Col>}

              <Col span={24} style={{ textAlign: 'center' }}>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    shape="round"
                    icon="search"
                    style={{
                      width: '100px',
                      margin: '10px auto',
                      textAlign: 'center'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      this.onSearch();
                    }}
                  >
                    <FormattedMessage id="Prescriber.search" />
                  </Button>
                </FormItem>
                {/* </div> */}
              </Col>
            </Row>
          </Form>
        </div>
        <div className="container">
          <div style={{ textAlign: 'left', marginBottom: 10 }}>
            <Button
              icon="download"
              onClick={(e) => {
                e.preventDefault();
                this.onExport();
              }}
            >
              <FormattedMessage id="Prescriber.export" />
            </Button>
            {(window as any).countryEnum[JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId ?? 0] === 'de'?<span
            style={{
              marginLeft: '20px'
            }}>
            <Upload
              showUploadList={false}
              name="file"
              action={`${Const.HOST}/prescriber/list/excelImport`}
              headers={{ 
              authorization:
              'Bearer' + ((window as any).token ? ' ' + (window as any).token : '') }}
              onChange={this.onUpload}
              accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              // accept='.xlsx'
            >
              <Button
                icon="upload"
              >
                <FormattedMessage id="Prescriber.Upload" />
              </Button>
            </Upload>
            </span>:null}
            <Button
              style={{
                backgroundColor: 'var(--primary-color)',
                color: '#FFFFFF',
                marginLeft: '20px'
              }}
            >
              <Link to="/prescriber-add">
                <FormattedMessage id="Prescriber.add" />
              </Link>
            </Button>
          </div>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={this.state.prescriberList}
            pagination={this.state.pagination}
            loading={this.state.loading}
            scroll={{ x: '100%' }}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}

const styles = {
  formItemStyle: {
    width: 375
  },
  label: {
    width: 135,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  leftLabel: {
    width: 135,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  wrapper: {
    width: 200
  }
} as any;
