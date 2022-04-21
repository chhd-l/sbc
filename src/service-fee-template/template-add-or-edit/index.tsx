import React from 'react';
import { StoreProvider, Relax } from 'plume2';
import { FormattedMessage } from 'react-intl';
import { Breadcrumb, Form, message } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';

import FreightTemp from './component/freight-temp';
import AppStore from './store';
import * as webapi from './webapi';

const FreightTempForm = Form.create()(FreightTemp) as any;
const FreightTempRelax = Relax(FreightTempForm);

/**
 * 运费模板
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class StoreFreight extends React.Component<any, any> {
  store: AppStore;

  UNSAFE_componentWillMount() {
    const { freightId, id } = (this.props.match && this.props.match.params) || {
      freightId: 0
    };
    this.store.getPaymentMethod();
    if (id) {
      this.store.init(id);
    }
  }

  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    const { id } = this.props.match && this.props.match.params;

    const titleJSX = id ? (
      <FormattedMessage id="ServiceFee.addServiceFeeTemplate" />
    ) : (
      <FormattedMessage id="ServiceFee.editServiceFeeTemplate" />
    );
    return [
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>{titleJSX}</Breadcrumb.Item>
      </BreadCrumb>,
      <div className="container-search" key="container">
        <Headline title={titleJSX} />
        <FreightTempRelax id={id} />
      </div>
    ];
  }
}
