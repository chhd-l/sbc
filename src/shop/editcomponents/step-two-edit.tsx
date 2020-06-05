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
      editCompanyInfo: Function;
    };
  };

  static relaxProps = {
    // 商家
    company: 'company',

    // 设置当前页
    setCurrentStep: noop,
    // 修改工商信息
    mergeInfo: noop,
    // 保存工商信息
    editCompanyInfo: noop
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
                label={<FormattedMessage id="logIn" />}
              >
                {getFieldDecorator('socialCreditCode', {
                  initialValue: info.get('socialCreditCode'),
                  rules: [
                    { required: true, message: '请填写统一社会信用代码' },
                    {
                      pattern: ValidConst.socialCreditCode,
                      message: '请填写正确的统一社会信用代码且必须15-20字符'
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
                label={<FormattedMessage id="UserinfoURL" />}
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
                          '企业名称',
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
                label={<FormattedMessage id="clientID" />}
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
                          '住所',
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
                label={<FormattedMessage id="issuer" />}
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
                          '法定代表人',
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
                label={<FormattedMessage id="pedirectURL" />}
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
                          '法定代表人',
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
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="registration" />}
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
                          '成立日期',
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
                label={<FormattedMessage id="registerPrefix" />}
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
                          '营业期限',
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
                label={<FormattedMessage id="registerCallback" />}
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
                          '营业期限',
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
            <Col span={12}>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={this._next}>
                  <FormattedMessage id="save" />
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  /**
   * 保存
   */
  _next = () => {
    const { editCompanyInfo, company } = this.props.relaxProps;
    const form = this.props.form;
    form.validateFields(null, (errs) => {
      //时间都填了且截至时间小于或等于起始时间
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
          errors: [new Error('不可早于或等于开始日期')]
        };
        form.setFields(errorObject);
        this.setState({});
      } else {
        //如果校验通过
        if (!errs) {
          editCompanyInfo(company.get('info'));
        } else {
          this.setState({});
        }
      }
    });
  };

  /**
   * 改变图片
   */
  _editImages = (info, field) => {
    const { file, fileList } = info;
    const { mergeInfo } = this.props.relaxProps;
    const status = file.status;
    if (status !== 'uploading') {
      if (__DEV__) {
        console.log(file, fileList);
      }
    }
    if (status === 'done') {
      message.success(`${file.name} 上传成功！`);
    } else if (status === 'error') {
      message.error(`${file.name} 上传失败！`);
    }
    if (field == 'businessLicence') {
      this.props.form.setFieldsValue({
        businessLicence: fileList
      });
    }
    mergeInfo({ field, value: JSON.stringify(fileList) });
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file, fileList) => {
    if (fileList.length > 1) {
      message.error('只能上传一张图片');
      return false;
    }
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= Const.fileSize.TWO) {
        return true;
      } else {
        message.error('文件大小不能超过2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
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
