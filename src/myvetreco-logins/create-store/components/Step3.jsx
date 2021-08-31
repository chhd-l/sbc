import React, {useEffect, useState} from 'react';
import {Upload, Form, Button, Row, Col, Input, Radio, message, Image} from 'antd';
import {checkCompanyInfoExists, cityList, saveStoreDetail} from "../webapi";
import DebounceSelect from './debounceSelect'

const { Dragger } = Upload;
const FormItem = Form.Item;

const FILE_MAX_SIZE = 2 * 1024 * 1024;

export default function Step3({ setStep,userInfo,store={} }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [faviconUrl, setFavicon] = useState('');
  const [defaultOptions, setDefaultOptions] = useState([]);

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

  const toNext = async (values)=>{
    if(!imgUrl){
      message.warn('Please upload logo')
      return
    }
    setLoading(true)
    checkCompanyInfoExists({
      storeName:values.storeName,
      storeId:userInfo?.storeId,
      companyInfoId: userInfo?.companyInfoId
    }).then(res=>{
      if(!res.context.storeNameExists){
        saveStoreDetail({
          email: userInfo?.accountName,
          storeId: userInfo?.storeId,
          storeLogo:imgUrl,
          currentCompanyInfoId: userInfo?.companyInfoId,
          currentStoreId: userInfo?.storeId,
          sourceCompanyInfoId: 1062,
          sourceStoreId: 123457915,
          storeSign:faviconUrl,
          ...values,
          cityId:values.cityId.value,
          cityName:values.cityId.label,
        }).then(res=>{
          setStep(3)
        }).catch(err=>{
          setLoading(false)
        })
      }else {
        form.setFields([
          {name:'storeName',errors:['Store name number is repeated']}
        ])
      }
      setLoading(false)
    })

  }
  /**
   * 上传logo
   * @type {{headers: {Authorization: string, Accept: string}, onChange: uploadProps.onChange, name: string, action: string, maxCount: number}}
   */
  const uploadProps = {
    headers:{
      Accept: 'application/json',
      Authorization: 'Bearer ' + (sessionStorage.getItem('token') || sessionStorage.getItem('storeToken')),
    },
    name: 'uploadFile',
    maxCount:1,
    accept:'.jpg,.jpeg,.png,.gif',
    action: `${process.env.REACT_APP_HOST}/store/uploadStoreResource?storeId=${userInfo?.storeId}&companyInfoId=${userInfo?.companyInfoId}&resourceType=IMAGE`,
    onChange: (info) => {
      console.log(info)
      const { file } = info;
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
          message.error('文件大小不能超过2M');
          return false;
        }
      } else {
        message.error('文件格式错误');
        return false;
      }
    },
    onRemove: ()=>{
      setImgUrl('')
    }
  };

  /**
   * 上传logo
   * @type {{headers: {Authorization: string, Accept: string}, onChange: uploadProps.onChange, name: string, action: string, maxCount: number}}
   */
  const uploadIconProps = {
    headers:{
      Accept: 'application/json',
      Authorization: 'Bearer ' + (sessionStorage.getItem('token') || sessionStorage.getItem('storeToken')),
    },
    name: 'uploadFile',
    maxCount:1,
    accept:'.ico',
    action: `${process.env.REACT_APP_HOST}/store/uploadStoreResource?storeId=${userInfo?.storeId}&companyInfoId=${userInfo?.companyInfoId}&resourceType=IMAGE`,
    onChange: (info) => {
      console.log(info)
      const { file } = info;
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
          message.error('文件大小不能超过2M');
          return false;
        }
      } else {
        message.error('文件格式错误');
        return false;
      }
    },
    onRemove: ()=>{
      setFavicon('')
    }
  };
  async function fetchUserList(cityName) {
    return cityList({cityName,storeId:123457915}).then(res=>{
      return res.context.systemCityVO
    })
  }
  return (
    <div>
      <div className="vmargin-level-4 align-item-center word big">3 / 5 Tell us more about your store</div>

      <div style={{width:800,margin:'0 auto'}}>
        <Row gutter={[24,12]}>
          <Col span={12}>
            <div style={{width:200,margin:'20px auto',height:120}}>
              <Dragger {...uploadProps}>
                {
                  imgUrl ? <img
                      src={imgUrl}
                      width={90+'px'}
                      height={90+'px'}
                      preview={false}
                  /> : (
                      <>
                        <p className="ant-upload-drag-icon">
                          <Icon type="cloud" className="word primary size24"/>
                        </p>
                        <p className="ant-upload-hint">Upload the Shop logo</p>
                      </>
                  )
                }
              </Dragger>
            </div>
          </Col>
          <Col span={12}>
            <div style={{width:200,margin:'20px auto',height:120}}>
              <Dragger {...uploadIconProps}>
                <p className="ant-upload-drag-icon">
                <Icon type="cloud" className="word primary size24"/>
                </p>
                <p className="ant-upload-hint">Upload the Shop favicon</p>
              </Dragger>
            </div>
          </Col>
        </Row>
      </div>


      <div style={{width:800,margin:'20px auto'}}>
        <Form layout="vertical" onFinish={toNext} form={form}>
          <Row gutter={[24,12]}>
            <Col span={12}>
              <FormItem label="Store name" name="storeName"
                        rules={[{ required: true, message: 'Please input Store name!' }]}>
                <Input size="large" onChange={(e)=>{
                  let value = e.target.value.replace(/[^\w]/ig,'').substring(0,50)
                  form.setFieldsValue({domainName:'https://'+value+'.myvetreco.co'})
                }}/>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Store domain" name="domainName">
                <Input size="large" disabled/>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="Store address 1" name="addressDetail">
                <Input size="large" />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="City" name="cityId">
                <DebounceSelect
                    size="large"
                    placeholder="Select users"
                    fetchOptions={fetchUserList}
                    defaultOptions={defaultOptions}
                    style={{
                      width: '100%',
                    }}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Postcode" name="postcode">
                <Input size="large" />
              </FormItem>
            </Col>
            <Col span={24}>
              <div className='flex'>
                <span style={{lineHeight:'32px'}}>
                  <span className='form-require'>Order audit setting</span>
                </span>
                <FormItem name="auditSetting" initialValue={0}
                          rules={[{ required: true, message: 'Please choose Order audit setting!' }]}>
                  <Radio.Group className="hmargin-level-4">
                    <Radio value={0}>Auto audit</Radio>
                    <Radio value={1}>Manual audit</Radio>
                  </Radio.Group>
                </FormItem>
              </div>
            </Col>
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

