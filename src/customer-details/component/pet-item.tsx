import React from 'react';
import { Form, Row, Col, Input, Select, Radio, Spin, DatePicker, Button, Popconfirm, Avatar } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Headline } from 'qmkit';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

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
      <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px', position: 'fixed', marginLeft: '5%' }} alt="" />}>
        <Headline title={<FormattedMessage id="PetOwner.EditPetInformation" />} />
        <Form {...formItemLayout}>
          <Row gutter={16}>
            <Col span={4} style={{ textAlign: 'center' }}>
              <div>
                <Avatar size={120} icon="people" />
              </div>
              <div>
                <Button type="link">
                  <FormattedMessage id="PetOwner.ChangePicture" />
                </Button>
              </div>
            </Col>
            <Col span={20}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.PetCategory" />}>
                    {getFieldDecorator('petsType', {
                      initialValue: pet.petsType,
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.PetCategoryIsRequired" /> }]
                    })(<Select />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.PetName" />}>
                    {getFieldDecorator('petsName', {
                      initialValue: pet.petsName,
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.PetNameIsRequired" /> }]
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.Gender" />}>
                    {getFieldDecorator('petsSex', {
                      initialValue: pet.petsSex,
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.GenderIsRequired" /> }]
                    })(<Select />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.Breed" />}>
                    {getFieldDecorator('petsBreed', {
                      initialValue: pet.petsBreed,
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.BreedIsRequired" /> }]
                    })(<Select />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.Weight" />}>
                    {getFieldDecorator('petsSizeValueName', {
                      initialValue: pet.petsSizeValueName,
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.WeightIsRequired" /> }]
                    })(<Select />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.SterilizedStatus" />}>
                    {getFieldDecorator('sterilized', {
                      initialValue: pet.sterilized,
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.SterilizedStatusIsRequired" /> }]
                    })(
                      <Radio.Group>
                        <Radio value={1}>
                          <FormattedMessage id="PetOwner.Yes" />
                        </Radio>
                        <Radio value={0}>
                          <FormattedMessage id="PetOwner.No" />
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.Birthday" />}>
                    {getFieldDecorator('birthOfPets', {
                      initialValue: moment(pet.birthOfPets),
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.BirthdayIsRequired" /> }]
                    })(<DatePicker />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<FormattedMessage id="PetOwner.SpecialNeeds" />}>
                    {getFieldDecorator('customerPetsPropRelations', {
                      initialValue: pet.customerPetsPropRelations,
                      rules: [{ required: true, message: <FormattedMessage id="PetOwner.SpecialNeedsIsRequired" /> }]
                    })(<Select mode="tags" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={30} type="flex" align="middle" style={{ padding: '30px 0' }}>
            <Col span={16}>
              <Button type="primary">
                <FormattedMessage id="PetOwner.Save" />
              </Button>
              <Button style={{ marginLeft: '20px' }}>
                <FormattedMessage id="PetOwner.Cancel" />
              </Button>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Popconfirm placement="topRight" title={<FormattedMessage id="PetOwner.deleteThisItem" />} onConfirm={() => {}} okText={<FormattedMessage id="PetOwner.Confirm" />} cancelText={<FormattedMessage id="PetOwner.Cancel" />}>
                <Button type="link">
                  <FormattedMessage id="PetOwner.DeletePetProfile" />
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
  }
}

export default Form.create<Iprop>()(PetItem);
