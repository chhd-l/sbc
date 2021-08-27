import React from 'react';
import { BreadCrumb, Headline, Const, history, RCi18n } from 'qmkit';
import { Breadcrumb, Button, Col, DatePicker, Form, Icon, Input, Radio, Row, Select, Spin, Tag, Tooltip } from 'antd';
import { FormattedMessage } from '_react-intl@5.6.8@react-intl';
import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

const TemplateEdit=()=>{
  return(
    <div >
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>
          Template Edit
        </Breadcrumb.Item>
      </BreadCrumb>

      <Spin spinning={false}>
        <div className="container-search">
          <Headline title={'Template Edit'} />

          <div>
            <div style={styles.title}>
              <span style={styles.titleText}>Template Information</span>
              {/*{emailStatus === 'Draft' ? <Tag>{emailStatus}</Tag> : null}*/}
              {/*{emailStatus === 'Finish' ? <Tag color="#87d068">{emailStatus}</Tag> : null}*/}
              {/*{emailStatus === 'To do' ? <Tag color="#108ee9">{emailStatus}</Tag> : null}*/}
            </div>
            <Form layout="horizontal" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} labelAlign="right">
              <Row style={{ marginTop: 20 }}>
                <Col span={8}>
                </Col>
              </Row>
            </Form>
          </div>

          <Form layout="horizontal" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} labelAlign="right">
            <Row style={{ marginTop: 20 }}>
              <Col span={8}>
                <FormItem label={<FormattedMessage id="Marketing.Email"/>}>
                    <Input
                      // disabled={detailForm.consumerType === 'Member' || this.state.isDetail}
                      // // onChange={(e) => {
                      // //   const value = (e.target as any).value;
                      // //   this.onDetailsFormChange({
                      // //     field: 'email',
                      // //     value
                      // //   });
                      // // }}
                    />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={<FormattedMessage id="Marketing.Email"/>}>
                  <Input
                    // disabled={detailForm.consumerType === 'Member' || this.state.isDetail}
                    // // onChange={(e) => {
                    // //   const value = (e.target as any).value;
                    // //   this.onDetailsFormChange({
                    // //     field: 'email',
                    // //     value
                    // //   });
                    // // }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={<FormattedMessage id="Marketing.Email"/>}>
                  <Input
                    // disabled={detailForm.consumerType === 'Member' || this.state.isDetail}
                    // // onChange={(e) => {
                    // //   const value = (e.target as any).value;
                    // //   this.onDetailsFormChange({
                    // //     field: 'email',
                    // //     value
                    // //   });
                    // // }}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>



      <div className="bar-button">
          <Button type="primary" style={{ marginRight: 10 }}>
            {<FormattedMessage id="Marketing.Submit" />}
          </Button>
          <Button type="primary" style={{ marginRight: 10 }} >
            {<FormattedMessage id="save" />}
          </Button>
        <Button onClick={() => (history as any).go(-1)} style={{ marginRight: 10 }}>
          {<FormattedMessage id="back" />}
        </Button>
      </div>
    </div>
  )
}


const styles = {
  title: {
    borderBottom: 'solid 1px #cccccc',
    paddingBottom: 10
  },
  titleText: {
    color: '#e2001a',
    marginRight: 10,
    fontWeigh: 500
  },
  label: {
    width: 100
  },
  warpper: {}
} as any;

export default TemplateEdit