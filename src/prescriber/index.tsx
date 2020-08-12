import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, util, Const, cache } from 'qmkit';
import {
  Form,
  Select,
  Input,
  Button,
  Table,
  Divider,
  message,
  Modal,
  Tooltip
} from 'antd';
import * as webapi from './webapi';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

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
    this.querySysDictionary('city');
    this.queryClinicsDictionary('clinicType');
    this.init();
  }
  init = async ({ pageNum, pageSize } = { pageNum: 1, pageSize: 10 }) => {
    this.setState({
      loading: true
    });
    const query = this.state.searchForm;
    query.enabled =
      query.enabled.toString() === 'true'
        ? true
        : query.enabled.toString() === 'false'
        ? false
        : '';
    pageNum = pageNum - 1;
    const { res } = await webapi.fetchClinicList({
      ...query,
      pageNum,
      pageSize
    });
    if (res.code === 'K-000000') {
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
    if (res.code === 'K-000000') {
      this.setState({
        typeArr: res.context
      });
    } else {
      message.error(res.message || 'Unsuccessful');
    }
  };
  querySysDictionary = async (type: String) => {
    const { res } = await webapi.querySysDictionary({
      type: type
    });
    if (res.code === 'K-000000') {
      this.setState({
        cityArr: res.context.sysDictionaryVOS
      });
    } else {
      message.error(res.message || 'Unsuccessful');
    }
  };
  delClinic = async (id) => {
    const { res } = await webapi.deleteClinic({
      id: id
    });
    if (res.code === 'K-000000') {
      message.success(res.message || 'Successful');
      this.init({ pageNum: this.state.pagination.current, pageSize: 10 });
    } else {
      message.error(res.message || 'Unsuccessful');
    }
  };
  enableAndDisable = async (id) => {
    // message.info('API under development');
    const { res } = await webapi.enableAndDisable(id);
    if (res.code === 'K-000000') {
      message.success(res.message || 'Successful');
      this.init({ pageNum: this.state.pagination.current, pageSize: 10 });
    } else {
      message.error(res.message || 'Unsuccessful');
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
          const exportHref =
            Const.HOST + `/prescriber/exportPrescriber/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('Unsuccessful');
        }

        resolve();
      }, 500);
    });
  };

  showConfirm(id) {
    const that = this;
    confirm({
      title: 'Are you sure to delete this item?',
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
        title: 'Prescriber ID',
        dataIndex: 'prescriberId',
        key: 'prescriberID',
        width: '10%'
      },
      {
        title: 'Prescriber name',
        dataIndex: 'prescriberName',
        key: 'prescriberName',
        width: '15%',
        ellipsis: true
      },
      {
        title: 'Prescriber phone',
        dataIndex: 'phone',
        key: 'prescriberPhone',
        width: '10%'
      },
      {
        title: 'Prescriber city',
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
        title: 'Prescriber type',
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
        title: 'Recommendation code',
        dataIndex: 'prescriberCode',
        key: 'prescriberCode',
        width: '10%',
        render: (text, record) => <p>{this.state.isMapMode ? '' : text}</p>
      },
      {
        title: 'Prescriber status',
        dataIndex: 'enabled',
        key: 'enabled',
        width: '10%',
        render: (text, record) => (
          <p>{record.enabled ? 'Enabled' : 'Disabled'}</p>
        )
      },
      {
        title: 'Action',
        key: 'action',
        width: '10%',
        render: (text, record) => (
          <span>
            <Tooltip placement="top" title="Details">
              <Link
                to={'/prescriber-edit/' + record.id}
                className="iconfont iconDetails"
              ></Link>
            </Tooltip>
            <Divider type="vertical" />
            <a onClick={() => this.enableAndDisable(record.id)}>
              {record.enabled ? 'Disable' : 'Enable'}
            </a>
            {/* <Divider type="vertical" />
            <a onClick={() => this.showConfirm(record.prescriberId)}>Delete</a> */}
          </span>
        )
      }
    ];
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title="Prescriber list" />
          {/*搜索条件*/}
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="prescriberId" />}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'prescriberId',
                    value
                  });
                }}
              />
            </FormItem>

            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="prescriberName" />}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'prescriberName',
                    value
                  });
                }}
              />
            </FormItem>

            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="prescriberPhone" />}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'phone',
                    value
                  });
                }}
              />
            </FormItem>

            <FormItem>
              <SelectGroup
                defaultValue=""
                label="Prescriber city"
                style={{ width: 80 }}
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
              </SelectGroup>
            </FormItem>

            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="prescriberZip" />}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'primaryZip',
                    value
                  });
                }}
              />
            </FormItem>

            <FormItem>
              <Input
                addonBefore="Recommendation code"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFormChange({
                    field: 'prescriberCode',
                    value
                  });
                }}
              />
            </FormItem>

            <FormItem>
              <SelectGroup
                defaultValue=""
                label="Prescriber type"
                style={{ width: 80 }}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  this.onFormChange({
                    field: 'prescriberType',
                    value
                  });
                }}
              >
                <Option value="">
                  <FormattedMessage id="all" />
                </Option>
                {typeArr.map((item) => (
                  <Option value={item.valueEn} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </SelectGroup>
            </FormItem>

            <FormItem>
              <SelectGroup
                defaultValue="true"
                label="Prescriber status"
                style={{ width: 80 }}
                onChange={(value) => {
                  value = value === '' ? '' : value;
                  this.onFormChange({
                    field: 'enabled',
                    value
                  });
                }}
              >
                <Option value="">
                  <FormattedMessage id="all" />{' '}
                </Option>
                <Option value="true" key="enabled">
                  <FormattedMessage id="enabled" />
                </Option>
                <Option value="false" key="disabled">
                  <FormattedMessage id="disabled" />
                </Option>
              </SelectGroup>
            </FormItem>

            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                icon="search"
                onClick={(e) => {
                  e.preventDefault();
                  this.onSearch();
                }}
              >
                <span>
                  <FormattedMessage id="search" />
                </span>
              </Button>

              <Button
                style={{ marginLeft: '20px' }}
                icon="download"
                onClick={(e) => {
                  e.preventDefault();
                  this.onExport();
                }}
              >
                <FormattedMessage id="export" />
              </Button>
            </FormItem>
          </Form>
          <Button style={{ backgroundColor: '#e2001a', color: '#FFFFFF' }}>
            <Link to="/prescriber-add">
              <FormattedMessage id="add" />
            </Link>
          </Button>
        </div>
        <div className="container">
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
