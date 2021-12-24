import React, { Component } from 'react';
import { Input, Form, Row, Col, Select, Button, Spin, DatePicker } from 'antd';
import { SelectGroup, RCi18n, Const } from 'qmkit';
import _ from 'lodash';
import * as webapi from '../webapi'
import moment from 'moment';

const { Option } = Select
const FormItem = Form.Item
const InputGroup = Input.Group
const { RangePicker } = DatePicker;

class LogSearch extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      systemList: [],
      interfaceList: [],
      interfaceLoading: false,
      searchForm: {
        startDate: null,
        endDate: null,
        interface: null,
        requestId: null,
        system: null,
        keywords: null
      },
      currentSearchForm:{}
    }
  }
  componentDidMount() {
    this.init()
  }
  init = () => {
    this.getSystemList()
    let params = {
      pageNum: 0,
      pageSize: 30,
      systemId: '',
      interfaceName: ''
    }
    this.getInterface(params)
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };

  onChangeDate = (date, dateString) => {
    const { searchForm } = this.state;
    searchForm.startDate = dateString[0] ? moment(dateString[0]).format('YYYY-MM-DD') : '';
    searchForm.endDate = dateString[1] ? moment(dateString[1]).format('YYYY-MM-DD') : '';
    this.setState({
      searchForm
    });
  };

  // 获取form各项value
  handleSubmit = () => {
    const { searchForm } = this.state
    this.props.searchLogList(searchForm)

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
  getInterface = (params) => {
    webapi.fetchInterfaceList(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let interfaceList = res.context.intInterfaceVOS.content
        this.setState({
          interfaceList
        })
      }
    })
  }
  searchInterface = (value) => {
    const { searchForm } = this.state
    let params = {
      pageNum: 0,
      pageSize: 30,
      systemId: searchForm.system,
      interfaceName: value
    }
    this.getInterface(params)

  }

  handleSystemChange = (value) => {
    this.onFormChange({
      field: 'system',
      value
    });
    this.onFormChange({
      field: 'interface',
      value: null
    });
    let params = {
      pageNum: 0,
      pageSize: 30,
      systemId: value,
      interfaceName: null
    }
    this.getInterface(params)
  }

  render() {
    const { interfaceLoading, systemList, interfaceList, searchForm } = this.state
    return (
      <Form layout="inline" className="filter-content">
        <Row gutter={24}>
          {/* requestID */}
          <Col span={8}>
            <FormItem>
              <InputGroup compact style={styles.formItemStyle}>
                <Input style={styles.label} disabled defaultValue={RCi18n({ id: 'Log.RequestID' })} />
                <Input
                  style={styles.wrapper}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'requestId',
                      value
                    });
                  }}
                />
              </InputGroup>
            </FormItem>
          </Col>

          {/* system */}
          <Col span={8}>
            <FormItem>
              <InputGroup compact style={styles.formItemStyle}>
                <Input style={styles.label} disabled defaultValue={RCi18n({ id: 'Log.System' })} />
                <Select
                  style={styles.wrapper}
                  getPopupContainer={(trigger: any) => trigger.parentNode}
                  allowClear
                  onChange={(value) => {
                    value = value === '' ? null : value;
                    this.handleSystemChange(value)
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
          {/* interface */}
          <Col span={8}>
            <FormItem>
              <InputGroup compact style={styles.formItemStyle}>
                <Input style={styles.label} disabled defaultValue={RCi18n({ id: 'Log.Interface' })} />
                <Select
                  style={styles.wrapper}
                  allowClear
                  getPopupContainer={(trigger: any) => trigger.parentNode}
                  showSearch
                  value={searchForm.interface}
                  optionFilterProp="children"
                  notFoundContent={interfaceLoading ? <Spin size="small" /> : null}
                  onSearch={_.debounce(this.searchInterface, 500)}
                  filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={(value) => {
                    value = value === '' ? null : value;
                    this.onFormChange({
                      field: 'interface',
                      value
                    });
                    if(!value){
                      this.searchInterface(value)
                    }
                    
                  }}
                >
                  {
                    interfaceList && interfaceList.map((item,index) => (
                      <Option value={item.id} key={index}>{item.name}</Option>
                    ))
                  }
                </Select>
              </InputGroup>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem>
              <InputGroup compact style={styles.formItemStyle}>
                <Input style={styles.label} disabled defaultValue={RCi18n({ id: 'Log.Keywords' })} />
                <Input
                  style={styles.wrapper}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'keywords',
                      value
                    });
                  }}
                />
              </InputGroup>
            </FormItem>
          </Col>
          {/* Log date */}
          <Col span={8}>
            <FormItem>
              <InputGroup compact style={styles.formItemStyle}>
                <Input style={styles.label} disabled defaultValue={(window as any).RCi18n({ id: 'Log.LogDate' })} />
                <RangePicker style={styles.wrapper} onChange={this.onChangeDate} format={'YYYY-MM-DD'} />
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
                shape="round" onClick={this.handleSubmit}>
                {RCi18n({ id: 'Log.Search' })}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
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

export default Form.create()(LogSearch)
