import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, util, Const, cache } from 'qmkit';
import { Form, Select, Input, Button, Table, Divider, message, Modal, Tooltip, Row, Col } from 'antd';
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
        title: <FormattedMessage id="Prescriber.PrescriberID" />,
        dataIndex: 'prescriberId',
        key: 'prescriberID',
        width: '10%'
      },
      {
        title: <FormattedMessage id="Prescriber.PrescriberName" />,
        dataIndex: 'prescriberName',
        key: 'prescriberName',
        width: '15%',
        ellipsis: true
      },
      {
        title: <FormattedMessage id="Prescriber.PrescriberPhone" />,
        dataIndex: 'phone',
        key: 'prescriberPhone',
        width: '10%'
      },
      {
        title: <FormattedMessage id="Prescriber.PrescriberCity" />,
        dataIndex: 'primaryCity',
        key: 'prescriberCity',
        width: '10%'
      },
      // {
      //   title: 'Prescriber Zip',
      //   dataIndex: 'primaryZip',
      //   key: 'prescriberZip',
      //   width: 140
      // },
      // {
      //   title: 'Latitude',
      //   dataIndex: 'latitude',
      //   key: 'latitude',
      //   width: 120
      // },
      // {
      //   title: 'Longitude',
      //   dataIndex: 'longitude',
      //   key: 'longitude',
      //   width: 120
      // },

      {
        title: <FormattedMessage id="Prescriber.PrescriberType" />,
        dataIndex: 'prescriberType',
        key: 'prescriberType',
        width: '10%'
      },
      // {
      //   title: 'Audit Status',
      //   dataIndex: 'auditStatus',
      //   key: 'auditStatus',
      //   width: '10%',
      //   render: (text, record) => (
      //     <p>{record.auditStatus === '1' ? 'Online' : 'Offline'}</p> //1 线上 0 线下
      //   )
      // },

      {
        title: <FormattedMessage id="Prescriber.RecommendationCode" />,
        dataIndex: 'prescriberCode',
        key: 'prescriberCode',
        width: '10%',
        render: (text, record) => <p>{this.state.isMapMode ? '--' : text}</p>
      },
      {
        title: <FormattedMessage id="Prescriber.PrescriberStatus" />,
        dataIndex: 'enabled',
        key: 'enabled',
        width: '10%',
        render: (text, record) => <p>{record.enabled ? RCi18n({id:'Prescriber.Enabled'}) :RCi18n({id:'Disabled'})}</p>
      },
      // {
      //   title: <FormattedMessage id="Prescriber.AuditAuthority" />,
      //   dataIndex: 'auditAuthority',
      //   key: 'auditAuthority',
      //   width: '10%',
      //   render: (text, record) => <p>{record.auditAuthority ? 'Y' : 'N'}</p>
      // },
      {
        title: <FormattedMessage id="Prescriber.Action" />,
        key: 'action',
        width: '10%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title={<FormattedMessage id="Prescriber.Details" />}>
              <Link to={'/prescriber-edit/' + record.id} className="iconfont iconDetails"></Link>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip placement="top" title={record.enabled ? RCi18n({id:'Disable'}) : RCi18n({id:'Enable'})}>
              <a onClick={() => this.enableAndDisable(record.id)} className="iconfont iconbtn-disable">
                {/*{record.enabled ? 'Disable' : 'Enable'}*/}
              </a>
            </Tooltip>
            {/* <Divider type="vertical" />
            <a onClick={() => this.showConfirm(record.prescriberId)}>Delete</a> */}
          </div>
        )
      }
    ];
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div id="inputs" className="container-search">
          <Headline title={<FormattedMessage id="Prescriber.PrescriberList" />} />
          {/*搜索条件*/}
          <Form layout="inline">
            <Row id="input-lable-wwidth">
              {/* <div className="space-around"> */}
              {/* <div style={{ flex: 1, lineHeight: 3.5 }}> */}
              <Col span="8">
                <FormItem style={styles.formItemStyle}>
                  <Input
                    addonBefore={
                      <p className="prescriber-iput-lable">
                        <FormattedMessage id="Prescriber.prescriberId" />
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
              <Col span="8" id="select-group-width">
                {/* <div style={{ flex: 1, lineHeight: 3.5 }}> */}
                <FormItem style={styles.formItemStyle}>
                  <Input
                    addonBefore={
                      <p className="PrescriberCity">
                        <FormattedMessage id="Prescriber.PrescriberCity" />
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
              <Col span="8" id="select-group-width">
                {/* <div style={{ flex: 1, lineHeight: 3.5 }}> */}
                <FormItem style={styles.formItemStyle}>
                  <SelectGroup
                    defaultValue=""
                    getPopupContainer={() => document.getElementById('page-content')}
                    label={<FormattedMessage id="Prescriber.PrescriberType" />}
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
              <Col span="8">
                <FormItem style={styles.formItemStyle}>
                  <Input
                    addonBefore={
                      <p className="prescriber-iput-lable">
                        <FormattedMessage id="Prescriber.prescriberName" />
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

              <Col span="8">
                <FormItem style={styles.formItemStyle}>
                  <Input
                    addonBefore={
                      <p className="prescriber-iput-lable">
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
              </Col>
              <Col span="8">
                <FormItem style={styles.formItemStyle}>
                  <Input
                    addonBefore={
                      <p className="prescriber-iput-lable">
                        <FormattedMessage id="Prescriber.prescriberPhone" />
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
                {/* </div> */}
              </Col>
              <Col span="8" id="select-group-width">
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
                {/* </div> */}
                {/* </div> */}
                {/* <div */}
                {/* style={{ width: '100%', margin: '0 auto', textAlign: 'center' }}
            > */}
              </Col>
              <Col span="8">
                <FormItem style={styles.formItemStyle}>
                  <Input
                    addonBefore={
                      <p className="prescriber-iput-lable">
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
                {/* </div> */}
              </Col>

              <Col span="24" style={{ textAlign: 'center' }}>
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
              style={{}}
              icon="download"
              onClick={(e) => {
                e.preventDefault();
                this.onExport();
              }}
            >
              <FormattedMessage id="Prescriber.export" />
            </Button>
            <Button
              style={{
                backgroundColor: '#e2001a',
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
            loading={{ spinning: this.state.loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
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
