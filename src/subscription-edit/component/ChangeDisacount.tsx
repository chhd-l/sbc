import { Button, Modal, Form, Input, Select } from 'antd';
import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl';
import { Headline, Const, cache, AuthWrapper, getOrderStatusValue, RCi18n, util } from 'qmkit';
import { e } from 'mathjs';

const { Option } = Select

function ChangeDisacount(props) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    setVisible(props.addDiscountVisible);
    console.log(props.refillcode.map(item => item.couponCodeDTOList[0]?.couponCode).indexOf(props?.couponCode));

    // 这里要从父组件那里拿，判断有没有添加过折扣，没有的默认位为数组第一个
    if (props.refillcode.map(item => item.couponCodeDTOList[0]?.couponCode).indexOf(props?.couponCode) > -1) {
      setValue(props.refillcode.map(item => item.couponCodeDTOList[0]?.couponCode).indexOf(props?.couponCode))
      props.onChange(props.refillcode.map(item => item.couponCodeDTOList[0]?.couponCode).indexOf(props?.couponCode))
    } else {
      setValue(0);
      props.onChange(0);
    }

  }, [props.addDiscountVisible]);

  const renderSelect = () => {
    return props.refillcode.map((item, index) => {
      return <Option value={index} key={item.couponId}>{Math.round(100 - (item?.couponDiscount * 100)) + '%'}</Option>
    })
  }
  // couponCode
  return (
    <Modal
      title={<FormattedMessage id={'Marketing.Promotion'} />}
      // closable={false}
      maskClosable={false}
      // mask={false}
      width={800}
      visible={visible}
      onOk={props.onOK}
      onCancel={props.onCancel}
    >
      <p >
        <FormattedMessage id={'Marketing.addDiscountTitle'} />
      </p>
      <br />
      <div>
        <Form layout={'inline'}>
          <Form.Item
            label={<FormattedMessage id="Marketing.PromotionOnNextRefill" />}
            required={true}
          >
            <Select
              value={value}
              style={{ width: 200 }}
              onChange={(index) => {
                props.onChange(index);
                setValue(index)
              }
              }>
              {renderSelect()}
            </Select>
          </Form.Item>
        </Form>
      </div>
    </Modal>

  )
}

export default ChangeDisacount;
