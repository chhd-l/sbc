import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import AppStore from './store';
import './index.less';
import { AuthWrapper, BreadCrumb, Headline, noop, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Input, Button, Table, Divider, message } from 'antd';
import { Link } from 'react-router-dom';
import BannerList from './components/set-banner-list';
import UploadImageModal from './components/upload-image-modal';
const FormItem = Form.Item;
const UploadImageModalForm = Form.create({})(UploadImageModal);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SetBanner extends Component<any, any> {
  store: AppStore;
  state: {
    operation: 'new'; //edit
    isEdit: false;
  };

  componentDidMount() {
    // this.store.setModalVisible(true)
    // this.store.getList(-1)
  }
  onFormChange = ({ field, value }) => {
    this.store.onFormChange({ field, value });
  };
  onSearch = () => {
    console.log('search------------');
  };

  uploadImage() {}
  render() {
    const operation = this.state.operation;
    return (
      <AuthWrapper functionName="fOrderList001">
        <div className="order-con">
          <BreadCrumb />
          <div className="container">
            <Headline title={<FormattedMessage id="setBanner" />} />
            <div>
              {/*<Form className="filter-content" layout="inline">*/}
              {/*  <FormItem>*/}
              {/*    <Input*/}
              {/*      addonBefore="Resource name"*/}
              {/*      onChange={(e) => {*/}
              {/*        const value = (e.target as any).value;*/}
              {/*        this.onFormChange({*/}
              {/*          field: 'resourceName',*/}
              {/*          value*/}
              {/*        });*/}
              {/*      }}*/}
              {/*      placeholder="Please input resource name"*/}
              {/*      style={{ width: 400 }}*/}
              {/*    />*/}
              {/*  </FormItem>*/}
              {/*  <Form.Item>*/}
              {/*    <Button*/}
              {/*      type="primary"*/}
              {/*      htmlType="submit"*/}
              {/*      icon="search"*/}
              {/*      onClick={(e) => {*/}
              {/*        e.preventDefault();*/}
              {/*        this.store.onSearch(-1);*/}
              {/*      }}*/}
              {/*    >*/}
              {/*      <span>*/}
              {/*        {' '}*/}
              {/*        <FormattedMessage id="search" />*/}
              {/*      </span>*/}
              {/*    </Button>*/}
              {/*  </Form.Item>*/}
              {/*</Form>*/}

              <BannerList />
              <UploadImageModalForm />
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
