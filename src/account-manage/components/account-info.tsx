import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Input, Form } from 'antd';
import { Tips, Const, QMMethod } from 'qmkit';
import { Store } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import moment from 'moment';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

export default class AccountInfo extends React.Component<any, any> {
  form;

  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const account = this._store.state().get('account');

    let employeeName = {
      initialValue: account && account.get('employeeName')
    };

    return (
      <Form>
        <FormItem {...formItemLayout} label="Login account">
          {account && account.get('accountName')}
        </FormItem>
        <FormItem {...formItemLayout} label="Customer name" required={true}>
          {getFieldDecorator('employeeName', {
            ...employeeName,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '员工姓名',
                    1,
                    20
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Bind phone number">
          <Row>
            <Col span={4}>{(account && account.get('phone')) || '未绑定'}</Col>
            <Col span={20}>
              <Tips title="You can reset the password by binding the phone number. Please do so as soon as possible" />
            </Col>
          </Row>
        </FormItem>
        <FormItem {...formItemLayout} label="Role">
          <Row>
            <Col span={4}>{'system admin'}</Col>
            <Col span={20}>
              <Tips title="Reset password and bind mobile phone please go to security center" />
            </Col>
          </Row>
        </FormItem>

        <Row>
          <Col span={6}>&nbsp;</Col>
          <Col span={8}>
            <Button type="primary" onClick={() => this._handleSave()}>
              Save
            </Button>
            &nbsp;&nbsp;
            <Button onClick={() => this.onCancel()}>Cancel</Button>
          </Col>
        </Row>
        <div style={{ marginTop: 20 }}>
          <h3>Login Log</h3>
          <ul>{this._renderLog()}</ul>
        </div>
      </Form>
    );
  }

  _handleSave = () => {
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        (this._store as any).saveEmployeeName(values);
      }
    });
  };

  onCancel = () => {
    (this._store as any).init();
  };

  _renderLog = () => {
    const logs = this._store.state().get('logs');
    return logs.map((val, index) => {
      return (
        <li key={`op-${index}`} style={styles.item}>
          {val &&
            `${moment(val.get('opTime')).format(Const.TIME_FORMAT)}  ${val.get(
              'opIp'
            )}`}
        </li>
      );
    });
  };

  checkName = (_rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入员工姓名'));
      return;
    }

    if (value.length < 0 || value.length > 20) {
      callback(new Error('员工姓名长度不正确'));
      return;
    }
    callback();
  };
}

const styles = {
  item: {
    padding: '5px 20px',
    fontSize: 14
  }
};
