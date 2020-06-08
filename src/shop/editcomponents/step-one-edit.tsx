import React from 'react';
import { IMap, Relax } from 'plume2';
import PropTypes from 'prop-types';

import {
  Form,
  Input,
  Button,
  Col,
  Row,
  Select,
  InputNumber,
  message,
  Icon
} from 'antd';
import { noop, Const, QMUpload, Tips, cache } from 'qmkit';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Store } from 'plume2';
import { fetchStoreInfo } from './../webapi';

const FormItem = Form.Item;
const Option = Select.Option;

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

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 14,
      offset: 6
    }
  }
};

const GreyBg = styled.div`
  background: #f5f5f5;
  padding: 15px;
  color: #333333;
  margin-bottom: 20px;

  span {
    width: 100px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
  .reason {
    padding-left: 100px;
    position: relative;
    word-break: break-all;
    span {
      position: absolute;
      left: 0;
      top: -5px;
    }
  }
`;

// 审核状态 0、待审核 1、已审核 2、审核未通过
const AUDIT_STATE = {
  0: '待审核',
  1: '已审核',
  2: '审核未通过'
};

// 店铺状态 0、开启 1、关店
const STORE_STATE = {
  0: '开启',
  1: '关店'
};

// 账户状态  0：启用   1：禁用
const ACCOUNT_STATE = {
  0: '启用',
  1: '禁用'
};

@Relax
export default class StepOneEdit extends React.Component<any, any> {
  constructor(props, ctx) {
    super(props);
    this.state = {
      //用于storeLogo图片展示
      storeLogoImage: [],
      //用于storeLogo图片校验
      storeLogo: ''
    };

    this.getStoreLog();
  }
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
      dictionary: IMap;
      onChange: Function; //改变商家基本信息
      onEditStoreInfo: Function;
    };
  };

  static relaxProps = {
    company: 'company',
    dictionary: 'dictionary',
    onChange: noop,
    onEditStoreInfo: noop
  };

  getStoreLog = async () => {
    const { res } = await fetchStoreInfo();
    if (res.code === 'K-000000') {
      debugger;
      this.setState({
        storeLogo: res.context.storeLogo,
        storeLogoImage:
          res.context.storeLogo && res.context.storeLogo
            ? [
                {
                  uid: 'store-logo-1',
                  name: res.context.storeLogo,
                  size: 1,
                  status: 'done',
                  url: res.context.storeLogo
                }
              ]
            : []
      });
    } else {
      message.error(res.message);
    }
  };

  render() {
    const { company, onChange, dictionary } = this.props.relaxProps;
    const storeInfo = company.get('storeInfo');
    const { getFieldDecorator } = this.props.form;
    const countryData = dictionary.get('country').toJS();
    const cityData = dictionary.get('city').toJS();
    const languageData = dictionary.get('language').toJS();
    const currencyData = dictionary.get('currency').toJS();
    const timeZoneData = dictionary.get('timeZone').toJS();

    const companyInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    const companyInfoId = companyInfo.companyInfoId;

    return (
      <div>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem
                required={false}
                {...formItemLayout}
                label={<FormattedMessage id="storeLogo" />}
              >
                <Row>
                  <Col span={3}>
                    <div className="clearfix logoImg">
                      <QMUpload
                        style={styles.box}
                        action={
                          Const.HOST +
                          `/store/uploadStoreResource?storeId=${storeInfo.storeId}&companyInfoId=${companyInfoId}&resourceType=IMAGE`
                        }
                        listType="picture-card"
                        name="uploadFile"
                        onChange={this._editStoreLogo}
                        fileList={this.state.storeLogoImage}
                        accept={'.jpg,.jpeg,.png,.gif'}
                        beforeUpload={this._checkUploadFile.bind(this, 1)}
                      >
                        {this.state.storeLogoImage.length >= 1 ? null : (
                          <div>
                            <Icon type="plus" style={styles.plus} />
                          </div>
                        )}
                      </QMUpload>
                      {getFieldDecorator('storeLogo', {
                        initialValue: this.state.storeLogo
                      })(<Input type="hidden" />)}
                    </div>
                  </Col>
                  {/* <Col span={21}>
                    <Tips title={<FormattedMessage id="storeSettingInfo1" />} />
                  </Col> */}
                </Row>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <GreyBg>
          <Row>
            <Col span={8}>
              <span>
                <FormattedMessage id="reviewStatus" />：
              </span>{' '}
              {storeInfo.get('auditState') != null
                ? AUDIT_STATE[storeInfo.get('auditState')]
                : '-'}
            </Col>
            <Col span={8}>
              <span>
                <FormattedMessage id="accountStatus" />：
              </span>{' '}
              {storeInfo.get('accountState') != null
                ? ACCOUNT_STATE[storeInfo.get('accountState')]
                : '-'}
            </Col>
            <Col span={8}>
              <span>
                <FormattedMessage id="storeStatus" />：
              </span>{' '}
              {storeInfo.get('storeState') != null
                ? STORE_STATE[storeInfo.get('storeState')]
                : '-'}
            </Col>
            {storeInfo.get('auditState') != null &&
            storeInfo.get('auditState') == 2 ? (
              <Col span={8}>
                <p className="reason">
                  <span>审核驳回原因：</span>
                  {storeInfo.get('auditReason')
                    ? storeInfo.get('auditReason')
                    : '-'}
                </p>
              </Col>
            ) : null}
            {storeInfo.get('accountState') != null &&
            storeInfo.get('accountState') == 1 ? (
              <Col span={8}>
                <p className="reason">
                  <span>账号禁用原因：</span>
                  {storeInfo.get('accountDisableReason')
                    ? storeInfo.get('accountDisableReason')
                    : '-'}
                </p>
              </Col>
            ) : null}
            {storeInfo.get('storeState') != null &&
            storeInfo.get('storeState') == 1 ? (
              <Col span={8}>
                <p className="reason">
                  <span>店铺关闭原因：</span>
                  {storeInfo.get('storeClosedReason')
                    ? storeInfo.get('storeClosedReason')
                    : '-'}
                </p>
              </Col>
            ) : null}
          </Row>
        </GreyBg>
        <div>
          <Form>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="storeLanguage" />}
                >
                  {getFieldDecorator('languageId', {
                    initialValue: storeInfo.get('languageId'),
                    rules: [
                      { required: false, message: 'Please select Language!' }
                    ]
                  })(
                    // <Input
                    //   placeholder="商家名称不得超过20字符"
                    //   onChange={(e: any) =>
                    //     onChange({
                    //       field: 'supplierName',
                    //       value: e.target.value
                    //     })
                    //   }
                    // />
                    <Select
                      onChange={(value) =>
                        onChange({
                          field: 'languageId',
                          value: value
                        })
                      }
                    >
                      {languageData.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.valueEn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="timeZone" />}
                >
                  {getFieldDecorator('timeZoneId', {
                    initialValue: storeInfo.get('timeZoneId'),
                    rules: [
                      { required: false, message: 'Please select TimeZone!' }
                    ]
                  })(
                    <Select
                      onChange={(value) =>
                        onChange({
                          field: 'timeZoneId',
                          value: value
                        })
                      }
                    >
                      {timeZoneData.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.valueEn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="targetCountry" />}
                >
                  {getFieldDecorator('countryId', {
                    initialValue: storeInfo.get('countryId'),
                    rules: [
                      { required: false, message: 'Please select Country!' }
                    ]
                  })(
                    <Select
                      onChange={(value) => {
                        onChange({
                          field: 'countryId',
                          value: value
                        });
                      }}
                    >
                      {countryData.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.valueEn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="targetCity" />}
                >
                  {getFieldDecorator('cityId', {
                    initialValue: storeInfo.get('cityId'),
                    rules: [{ required: false, message: 'Please select City!' }]
                  })(
                    <Select
                      onChange={(value) =>
                        onChange({
                          field: 'cityId',
                          value: value
                        })
                      }
                    >
                      {cityData.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.valueEn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="currency" />}
                >
                  {getFieldDecorator('currencyId', {
                    initialValue: storeInfo.get('currencyId'),
                    rules: [
                      { required: false, message: 'Please select Currency!' }
                    ]
                  })(
                    <Select
                      onChange={(value) =>
                        onChange({
                          field: 'currencyId',
                          value: value
                        })
                      }
                    >
                      {currencyData.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.valueEn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="taxRate" />}
                >
                  {getFieldDecorator('taxRate', {
                    initialValue: parseInt(storeInfo.get('taxRate')),
                    rules: [
                      { required: false, message: 'Please input taxRate!' }
                    ]
                  })(
                    <InputNumber
                      min={0}
                      onChange={(value) =>
                        onChange({
                          field: 'taxRate',
                          value: value + ''
                        })
                      }
                    />
                  )}{' '}
                  %
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" onClick={this._onSave}>
                    <FormattedMessage id="save" />
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }

  /**
   * 保存商家基本信息
   */
  _onSave = () => {
    const form = this.props.form;
    const { onEditStoreInfo, company } = this.props.relaxProps;
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        let storeInfo = company.get('storeInfo');
        onEditStoreInfo(storeInfo);
      } else {
        this.setState({});
      }
    });
  };
  /**
   * 编辑店铺logo
   * @param file
   * @param fileList
   * @private
   */
  _editStoreLogo = ({ file, fileList }) => {
    this.setState({ storeLogoImage: fileList });
    const { onChange } = this.props.relaxProps;

    //当所有图片都被删除时
    if (fileList.length == 0) {
      this.setState({ storeLogo: '' });
      this.props.form.setFieldsValue({ storeLogo: this.state.storeLogo });
      onChange({
        field: 'storeLogo',
        value: this.state.storeLogo
      });
      return;
    }

    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    //当上传完成的时候设置
    fileList = this._buildFileList(fileList);
    if (fileList && fileList.length > 0) {
      this.setState({ storeLogo: fileList[0].url });
      this.props.form.setFieldsValue({ storeLogo: this.state.storeLogo });
      onChange({
        field: 'storeLogo',
        value: this.state.storeLogo
      });
    }
  };

  /**
   * 检查文件格式以及大小
   */
  _checkUploadFile = (size: number, file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
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
  }
};
