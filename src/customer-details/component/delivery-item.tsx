import React from 'react';
import { Form, Input, Select, Spin, Row, Col, Button, message, AutoComplete } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Headline, cache } from 'qmkit';
import { getCountryList, getStateList, getCityList, searchCity } from './webapi';
import { updateAddress, addAddress } from '../webapi';
import _ from 'lodash';

const { Option } = Select;

type TDelivery = {
  deliveryAddressId?: string;
  firstName?: string;
  lastName?: string;
  consigneeNumber?: string;
  postCode?: string;
  countryId?: number;
  province?: string;
  city?: string;
  address1?: string;
  address2?: string;
  rfc?: string;
};

interface Iprop extends FormComponentProps {
  delivery: TDelivery;
  customerId: string;
  addressType: string;
  backToDetail?: Function;
}

class DeliveryItem extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || '',
      loading: false,
      countryList: [],
      stateList: [],
      cityList: []
    };
  }

  componentDidMount() {
    this.getDics();
  }

  getDics = async () => {
    const countries = await getCountryList();
    const states = await getStateList();
    this.setState({
      countryList: countries,
      stateList: states
    });
  };

  saveAddress = () => {
    const { delivery, backToDetail } = this.props;
    this.props.form.validateFields((err, fields) => {
      if (!err) {
        this.setState({ loading: true });
        const handlerFunc = delivery.deliveryAddressId ? updateAddress : addAddress;
        handlerFunc({
          ...delivery,
          ...fields,
          customerId: this.props.customerId,
          consigneeName: fields.firstName + ' ' + fields.lastName,
          deliveryAddress: fields.address1 + fields.address2,
          isDefaltAddress: 0,
          type: this.props.addressType.toUpperCase()
        })
          .then((data) => {
            message.success(data.res.message);
            backToDetail();
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      }
    });
  };

  searchCity = (txt: string) => {
    searchCity(txt).then((data) => {
      this.setState({
        cityList: data.res.context.systemCityVO
      });
    });
  };

  render() {
    const { delivery, addressType, backToDetail } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    return (
      <div>
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px', position: 'fixed', marginLeft: '5%' }} alt="" />}>
          <div className="container">
            <Headline title={`${delivery.deliveryAddressId ? 'Edit' : 'Add'} ${addressType === 'delivery' ? 'delivery' : 'billing'} information`} />
            <Form {...formItemLayout}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="First name">
                    {getFieldDecorator('firstName', {
                      initialValue: delivery.firstName,
                      rules: [{ required: true, message: 'First name is required' }]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Last name">
                    {getFieldDecorator('lastName', {
                      initialValue: delivery.lastName,
                      rules: [{ required: true, message: 'Last name is required' }]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phone number">
                    {getFieldDecorator('consigneeNumber', {
                      initialValue: delivery.consigneeNumber,
                      rules: [{ required: true, message: 'Phone number is required' }]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Post code">
                    {getFieldDecorator('postCode', {
                      initialValue: delivery.postCode,
                      rules: [{ required: true, message: 'Post code is required' }]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Country">
                    {getFieldDecorator('countryId', {
                      initialValue: delivery.countryId,
                      rules: [{ required: true, message: 'Country is required' }]
                    })(
                      <Select>
                        {this.state.countryList.map((item) => (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                {this.state.storeId == 123457910 && (
                  <Col span={12}>
                    <Form.Item label="State">
                      {getFieldDecorator('province', {
                        initialValue: delivery.province,
                        rules: [{ required: true, message: 'State is required' }]
                      })(
                        <Select showSearch>
                          {this.state.stateList.map((item) => (
                            <Option value={item.stateName} key={item.id}>
                              {item.stateName}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                )}
                <Col span={12}>
                  <Form.Item label="City">
                    {getFieldDecorator('city', {
                      rules: [{ required: true, message: 'City is required' }],
                      initialValue: delivery.city
                    })(<AutoComplete dataSource={this.state.cityList.map((city) => city.cityName)} onSearch={_.debounce(this.searchCity, 500)} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Address 1">
                    {getFieldDecorator('address1', {
                      initialValue: delivery.address1,
                      rules: [{ required: true, message: 'Address is required' }]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Address 2">
                    {getFieldDecorator('address2', {
                      initialValue: delivery.address2
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Reference">
                    {getFieldDecorator('rfc', {
                      initialValue: delivery.rfc
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <div className="bar-button">
            <Button type="primary" onClick={() => this.saveAddress()}>
              Save
            </Button>
            <Button onClick={() => backToDetail()} style={{ marginLeft: '20px' }}>
              Cancel
            </Button>
          </div>
        </Spin>
      </div>
    );
  }
}

export default Form.create<Iprop>()(DeliveryItem);
