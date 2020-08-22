import React from 'react';

import { Table, Button } from 'antd';
import { Relax } from 'plume2';
import { AuthWrapper, history, noop, util } from 'qmkit';
import '../style.less';
import PublishTooltip from './publishTooltip';

@Relax
export default class PublishButton extends React.Component<any, any> {
  props: {
    relaxProps?: {
      productForm: any;
      fetchCreateLink: Function;
    };
  };

  static relaxProps = {
    settleList: 'settleList',
    productselect: 'productselect',
    productForm: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  showModal = (res) => {
    this.setState({
      visible: res
    });
  };

  render() {
    return (
      <div>
        <Button
          shape="round"
          style={{ width: 80, marginRight: 10 }}
          href="/recomm-page"
          onClick={() => history.goBack()}
        >
          Exit
        </Button>
        <Button
          type="primary"
          shape="round"
          onClick={() => this.showModal(true)}
        >
          Create Link
        </Button>
        <PublishTooltip
          visible={this.state.visible}
          showModal={this.showModal}
        />
      </div>
    );
  }
}
