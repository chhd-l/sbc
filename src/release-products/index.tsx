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
        <div className="container">
          <Headline title="发布商品" />

          <div className="release-box">
            <h1>选择发布方式</h1>

            <div className="release-content">
              <AuthWrapper functionName="f_goods_add_1">
                <Link to="/goods-add">
                  <div className="item">
                    <div className="context">
                      <img src={icon1} alt="" />
                      <div>
                        <h2>
                          <FormattedMessage id="product.publishDirectly" />
                        </h2>
                        <p>
                          <FormattedMessage id="product.publishItemInfo1" />
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
                          <FormattedMessage id="product.productTemplateImport" />
                        </h2>
                        <p>
                          <FormattedMessage id="product.publishItemInfo2" />
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
                          <FormattedMessage id="product.productPoolImport" />
                        </h2>
                        <p>
                          <FormattedMessage id="product.publishItemInfo3" />
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
