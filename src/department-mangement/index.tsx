import React from 'react';
import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { AuthWrapper, BreadCrumb, Headline } from 'qmkit';
import AppStore from './store';
import DepartmentList from './component/department-list';
import DepartmentModal from './component/department-modal';
import Tool from './component/tool';
import LeaderModal from './component/leader-modal';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsCate extends React.Component<any, any> {
  store: AppStore;

  UNSAFE_componentWillMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={<FormattedMessage id="Setting.departmentManagement" />} />
          <div style={{ marginBottom: 16 }}>
            <Alert
              message=""
              description={
                <div>
                  <p>
                    <FormattedMessage id="Setting.departmentManagementInfo1" />
                  </p>
                  <p>
                    <FormattedMessage id="Setting.departmentManagementInfo2" />
                  </p>
                  <p>
                    <FormattedMessage id="Setting.departmentManagementInfo3" />
                  </p>
                </div>
              }
              type="info"
            />
            <AuthWrapper functionName={'f_department_add_root'}>
              {/*工具条*/}
              <Tool />
            </AuthWrapper>
          </div>
        </div>
        <div className="container">
          <AuthWrapper functionName={'f_department_list'}>
            {/*列表*/}
            <DepartmentList />
          </AuthWrapper>

          {/*弹框*/}
          <DepartmentModal />

          <LeaderModal />
        </div>
      </div>
    );
  }
}
