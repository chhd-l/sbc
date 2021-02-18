import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline } from 'qmkit';
import { Row, Col, Tabs, Form } from 'antd';

const { TabPane } = Tabs;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};
export default class PetAll extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      contactId: this.props.match.params.id,
      title: 'View All Properties'
    };
  }
  render() {
    const { title } = this.state;
    return (
      <div>
         <BreadCrumb />
        <div className="container-search">
          <Headline title={title} />
        </div>
        <div className="container">
          <Tabs>
            <TabPane tab="Core" key="1">
            <Row type="flex" justify="start">
              <Col span={8}>
                <FormItem {...formItemLayout} label="Pet Owner ID" required={true}>
                  <div>1234</div>
                </FormItem>
              </Col>
            </Row>
            </TabPane>
            <TabPane tab="Location" key="2">
            </TabPane>
            <TabPane tab="Segments" key="3">
            </TabPane>
            <TabPane tab="Communication" key="4">
            </TabPane>
            <TabPane tab="Club Member Service List" key="5">
            </TabPane>
            <TabPane tab="Feedback" key="6">
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
