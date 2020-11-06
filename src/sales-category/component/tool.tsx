import * as React from 'react';
import { Relax } from 'plume2';
import { Button } from 'antd';
import { noop, AuthWrapper } from 'qmkit';
import { FormattedMessage } from 'react-intl';

@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    relaxProps?: {
      showAddModal: Function;
    };
  };

  static relaxProps = {
    showAddModal: noop
  };

  render() {
    return (
      <div className="handle-bar">
        <AuthWrapper functionName="f_goods_cate_1">
          <Button type="primary" onClick={this._showCateModal}>
            Add Category
          </Button>
        </AuthWrapper>
      </div>
    );
  }

  /**
   * 显示分类弹框
   */
  _showCateModal = () => {
    const { showAddModal } = this.props.relaxProps;
    showAddModal();
  };
}