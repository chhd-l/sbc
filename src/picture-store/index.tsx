import React from 'react';
import { Row, Col, Breadcrumb } from 'antd';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';

import ImageList from './component/image-list';
import MoveImageModal from './component/moveImage-modal';
import UploadImageModal from './component/uploadImage-modal';
import CateModal from './component/cate-modal';
import CateList from './component/cate-list';
import Tool from './component/tool';
import { StoreProvider } from 'plume2';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class PictureStore extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_picturePort_0">
        <div>
          <BreadCrumb></BreadCrumb>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>素材管理</Breadcrumb.Item>
            <Breadcrumb.Item>图片库</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container-search">
            <Headline title={<FormattedMessage id="Setting.imageAsset" />} />
          </div>
          <div className="container">
            <div>
              <Row>
                <Col span={4}>
                  {/*分类列表*/}
                  <CateList />
                </Col>
                <Col span={1} />
                <Col span={19}>
                  {/*工具条*/}
                  <Tool />

                  {/*图片列表*/}
                  <ImageList />

                  {/*弹框*/}
                  <CateModal />
                  <MoveImageModal />
                  <UploadImageModal />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
