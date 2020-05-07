import React from 'react';
import { Relax, IMap } from 'plume2';
import { Form } from 'antd';
import { FindArea } from 'qmkit';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

@Relax
export default class StepOne extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
    };
  };

  static relaxProps = {
    company: 'company'
  };

  render() {
    const { company } = this.props.relaxProps;
    const storeInfo = company.get('storeInfo');
    //拼接地址
    const area = FindArea.addressInfo(storeInfo.get('provinceId'), storeInfo.get('cityId'), storeInfo.get('areaId'));
    return (
      <div>
        <div style={{ width: 520 }}>
          <Form>
            <FormItem {...formItemLayout} required={true} label="商家编号">
              <p style={{ color: '#333' }}>{storeInfo.get('supplierCode')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="商家名称">
              <p style={{ color: '#333' }}>{storeInfo.get('supplierName')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="店铺名称">
              <p style={{ color: '#333' }}>{storeInfo.get('storeName')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系人">
              <p style={{ color: '#333' }}>{storeInfo.get('contactPerson')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系方式">
              <p style={{ color: '#333' }}>{storeInfo.get('contactMobile')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="联系邮箱">
              <p style={{ color: '#333' }}>{storeInfo.get('contactEmail')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="所在地区">
              <p style={{ color: '#333' }}>{area}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="详细地址">
              <p style={{ color: '#333' }}>{storeInfo.get('addressDetail')}</p>
            </FormItem>
            <FormItem {...formItemLayout} required={true} label="商家账号">
              <p style={{ color: '#333' }}>{storeInfo.get('accountName')}</p>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
