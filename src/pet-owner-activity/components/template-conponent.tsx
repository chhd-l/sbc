import React, { Component } from 'react';
import { Card, Row, Col, Modal, Tag, Button, Icon } from 'antd';

export default class TemplateConponent extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      viewVisible: false
    };
  }
  render() {
    const { avtivity } = this.props;
    const { viewVisible } = this.state;
    let viewParams = {
      toEmail: avtivity.detailsResponse && avtivity.detailsResponse.email ? avtivity.detailsResponse.email : '',
      ccList: avtivity.detailsResponse && avtivity.detailsResponse.ccList ? avtivity.detailsResponse.ccList : [],
      templateName: avtivity.emailTemplate,
      templateContent: avtivity.emailTemplateHtml ? avtivity.emailTemplateHtml : ''
    };
    return (
      <div className="template-component">
        <Card style={{ width: '95%', overflow: 'hidden' }}>
          <iframe ref="previewIframe" srcDoc={viewParams.templateContent} width="100%" height="100%" frameBorder="0"></iframe>
        </Card>
        <div className="footer-btn">
          <Button
            type="link"
            className="viewMore"
            onClick={() =>
              this.setState({
                viewVisible: true
              })
            }
          >
            View More <Icon type="right" />
          </Button>
        </div>
        <Modal
          visible={viewVisible}
          width="850px"
          maskClosable={false}
          title={viewParams.templateName ? viewParams.templateName : 'View'}
          centered
          onCancel={() => {
            this.setState({
              viewVisible: false
            });
          }}
          footer={[
            <Button
              key="OK"
              type="primary"
              onClick={() => {
                this.setState({
                  viewVisible: false
                });
              }}
            >
              OK
            </Button>
          ]}
        >
          <div>
            <div className="template-contact">
              <Row className="emailRow">
                <Col span={3} className="templateLable">
                  To List
                </Col>
                <Col span={21}>
                  <Tag>{viewParams.toEmail}</Tag>
                </Col>
              </Row>
              <Row className="emailRow">
                <Col span={3} className="templateLable">
                  Cc List
                </Col>
                <Col span={21}>
                  {viewParams.ccList.map((item, index) => (
                    <Tag key={index}>{item.email}</Tag>
                  ))}
                </Col>
              </Row>
            </div>
            <div className="separate"></div>
            <div>
              <iframe ref="previewIframe" srcDoc={viewParams.templateContent} width="100%" height="700px" frameBorder="0"></iframe>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
