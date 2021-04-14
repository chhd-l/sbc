import { Checkbox, Col, DatePicker, Form, Icon, Input, message, Radio, Row, Select, Spin } from 'antd'
import React, { Component } from 'react'
import { QRScaner, noop, RCi18n } from 'qmkit';
const { Option } = Select;
import { querySysDictionary } from '../webapi'
import { Relax } from 'plume2';
import moment from 'moment';
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
        this.getDictAlllist('Lifestyle', 'lifeList');
        this.getDictAlllist('Activity', 'activityList');
        this.getDictAlllist('specialNeeds', 'specialNeedsList');
        this.getDictAlllist('CatBreed', 'petsBreedList')
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
            message.error('scan error,apptNo was not find.')
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
                                    <Form.Item label="Date:">
                                        {getFieldDecorator('fillDate', {
                                            onChange: (e) => this._onChange(e, 'fillDate'),
                                            initialValue: moment(felinReco?.fillDate ?? (new Date()), 'YYYY-MM-DD'),
                                            rules: [{ required: true, message: 'Please select  date!' }],
                                        })(<DatePicker style={{ width: '100%' }}
                                            format="YYYY-MM-DD"

                                        />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Expert name:">
                                        {getFieldDecorator('expert', {
                                            initialValue: felinReco.expert,
                                        })(<Input disabled />)}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="pour:">
                                        {getFieldDecorator('consumerName', {
                                            onChange: (e) => this._onChange(e, 'consumerName'),
                                            initialValue: appointmentVO.consumerName || '',
                                        })(<Input disabled={petsList.length > 0 || funType} />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={20} >
                                <Form.Item label="">
                                    <span className="ant-form-text">Information sur le chat:</span>
                                </Form.Item>
                                <Col span={12}>
                                    <Form.Item label="Name:">
                                        {getFieldDecorator('petsName', {
                                            defaultValue: '',
                                            initialValue: customerPet.petsName || '',
                                            rules: [{ required: true, message: 'Please input pet Name' }],
                                            onChange: (e) => this._onChange(e, 'petsName')
                                        })(<Input disabled={petsList.length > 0 || funType} />)}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Gender:">
                                        {getFieldDecorator('petsSex', {
                                            initialValue: customerPet.petsSex,
                                            rules: [{ required: true, message: 'Please select Gender!' }],
                                            onChange: (e,) => this._onChange(e, 'petsSex')

                                        })(<Radio.Group disabled={petsList.length > 0 || funType}>
                                            <Radio value={1}>Female</Radio>
                                            <Radio value={0}>Male</Radio>
                                        </Radio.Group>)}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Date of birth:">
                                        {getFieldDecorator('birthOfPets', {
                                            initialValue: moment(customerPet?.birthOfPets ?? (new Date()), 'YYYY-MM-DD'),
                                            rules: [{ required: true, message: 'Please select Date of birth!' }],
                                            onChange: (e,) => this._onChange(e, 'birthOfPets')

                                        })(<DatePicker disabled={petsList.length > 0 || funType} style={{ width: '100%' }} />)}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Breed:">
                                        {getFieldDecorator('petsBreed', {
                                            initialValue: customerPet.petsBreed || "",
                                            rules: [{ required: true, message: 'Please select Breed' }],
                                            onChange: (e,) => this._onChange(e, 'petsBreed')

                                        })(<Select
                                            showSearch
                                            getPopupContainer={(trigger: any) => trigger.parentNode}
                                            notFoundContent={fetching ? <Spin size="small" /> : null}
                                            placeholder="Please input your Breed."
                                            defaultActiveFirstOption={false}
                                            filterOption={false}
                                            onSearch={this.onSearch}
                                            disabled={petsList.length > 0 || funType}
                                        >
                                            {
                                                petsBreedList.map(((item, index) => (<Option key={item.id}  value={item.valueEn} label={item.valueEn}>{item.name}</Option>)))
                                            }
                                        </Select>)}
                                    </Form.Item>

                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Sensitvities:">
                                        {getFieldDecorator('sensitivity', {
                                            initialValue: customerPet.sensitivity || '',
                                            //  rules: [{ required: true, message: 'Please select Sensitvities!' }],
                                            onChange: (e,) => this._onChange(e, 'sensitivity')

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
                                    <Form.Item label="Lifestyle">
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
                                    <Form.Item label="Activity:">
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
                                            <Form.Item label="Weight">
                                                {getFieldDecorator('measure', {
                                                    initialValue: customerPet.measure || 0,
                                                    rules: [{ required: true, message: 'Please input Weight!' }],
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
                                    <Form.Item label="Sterilzed">
                                        {getFieldDecorator('sterilized', {
                                            defaultValue: 0,
                                            initialValue: customerPet.sterilized,
                                            rules: [{ required: true, message: 'Please select Sterilzed!' }],
                                            onChange: (e,) => this._onChange(e, 'sterilized')
                                        })(<Radio.Group disabled={petsList.length > 0 || funType}>
                                            <Radio value={1}>Yes</Radio>
                                            <Radio value={0}>No</Radio>
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
                            <div style={{ marginTop: 3}}>
                                <Search placeholder={(window as any).RCi18n({ id: 'Prescriber.enterPlaceholder' })} onSearch={value => this.findByApptNo(value)} enterButton />
                            </div>
                            <div style={{ marginTop: 20 }}>
                                {petsList.length > 0 && <Select style={{ width: '100' }}
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
