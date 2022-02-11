import React, {useEffect, useState} from 'react';
import {Upload, Form, Button, Row, Col, Input, Select, Radio, message, Icon} from 'antd';
import {checkCompanyInfoExists, cityList, saveStoreDetail, getCountryList, checkCountryInfoExists} from "../webapi";
import DebounceSelect from './debounceSelect'
import { Const } from 'qmkit';

const { Dragger } = Upload;
const FormItem = Form.Item;
const Option = Select.Option;

const FILE_MAX_SIZE = 2 * 1024 * 1024;

function Step3({ setStep,userInfo,store=null,form,sourceStoreId,sourceCompanyInfoId }) {
  const { getFieldDecorator } = form;
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [faviconUrl, setFavicon] = useState('');
  const [defaultOptions, setDefaultOptions] = useState([]);

  const [logoFileList,setLogoFileList] = useState([])
  const [iconFileList,setIconFileList] = useState([])

  const [countryList, setCountryList] = useState([])

  useEffect(()=>{
    if(store){
      form.setFieldsValue({
        ...store,
        cityId:store.cityId ? {value: store.cityId, label: store?.cityName, key: store.cityId} : ''
      })
      if(store.cityId){
        setDefaultOptions([{
          id: store.cityId,
          cityName: store?.cityName
        }])
      }
      if(store.storeLogo) {
        setImgUrl(store.storeLogo)
      }
      if(store.storeSign) {
        setFavicon(store.storeSign)
      }
    }

  },[store])

  useEffect(() => {
    if (Const.SITE_NAME !== 'MYVETRECO') {
      getCountryList().then(list => setCountryList(list));
    }
  }, []);

  const isRepeatCountry = async (params) => {
    let flag;
    try {
      const {res} = await checkCountryInfoExists(params);
      flag = res.context?.countryExists;
    } catch(e) {
      flag = 'error';
    }
    return flag;
  }

  const isRepeatCompanyInfo = async (params) => {
    let flag;
    try {
      const {res} = await checkCompanyInfoExists(params);
      flag = res.context?.storeNameExists;
    } catch(e) {
      flag = 'error';
    }
    return flag;
  }

  const toNext = async (e)=>{
    e.preventDefault();
    // if(!imgUrl){
    //   message.warn('Please upload logo')
    //   return
    // }
    form.validateFields(async (err, values) => {
      console.log(values)
      if (!err) {
        setLoading(true);

        // 检查 storeName 是否重复
        const isRepeatCompanyInfoFlag = await isRepeatCompanyInfo({
          storeName:values.storeName,
          storeId:userInfo?.storeId,
          companyInfoId: userInfo?.companyInfoId
        });

        if (isRepeatCompanyInfoFlag) {
          isRepeatCompanyInfoFlag === true && form.setFields({storeName:{value: values.storeName,errors:[new Error('Store name number is repeated')]}});
          setLoading(false);
          return;
        }

        // 检查 countryCode 是否重复
        if (Const.SITE_NAME !== 'MYVETRECO') {
          const isRepeatCountryFlag = await isRepeatCountry({
            countryCode: values.countryCode,
            storeId: userInfo?.storeId,
            companyInfoId: userInfo?.companyInfoId,
          })

          if (isRepeatCountryFlag) {
            isRepeatCountryFlag === true && form.setFields({countryCode: { value: values.countryCode, errors: [new Error('Country is repeated')] }});
            setLoading(false);
            return;
          }
        }

        saveStoreDetail({
          email: userInfo?.accountName,
          storeId: userInfo?.storeId,
          storeLogo:imgUrl,
          currentCompanyInfoId: userInfo?.companyInfoId,
          currentStoreId: userInfo?.storeId,
          sourceCompanyInfoId: sourceCompanyInfoId,
          sourceStoreId: sourceStoreId,
          storeSign:faviconUrl,
          ...values,
          cityId:values.cityId.key,
          cityName:values.cityId.label,
          introductionHtml:values.introduction // ? encodeURIComponent(SplicingHtml(values.introduction)) : ''
        }).then(({res,err})=>{
          if(err){
            setLoading(false)
          }else {
            setStep(Const.SITE_NAME === 'MYVETRECO' ? 3 : 5)   //FGS去掉第4、5步
            setLoading(false)
          }
        });
      }
    });


  }
  /**
   * 上传logo
   * @type {{headers: {Authorization: string, Accept: string}, onChange: uploadProps.onChange, name: string, action: string, maxCount: number}}
   */
  const uploadProps = {
    headers:{
      Accept: 'application/json',
      Authorization: 'Bearer ' + (window.token || sessionStorage.getItem('storeToken')),
    },
    name: 'uploadFile',
    fileList:logoFileList,
    accept:'.jpg,.jpeg,.png,.gif',
    action: `${Const.HOST}/store/uploadStoreResource?resourceType=IMAGE`,
    onChange: (info) => {
      console.log(info)
      const { file } = info;
      if(file.status !== 'removed'){
        setLogoFileList([file])
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
          setImgUrl(file.response.length > 0 && file.response[0])
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
      setImgUrl('')
      setLogoFileList([])
    }
  };

  /**
   * 上传logo
   * @type {{headers: {Authorization: string, Accept: string}, onChange: uploadProps.onChange, name: string, action: string, maxCount: number}}
   */
  const uploadIconProps = {
    headers:{
      Accept: 'application/json',
      Authorization: 'Bearer ' + (window.token || sessionStorage.getItem('storeToken')),
    },
    name: 'uploadFile',
    fileList:iconFileList,
    accept:'.ico',
    action: `${Const.HOST}/store/uploadStoreResource?resourceType=IMAGE`,
    onChange: (info) => {
      console.log(info)
      const { file } = info;
      if(file.status !== 'removed'){
        setIconFileList([file])
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
          setFavicon(file.response.length > 0 && file.response[0])
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: (file)=>{
      let fileName = file.name.toLowerCase();
      // 支持的图片格式：jpg、jpeg、png、gif
      if (fileName.endsWith('.ico')) {
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
      setFavicon('')
      setIconFileList([])
    }
  };
  async function fetchUserList(cityName) {
    return cityList({cityName,storeId:123457915}).then(({res})=>{
      return res.context.systemCityVO
    })
  }

  const validatePostCode = (rules, value, callback) => {
    if (value === '') {
      callback();
    } else if (Const.SITE_NAME === 'MYVETRECO' && !/^[0-9]{4}\s[A-Za-z]{2}$/.test(value)) {
      callback('Enter a valid postcode, example: 1234 AB');
    } else if (!/^[0-9A-Za-z\s]{3,10}$/.test(value)) {
      callback('Please enter a valid postcode');
    } else {
      callback();
    }
  };


  const SplicingHtml = (val)=>{
    return `<div style="border-color: inherit"> <div class="text-center max-w-6xl m-auto px-2 hidden" style="border-color: inherit" > <h1 class="text-32px pt-12 pb-9">Important Notice</h1> <p class="text-lg"> Due to an increase in demand, you preferred product may be currently unavailable. <br /> Yor pet's health is our top priority, and were working hard to ensure their formulas are Hack in stock soon. <br /> Thank you for your patience </p> <p class="py-10 text-lg" style="border-color: inherit"><i class="icon iconfont text-4xl font-medium">&#xe61b;</i> <span class="px-1 lg:px-5"> 30% off first purchase + 5% off every autoship order </span> <button class="rounded-full py-1 px-5 border-solid border-2 mt-2" style="border-color: inherit" ><a href="/subscription-landing"> Join the Autoship </a></button> </p> </div> <div class="bg-gray-100 h-2 hidden"></div> <div class="max-w-6xl m-auto grid grid-cols-12 flex items-center text-center lg:text-left pt-8 pb-6"> <div class="col-span-12 lg:col-span-9"> <h6 class="text-32px pb-7">Introduction</h6> <p class="pr-2 lg:pr-60 pl-2 lg:pl-0 text-lg pb-8 text-gary-999"> ${val} </p> <img src="/aboutus/shop_logo.png" alt="" /> </div> <div class="col-span-12 lg:col-span-3"> <img class="inline-block" src="/aboutus/cat.png" alt="" /> </div> </div> </div>`
  }
  return (
    <div>
      <div className="vmargin-level-4 align-item-center word big">3 / {Const.SITE_NAME === 'MYVETRECO' ? '5' : '3'} Tell us more about your store</div>

      <div style={{width:800,margin:'0 auto'}}>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <div style={{width:240,margin:'20px auto',height:140}}>
              <Dragger {...uploadProps}>
                {
                  imgUrl ? <img
                      src={imgUrl}
                      width={90+'px'}
                      height={90+'px'}
                  /> : (
                      <>
                        <p className="ant-upload-drag-icon">
                          <Icon type="cloud-upload" className="word primary size24"/>
                        </p>
                        <p className="ant-upload-hint">
                          Upload the Shop logo<br/>
                          (recommended size 48px * 48px)
                        </p>
                      </>
                  )
                }
              </Dragger>
            </div>
          </Col>
          <Col span={12}>
            <div style={{width:240,margin:'20px auto',height:140}}>
              <Dragger {...uploadIconProps}>
                {
                  faviconUrl ? <img
                    src={faviconUrl}
                    width={90}
                    height={90}
                  /> : (
                    <>
                      <p className="ant-upload-drag-icon">
                        <Icon type="cloud-upload" className="word primary size24"/>
                      </p>
                      <p className="ant-upload-hint">Upload the Shop favicon</p>
                    </>
                  )
                }
              </Dragger>
            </div>
          </Col>
        </Row>
      </div>


      <div style={{width:800,margin:'20px auto'}}>
        <Form layout="vertical" onSubmit={toNext}>
          <Row gutter={[24,12]}>
            <Col span={12}>
              <FormItem label="Store name" name="storeName">
                {getFieldDecorator('storeName', {
                  rules: [{ required: true, message: 'Please input Store name!' }],
                  initialValue: ''
                })(
                  <Input size="large"
                         onChange={(e)=>{
                           if(Const.SITE_NAME === 'MYVETRECO'){
                             let value = e.target.value.replace(/[^\w]/ig,'').substring(0,50).toLowerCase();
                             const postfix = window.location.host.match(/\.\w+$/) ? window.location.host.match(/\.\w+$/)[0] : '';
                             form.setFieldsValue({domainName:'https://'+value+'.myvetreco'+postfix});
                           }
                          }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Store domain" name="domainName">
                {getFieldDecorator('domainName', {
                  initialValue: ''
                })(
                  <Input size="large" disabled={Const.SITE_NAME === 'MYVETRECO'}/>
                )}
              </FormItem>
            </Col>
            <Col span={24} style={{display:Const.SITE_NAME === 'MYVETRECO'?'block':'none'}}>
              <FormItem label="Sell to clinic" name="sellToClinic">
                {getFieldDecorator('sellToClinic', {
                  rules: [{ required: Const.SITE_NAME === 'MYVETRECO', message: 'Please input Sell to clinic!' }],
                  initialValue: ''
                })(
                  <Input size="large" />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="Store address 1" name="addressDetail">
                {getFieldDecorator('addressDetail', {
                  initialValue: ''
                })(
                  <Input size="large" />
                )}
              </FormItem>
            </Col>
            <Col span={12} style={{display:Const.SITE_NAME === 'MYVETRECO'?'none':'block'}}>
              <FormItem label="Country" name="countryCode">
                {getFieldDecorator('countryCode', {
                  rules: [{ required: Const.SITE_NAME !== 'MYVETRECO', message: 'Please select a country' }],
                  initialValue: ''
                })(
                  <Select showSearch size="large">
                    {countryList.map((op, idx) => (
                      <Option key={idx} value={op.countryCode}>{op.countryName}</Option>
                    ))}
                  </Select>
                )}
              </FormItem> 
            </Col>
            <Col span={12}>
              <FormItem label="Postcode" name="postcode">
                {getFieldDecorator('postcode', {
                  rules: [{ validator: validatePostCode }],
                  initialValue: ''
                })(
                  <Input size="large" />
                )}
              </FormItem>
            </Col>
            <Col span={12} style={{display:Const.SITE_NAME === 'MYVETRECO'?'block':'none'}}>
              <FormItem label="City" name="cityId">
                {getFieldDecorator('cityId', {
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
            <Col span={24} style={{display:Const.SITE_NAME === 'MYVETRECO'?'block':'none'}}>
              <FormItem label="Introduction" name="introduction">
                {getFieldDecorator('introduction', {
                  initialValue: ''
                })(<Input.TextArea size="large" />)}
              </FormItem>
            </Col>
            <Col span={24} style={{display:'none'}}>
              <div className='flex'>
                <span>
                  <span className='form-require'>Order audit setting</span>
                </span>
                <FormItem name="auditSetting" style={{marginBottom:0}}>
                  {getFieldDecorator('auditSetting', {
                    rules: [{ required: true, message: 'Please choose Order audit setting!' }],
                    initialValue: 1
                  })(
                    <Radio.Group className="hmargin-level-4">
                      <Radio value={1}>Auto audit</Radio>
                      <Radio value={0}>Manual audit</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </div>
              <div className="flex word small" style={{color:'red'}}>
                <span className="flex-item">Instructions:</span>
                <div className="flex-item flex-main hpadding-level-2">
                  <div>Auto audit: Orders do not need to audit by clinic after payment successfully by PO</div>
                  <div>Manual audit: Orders need to audit by clinic after payment successfully by PO</div>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={[24,12]}>
            <Col span={12} className="align-item-right">
              <Button size="large" onClick={() => setStep(1)}>Back</Button>
            </Col>
            <Col span={12}>
              <FormItem>
                <Button loading={loading} size="large" type="primary" htmlType="submit">Next</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
export default Form.create()(Step3);
