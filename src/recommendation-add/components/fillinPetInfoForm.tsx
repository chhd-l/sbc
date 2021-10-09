import { Button, Checkbox, Col, DatePicker, Form, Icon, Input, message, Radio, Row, Select, Spin } from 'antd'
import React, { Component } from 'react'
import { QRScaner, noop, RCi18n } from 'qmkit';
const { Option } = Select;
import { querySysDictionary } from '../webapi'
import { Relax } from 'plume2';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
const { Search } = Input;
class FillinPetInfoForm extends Component {
    props: {

        felinReco: any
        customerPet:any
        appointmentVO: any
        onChangePestsForm: Function,
        findByApptNo: Function,
        funType: boolean,
        petsList: any
    }

    state = {
        lifeList: [],
        activityList: [],
        specialNeedsList: [],
        petsBreedList: [],
        customerPet: [],
        fetching: false,
        loading: false,
        weightList: [
            { value: 'kg', name: 'kg' }
        ],
    }

    componentDidMount() {
        const { felinReco, onChangePestsForm, customerPet } = this.props;
        this.getDictAlllist('Lifestyle', 'lifeList');
        this.getDictAlllist('Activity', 'activityList');
        this.getDictAlllist('specialNeeds', 'specialNeedsList');
        this.getDictAlllist('CatBreed', 'petsBreedList')
        if (!felinReco?.fillDate) {
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
            message.error(RCi18n({ id: 'Prescriber.apptNowasnotfind' }))
            return
        }
        const { findByApptNo } = this.props;
        findByApptNo(apptNo)
    }

    //选择下拉宠物
    _onChangePets = (e) => {
        const { onChangePestsForm, petsList } = this.props;
        let pets = petsList.find(item => item.petsId === e)
        // onChangePestsForm(pets, 'customerPet')
    }

    remove = index => {
        const { getFieldValue,setFieldsValue } = this.props.form;
        let cc=getFieldValue('customerPet')
        setFieldsValue({
            customerPet:cc.filter((item, key) => key !== index),
        })
       
    };
     uuid=()=> {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    addPet = () => {
        const {getFieldValue,setFieldsValue } = this.props.form;
        const customerPet = getFieldValue('customerPet');
        const nextKeys = [...customerPet,{ uuid:this.uuid()}]
       setFieldsValue({
            customerPet: nextKeys,
            })
    };

    next = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }


    renderMorePetsForm = (customerPet) => {
        const { getFieldDecorator,getFieldValue } = this.props.form;
        const { petsList, funType } = this.props;
        const { lifeList, activityList, specialNeedsList, petsBreedList, weightList, fetching } = this.state
        
       // const customerPet = getFieldValue('customerPet');
        console.log(customerPet,'=======')
    //   return
        return customerPet.length>0&&customerPet.map((item, index) => (
            <Col span={12} key={item.uuid+index}>
                <Row gutter={20} >
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <span className="ant-form-text" style={{ fontWeight: 'bolder' }}><FormattedMessage id="Prescriber.Pet" />{index + 1}:</span>
                        <Button type="primary" onClick={() => this.remove(index)}>删除{item.uuid}</Button>
                    </div>
                    <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'Prescriber.Name' })}>
                            {getFieldDecorator(`customerPet[${index}].petsName`, {
                                initialValue: item.petsName || '',
                                rules: [{ required: true, message: RCi18n({ id: 'Prescriber.inputpetName' }) }],
                            })(<Input disabled={petsList.length > 0 || funType} />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'Prescriber.Gender' })}>
                            {getFieldDecorator(`customerPet[${index}].petsSex`, {
                                initialValue: item.petsSex,
                                rules: [{ required: true, message: RCi18n({ id: 'Prescriber.selectGender' }) }],

                            })(<Radio.Group disabled={petsList.length > 0 || funType}>
                                <Radio value={1}><FormattedMessage id="Prescriber.Female" /></Radio>
                                <Radio value={0}><FormattedMessage id="Prescriber.Male" /></Radio>
                            </Radio.Group>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'Prescriber.Dateofbirth' })}>
                            {getFieldDecorator(`customerPet[${index}].birthOfPets`, {
                                initialValue: item.birthOfPets && moment(item.birthOfPets, 'YYYY-MM-DD') || null,
                                rules: [{ required: true, message: RCi18n({ id: 'Prescriber.selectDateofbirth' }) }],

                            })(<DatePicker disabled={petsList.length > 0 || funType} style={{ width: '100%' }} />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'Prescriber.Breed' })}>
                            {getFieldDecorator(`customerPet[${index}].petsBreed`, {
                                initialValue: item.petsBreed || "",
                                rules: [{ required: true, message: RCi18n({ id: 'Prescriber.selectBreed' }) }],

                            })(<Select
                                showSearch
                                getPopupContainer={(trigger: any) => trigger.parentNode}
                                notFoundContent={fetching ? <Spin size="small" /> : null}
                                placeholder={RCi18n({ id: 'Prescriber.inputyourBreed' })}
                                defaultActiveFirstOption={false}
                                filterOption={false}
                                onSearch={this.onSearch}
                                disabled={petsList.length > 0 || funType}
                            >
                                {
                                    petsBreedList.map(((item) => (<Option key={item.id} value={item.valueEn} label={item.valueEn}>{item.valueEn}</Option>)))
                                }
                            </Select>)}
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'Prescriber.Special needs' })}>
                            {getFieldDecorator(`customerPet[${index}].needs`, {
                                initialValue: item.needs || '',
                                //  rules: [{ required: true, message: 'Please select Sensitvities!' }],

                            })(<Select
                                disabled={petsList.length > 0 || funType}
                                getPopupContainer={(trigger: any) => trigger.parentNode}
                            >

                                {
                                    specialNeedsList.map(((it) => (<Option key={it.id} value={it.valueEn} label={it.valueEn}>{it.name}</Option>)))
                                }
                            </Select>)}
                        </Form.Item>


                    </Col>
                    <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'Prescriber.Sensitvities' })}>
                            {getFieldDecorator(`customerPet[${index}].lifestyle`, {
                                initialValue: item.lifestyle || '',
                                // rules: [{ required: true, message: 'Please select Lifestyle!' }],

                            })(<Select
                                disabled={petsList.length > 0 || funType}
                                getPopupContainer={(trigger: any) => trigger.parentNode}
                            >

                                {
                                    lifeList.map(((item) => (<Option key={item.id} value={item.valueEn} label={item.valueEn}>{item.name}</Option>)))
                                }
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'Prescriber.Activity' })}>
                            {getFieldDecorator(`customerPet[${index}].activity`, {
                                initialValue: item.activity || '',
                                // rules: [{ required: true, message: 'Please selectActivity!' }],

                            })(<Select
                                disabled={petsList.length > 0 || funType}
                                getPopupContainer={(trigger: any) => trigger.parentNode}
                            >

                                {
                                    activityList.map(((it) => (<Option key={it.id} value={it.valueEn} label={it.valueEn}>{it.name}</Option>)))
                                }
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>

                        <Row gutter={20}>

                            <Col span={12}>
                                <Form.Item label={RCi18n({ id: 'Prescriber.Weight' })}>
                                    {getFieldDecorator(`customerPet[${index}].measure`, {
                                        initialValue: item.measure || 0,
                                        rules: [{ required: true, message: RCi18n({ id: 'Prescriber.inputWeight' }) }],
                                    })(<Input disabled={petsList.length > 0 || funType} />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="  ">
                                    {getFieldDecorator(`customerPet[${index}].measureUnit`, {
                                        initialValue: item.measureUnit || 'Kg',
                                    })(<Select
                                        disabled={petsList.length > 0 || funType}
                                        getPopupContainer={(trigger: any) => trigger.parentNode}
                                    >

                                        {
                                            weightList.map(((it, indexs) => (<Option key={indexs} value={it.value} label={it.value}>{it.name}</Option>)))
                                        }
                                    </Select>)}
                                </Form.Item>
                            </Col>
                        </Row>


                    </Col>
                    <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'Prescriber.Sterilzed' })}>
                            {getFieldDecorator(`customerPet[${index}].sterilized`, {
                                defaultValue: 0,
                                initialValue: item.sterilized,
                                rules: [{ required: true, message: RCi18n({ id: 'Prescriber.selectSterilzed' }) }],
                            })(<Radio.Group disabled={petsList.length > 0 || funType}>
                                <Radio value={1}><FormattedMessage id="Prescriber.Yes" /></Radio>
                                <Radio value={0}><FormattedMessage id="Prescriber.No" /></Radio>
                            </Radio.Group>)}
                        </Form.Item>
                    </Col>
                </Row>

            </Col>
        ))

    }



    render() {
        const { getFieldDecorator,getFieldValue } = this.props.form
        const { felinReco, appointmentVO, petsList, funType ,customerPet} = this.props;
        const { loading } = this.state
        getFieldDecorator('customerPet', { initialValue: customerPet.toJS()||[] });
        const customer = getFieldValue('customerPet');
        console.log(customer,'=======',customerPet.toJS())
        return (
            <Spin spinning={loading}>
                <Form onSubmit={this.next}>
                    <Row gutter={20}>
                        <Col span={6}>
                            <Form.Item label={RCi18n({ id: 'Prescriber.Date' })}>
                                {getFieldDecorator('fillDate', {
                                    initialValue: moment(felinReco.fillDate, 'YYYY-MM-DD'),
                                    rules: [{ required: true, message: RCi18n({ id: 'selectfillDate' }) }],
                                })(<DatePicker style={{ width: '100%' }} />)}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={RCi18n({ id: 'Prescriber.Expert name' })}>
                                {getFieldDecorator('expert', {
                                    initialValue: felinReco.expert,
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={RCi18n({ id: 'Prescriber.pour' })}>
                                {getFieldDecorator('consumerName', {
                                    initialValue: appointmentVO.consumerName || '',
                                })(<Input disabled={petsList.length > 0 || funType} />)}
                            </Form.Item>
                        </Col>
                        <Col span={6} style={{ textAlign: 'center' }}>
                            {!funType && <div >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{(window as any).RCi18n({ id: 'Prescriber.appointmentId' })}</span>
                                    <QRScaner id="scan" onScanEnd={this.findByApptNo}>
                                        <Icon type="scan" style={{
                                            fontSize: 40,
                                            color: '#E1021A',
                                            cursor: 'pointer',
                                        }} />
                                    </QRScaner>
                                </div>
                                <div style={{ marginTop: 3 }} className="pets-search-app">
                                    <Search style={{ width: '100%' }} placeholder={(window as any).RCi18n({ id: 'Prescriber.enterPlaceholder' })} onSearch={value => this.findByApptNo(value)} enterButton />
                                </div>


                            </div>
                            }
                        </Col>
                    </Row>
                    <Row gutter={20}>

                        <Col span={8}>
                            <Form.Item label={RCi18n({ id: 'Prescriber.Pet.owner.name' })}>
                                {getFieldDecorator('appointmentVO.consumerName', {
                                    initialValue: appointmentVO.consumerName || '',
                                })(<Input disabled={petsList.length > 0 || funType} />)}
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label={RCi18n({ id: 'Prescriber.Phone.number' })}>
                                {getFieldDecorator('appointmentVO.consumerPhone', {
                                    initialValue: appointmentVO.consumerPhone || '',
                                })(<Input disabled={petsList.length > 0 || funType} />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={RCi18n({ id: 'Prescriber.Email' })}>
                                {getFieldDecorator('appointmentVO.consumerEmail', {
                                    initialValue: appointmentVO.consumerEmail || '',
                                })(<Input disabled={petsList.length > 0 || funType} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20} >
                        <Col span={8}>
                            <Form.Item>
                                <Select style={{ width: '100%' }}
                                    onChange={this._onChangePets}
                                >
                                    {petsList.length > 0 && petsList.map(item => {
                                        return <Option key={item.petsId} value={item.petsId}>{item.petsName}</Option>
                                    })}

                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item>
                                <Button type="primary" onClick={this.addPet}>+ Add Pets</Button>
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={20}>
         
                        {this.renderMorePetsForm(customer)}
                    </Row>
                    <div className="steps-action">

                        <Button style={{ marginRight: 15 }}>
                            <FormattedMessage id="Prescriber.Previous" />
                        </Button>
                        <Button type="primary" htmlType="submit" >
                            <FormattedMessage id="Prescriber.Next" />
                        </Button>
                    </div>
                </Form>


            </Spin>
        )
    }
}


export default Form.create()(FillinPetInfoForm)