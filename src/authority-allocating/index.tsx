import React from 'react';
import { Alert, Button } from 'antd';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import AuthorityManager from './components/authority-manager';

import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class AuthorityAllocating extends React.Component<any, any> {
  store: AppStore;
  _container;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { roleInfoId, roleName } = this.props.match.params;

    this.store.init(roleInfoId, roleName);
  }

  render() {
    const roleName = this.store.state().get('roleName');
    return (
      <div
        ref={(node) => {
          this._container = node;
        }}
      >
        <BreadCrumb />

        <div className="container-search" style={{ paddingBottom: 50 }}>
          <Headline title="Edit Role Permissions" />
          <Alert
            message=""
            description={
              <div>
                <p>
                  After modifying the role permissions, the corresponding
                  permissions of all employee accounts assigned to this role
                  will be modified;
                </p>
              </div>
            }
            type="info"
          />

          <div>Role: {roleName}</div>

          <AuthorityManager />
        </div>
        <AuthWrapper functionName="updateBossMenus">
          <div className="bar-button">
            <Button type="primary" onClick={() => this.store.onSave()}>
              Save
            </Button>
          </div>
        </AuthWrapper>
      </div>
    );
  }
}
