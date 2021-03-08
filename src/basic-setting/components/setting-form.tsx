import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon, Button, Input, Form } from 'antd';
import { Const, Tips, QMUpload, cache, QMMethod } from 'qmkit';
import { Store } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { message } from 'antd';
import { FormattedMessage } from 'react-intl';
import './style.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 14,
    xs: { span: 14 },
    sm: { span: 18 }
  }
};

const inputItemLayout = {
  labelCol: {
    span: 6,
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 14,
    xs: { span: 14 },
    sm: { span: 12 }
  }
};

export default class settingForm extends React.Component<any, any> {
  form;

  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    let storeLogo = this._store.state().getIn(['settings', 'storeLogo']); //店铺logo
    let storeSign = this._store.state().getIn(['settings', 'storeSign']); //店铺店招

    this.state = {
      storeLogo: storeLogo,
      //用于storeSign图片展示
      storeSignImage:
        storeSign && storeSign
          ? [
              {
                uid: 'store-sign-1',
                name: storeSign,
                size: 1,
                status: 'done',
                url: storeSign
              }
            ]
          : [],
      //用于storeSign图片校验
      storeSign: storeSign
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const storeId = this._store.state().getIn(['settings', 'storeId']); //店铺标识
    const supplierCode = this._store.state().getIn(['settings', 'supplierCode']);
    const accountName = this._store.state().getIn(['settings', 'accountName']);
    const storeName = this._store.state().getIn(['settings', 'storeName']);
    const contactPerson = this._store.state().getIn(['settings', 'contactPerson']);
    const contactMobile = this._store.state().getIn(['settings', 'contactMobile']);
    const contactEmail = this._store.state().getIn(['settings', 'contactEmail']);
    const addressDetail = this._store.state().getIn(['settings', 'addressDetail']);

    const companyInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    const companyInfoId = companyInfo.companyInfoId; //从缓存中获取商家标识

    return (
      <Form style={{ paddingBottom: 50, maxWidth: 900 }} onSubmit={this._handleSubmit}>
        <Row className="logoUpdate">
          <Col span={24}>
            <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="Setting.storeLogo" />}>
              <Row>
                <Col span={6}>
                  <div className="clearfix bannerImg">
                    <QMUpload
                      style={styles.box}
                      action={Const.HOST + '/store/uploadStoreResource?resourceType=IMAGE'}
                      listType="picture-card"
                      name="uploadFile"
                      onChange={this._editStoreSign}
                      fileList={this.state.storeSignImage}
                      accept={'.jpg,.jpeg,.png,.gif'}
                      beforeUpload={this._checkUploadFile.bind(this, 2)}
                    >
                      {this.state.storeSignImage.length >= 1 ? null : (
                        <div>
                          <Icon type="plus" style={styles.plus} />
                        </div>
                      )}
                    </QMUpload>
                    {getFieldDecorator('storeSign', {
                      initialValue: this.state.storeSign
                    })(<Input type="hidden" />)}
                  </div>
                </Col>
                <Col span={18}>
                  <Tips title={<FormattedMessage id="Setting.storeSettingInfo2" />} />
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem>
              {getFieldDecorator('storeLogo', {
                initialValue: this.state.storeLogo
              })(<Input type="hidden" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem {...inputItemLayout} required={false} label={<FormattedMessage id="Setting.storeAccount" />}>
              {getFieldDecorator('accountName', {
                initialValue: accountName
              })(<Input disabled={true} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem {...inputItemLayout} required={false} label={<FormattedMessage id="Setting.storeName" />}>
              {getFieldDecorator('storeName', {
                initialValue: storeName
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem {...inputItemLayout} required={false} label={<FormattedMessage id="Setting.Contact" />}>
              {getFieldDecorator('contactPerson', {
                initialValue: contactPerson
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem {...inputItemLayout} required={false} label={<FormattedMessage id="Setting.phoneNumber" />}>
              {getFieldDecorator('contactMobile', {
                initialValue: contactMobile,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(rule, value, callback, 'Phone Number', 1, 11);
                    }
                  }
                ]
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem {...inputItemLayout} required={false} label={<FormattedMessage id="Setting.contactEmails" />}>
              {getFieldDecorator('contactEmail', {
                initialValue: contactEmail
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem {...inputItemLayout} required={false} label={<FormattedMessage id="Setting.address" />}>
              {getFieldDecorator('addressDetail', {
                initialValue: addressDetail
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>

        <div className="bar-button">
          <Button type="primary" htmlType="submit">
            {<FormattedMessage id="Setting.save" />}
          </Button>
        </div>
      </Form>
    );
  }

  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        (this._store as any).editSetting(values);
      }
    });
  };

  /**
   * 编辑店铺店招
   * @param file
   * @param fileList
   * @private
   */
  _editStoreSign = ({ file, fileList }) => {
    this.setState({ storeSignImage: fileList });

    //当所有图片都被删除时
    if (fileList.length == 0) {
      this.setState({ storeSign: '' });
      this.props.form.setFieldsValue({ storeSign: this.state.storeSign });
      return;
    }

    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    //当上传完成的时候设置
    fileList = this._buildFileList(fileList);
    if (fileList && fileList.length > 0) {
      this.setState({ storeSign: fileList[0].url });
      this.props.form.setFieldsValue({ storeSign: this.state.storeSign });
    }
  };

  /**
   * 检查文件格式以及大小
   */
  _checkUploadFile = (size: number, file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
      if (file.size <= size * 1024 * 1024) {
        return true;
      } else {
        message.error('文件大小不能超过' + size + 'M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  _buildFileList = (fileList: Array<any>): Array<any> => {
    return fileList
      .filter((file) => file.status === 'done')
      .map((file) => {
        return {
          uid: file.uid,
          status: file.status,
          url: file.response ? file.response[0] : file.url
        };
      });
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  alertBox: {
    marginLeft: 10
  },
  toolBox: {
    marginLeft: 10,
    height: 32,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any
};
