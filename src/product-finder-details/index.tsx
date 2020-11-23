import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin } from 'antd';
import './index.less';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
const img_productNo = require('./img/productNo.png');
const img_question = require('./img/question.png');
import moment from 'moment';
import { Link } from 'react-router-dom';

export default class ProductFinderDetails extends React.Component<any, any> {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: 'Product Finder Details',
      loading: false,
      details: {},
      chartRecords: []
    };
    // 事先声明方法绑定
  }

  componentDidMount() {
    webapi
      .getProductFinderDetail(this.state.id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            details: res.context.details,
            chartRecords: res.context.stepList.map((x) => ({ question: x.question, answer: x.answer }))
          });
        } else {
          message.error(res.message || 'Get Data Failed');
        }
      })
      .catch((err) => {
        message.error(err || 'Get Data Failed');
      });
  }

  render() {
    const { title, details, chartRecords } = this.state;
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </BreadCrumb>
        {/*导航面包屑*/}
        <Spin spinning={this.state.loading}>
          <div className="container-search">
            <Headline title={title} />
          </div>
          <div id="productFindeDetails" className="container" style={{ padding: '30px' }}>
            <div className="garyContainer">
              <Row>
                <img className="productNo-Image" src={img_productNo} alt="Product No" />
                <strong>Product Finder NO. {details.finderNumber}</strong>
              </Row>
              <Row>
                <Col span={8}>
                  <Row>
                    <Col span={12}>
                      <p>Generated data</p>
                    </Col>
                    <Col span={12}>
                      <strong>{moment(details.createTime).format('YYYY-MM-DD')}</strong>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col span={12}>
                      <p>Order number</p>
                    </Col>
                    <Col span={12}>
                      <Link to={`/order-detail/${details.orderNumber}`}>
                        <span style={{ textDecoration: 'underline' }}>{details.orderNumber}</span>
                      </Link>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Row>
                    <Col span={12}>
                      <p>Consumer type</p>
                    </Col>
                    <Col span={12}>
                      <strong>{details.consumerType === 0 ? 'Member' : 'Guest'}</strong>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col span={12}>
                      {' '}
                      <p>Pet type</p>
                    </Col>
                    <Col span={12}>
                      <strong>{details.petType}</strong>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Row>
                    <Col span={12}>
                      <p>Consumer account</p>
                    </Col>
                    <Col span={12}>
                      <strong>{details.consumerAccount}</strong>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col span={12}>
                      {' '}
                      <p>Pet age</p>
                    </Col>
                    <Col span={12}>
                      <strong>{details.petAge}</strong>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Row>
                    <Col span={12}>
                      <p>Consumer name</p>
                    </Col>
                    <Col span={12}>
                      <strong>{details.consumerName}</strong>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col span={12}>
                      {' '}
                      <p>Breed</p>
                    </Col>
                    <Col span={12}>
                      <strong>{details.breed}</strong>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <div className="imageContainer">
                  <Row style={{ marginBottom: '0px' }}>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <img className="productImage" src={details.productImage} alt="productImage" />
                    </Col>
                    <Col span={20}>
                      <h4 style={{ marginBottom: '10px' }}>{details.productName}</h4>
                      <p>Product SKU: {details.productSku}</p>
                    </Col>
                  </Row>
                </div>
              </Row>
            </div>

            {chartRecords && chartRecords.length > 0 ? (
              <div className="garyContainer" style={{ marginTop: '20px' }}>
                {chartRecords.map((item, index) => (
                  <Row key={index}>
                    <Col span={1}>
                      <img src={img_question} alt="Question" />
                    </Col>
                    <Col span={23}>
                      <strong>{item.question}</strong>
                      <div className="answer">{item.answer}</div>
                    </Col>
                  </Row>
                ))}
              </div>
            ) : null}
          </div>
        </Spin>
        <div className="bar-button">
          <Button type="primary" onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="back" />}
          </Button>
        </div>
      </div>
    );
  }
}

const styles = {
  garyContainer: {
    background: '#fafafa',
    padding: '20px 30px'
  }
} as any;
