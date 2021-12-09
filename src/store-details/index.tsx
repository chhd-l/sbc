import React from 'react';
import { Form, Input, Select, Row, Col, Spin, Icon, message } from 'antd';
import { Headline, BreadCrumb, Const, QMUpload, Tips, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { getStoreInfo, getDictionaryByType } from './webapi';

const FormItem = Form.Item;
const Option = Select.Option;
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
  title: {
    color: '#000',
    fontSize: 18,
    marginBottom: 16,
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
      currencyList: []
    };
  }

  componentDidMount() {
    this.getInitStoreInfo();
  }

  getInitStoreInfo = () => {
    this.setState({ loading: true });
    getStoreInfo().then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          loading: false,
          storeInfo: data.res.context ?? {},
          storeLogoImage: data.res.context.storeLogo ? [{ uid: 'store-logo-1', name: data.res.context.storeLogo, size: 1, url: data.res.context.storeLogo, status: 'done' }] : [],
          storeSignImage: data.res.context.storeSign ? [{ uid: 'store-sign-1', name: data.res.context.storeSign, size: 1, url: data.res.context.storeSign, status: 'done' }] : []
        });
        this.props.form.setFieldsValue(data.res.context ?? {});
      } else {
        this.setState({ loading: false });
      }
    }).catch(() => { this.setState({ loading: false }); });
    Promise.all([getDictionaryByType('country'), getDictionaryByType('city'), getDictionaryByType('language'), getDictionaryByType('timeZone'), getDictionaryByType('currency')]).then(([countryList, cityList, languageList, timezoneList, currencyList]) => {
      this.setState({
        countryList: countryList,
        cityList: cityList,
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
    // 支持的图片格式：jpg、jpeg、png、gif
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
    this.setState({ storeLogoImage: fileList });

    if (file.status == 'error') {
      message.error(RCi18n({ id: 'Setting.uploadfailed' }));
      return;
    }
  };

  _editStoreSign = ({ file, fileList }) => {
    this.setState({ storeSignImage: fileList });

    if (file.status == 'error') {
      message.error(RCi18n({ id: 'Setting.uploadfailed' }));
      return;
    }
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
    const { getFieldDecorator } = this.props.form;
    const { loading, storeInfo, countryList, cityList, languageList, timezoneList, currencyList } = this.state;
    return (
      <div>
        <BreadCrumb />
        <div className="container">
        <Spin spinning={loading}>
          <Form layout="horizontal" {...formItemLayout}>
            <div style={styles.title}>Store contact information</div>
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
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="Contact" />}>
                  {getFieldDecorator('contactPerson', {
                    initialValue: storeInfo.contactPerson ?? ''
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="phoneNumber" />}>
                  {getFieldDecorator('contactMobile', {
                    initialValue: storeInfo.contactMobile ?? '',
                    rules: [{ pattern: /^[0-9+-\\(\\)\s]{6,25}$/, message: 'Please input a correct phone number' }]
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="contactEmails" />}>
                  {getFieldDecorator('contactEmail', {
                    initialValue: storeInfo.contactEmail ?? ''
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="address" />}>
                  {getFieldDecorator('addressDetail', {
                    initialValue: storeInfo.addressDetail ?? ''
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="Setting.targetCountry" />}>
                    {getFieldDecorator('countryId', {
                      initialValue: storeInfo.countryId
                    })(
                      <Select>
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
            <div style={styles.title}>Logo</div>
            <Row gutter={[24,2]}>
              <Col span={24}>
                <FormItem label={<FormattedMessage id="storeLogo" />} labelCol={{xs:{span:24},sm:{span:3}}} wrapperCol={{xs:{span:24},sm:{span:20}}}>
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
            <div style={styles.title}>Standards and formats</div>
            <Row gutter={[24,2]}>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="Setting.storeLanguage" />} extra={<div style={{color:'#666'}}><FormattedMessage id="Setting.Thefirstisthedefaultlanguage" /></div>}>
                {getFieldDecorator('languageId', {
                    initialValue: storeInfo.languageId ?? []
                  })(
                    <Select
                      mode="multiple"
                      showSearch
                      filterOption={(input, option: { props }) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {languageList.map((item) => (
                        <Option value={item.id.toString()} key={item.id.toString()}>
                          {item.valueEn}
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
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label={<FormattedMessage id="Setting.currency" />}>
                  {getFieldDecorator('currencyId', {
                    initialValue: storeInfo.currencyId
                  })(
                    <Select>
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
          </Form>
        </Spin>
        </div>
      </div>
    );
  }
}

export default Form.create()(StoreDetail);
