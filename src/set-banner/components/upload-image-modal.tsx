import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import '../index.less';
import { FormattedMessage } from 'react-intl';
import { IList, IMap } from 'typings/globalType';
import { Modal, Rate } from 'antd';
import { Link } from 'react-router-dom';
import { fromJS } from 'immutable';
import { AuthWrapper, Const, noop } from 'qmkit';
import momnet from 'moment';
import Moment from 'moment';
import moment from 'moment';
import GoodsImage from '@/goods-detail/components/image';

@Relax
export default class UploadImageModal extends Component<any, any> {
  _rejectForm;

  WrapperForm: any;

  constructor(props) {
    super(props);
  }
  props: {
    relaxProps?: {
      modalVisible: boolean;
      uploadModalStatusChange: Function;
      visible: IMap;
    };
  };

  static relaxProps = {
    modalVisible: 'modalVisible',
    uploadModalStatusChange: noop,
    visible: 'visible'
  };
  componentDidMount() {}
  _handleSubmit = () => {};
  _handleModelCancel = () => {
    // const { modal } = this.props.relaxProps;
    // modal(false);
  };
  render() {
    const {
      modalVisible,
      visible,
      uploadModalStatusChange
    } = this.props.relaxProps;
    setTimeout(() => {
      console.log(modalVisible, 1000000);
    }, 1000);
    return (
      <Modal
        maskClosable={false}
        title={<FormattedMessage id="reviewDetail" />}
        visible={modalVisible}
        width={920}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <div>1111111</div>
      </Modal>
    );
  }
}
