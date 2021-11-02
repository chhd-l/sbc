import React, { useState, useEffect } from 'react';
import {
  Input,
  Modal,
  Table,
  Form,
  DatePicker,
  Popconfirm,
  Icon,
  Divider, message,
  Row, Col, Button, Select, TimePicker,
  Checkbox
} from 'antd';

import { FormattedMessage } from 'react-intl';
import { Const, RCi18n, SelectGroup, cache } from 'qmkit';
import moment from 'moment';
import form from '@/order-return-edit/components/form';
import SetDayTable from '../set-day-table';
import ServiceSetting from '../service-setting';
import * as webapi from '../../webapi';

const styles = {
  label: {
    width: 151,
    textAlign: 'center'
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 25,
    fontSize: 13,
    fontWeight: 600,
  },
} as any;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default class BulkPlanningModal extends React.Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      batchSettingData: {
        resourceServicePlanVOList: [{
          serviceTypeId: null,
          serviceSort: "1",//serviceType的设置顺序
          resourceWeekPlanVOList: [{
            sort: "1",//一个serviceType下,日期选择行的顺序
            timeSlotVO: {
              id: null,
              // timeSlot: "00:00-23:59|00:00-23:59",
              timeSlot: "00:00-23:59",
            },
            resourceDatePlanVOS: []
          }]
        }]
      },
      saveData: {}
    }
  }

  handleOk = () => {
    this.batchSaveData()
  };

  batchSaveData = async() => {
    const {selectedEmployeeIds} = this.props
    console.log(this.state.saveData,'saveData66')
    let params = {
      employeeIds:selectedEmployeeIds,
      ...this.state.saveData,
    }
    const {res} = await webapi.batchSaveOrUpdate(params)
    console.log(res,'ressssucc')
    if(res.code == Const.SUCCESS_CODE) {
      this.setState({
        batchSettingData:{
          resourceServicePlanVOList: [{
            serviceTypeId: null,
            serviceSort: "1",//serviceType的设置顺序
            resourceWeekPlanVOList: [{
              sort: "1",//一个serviceType下,日期选择行的顺序
              timeSlotVO: {
                id: null,
                // timeSlot: "00:00-23:59|00:00-23:59",
                timeSlot: "00:00-23:59",
              },
              resourceDatePlanVOS: []
            }]
          }]
        },
      })
      this.props.onCancel();
    }
  }

  handleCancel = () => {
    this.props.onCancel();
  };

  updateServiceData = (data) => {
    this.setState({
      saveData: data
    })
  }


  render() {
    const { batchSettingData } = this.state;
    const { visible, serviceTypeDict } = this.props;
    return (
      <Modal
        width={1100}
        title={<strong><FormattedMessage id="Resources.bulk_planning" /></strong>}
        visible={visible}
        // confirmLoading={confirmLoading}
        maskClosable={false}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText={<FormattedMessage id="save" />}
      >
        <ServiceSetting
          serviceData={batchSettingData}
          serviceTypeDict={serviceTypeDict}
          updateServiceData={(data) => this.updateServiceData(data)}
        />
      </Modal>
    )
  }
}