import React from 'react';
import { Form, Input, Select, Spin, Breadcrumb, Row, Col, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Headline, BreadCrumb } from 'qmkit';
import { getCountryList } from './webapi';
import { FormattedMessage } from 'react-intl';

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
          <Breadcrumb.Item>
            <FormattedMessage id="PetOwner.Detail" />
          </Breadcrumb.Item>
          <Breadcrumb.Item>{delivery.id ? <FormattedMessage id="PetOwner.EditDeliveryInformation" /> : <FormattedMessage id="PetOwner.AddDeliveryInformation" />}</Breadcrumb.Item>
        </BreadCrumb>
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px', position: 'fixed', marginLeft: '5%' }} alt="" />}>
          <div className="container-search">
            <Headline title={delivery.id ? <FormattedMessage id="PetOwner.EditDeliveryInformation" /> : <FormattedMessage id="PetOwner.AddDeliveryInformation" />} />
            <Form {...formItemLayout}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.FirstName" />}>
                    {getFieldDecorator('firstName', {
                      initialValue: delivery.firstName,
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.FirstNameIsRequired" /> }]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.LastName" />}>
                    {getFieldDecorator('lastName', {
                      initialValue: delivery.lastName,
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.LastNameIsRequired" /> }]
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.PhoneNumber" />}>
                    {getFieldDecorator('consigneeNumber', {
                      initialValue: delivery.consigneeNumber,
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.PhoneNumberIsRequired" /> }]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.PostCode" />}>
                    {getFieldDecorator('postCode', {
                      initialValue: delivery.postCode,
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.PostCodeIsRequired" /> }]
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.Country" />}>
                    {getFieldDecorator('countryId', {
                      initialValue: delivery.countryId,
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.CountryIsRequired" /> }]
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
                  <Form.Item label={<FormattedMessage id="PetOwner.City" />}>
                    {getFieldDecorator('cityId', {
                      initialValue: delivery.cityId,
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.CityIsRequired" /> }]
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.Address1" />}>
                    {getFieldDecorator('address1', {
                      initialValue: delivery.address1,
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.AddressIsRequired" /> }]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.Address2" />}>
                    {getFieldDecorator('address2', {
                      initialValue: delivery.address2
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.Reference" />}>
                    {getFieldDecorator('rfc', {
                      initialValue: delivery.rfc
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div>
              <Button type="primary">
                <FormattedMessage id="PetOwner.Save" />
              </Button>
              <Button>
                <FormattedMessage id="PetOwner.Cancel" />
              </Button>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(DeliveryItem);
