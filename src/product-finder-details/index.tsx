import React from 'react';
import { BreadCrumb, Headline, Const, history, RCi18n } from 'qmkit';
import { Button, Row, Col, Breadcrumb, message, Spin } from 'antd';
import './index.less';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
const img_productNo = require('./img/productNo.png');
const img_question = require('./img/question.png');
import moment from 'moment';

export default class ProductFinderDetails extends React.Component<any, any> {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: RCi18n({id:"Product.ProductFinderDetails"}),
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
            chartRecords: res.context.stepList.map((x) => ({ question: x.question, answer: x.productFinderAnswerDetailsVO ? (x.productFinderAnswerDetailsVO.prefix || '') + ' ' + (x.productFinderAnswerDetailsVO.suffix || '') : '' }))
          });
        } else {
        }
      })
      .catch((err) => {});
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
                <strong><FormattedMessage id="Product.ProductFinderNO"/> {details.finderNumber}</strong>
              </Row>
              <Row gutter={24}>
                <Col span={8}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <p><FormattedMessage id="Product.GeneratedData"/></p>
                    </Col>
                    <Col span={12}>
                      <strong>{moment(details.createTime).format('YYYY-MM-DD')}</strong>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={8}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <p><FormattedMessage id="PetOwner.ConsumerType"/></p>
                    </Col>
                    <Col span={12}>
                      <strong>{details.consumerType === 0 ? 'Guest' : 'Member'}</strong>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row gutter={24}>
                    <Col span={12}>
                      {' '}
                      <p><FormattedMessage id="Product.PetType"/></p>
                    </Col>
                    <Col span={12}>
                      <strong>{details.petType}</strong>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={8}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <p><FormattedMessage id="PetOwner.ConsumerAccount"/></p>
                    </Col>
                    <Col span={12} style={{wordBreak:'break-all'}}>
                      <strong>{details.consumerAccount}</strong>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row gutter={24}>
                    <Col span={12}>
                      {' '}
                      <p><FormattedMessage id="Product.PetAge"/></p>
                    </Col>
                    <Col span={12}>
                      <strong>{details.petAge}</strong>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={8}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <p><FormattedMessage id="PetOwner.ConsumerName"/></p>
                    </Col>
                    <Col span={12}>
                      <strong>{details.consumerName}</strong>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row gutter={24}>
                    <Col span={12}>
                      {' '}
                      <p><FormattedMessage id="Product.Breed"/></p>
                    </Col>
                    <Col span={12}>
                      <strong>{details.petBreed}</strong>
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
                      <p><FormattedMessage id="Product.ProductSKU"/>: {details.spuCode}</p>
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
          <Button onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="back" />}
          </Button>
        </div>
      </div>
    );
  }
}
