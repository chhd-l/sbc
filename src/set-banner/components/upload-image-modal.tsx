import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import '../index.less';
import { FormattedMessage } from 'react-intl';
import { IList, IMap } from 'typings/globalType';
import {
  Form,
  Select,
  Input,
  Button,
  Table,
  Divider,
  message,
  Checkbox,
  Pagination,
  Spin,
  Tooltip,
  Modal,
  Rate
} from 'antd';
import { Link } from 'react-router-dom';
import { fromJS } from 'immutable';
import { AuthWrapper, Const } from 'qmkit';
import momnet from 'moment';
import Moment from 'moment';
import moment from 'moment';
import GoodsImage from '@/goods-detail/components/image';
const FormItem = Form.Item;

class RejectForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('comment', {
            rules: [
              {
                required: true,
                message: <FormattedMessage id="order.rejectionReasonTip" />
              },
              { validator: this.checkComment }
            ]
          })(
            <FormattedMessage id="order.rejectionReasonTip">
              {(txt) => (
                <Input.TextArea
                  placeholder={txt.toString()}
                  autosize={{ minRows: 4, maxRows: 4 }}
                />
              )}
            </FormattedMessage>
          )}
        </FormItem>
      </Form>
    );
  }

  checkComment = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    if (value.length > 100) {
      callback(new Error('Please input less than 100 characters'));
      return;
    }
    callback();
  };
}

const WrappedRejectForm = Form.create({})(RejectForm);

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
      visible: IMap;
    };
  };

  static relaxProps = {
    modalVisible: 'modalVisible',
    visible: 'visible'
  };
  componentDidMount() {}
  _handleSubmit = () => {};
  _handleModelCancel = () => {
    // const { modal } = this.props.relaxProps;
    // modal(false);
  };
  render() {
    const { modalVisible, visible } = this.props.relaxProps;
    setTimeout(() => {
      console.log(visible.toJS(), 1000000);
    }, 1000);
    return (
      <Modal
        maskClosable={false}
        title={<FormattedMessage id="reviewDetail" />}
        visible={visible.toJS().isTrue}
        width={920}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <div>1111111</div>
      </Modal>
    );
  }
}
