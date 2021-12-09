import React from 'react';
import { Form, Input, Select, Row, Col, Spin, Icon, message } from 'antd';
import { Headline, BreadCrumb, Const, QMUpload, Tips } from 'qmkit';
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
  }
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
      cityList: []
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
          storeInfo: data.res.context ?? {}
        });
      } else {
        this.setState({ loading: false });
      }
    }).catch(() => { this.setState({ loading: false }); });
    Promise.all([getDictionaryByType('country'), getDictionaryByType('city')]).then(([countryList, cityList]) => {
      this.setState({
        countryList: countryList,
        cityList: cityList
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

  render() {
    const formItemLayout = {
      labelCol: {
        sm: { span: 24 },
        xs: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 24 },
        xs: { span: 12 },
      }
    };
    const { getFieldDecorator } = this.props.form;
    const { loading, storeInfo, countryList, cityList } = this.state;
    return (
      <div>
        <BreadCrumb />
        <Spin>
          <Form layout="horizontal" {...formItemLayout}>
            <Headline title="Store contact information" />
            <Row gutter={[24,12]}>
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
            <Headline title="Logo" />
            <Row gutter={[24,12]}>
              <Col span={3}><FormattedMessage id="storeLogo" /></Col>
              <Col span={5}>
                <div className="clearfix logoImg">
                  <QMUpload
                    style={styles.box}
                    action={Const.HOST + `/store/uploadStoreResource?resourceType=IMAGE`}
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
                </div>
              </Col>
              <Col span={16}><Tips title={<FormattedMessage id="storeSettingInfo2" />} /></Col>
            </Row>
          </Form>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(StoreDetail);
