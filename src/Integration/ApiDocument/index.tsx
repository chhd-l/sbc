import { Col, Descriptions, Icon, Row, Spin, Table, Tree } from "antd";
import { isArray } from "lodash";
import { AuthWrapper, BreadCrumb, Const, Headline, RCi18n } from "qmkit";
import React, { Component } from "react";
import * as webapi from './webapi'
import './index.less'

const { TreeNode } = Tree

export default class ApiDocument extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      documentMenu: [],
      detailInfo: {},
      expandedKeys: [],
      pathParameterData:[],
      headerData:[]
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
      if (res.code === Const.SUCCESS_CODE) {
        documentMenu = res.context.menus
      }
      this.setState({
        loading: false,
        documentMenu
      })

    }).catch(err => {
      this.setState({
        loading: false,
      })
    })
  }
  handleSelect = (key, info) => {
    console.log(key);

    if (key.length > 0 && key[0].indexOf('P') !== -1) {
      this.setState({
        expandedKeys: key
      })
    }
  }
  onExpand = (key) => {
    console.log('onExpand', key);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys: key
    });
  };

  render() {
    const { loading, documentMenu, expandedKeys, detailInfo,pathParameterData,headerData } = this.state
    const pathParameterColumns = [{
      title: RCi18n({ id: 'ApiDocument.ParameterName' }),
      dataIndex: 'parameterName',
      key: 'parameterName',
    },
    {
      title: RCi18n({ id: 'ApiDocument.Example' }),
      dataIndex: 'example',
      key: 'example',
    },
    {
      title: RCi18n({ id: 'Order.remark' }),
      dataIndex: 'remark',
      key: 'remark',
    }]
    const headerColumns=[
      {
        title: RCi18n({ id: 'ApiDocument.ParameterName' }),
        dataIndex: 'parameterName',
        key: 'parameterName',
      },
      {
        title: RCi18n({ id: 'ApiDocument.ParameterValue' }),
        dataIndex: 'parameterValue',
        key: 'parameterValue',
      },
      {
        title: RCi18n({ id: 'ApiDocument.Required' }),
        dataIndex: 'required',
        key: 'required',
      },
      {
        title: RCi18n({ id: 'ApiDocument.Example' }),
        dataIndex: 'example',
        key: 'example',
      },
      {
        title: RCi18n({ id: 'Order.remark' }),
        dataIndex: 'remark',
        key: 'remark',
      }
    ]
    return (
      <AuthWrapper functionName="f_order_monitor_details">
        <Spin spinning={loading}>
          <BreadCrumb />
          <div className="container">
            <Row className="apiDocument">
              <Col span={4}>

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
                      {detailInfo.apiName || ''}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="label"> {RCi18n({ id: 'ApiDocument.Creater' })}</span>}>
                      {detailInfo.creater || ''}
                    </Descriptions.Item>

                    <Descriptions.Item label={<span className="label"> {RCi18n({ id: 'PetOwner.Status' })}</span>}>
                      {detailInfo.status || ''}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="label"> {RCi18n({ id: 'ApiDocument.UpdateTime' })}</span>}>
                      {detailInfo.updateTime || ''}
                    </Descriptions.Item>

                  </Descriptions>
                  <Descriptions column={1}>

                    <Descriptions.Item label={<span className="label"> {RCi18n({ id: 'ApiDocument.Tag' })}</span>}>
                      {detailInfo.tag || ''}
                    </Descriptions.Item>
                    <Descriptions.Item label={<span className="label"> {RCi18n({ id: 'ApiDocument.ApiPath' })}</span>}>
                      {detailInfo.apiPath || ''}
                    </Descriptions.Item>

                    <Descriptions.Item label={<span className="label"> {RCi18n({ id: 'ApiDocument.MockUrl' })}</span>}>
                      {detailInfo.mockUrl ? <a href={detailInfo.mockUrl}>{detailInfo.mockUrl}</a> : null}
                    </Descriptions.Item>
                  </Descriptions>

                </div>
                <Headline className="interface-title" title={RCi18n({ id: 'ApiDocument.RequestParameter' })} />
                <div className="apiRequestParameter">
                  <div>
                    <p>{RCi18n({ id: 'ApiDocument.PathParameters' })}:</p>
                    <Table bordered dataSource={pathParameterData} pagination={false} columns={pathParameterColumns}></Table>
                  </div>
                  <div>
                    <p>{RCi18n({ id: 'ApiDocument.Headers' })}:</p>
                    <Table bordered dataSource={headerData} pagination={false} columns={headerColumns}></Table>
                  </div>

                </div>

              </Col>
            </Row>


          </div>

        </Spin>
      </AuthWrapper>
    )
  }

}