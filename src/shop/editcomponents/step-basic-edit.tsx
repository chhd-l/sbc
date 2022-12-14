import React from 'react';
import { IMap, Relax } from 'plume2';
import PropTypes from 'prop-types';

import { Form, Input, Button, Col, Row, Select, InputNumber, message, Icon, Switch } from 'antd';
import { noop, Const, QMUpload, Tips, cache } from 'qmkit';
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Store } from 'plume2';
import { fetchStoreInfo } from '../webapi';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 8 }
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
  0: 'Pending review',
  1: 'Audited',
  2: 'Review failed'
};

// 店铺状态 0、开启 1、关店
const STORE_STATE = {
  0: 'Open',
  1: 'Close shop'
};

// 账户状态  0：启用   1：禁用
const ACCOUNT_STATE = {
  0: 'Enable',
  1: 'Disable'
};

@Relax
class StepOneEdit extends React.Component<any, any> {
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
    intl: any;
  };

  static relaxProps = {
    company: 'company',
    dictionary: 'dictionary',
    onChange: noop,
    onEditStoreInfo: noop
  };

  getStoreLog = async () => {
    const { res } = await fetchStoreInfo();
    if (res.code === Const.SUCCESS_CODE) {
      let _is=!res.context.storeLogo
      this.setState({
        storeLogo: res.context.storeLogo,
        storeLogoImage:
        !_is
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
          <Row className="storeLogoUpdate">
            <Col span={8}>
              <FormItem required={false} {...formItemLayout} label={<FormattedMessage id="Setting.shopLogo" />}>
                <Row>
                  <Col span={6}>
                    <div className="clearfix logoImg">
                      <QMUpload
                        style={styles.box}
                        action={Const.HOST + `/store/uploadStoreResource?storeId=${storeInfo.storeId}&companyInfoId=${companyInfoId}&resourceType=IMAGE`}
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
                </Row>
              </FormItem>
            </Col>
            <Col span={16}>
              {Const.SITE_NAME === 'MYVETRECO' ? <Tips title={<FormattedMessage id="Setting.storeSettingInfo1v" />} /> : <Tips title={<FormattedMessage id="Setting.storeSettingInfo1" />} />}
            </Col>
          </Row>
        </Form>
        <GreyBg>
          <Row>
            <Col span={8}>
              <span>
                <FormattedMessage id="Setting.reviewStatus" />：
              </span>{' '}
              {storeInfo.get('auditState') != null ? AUDIT_STATE[storeInfo.get('auditState')] : '-'}
            </Col>
            <Col span={8}>
              <span>
                <FormattedMessage id="Setting.accountStatus" />：
              </span>{' '}
              {storeInfo.get('accountState') != null ? ACCOUNT_STATE[storeInfo.get('accountState')] : '-'}
            </Col>
            <Col span={8}>
              <span>
                <FormattedMessage id="Setting.storeStatus" />：
              </span>{' '}
              {storeInfo.get('storeState') != null ? STORE_STATE[storeInfo.get('storeState')] : '-'}
            </Col>
            {storeInfo.get('auditState') != null && storeInfo.get('auditState') == 2 ? (
              <Col span={8}>
                <p className="reason">
                  <span>
                    <FormattedMessage id="Setting.Reasonsforreviewrejection" />:
                  </span>
                  {storeInfo.get('auditReason') ? storeInfo.get('auditReason') : '-'}
                </p>
              </Col>
            ) : null}
            {storeInfo.get('accountState') != null && storeInfo.get('accountState') == 1 ? (
              <Col span={8}>
                <p className="reason">
                  <span>
                    <FormattedMessage id="Setting.Reasonsfordisablingtheaccount" />:
                  </span>
                  {storeInfo.get('accountDisableReason') ? storeInfo.get('accountDisableReason') : '-'}
                </p>
              </Col>
            ) : null}
            {storeInfo.get('storeState') != null && storeInfo.get('storeState') == 1 ? (
              <Col span={8}>
                <p className="reason">
                  <span>
                    <FormattedMessage id="Setting.Reasonsforstoreclosure" />:
                  </span>
                  {storeInfo.get('storeClosedReason') ? storeInfo.get('storeClosedReason') : '-'}
                </p>
              </Col>
            ) : null}
          </Row>
        </GreyBg>
        <div>
          <Form>
            <Row>
              <Col span={12}>
                <span style={{ position: 'absolute', left: '86px', top: '35px' }} className="ant-form-item-required">
                  <FormattedMessage id="Setting.Thefirstisthedefaultlanguage" />
                </span>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="Setting.storeLanguage" />}>
                  {getFieldDecorator('languageId', {
                    initialValue: Array.isArray(storeInfo.get('languageId')) ? storeInfo.get('languageId') : storeInfo.get('languageId') ? storeInfo.get('languageId').toJS() : [],
                    rules: [{ required: false, message: (window as any).RCi18n({ id: 'Setting.PleaseselectLanguage' }) + '!' }]
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
                      mode="multiple"
                      showSearch
                      filterOption={(input, option: { props }) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={(value) =>
                        onChange({
                          field: 'languageId',
                          value: value,
                          valueEn: value
                        })
                      }
                    >
                      {languageData.map((item) => (
                        <Option value={item.id.toString()} key={item.id.toString()}>
                          {item.valueEn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="Setting.timeZone" />}>
                  {getFieldDecorator('timeZoneId', {
                    initialValue: storeInfo.get('timeZoneId'),
                    rules: [{ required: false, message: (window as any).RCi18n({ id: 'Setting.PleaseselectTimeZone' }) + '!' }]
                  })(
                    <Select
                      showSearch
                      filterOption={(input, option: { props }) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={(value, zone) =>
                        onChange({
                          field: 'timeZoneId',
                          value: value,
                          zone: zone.props.children
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
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="Setting.targetCountry" />}>
                  {getFieldDecorator('countryId', {
                    initialValue: storeInfo.get('countryId'),
                    rules: [{ required: false, message: (window as any).RCi18n({ id: 'Setting.PleaseselectCountry' }) + '!' }]
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
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="Setting.targetCity" />}>
                  {getFieldDecorator('cityIds', {
                    initialValue: Array.isArray(storeInfo.get('cityIds')) ? storeInfo.get('cityIds') : storeInfo.get('cityIds') ? storeInfo.get('cityIds').toJS() : [],
                    rules: [{ required: false, message: (window as any).RCi18n({ id: 'Setting.PleaseselectCity' }) + '!' }]
                  })(
                    <Select
                      mode="multiple"
                      showSearch
                      filterOption={(input, option: { props }) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={(value) =>
                        onChange({
                          field: 'cityIds',
                          value: value
                        })
                      }
                    >
                      {cityData.map((item) => (
                        <Option value={item.id.toString()} key={item.id.toString()}>
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
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="Setting.currency" />}>
                  {getFieldDecorator('currencyId', {
                    initialValue: storeInfo.get('currencyId'),
                    rules: [{ required: false, message: (window as any).RCi18n({ id: 'Setting.PleaseselectCurrency' }) + '!' }]
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
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="Setting.taxRate" />}>
                  {getFieldDecorator('taxRate', {
                    initialValue: parseInt(storeInfo.get('taxRate')),
                    rules: [{ required: false, message: (window as any).RCi18n({ id: 'Setting.PleaseinputTaxRate' }) + '!' }]
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
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="Setting.domainName" />}>
                  {getFieldDecorator('domainName', {
                    initialValue: storeInfo.get('domainName'),
                    rules: [{ required: false, message: (window as any).RCi18n({ id: 'Setting.PleaseinputDomainName' }) + '!' }]
                  })(
                    <Input
                      addonBefore="URL"
                      onChange={(e: any) =>
                        onChange({
                          field: 'domainName',
                          value: e.target.value
                        })
                      }
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="Setting.miniCharge" />}>
                  {getFieldDecorator('miniCharge', {
                    initialValue: storeInfo.get('miniCharge'),
                    rules: [
                      {
                        required: false,
                        message: (window as any).RCi18n({ id: 'Setting.PleaseinputMinimumCharge' }) + '!'
                      }
                    ]
                  })(
                    <InputNumber
                      min={0}
                      onChange={(value) =>
                        onChange({
                          field: 'miniCharge',
                          value: value
                        })
                      }
                    />
                  )}
                </FormItem>
              </Col>
              {/* <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="Setting.prescriberMap" />}>
                  {getFieldDecorator('prescriberMap', {
                    initialValue: storeInfo.get('prescriberMap') === '1' ? true : false,
                    rules: [
                      {
                        required: false,
                        message: (window as any).RCi18n({ id: 'Setting.PleaseinputPrescriberMap' }) + '!'
                      }
                    ]
                  })(
                    <Switch
                      checked={storeInfo.get('prescriberMap') === '1' ? true : false}
                      onChange={(value) =>
                        onChange({
                          field: 'prescriberMap',
                          value: value ? '1' : '0'
                        })
                      }
                    />
                  )}
                </FormItem>
              </Col> */}
              {/* <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="profilePaymentMethod" />}
                >
                  {getFieldDecorator('profilePaymentMethod', {
                    initialValue:
                      storeInfo.get('profilePaymentMethod') === '1'
                        ? true
                        : false,
                    rules: [
                      {
                        required: false,
                        message: 'Please input Profile Payment Method!'
                      }
                    ]
                  })(
                    <Switch
                      checked={
                        storeInfo.get('profilePaymentMethod') === '1'
                          ? true
                          : false
                      }
                      onChange={(value) =>
                        onChange({
                          field: 'profilePaymentMethod',
                          value: value ? '1' : '0'
                        })
                      }
                    />
                  )}
                </FormItem>
              </Col> */}

              {/* <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="Setting.onePageCheckout" />}>
                  {getFieldDecorator('onePageCheckout', {
                    initialValue: storeInfo.get('onePageCheckout') === '1' ? true : false
                  })(
                    <Switch
                      checked={storeInfo.get('onePageCheckout') === '1' ? true : false}
                      onChange={(value) =>
                        onChange({
                          field: 'onePageCheckout',
                          value: value ? '1' : '0'
                        })
                      }
                    />
                  )}
                </FormItem>
              </Col> */}
              {/* <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={(window as any).RCi18n({ id: 'Setting.CitySelect' })}>
                  {getFieldDecorator('citySelection', {
                    initialValue: storeInfo.get('citySelection') === 0 ? false : true // default checked
                  })(
                    <Switch
                      checked={storeInfo.get('citySelection') === 0 ? false : true}
                      onChange={(value) =>
                        onChange({
                          field: 'citySelection',
                          value: value ? 1 : 0
                        })
                      }
                    />
                  )}
                </FormItem>
              </Col> */}
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" onClick={this._onSave}>
                    <FormattedMessage id="Setting.save" />
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
    const { onEditStoreInfo, company, onChange } = this.props.relaxProps;
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
      message.error((window as any).RCi18n({ id: 'Setting.uploadfailed' }));
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
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
      if (file.size <= size * 1024 * 1024) {
        return true;
      } else {
        message.error((window as any).RCi18n({ id: 'Setting.Filesizecannotexceed' }) + size + 'M');
        return false;
      }
    } else {
      message.error((window as any).RCi18n({ id: 'Setting.Fileformaterror' }));
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

export default injectIntl(StepOneEdit);

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
