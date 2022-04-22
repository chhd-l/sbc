import React from 'react';
import { Form, Input, Select, Spin, Row, Col, Button, message, Tabs } from 'antd';
import { RCi18n, cache, Headline, Const, history } from 'qmkit';
import FileItem from '@/basic-setting/myvetreco/fileitem';
import DebounceSelect from '@/myvetreco-logins/create-store/components/debounceSelect';
import UserList from './user-list';
import * as webapi from '../webapi';
import { FormattedMessage } from 'react-intl';

import { FormComponentProps } from 'antd/es/form';

type TClinicType = {
  name: string;
  id: number;
  valueEn: string;
};

type TClinic = {
  id: string;
  prescriberId?: string;
  prescriberName?: string;
  prescriberType?: string;
  primaryCity?: string;
  primaryRegion?: string; //street name
  primaryDistrict?: string; //house number
  primaryZip?: string; //post code
  email?: string;
  phone?: string;
  operatingPeriod?: string;
  prescriberIntroduction?: string;
  headImg?: string;
};

type IState = {
  clinicTypeList: TClinicType[];
  clinic?: TClinic;
  loading: boolean;
  activeKey: string;
  isEdit: boolean;
};

interface IProps extends FormComponentProps {
  pageType: 'edit' | 'create';
  prescriberId?: string;
};

const FormItem = Form.Item;
const Option = Select.Option;
const fetchCityList = async (cityName) => {
  return webapi.queryCityListByName({
    cityName,
    storeId:123457915,
    pageSize: 1000,
    pageNum: 0
  }).then(({res})=>{
    return res.context.systemCityVO
  })
}

export default Form.create<IProps>()(class MyVetForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: false,
      clinicTypeList: [],
      clinic: null,
      activeKey: 'basic',
      isEdit: this.props.pageType === 'edit'
    }
  }

  componentDidMount(): void {
    this.queryClinicsDictionary();
    if (this.props.pageType === 'edit') {
      this.getDetail(this.props.prescriberId);
    }
  }

  onChangePhoneNumber = (e: any) => {
    const { form } = this.props;
    if (e && !e.target.value.startsWith('+31')) {
      const temp = e.target.value;
      setTimeout(() => {
        form.setFieldsValue({
          phone: `+31${temp.replace(/^[+|+3|+31]/, '')}`
        });
      });
    }
  };

  queryClinicsDictionary = async () => {
    const { res } = await webapi.queryClinicsDictionary({
      type: 'clinicType'
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.setState({
        clinicTypeList: res.context
      });
    }
  };

  getDetail = async (id: string) => {
    this.setState({ loading:true })
    const { res } = await webapi.getClinicById({
      id: id
    });
    if (res.code === Const.SUCCESS_CODE) {
      let defaultCity = { id: 1, cityName: res.context.primaryCity || '' };
      // if (res.context.primaryCity) {
      //   defaultCity = await webapi.queryCityListByName({
      //     cityName: res.context.primaryCity,
      //     storeId:123457915,
      //     pageSize: 1,
      //     pageNum: 0
      //   })
      //   .then(data => ({ id: data.res.context.systemCityVO?.[0]?.id ?? '', cityName: data.res.context.systemCityVO?.[0]?.cityName ?? '' }))
      //   .catch(() => ({ id: '', cityName: '' }));
      // }
      this.setState({
        clinic: res.context
      });
      this.props.form.setFieldsValue({
        ...res.context,
        cityId: {
          key: defaultCity.id,
          value: defaultCity.id,
          label: defaultCity.cityName
        },
        logo: res.context.headImg ? [{ uid: '-1', name: res.context.headImg, url: res.context.headImg, status: 'done' }] : []
      });
    }
    this.setState({ loading:false })
  };

  handleSave = () => {
    this.props.form.validateFields(null, (err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const handler = this.state.isEdit ? webapi.updateClinic : webapi.addClinic;
        handler({
          ...(this.state.clinic ?? {}),
          ...values,
          primaryCity: values.cityId.label,
          headImg: values.logo[0]['url']
        }).then(data => {
          if (data.res.code === Const.SUCCESS_CODE) {
            message.success(RCi18n({id:'Prescriber.OperateSuccessfully'}));
            this.setState({
              clinic: {
                id: data.res.context.id
              },
              isEdit: true,
              activeKey: 'users'
            });
          }
          this.setState({ loading: false });
        }).catch(() => {
          this.setState({ loading: false });
        });
      }
    });
  };

  changeTab = (key: string) => {
    this.setState({
      activeKey: key
    });
  };

  render() {
    const formItemLayout1 = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    };
    const formItemLayout2 = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };

    const { getFieldDecorator } = this.props.form;
    const clinicDomain = sessionStorage.getItem(cache.DOMAINNAME) || '';

    return (
      <Tabs activeKey={this.state.activeKey} onChange={this.changeTab}>
        <Tabs.TabPane tab={RCi18n({id:"PetOwner.BasicInformation"})} key="basic">
          <Spin spinning={this.state.loading}>
            <Headline title={this.state.isEdit ? <FormattedMessage id="Clinic.EditClinic"/> : <FormattedMessage id="Clinic.AddClinic"/>} />
            <Form layout="horizontal">
              <Row>
                <Col span={24}>
                  <FormItem label={<FormattedMessage id="Clinic.ClinicId"/>} {...formItemLayout1}>
                    {getFieldDecorator('prescriberId', {
                      rules: [{ required: true, message: RCi18n({id:'PetOwner.ThisFieldIsRequired'}) }]
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem label={<FormattedMessage id="Clinic.ClinicName"/>} {...formItemLayout1}>
                    {getFieldDecorator('prescriberName', {
                      rules: [{ required: true, message: RCi18n({id:'PetOwner.ThisFieldIsRequired'}) }]
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem label={<FormattedMessage id="Clinic.ClinicType"/>} {...formItemLayout1}>
                    {getFieldDecorator('prescriberType', {
                      rules: [{ required: true, message: RCi18n({id:'PetOwner.ThisFieldIsRequired'}) }]
                    })(
                      <Select>
                        {this.state.clinicTypeList.map((item) => (
                          <Option value={item.valueEn} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem label={<FormattedMessage id="Clinic.ClinicDomain"/>} {...formItemLayout1} required>
                    <Input disabled value={clinicDomain} />
                  </FormItem>
                </Col>
              </Row>
              <Row><Col span={4} offset={2} style={{fontSize:16}}><b>{<FormattedMessage id="Clinic.ClinicAddr"/>}</b></Col></Row>
              <Row>
                <Col span={12}>
                  <FormItem label={<FormattedMessage id="PetOwner.City"/>} {...formItemLayout2}>
                    {getFieldDecorator('cityId', {
                      rules: [
                        {
                          required: true,
                          validator: (rule, value, callback) => {
                            if (!value || !value.key) {
                              callback(RCi18n({id:"PetOwner.ThisFieldIsRequired"}));
                            }
                            callback();
                          }
                        }
                      ],
                      initialValue: {key:'',value:'',label:''}
                    })(
                      <DebounceSelect
                        size="default"
                        placeholder=""
                        fetchOptions={fetchCityList}
                        style={{
                          width: '100%',
                        }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label={<FormattedMessage id="Store.street"/>} {...formItemLayout2}>
                    {getFieldDecorator('primaryRegion', {
                      rules: [{ required: true, message: RCi18n({id:'PetOwner.ThisFieldIsRequired'}) }]
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem label={<FormattedMessage id="Store.housenumber"/>} {...formItemLayout2}>
                    {getFieldDecorator('primaryDistrict', {
                      rules: [{ required: true, message: RCi18n({id:'PetOwner.ThisFieldIsRequired'}) }]
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label={<FormattedMessage id="Store.postcode"/>} {...formItemLayout2}>
                    {getFieldDecorator('primaryZip', {
                      rules: [{ required: true, pattern: /^[0-9]{4}\s[A-Za-z]{2}$/, message: `${RCi18n({id:"PetOwner.theCorrectPostCode"})}: 1234 AB` }],
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem label={<FormattedMessage id="PetOwner.Email"/>} {...formItemLayout2}>
                    {getFieldDecorator('email', {
                      rules:[
                        { required: true, type: 'email', message: <FormattedMessage id="Login.email_address_vld1" /> }
                      ],
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label={<FormattedMessage id="PetOwner.Phone number"/>} {...formItemLayout2}>
                    {getFieldDecorator('phone', {
                      rules:[
                        { required: true, pattern: /^\+31[0-9]{9}$/, message: `${RCi18n({id:"inputPhoneNumberTip2"})} +31xxxxxxxxx` }
                      ]
                    })(
                      <Input maxLength={12} onChange={this.onChangePhoneNumber} />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row><Col span={4} offset={2} style={{fontSize:16}}><b>{<FormattedMessage id="Clinic.ClinicIntro"/>}</b></Col></Row>
              <Row>
                <Col span={24}>
                  <FormItem label={<FormattedMessage id="Setting.openingHours"/>} {...formItemLayout1} extra={<div style={{color:'#999'}}><FormattedMessage id="Clinic.OpenTip"/></div>}>
                    {getFieldDecorator('operatingPeriod', {
                      rules: [{ required: true, message: RCi18n({id:'PetOwner.ThisFieldIsRequired'}) }]
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem label={<FormattedMessage id="Clinic.ClinicIntroduction"/>} {...formItemLayout1}>
                    {getFieldDecorator('prescriberIntroduction', {
                      rules: [{ required: true, message: RCi18n({id:'PetOwner.ThisFieldIsRequired'}) }]
                    })(<Input.TextArea />)}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem label={<FormattedMessage id="Clinic.ClinicLogo"/>} {...formItemLayout1} extra={<div style={{color:'#999'}}>
                  <div>Allowed formats: JPEG, JPG, PNG, GIF</div>
                  <div>Maximum allowed size: 2 MB</div>
                </div>}>
                    {getFieldDecorator('logo', {
                      rules: [{ required: true, type: 'array', min: 1, message: RCi18n({id:'PetOwner.ThisFieldIsRequired'}) }]
                    })(<FileItem />)}
                  </FormItem>
                </Col>
                <Col span={18} offset={4}>
                  <Button type="primary" onClick={this.handleSave}>{<FormattedMessage id="Setting.Next"/>}</Button>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Tabs.TabPane>
        <Tabs.TabPane tab={RCi18n({id:"Prescriber.UserList"})} key="users" disabled={!this.state.isEdit}>
          <UserList prescriberKeyId={this.props.prescriberId || this.state.clinic?.id} alreadyHasPrescriber={this.state.isEdit} />
        </Tabs.TabPane>
      </Tabs>
    );
  }
})
