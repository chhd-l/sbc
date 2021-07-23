import React from 'react';
import { Form, Input, InputNumber, Button, Select, message, Table, Row, Col, Radio, Divider, Icon, Switch, Spin } from 'antd';
import { history, cache, Const, util } from 'qmkit';
import { Link } from 'react-router-dom';
import * as webapi from '../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import copy from 'copy-to-clipboard';
import UserList from './user-list';
import { bool } from 'prop-types';
import _ from 'lodash';
import { RCi18n } from 'qmkit';
import AddRecommendaionCode  from './add-recommendaion-code'

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const { Column } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class ClinicForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      prescriberForm: {
        id: '',
        prescriberId: '',
        prescriberOwner: 'admin',
        prescriberName: '',
        phone: '',
        primaryCity: '',
        primaryZip: '',
        prescriberType: '',
        longitude: '',
        latitude: '',
        location: '',
        enabled: true,
        delFlag: 0,
        // auditStatus: '1',
        prescriberCode: '',
        partneredShop: '',
        //auditAuthority: false,
        recommendationMode: 'SINGLE_USE',
        addRecommendaionCodeVisible: false
      },
      prescriberCodeNumber: '0 ' + RCi18n({ id: 'Prescriber.active' }),
      firstPrescriberForm: {},
      cityArr: [],
      typeArr: [],
      sectionList: [
        {
          id: 1,
          orderType: 'Customer first order(CFO)',
          rewardRate: 0
        },
        {
          id: 2,
          orderType: 'Customer second and following orders(CSFO)',
          rewardRate: 0
        }
      ],
      isEdit: this.props.prescriberId ? true : false,
      rewardMode: false,
      timeZone: '',
      rewardForm: {
        prescriberId: '',
        id: '',
        rewardRateFirst: 0,
        rewardRateMore: 0,
        rewardRule: false,
        timeZone: 'Year'
      },
      activeKey: 'basic',
      isJump: false,
      qrCodeLink: '',
      url: '',
      saveLoading: false,
      isMapMode: sessionStorage.getItem(cache.MAP_MODE) === '1' ? true : false,
      clinicsLites: [],
      prescriberKeyId: this.props.prescriberId,
      isPrescriber: bool,
      objectFetching: false,
      loading: false
    };
  }
  componentWillMount() {
    if (this.props.prescriberId) {
      this.getDetail(this.props.prescriberId);
    }
    let employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    const prescriberId = employee && employee.prescribers && employee.prescribers.length > 0 ? employee.prescribers[0].id : null;
    this.setState({
      isPrescriber: prescriberId !== null
    });
    this.querySysDictionary('city');
    this.queryClinicsDictionary('clinicType');
    this.getClinicsLites();
  }
  getClinicsReward = (id) => {
    webapi
      .getClinicsReward(id)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          if (res.context) {
            const { sectionList } = this.state;
            sectionList[0].rewardRate = res.context.rewardRateFirst;
            sectionList[1].rewardRate = res.context.rewardRateMore;

            this.setState({
              timeZone: res.context.timeZone,
              rewardMode: res.context.rewardRule,
              sectionList: sectionList,
              rewardForm: res.context
            });
          }
          this.setState({ loading:false })
        }
      })
      .catch((err) => {
        this.setState({ loading:false })
      });
  };

  saveReward = (id?) => {
    const { sectionList, rewardForm } = this.state;

    if (!id) {
      message.error('Prescriber ID does not exist');
      return;
    }

    let params = {
      prescriberId: id,
      id: rewardForm.id,
      rewardRateFirst: sectionList[0].rewardRate,
      rewardRateMore: sectionList[1].rewardRate,
      rewardRule: this.state.rewardMode,
      timeZone: this.state.timeZone,
      delFlag: 0
    };
    webapi
      .saveReward(params)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
          this.setState({
            saveLoading: false
          });
          this.getDetail(this.state.prescriberKeyId);
          this.switchTab('users');
        } else {
          this.setState({
            saveLoading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          saveLoading: false
        });
      });
  };

  selectTimeZone = (value) => {
    this.setState({
      timeZone: value
    });
  };
  onDataChange = ({ id, field, value }) => {
    let data = this.state.sectionList;
    let findData = data.find((item) => {
      return item.id === id || item.tempId === id;
    });

    if (findData) {
      findData[field] = value;
      this.setState({
        sectionList: data
      });
    }
  };

  getDetail = async (id) => {
    this.setState({ loading:true })
    const { res } = await webapi.getClinicById({
      id: id
    });
    if (res.code === Const.SUCCESS_CODE) {
      let qrCodeLink = res.context.qrCodeLink;
      let url = res.context.url;
      this.setState({
        qrCodeLink: qrCodeLink,
        url: url,
        prescriberForm: res.context,
        prescriberCodeNumber: res.context.singleUse + ' ' + RCi18n({ id: 'Prescriber.active' }),
      });
      let firstPrescriberForm = sessionStorage.getItem(cache.FIRST_PRESCRIBER_DATA);
      if (!firstPrescriberForm) {
        sessionStorage.setItem(cache.FIRST_PRESCRIBER_DATA, JSON.stringify(res.context));
      }
      this.setState({
        firstPrescriberForm: JSON.parse(sessionStorage.getItem(cache.FIRST_PRESCRIBER_DATA))
      });
      this.props.form.setFieldsValue({
        id: res.context.id,
        prescriberId: res.context.prescriberId,
        prescriberName: res.context.prescriberName,
        phone: res.context.phone,
        primaryCity: res.context.primaryCity,
        primaryZip: res.context.primaryZip,
        longitude: res.context.longitude,
        latitude: res.context.latitude,
        location: res.context.location,
        prescriberType: res.context.prescriberType,
        // auditStatus: res.context.auditStatus,
        prescriberCode: res.context.multipeUse,
        parentPrescriberId: res.context.parentPrescriberId,
        // auditAuthority: res.context.auditAuthority,
        website: res.context.website,
        recommendationMode: res.context.recommendationMode
      });
      this.getClinicsReward(res.context.prescriberId);
    }
  };
  queryClinicsDictionary = async (type: String) => {
    const { res } = await webapi.queryClinicsDictionary({
      type: type
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.setState({
        typeArr: res.context
      });
    }
  };
  querySysDictionary = async (type: String) => {
    const { res } = await webapi.querySysDictionary({
      type: type
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.setState({
        cityArr: res.context.sysDictionaryVOS
      });
    }
  };
  getClinicsLites = async () => {
    const { res } = await webapi.getClinicsLites();
    if (res.code === Const.SUCCESS_CODE) {
      this.setState({
        clinicsLites: res.context
      });
    }
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.prescriberForm;

    data[field] = value;
    this.setState(
      {
        prescriberForm: data
      }
    );
  };
  onCreate = () => {
    this.setState({
      saveLoading: true
    });
    const prescriberForm = this.state.prescriberForm;
    webapi
      .addClinic({ ...prescriberForm })
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          if (prescriberForm.prescriberId) {
            this.setState({
              isEdit: true,
              prescriberKeyId: res.context.id
            });
            this.saveReward(prescriberForm.prescriberId);
          } else {
            message.error('Prescriber ID does not exist');
          }
        } else {
          this.setState({
            saveLoading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          saveLoading: false
        });
      });
  };
  onUpdate = () => {
    const prescriberForm = this.state.prescriberForm;
    this.setState({
      saveLoading: true
    });
    webapi
      .updateClinic({ ...prescriberForm })
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          if (prescriberForm.prescriberId) {
            this.setState({
              isEdit: true
            });
            this.saveReward(prescriberForm.prescriberId);
          } else {
            this.setState({
              saveLoading: false
            });
            message.error('Prescriber ID does not exist');
          }
        } else {
          this.setState({
            saveLoading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          saveLoading: false
        });
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        this.switchTab('reward');
      } else {
        message.error('Prescriber Basic Information is not verified. Please modify!');
      }
    });
  };
  handleVerify = () => {
    this.props.form.validateFields((err) => {
      if (!err) {
        if (this.state.isEdit) {
          this.onUpdate();
        } else {
          this.onCreate();
        }
      } else {
        message.error('Prescriber Basic Information is not verified. Please modify!');
      }
    });
  };
  onChange = (e) => {
    this.setState({
      rewardMode: e.target.value
    });
  };
  //id校验
  // compareID = (rule, value, callback) => {
  //   if (!value) {
  //     callback('Please input Prescriber id!');
  //   }
  //   const { form } = this.props;
  //   let reg = /^[1-9][0-9]{2,12}$/;
  //   if (!reg.test(form.getFieldValue('prescriberId'))) {
  //     callback('Please enter the correct Prescriber ID!');
  //   } else {
  //     callback();
  //   }
  // };
  //手机校验
  comparePhone = (rule, value, callback) => {
    if (!value) {
      callback();
    }
    const { form } = this.props;
    let reg = /^[0-9+-\s]{6,20}$/;
    if (!reg.test(form.getFieldValue('phone'))) {
      callback('Please enter the correct phone!');
    } else {
      callback();
    }
  };

  compareZip = (rule, value, callback) => {
    if (!value) {
      callback();
    }
    const { form } = this.props;
    let reg = /^[0-9]{3,10}$/;
    if (!reg.test(form.getFieldValue('primaryZip'))) {
      callback('Please enter the correct Prescriber Zip!');
    } else {
      callback();
    }
  };
  //经度校验longitude
  compareLongitude = (rule, value, callback) => {
    if (!value) {
      callback();
    }
    const { form } = this.props;
    if (isNaN(form.getFieldValue('longitude')) || form.getFieldValue('longitude') < -180 || form.getFieldValue('longitude') > 180) {
      callback('Please enter the correct longitude!');
    } else {
      callback();
    }
  };
  //纬度校验latitude
  compareLatitude = (rule, value, callback) => {
    if (!value) {
      callback();
    }
    const { form } = this.props;

    if (isNaN(form.getFieldValue('latitude')) || form.getFieldValue('latitude') < -90 || form.getFieldValue('latitude') > 90) {
      callback('Please enter the correct latitude!');
    } else {
      callback();
    }
  };
  // goToReward = () => {
  //   this.setState({
  //     isJump: true
  //   });
  // };
  // stay = () => {
  //   this.setState({
  //     isJump: false
  //   });
  // };
  handleCopy = (value) => {
    if (copy(value)) {
      message.success('Operate successfully');
    }
  };

  switchTab = (key) => {
    this.setState({
      activeKey: key
    });
  };

  savePrescriber = () => {
    const { sectionList } = this.state;
    if (!this.state.timeZone) {
      message.error('Period can not be empty!');
      return;
    }
    if (!(sectionList[0].rewardRate || sectionList[0].rewardRate === 0)) {
      message.error('Reward Rate can not be empty!');
      return;
    }
    if (!(sectionList[1].rewardRate || sectionList[1].rewardRate === 0)) {
      message.error('Reward Rate can not be empty!');
      return;
    }
    if (!this.state.isPrescriber) {
      sessionStorage.removeItem(cache.FIRST_PRESCRIBER_DATA);
    }
    this.handleVerify();
  };

  reloadCode = () => {
    webapi.getRecommendationCode().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        if (res.context) {
          let prescriber = this.state.prescriberForm;
          prescriber.prescriberCode = res.context;
          this.setState(
            {
              prescriberForm: prescriber
            },
            () => {
              this.props.form.setFieldsValue({
                prescriberCode: prescriber.prescriberCode
              });
            }
          );
        }
      }
    });
  };

  filterOption = (input, option: { props }) => {
    return option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  _renderPerscirbersOption() {
    return this.state.clinicsLites.map((option) => {
      return (
        <Option value={option.prescriberId} key={option.prescriberId}>
          {option.prescriberId}-{option.prescriberName}
        </Option>
      );
    });
  }

  newUrl = (oldUrl) => {
    let tempArr = oldUrl.split('?');
    let pcWebsite = JSON.parse(sessionStorage.getItem(cache.SYSTEM_BASE_CONFIG)).pcWebsite;
    if (pcWebsite && tempArr[1]) {
      return pcWebsite + '?' + tempArr[1];
    } else return oldUrl;
  };
  getCityList = (value) => {
    let params = {
      cityName: value,
      pageSize: 30,
      pageNum: 0
    };
    webapi
      .queryCityListByName(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            cityArr: res.context.systemCityVO,
            objectFetching: false
          });
        }
      })
      .catch((err) => {});
  };

  onExport = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ prescriberId:this.state.prescriberKeyId, token: token });
          let encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref = Const.HOST + `/prescriber/exportRecommendationCode/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error(<FormattedMessage id="Prescriber.Unsuccessful" />);
        }

        resolve();
      }, 500);
    });
  };

  updatePrescriberCodeNumber=(number)=>{
      this.setState({
        prescriberCodeNumber: number + ' ' + RCi18n({ id: 'Prescriber.active' })
      })
  }

  render() {
    const { cityArr, typeArr, prescriberForm, firstPrescriberForm, objectFetching, addRecommendaionCodeVisible, prescriberCodeNumber, prescriberKeyId } = this.state;
    const { getFieldDecorator } = this.props.form;
    let employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    const prescriberId = employee && employee.prescribers && employee.prescribers.length > 0 ? employee.prescribers[0].id : null;
    const isCountryGermany = (window as any).countryEnum[JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId ?? 0] === 'de';
    return ( 
      <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
        <Tabs activeKey={this.state.activeKey} onChange={this.switchTab}>       
          <TabPane tab={RCi18n({id:"PetOwner.BasicInformation"})} key="basic">        
            <Row>
                <Col span={12}>
                  <Form {...layout} onSubmit={this.handleSubmit}>
                    <FormItem label={RCi18n({ id: 'Prescriber.ParentPrescriber' })}>
                      {getFieldDecorator(
                        'parentPrescriberId',
                        {}
                      )(
                        <Select
                          disabled={(firstPrescriberForm && firstPrescriberForm.parentPrescriberId && this.state.isPrescriber) || (isCountryGermany && prescriberId)}
                          allowClear
                          showSearch
                          filterOption={this.filterOption}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'parentPrescriberId',
                              value
                            });
                          }}
                        >
                          {this._renderPerscirbersOption()}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label={RCi18n({ id: 'Prescriber.PrescriberID' })}>
                      {getFieldDecorator('prescriberId', {
                        rules: [{ required: true, message: RCi18n({ id: 'Prescriber.PleaseInputPrescriberId' }) }]
                      })(
                        <Input
                          disabled={this.state.isEdit}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'prescriberId',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                    <FormItem label={RCi18n({ id: 'Prescriber.PrescriberName' })}>
                      {getFieldDecorator('prescriberName', {
                        rules: [
                          {
                            required: true,
                            message: RCi18n({ id: 'PleaseInputPrescriberName' })
                          },
                          {
                            max: 200,
                            message: RCi18n({ id: 'Prescriber.theMaximumLength' })
                          }
                        ]
                      })(
                        <Input
                          disabled={firstPrescriberForm && firstPrescriberForm.prescriberName && this.state.isPrescriber}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'prescriberName',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>

                    {!this.state.isMapMode ? 
                    <>
                    <FormItem label={RCi18n({ id: 'Prescriber.RecommendationMode' })}>
                    {getFieldDecorator('recommendationMode', {
                      initialValue: prescriberForm.recommendationMode
                    })(
                      <Radio.Group onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'recommendationMode',
                          value
                        });
                      }}>
                        <Radio value={'SINGLE_USE'}><FormattedMessage id="Prescriber.SingleUse"/></Radio>
                        <Radio disabled={prescriberId && isCountryGermany} value={'MULTIPE_USE'}><FormattedMessage id="Prescriber.MultipleUse"/></Radio>
                      </Radio.Group>
                    )}
                    </FormItem>
                    { this.props.prescriberId ?
                    <>  
                      { prescriberForm.recommendationMode === 'SINGLE_USE' ? 
                        <FormItem label={RCi18n({ id: 'Prescriber.RecommendationCode' })}>
                          <Row>
                            <Col span={10}>
                              <Input disabled value={prescriberCodeNumber}/>
                            </Col>
                            <Col span={7} style={{textAlign: 'right'}}>
                              <Button icon="plus" type="primary" onClick={()=>this.setState({ addRecommendaionCodeVisible: true })}><FormattedMessage id="Prescriber.New"/></Button>
                              <AddRecommendaionCode 
                                prescriberKeyId={prescriberKeyId}
                                prescriberId={prescriberForm.prescriberId}
                                cancel={()=>this.setState({addRecommendaionCodeVisible: false})} 
                                updatePrescriberCodeNumber={this.updatePrescriberCodeNumber}
                                addRecommendaionCodeVisible={addRecommendaionCodeVisible}/>
                            </Col>
                            <Col span={7} style={{textAlign: 'right'}}>
                              <Button icon="download" type="default" onClick={()=>this.onExport()}><FormattedMessage id="Setting.export"/></Button>
                            </Col>           
                          </Row>
                        </FormItem>
                        :
                        <FormItem label={RCi18n({ id: 'Prescriber.RecommendationCode' })}>
                          {getFieldDecorator('prescriberCode', {
                            initialValue: prescriberForm.prescriberCode
                          })(
                          <Input addonAfter={<Icon onClick={() => this.reloadCode()} type="reload" />} disabled />)}
                        </FormItem>
                        }          
                      </>
                      : null}
                  </> : null }
                  

                    <FormItem label={RCi18n({ id: 'Prescriber.PrescriberPhoneNumber' })}>
                      {getFieldDecorator('phone', {
                        rules: [{ validator: this.comparePhone }]
                      })(
                        <Input
                          disabled={firstPrescriberForm && firstPrescriberForm.phone && this.state.isPrescriber}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'phone',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                    <FormItem label={RCi18n({ id: 'Prescriber.PrescriberWebsite' })}>
                      {getFieldDecorator(
                        'website',
                        {}
                      )(
                        <Input
                          disabled={firstPrescriberForm && firstPrescriberForm.website && this.state.isPrescriber}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'website',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                    <FormItem label={RCi18n({ id: 'Prescriber.PrescriberCity' })}>
                      {getFieldDecorator(
                        'primaryCity',
                        {}
                      )(
                        <Select
                          // showSearch
                          placeholder=""
                          disabled={isCountryGermany && prescriberId}
                          notFoundContent={objectFetching ? <Spin size="small" /> : null}
                          // onSearch={_.debounce(this.getCityList, 500)}
                          filterOption={(input, option) => option.props.children && option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          onChange={(value) => {
                            this.onFormChange({
                              field: 'primaryCity',
                              value: value ? value : ''
                            });
                          }}
                        >
                          {cityArr
                            ? cityArr.map((item) => (
                                <Option value={item.name} key={item.id}>
                                  {item.name}
                                </Option>
                              ))
                            : null}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label={RCi18n({ id: 'Prescriber.PrescriberZip' })}>
                      {getFieldDecorator('primaryZip', {
                        rules: [{ validator: this.compareZip }]
                      })(
                        <Input
                          disabled={firstPrescriberForm && firstPrescriberForm.primaryZip && this.state.isPrescriber}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'primaryZip',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                    <FormItem label={RCi18n({ id: 'Prescriber.PrescriberType' })}>
                      {getFieldDecorator('prescriberType', {
                        rules: [
                          {
                            required: true,
                            message: 'Please select Prescriber Type!'
                          }
                        ]
                      })(
                        <Select
                          disabled={firstPrescriberForm && firstPrescriberForm.prescriberType && this.state.isPrescriber}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'prescriberType',
                              value
                            });
                          }}
                        >
                          {typeArr.map((item) => (
                            <Option value={item.valueEn} key={item.id}>
                              {item.name}
                            </Option>
                          ))}
                          {/* <Option value="Mexico City">Mexico City</Option>
                        <Option value="Monterrey">Monterrey</Option> */}
                        </Select>
                      )}
                    </FormItem>

                    <FormItem label={RCi18n({ id: 'Prescriber.Latitude' })}>
                      {getFieldDecorator('latitude', {
                        rules: [{ validator: this.compareLatitude }]
                      })(
                        <Input
                          disabled={firstPrescriberForm && firstPrescriberForm.latitude && this.state.isPrescriber}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'latitude',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>

                    <FormItem label={RCi18n({ id: 'Prescriber.Longitude' })}>
                      {getFieldDecorator('longitude', {
                        rules: [{ validator: this.compareLongitude }]
                      })(
                        <Input
                          disabled={firstPrescriberForm && firstPrescriberForm.longitude && this.state.isPrescriber}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'longitude',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>

                    <FormItem label={RCi18n({ id: 'Prescriber.PrescriberAddress' })}>
                      {getFieldDecorator('location', {
                        rules: [
                          {
                            max: 200,
                            message: RCi18n({ id: 'Prescriber.PrescriberAddressExceed' })
                          }
                        ]
                      })(
                        <Input.TextArea
                          disabled={firstPrescriberForm && firstPrescriberForm.location && this.state.isPrescriber}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'location',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                    {/* <FormItem label={RCi18n({ id: 'Prescriber.AuditAuthority' })}>
                      {getFieldDecorator(
                        'auditAuthority',
                        {}
                      )(
                        <Switch
                          checked={this.state.prescriberForm.auditAuthority}
                          onChange={(value) =>
                            this.onFormChange({
                              field: 'auditAuthority',
                              value: value
                            })
                          }
                        />
                      )}
                    </FormItem> */}
                    <FormItem wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                      <Button type="primary" htmlType="submit">
                        <FormattedMessage id="Prescriber.ProceedToSetRewardRules" />
                      </Button>

                      {!sessionStorage.getItem('PrescriberSelect') ? (
                        <Button style={{ marginLeft: '20px' }}>
                          <Link to="/prescriber">
                            <FormattedMessage id="Prescriber.BackToList" />
                          </Link>
                        </Button>
                      ) : null}
                    </FormItem>
                  </Form>
                </Col>
                {this.state.isMapMode ?             
                  <Col span={12} style={{ display: !this.state.isEdit ? 'none' : null }}>
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                      {this.state.qrCodeLink ? <img src={this.state.qrCodeLink} alt="" /> : null}
                      {this.state.url ? (
                        <div>
                          {this.newUrl(this.state.url)}
                          <Button style={{ marginLeft: '10px' }} onClick={() => this.handleCopy(this.newUrl(this.state.url))} size="small">
                            <FormattedMessage id="Prescriber.copy" />
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </Col> : null}
              </Row>
          </TabPane>
          <TabPane tab={RCi18n({id:"Finance.RewardRate"})} key="reward">
            <Row>
              <Col span={24}>
                <span
                  style={{
                    color: 'red',
                    fontFamily: 'SimSun',
                    marginRight: '4px',
                    fontSize: '12px'
                  }}
                >
                  *
                </span>
                <label
                  style={{
                    minWidth: '200px',
                    marginRight: '10px',
                    fontSize: '16px',
                    fontWeight: 500
                  }}
                >
                  <FormattedMessage id="Prescriber.Period" />
                </label>
                <FormattedMessage id="Prescriber.Every" />
                <Select disabled={this.state.isPrescriber} value={this.state.timeZone} onChange={(value) => this.selectTimeZone(value)} style={{ minWidth: '200px', marginLeft: '10px' }}>
                  <Option value="Year" key="year">
                    <FormattedMessage id="Prescriber.Year" />
                  </Option>
                  <Option value="Month" key="month">
                    <FormattedMessage id="Prescriber.Month" />
                  </Option>
                  <Option value="Week" key="week">
                    <FormattedMessage id="Prescriber.Week" />
                  </Option>
                </Select>
              </Col>
              <Col span={24} style={{ marginTop: '20px' }}>
                <span
                  style={{
                    color: 'red',
                    fontFamily: 'SimSun',
                    marginRight: '4px',
                    fontSize: '12px'
                  }}
                >
                  *
                </span>
                <label
                  style={{
                    minWidth: '200px',
                    marginRight: '10px',
                    fontSize: '16px',
                    fontWeight: 500
                  }}
                >
                  <FormattedMessage id="Prescriber.RewardMode" />
                </label>
                {/* <div style={{ marginTop: '20px' }}>
                  <Radio.Group
                    onChange={this.onChange}
                    value={this.state.rewardMode}
                  >
                    <Radio value={true} style={{ marginRight: '50px' }}>
                      <div style={{ display: 'inline-grid' }}>
                        <p style={{ fontSize: '20px' }}>
                          Customer-oriented reward
                        </p>
                        <span style={{ fontSize: '12px' }}>
                          (order types subject to a unique custome)
                        </span>
                      </div>
                    </Radio>
                    <Radio value={false}>
                      <div style={{ display: 'inline-grid' }}>
                        <p style={{ fontSize: '20px' }}>No reward rule</p>
                      </div>
                    </Radio>
                  </Radio.Group>
                </div>
                <Divider type="horizontal" /> */}
                <Table style={{ paddingTop: '10px' }} pagination={false} rowKey="id" dataSource={this.state.sectionList}>
                  <Column
                    title={RCi18n({ id: 'Prescriber.UniqueCustomerOrderType' })}
                    key="orderType"
                    width={180}
                    render={(rowInfo) => {
                      return rowInfo.orderType;
                    }}
                  />
                  <Column
                    title={
                      <div>
                        <span
                          style={{
                            color: 'red',
                            fontFamily: 'SimSun',
                            marginRight: '4px',
                            fontSize: '12px'
                          }}
                        >
                          *
                        </span>
                        <FormattedMessage id="Prescriber.Rewardrate" />
                      </div>
                    }
                    key="rewardRate"
                    width={180}
                    render={(rowInfo) => {
                      return (
                        <Row>
                          <Col span={10}>
                            <FormItem style={{ marginBottom: 0 }}>
                              <InputNumber
                                disabled={this.state.isPrescriber}
                                value={rowInfo.rewardRate}
                                min={0}
                                max={100}
                                formatter={(value) => `${value}%`}
                                parser={(value) => value.replace('%', '')}
                                onChange={(value) => {
                                  const id = rowInfo.id;
                                  this.onDataChange({
                                    id: id,
                                    field: 'rewardRate',
                                    value
                                  });
                                }}
                              />
                              {/* <Input
                                value={rowInfo.rewardRate}
                                type="number"
                                onChange={(e) => {
                                  const value = (e.target as any).value;
                                  const id = rowInfo.id;
                                  this.onDataChange({
                                    id: id,
                                    field: 'rewardRate',
                                    value
                                  });
                                }}
                                addonAfter="%"
                              /> */}
                            </FormItem>
                          </Col>
                        </Row>
                      );
                    }}
                  />
                </Table>
              </Col>
              <Col span={24} style={{ marginTop: '20px' }}>
                <Button type="primary" loading={this.state.saveLoading} onClick={() => this.savePrescriber()}>
                  <FormattedMessage id="Prescriber.Save" />
                </Button>
                {!sessionStorage.getItem('PrescriberSelect') ? (
                  <Button style={{ marginLeft: '20px' }}>
                    <Link to="/prescriber">
                      {' '}
                      <FormattedMessage id="Prescriber.BackToList" />
                    </Link>
                  </Button>
                ) : null}

                {/* <Button onClick={() => this.clearAndSave()}>
                  Clear rules and Save
                </Button> */}
              </Col>
            </Row>
          </TabPane>
          <TabPane tab={RCi18n({id:"Prescriber.UserList"})} key="users">
            <UserList prescriberKeyId={prescriberKeyId} alreadyHasPrescriber={this.state.isEdit} />
          </TabPane>
        </Tabs>
      </Spin>
    );
  }
}
export default Form.create()(ClinicForm);
