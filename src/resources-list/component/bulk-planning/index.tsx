import React from 'react';
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
import { HighlightSpanKind } from '_@ts-morph_common@0.9.2@@ts-morph/common/lib/typescript';
import form from '@/order-return-edit/components/form';
import SetDayTable from '../set-day-table';
import ServiceSetting from '../service-setting';

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


// @ts-ignore
@Form.create()
export default class BulkPlanningModal extends React.Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      dataSource: [],
      editList: [], // 已存在待编辑SkuMappingList
      ruleNo: 0,
      count: 0,
      loading: false,
      columns: [],
      allDays: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      days: [],
      daysList: [{
        days: [],
        times: [{ startTime: '00:00', endTime: '23:59', sort: 1 }]
      }],
      deliveryForm: {
        deliveryOption: 1,
        city: [],
        rangeDays: 5,
        cutOffTime: null,
        openDate: [
          {
            weeks: [],
            times: [{ startTime: '00:00', endTime: '23:59', sort: 1 }],
            sort: 1
          }
        ],
        closeDate: [
          {
            closeDay: null,
            sort: 1
          }
        ]
      },
      planningSetCounts:[1],
      visible: props.visible,
    }
  }

  componentDidMount() {
    let _date = moment(sessionStorage.getItem(cache.CURRENT_YEAR) ? sessionStorage.getItem(cache.CURRENT_YEAR) : new Date());
    let days = this.state.allDays.map(item => _date.day(item).format('M.DD'));
    console.log(days, 'foremd')
    this.setState({
      daysList: [{
        days,
        times: [{ startTime: '00:00', endTime: '23:59', sort: 1 }]
      }]
    }, () => {
      console.log(this.state.daysList, 'daysList')
    })


  }

  handleOk = () => {
    let {
      onOk,
      goodsInfoId,
      sku,
    } = this.props;
    let {
      ruleNo,
      editList,
    } = this.state;
    if (!goodsInfoId) return;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({ confirmLoading: true })
        let pattern = /^[0-9]*$/g;
        /**
         * 编辑和新增的mappings一起提交，编辑的list需要返回原来已存在的字段
         *
         * 待编辑id为字符串，新增的id为数字，
         **/

        let mappings = values.mappings.map(item => {
          // 是否为新增的数据
          if (pattern.test(item.id)) {
            return {
              internalSkuId: goodsInfoId,
              internalSkuNo: sku,
              externalSkuNo: item.externalSkuNo,
              condition: {
                startTime: item.condition[0].format(Const.TIME_FORMAT),
                endTime: item.condition[1].format(Const.TIME_FORMAT)
              }
            }
          } else {
            const found = editList.find(element => element.id === item.id);
            let editItem = !!found ? found : {};
            return {
              ...editItem,
              internalSkuId: goodsInfoId,
              internalSkuNo: sku,
              externalSkuNo: item.externalSkuNo,
              condition: {
                startTime: item.condition[0].format(Const.TIME_FORMAT),
                endTime: item.condition[1].format(Const.TIME_FORMAT)
              }
            }
          }

        })
        let params = {
          goodsInfoId,
          mappings,
          ruleNo,
        }
        let { res } = await saveSkuMapping(params);
        this.setState({ confirmLoading: false })

        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully', 2);
          // 提交成功的回调
          onOk && onOk({
            sku,
            res,
            ...params,
          })
        }

      }
    });
  };

  handleCancel = () => {
    let { onCancel } = this.props;
    onCancel();
  };

  handleAddSetting = () => {

  }

  render() {
    let allDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const {planningSetCounts} = this.state;
    const {serviceTypeDict} = this.props;
    return (
      <Modal
        width={1100}
        title={<strong><FormattedMessage id="Resources.bulk_planning" /></strong>}
        visible={this.props.visible}
        // confirmLoading={confirmLoading}
        maskClosable={false}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText={<FormattedMessage id="save" />}
      >
        <ServiceSetting addCounts={planningSetCounts} serviceTypeDict={serviceTypeDict}/>
      </Modal>
    );
  }
}