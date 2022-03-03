import React, { CSSProperties } from 'react';
import { Form, Input, InputNumber, Select, Row, Col, Spin, Icon, message, Button } from 'antd';
import { Headline, BreadCrumb, Const, QMUpload, Tips, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { getStoreInfo, getDictionaryByType, editStoreInfo } from './webapi';
import SignedInfo from './components/signed-info';

const FormItem = Form.Item;
const Option = Select.Option;
const styles: { [key: string]: CSSProperties } = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  title: {
    color: '#000',
    fontSize: 18,
    marginBottom: 16,
    clear: 'both'
  },
};

class StoreDetail extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      storeInfo: {},
      storeLogoImage: [],
      storeSignImage: [],
      countryList: [],
      cityList: [],
      languageList: [],
      timezoneList: [],
      currencyList: [],
      storeInfoChanged: false,
    };
  }

  componentDidMount() {
    this.getInitStoreInfo();
  }

  getInitStoreInfo = () => {
    this.setState({ loading: true });
    Promise.all([
      getStoreInfo(),
      getDictionaryByType('country'),
      getDictionaryByType('city')
    ]).then(([data, countryList, cityList]) => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          loading: false,
          countryList: countryList,
          cityList: cityList,
          storeInfo: data.res.context ?? {},
          storeLogoImage: data.res.context.storeLogo ? [{ uid: 'store-logo-1', name: data.res.context.storeLogo, size: 1, url: data.res.context.storeLogo, status: 'done' }] : [],
          storeSignImage: data.res.context.storeSign ? [{ uid: 'store-sign-1', name: data.res.context.storeSign, size: 1, url: data.res.context.storeSign, status: 'done' }] : []
        });
        this.props.form.setFieldsValue(Object.assign({}, (data.res.context ?? {}), { cityIds: data.res.context?.cityIds ?? [], languageId: data.res.context?.languageId ? data.res.context.languageId[0] : null }));
      } else {
        this.setState({ loading: false });
      }
    }).catch(() => { this.setState({ loading: false }); });
    Promise.all([getDictionaryByType('language'), getDictionaryByType('timeZone'), getDictionaryByType('currency')]).then(([languageList, timezoneList, currencyList]) => {
      this.setState({
        languageList: languageList,
        timezoneList: timezoneList,
        currencyList: currencyList
      });
    });
  }

  _checkStoreLogoImage = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
      if (file.size <= 2 * 1024 * 1024) {
        return true;
      } else {
        message.error('File size exceed, limited to 2M');
        return false;
      }
    } else {
      message.error('File format error');
      return false;
    }
  };

  _checkStoreSignImage = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：ico
    if (fileName.endsWith('.ico')) {
      if (file.size <= 2 * 1024 * 1024) {
        return true;
      } else {
        message.error('File size exceed, limited to 2M');
        return false;
      }
    } else {
      message.error('File format error');
      return false;
    }
  };

  _editStoreLogo = ({ file, fileList }) => {
    this.setState({ storeLogoImage: fileList, storeInfoChanged: true });

    if (file.status == 'error') {
      message.error(RCi18n({ id: 'Setting.uploadfailed' }));
      return;
    }
  };

  _editStoreSign = ({ file, fileList }) => {
    this.setState({ storeSignImage: fileList, storeInfoChanged: true });

    if (file.status == 'error') {
      message.error(RCi18n({ id: 'Setting.uploadfailed' }));
      return;
    }
  };

  modifyChangedStatus = () => {
    if (!this.state.storeInfoChanged) {
      this.setState({ storeInfoChanged: true });
    }
  };

  saveSetting = () => {
    const { form } = this.props;
    const { storeLogoImage, storeSignImage, storeInfo } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        values['languageId'] = [values['languageId']];
        editStoreInfo({
          ...storeInfo,
          ...values,
          ...(storeLogoImage.length > 0 ? { storeLogo: storeLogoImage[0]['url'] } : {}),
          ...(storeSignImage.length > 0 ? { storeSign: storeSignImage[0]['url'] } : {})
        }).then((data) => {
          if (data.res.code === Const.SUCCESS_CODE) {
            message.success(RCi18n({ id: 'Setting.Operationsuccessful' }));
            this.setState({ storeInfoChanged: false });
          }
          this.setState({ loading: false });
        }).catch(() => { this.setState({ loading: false }); });
      }
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      }
    };
    const filedType = {
      order: <FormattedMessage id="Order.OrderNumber" />,
      subscription: <FormattedMessage id="Order.SubscriptionNumber" />,
      return: <FormattedMessage id="Order.ReturnOrderNumber" />
    };
    const { getFieldDecorator } = this.props.form;
    const { loading, storeInfo, countryList, cityList, languageList, timezoneList, currencyList } = this.state;
    return (
      <div>
        <BreadCrumb />
        <div className="container">
        <Spin spinning={loading}>
          <Form layout="horizontal" {...formItemLayout}>
            <div style={styles.title}><FormattedMessage id="Setting.storeContactInfo"/></div>
            <Row gutter={[24,2]}>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="storeAccount" />}>
                  {getFieldDecorator('accountName', {
                    initialValue: storeInfo.accountName ?? ''
                  })(<Input disabled={true} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="storeName" />}>
                  {getFieldDecorator('storeName', {
                    initialValue: storeInfo.storeName ?? ''
                  })(<Input onChange={this.modifyChangedStatus} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="Contact" />}>
                  {getFieldDecorator('contactPerson', {
                    initialValue: storeInfo.contactPerson ?? ''
                  })(<Input onChange={this.modifyChangedStatus} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="phoneNumber" />}>
                  {getFieldDecorator('contactMobile', {
                    initialValue: storeInfo.contactMobile ?? '',
                    rules: [{ pattern: /^[0-9+-\\(\\)\s]{6,25}$/, message: 'Please input a correct phone number' }]
                  })(<Input onChange={this.modifyChangedStatus} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="contactEmails" />}>
                  {getFieldDecorator('contactEmail', {
                    initialValue: storeInfo.contactEmail ?? ''
                  })(<Input onChange={this.modifyChangedStatus} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="address" />}>
                  {getFieldDecorator('addressDetail', {
                    initialValue: storeInfo.addressDetail ?? ''
                  })(<Input onChange={this.modifyChangedStatus} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="Setting.targetCountry" />}>
                    {getFieldDecorator('countryId', {
                      initialValue: storeInfo.countryId
                    })(
                      <Select onChange={this.modifyChangedStatus} getPopupContainer={() => document.getElementById('page-content')}>
                        {countryList.map((item) => (
                          <Option value={item.id} key={item.id}>
                            {item.valueEn}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="Setting.targetCity" />}>
                    {getFieldDecorator('cityIds', {
                      initialValue: storeInfo.cityIds ?? []
                    })(
                      <Select
                        mode="multiple"
                        showSearch
                        filterOption={(input, option: { props }) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onChange={this.modifyChangedStatus}
                        getPopupContainer={() => document.getElementById('page-content')}
                      >
                        {cityList.map((item) => (
                          <Option value={item.id.toString()} key={item.id.toString()}>
                            {item.valueEn}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
              </Col>
            </Row>
            <div style={styles.title}><FormattedMessage id="Setting.shopContactInfo"/></div>
            <Row gutter={[24,2]}>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="Setting.storeContactEmail" />}>
                  {getFieldDecorator('storeContactEmail', {
                    initialValue: storeInfo.storeContactEmail ?? ''
                  })(<Input onChange={this.modifyChangedStatus} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="Setting.storeContactPhoneNumber" />}>
                  {getFieldDecorator('storeContactPhoneNumber', {
                    initialValue: storeInfo.storeContactPhoneNumber ?? ''
                  })(<Input onChange={this.modifyChangedStatus} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="Setting.contactTimePeriod" />}>
                  {getFieldDecorator('contactTimePeriod', {
                    initialValue: storeInfo.contactTimePeriod ?? ''
                  })(<Input onChange={this.modifyChangedStatus} />)}
                </FormItem>
              </Col>
            </Row>
            <div style={styles.title}><FormattedMessage id="Setting.logo"/></div>
            <Row gutter={[24,2]}>
              <Col span={24}>
                <FormItem label={<FormattedMessage id="Setting.shopLogo" />} labelCol={{xs:{span:24},sm:{span:3}}} wrapperCol={{xs:{span:24},sm:{span:20}}}>
                  <Row>
                    <Col span={3}>
                      <div className="clearfix logoImg">
                        <QMUpload
                          style={styles.box}
                          action={Const.HOST + `/store/uploadStoreResource?resourceType=IMAGE`}
                          listType="picture-card"
                          name="uploadFile"
                          onChange={this._editStoreLogo}
                          fileList={this.state.storeLogoImage}
                          accept={'.jpg,.jpeg,.png,.gif'}
                          beforeUpload={this._checkStoreLogoImage}
                        >
                          {this.state.storeLogoImage.length >= 1 ? null : (
                            <div>
                              <Icon type="plus" style={styles.plus} />
                            </div>
                          )}
                        </QMUpload>
                      </div>
                    </Col>
                    <Col span={12}><Tips title={<FormattedMessage id="storeSettingInfo2" />} /></Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label={<FormattedMessage id="Setting.storeFavicon" />} labelCol={{xs:{span:24},sm:{span:3}}} wrapperCol={{xs:{span:24},sm:{span:20}}}>
                  <Row>
                    <Col span={3}>
                      <div className="clearfix logoImg">
                        <QMUpload
                          style={styles.box}
                          action={Const.HOST + `/store/uploadStoreResource?resourceType=IMAGE`}
                          listType="picture-card"
                          name="uploadFile"
                          onChange={this._editStoreSign}
                          fileList={this.state.storeLogoImage}
                          accept={'.ico'}
                          beforeUpload={this._checkStoreSignImage}
                        >
                          {this.state.storeSignImage.length >= 1 ? null : (
                            <div>
                              <Icon type="plus" style={styles.plus} />
                            </div>
                          )}
                        </QMUpload>
                      </div>
                    </Col>
                    <Col span={12}><Tips title={<FormattedMessage id="Setting.storeFaviconTip" />} /></Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>
            <div style={styles.title}><FormattedMessage id="Setting.standardAndFormats"/></div>
            <Row gutter={[24,2]}>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="Setting.storeLanguage" />}>
                {getFieldDecorator('languageId', {
                    initialValue: null
                  })(
                    <Select onChange={this.modifyChangedStatus} getPopupContainer={() => document.getElementById('page-content')}>
                      {languageList.map((item) => (
                        <Option value={item.id.toString()} key={item.id.toString()}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="Setting.timeZone" />}>
                  {getFieldDecorator('timeZoneId', {
                    initialValue: storeInfo.timeZoneId
                  })(
                    <Select
                      showSearch
                      filterOption={(input, option: { props }) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={this.modifyChangedStatus}
                      getPopupContainer={() => document.getElementById('page-content')}
                    >
                      {timezoneList.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.valueEn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={[24,2]}>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="Setting.domainName" />}>
                  {getFieldDecorator('domainName', {
                    initialValue: storeInfo.domainName
                  })(
                    <Input
                      addonBefore="URL"
                      onChange={this.modifyChangedStatus}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="Setting.currency" />}>
                  {getFieldDecorator('currencyId', {
                    initialValue: storeInfo.currencyId
                  })(
                    <Select onChange={this.modifyChangedStatus} getPopupContainer={() => document.getElementById('page-content')}>
                      {currencyList.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.valueEn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <div style={styles.title}><FormattedMessage id="Setting.signedInformation"/></div>
            <Row gutter={[24,2]}>
              <Col span={22} push={1}>
                <SignedInfo storeInfo={storeInfo} />
              </Col>
            </Row>
          </Form>
        </Spin>
        </div>
        <div className="bar-button">
          <Button type="primary" disabled={!this.state.storeInfoChanged} onClick={this.saveSetting}>
            <FormattedMessage id="Setting.Save" />
          </Button>
        </div>
      </div>
    );
  }
}

export default Form.create()(StoreDetail);
