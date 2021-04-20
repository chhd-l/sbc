import React from 'react';
import { Form, Row, Col, Input, Select, Radio, Spin, DatePicker, Button, Popconfirm, Icon, message, Divider, Avatar } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Headline, history, AssetManagement } from 'qmkit';
import moment from 'moment';
import { querySysDictionary, petsById, editPets, delPets } from '../webapi';
import { getTaggingList } from './webapi';
import { setTagging } from '../webapi';

const { Option } = Select;
const dogImg = require('../img/dog.png');
const catImg = require('../img/cat.png');

interface Iprop extends FormComponentProps {
  petId?: string;
  petsInfo?: any;
}

const calcPetWeight = (jsonStr: string) => {
  try {
    const weightObj = JSON.parse(jsonStr);
    return `${weightObj['measure']} ${weightObj['measureUnit']}`;
  } catch (e) {
    return '';
  }
};

class PetItem extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      show: false,
      editable: false,
      pet: {},
      petImg: '',
      catBreed: [],
      dogBreed: [],
      tagList: [],
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
    this.getTaggingList();
  }

  getPet = () => {
    this.setState({ loading: true });
    if(this.props.petId) {
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
    } else if(this.props.petsInfo) {
      this.setState({
        pet: this.props.petsInfo,
        petImg: this.props.petsInfo ? this.props.petsInfo.petsImg : '',
        loading: false
      });
    }
  };

  savePet = () => {
    this.props.form.validateFields((err, fields) => {
      if (!err) {
        this.setState({ loading: true });
        const customerPetsPropRelations = fields.customerPetsPropRelations.reduce((prev, curr, idx) => {
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
        }, []);
        const params = {
          customerPets: {
            ...fields,
            petsId: this.props.petId,
            petsImg: this.state.petImg,
            birthOfPets: fields.birthOfPets.format('YYYY-MM-DD'),
            customerPetsPropRelations: customerPetsPropRelations,
            petsSizeValueId: '0',
            storeId: 123456858
          },
          customerPetsPropRelations: customerPetsPropRelations,
          segmentIdList: fields.segmentIdList,
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

  getTaggingList = () => {
    getTaggingList().then((data) => {
      this.setState({
        tagList: data.res.context.segmentList
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

  onSelectPetTagging = (tagNames) => {
    const { tagList } = this.state;
    this.setState({
      pet: {
        ...this.state.pet,
        segmentList: tagNames.map((tagName) => ({ name: tagName }))
      }
    });
    setTagging({
      relationId: this.state.pet.petsId,
      segmentType: 1,
      segmentIdList: tagList.filter((tag) => tagNames.indexOf(tag.name) > -1 && tag.segmentType == 1).map((tag) => tag.id)
    }).then(() => {});
  };

  render() {
    const { loading, show, pet, petImg, editable } = this.state;
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
        <div className="container petowner-noedit-form">
          {this.props.petsInfo ? null : <Headline title="Pet information" />}
          <Form {...formItemLayout}>
            <Row gutter={16}>
              <Col span={4} style={{ paddingLeft: '30px' }}>
                <div style={{ margin: 40 }}>
                  {editable ? (
                    <AssetManagement images={petImg && petImg.startsWith('http') ? [petImg] : []} choosedImgCount={1} selectImgFunction={this.onChooseImg} deleteImgFunction={this.onDeleteImg} />
                  ) : (
                    <Avatar size={70} src={petImg && petImg.startsWith('http') ? petImg : pet.petsType === 'dog' ? dogImg : catImg} />
                  )}
                </div>
              </Col>
              <Col span={20}>
                {this.props.petsInfo ? null : (
                  <Row gutter={16}>
                    <Col span={24}>
                      <div style={{ fontSize: 16, color: '#666' }}>Basic information</div>
                    </Col>
                  </Row>
                )}
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Pet category">
                      {editable ? (
                        getFieldDecorator('petsType', {
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
                        )
                      ) : (
                        <span>{pet.petsType}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Name">
                      {editable ? (
                        getFieldDecorator('petsName', {
                          initialValue: pet.petsName,
                          rules: [{ required: true, message: 'Pet name is required' }]
                        })(<Input />)
                      ) : (
                        <span>{pet.petsName}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Gender">
                      {editable ? (
                        getFieldDecorator('petsSex', {
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
                        )
                      ) : (
                        <span>{pet.petsSex ? pet.petsSex == 0 ? 'male' : 'female' : ''}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Breeder code">
                      {editable ? (
                        getFieldDecorator('petsBreed', {
                          initialValue: pet.petsBreed,
                          rules: [{ required: true, message: 'Breeder code is required' }]
                        })(
                          <Select showSearch>
                            {breedOptions.map((breedItem) => (
                              <Option value={breedItem.name} key={breedItem.id}>
                                {breedItem.name}
                              </Option>
                            ))}
                          </Select>
                        )
                      ) : (
                        <span>{pet.petsBreed}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Adult size">
                      {editable ? (
                        getFieldDecorator('petsSizeValueName', {
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
                        )
                      ) : (
                        <span>{pet.petsSizeValueName}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Sterilized status">
                      {editable ? (
                        getFieldDecorator('sterilized', {
                          initialValue: pet.sterilized,
                          rules: [{ required: true, message: 'Sterilized status is required' }]
                        })(
                          <Radio.Group>
                            <Radio value={1}>Yes</Radio>
                            <Radio value={0}>No</Radio>
                          </Radio.Group>
                        )
                      ) : (
                        <span>{pet.sterilized ? pet.sterilized == 1 ? 'Yes' : 'No' : ''}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Pure-breed">
                      {editable ? (
                        getFieldDecorator('isPurebred', {
                          initialValue: pet.isPurebred,
                          rules: [{ required: true, message: 'Pure-breed is required' }]
                        })(
                          <Radio.Group>
                            <Radio value={1}>Yes</Radio>
                            <Radio value={0}>No</Radio>
                          </Radio.Group>
                        )
                      ) : (
                        <span>{pet.isPurebred ? pet.isPurebred == 1 ? 'Yes' : 'No' : ''}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Birth">
                      {editable ? (
                        getFieldDecorator('birthOfPets', {
                          initialValue: moment(pet.birthOfPets, 'YYYY-MM-DD'),
                          rules: [{ required: true, message: 'Birth is required' }]
                        })(
                          <DatePicker
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD"
                            disabledDate={(current) => {
                              return current && current > moment().endOf('day');
                            }}
                          />
                        )
                      ) : (
                        <span>{pet.birthOfPets ? moment(pet.birthOfPets, 'YYYY-MM-DD').format('YYYY-MM-DD') : ''}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Weight">
                      <span>{pet.weight ? calcPetWeight(pet.weight) : ''}</span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Activity">
                      <span>{pet.activity}</span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Lifestyle">
                      <span>{pet.lifestyle}</span>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Special needs">
                      {editable ? (
                        getFieldDecorator('customerPetsPropRelations', {
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
                        )
                      ) : (
                        <span>{pet.needs}</span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {this.props.petsInfo ? (
                      <Form.Item label="Pet tagging">{pet.segmentList && pet.segmentList.length > 0 ? pet.segmentList.map((v) => v.name).join(',') : null}</Form.Item>
                    ) : (
                      <Form.Item label="Pet tagging">
                        {editable ? (
                          getFieldDecorator('segmentIdList', {
                            initialValue: pet.segmentList ? pet.segmentList.map((v) => v.id) : []
                          })(
                            <Select mode="multiple" getPopupContainer={(trigger: any) => trigger.parentNode}>
                              {this.state.tagList
                                .filter((t) => t.segmentType == 1)
                                .map((v, idx) => (
                                  <Option value={v.id} key={idx}>
                                    {v.name}
                                  </Option>
                                ))}
                            </Select>
                          )
                        ) : (
                          // <span>{pet.segmentList ? pet.segmentList.map((v) => v.name).join(', ') : ''}</span>
                          <Select mode="multiple" value={pet.segmentList ? pet.segmentList.map((v) => v.name) : []} onChange={this.onSelectPetTagging} getPopupContainer={(trigger: any) => trigger.parentNode}>
                            {this.state.tagList
                              .filter((t) => t.segmentType == 1)
                              .map((v, idx) => (
                                <Option value={v.name} key={idx}>
                                  {v.name}
                                </Option>
                              ))}
                          </Select>
                        )}
                      </Form.Item>
                    )}
                  </Col>
                </Row>
                <Divider />
                <Row gutter={16} type="flex" align="middle">
                  <Col span={16}>
                    <div style={{ fontSize: 16, color: '#666' }}>Life stage information</div>
                  </Col>
                  <Col span={8} style={{ textAlign: 'right' }}>
                    <Button type="link" size="small" icon="sync" onClick={this.getPet}>
                      Refresh
                    </Button>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="This stage name">
                      {((pet.customerPetsPropRelations ?? []).find(x => x.propType === 'firstLifeStageName') ?? {}).propName ?? ''}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Stage ending">
                      {((pet.customerPetsPropRelations ?? []).find(x => x.propType === 'firstLifeStageValue') ?? {}).propName ?? ''}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Next stage name">
                      {((pet.customerPetsPropRelations ?? []).find(x => x.propType === 'secondLifeStageName') ?? {}).propName ?? ''}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Stage ending">
                      {((pet.customerPetsPropRelations ?? []).find(x => x.propType === 'secondLifeStageValue') ?? {}).propName ?? ''}
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />
                <div>
                  <a
                    style={{ fontSize: 16 }}
                    className="ant-btn-link"
                    onClick={(e) => {
                      e.preventDefault();
                      this.onShowOrHide(!show);
                    }}
                  >
                    {show ? 'Hide more fields' : 'Show more fields'} <Icon type={show ? 'up' : 'down'} />
                  </a>
                  <div style={{ display: show ? 'block' : 'none' }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="Pet ID">{pet.petSourceId}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Pet owner ID">{pet.ownerId}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Breeder ID">{pet.breederId}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Vet ID">{pet.vetId}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Death reason">{pet.reasonOfDeath}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Weight">{pet.weightAdded == 1 ? 'Yes' : pet.weightAdded == 0 ? 'No' : ''}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Reproduction status">{pet.reproductionStatusCode == 1 ? 'Yes' : pet.reproductionStatusCode == 0 ? 'No' : ''}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="ICD">{pet.icd}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Pet certificate ID ">{pet.certificateId}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Certificate information">{pet.certificateInfo}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Coat color">{pet.coatColour}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Complementary information">{pet.complementaryInformation}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Death date">{pet.deathDate ? moment(pet.deathDate).format('DD/MM/YYYY') : ''}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Description">{pet.description}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Distinctives signs">{pet.distinctiveSigns}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Hair color">{pet.hair}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Reproducer">{pet.isReproducer == 1 ? 'Yes' : pet.isReproducer ? 'No' : ''}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Reason">{pet.reason}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Microship ID">{pet.microchipId}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Genetic code">{pet.geneticCode}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Pathologies">{pet.pathologies}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Pedigree name">{pet.pedigreeName}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Value">{pet.value}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Weight category">{pet.weightCategory}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Species">{pet.speciesCode}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Sterilisation status">{pet.sterilisation == 1 ? 'Yes' : pet.sterilisation ? 'No' : ''}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Status">{pet.status}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Tags">{pet.tags}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Tatoo ID">{pet.tattooId}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Birth time">{pet.timeOfBirth}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Death time">{pet.timeOfDeath}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Treatments">{pet.treatments}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Vaccinations">{pet.vaccinations}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Breeder prescription">{pet.breederPrescription}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Ideal body weight">{pet.idealBodyWeight}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Target weight">{pet.adultTargetWeight}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Last pet status">{pet.lastPetStatus}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Current risk">{pet.currentRisk}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Last weight">{pet.lastWeight}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Birth weight">{pet.birthWeight}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="After 48h weight">{pet.weight48h}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Lof number">{pet.lofNumber}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Mother lof number">{pet.motherLofNumber}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Father lof number">{pet.fatherLofNumber}</Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Size">{pet.size}</Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        {this.props.petsInfo ? null : (
          <div className="bar-button">
            {editable && (
              <Button type="primary" onClick={this.savePet} style={{ marginRight: '20px' }}>
                Save
              </Button>
            )}
            <Button
              onClick={() => {
                history.go(-1);
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </Spin>
    );
  }
}

export default Form.create<Iprop>()(PetItem);
