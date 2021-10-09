import { Button, Checkbox, Col, DatePicker, Form, Icon, Input, message, Radio, Row, Select, Spin } from 'antd'
import React, { Component } from 'react'
import { QRScaner, noop, RCi18n } from 'qmkit';
const { Option } = Select;
import { querySysDictionary } from '../webapi'
import {  Relax } from 'plume2';
import { IMap, IList } from 'typings/globalType';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import FillinPetInfoForm from './fillinPetInfoForm';
const { Search } = Input;
@Relax
class FillinPetInfo extends Component {
    props: {
        relaxProps?: {
            felinReco: IMap
            customerPet: IList
            appointmentVO: IMap,
            onChangePestsForm: Function,
            findByApptNo: Function,
            funType: boolean,
            petsList: IList
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
        customerPet: [],
        fetching: false,
        loading: false,
        weightList: [
            { value: 'kg', name: 'kg' }
            // { value: 'g', name: 'g' }
        ],
    }
    componentDidMount() {
        const { felinReco, onChangePestsForm } = this.props.relaxProps;
        if (!felinReco.fillDate) {
            onChangePestsForm({ ...felinReco, fillDate: moment().format('YYYY-MM-DD') }, 'felinReco')
        }

    }

  
    next = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }




    render() {
        const { getFieldDecorator } = this.props.form
        const { felinReco, appointmentVO, petsList,customerPet, funType,onChangePestsForm,findByApptNo } = this.props.relaxProps;
       console.log(felinReco, appointmentVO, petsList,customerPet, )
        const { loading } = this.state
        return (
            <Spin spinning={loading}>
               <FillinPetInfoForm 
                onChangePestsForm={onChangePestsForm}
                findByApptNo={findByApptNo} 
                felinReco={felinReco}
                 appointmentVO={appointmentVO} 
                 customerPet={customerPet}
                 petsList={petsList}
                  funType={funType}/>


            </Spin>
        )
    }
}

export default Form.create()(FillinPetInfo);
