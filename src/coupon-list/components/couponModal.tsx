import React, { Component } from 'react';
import { Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Input, Row, Col, Modal, Spin } from 'antd';
import * as webapi from '../webapi';

const FormItem = Form.Item;


class CouponModal extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {

  }

  render() {
    const { loading } = this.state;
    const { isModalVisible, handleOk, handleCancel } = this.props;

    return (
      <Spin spinning={loading}>
        <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Spin>
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
  }
} as any;

export default Form.create()(CouponModal);
