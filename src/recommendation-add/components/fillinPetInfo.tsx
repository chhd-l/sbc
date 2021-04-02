import { Checkbox, Col, DatePicker, Form, Input, Radio, Row, Select, Spin } from 'antd'
import React, { Component } from 'react'
const { Option } = Select;
import { querySysDictionary } from '../webapi'
export default class FillinPetInfo extends Component {
    props: {
        form: any,
        allParams: any
    }
    state = {
        lifeList: [],
        activityList: [],
        specialNeedsList: [],
        petsBreedList: [],
        fetching: false,
        weightList: [
            { value: 'kg', name: 'kg' }
            // { value: 'g', name: 'g' }
        ],
        activity: '',
        lifestyle: '',
        weightObj: {
            measure: '',
            measureUnit: '',
            type: 2
        },
        pets: {
            birthOfPets: null,
            petsId: null,
            petsImg: null,
            petsBreed: null,
            petsName: null,
            petsSex: null,
            petsSizeValueId: '10086',
            petsSizeValueName: null,
            petsType: null,
            sterilized: '0',
            storeId: null,
            isPurebred: null,
            activity: null,
            lifestyle: null,
            weight: null
        }
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
        let { res: lifesOptions } = await querySysDictionary({ type, name: keywords });
        // let { res: lifestyleOptions } = await querySysDictionary({ type: 'Lifestyle' });
        // let { res: activityOptions } = await querySysDictionary({ type: 'Activity' });
        // let { res: specialNeedsOptions } = await querySysDictionary({ type: 'specialNeeds' })
        // let { res: breedOptions } = await querySysDictionary({ type: 'CatBreed' })
        let lifeList = lifesOptions.context.sysDictionaryVOS.map((el) => {
            el.value = el.valueEn;
            return el;
        });
        this.setState({
            [name]: lifeList,
            fetching: false
        });
    }

    renderSelectOptions(list) {
        return list.map(item => (<Option key={item.value} value={item.value}>{item.value}</Option>))
    }
    onChange = (value) => {


    };
    onSearch = async (value) => {
        this.setState({ petsBreedList: [], fetching: true });
        this.getDictAlllist('DogBreed', 'petsBreedList', value)
    };
    render() {
        const { getFieldDecorator } = this.props.form
        const param = this.props.allParams
        const { lifeList, activityList, specialNeedsList, petsBreedList, weightList, fetching } = this.state
        return (
            <Form style={{ width: '50%', margin: '0 auto' }}>
                <Row gutter={20}>
                    <Col span={8}>
                        <Form.Item label="Date:">
                            {getFieldDecorator('fillDate', {
                                defaultValue: '',
                                initialValue: param.fillDate,
                                rules: [{ required: true, message: 'Please select  date!' }],
                            })(<DatePicker style={{ width: '100%' }}

                            />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Expert name:">
                            {getFieldDecorator('expert', {
                                initialValue: param.expert,
                                // rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Input disabled />)}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="pour[First Name Last Name]:">
                            {getFieldDecorator('select3', {
                                defaultValue: '',
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Input />)}
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
                                initialValue: param.petsName,
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Gender:">
                            {getFieldDecorator('petsSex', {
                                defaultValue: 0,
                                initialValue: param.petsSex,
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Radio.Group >
                                <Radio value={1}>Female</Radio>
                                <Radio value={0}>Male</Radio>
                            </Radio.Group>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Date of birth:">
                            {getFieldDecorator('birthOfPets', {
                                defaultValue: '',
                                initialValue: param.birthOfPets,
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<DatePicker />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Breed:">
                            {getFieldDecorator('petsBreed', {
                                defaultValue: '',
                                initialValue: param.petsBreed,
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Select 
                                showSearch 
                                getPopupContainer={(trigger: any) => trigger.parentNode}
                                notFoundContent={fetching ? <Spin size="small" /> : null}
                                placeholder="Please input your Pet owner account!"
                                defaultActiveFirstOption={false}
                                filterOption={false}
                                onSearch={this.onSearch}
                                onChange={this.onChange}>
                                {this.renderSelectOptions(petsBreedList)}
                            </Select>)}
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item label="Sensitvities:">
                            {getFieldDecorator('sensitivity', {
                                defaultValue: '',
                                initialValue: param.sensitivity,
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Select
                                getPopupContainer={(trigger: any) => trigger.parentNode}
                            >
                                {this.renderSelectOptions(specialNeedsList)}

                            </Select>)}
                        </Form.Item>


                    </Col>
                    <Col span={12}>
                        <Form.Item label="Lifestyle">
                            {getFieldDecorator('lifestyle', {
                                defaultValue: '',
                                initialValue: param.lifestyle,
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Select 
                                getPopupContainer={(trigger: any) => trigger.parentNode}
                            >
                                {this.renderSelectOptions(lifeList)}

                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Activity:">
                            {getFieldDecorator('activity', {
                                defaultValue: '',
                                initialValue: param.activity,
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Select
                                getPopupContainer={(trigger: any) => trigger.parentNode}
                            >
                                {this.renderSelectOptions(activityList)}
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>


                        <Form.Item label="Weight">
                            <Row gutter={20}>
                                <Col span={12}>
                                    {getFieldDecorator('weight', {
                                        defaultValue: 0,
                                        initialValue: param.weight,
                                        rules: [{ required: true, message: 'Please select your country!' }],
                                    })(<Input />)}
                                </Col>
                                <Col span={12}>
                                    {getFieldDecorator('weightCategory', {
                                        defaultValue: 'Kg',
                                        initialValue: param.weightCategory,
                                    })(<Select 
                                        getPopupContainer={(trigger: any) => trigger.parentNode}
                                    >
                                        {this.renderSelectOptions(weightList)}
                                    </Select>)}
                                </Col>
                            </Row>
                        </Form.Item>





                    </Col>
                    <Col span={12}>
                        <Form.Item label="Sterilzed">
                            {getFieldDecorator('sterilized', {
                                defaultValue: '0',
                                initialValue: param.sterilized,
                                rules: [{ required: true, message: 'Please select your country!' }],
                            })(<Radio.Group >
                                <Radio value="1">Yes</Radio>
                                <Radio value="0">No</Radio>
                            </Radio.Group>)}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>


        )
    }
}
