import React from 'react';
import { Link } from 'react-router-dom';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const icon1 = require('./img/icon1.png');
const icon2 = require('./img/icon2.png');
const icon3 = require('./img/icon3.png');

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
              <FormattedMessage id="Product.chooseAPublishingMethod" />
            </h1>

            <div className="release-content">
              <AuthWrapper functionName="f_goods_add_1">
                <Link to="/goods-add">
                  <div className="item">
                    <div className="context">
                      <img src={icon1} alt="" />
                      <div>
                        <h2>
                          <FormattedMessage id="Product.publishDirectly" />
                        </h2>
                        <p>
                          <FormattedMessage id="Product.publishItemInfo1" />
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </AuthWrapper>
              <AuthWrapper functionName="f_goods_import_1">
                <Link to="/goods-import">
                  <div className="item">
                    <div className="context">
                      <img src={icon2} alt="" />
                      <div>
                        <h2>
                          <FormattedMessage id="Product.productTemplateImport" />
                        </h2>
                        <p>
                          <FormattedMessage id="Product.publishItemInfo2" />
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </AuthWrapper>
              <AuthWrapper functionName="f_goods_import_2">
                <Link to="/goods-library">
                  <div className="item">
                    <div className="context">
                      <img src={icon3} alt="" />
                      <div>
                        <h2>
                          <FormattedMessage id="Product.productPoolImport" />
                        </h2>
                        <p>
                          <FormattedMessage id="Product.publishItemInfo3" />
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </AuthWrapper>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
