import { Button, Col, Form, Input, Modal, Radio, Row } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class AddProductModal extends Component {
  state = {
    cateType: '',
    likeGoodsInfoNo: '',
    keywords: ''
  };
  props: {
    visible: boolean;
    handleOk: any;
    handleCancel: any;
  };
  onChange = (e, type) => {
    if (e && e.target) {
      e = e.target.value;
    }
    this.setState({
      [type]: e
    });
  };
  search = () => {
    console.log(this.state);
  };
  render() {
    const { visible, handleOk, handleCancel } = this.props;
    const { cateType, likeGoodsInfoNo, keywords } = this.state;
    return (
      <Modal title="Choose product" visible={visible} onOk={handleOk} width="50%" onCancel={handleCancel}>
        <Form className="filter-content" layout="inline">
          <Row>
            <Col span={24}>
              <FormItem label="Product category">
                <Radio.Group onChange={(e) => this.onChange(e, 'cateType')} value={cateType}>
                  <Radio value="Cat SPT">Cat SPT</Radio>
                  <Radio value="Dog SPT">Dog SPT</Radio>
                </Radio.Group>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem>
                <Input
                  addonBefore={
                    <p style={styles.label}>
                      <FormattedMessage id="product.SKU" />
                    </p>
                  }
                  value={likeGoodsInfoNo}
                  onChange={(e) => this.onChange(e, 'likeGoodsInfoNo')}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem>
                <Input addonBefore={<p style={styles.label}>Product name</p>} value={keywords} onChange={(e) => this.onChange(e, 'keywords')} />
              </FormItem>
            </Col>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button type="primary" icon="search" htmlType="submit" shape="round" style={{ textAlign: 'center' }} onClick={this.search}>
                <span>
                  <FormattedMessage id="search" />
                </span>
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

const styles = {
  label: {
    width: 150,
    textAlign: 'center'
  },
  wrapper: {
    width: 177
  }
} as any;
