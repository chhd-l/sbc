import React from 'react';
import { Relax } from 'plume2';
import { Modal } from 'antd';
import { noop } from 'qmkit';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

const ListText = styled.div`
  line-height: 20px;
  color: #333333;
  span {
    color: #666666;
  }
  p {
    margin-top: 15px;
  }
`;

@Relax
export default class MoneyModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  props: {
    relaxProps?: {
      moneyVisible: boolean;
      moneyModal: Function;
      moneyModalContent: any;
      //确认收到打款
      confirmReceive: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    moneyVisible: 'moneyVisible',
    // 关闭弹框
    moneyModal: noop,
    moneyModalContent: 'moneyModalContent',
    confirmReceive: noop
  };

  render() {
    const {
      moneyVisible,
      moneyModalContent,
      confirmReceive
    } = this.props.relaxProps;
    if (!moneyVisible) {
      return null;
    }
    return (
      <div>
        <Modal
          maskClosable={false}
          title="确认首次打款"
          visible={moneyVisible}
          onCancel={this._handleModelCancel}
          onOk={() =>
            moneyModalContent.get('remitPrice') ? confirmReceive() : noop
          }
          okText="确认收到"
          width={360}
        >
          <ListText>
            <p>
              <span>{<FormattedMessage id="accountName" />}:</span>
              {moneyModalContent.get('accountName')}
            </p>
            <p>
              <span>{<FormattedMessage id="accountNumber" />}:</span>
              {moneyModalContent.get('bankNo')}
            </p>
            <p>
              <span>{<FormattedMessage id="bank" />}:</span>
              {moneyModalContent.get('bankName')}
            </p>
            <p>
              <span>{<FormattedMessage id="subBranch" />}:</span>
              {moneyModalContent.get('bankBranch')}
            </p>
            <p>
              <span>平台首次打款金额:$</span>
              {moneyModalContent.get('remitPrice')
                ? moneyModalContent.get('remitPrice').toFixed(2)
                : 'none'}
            </p>
          </ListText>
        </Modal>
      </div>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { moneyModal } = this.props.relaxProps;
    moneyModal();
  };
}
