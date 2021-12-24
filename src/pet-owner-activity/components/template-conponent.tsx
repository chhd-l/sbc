import React, { Component } from 'react';
import { Card, Row, Col, Modal, Tag, Button, Icon } from 'antd';
import { getPreviewEmailTemp } from '../../../web_modules/qmkit/previewEmail';

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
      toEmail: '',
      ccList: [],
      templateName: '',
      templateContent: ''
    };
    if(avtivity) {
      let ccListString = avtivity.detailsResponse && avtivity.detailsResponse.ccList ? avtivity.detailsResponse.ccList : '';
      const tempData = avtivity.messageSendParams ? JSON.parse(avtivity.messageSendParams)?.templateData : {}
      viewParams = {
        toEmail: avtivity.detailsResponse && avtivity.detailsResponse.email ? avtivity.detailsResponse.email : '',
        ccList: ccListString ? ccListString.split(';'): [],
        templateName: avtivity.emailTemplate,
        templateContent: avtivity.emailTemplateHtml ? getPreviewEmailTemp(avtivity.emailTemplateHtml, tempData) : ''
      };
    }
    return (
      <div className="template-component">
        <Card style={{ width: '95%', overflow: 'hidden' }}>
          <div dangerouslySetInnerHTML={{ __html: viewParams.templateContent }} style={{ zoom: '0.1', maxHeight: '2000px'}}></div>
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
              <Row className="emailRow" style={{ marginTop: 10 }}>
                <Col span={3} className="templateLable">
                  Cc List
                </Col>
                <Col span={21}>
                  { viewParams.ccList.length > 0 && viewParams.ccList.map((item, index) => (
                    <Tag key={index}>{item}</Tag>
                  ))}
                </Col>
              </Row>
            </div>
            <div className="separate"></div>
            <div>
              <div dangerouslySetInnerHTML={{ __html: viewParams.templateContent }} style={{ zoom: '0.5' }}></div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
