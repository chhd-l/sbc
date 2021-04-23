import React from 'react';

import { Breadcrumb, Alert, Col, Card, Tooltip, Row, Switch } from 'antd';
import { StoreProvider } from 'plume2';
import CompanyList from './components/company-list'
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import AppStore from './store';
import AddCompanyModal from './components/add-company-modal'
import CompanyChoose from './components/company-choose';
import './index.less'
import { fromJS } from 'immutable';
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
            <Row>
              <Col span={8}>
                <Card style={{ width: 300, margin: 20 }} bodyStyle={{ padding: 10 }}>
                  <div className="methodItem">
                    <img
                      // src={item.imgUrl}
                      style={{
                        width: '150px',
                        height: '80px',
                        marginTop: '10px'
                      }}
                    />
                  </div>
                  <div className="bar">
                    {/*<div className="status">{item.isOpen === 1 ? 'Enabled' : 'Disabled'}</div>*/}
                    <Switch defaultChecked={true} checked={true}
                            onChange={(value)=> {
                              // onFormChange({
                              //   field: 'status',
                              //   value: value ? 1 : 0
                              // })

                            }}
                    />
                    <div>
                      <Tooltip placement="top" title="Edit">
                        <a
                          style={{ color: 'red' }}
                          type="link"
                          onClick={() => {
                          }}
                          /* className="links"*/
                          className="iconfont iconEdit"
                        >
                          {/* <FormattedMessage id="edit" />*/}
                        </a>
                      </Tooltip>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            <CompanyList />
            <AddCompanyModal />
          </AuthWrapper>
        </div>
      </div>
    ];
  }
}
