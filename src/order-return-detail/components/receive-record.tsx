import React from 'react';
import { Relax } from 'plume2';
import { Modal } from 'antd';

import LogisticsAdd from './logistics-add';
import { RCi18n } from 'qmkit';

/**
 * 退款记录
 */
@Relax
export default class ReceiverRecord extends React.Component<any, any> {
  static relaxProps = {};

  constructor(props) {
    super(props);
    this.state = { addLogisticsVisible: false };
  }

  render() {
    return (
      <div style={styles.container}>
        <label>
          { '[' + RCi18n({id:'Order.logisticsInformation'}) +']' }<a
            href="javascript:void(1)"
            onClick={() => this.setState({ addLogisticsVisible: true })}
          >
            {
              RCi18n({id:'Order.FillLogisticsInformation'})
            }
          </a>
        </label>
        <Modal  maskClosable={false}
          title={RCi18n({id:'Order.FillLogisticsInformation'})}
          visible={this.state.addLogisticsVisible}
          onOk={() => {}}
          onCancel={() => {
            this.setState({ addLogisticsVisible: false });
          }}
          okText={RCi18n({id:'Order.btnConfirm'})}
          cancelText={RCi18n({id:'Order.btnCancel'})}
        >
          <LogisticsAdd />
        </Modal>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 20
  } as any
};
