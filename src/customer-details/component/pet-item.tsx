import React from 'react';
import { Form, Row, Col, Input, Select, Radio, Spin, DatePicker, Button, Popconfirm, Avatar } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Headline } from 'qmkit';
import moment from 'moment';
import { querySysDictionary } from '../webapi';

const { Option } = Select;

interface Iprop extends FormComponentProps {
  pet: any;
}

class PetItem extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      petType: this.props.pet.petsType || 'dog',
      catBreed: [],
      dogBreed: []
    };
  }

  componentDidMount() {
    this.getBreedListByType('dogBreed');
    this.getBreedListByType('catBreed');
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.pet.petsType !== prevState.petType) {
      return {
        petType: nextProps.pet.petsType
      };
    }
    return null;
  }

  onChangePetType = (petType: string) => {
    this.setState({
      petType: petType
    });
  };

  getBreedListByType = (type: string) => {
    querySysDictionary({
      delFlag: 0,
      storeId: 123456858,
      type: type
    }).then((data) => {
      this.setState({
        [type]: data.res.context.sysDictionaryVOS
      });
    });
  };

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
    const breedOptions = this.state.petType === 'dog' ? this.state.dogBreed : this.state.catBreed;
    return (
      <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px', position: 'fixed', marginLeft: '5%' }} alt="" />}>
        <Headline title="Edit pet information" />
        <Form {...formItemLayout}>
          <Row gutter={16}>
            <Col span={4} style={{ textAlign: 'center' }}>
              <div>
                <Avatar size={120} icon="people" />
              </div>
              <div>
                <Button type="link">Change picture</Button>
              </div>
            </Col>
            <Col span={20}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Pet category">
                    {getFieldDecorator('petsType', {
                      initialValue: pet.petsType,
                      rules: [{ required: true, message: 'Pet category is required' }]
                    })(
                      <Select onChange={this.onChangePetType}>
                        <Option value="dog" key="dog">
                          Dog
                        </Option>
                        <Option value="cat" key="cat">
                          Cat
                        </Option>
                      </Select>
                    )}
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
                    })(
                      <Select>
                        <Option value={0} key="0">
                          male
                        </Option>
                        <Option value={1} key="1">
                          female
                        </Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Breed">
                    {getFieldDecorator('petsBreed', {
                      initialValue: pet.petsBreed,
                      rules: [{ required: true, message: 'Breed is required' }]
                    })(
                      <Select showSearch>
                        {breedOptions.map((breedItem) => (
                          <Option value={breedItem.name} key={breedItem.id}>
                            {breedItem.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Weight">
                    {getFieldDecorator('petsSizeValueName', {
                      initialValue: pet.petsSizeValueName,
                      rules: [{ required: true, message: 'Weight is required' }]
                    })(
                      <Select>
                        {['Xsmall', 'Mini', 'Medium', 'Maxi', 'Giant'].map((size, idx) => (
                          <Option value={size} key={idx}>
                            {size}
                          </Option>
                        ))}
                      </Select>
                    )}
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
                      initialValue: moment(pet.birthOfPets, 'DD/MM/YYYY'),
                      rules: [{ required: true, message: 'Birthday is required' }]
                    })(
                      <DatePicker
                        format="DD/MM/YYYY"
                        disabledDate={(current) => {
                          return current && current > moment().endOf('day');
                        }}
                      />
                    )}
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
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Pet activity level">
                <Select value="low" disabled>
                  <Option key="low" value="low">
                    low
                  </Option>
                  <Option key="medium" value="medium">
                    medium
                  </Option>
                  <Option key="high" value="high">
                    high
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Breeder ID">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Pet owner ID">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Vet ID">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Death reason">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Weight">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Reproduction status">
                <Radio.Group value={0} disabled>
                  <Radio value={1}>true</Radio>
                  <Radio value={0}>false</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="ICD">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Pet certificate ID ">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Certificate information">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Coat color">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Complementary information">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Death date">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Description">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Distinctives signs">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Hair color">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Reproducer">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Reason">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Lifestyle">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Microship ID">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Genetic code">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Pathologies">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Pedigree name ">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Species">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Sterilisation status">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Status">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Tags">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Tatoo ID">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Treatments">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Vaccinations">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Breeder prescription">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Ideal body weight">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Target weight">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Weight">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Last pet status">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Current risk">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Last weight">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Birth weight">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="After 48h weight">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Lof number">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Mother lof number">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Father lof number">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Size">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30} type="flex" align="middle" style={{ padding: '30px 0' }}>
            <Col span={16}>
              <Button type="primary">Save</Button>
              <Button style={{ marginLeft: '20px' }}>Cancel</Button>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Popconfirm placement="topRight" title="Are you sure to delete this item?" onConfirm={() => {}} okText="Confirm" cancelText="Cancel">
                <Button type="link">Delete pet profile</Button>
              </Popconfirm>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
  }
}

export default Form.create<Iprop>()(PetItem);
