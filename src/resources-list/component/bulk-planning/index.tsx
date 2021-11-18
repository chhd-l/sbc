import React from 'react';
import { Modal } from 'antd';

import { FormattedMessage } from 'react-intl';
import { Const } from 'qmkit';
import _ from 'lodash';
import ServiceSetting from '../service-setting';
import * as webapi from '../../webapi';
export default class BulkPlanningModal extends React.Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      batchSettingData: {
        resourceServicePlanVOList: [{
          serviceTypeId: null,
          serviceSort: 1,//serviceType的设置顺序
          resourceWeekPlanVOList: [{
            sort: 1,//一个serviceType下,日期选择行的顺序
            timeSlotVO: {
              id: null,
              // timeSlot: "00:00-23:59|00:00-23:59",
              timeSlot: "",
            },
            resourceDatePlanVOS: []
          }]
        }]
      },
      // saveData: {}
    }
  }

  handleOk = () => {
    this.batchSaveData()
  };

  batchSaveData = async () => {
    const { selectedEmployeeIds } = this.props
    let params = {
      employeeIds: selectedEmployeeIds,
      ...this.state.batchSettingData,
    }
    const { res } = await webapi.batchSaveOrUpdate(params)
    if (res.code == Const.SUCCESS_CODE) {
      this.setState({
        batchSettingData: {
          resourceServicePlanVOList: [{
            serviceTypeId: null,
            serviceSort: 1,//serviceType的设置顺序
            resourceWeekPlanVOList: [{
              sort: 1,//一个serviceType下,日期选择行的顺序
              timeSlotVO: {
                id: null,
                timeSlot: "",
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
    let _data = _.cloneDeep(data)
    this.setState({
      // saveData: data,
      batchSettingData: _data
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