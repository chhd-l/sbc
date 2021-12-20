import React, { Component } from 'react';
import { Const, history, ValidConst } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Form, Input, DatePicker, Modal, message } from 'antd';
import * as webapi from '../webapi';
import moment from 'moment';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class CouponModal extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      searchForm: {
        activityName: '',
        time: [],
        goodsNo2: ''
      }
    };
  }

  handleOk = () => {
    this.props.form.validateFields((err, value) => {
      if (!err) {
        webapi.addCouponActivity({
          ...value,
          couponId: this.props.couponId,
          startTime: value.time[0].format(Const.TIME_FORMAT),
          endTime: value.time[1].format(Const.TIME_FORMAT),
          joinLevel: 2,
          couponActivityType: 1, // 指定赠券
          receiveType: 1,
          receiveCount: 1,
          platformFlag: 1, // 店铺
          couponActivityConfigs: [{ couponId: this.props.couponId, totalCount: value.totalCount }]
        }).then(res => {
          if (res.res.code == Const.SUCCESS_CODE) {
            message.success('Operate successfully');
            history.push({
              pathname: `/coupon-detail/${this.props.couponId}/2`
            });
          }else if(res.res.code == 'K-080106'){
            this.props.form.setFields({
              time:{
                errors:[
                  new Error((window as any).RCi18n({
                    id: 'Marketing.ValidityDates'
                  }))
                ]
              }
            })
          }
        });
      }
    });
  };
  handleCancel = () => {
    this.props.form.setFields({
      time:{}
    });
    this.props.form.resetFields();
    const { setVisible } = this.props;
    setVisible();
  };

  render() {
    const { isModalVisible } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal title=""
             width="30%"
             closable={false}
             okText="Save"
             cancelText="Cancel"
             visible={isModalVisible}
             onOk={this.handleOk}
             onCancel={this.handleCancel}>
        <Form className="filter-content"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 16 }}
        >
          <FormItem label={<FormattedMessage id="Marketing.ActivityName" />}>
            {getFieldDecorator('activityName', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: <FormattedMessage id="Marketing.theActivityShould" />
                },
                { min: 1, max: 100, message: <FormattedMessage id="Marketing.100Wrods" /> },
              ]
            })(<Input placeholder="No more than one hundred words"/>)}
          </FormItem>
          <FormItem label={<FormattedMessage id="Marketing.ActivityTime" />}>
            {getFieldDecorator('time', {
              rules: [
                {
                  type: 'array',
                  required: true,
                  whitespace: true,
                  message: 'Please fill in the Activity Time'
                }
              ]
            })(<RangePicker
              style={{width:'100%'}}
              format={Const.TIME_FORMAT}
              disabledDate={(current) => {
                return current && current < moment().startOf('day');
              }}
              showTime={{ format: 'HH:mm:ss' }}
              placeholder={[
                (window as any).RCi18n({
                  id: 'Marketing.StartTime'
                }),
                (window as any).RCi18n({
                  id: 'Marketing.EndTime'
                })
              ]}
            />)}
          </FormItem>
          <FormItem label={<FormattedMessage id="Marketing.numberCodes" />}>
            {getFieldDecorator('totalCount', {
              rules: [
                {
                  required: true,
                  validator: (_rule, value, callback) => {
                    if (value) {
                      if (!ValidConst.noZeroNumber.test(value)) {
                        callback('Please fill in the Number of codes');
                      }
                    }
                    callback();
                  }
                }
              ]
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(CouponModal);
