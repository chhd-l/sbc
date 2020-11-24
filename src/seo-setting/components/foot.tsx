import * as React from 'react';
import { Relax } from 'plume2';
import { Button, message } from 'antd';
import { noop, history, AuthWrapper } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@Relax
export default class Foot extends React.Component<any, any> {
  props: {
    relaxProps?: {
      currentTab: any;
      seoForm: any;
      currentPage: any;
      loading: any;
      editSeo: Function;
    };
  };

  static relaxProps = {
    currentTab: 'currentTab',
    seoForm: 'seoForm',
    currentPage: 'currentPage',
    loading: 'loading',
    editSeo: noop
  };

  render() {
    const { currentTab, editSeo, loading } = this.props.relaxProps;
    return (
      <div className="bar-button">
        {/*<AuthWrapper key="001" functionName={this.props.goodsFuncName}>*/}
        <Button type="primary" onClick={this._save} disabled={loading}>
          Save
        </Button>
        {/*</AuthWrapper>*/}
      </div>
    );
  }
  _save = () => {
    const { currentTab, seoForm, editSeo, currentPage } = this.props.relaxProps;
    const seoObj = seoForm.toJS();
    const params = {
      id: '',
      type: 4,
      metaDescriptionSource: seoObj.description,
      metaKeywordsSource: seoObj.metaKeywords,
      titleSource: seoObj.title,
      pageName: currentTab === 'pageSeo' ? currentPage : null
    };
    editSeo(params);
  };
}
