import { Col, Descriptions, Icon, Row, Spin, Table, Tag, Tree } from "antd";
import { isArray } from "lodash";
import { AuthWrapper, BreadCrumb, Const, Headline, RCi18n } from "qmkit";
import React, { Component } from "react";
import * as webapi from './webapi'
import './index.less'
import moment from "moment";

const { TreeNode } = Tree

export default class ApiDocument extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      documentMenu: [],
      detailInfo: {},
      expandedKeys: [],
      pathParameterData: [],
      headerData: [],
      bodyData: [],
      returnData: [],
      isInit: true,
      firstId: '',
      mockDomain: 'https://d2cdevops.royalcanin.com/mock/'
    }
  }
  componentDidMount() {
    this.init()
  }
  init = () => {
    this.getDocumentMenu()
  }
  getDocumentMenu = () => {
    this.setState({
      loading: true
    })
    webapi.getDocumentMenu().then(data => {
      const { res } = data
      let documentMenu = []
      let firstId = ''
      if (res.code === Const.SUCCESS_CODE) {
        documentMenu = res.context.menus
        firstId = this.getFirstId(documentMenu)
      }
      this.setState({
        loading: false,
        documentMenu,
        firstId,
        defaultExpandedKeys: firstId ? [firstId] : []
      }, () => {
        if (this.state.isInit && firstId) {
          this.getApiDetails(firstId)
        }
      })

    }).catch(err => {
      this.setState({
        loading: false,
      })
    })
  }

  getApiDetails = (id) => {
    this.setState({
      isInit: false,
      loading: true
    })
    webapi.getApiDetails(id).then(data => {
      const { res } = data
      let detailInfo = {}
      let pathParameterData = []
      let headerData = []
      let returnData = []
      let bodyData = []
      if (res.code === Const.SUCCESS_CODE) {
        detailInfo = res.context.detail
        pathParameterData = res.context.detail.req_params
        headerData = res.context.detail.req_headers
        bodyData = res.context.detail.req_body_other ? this.yApiJsonToArray(JSON.parse(res.context.detail.req_body_other)) : []
        returnData = res.context.detail.res_body ? this.yApiJsonToArray(JSON.parse(res.context.detail.res_body)) : []

      }
      this.setState({
        detailInfo,
        pathParameterData,
        headerData,
        returnData,
        loading: false,
      })
    }).catch(err => {
      this.setState({
        loading: false,

      })
    })
  }

  getFirstId = (arr) => {
    if (arr && arr.length > 0) {
      let firstId = null
      for (let i = 0; i < arr.length; i++) {
        let list = arr[i].list
        if (list && list.length > 0 && list[0]._id) {
          firstId = list[0]._id
          break
        }
      }
      return firstId
    }
  }
  handleSelect = (key, info) => {
    console.log(key);

    if (key.length > 0) {
      if (key[0].indexOf('P') !== -1) {
        this.setState({
          expandedKeys: key
        })
      }
      else {
        this.getApiDetails(key[0])
      }

    }
  }
  onExpand = (key) => {
    this.setState({
      expandedKeys: key
    });
  };

  yApiJsonToArray = (obj) => {
    let required = obj.required || []
    let data = obj.properties
    let returnData = []
    if (data) {
      for (let name in data) {
        returnData.push(
          {
            name: name,
            type: data[name].type,
            required: required.indexOf(name) !== -1 ? '1' : '0',
            defaults: data[name].default,
            remark: data[name].description,
            otherInformation: this.getOtherInformation(data[name]),
            children: data[name].properties ? this.yApiJsonToArray(data[name]) : null
          }
        )
      }
    }
    return returnData

  }
  getOtherInformation = (obj) => {
    const exceptArr = ['type', 'description', 'default', 'properties', '$$ref', 'title']
    let otherInformation = ''
    for (let key in obj) {
      if (exceptArr.indexOf(key) === -1) {
        otherInformation = key + ' ' + (obj[key].constructor === Object ? this.getOtherInformation(obj[key]) : obj[key].toString())
      }
    }
    return otherInformation

  }



  render() {
    const { loading, documentMenu, expandedKeys, detailInfo, pathParameterData, headerData,bodyData, returnData, mockDomain } = this.state
    const pathParameterColumns = [{
      title: RCi18n({ id: 'ApiDocument.ParameterName' }),
      dataIndex: 'name',
      key: 'parameterName',
    },
    {
      title: RCi18n({ id: 'ApiDocument.Example' }),
      dataIndex: 'example',
      key: 'example',
    },
    {
      title: RCi18n({ id: 'Order.remark' }),
      dataIndex: 'desc',
      key: 'remark',
    }]
    const headerColumns = [
      {
        title: RCi18n({ id: 'ApiDocument.ParameterName' }),
        dataIndex: 'name',
        key: 'parameterName',
      },
      {
        title: RCi18n({ id: 'ApiDocument.ParameterValue' }),
        dataIndex: 'value',
        key: 'parameterValue',
      },
      {
        title: RCi18n({ id: 'ApiDocument.Required' }),
        dataIndex: 'required',
        key: 'required',
        render: (text) => (
          <p>{text === '0' ? 'No' : text === '1' ? 'Yes' : ''}</p>
        )
      },
      {
        title: RCi18n({ id: 'ApiDocument.Example' }),
        dataIndex: 'example',
        key: 'example',
      },
      {
        title: RCi18n({ id: 'Order.remark' }),
        dataIndex: 'desc',
        key: 'remark',
      }
    ]

    const returnDataColumns = [
      {
        title: RCi18n({ id: 'Interface.Name' }),
        dataIndex: 'name',
        key: 'name',
        width: '20%'
      },
      {
        title: RCi18n({ id: 'Interface.Type' }),
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: RCi18n({ id: 'ApiDocument.Required' }),
        dataIndex: 'required',
        key: 'required',
        render: (text) => (
          <p>{text === '0' ? RCi18n({ id: 'ApiDocument.NotRequired' }) : text === '1' ? RCi18n({ id: 'ApiDocument.Required' }) : ''}</p>
        )
      },
      {
        title: RCi18n({ id: 'ApiDocument.Defaults' }),
        dataIndex: 'defaults',
        key: 'defaults',
      },
      {
        title: RCi18n({ id: 'Order.remark' }),
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: RCi18n({ id: 'ApiDocument.otherInformation' }),
        dataIndex: 'otherInformation',
        key: 'otherInformation',
      }
    ]


    return (
      <AuthWrapper functionName="f_order_monitor_details">
        <Spin spinning={loading}>
          <BreadCrumb />
          <div className="container">
            <Row className="apiDocument">
              <Col span={5}>

                <Tree showIcon
                  onSelect={this.handleSelect}
                  expandedKeys={expandedKeys}
                  onExpand={this.onExpand}
                  autoExpandParent={true}
                  style={{ maxWidth: 264 }}>
                  {
                    documentMenu && documentMenu.map((doucment, index) => (
                      <TreeNode icon={<Icon type="folder-open" />} key={'P_' + doucment._id} title={<p className="apiTreeNode">{doucment.name}</p>}>
                        {doucment.list && doucment.list.map((item, i) => (
                          <TreeNode key={item._id} title={<p className="apiTreeNode" title={item.title}>{item.title}</p>} />
                        ))}
                      </TreeNode>
                    ))
                  }
                </Tree>
              </Col>
              <Col span={18}>

                <Headline className="interface-title" title={RCi18n({ id: 'Subscription.basicInformation' })} />
                {/* 跳转后的数据展示 */}
                <div className="apiBasicInformation">
                  <Descriptions column={2} >
                    <Descriptions.Item label={<span className="label"> {RCi18n({ id: 'ApiDocument.ApiName' })}</span>}>
                      {detailInfo.title || ''}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="label"> {RCi18n({ id: 'ApiDocument.Creater' })}</span>}>
                      {detailInfo.username || ''}
                    </Descriptions.Item>

                    <Descriptions.Item label={<span className="label"> {RCi18n({ id: 'PetOwner.Status' })}</span>}>
                      {detailInfo.status === 'done' ? <p>
                        <span className="successPoint"></span>
                        {RCi18n({ id: 'ApiDocument.Completed' })}
                      </p> : <p>
                        <span className="failedPoint"> </span>
                        {RCi18n({ id: 'ApiDocument.Uncompleted' })}
                      </p>}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="label"> {RCi18n({ id: 'ApiDocument.UpdateTime' })}</span>}>
                      {detailInfo.up_time ? moment(detailInfo.up_time).format('YYYY-MM-DD HH:mm:ss') : ''}
                    </Descriptions.Item>

                  </Descriptions>
                  <Descriptions column={1}>

                    <Descriptions.Item label={<span className="label"> {RCi18n({ id: 'ApiDocument.Tag' })}</span>}>
                      {detailInfo.tag ? detailInfo.tag.toString() : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="label"> {RCi18n({ id: 'ApiDocument.ApiPath' })}</span>}>
                      <Tag color={detailInfo.method === 'GET' ? "#cfefdf" : detailInfo.method === 'POST' ? "#d2eafb" : ""} >
                        <span style={{
                          color: detailInfo.method === 'GET' ? '#00a854' :
                            detailInfo.method === 'POST' ? '#108ee9' : '', fontSize: 12
                        }}>{detailInfo.method}</span> </Tag>
                      {detailInfo.path || ''}
                    </Descriptions.Item>

                    <Descriptions.Item label={<span className="label"> {RCi18n({ id: 'ApiDocument.MockUrl' })}</span>}>
                      {detailInfo.path ? <a href={mockDomain + detailInfo.project_id + detailInfo.path} target="_blank">
                        {mockDomain + detailInfo.project_id + detailInfo.path}</a> : null}
                    </Descriptions.Item>
                  </Descriptions>

                </div>

                <Headline className="interface-title" title={RCi18n({ id: 'ApiDocument.RequestParameter' })} />
                {detailInfo.req_params ? <div className="apiTable">
                  <h3>{RCi18n({ id: 'ApiDocument.PathParameters' })}:</h3>
                  <Table bordered
                    rowClassName={(record, index) => {
                      if (index % 2 === 1) {
                        return 'tableRowColor'
                      }
                    }}
                    rowKey="_id"
                    dataSource={pathParameterData}
                    pagination={false}
                    columns={pathParameterColumns} ></Table>
                </div> : null}
                {detailInfo.req_headers ? <div className="apiTable">
                  <h3>{RCi18n({ id: 'ApiDocument.Headers' })}:</h3>
                  <Table bordered
                    rowClassName={(record, index) => {
                      if (index % 2 === 1) {
                        return 'tableRowColor'
                      }
                    }}
                    rowKey="_id"
                    dataSource={headerData}
                    pagination={false}
                    columns={headerColumns}></Table>
                </div> : null}

                {
                  detailInfo.req_body_other ? (
                    <div className="apiTable">
                      <h3>{RCi18n({ id: 'ApiDocument.Body' })}:</h3>
                      <Table bordered
                        indentSize={10}
                        rowClassName={(record, index) => {
                          if (index % 2 === 1) {
                            return 'tableRowColor'
                          }
                        }}
                        rowKey={(record, index) => record.name + '_' + index.toString()}
                        dataSource={bodyData}
                        pagination={false}
                        columns={returnDataColumns}></Table>
                    </div>
                  ) : null
                }




                <Headline className="interface-title" title={RCi18n({ id: 'ApiDocument.ReturnData' })} />
                <div className="apiTable">
                  <Table bordered
                    indentSize={10}
                    rowClassName={(record, index) => {
                      if (index % 2 === 1) {
                        return 'tableRowColor'
                      }
                    }}
                    rowKey={(record, index) => record.name + '_' + index.toString()}
                    dataSource={returnData}
                    pagination={false}
                    columns={returnDataColumns}></Table>
                </div>

              </Col>
            </Row>


          </div>

        </Spin>
      </AuthWrapper>
    )
  }

}