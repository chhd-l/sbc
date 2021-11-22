import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Alert } from 'antd';
import { Headline, AuthWrapper, BreadCrumb, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';

// const Reg = require('./image/Reg.png');
// const Bur = require('./image/Bur.png');
// const BlueReg = require('./image/Reg_blue.png');
// const BlueBur = require('./image/Bur_blue.png');

export default class ReleaseProducts extends React.Component<any, any> {
  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>发布商品</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container-search">
          <Headline title={<FormattedMessage id="Product.postGoods" />} />
        </div>
        <div className="container">
          <div className="release-box">
            <h1>
              <FormattedMessage id="Product.ChooseProductCharacteristic" />
            </h1>

            <div className="release-content space-around" style={{width: 900}}>
              <Link to="/regular-product-add" style={styles.linkContainer}>
                <i className="iconfont iconicon_Regular" style={styles.linkIcon}></i>
                <span style={styles.linkText}><FormattedMessage id="Product.Regularproduct" /></span>
              </Link>

              <Link to="/goods-main" style={styles.linkContainer}>
                <i className="iconfont iconicon_Bundle" style={styles.linkIcon}></i>
                <span style={styles.linkText}><FormattedMessage id="Product.Bundleproduct" /></span>
              </Link>

              {/* <Link to="/service-product-add" style={styles.linkContainer}>
                <i className="iconfont icona-icon_Service" style={styles.linkIcon}></i>
                <span style={styles.linkText}><FormattedMessage id="Product.Serviceproduct" /></span>
              </Link> */}
            </div>
          </div>
          <div style={styles.instru}>
            <Alert
              type="info"
              message={
                <div>
                  <p><FormattedMessage id="Product.operationInstruction" />:</p>
                  <p><FormattedMessage id="Product.Addproducttip1" /></p>
                  <p><FormattedMessage id="Product.Addproducttip2" /></p>
                  <p><FormattedMessage id="Product.Addproducttip3" /></p>
                </div>
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles: any = {
  linkContainer: {
    padding: '20px 30px',
    textAlign: 'center',
    border: '1px solid #dedede'
  },
  linkIcon: {
    fontSize: 50,
  },
  linkText: {
    display: 'block',
    fontSize: 22,
    fontWeight: 500,
    color: 'rgba(0,0,0,0.65)'
  },
  instru: {
    margin: '40px 60px 0'
  }
};
