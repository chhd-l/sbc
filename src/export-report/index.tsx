import React, { Component } from 'react';
import * as weapi from './webapi';
import { BreadCrumb, cache, DataGrid, Headline, SelectGroup, Const } from 'qmkit';
import { Button, Col, Form, Row, DatePicker, Icon, Select } from 'antd';
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
  }
} as any;



class ExportReport extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      dataSource: [],
      pagination:{
        pageSize:10,
        pageNum:0,
        total:0,
      },
      searchForm:{},
    };
  }
  async componentDidMount() {
    this.setState({
      searchForm:{},
      dataSource: [],
      pageSize:10,
      pageNum:0,
    },()=>{
      this.getData()
    })
  }
  async getData(){
    this.setState({
      loading:true
    })
    const pager = { ...this.state.pagination };
    const { searchForm,pagination } = this.state
    let beginTime = '',endTime=''
    if (searchForm.time && searchForm.time.length > 0) {
      beginTime = searchForm.time[0].format(Const.DAY_FORMAT);
      endTime = searchForm.time[1].format(Const.DAY_FORMAT);
    }
    let result = await weapi.fetchAnalysisExportReport({
      beginTime,
      endTime,
      pageSize:pagination.pageSzie,
      pageNum:pagination.pageNum,
      module:searchForm.module ? parseInt(searchForm.module) : 0
    })
    pager.total = result.res.context.tradeAsyncExportVOS.total
    this.setState({
      dataSource: result.res.context.tradeAsyncExportVOS.content,
      pagination:pager,
      loading:false
    })
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          searchForm:values
        },()=>{
          this.getData()
        })
      }
    });
  };
  handleTableChange(pagination){
    const pager = { ...this.state.pagination };
    pager.pageNum = pagination.current - 1;
    this.setState({
      pagination:pager
    },()=>{
      this.getData()
    })
  }
  download = url => {
    const eleLink = document.createElement('a');
    eleLink.style.display = 'none';
    // eleLink.target = "_blank"
    eleLink.href = url;
    // eleLink.href = record;
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
  };

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
              break;
            case 2:
              return <span>{<FormattedMessage id="Menu.Subscription" />}</span>
              break;
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
      },
      {
        title: <FormattedMessage id="Product.Status" />,
        dataIndex: 'status',
        key:'status',
        render: status => {
          switch (status){
            case 1:
              return <span><FormattedMessage id="Analysis.NotStarted" /></span>
              break;
            case 2:
              return <span><FormattedMessage id="Marketing.InProcess" /></span>
              break;
            case 3:
              return <span><FormattedMessage id="Analysis.Fail" /></span>
              break;
            case 4:
              return <span><FormattedMessage id="Analysis.Success" /></span>
              break;
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
              break;
            case 2:
              return <Icon type="loading" style={{...styles.icon,...styles.click}}/>
              break;
            case 3:
              return <span></span>
              break;
            case 4:
              return <Icon type="cloud-download" style={styles.icon} onClick={()=>{
                this.download(record.fileUrl)
              }}/>
              break;
          }
        }
      },
    ];
    const { loading,pagination,dataSource } = this.state
    const { getFieldDecorator } = this.props.form;
    return(
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={<FormattedMessage id="Analysis.ExportReport" />} />
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
                    loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
                    columns={columns}
                    onChange={(pagination, filters, sorter) =>
                      this.handleTableChange(pagination)
                    }
                    pagination={pagination}
                    rowKey={record=>record.id}>
          </DataGrid>
        </div>
      </div>
    )
  }
}

const ExportReportFrom = Form.create({})(ExportReport)
export default ExportReportFrom