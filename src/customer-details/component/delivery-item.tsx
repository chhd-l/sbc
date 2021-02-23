import React from 'react';
import { Form, Input, Select, Spin, Breadcrumb, Row, Col, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Headline, BreadCrumb } from 'qmkit';
import { getCountryList } from './webapi';

const { Option } = Select;

type TDelivery = {
  id?: number | undefined;
  firstName: string;
  lastName: string;
  consigneeNumber: string;
  postCode: string;
  countryId: number;
  cityId: number;
  address1: string;
  address2: string;
  rfc: string;
};

interface Iprop extends FormComponentProps {
  delivery: TDelivery;
}

class DeliveryItem extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      countryList: []
    };
  }

  componentDidMount() {
    this.getCountries();
  }

  getCountries = async () => {
    const countries = await getCountryList();
    this.setState({
      countryList: countries
    });
  };

  render() {
    const { delivery } = this.props;
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
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>Detail</Breadcrumb.Item>
          <Breadcrumb.Item>{delivery.id ? 'Edit delivery information' : 'Add delivery information'}</Breadcrumb.Item>
        </BreadCrumb>
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px', position: 'fixed', marginLeft: '5%' }} alt="" />}>
          <div className="container-search">
            <Headline title={delivery.id ? 'Edit delivery information' : 'Add delivery information'} />
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
              </Row>
              <Row gutter={16}>
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
              </Row>
              <Row gutter={16}>
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
                <Col span={12}>
                  <Form.Item label="City">
                    {getFieldDecorator('cityId', {
                      initialValue: delivery.cityId,
                      rules: [{ required: true, message: 'City is required' }]
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
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
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Reference">
                    {getFieldDecorator('rfc', {
                      initialValue: delivery.rfc
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div>
              <Button type="primary">Save</Button>
              <Button>Cancel</Button>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(DeliveryItem);
