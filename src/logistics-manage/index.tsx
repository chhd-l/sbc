import React from 'react';

import { Breadcrumb, Alert, Col, Card, Tooltip, Row, Switch } from 'antd';
import { StoreProvider } from 'plume2';
import CompanyList from './components/company-list'
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import AppStore from './store';
import AddCompanyModal from './components/add-company-modal'
import LogisticSettingModal from './components/ logistic-setting-modal'
import CompanyChoose from './components/company-choose';
import './index.less'
import { fromJS } from 'immutable';
import parcelLabImg from '../../web_modules/qmkit/images/icon/parcelLab-logo.png'
@StoreProvider(AppStore, { debug: __DEV__ })
export default class LogisticsManage extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    // this.store.init();
    this.store.initList();
  }

  constructor(props) {
    super(props);
  }

  render() {
    return [
      <BreadCrumb />,
      <div>
        {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>物流设置</Breadcrumb.Item>
            <Breadcrumb.Item>物流公司设置</Breadcrumb.Item>
          </Breadcrumb> */}
        <div className="container-search company-container">
          <Headline title={<FormattedMessage id="Setting.LogisticsCompanySettings" />} />
          <Alert message={<FormattedMessage id="Setting.Manage" />} type="info" showIcon />
          <AuthWrapper functionName="f_expressManage_1">
            {/*<CompanyChoose />*/}
            <div className="tip"><FormattedMessage id="Setting.Updatelogisticinformation" /></div>
            <Card style={{ width: 300, marginTop: 10, marginBottom: 10 }} bodyStyle={{ padding: 10 }}>
              <div className="card-contanier">
                <div className="methodItem">
                  <img
                    src={parcelLabImg}
                    style={{
                      width: '250px',
                      height: '80px',
                      marginTop: '10px'
                    }}
                  />
                </div>
                <div className="bar">
                  {/*<div className="status">{item.isOpen === 1 ? 'Enabled' : 'Disabled'}</div>*/}
                  <Switch defaultChecked={this.store.state().get('settingStatus') == 1} checked={this.store.state().get('settingStatus') == 1} size={'small'}
                          onChange={(value)=> {
                            this.store.onListFieldChange({
                              field: 'settingStatus',
                              value: value ? 1 : 0
                            })
                          }}
                  />
                  <div>
                    <Tooltip placement="top" title="Edit">
                      <a
                        style={{ color: 'red' }}
                        type="link"
                        onClick={() => {this.store.openSettingModal()}}
                        /* className="links"*/
                        className="iconfont iconEdit"
                      >
                        {/* <FormattedMessage id="edit" />*/}
                      </a>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </Card>
            <CompanyList />
            <AddCompanyModal />
            <LogisticSettingModal />
          </AuthWrapper>
        </div>
      </div>
    ];
  }
}
