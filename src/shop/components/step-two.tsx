import React from 'react';

import { Relax, IMap } from 'plume2';

import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Icon,
  DatePicker,
  message,
  Popover
} from 'antd';
import styled from 'styled-components';
import { QMUpload, noop, Const, ValidConst, QMMethod } from 'qmkit';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

const front = require('../img/front.png');
const back = require('../img/back.png');
const post = require('../img/post.png');

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 10 }
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

const newtailFormItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 3 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 7 }
  }
};

const PicBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justifycontent: flex-start;
  width: 430px;

  + p {
    color: #999999;
    width: 430px;
  }
`;

const ExamplePic = styled.div`
  border: 1px solid #d9d9d9;
  width: 104px;
  height: 104px;
  border-radius: 4px;
  text-align: center;
  margin-right: 8px;
  display: inline-block;
  position: relative;
  p {
    color: #ffffff;
    width: 100%;
    height: 24px;
    line-height: 24px;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
  }
`;
const content = (
  <div>
    <img src={post} alt="" height="400" />
  </div>
);

const person = (
  <div>
    <img src={front} alt="" height="400" />
  </div>
);

const personback = (
  <div>
    <img src={back} alt="" height="400" />
  </div>
);

@Relax
export default class StepTwo extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;

      setCurrentStep: Function;
      mergeInfo: Function;
      saveCompanyInfo: Function;
    };
  };

  static relaxProps = {
    // ??????
    company: 'company',

    // ???????????????
    setCurrentStep: noop,
    // ??????????????????
    mergeInfo: noop,
    // ??????????????????
    saveCompanyInfo: noop
  };

  render() {
    const { company, mergeInfo } = this.props.relaxProps;
    const info = company.get('info');
    const businessLicenceImg = info.get('businessLicence')
      ? info.get('businessLicence')
      : null;
    const businessLicence = info.get('businessLicence')
      ? JSON.parse(info.get('businessLicence'))
      : [];
    const frontIDCard = info.get('frontIDCard')
      ? JSON.parse(info.get('frontIDCard'))
      : [];
    const backIDCard = info.get('backIDCard')
      ? JSON.parse(info.get('backIDCard'))
      : [];
    const { getFieldDecorator } = this.props.form;
    const foundDate = info.get('foundDate') && {
      initialValue: moment(info.get('foundDate'), Const.DAY_FORMAT)
    };

    const businessTermStart = info.get('businessTermStart') && {
      initialValue: moment(info.get('businessTermStart'), Const.DAY_FORMAT)
    };

    const businessTermEnd = info.get('businessTermEnd') && {
      initialValue: moment(info.get('businessTermEnd'), Const.DAY_FORMAT)
    };

    return (
      <div style={{ padding: '20px 0 40px 0' }}>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={true}
                label={<FormattedMessage id="unifiedSocialCreditCode" />}
              >
                {getFieldDecorator('socialCreditCode', {
                  initialValue: info.get('socialCreditCode'),
                  rules: [
                    { required: true, message: '?????????????????????????????????' },
                    {
                      pattern: ValidConst.socialCreditCode,
                      message: '???????????????????????????????????????????????????15-20??????'
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'socialCreditCode',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={true}
                label={<FormattedMessage id="enterpriseName" />}
              >
                {getFieldDecorator('companyName', {
                  initialValue: info.get('companyName'),
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorTrimMinAndMax(
                          rule,
                          value,
                          callback,
                          '????????????',
                          1,
                          50
                        );
                      }
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'companyName',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="address" />}
              >
                {getFieldDecorator('address', {
                  initialValue: info.get('address'),
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorMinAndMax(
                          rule,
                          value,
                          callback,
                          '??????',
                          0,
                          60
                        );
                      }
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'address',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="legalRepresentative" />}
              >
                {getFieldDecorator('legalRepresentative', {
                  initialValue: info.get('legalRepresentative'),
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorMinAndMax(
                          rule,
                          value,
                          callback,
                          '???????????????',
                          0,
                          10
                        );
                      }
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'legalRepresentative',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="registeredCapital" />}
              >
                {getFieldDecorator('registeredCapital', {
                  initialValue: info.get('registeredCapital'),
                  rules: [
                    {
                      pattern: ValidConst.zeroPrice,
                      message: '??????????????????????????????'
                    },
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorMinAndMax(
                          rule,
                          value ? value.toString() : '',
                          callback,
                          '????????????',
                          0,
                          9
                        );
                      }
                    }
                  ]
                })(
                  <Input
                    style={{ width: 142 }}
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'registeredCapital',
                        value: e.target.value
                      })
                    }
                  />
                )}
                &nbsp;??????
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="establishmentDate" />}
              >
                {getFieldDecorator('foundDate', {
                  ...foundDate,
                  rules: [
                    {
                      validator: (rule, value, callback) =>
                        QMMethod.validatorMinAndMax(
                          rule,
                          value ? value.format(Const.DAY_FORMAT) : '',
                          callback,
                          '????????????',
                          0,
                          20
                        )
                    }
                  ]
                })(
                  <DatePicker
                    format={Const.DAY_FORMAT}
                    onChange={(_date, dateString) =>
                      mergeInfo({
                        field: 'foundDate',
                        value: dateString
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="businessPeriodSince" />}
              >
                {getFieldDecorator('businessTermStart', {
                  ...businessTermStart,
                  rules: [
                    {
                      validator: (rule, value, callback) =>
                        QMMethod.validatorMinAndMax(
                          rule,
                          value ? value.format(Const.DAY_FORMAT) : '',
                          callback,
                          '????????????',
                          0,
                          20
                        )
                    }
                  ]
                })(
                  <DatePicker
                    format={Const.DAY_FORMAT}
                    onChange={(_date, dateString) =>
                      mergeInfo({
                        field: 'businessTermStart',
                        value: dateString
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="businessPeriodTo" />}
              >
                {getFieldDecorator('businessTermEnd', {
                  ...businessTermEnd,
                  rules: [
                    {
                      validator: (rule, value, callback) =>
                        QMMethod.validatorMinAndMax(
                          rule,
                          value ? value.format(Const.DAY_FORMAT) : '',
                          callback,
                          '????????????',
                          0,
                          20
                        )
                    }
                  ]
                })(
                  <DatePicker
                    format={Const.DAY_FORMAT}
                    onChange={(_date, dateString) =>
                      mergeInfo({
                        field: 'businessTermEnd',
                        value: dateString
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem
                required={true}
                {...newtailFormItemLayout}
                label={<FormattedMessage id="businessScope" />}
              >
                {getFieldDecorator('businessScope', {
                  initialValue: info.get('businessScope'),
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorTrimMinAndMax(
                          rule,
                          value,
                          callback,
                          '????????????',
                          1,
                          500
                        );
                      }
                    }
                  ]
                })(
                  <Input.TextArea
                    style={{ height: 100 }}
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'businessScope',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                required={true}
                {...formItemLayout}
                label={
                  <FormattedMessage id="electronicCopyOfBusinessLicense" />
                }
              >
                <PicBox>
                  <QMUpload
                    name="uploadFile"
                    style={styles.box}
                    fileList={businessLicence}
                    action={
                      Const.HOST +
                      '/store/uploadStoreResource?resourceType=IMAGE'
                    }
                    listType="picture-card"
                    accept={'.jpg,.jpeg,.png,.gif'}
                    onChange={(info) =>
                      this._editImages(info, 'businessLicence')
                    }
                    beforeUpload={this._checkUploadFile}
                  >
                    {businessLicence.length < 1 && (
                      <Icon type="plus" style={styles.plus} />
                    )}
                  </QMUpload>
                  {getFieldDecorator('businessLicence', {
                    initialValue: businessLicenceImg,
                    rules: [{ required: true, message: '?????????????????????' }]
                  })(<Input type="hidden" />)}
                  <Popover content={content}>
                    <ExamplePic>
                      <img src={post} alt="" width="100%" />
                      <p>??????</p>
                    </ExamplePic>
                  </Popover>
                </PicBox>
                <p>??????jpg???jpeg???gif???png??????????????????2M???????????????1???</p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="corporateIdentityCard" />}
              >
                <PicBox>
                  <QMUpload
                    name="uploadFile"
                    style={styles.box}
                    fileList={frontIDCard}
                    action={
                      Const.HOST +
                      '/store/uploadStoreResource?resourceType=IMAGE'
                    }
                    listType="picture-card"
                    accept={'.jpg,.jpeg,.png,.gif'}
                    onChange={(info) => this._editImages(info, 'frontIDCard')}
                    beforeUpload={this._checkUploadFile}
                  >
                    {frontIDCard.length < 1 && (
                      <Icon type="plus" style={styles.plus} />
                    )}
                  </QMUpload>
                  <Popover content={person}>
                    <ExamplePic>
                      <img src={front} alt="" width="100%" />
                      <p>????????????</p>
                    </ExamplePic>
                  </Popover>
                  <QMUpload
                    style={styles.box}
                    name="uploadFile"
                    fileList={backIDCard}
                    action={
                      Const.HOST +
                      '/store/uploadStoreResource?resourceType=IMAGE'
                    }
                    listType="picture-card"
                    accept={'.jpg,.jpeg,.png,.gif'}
                    onChange={(info) => this._editImages(info, 'backIDCard')}
                    beforeUpload={this._checkUploadFile}
                  >
                    {backIDCard.length < 1 && (
                      <Icon type="plus" style={styles.plus} />
                    )}
                  </QMUpload>
                  <Popover content={personback}>
                    <ExamplePic>
                      <img src={back} alt="" width="100%" />
                      <p>????????????</p>
                    </ExamplePic>
                  </Popover>
                </PicBox>
                <p>
                  ??????????????????????????????????????????jpg???jpeg???gif???png??????????????????2M????????????
                  ???2???
                </p>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={this._next}>
                  ?????????
                </Button>
                <Button style={{ marginLeft: 10 }} onClick={this._prev}>
                  ?????????
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  /**
   * ?????????
   */
  _next = () => {
    const { saveCompanyInfo, company } = this.props.relaxProps;
    const form = this.props.form;
    form.validateFields(null, (errs) => {
      //?????????????????????????????????????????????????????????
      if (
        form.getFieldValue('businessTermStart') &&
        form.getFieldValue('businessTermEnd') &&
        !form
          .getFieldValue('businessTermStart')
          .isBefore(form.getFieldValue('businessTermEnd'))
      ) {
        form.resetFields(['businessTermEnd']);
        let errorObject = {};
        errorObject['businessTermEnd'] = {
          //value: form.getFieldValue('businessTermEnd').format(Const.DAY_FORMAT),
          errors: [new Error('?????????????????????????????????')]
        };
        form.setFields(errorObject);
        this.setState({});
      } else {
        //??????????????????
        if (!errs) {
          saveCompanyInfo(company.get('info'));
        } else {
          this.setState({});
        }
      }
    });
  };

  /**
   * ?????????
   */
  _prev = () => {
    const { setCurrentStep } = this.props.relaxProps;
    setCurrentStep(0);
  };

  /**
   * ????????????
   */
  _editImages = (info, field) => {
    const { file, fileList } = info;
    const { mergeInfo } = this.props.relaxProps;
    const status = file.status;
    if (status !== 'uploading') {
      if (__DEV__) {
      }
    }
    if (status === 'done') {
      message.success(`${file.name} ???????????????`);
    } else if (status === 'error') {
      message.error(`${file.name} ???????????????`);
    }
    if (field == 'businessLicence') {
      this.props.form.setFieldsValue({
        businessLicence: fileList
      });
    }
    mergeInfo({ field, value: JSON.stringify(fileList) });
  };

  /**
   * ??????????????????
   */
  _checkUploadFile = (file, fileList) => {
    if (fileList.length > 1) {
      message.error('????????????????????????');
      return false;
    }
    let fileName = file.name.toLowerCase();
    // ????????????????????????jpg???jpeg???png???gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= Const.fileSize.TWO) {
        return true;
      } else {
        message.error('????????????????????????2M');
        return false;
      }
    } else {
      message.error('??????????????????');
      return false;
    }
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
