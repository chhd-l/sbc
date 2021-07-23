import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';
import { FormattedMessage } from 'react-intl';

interface  IProps{
  infoList:any, // 数据源
  form:any
}

class Information extends Component<any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {infoList} = this.props
    console.log(infoList);
    return (
        <Form className="filter-content myform">
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item>
                {getFieldDecorator('InterfaceID',{
                  initialValue:infoList.a
                })(
                  <Input
                    disabled
                    addonBefore={
                      <p style={styles.label}>
                        <FormattedMessage id="Interface.InterfaceID" />
                      </p>
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                {getFieldDecorator('System')(
                  <Input
                    disabled
                    addonBefore={
                      <p style={styles.label}>
                        <FormattedMessage id="Interface.System" />
                      </p>
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                {getFieldDecorator('Method')(
                  <Input
                    disabled
                    addonBefore={
                      <p style={styles.label}>
                        <FormattedMessage id="Interface.Method" />
                      </p>
                    }
                  />
                )}
              </Form.Item>
            </Col> <Col span={8}>
            <Form.Item>
              {getFieldDecorator('URL')(
                <Input
                  disabled
                  addonBefore={
                    <p style={styles.label}>
                      <FormattedMessage id="Interface.URL" />
                    </p>
                  }
                />
              )}
            </Form.Item>
          </Col> <Col span={8}>
            <Form.Item>
              {getFieldDecorator('MiddleLayer')(
                <Input
                  disabled
                  addonBefore={
                    <p style={styles.label}>
                      <FormattedMessage id="Interface.MiddleLayer" />
                    </p>
                  }
                />
              )}
            </Form.Item>
          </Col>
            <Col span={8}>
              <Form.Item>
                {getFieldDecorator('Type')(
                  <Input
                    disabled
                    addonBefore={
                      <p style={styles.label}>
                        <FormattedMessage id="Interface.Type" />
                      </p>
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                {getFieldDecorator('Provider')(
                  <Input
                    disabled
                    addonBefore={
                      <p style={styles.label}>
                        <FormattedMessage id="Interface.Provider" />
                      </p>
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                {getFieldDecorator('Invoker')(
                  <Input
                    disabled
                    addonBefore={
                      <p style={styles.label}>
                        <FormattedMessage id="Interface.Invoker" />
                      </p>
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                {getFieldDecorator('DataFlow')(
                  <Input
                    disabled
                    addonBefore={
                      <p style={styles.label}>
                        <FormattedMessage id="Interface.DataFlow" />
                      </p>
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                {getFieldDecorator('Function')(
                  <Input
                    disabled
                    addonBefore={
                      <p style={styles.label}>
                        <FormattedMessage id="Interface.Function" />
                      </p>
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                {getFieldDecorator('Uptime')(
                  <Input
                    disabled
                    addonBefore={
                      <p style={styles.label}>
                        <FormattedMessage id="Interface.Uptime" />
                      </p>
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
    );
  }
}
const styles = {
  label: {
    width: 151,
    textAlign: 'center'
  }
} as any;
export default Form.create<IProps>()(Information);
