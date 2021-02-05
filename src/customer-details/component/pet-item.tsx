import React from 'react';
import { Form, Row, Col, Input, Select, Radio, Spin, Breadcrumb, DatePicker, Button, Popconfirm } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Headline, BreadCrumb } from 'qmkit';
import moment from 'moment';

const { Option } = Select;

type TPet = {
  id: number;
  picture: string;
  petsType: string;
  petsName: string;
  petsSex: number;
  petsBreed: string;
  petsSizeValueName: string;
  sterilized: number;
  birthOfPets: string;
  customerPetsPropRelations: Array<string>;
};

interface Iprop extends FormComponentProps {
  pet: TPet;
}

class PetItem extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {
    const { pet } = this.props;
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
          <Breadcrumb.Item>Edit pet information</Breadcrumb.Item>
        </BreadCrumb>
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px', position: 'fixed', marginLeft: '5%' }} alt="" />}>
          <div className="container-search">
            <Headline title="Edit pet information" />
            <Row gutter={16}>
              <Col span={4}></Col>
              <Col span={20}>
                <Form {...formItemLayout}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Pet category">
                        {getFieldDecorator('petsType', {
                          initialValue: pet.petsType,
                          rules: [{ required: true, message: 'Pet category is required' }]
                        })(<Select />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Pet name">
                        {getFieldDecorator('petsName', {
                          initialValue: pet.petsName,
                          rules: [{ required: true, message: 'Pet name is required' }]
                        })(<Input />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Gender">
                        {getFieldDecorator('petsSex', {
                          initialValue: pet.petsSex,
                          rules: [{ required: true, message: 'Gender is required' }]
                        })(<Select />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Breed">
                        {getFieldDecorator('petsBreed', {
                          initialValue: pet.petsBreed,
                          rules: [{ required: true, message: 'Breed is required' }]
                        })(<Select />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Weight">
                        {getFieldDecorator('petsSizeValueName', {
                          initialValue: pet.petsSizeValueName,
                          rules: [{ required: true, message: 'Weight is required' }]
                        })(<Select />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Sterilized status">
                        {getFieldDecorator('sterilized', {
                          initialValue: pet.sterilized,
                          rules: [{ required: true, message: 'Sterilized status is required' }]
                        })(
                          <Radio.Group>
                            <Radio value={1}>Yes</Radio>
                            <Radio value={0}>No</Radio>
                          </Radio.Group>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Birthday">
                        {getFieldDecorator('birthOfPets', {
                          initialValue: moment(pet.birthOfPets),
                          rules: [{ required: true, message: 'Birthday is required' }]
                        })(<DatePicker />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Special needs">
                        {getFieldDecorator('customerPetsPropRelations', {
                          initialValue: pet.customerPetsPropRelations,
                          rules: [{ required: true, message: 'Special needs is required' }]
                        })(<Select mode="tags" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
            <Row gutter={30} type="flex" align="middle">
              <Col span="16">
                <Button type="primary">Save</Button>
                <Button>Cancel</Button>
              </Col>
              <Col span={8}>
                <Popconfirm placement="topRight" title="Are you sure to delete this item?" onConfirm={() => {}} okText="Confirm" cancelText="Cancel">
                  <Button type="link">Delete pet profile</Button>
                </Popconfirm>
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    );
  }
}
