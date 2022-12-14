import React, { Component } from 'react';
import moment from 'moment'
import * as weapi from './webapi';
import { BreadCrumb, cache, DataGrid, Headline, SelectGroup, Const, util } from 'qmkit';
import { Button, Col, Form, Row, DatePicker, Icon, Select, Tooltip, message } from 'antd';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const styles = {
  formItemStyle: {
    width: 335
  },
  label: {
    width: 132,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  wrapper: {
    width: 180
  },
  icon: {
    color: '#e2001a',
    fontSize: 20,
  },
  click: {
    cursor:'pointer',
  },
  tip:{
    color: '#e2001a',
    marginBottom: '10px',
  }
} as any;



class ExportReport extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      dataSource: [],

      pageSize:10,
      pageNum:0,
      total:0,

      searchForm:{},
    };
  }
  async componentDidMount() {
    this.setState({
      searchForm:{},
      dataSource: [],
      pageNum:0,
    },()=>{
      this.getData()
    })
  }

  /**
   * 获取数据
   */
  async getData(){
    this.setState({
      loading:true
    })
    const { searchForm,pageSize,pageNum } = this.state
    let beginTime = '',endTime=''
    if (searchForm.time && searchForm.time.length > 0) {
      beginTime = searchForm.time[0].format(Const.DAY_FORMAT);
      endTime = searchForm.time[1].format(Const.DAY_FORMAT);
    }
    let result = await weapi.fetchAnalysisExportReport({
      beginTime,
      endTime,
      pageSize: pageSize,
      pageNum: pageNum,
      module:searchForm.module ? parseInt(searchForm.module) : ''
    })
    this.setState({
      dataSource: result.res.context.tradeAsyncExportVOS.content,
      total:result.res.context.tradeAsyncExportVOS.total,
      loading:false
    })
  }

  /**
   * 搜索
   * @param e
   */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          searchForm:values,
          pageNum:0,
        },()=>{
          this.getData()
        })
      }
    });
  };

  /**
   * 翻页
   * @param pagination
   */
  handleTableChange(pagination){
    this.setState({
      pageNum:pagination.current - 1
    },()=>{
      this.getData()
    })
  }

  /**
   * 下载
   * @param url
   */
  download =async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        const base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          const result = JSON.stringify({
            id,
            token: token
          });
          const encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref = Const.HOST + `/digitalStrategy/async/export/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }
        resolve();
      }, 500);
    });
    // 新窗口下载
    // const exportHref = Const.HOST + `/digitalStrategy/async/export/${id}`;
    // window.open(exportHref);
    // await weapi.fetchAnalysisReportsDown(id)
  };
  SizeChange(limit){
    let size = '';
    if(limit < 0.1 * 1024){                            //小于0.1KB，则转化成B
      size = limit.toFixed(2) + 'B'
    }else if(limit < 0.1 * 1024 * 1024){            //小于0.1MB，则转化成KB
      size = (limit/1024).toFixed(2) + 'KB'
    }else if(limit < 0.1 * 1024 * 1024 * 1024){        //小于0.1GB，则转化成MB
      size = (limit/(1024 * 1024)).toFixed(2) + 'MB'
    }else{                                            //其他转化成GB
      size = (limit/(1024 * 1024 * 1024)).toFixed(2) + 'GB'
    }

    let sizeStr = size + '';                        //转成字符串
    let index = sizeStr.indexOf('.');                    //获取小数点处的索引
    let dou = sizeStr.substr(index + 1 ,2)            //获取小数点后两位的值
    if(dou == '00'){                                //判断后两位是否为00，如果是则删除00
      return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
    }
    return size;
  }
  render() {
    const columns = [
      {
        title: <FormattedMessage id="Analysis.BatchID" />,
        dataIndex: 'batchId',
        key:'batchId'
      },
      {
        title: <FormattedMessage id="Analysis.BatchTime" />,
        dataIndex: 'createTime',
        key:'createTime'

      },
      {
        title: <FormattedMessage id="Setting.module" />,
        dataIndex: 'module',
        key:'module',
        render:(module)=>{
          switch (module){
            case 1:
              return <span>{<FormattedMessage id="Menu.Order" />}</span>
            case 2:
              return <span>{<FormattedMessage id="Menu.Subscription" />}</span>
            case 3:
              return <span>{<FormattedMessage id="Menu.Tasks" />}</span>
            default:
              return module
          }
        }
      },
      {
        title: <FormattedMessage id="Analysis.FileName" />,
        dataIndex: 'fileName',
        key:'fileName',
      },
      {
        title: <FormattedMessage id="Setting.operatorAccount" />,
        dataIndex: 'operAccount',
        key:'operAccount',
      },
      {
        title: <FormattedMessage id="Setting.Size" />,
        dataIndex: 'fileSize',
        key:'fileSize',
        render:fileSize => {
          let size = ''
          fileSize ? size = this.SizeChange(fileSize) : size = ''
          return <span>{size}</span>
        }
      },
      {
        title: <FormattedMessage id="Product.Status" />,
        dataIndex: 'status',
        key:'status',
        render: status => {
          switch (status){
            case 1:
              return <span><FormattedMessage id="Analysis.NotStarted" /></span>
            case 2:
              return <span><FormattedMessage id="Marketing.InProcess" /></span>
            case 3:
              return <span><FormattedMessage id="Analysis.Fail" /></span>
            case 4:
              return <span><FormattedMessage id="Analysis.Success" /></span>
          }
        }
      },
      {
        title: <FormattedMessage id="Appointment.Operation" />,
        dataIndex: 'Operation',
        render: (text, record) => {
          switch (record.status){
            case 1:
              return <span></span>
            case 2:
              return (
                <Tooltip placement="top" title={<FormattedMessage id="Marketing.InProcess" />}>
                  <Icon type="loading" style={{...styles.icon,...styles.click}}/>
                </Tooltip>
              )
            case 3:
              return <span></span>
            case 4:
              let docment = (
                <Tooltip placement="top" title={<FormattedMessage id="Analysis.Down" />}>
                  <Icon type="cloud-download" style={styles.icon} onClick={()=>{
                    this.download(record.id)
                  }}/>
                </Tooltip>
              )
              if(moment(record.loseTime, 'YYYY-MM-DD HH:mm:ss.SSS').isAfter(moment())){
                return docment
              }else {
                return
              }
          }
        }
      },
    ];
    const { loading,pageNum,pageSize,total,dataSource } = this.state
    const { getFieldDecorator } = this.props.form;
    return(
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={<FormattedMessage id="Analysis.ExportReport" />} />
          <div style={styles.tip}>
            <FormattedMessage id="Analysis:PleaseRemindThatTheReportWillExpireAfter7DaysAutomatically" />
          </div>
          <Form layout="inline" style={{ marginBottom: 20 }} onSubmit={this.handleSubmit}>
            <Row>
              <Col span={8}>
                <FormItem>
                  {
                    getFieldDecorator('module')(
                      <SelectGroup
                        allowClear
                        getPopupContainer={() => document.getElementById('page-content')}
                        style={styles.wrapper}
                        label={
                          <p style={styles.label}>
                            {<FormattedMessage id="Setting.module" />}
                          </p>
                        }
                        showSearch
                        optionFilterProp="children"
                      >
                        <Option value="1">{<FormattedMessage id="Menu.Order" />}</Option>
                        <Option value="2">{<FormattedMessage id="Menu.Subscription" />}</Option>
                        <Option value="3">{<FormattedMessage id="Menu.Tasks" />}</Option>
                      </SelectGroup>
                    )
                  }
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  {
                    getFieldDecorator('time')(
                      <RangePicker format="YYYY-MM-DD" style={{width:335}}/>
                    )
                  }
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon="search"
                    shape="round"
                  >
                    <span><FormattedMessage id="Order.Search" /></span>
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="container-search">
          <DataGrid dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    onChange={(pagination, filters, sorter) =>
                      this.handleTableChange(pagination)
                    }
                    pagination={{
                      current:pageNum + 1,
                      pageSize:pageSize,
                      total:total
                    }}
                    rowKey={record=>record.id}>
          </DataGrid>
        </div>
      </div>
    )
  }
}

const ExportReportFrom = Form.create({})(ExportReport)
export default ExportReportFrom