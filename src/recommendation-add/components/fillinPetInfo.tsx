import { Checkbox, Col, DatePicker, Form, Icon, Input, message, Radio, Row, Select, Spin } from 'antd'
import React, { Component } from 'react'
import { QRScaner, noop, RCi18n } from 'qmkit';
const { Option } = Select;
import { querySysDictionary } from '../webapi'
import { Relax } from 'plume2';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
const { Search } = Input;
@Relax
export default class FillinPetInfo extends Component {
    props: {
        form: any,
        relaxProps?: {
            felinReco: any
            customerPet: any
            appointmentVO: any,
            onChangePestsForm: Function,
            findByApptNo: Function,
            funType: boolean,
            petsList: any
        };
    }
    static relaxProps = {
        felinReco: 'felinReco',
        customerPet: 'customerPet',
        appointmentVO: 'appointmentVO',
        onChangePestsForm: noop,
        findByApptNo: noop,
        funType: 'funType',
        petsList: 'petsList'
    };
    state = {
        lifeList: [],
        activityList: [],
        specialNeedsList: [],
        petsBreedList: [],
        fetching: false,
        loading: false,
        weightList: [
            { value: 'kg', name: 'kg' }
            // { value: 'g', name: 'g' }
        ],
    }

    componentDidMount() {
        const { felinReco, onChangePestsForm} = this.props.relaxProps;
        this.getDictAlllist('Lifestyle', 'lifeList');
        this.getDictAlllist('Activity', 'activityList');
        this.getDictAlllist('specialNeeds', 'specialNeedsList');
        this.getDictAlllist('CatBreed', 'petsBreedList')
        if(!felinReco.fillDate){
            onChangePestsForm({ ...felinReco, fillDate: moment().format('YYYY-MM-DD') }, 'felinReco')
        }
    }
    /**
     * 获取数据字典
     */
    async getDictAlllist(type, name, keywords?: string) {
        this.setState({ loading: true })
        let { res: lifesOptions } = await querySysDictionary({ type, name: keywords });
        let lifeList = lifesOptions?.context?.sysDictionaryVOS.map((el) => {
            el.value = el.valueEn;
            return el;
        });
        this.setState({
            [name]: lifeList,
            fetching: false,
            loading: false
        });
    }
    
    //查询
    onSearch = async (value) => {
        this.setState({ petsBreedList: [], fetching: true });
        this.getDictAlllist('CatBreed', 'petsBreedList', value)
    };
    //扫描后返回的值
    findByApptNo = async (apptNo) => {
        if (!apptNo) {
            message.error(RCi18n({id:'Prescriber.apptNowasnotfind'}))
            return
        }
        const { findByApptNo } = this.props.relaxProps;
        findByApptNo(apptNo)
    }
    _onChange(e, key: string) {
        const { onChangePestsForm, customerPet, felinReco, appointmentVO } = this.props.relaxProps;
        if (e && e.target) {
            e = e.target.value;
        }
        if (key === 'fillDate') {
            onChangePestsForm({ ...felinReco, [key]: moment(e).format('YYYY-MM-DD') }, 'felinReco')
        } else if (key === 'consumerName') {
            onChangePestsForm({ ...appointmentVO, [key]: e }, 'appointmentVO')
        } else {
            console.log(key, e)
            onChangePestsForm({ ...customerPet, [key]: e }, 'customerPet')
        }
    }
    //选择下拉宠物
    _onChangePets = (e) => {
        const { onChangePestsForm, petsList } = this.props.relaxProps;
        let pets = petsList.find(item => item.petsId === e)
        onChangePestsForm(pets, 'customerPet')
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { felinReco, customerPet, appointmentVO, petsList, funType } = this.props.relaxProps;
        const { lifeList, loading, activityList, specialNeedsList, petsBreedList, weightList, fetching } = this.state
        return (
            <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />} >

                <Row>
                    <Col span={16}>
                        <Form >
                            <Row gutter={20}>
                                <Col span={8}>
                                    <Form.Item label={RCi18n({id:'Prescriber.Date'})}>
                                        {getFieldDecorator('fillDate', {
                                            onChange: (e) => this._onChange(e, 'fillDate'),
                                            initialValue:moment(felinReco.fillDate,'YYYY-MM-DD'),
                                            rules: [{ required: true, message: RCi18n({id:'selectfillDate'}) }],
                                        })(<DatePicker style={{ width: '100%' }}/>)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label={RCi18n({id:'Prescriber.Expert name'})}>
                                        {getFieldDecorator('expert', {
                                            initialValue: felinReco.expert,
                                        })(<Input disabled />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label={RCi18n({id:'Prescriber.pour'})}>
                                        {getFieldDecorator('consumerName', {
                                            onChange: (e) => this._onChange(e, 'consumerName'),
                                            initialValue: appointmentVO.consumerName || '',
                                        })(<Input disabled={petsList.length > 0 || funType} />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={20} >
                                <Form.Item label="">
                                    <span className="ant-form-text"><FormattedMessage id="Prescriber.Informationsurlechat" /></span>
                                </Form.Item>
                                <Col span={12}>
                                    <Form.Item label={RCi18n({id:'Prescriber.Name：'})}>
                                        {getFieldDecorator('petsName', {
                                            defaultValue: '',
                                            initialValue: customerPet.petsName || '',
                                            rules: [{ required: true, message: RCi18n({id:'Prescriber.inputpetName'})}],
                                            onChange: (e) => this._onChange(e, 'petsName')
                                        })(<Input disabled={petsList.length > 0 || funType} />)}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={RCi18n({id:'Prescriber.Gender'})}>
                                        {getFieldDecorator('petsSex', {
                                            initialValue: customerPet.petsSex,
                                            rules: [{ required: true, message: RCi18n({id:'Prescriber.selectGender'}) }],
                                            onChange: (e,) => this._onChange(e, 'petsSex')

                                        })(<Radio.Group disabled={petsList.length > 0 || funType}>
                                            <Radio value={1}><FormattedMessage id="Prescriber.Female" /></Radio>
                                            <Radio value={0}><FormattedMessage id="Prescriber.Male" /></Radio>
                                        </Radio.Group>)}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={RCi18n({id:'Prescriber.Dateofbirth'})}>
                                        {getFieldDecorator('birthOfPets', {
                                            initialValue:customerPet.birthOfPets&&moment(customerPet.birthOfPets, 'YYYY-MM-DD')||null,
                                            rules: [{ required: true, message: RCi18n({id:'Prescriber.selectDateofbirth'})}],
                                            onChange: (e,) => this._onChange(e, 'birthOfPets')

                                        })(<DatePicker disabled={petsList.length > 0 || funType} style={{ width: '100%' }} />)}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={RCi18n({id:'Prescriber.Breed'})}>
                                        {getFieldDecorator('petsBreed', {
                                            initialValue: customerPet.petsBreed || "",
                                            rules: [{ required: true, message: RCi18n({id:'Prescriber.selectBreed'})}],
                                            onChange: (e,) => this._onChange(e, 'petsBreed')

                                        })(<Select
                                            showSearch
                                            getPopupContainer={(trigger: any) => trigger.parentNode}
                                            notFoundContent={fetching ? <Spin size="small" /> : null}
                                            placeholder={RCi18n({id:'Prescriber.inputyourBreed'})}
                                            defaultActiveFirstOption={false}
                                            filterOption={false}
                                            onSearch={this.onSearch}
                                            disabled={petsList.length > 0 || funType}
                                        >
                                            {
                                                petsBreedList.map(((item, index) => (<Option key={item.id}  value={item.valueEn} label={item.valueEn}>{item.valueEn}</Option>)))
                                            }
                                        </Select>)}
                                    </Form.Item>

                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Special needs:">
                                        {getFieldDecorator('needs', {
                                            initialValue: customerPet.needs || '',
                                            //  rules: [{ required: true, message: 'Please select Sensitvities!' }],
                                            onChange: (e,) => this._onChange(e, 'needs')

                                        })(<Select
                                            disabled={petsList.length > 0 || funType}
                                            getPopupContainer={(trigger: any) => trigger.parentNode}
                                        >

                                            {
                                                specialNeedsList.map(((item, index) => (<Option key={item.id} value={item.valueEn} label={item.valueEn}>{item.name}</Option>)))
                                            }
                                        </Select>)}
                                    </Form.Item>


                                </Col>
                                <Col span={12}>
                                    <Form.Item label={RCi18n({id:'Prescriber.Sensitvities'})}>
                                        {getFieldDecorator('lifestyle', {
                                            initialValue: customerPet.lifestyle || '',
                                            // rules: [{ required: true, message: 'Please select Lifestyle!' }],
                                            onChange: (e,) => this._onChange(e, 'lifestyle')

                                        })(<Select
                                            disabled={petsList.length > 0 || funType}
                                            getPopupContainer={(trigger: any) => trigger.parentNode}
                                        >

                                            {
                                                lifeList.map(((item, index) => (<Option key={item.id} value={item.valueEn} label={item.valueEn}>{item.name}</Option>)))
                                            }
                                        </Select>)}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label={RCi18n({id:'Prescriber.Activity'})}>
                                        {getFieldDecorator('activity', {
                                            initialValue: customerPet.activity || '',
                                            // rules: [{ required: true, message: 'Please selectActivity!' }],
                                            onChange: (e,) => this._onChange(e, 'activity')

                                        })(<Select
                                            disabled={petsList.length > 0 || funType}
                                            getPopupContainer={(trigger: any) => trigger.parentNode}
                                        >

                                            {
                                                activityList.map(((item, index) => (<Option key={item.id} value={item.valueEn} label={item.valueEn}>{item.name}</Option>)))
                                            }
                                        </Select>)}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>

                                    <Row gutter={20}>

                                        <Col span={12}>
                                            <Form.Item label={RCi18n({id:'Prescriber.Weight'})}>
                                                {getFieldDecorator('measure', {
                                                    initialValue: customerPet.measure || 0,
                                                    rules: [{ required: true, message: RCi18n({id:'Prescriber.inputWeight'}) }],
                                                    onChange: (e,) => this._onChange(e, 'measure')
                                                })(<Input disabled={petsList.length > 0 || funType} />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="  ">
                                                {getFieldDecorator('measureUnit', {
                                                    initialValue: customerPet.measureUnit || 'Kg',
                                                    onChange: (e,) => this._onChange(e, 'measureUnit')
                                                })(<Select
                                                    disabled={petsList.length > 0 || funType}
                                                    getPopupContainer={(trigger: any) => trigger.parentNode}
                                                >

                                                    {
                                                        weightList.map(((item, index) => (<Option key={index} value={item.value} label={item.value}>{item.name}</Option>)))
                                                    }
                                                </Select>)}
                                            </Form.Item>
                                        </Col>
                                    </Row>


                                </Col>
                                <Col span={12}>
                                    <Form.Item label={RCi18n({id:'Prescriber.Sterilzed'})}>
                                        {getFieldDecorator('sterilized', {
                                            defaultValue: 0,
                                            initialValue: customerPet.sterilized,
                                            rules: [{ required: true, message: RCi18n({id:'Prescriber.selectSterilzed'}) }],
                                            onChange: (e,) => this._onChange(e, 'sterilized')
                                        })(<Radio.Group disabled={petsList.length > 0 || funType}>
                                            <Radio value={1}><FormattedMessage id="Prescriber.Yes" /></Radio>
                                            <Radio value={0}><FormattedMessage id="Prescriber.No" /></Radio>
                                        </Radio.Group>)}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col offset={2} span={6} style={{ textAlign: 'center' }}>
                        {!funType && <div >
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                           <span>{(window as any).RCi18n({ id: 'Prescriber.appointmentId' })}</span>
                            <QRScaner id="scan" onScanEnd={this.findByApptNo}>
                                <Icon type="scan" style={{
                                    fontSize: 40,
                                    color: '#E1021A',
                                    cursor: 'pointer',
                                }} />
                            </QRScaner>
                            </div>
                            <div style={{ marginTop: 3}} className="pets-search-app">
                                <Search style={{width:'100%'}} placeholder={(window as any).RCi18n({ id: 'Prescriber.enterPlaceholder' })} onSearch={value => this.findByApptNo(value)} enterButton />
                            </div>
                            <div style={{ marginTop: 20,position:'relative' ,width:'100%'}}>
                                {petsList.length > 0 && <Select style={{ width: '100%' }}
                                    defaultValue={petsList[0].petsId}
                                    onChange={this._onChangePets}
                                >
                                    {petsList.map(item => {
                                        return <Option key={item.petsId} value={item.petsId}>{item.petsName}</Option>
                                    })}

                                </Select>
                                }
                            </div>

                           
                        </div>
                        }
                    </Col>
                </Row>
            </Spin>
        )
    }
}
