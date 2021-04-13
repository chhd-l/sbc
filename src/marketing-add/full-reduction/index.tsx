import React from 'react';

import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import AppStore from './store';
import FullReductionForm from './components/full-reduction-form';
import * as Enum from '../common-components/marketing-enum';
import '../index.less';
const WrappedForm = Form.create()(FullReductionForm);

@StoreProvider(AppStore, { debug: __DEV__ })
class MarketingFullReductionAdd extends React.Component<any, any> {
  store: AppStore;
  _form;
  props: {
    intl: any;
    match;
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { marketingId } = this.props.match && this.props.match.params ? this.props.match.params : null;
    if (marketingId) {
      this.store.init(marketingId);
    } else {
      this.store.initReductionDefualtLevelList();
      this.store.setSelectedProductRows({ selectedRows: [], selectedSkuIds: [] })
    }
    this.store.getAllGroups();
    this.store.initCategory();
    this.store.getAllAttribute();
  }

  render() {
    const { marketingId } = this.props.match && this.props.match.params ? this.props.match.params : null;
    // const state = this.props.location.state;
    // const { source } = (state || {}) as any;
    return (
      <AuthWrapper functionName="f_marketing_reduction_add">
        <div>
          <BreadCrumb thirdLevel={true}>
            {/* <Breadcrumb.Item>
              {source == 'marketCenter' ? '营销中心' : '促销活动'}
            </Breadcrumb.Item> */}
            <Breadcrumb.Item>{marketingId ?<FormattedMessage id="Marketing.Editreductionactivity" /> :
              <FormattedMessage id="Marketing.Createreductionactivity" />
             } </Breadcrumb.Item>
          </BreadCrumb>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>营销</Breadcrumb.Item>
            <Breadcrumb.Item>营销设置</Breadcrumb.Item>
            <Breadcrumb.Item>
              {source == 'marketCenter' ? '营销中心' : '促销活动'}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {marketingId ? '编辑' : '创建'}满减活动
            </Breadcrumb.Item>
          </Breadcrumb> */}

          <div className="container-search marketing-container" style={{ paddingBottom: 20 }}>
            <Headline title={marketingId ? this.props.intl.formatMessage({
              id: 'Marketing.Editreductionactivity'
            }):
              this.props.intl.formatMessage({
              id: 'Marketing.Createreductionactivity'
            })
            } />
            <Alert message={
              this.props.intl.formatMessage({
                id: 'Marketing.reductionTip'
              })
            } type="info" showIcon />

            <WrappedForm
              ref={(form) => (this._form = form)}
              {...{
                store: this.store,
                marketingType: Enum.MARKETING_TYPE.FULL_REDUCTION
              }}
            />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
export default injectIntl(MarketingFullReductionAdd)
