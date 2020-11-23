import { Col, Row, Table } from 'antd';
import { BreadCrumb, cache, Headline } from 'qmkit';
import React, { Component } from 'react';
import * as webapi from './webapi';

export default class InvoiceDetails extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: 'Invoice detail',
      logo: '',
      invoiceDetails: {
        invoiceNumber: '000826787',
        invoiceDate: '12/11/2020',
        storeAddress: 'storeAddress',
        storePostcode: 'storePostcode',
        storeSiret: 'storeSiret',
        storeCity: 'storeCity',
        deliveryAddress: 'deliveryAddress',
        deliveryPostcode: 'deliveryPostcode',
        deliveryCity: 'deliveryCity',
        deliveryName: 'deliveryName',
        billingAddress: 'billingAddress',
        billingPostcode: 'billingPostcode',
        billingCity: 'billingCity',
        billingName: 'billingName',
        orderDate: 'orderDate',
        orderNo: 'orderNo'
      },
      invoiceItemList: []
    };
  }
  componentDidMount = () => {
    this.getLogo();
  };
  getLogo = () => {
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    if (loginInfo && loginInfo.storeLogo) {
      this.setState({ logo: loginInfo.storeLogo });
    }
  };
  render() {
    const { title, logo, invoiceDetails, invoiceItemList } = this.state;
    const columns = [
      {
        title: 'Code article',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber'
      },
      {
        title: 'Désignation',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber'
      },
      {
        title: 'Qté ',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber'
      },
      {
        title: 'Prix unitaire HT',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber'
      },
      {
        title: 'Taux TVA',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber'
      },
      {
        title: 'Prix unitaire TTC',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber'
      },
      {
        title: 'Total TTC',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber'
      }
    ];
    const columns_total = [
      {
        title: 'Code article',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber'
      },
      {
        title: 'Code article',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber'
      },
      {
        title: 'Code article',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber'
      }
    ];

    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          {/* <Headline title={title} /> */}
          <img src={logo} alt="" width="240px" />
          <h2 style={{ textAlign: 'center' }}>
            Facture n° {invoiceDetails.invoiceNumber} du {invoiceDetails.invoiceDate}
          </h2>
          <Row>
            <h3>Royal Canin France </h3>
            <p>{invoiceDetails.storeAddress}</p>
            <p>
              <span style={styles.postCode}>{invoiceDetails.storePostcode}</span>
              <span>{invoiceDetails.storeCity}</span>
            </p>
            <p>Siret:{invoiceDetails.storeSiret}</p>
          </Row>
          <Row style={styles.moduleInterval}>
            <h3>Adresse de livraison</h3>
            <Col span={12}>
              <p>{invoiceDetails.deliveryName}</p>
              <p>{invoiceDetails.deliveryAddress}</p>
              <p>
                <span style={styles.postCode}>{invoiceDetails.deliveryPostcode}</span>
                <span>{invoiceDetails.deliveryCity}</span>
              </p>
            </Col>
            <Col span={12}>
              <p>{invoiceDetails.billingName}</p>
              <p>{invoiceDetails.billingAddress}</p>
              <p>
                <span style={styles.postCode}>{invoiceDetails.billingPostcode}</span>
                <span>{invoiceDetails.billingCity}</span>
              </p>
            </Col>
          </Row>
          <Row style={styles.moduleInterval}>
            <h3>Informations de la commande</h3>
            <p>Date de la commande:{invoiceDetails.orderDate}</p>
            <p>Numéro de la commande:{invoiceDetails.orderNo}</p>
          </Row>

          <div style={{ border: '1px solid #e8e8e8', width: '80%' }}>
            <Table columns={columns} dataSource={invoiceItemList} style={{ border: '1px solid #e8e8e8', margin: 15 }}></Table>
            <Row style={{ borderTop: '1px solid #e8e8e8' }}>
              <Col span={3} offset={18}>
                {}
              </Col>
              <Col span={3}></Col>
              <Col span={6} offset={18}></Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
const styles = {
  postCode: {
    marginRight: 10
  },
  moduleInterval: {
    marginTop: 30
  }
};
