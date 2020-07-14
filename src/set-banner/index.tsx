import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import AppStore from './store';
import './index.less';
import { AuthWrapper, BreadCrumb, Headline, noop, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Input, Button, Table, Divider, message } from 'antd';
import { Link } from 'react-router-dom';
import BannerList from './components/set-banner-list';
const FormItem = Form.Item;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SetBanner extends Component<any, any> {
  store: AppStore;

  componentDidMount() {}
  onFormChange = ({ field, value }) => {
    // let data = this.state.searchForm;
    // data[field] = value;
    // this.setState({
    //   searchForm: data
    // });
  };
  onSearch = () => {
    console.log('search------------');
  };
  uploadImage() {}
  render() {
    return (
      <AuthWrapper functionName="fOrderList001">
        <div className="order-con">
          <BreadCrumb />
          <div className="container">
            <Headline title={<FormattedMessage id="setBanner" />} />
            <div>
              <Form className="filter-content" layout="inline">
                <FormItem>
                  <Input
                    addonBefore="Keyword"
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'keywords',
                        value
                      });
                    }}
                    placeholder="Please input name or discription"
                    style={{ width: 300 }}
                  />
                </FormItem>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon="search"
                    onClick={(e) => {
                      e.preventDefault();
                      this.onSearch();
                    }}
                  >
                    <span>
                      {' '}
                      <FormattedMessage id="search" />
                    </span>
                  </Button>
                </Form.Item>
              </Form>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginBottom: '10px' }}
                onClick={() => this.uploadImage()}
              >
                <Link>Upload</Link>
              </Button>
              <BannerList />
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
