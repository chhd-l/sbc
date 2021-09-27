import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Row, Col, Spin, Select, DatePicker, Upload, message, Icon } from 'antd';
import { checkCompanyInfoExists, saveLegalInfo, cityList } from "../webapi";
import DebounceSelect from './debounceSelect';
import moment from 'moment';
import { Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const FILE_MAX_SIZE = 2 * 1024 * 1024;

const FormItem = Form.Item;
const { Option } = Select;
const { Dragger } = Upload;
 function Step2({ setStep, userInfo, legalInfo={} ,form,sourceStoreId,sourceCompanyInfoId}) {
  const [loading, setLoading] = useState(false);
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [idCardImg, setIdCardImg] = useState('');
  const [idCardFileList, setIdCardFileList] = useState([]);
  const {getFieldDecorator}=form

  useEffect(() => {
    if (legalInfo.idCardImg) {
      setIdCardImg(legalInfo.idCardImg);
    }
  }, []);
 
  const toNext = async (e) => {
    e.preventDefault();
   
    form.validateFields(async(errs, values) => {
      if (idCardImg === '') {
        message.error('Please upload your password or identity card picture');
        return;
      }
      console.log('yyyy', values);
      // return
      if (!errs) {
        setLoading(true)
  checkCompanyInfoExists({
      legalCompanyName: values.legalCompanyName,
      commerceNumber: values.commerceNumber,
      storeName: '',
      storeId: userInfo.storeId,
      companyInfoId: userInfo.companyInfoId
    }).then(({res}) => {
      if (!res.context.legalCompanyNameExists && !res.context.commerceNumber) {
        saveLegalInfo({
          email: userInfo.accountName,
          storeId: userInfo.storeId,
          companyInfoId: userInfo.companyInfoId,
          sourceStoreId: sourceStoreId,
          idCardImg: idCardImg,
          ...values,
          legalCityId: values.legalCityId.key,
          legalCityName: values.legalCityId.label,
          contactCityId: values.contactCityId.key,
          contactCityName: values.contactCityId.label,
          birthday: values.birthday ? values.birthday.format(Const.DAY_FORMAT) : ''
        }).then(res => {
          setStep(2)
        }).catch(err => {
          setLoading(false)
        })
      } else {
        let errorArray = {}
        if (res.context.legalCompanyNameExists) {
          errorArray.legalCompanyName = { value: values.legalCompanyName, errors: [new Error('Legal company name is repeated')] }
        }
        if (res.context.commerceNumberExists) {
          errorArray.commerceNumber = { value: values.commerceNumber, errors: [new Error('Chamber of Commerce number is repeated')] }
        }
        form.setFields(errorArray)
      }
      setLoading(false)
    })
  }
  })
  };

  const uploadProps = {
    headers:{
      Accept: 'application/json',
      Authorization: 'Bearer ' + (window.token || sessionStorage.getItem('storeToken')),
    },
    name: 'uploadFile',
    fileList:idCardFileList,
    accept:'.jpg,.jpeg,.png,.gif',
    action: `${Const.HOST}/store/uploadStoreResource?resourceType=IMAGE`,
    onChange: (info) => {
      console.log(info)
      const { file } = info;
      if(file.status !== 'removed'){
        setIdCardFileList([file])
      }
      if (file.status === 'done') {
        if(
            file.status == 'done' &&
            file.response &&
            file.response.code &&
            file.response.code !== 'K-000000'
        ){
          message.error(info.file.response.message);
        }else{
          setIdCardImg(file.response.length > 0 && file.response[0])
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: (file)=>{
      let fileName = file.name.toLowerCase();
      // 支持的图片格式：jpg、jpeg、png、gif
      if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
        if (file.size <= FILE_MAX_SIZE) {
          return true;
        } else {
          message.error('file size cannot exceed 2M');
          return false;
        }
      } else {
        message.error('file format error');
        return false;
      }
    },
    onRemove: (promise)=>{
      console.log(promise)
      setIdCardImg('')
      setIdCardFileList([])
    }
  };

  const onChangePhoneNumber = (e) => {
    if (e && !e.target.value.startsWith('+31')) {
      const temp = e.target.value;
      setTimeout(() => {
        form.setFieldsValue({
          'contactPhone': `+31${temp.replace(/^[+|+3|+31]/, '')}`
        });
      });
    }
  };

  async function fetchUserList(cityName) {
    return cityList({cityName,storeId:123457915}).then(({res})=>{
      return res.context.systemCityVO
    })
  }

  return (
    <div>
      <div className="vmargin-level-4 align-item-center word big">2 / 5  Fill in legal information and contact person</div>
      <div style={{ width: 800, margin: '20px auto' }}>
        <Form layout="vertical" onSubmit={toNext}>
          <Row gutter={[24, 12]}>
            {/* <Col span={12}>
              <FormItem label="Trader category code (MCC)" name="tradeCategoryCode">
                {getFieldDecorator('tradeCategoryCode', {
                  rules: [{ required: true, message: 'Trader category code (MCC)' }],
                 initialValue: legalInfo?.tradeCategoryCode??''
                })(<Input size="large" placeholder='Trader category code (MCC)' />)}
              </FormItem>

            </Col> */}
            <Col span={12}>
              <FormItem label="Type of business">
                {getFieldDecorator('typeOfBusiness', {
                  rules: [{ required: true, message: 'Please input Type of business!' }],
                 initialValue: legalInfo?.typeOfBusiness??1
                })(
                  <Select size="large">
                    <Option value={1}>Business</Option>
                    <Option value={0}>Individual</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          {form.getFieldValue('typeOfBusiness') === 1 && <Row gutter={[24, 12]}>
            <Col span={24}>
              <div className="word big">Legal information</div>
            </Col>
            <Col span={12}>
              <FormItem label="Legal company name">
                {getFieldDecorator('legalCompanyName', {
                  rules: [{ required: true, message: 'Please input Legal company name!' }],
                 initialValue: legalInfo?.legalCompanyName??''
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Chamber of Commerce number">
                   {getFieldDecorator('commerceNumber', {
                  rules:[{ required: true, message: 'Please input Chamber of Commerce number!' }],
                 initialValue: legalInfo?.commerceNumber??''
                })( <Input size="large"/>)}
               
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Email">
                {getFieldDecorator('contactEmail', {
                  rules:[
                    { required: true, message: 'Please input your Email!' },
                    { type: 'email', message: <FormattedMessage id="Login.email_address_vld1" /> }
                  ],
                  initialValue: legalInfo?.contactEmail??userInfo.accountName
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Phone number">
                {getFieldDecorator('contactPhone', {
                  rules:[
                    { pattern: /^\+31[0-9]{9}$/, message: 'Please input the right format: +31xxxxxxxxx' }
                  ],
                  initialValue: legalInfo?.contactPhone??''
                })(
                  <Input size="large" maxLength={12} onChange={onChangePhoneNumber} />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Zip code">
                {getFieldDecorator('legalPostcode', {
                  rules:[
                    { required: true, message: 'Please input zip code' }
                  ],
                  initialValue: legalInfo?.legalPostcode??''
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="City" name="cityId">
                {getFieldDecorator('legalCityId', {
                  rules: [
                    { required: true, message: 'Please select city' }
                  ],
                  initialValue: {key:'',label:''}
                })(
                  <DebounceSelect
                    size="large"
                    placeholder="Select users"
                    fetchOptions={fetchUserList}
                    defaultOptions={defaultOptions}
                    style={{
                      width: '100%',
                    }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Street">
                {getFieldDecorator('legalStreet', {
                  rules:[{ required: true, message: 'Please input street' }],
                 initialValue: legalInfo?.legalStreet??''
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="House number">
                {getFieldDecorator('legalHouseNumber', {
                  rules:[{ required: true, message: 'Please input house number' }],
                 initialValue: legalInfo?.legalHouseNumber??''
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
          </Row>}
          <Row gutter={[24, 12]}>
            <Col span={24}>
              <div className="word big">Contact person</div>
            </Col>
            <Col span={24}>
              <div style={{width:240,margin:'20px 0',height:140}}>
                <Dragger {...uploadProps}>
                  {
                    idCardImg ? <img
                        src={idCardImg}
                        width={90+'px'}
                        height={90+'px'}
                    /> : (
                        <>
                          <p className="ant-upload-drag-icon">
                            <Icon type="cloud-upload" className="word primary size24"/>
                          </p>
                          <p className="ant-upload-hint">
                            Upload passport/identity card picture
                          </p>
                        </>
                    )
                  }
                </Dragger>
              </div>
            </Col>
            <Col span={12}>
              <FormItem label="First name">
                {getFieldDecorator('firstName', {
                  rules:[{ required: true, message: 'Please input First name!' }],
                 initialValue: legalInfo?.firstName??''
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Last name">
                {getFieldDecorator('lastName', {
                  rules:[{ required: true, message: 'Please input Last name!' }],
                  initialValue: legalInfo?.lastName??''
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Zip code">
                {getFieldDecorator('contactPostcode', {
                  rules:[
                    { required: true, message: 'Please input zip code' }
                  ],
                  initialValue: legalInfo?.contactPostcode??''
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="City" name="cityId">
                {getFieldDecorator('contactCityId', {
                  rules: [
                    { required: true, message: 'Please select city' }
                  ],
                  initialValue: {key:'',label:''}
                })(
                  <DebounceSelect
                    size="large"
                    placeholder="Select users"
                    fetchOptions={fetchUserList}
                    defaultOptions={defaultOptions}
                    style={{
                      width: '100%',
                    }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Street">
                {getFieldDecorator('contactStreet', {
                  rules:[{ required: true, message: 'Please input street' }],
                 initialValue: legalInfo?.contactStreet??''
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="House number">
                {getFieldDecorator('contactHouseNumber', {
                  rules:[{ required: true, message: 'Please input house number' }],
                 initialValue: legalInfo?.contactHouseNumber??''
                })(<Input size="large"/>)}
              </FormItem>
            </Col>
            {form.getFieldValue('typeOfBusiness') === 0 && <>
              <Col span={12}>
                <FormItem label="Email">
                  {getFieldDecorator('contactEmail', {
                    rules:[
                      { required: true, message: 'Please input your Email!' },
                      { type: 'email', message: <FormattedMessage id="Login.email_address_vld1" /> }
                    ],
                    initialValue: legalInfo?.contactEmail??userInfo.accountName
                  })(<Input size="large"/>)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="Phone number">
                  {getFieldDecorator('contactPhone', {
                    rules:[
                      { pattern: /^\+31[0-9]{9}$/, message: 'Please input the right format: +31xxxxxxxxx' }
                    ],
                    initialValue: legalInfo?.contactPhone??''
                  })(
                    <Input size="large" maxLength={12} onChange={onChangePhoneNumber} />
                  )}
                </FormItem>
              </Col>
            </>}
            <Col span={12}>
              <FormItem label="Birthday">
                {getFieldDecorator('birthday', {
                  rules:[{ required: true, message: 'Please select birth day' }],
                 initialValue: null
                })(
                  <DatePicker size="large" format="YYYY-MM-DD" style={{width:'100%'}} disabledDate={(current) => current && current > moment().startOf('day')} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={[24, 12]}>
            <Col span={24} className="align-item-right" style={{textAlign:"center"}}>
              <Button size="large" onClick={() => setStep(0)}>Back</Button>
              <Button loading={loading} size="large" style={{marginLeft:20}} type="primary" htmlType="submit">Next</Button>
            </Col>
           
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default Form.create()(Step2);