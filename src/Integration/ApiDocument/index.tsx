import { Col, Descriptions, Icon, Row, Spin, Tree } from "antd";
import { isArray } from "lodash";
import { AuthWrapper, BreadCrumb, Const, Headline, RCi18n } from "qmkit";
import React, { Component } from "react";
import * as webapi from './webapi'

const { TreeNode } = Tree

export default class ApiDocument extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      documentMenu: [],
      detailInfo: {},
      expandedKeys: [],
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
    const { loading, documentMenu, expandedKeys,detailInfo } = this.state
    return (
      <AuthWrapper functionName="f_order_monitor_details">
        <Spin spinning={loading}>
          <BreadCrumb />
          <div className="container">
            <Row>
              <Col span={6}>

                <Tree showIcon onSelect={this.handleSelect}
                  expandedKeys={expandedKeys}
                  onExpand={this.onExpand}
                  autoExpandParent={true}>
                  {
                    documentMenu && documentMenu.map((doucment, index) => (
                      <TreeNode icon={<Icon type="folder-open" />} key={'P_' + doucment._id} title={doucment.name}>
                        {doucment.list && doucment.list.map((item, i) => (
                          <TreeNode key={item._id} title={item.title} />
                        ))}
                      </TreeNode>
                    ))
                  }
                </Tree>
              </Col>
              <Col span={18}>
                <div className="container-search">
                  <Headline title={RCi18n({ id: 'Subscription.basicInformation' })} />
                  {/* 跳转后的数据展示 */}
                  <Descriptions>
                    {/* <Descriptions.Item label={RCi18n({ id: 'Order.OrderNumber' })}>
                    {detailInfo.orderNumber || ''}
                  </Descriptions.Item>
                  <Descriptions.Item label={RCi18n({ id: 'Order.OrderStatus' })}>
                    {detailInfo.orderStatus || ''}
                  </Descriptions.Item>

                  <Descriptions.Item label={RCi18n({ id: 'Order.OrderTime' })}>
                    {detailInfo.orderDate || ''}
                  </Descriptions.Item>
                  <Descriptions.Item label={RCi18n({ id: 'Order.paymentStatus' })}>
                    {detailInfo.orderPaymentStatus || ''}
                  </Descriptions.Item>

                  <Descriptions.Item label={RCi18n({ id: 'Order.OrderSource' })}>
                    {detailInfo.orderSource || ''}
                  </Descriptions.Item>
                  <Descriptions.Item label={RCi18n({ id: 'Order.OrderType' })}>
                    {detailInfo.orderType || ''}
                  </Descriptions.Item>

                  <Descriptions.Item label={RCi18n({ id: 'Order.subscriptionType' })}>
                    {detailInfo.subscriptionType || ''}
                  </Descriptions.Item>
                  <Descriptions.Item label={RCi18n({ id: 'Order.paymentMethod' })}>
                    {detailInfo.paymentMethod || ''}
                  </Descriptions.Item> */}
                  </Descriptions>

                </div>
              </Col>
            </Row>


          </div>

        </Spin>
      </AuthWrapper>
    )
  }

}