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
        form: any
        recommendParams: any
        savepetsRecommendParams: Function
        findByApptNo: Function
        onChangeStep:Function
        funType: boolean,
        petsList: any
    }

    state = {
        stateCustomPet: {},
        sourceKeys: [],
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
        currentPet:{}

    }

    componentDidMount() {
        const { recommendParams } = this.props;
        this.getDictAlllist('Lifestyle', 'lifeList');
        this.getDictAlllist('Activity', 'activityList');
        this.getDictAlllist('specialNeeds', 'specialNeedsList');
        this.getDictAlllist('CatBreed', 'petsBreedList')
        let _c = recommendParams?.customerPet ?? []
        console.log(_c,'===============')
        let stateCustomPet = {};
        _c.map(item => {
            stateCustomPet[item.petsId||item.uuid] = item
        })
        this.setState({
            sourceKeys: _c.map(item => (item.petsId||item.uuid)),
            stateCustomPet
        }, () => {

        })
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
        const { petsList } = this.props;
        let pets = petsList.find(item => item.petsId === e)
        this.setState({
            currentPet:pets||{}
        })
    }
    //删除
    remove = (k, index) => {
        const { getFieldValue, setFieldsValue } = this.props.form;
        let keys = getFieldValue('keys')
        if (keys.length === 1) return
        setFieldsValue({
            keys: keys.filter((item) => item !== k),
        })
    };
    //生成唯一id
    uuid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    //添加宠物
    addPet = () => {
        const { getFieldValue, setFieldsValue } = this.props.form;
        const {currentPet,stateCustomPet}:any=this.state
        const keys = getFieldValue('keys');
        let uuid = this.uuid();
        let nextKeys = []
        if(keys.includes(currentPet.petsId)){
            message.warning('You have added the pet!')
            return
        }
        if(currentPet&&currentPet.petsId){
            this.setState({
                stateCustomPet:{...stateCustomPet,[currentPet.petsId]:currentPet}
            })
            nextKeys=[...keys,currentPet.petsId]
        }else{
            nextKeys=[...keys,uuid]
        }
        setFieldsValue({
            keys: nextKeys,
        })
    };
    //上一步
    previous=()=>{
        const { onChangeStep, } = this.props;
        onChangeStep(0)
    }
    //下一步
    next = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { recommendParams, savepetsRecommendParams,onChangeStep } = this.props;
                let customerPet = [];
                for (let item in values.customerPet) {
                    customerPet.push(values.customerPet[item])
                }
                savepetsRecommendParams(Object.assign({},recommendParams,{...values,customerPet}))

                setTimeout(() => {
                    onChangeStep(2)
                }, 300);

            }
        });
    }


    renderMorePetsForm = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { lifeList, activityList, specialNeedsList, stateCustomPet, petsBreedList, weightList, fetching } = this.state
        const keys = getFieldValue('keys');
        return keys.length > 0 && keys.map((item, index) => (
            <Col span={12} key={item}>
                <Row gutter={20} key={item}>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <span className="ant-form-text" style={{ fontWeight: 'bolder' }}><FormattedMessage id="Prescriber.Pet" />{index + 1}:</span>
                        {!stateCustomPet[item]?.petsId&&<Button type="primary" onClick={() => this.remove(item, index)}>删除</Button>}
                    </div>
                    <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'Prescriber.Name' })}>
                            {getFieldDecorator(`customerPet[${item}].petsName`, {
                                initialValue: stateCustomPet[item]?.petsName ?? '',
                                rules: [{ required: true, message: RCi18n({ id: 'Prescriber.inputpetName' }) }],
                            })(<Input disabled={stateCustomPet[item]?.petsId?true:false} />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'Prescriber.Gender' })}>
                            {getFieldDecorator(`customerPet[${item}].petsSex`, {
                                initialValue: stateCustomPet[item]?.petsSex ?? 1,
                                rules: [{ required: true, message: RCi18n({ id: 'Prescriber.selectGender' }) }],

                            })(<Radio.Group disabled={stateCustomPet[item]?.petsId?true:false}>
                                <Radio value={1}><FormattedMessage id="Prescriber.Female" /></Radio>
                                <Radio value={0}><FormattedMessage id="Prescriber.Male" /></Radio>
                            </Radio.Group>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'Prescriber.Dateofbirth' })}>
                            {getFieldDecorator(`customerPet[${item}].birthOfPets`, {
                                initialValue: stateCustomPet[item]?.birthOfPets && moment(stateCustomPet[item]?.birthOfPets ?? null, 'YYYY-MM-DD') || null,
                                rules: [{ required: true, message: RCi18n({ id: 'Prescriber.selectDateofbirth' }) }],

                            })(<DatePicker disabled={stateCustomPet[item]?.petsId?true:false} style={{ width: '100%' }} />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'Prescriber.Breed' })}>
                            {getFieldDecorator(`customerPet[${item}].petsBreed`, {
                                initialValue: stateCustomPet[item]?.petsBreed ?? "",
                                rules: [{ required: true, message: RCi18n({ id: 'Prescriber.selectBreed' }) }],

                            })(<Select
                                showSearch
                                getPopupContainer={(trigger: any) => trigger.parentNode}
                                notFoundContent={fetching ? <Spin size="small" /> : null}
                                placeholder={RCi18n({ id: 'Prescriber.inputyourBreed' })}
                                defaultActiveFirstOption={false}
                                filterOption={false}
                                onSearch={this.onSearch}
                                disabled={stateCustomPet[item]?.petsId?true:false}
                            >
                                {
                                    petsBreedList.map(((it) => (<Option key={it.id} value={it.valueEn} label={it.valueEn}>{it.valueEn}</Option>)))
                                }
                            </Select>)}
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'Prescriber.Special needs' })}>
                            {getFieldDecorator(`customerPet[${item}].needs`, {
                                initialValue: stateCustomPet[item]?.needs ?? '',
                                //  rules: [{ required: true, message: 'Please select Sensitvities!' }],

                            })(<Select
                                disabled={stateCustomPet[item]?.petsId?true:false}
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
                            {getFieldDecorator(`customerPet[${item}].lifestyle`, {
                                initialValue: stateCustomPet[item]?.lifestyle ?? '',
                                // rules: [{ required: true, message: 'Please select Lifestyle!' }],

                            })(<Select
                                disabled={stateCustomPet[item]?.petsId?true:false}
                                getPopupContainer={(trigger: any) => trigger.parentNode}
                            >

                                {
                                    lifeList.map(((it) => (<Option key={it.id} value={it.valueEn} label={it.valueEn}>{it.name}</Option>)))
                                }
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={RCi18n({ id: 'Prescriber.Activity' })}>
                            {getFieldDecorator(`customerPet[${item}].activity`, {
                                initialValue: stateCustomPet[item]?.activity ?? '',
                                // rules: [{ required: true, message: 'Please selectActivity!' }],

                            })(<Select
                                disabled={stateCustomPet[item]?.petsId?true:false}
                                getPopupContainer={(trigger: any) => trigger.parentNode}
                            >

                                {
                                    activityList.map(((it) => (<Option key={it.id} value={it.valueEn} label={it.valueEn}>{it.name}</Option>)))
                                }
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={12} >

                        <Row gutter={20}>

                            <Col span={12}>
                                <Form.Item label={RCi18n({ id: 'Prescriber.Weight' })}>
                                    {getFieldDecorator(`customerPet[${item}].measure`, {
                                        initialValue: stateCustomPet[item]?.measure ?? 0,
                                        rules: [{ required: true, message: RCi18n({ id: 'Prescriber.inputWeight' }) }],
                                    })(<Input disabled={stateCustomPet[item]?.petsId?true:false} />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="  ">
                                    {getFieldDecorator(`customerPet[${item}].measureUnit`, {
                                        initialValue: stateCustomPet[item]?.measureUnit ?? 'Kg',
                                    })(<Select
                                        disabled={stateCustomPet[item]?.petsId?true:false}
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
                            {getFieldDecorator(`customerPet[${item}].sterilized`, {
                                defaultValue: 0,
                                initialValue: stateCustomPet[item]?.sterilized ?? 1,
                                rules: [{ required: true, message: RCi18n({ id: 'Prescriber.selectSterilzed' }) }],
                            })(<Radio.Group disabled={stateCustomPet[item]?.petsId?true:false}>
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
        const { getFieldDecorator } = this.props.form
        let { recommendParams, petsList, funType } = this.props;
        const { appointmentVO } = recommendParams
        const { loading, sourceKeys } = this.state
        getFieldDecorator('keys', { initialValue: sourceKeys || [] });
        // getFieldDecorator('customerPet', { initialValue: {} });

        return (
            <Spin spinning={loading}>
                <Form onSubmit={this.next}>
                    <Row gutter={20}>
                        <Col span={8}>
                            <Form.Item label={RCi18n({ id: 'Prescriber.Date' })}>
                                {getFieldDecorator('fillDate', {
                                    initialValue: moment(recommendParams?.fillDate ?? null, 'YYYY-MM-DD'),
                                    rules: [{ required: true, message: RCi18n({ id: 'selectfillDate' }) }],
                                })(<DatePicker style={{ width: '100%' }} disabled={recommendParams.felinRecoId?true:false}/>)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={RCi18n({ id: 'Prescriber.Expert name' })}>
                                {getFieldDecorator('expert', {
                                    initialValue: recommendParams?.expert ?? '',
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        {/* <Col span={6}>
                            <Form.Item label={RCi18n({ id: 'Prescriber.pour' })}>
                                {getFieldDecorator('consumerName', {
                                    initialValue: appointmentVO?.consumerName ?? '',
                                })(<Input disabled={recommendParams.felinRecoId?true:false} />)}
                            </Form.Item>
                        </Col> */}
                        <Col span={8} style={{ textAlign: 'center' }}>
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
                                    initialValue: appointmentVO?.consumerName ?? '',
                                })(<Input disabled={recommendParams.felinRecoId?true:false} />)}
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label={RCi18n({ id: 'Prescriber.Phone.number' })}>
                                {getFieldDecorator('appointmentVO.consumerPhone', {
                                    initialValue: appointmentVO?.consumerPhone ?? '',
                                })(<Input disabled={recommendParams.felinRecoId?true:false} />)}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={RCi18n({ id: 'Prescriber.Email' })}>
                                {getFieldDecorator('appointmentVO.consumerEmail', {
                                    initialValue: appointmentVO?.consumerEmail ?? '',
                                })(<Input disabled={recommendParams.felinRecoId?true:false} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20} >
                        <Col span={8}>
                            <Form.Item>
                                <Select style={{ width: '100%' }}
                               disabled={recommendParams.felinRecoId?true:false}
                                allowClear
                                    onChange={this._onChangePets}
                                >
                                    {petsList.length > 0 && petsList.map(item => {
                                        return <Option key={item.petsId} value={item.petsId}>{item.petsName}</Option>
                                    })}

                                </Select>
                            </Form.Item>
                        </Col>
                       {!recommendParams.felinRecoId&&<Col span={2} >
                            <Form.Item>
                                <Button type="primary" onClick={this.addPet}>+ Add Pets</Button>
                            </Form.Item>
                        </Col>} 

                    </Row>
                    <Row gutter={20}>

                        {this.renderMorePetsForm()}
                    </Row>
                    <div className="steps-action">

                        <Button style={{ marginRight: 15 }} onClick={this.previous}>
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