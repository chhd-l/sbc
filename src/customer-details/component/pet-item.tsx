import React from 'react';
import { Form, Row, Col, Input, Select, Radio, Spin, DatePicker, Button, Popconfirm, Icon, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Headline, history, AssetManagement } from 'qmkit';
import moment from 'moment';
import { querySysDictionary, petsById, editPets, delPets } from '../webapi';

const { Option } = Select;

interface Iprop extends FormComponentProps {
  petId: string;
}

class PetItem extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      show: false,
      pet: {},
      petImg: '',
      catBreed: [],
      dogBreed: [],
      customerPetsPropRelationList: [
        'Age support',
        'Cardiac support',
        'Diabetes support',
        'Digestive support',
        'Joint support',
        'Oral/Dental hygiene',
        'Food sensitivities',
        'Kidney support',
        'Liver support',
        'Skin and Coat support',
        'Urinary support',
        'Weight management',
        'Convalescence',
        'Skin sensitivity',
        'Digestive sensitivity',
        'Joint sensitivity'
      ]
    };
  }

  componentDidMount() {
    this.getPet();
    this.getBreedListByType('dogBreed');
    this.getBreedListByType('catBreed');
  }

  getPet = () => {
    this.setState({ loading: true });
    petsById({ petsId: this.props.petId })
      .then((data) => {
        this.setState({
          pet: data.res.context.context,
          petImg: data.res.context.context.petsImg,
          loading: false
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  savePet = () => {
    this.props.form.validateFields((err, fields) => {
      if (!err) {
        this.setState({ loading: true });
        const params = {
          customerPets: {
            ...fields,
            petsImg: this.state.petImg,
            birthOfPets: fields.birthOfPets.format('YYYY-MM-DD'),
            petsSizeValueId: '0',
            storeId: 123456858
          },
          customerPetsPropRelations: fields.customerPetsPropRelations.reduce((prev, curr, idx) => {
            prev.push({
              delFlag: 0,
              detailId: 0,
              indexFlag: 0,
              petsId: this.props.petId,
              propId: 100 + idx,
              propName: curr,
              relationId: '10086',
              sort: 0
            });
            return prev;
          }, []),
          storeId: 123456858,
          userId: this.state.pet.consumerAccount
        };
        editPets(params)
          .then((data) => {
            message.success(data.res.message);
            history.go(-1);
          })
          .catch(() => {
            this.setState({
              loading: false
            });
          });
      }
    });
  };

  deletePet = () => {
    this.setState({
      loading: true
    });
    delPets({
      petsIds: [this.props.petId]
    })
      .then((data) => {
        message.success(data.res.message);
        history.go(-1);
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

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

  onChooseImg = (images) => {
    this.setState({
      petImg: images && images.length > 0 ? images[0] : ''
    });
  };

  onDeleteImg = () => {
    this.setState({
      petImg: ''
    });
  };

  onShowOrHide = (show: boolean) => {
    this.setState({
      show: show
    });
  };

  render() {
    const { loading, show, pet, petImg } = this.state;
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
    const breedOptions = pet.petType === 'dog' ? this.state.dogBreed : this.state.catBreed;
    return (
      <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px', position: 'fixed', marginLeft: '5%' }} alt="" />}>
        <div className="container">
          <Headline title="Edit pet information" />
          <Form {...formItemLayout}>
            <Row gutter={16}>
              <Col span={4} style={{ paddingLeft: '30px' }}>
                <div>
                  <AssetManagement images={petImg ? [petImg] : []} choosedImgCount={1} selectImgFunction={this.onChooseImg} deleteImgFunction={this.onDeleteImg} />
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
                  <Col span={12}>
                    <Form.Item label="Birthday">
                      {getFieldDecorator('birthOfPets', {
                        initialValue: moment(pet.birthOfPets, 'YYYY-MM-DD'),
                        rules: [{ required: true, message: 'Birthday is required' }]
                      })(
                        <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
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
                        initialValue: pet.customerPetsPropRelations ? pet.customerPetsPropRelations.map((v) => v.propName) : null,
                        rules: [{ required: true, message: 'Special needs is required' }]
                      })(
                        <Select mode="tags">
                          {this.state.customerPetsPropRelationList.map((p, i) => (
                            <Option value={p} key={i}>
                              {p}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <div>
                  <Button type="link" onClick={() => this.onShowOrHide(!show)}>
                    <Icon type={show ? 'up' : 'down'} /> {show ? 'Hide more fields' : 'Show more fields'}
                  </Button>
                  <div style={{ display: show ? 'block' : 'none' }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Pet activity level">
                          <Select value={pet.petActivityCode} disabled>
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
                      <Col span={12}>
                        <Form.Item label="Breeder ID">
                          <Input value={pet.breederId} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Pet owner ID">
                          <Input value={pet.ownerId} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Vet ID">
                          <Input value={pet.vetId} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Death reason">
                          <Input value={pet.reasonOfDeath} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Weight">
                          <Radio.Group value={pet.weightAdded} disabled>
                            <Radio value={1} key="1">
                              yes
                            </Radio>
                            <Radio value={0} key="0">
                              no
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Reproduction status">
                          <Radio.Group value={pet.reproductionStatusCode} disabled>
                            <Radio value={1}>true</Radio>
                            <Radio value={0}>false</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="ICD">
                          <Input value={pet.icd} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Pet certificate ID ">
                          <Input value={pet.certificateId} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Certificate information">
                          <Input value={pet.certificateInfo} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Coat color">
                          <Input value={pet.coatColour} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Complementary information">
                          <Input value={pet.complementaryInformation} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Death date">
                          <Input value={pet.deathDate ? moment(pet.deathDate).format('DD/MM/YYYY') : ''} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Description">
                          <Input value={pet.description} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Distinctives signs">
                          <Input value={pet.distinctiveSigns} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Hair color">
                          <Input value={pet.hair} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Reproducer">
                          <Radio.Group value={pet.isReproducer} disabled>
                            <Radio value={1} key="1">
                              yes
                            </Radio>
                            <Radio value={0} key="0">
                              no
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Reason">
                          <Input value={pet.reason} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Lifestyle">
                          <Input value={pet.lifestyle} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Microship ID">
                          <Input value={pet.microchipId} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Genetic code">
                          <Input value={pet.geneticCode} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Pathologies">
                          <Input value={pet.pathologies} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Pedigree name">
                          <Input value={pet.pedigreeName} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Value">
                          <Input value={pet.value} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Weight category">
                          <Input value={pet.weightCategory} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Species">
                          <Input value={pet.speciesCode} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Sterilisation status">
                          <Radio.Group value={pet.sterilisation} disabled>
                            <Radio value={1} key="1">
                              yes
                            </Radio>
                            <Radio value={0} key="0">
                              no
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Status">
                          <Input value={pet.status} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Tags">
                          <Input value={pet.tags} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Tatoo ID">
                          <Input value={pet.tattooId} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Birth time">
                          <Input value={pet.timeOfBirth} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Death time">
                          <Input value={pet.timeOfDeath} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Treatments">
                          <Input value={pet.treatments} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Vaccinations">
                          <Input value={pet.vaccinations} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Breeder prescription">
                          <Input value={pet.breederPrescription} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Ideal body weight">
                          <Input value={pet.idealBodyWeight} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Target weight">
                          <Input value={pet.adultTargetWeight} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Weight">
                          <Input value={pet.weight} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Last pet status">
                          <Input value={pet.lastPetStatus} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Current risk">
                          <Input value={pet.currentRisk} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Last weight">
                          <Input value={pet.lastWeight} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Birth weight">
                          <Input value={pet.birthWeight} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="After 48h weight">
                          <Input value={pet.weight48h} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Lof number">
                          <Input value={pet.lofNumber} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Mother lof number">
                          <Input value={pet.motherLofNumber} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Father lof number">
                          <Input value={pet.fatherLofNumber} disabled />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Size">
                          <Input value={pet.size} disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="bar-button">
          <Row gutter={30} type="flex" align="middle">
            <Col span={16}>
              <Button type="primary" onClick={this.savePet}>
                Save
              </Button>
              <Button
                style={{ marginLeft: '20px' }}
                onClick={() => {
                  history.go(-1);
                }}
              >
                Cancel
              </Button>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Popconfirm placement="topRight" title="Are you sure to delete this item?" onConfirm={this.deletePet} okText="Confirm" cancelText="Cancel">
                <Button type="link">Delete pet profile</Button>
              </Popconfirm>
            </Col>
          </Row>
        </div>
      </Spin>
    );
  }
}

export default Form.create<Iprop>()(PetItem);
