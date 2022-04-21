import React, { Component } from 'react';
import { AuthWrapper, BreadCrumb, Const, Headline, RCi18n, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Input, Row, Col, Select, Button, Tooltip, Spin, Table, Switch, message } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';

const { Option } = Select;
const FormItem = Form.Item
const InputGroup = Input.Group


class InterfaceList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      systemList: [],
      interfaceList: [],
      searchForm: {
        interfaceName: '',
        provider: null,
        invoker: null
      }
    };
  }

  componentDidMount() {
    this.init()
  }

  init = () => {
    this.getSystemList()
    this.getInterfaceList({})
  }

  getSystemList = () => {
    webapi.fetchSystemList().then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let systemList = res.context.intSystemVOS
        this.setState({
          systemList
        })
      }
    })
  }


  getInterfaceList = (params) => {
    this.setState({
      loading: true
    })
    webapi.fetchInterfaceList(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        const { pagination } = this.state
        let interfaceList = res.context.intInterfaceVOS.content
        pagination.total = res.context.intInterfaceVOS.total
        pagination.current = res.context.intInterfaceVOS.number + 1
        this.setState({
          interfaceList,
          loading: false,
          pagination
        })
      } else {
        this.setState({
          loading: false
        })
      }
    }).catch(err => {
      this.setState({
        loading: false
      })
    })
  }

  onSearch = () => {
    const { searchForm } = this.state
    let params = {
      apiInvokerId: searchForm.invoker,
      apiProviderId: searchForm.provider,
      interfaceName: searchForm.interfaceName,
      pageSize: 10,
      pageNum: 0
    }
    this.getInterfaceList(params)
  }
  handlePageChange = (pagination) => {
    const { searchForm } = this.state
    this.setState({
      pagination
    })
    let params = {
      apiInvokerId: searchForm.invoker,
      apiProviderId: searchForm.provider,
      interfaceName: searchForm.interfaceName,
      pageSize: pagination.pageSize,
      pageNum: pagination.current-1,

    }
    this.getInterfaceList(params)
  }
  onRefresh = () => {
    const { searchForm,pagination } = this.state
    let params = {
      apiInvokerId: searchForm.invoker,
      apiProviderId: searchForm.provider,
      interfaceName: searchForm.interfaceName,
      pageSize: pagination.pageSize,
      pageNum: pagination.current-1,
    }
    this.getInterfaceList(params)
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  onStatusChange = (checked,interfaceId)=>{
    webapi.updateLogStatus({interfaceId,addLog:checked?1:0}).then(data=>{
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        message.success(res.message)
        this.onRefresh()
      }
    })
  }

  render() {
    const { systemList, interfaceList, pagination, loading } = this.state
    const columns = [
      {
        title: <FormattedMessage id="Interface.InterfaceID" />,
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: <FormattedMessage id="Interface.Name" />,
        dataIndex: 'name',
        key: "name"
      },
      {
        title: <FormattedMessage id="Interface.Provider" />,
        dataIndex: 'apiProviderName',
        key: "provider"
      },
      {
        title: <FormattedMessage id="Interface.Invoker" />,
        dataIndex: 'apiInvokerName',
        key: "invoker"
      },
      {
        title: <FormattedMessage id="Interface.DataFlow" />,
        key: 'dataFlow',
        render: (text, record) => (
          <p>
            <span>{record.dataSourceFromName}</span>
            <span> → </span>
            <span>{record.dataSourceToName}</span>
          </p>
        )
      },
      {
        title: <FormattedMessage id="Interface.URL" />,
        dataIndex: 'url',
        key: 'url'
      },
      {
        title: <FormattedMessage id="Interface.Method" />,
        dataIndex: 'method',
        key: 'method'
      },
      {
        title: <FormattedMessage id="Interface.Type" />,
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: <FormattedMessage id="Interface.Operation" />,
        dataIndex: 'Operation',
        render: (text, record) => (
          <AuthWrapper functionName="f_interface_details">
            <Switch checked={record.addLog?true:false} 
            size="small"
            style={{marginRight:10}}
            onChange={(checked)=>this.onStatusChange(checked,record.id)} />

            <Tooltip placement="top" title={RCi18n({ id: "Product.Details" })}>
              <Link to={`/interface-detail/${record.id}`}
                className="iconfont iconDetails" />
            </Tooltip>
            
          </AuthWrapper>
        )
      }
    ]

    return (
      <AuthWrapper functionName="f_interface_list">
        <Spin spinning={loading}>
          <BreadCrumb />
          <div className="container-search">
            <Headline title={<FormattedMessage id="Interface.InterfaceList" />} />
            {/*搜索*/}
            <Form className="filter-content" layout="inline">
              <Row>


                {/* InterfaceName */}
                <Col span={8}>
                  <FormItem>
                    <InputGroup compact style={styles.formItemStyle}>
                      <Input style={styles.label} disabled title={RCi18n({ id: 'Interface.InterfaceName' })} defaultValue={RCi18n({ id: 'Interface.InterfaceName' })} />
                      <Input
                        style={styles.wrapper}
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onFormChange({
                            field: 'interfaceName',
                            value
                          });
                        }}
                      />
                    </InputGroup>
                  </FormItem>
                </Col>

                {/* Provider */}
                <Col span={8}>
                  <FormItem>
                    <InputGroup compact style={styles.formItemStyle}>
                      <Input style={styles.label} disabled title={RCi18n({ id: 'Interface.Provider' })} defaultValue={RCi18n({ id: 'Interface.Provider' })} />
                      <Select
                        style={styles.wrapper}
                        getPopupContainer={(trigger: any) => trigger.parentNode}
                        allowClear
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onFormChange({
                            field: 'provider',
                            value
                          });
                        }}
                      >
                        {
                          systemList && systemList.map((item,index) => (
                            <Option value={item.id} key={index}>{item.sysShort}</Option>
                          ))
                        }
                      </Select>
                    </InputGroup>
                  </FormItem>

                </Col>
                {/* Invoker */}
                <Col span={8}>
                  <FormItem>
                    <InputGroup compact style={styles.formItemStyle}>
                      <Input style={styles.label} disabled title={RCi18n({ id: 'Interface.Invoker' })} defaultValue={RCi18n({ id: 'Interface.Invoker' })} />
                      <Select
                        style={styles.wrapper}
                        getPopupContainer={(trigger: any) => trigger.parentNode}
                        allowClear
                        onChange={(value) => {
                          value = value === '' ? null : value;
                          this.onFormChange({
                            field: 'invoker',
                            value
                          });
                        }}
                      >
                        {
                          systemList && systemList.map((item,index) => (
                            <Option value={item.id} key={index}>{item.sysShort}</Option>
                          ))
                        }
                      </Select>
                    </InputGroup>
                  </FormItem>

                </Col>
              </Row>


              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon="search"
                      shape="round" onClick={this.onSearch}>
                      {RCi18n({ id: 'Log.Search' })}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <div className="container">
            <Table
              dataSource={interfaceList}
              pagination={pagination}
              onChange={this.handlePageChange}
              columns={columns}
              rowKey="id"
            />
          </div>
        </Spin>
     </AuthWrapper>
    );
  }
}


const styles = {
  formItemStyle: {
    width: 335
  },
  label: {
    width: 135,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.65)',
    backgroundColor: '#fff',
    cursor: 'text'
  },
  wrapper: {
    width: 200
  },
} as any

export default Form.create()(InterfaceList);
