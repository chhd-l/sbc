import React from 'react';
import { Form, Input, InputNumber, Button, Select, message, Table, Row, Col, Radio, Menu, Card, DatePicker, Empty, Spin } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const { SubMenu } = Menu;
const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;
import { Const } from 'qmkit';

const { Column } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class PetInfomation extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      petForm: {
        petsId: '',
        petsType: '',
        petName: '',
        petsSex: '',
        petsBreed: '',
        petsSizeValueName: '',
        sterilized: null,
        birthOfPets: '',
        petsPropRelations: []
      },
      petList: [],
      petsType: [
        {
          value: 'dog',
          id: 1
        },
        {
          value: 'cat',
          id: 2
        }
      ],
      petGender: [
        {
          value: 'male',
          id: 0
        },
        {
          value: 'female',
          id: 1
        }
      ],
      sizeArr: ['Xsmall', 'Mini', 'Medium', 'Maxi', 'Giant'],
      petsPropRelations: [
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
      ],
      catBreed: [],
      dogBreed: [],
      currentBirthDay: '2020-01-01',
      currentPet: {},
      loading: true
    };
  }
  componentDidMount() {
    this.petsByConsumer();
    this.querySysDictionary('dogBreed');
    this.querySysDictionary('catBreed');
  }
  handleChange = (value) => {};
  onOpenChange = (value) => {};
  onFormChange = ({ field, value }) => {
    let data = this.state.petForm;
    data[field] = value;
    this.setState({
      petForm: data
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        this.editPets();
      }
    });
  };

  querySysDictionary = (type: String) => {
    let params = {
      delFlag: 0,
      type: type
    };
    webapi
      .querySysDictionary(params)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          if (type === 'dogBreed') {
            let dogBreed = res.context.sysDictionaryVOS;
            this.setState({
              dogBreed: dogBreed
            });
          }

          if (type === 'catBreed') {
            let catBreed = res.context.sysDictionaryVOS;
            this.setState({
              catBreed: catBreed
            });
          }
        }
      })
      .catch((err) => {});
  };
  getSpecialNeeds = (array) => {
    let needs = [];
    if (array && array.length > 0) {
      for (let index = 0; index < array.length; index++) {
        needs.push(array[index].propName);
      }
    }
    return needs;
  };

  petsByConsumer = () => {
    let params = {
      consumerAccount: this.props.customerAccount
    };
    webapi
      .petsByConsumer(params)
      .then((data) => {
        const res = data.res;
        this.setState({
          loading: false
        });
        if (res.code === Const.SUCCESS_CODE) {
          let petList = res.context.context;
          if (petList.length > 0) {
            let currentPet = petList[0];
            currentPet.petsPropRelations = this.getSpecialNeeds(currentPet.petsPropRelations);

            this.props.form.setFieldsValue({
              petsType: currentPet.petsType,
              petName: currentPet.petsName,
              petsSex: currentPet.petsSex,
              petsBreed: currentPet.petsBreed,
              petsSizeValueName: currentPet.petsSizeValueName,
              sterilized: currentPet.sterilized,
              petsPropRelations: currentPet.petsPropRelations
            });
            this.setState({
              loading: false,
              petList: petList,
              petForm: currentPet,
              currentBirthDay: currentPet.birthOfPets
            });
          }
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {});
  };
  editPets = () => {
    this.setState({
      loading: false
    });
    const { petForm } = this.state;
    let petsPropRelations = [];
    let propId = 100;
    for (let i = 0; i < petForm.petsPropRelations.length; i++) {
      let prop = {
        delFlag: 0,
        detailId: 0,
        indexFlag: 0,
        petsId: this.state.currentPetId,
        propId: propId,
        propName: petForm.petsPropRelations[i].propName,
        relationId: '10086',
        sort: 0
      };
      petsPropRelations.push(prop);
      propId += 1;
    }

    let pets = {
      birthOfPets: petForm.birthOfPets,
      petsBreed: petForm.petsBreed,
      petsId: petForm.petsId,
      petsName: petForm.petsName,
      petsSex: petForm.petsSex,
      petsSizeValueId: '0',
      petsSizeValueName: petForm.petsType === 'dog' ? petForm.petsSizeValueName : '',
      petsType: petForm.petsType,
      sterilized: petForm.sterilized
    };
    let params = {
      pets: pets,
      petsPropRelations: petsPropRelations,
      userId: this.props.customerAccount
    };
    webapi
      .editPets(params)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
        }
      })
      .catch((err) => {});
  };

  petsById = (id) => {
    let params = {
      petsId: id
    };
    webapi
      .petsById(params)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          let currentPet = res.context.context;
          let petsPropRelations = this.getSpecialNeeds(currentPet.petsPropRelations);
          if (currentPet.petsType === 'cat') {
            this.props.form.setFieldsValue({
              petsType: currentPet.petsType,
              petName: currentPet.petsName,
              petsSex: currentPet.petsSex,
              petsBreed: currentPet.petsBreed,
              sterilized: currentPet.sterilized,
              petsPropRelations: petsPropRelations
            });
          } else {
            this.props.form.setFieldsValue({
              petsType: currentPet.petsType,
              petName: currentPet.petsName,
              petsSex: currentPet.petsSex,
              petsBreed: currentPet.petsBreed,
              petsSizeValueName: currentPet.petsSizeValueName,
              sterilized: currentPet.sterilized,
              petsPropRelations: petsPropRelations
            });
          }

          this.setState({
            petForm: currentPet,
            currentBirthDay: currentPet.birthOfPets
          });
        }
      })
      .catch((err) => {});
  };

  render() {
    const { petsType, petGender, sizeArr, petsPropRelations, catBreed, dogBreed, petForm } = this.state;
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
    const { getFieldDecorator } = this.props.form;
    return (
      <Row>
        <Spin spinning={this.state.loading}>
          <Col span={3}>
            <h3>All Pets( {this.state.petList.length} )</h3>
            <ul>
              {this.state.petList.map((item) => (
                <li
                  key={item.petsId}
                  style={{
                    cursor: 'pointer',
                    color: item.petsId === petForm.petsId ? '#e2001a' : ''
                  }}
                  onClick={() => this.petsById(item.petsId)}
                >
                  {item.petsName}
                </li>
              ))}
            </ul>
          </Col>
          <Col span={20}>
            {this.state.petList.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : null}
            <Card
              title={this.state.title}
              style={{
                display: this.state.petList.length === 0 ? 'none' : 'block'
              }}
            >
              <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                  <Col span={12}>
                    <FormItem label="Pet Category">
                      {getFieldDecorator('petsType', {
                        rules: [
                          {
                            required: true,
                            message: 'Please select Pet Category!'
                          }
                        ]
                      })(
                        <Select
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'petsType',
                              value
                            });
                          }}
                        >
                          {petsType.map((item) => (
                            <Option value={item.value} key={item.id}>
                              {item.value}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Pet Name">
                      {getFieldDecorator('petName', {
                        rules: [{ required: true, message: 'Please input Pet Name!' }]
                      })(
                        <Input
                          onChange={(value) => {
                            this.onFormChange({
                              field: 'petName',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Gender">
                      {getFieldDecorator('petsSex', {
                        rules: [{ required: true, message: 'Please select Gender!' }]
                      })(
                        <Select
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'petsSex',
                              value
                            });
                          }}
                        >
                          {petGender.map((item) => (
                            <Option value={item.id} key={item.id}>
                              {item.value}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  {petForm.petsType === 'dog' ? (
                    <Col span={12}>
                      <FormItem label="Breed">
                        {getFieldDecorator('petsBreed', {
                          rules: [
                            {
                              required: true,
                              message: 'Please select Breed!'
                            }
                          ]
                        })(
                          <Select
                            onChange={(value) => {
                              value = value === '' ? null : value;
                              this.onFormChange({
                                field: 'petsBreed',
                                value
                              });
                            }}
                          >
                            {dogBreed.map((item) => (
                              <Option value={item.name} key={item.id}>
                                {item.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  ) : (
                    <Col span={12}>
                      <FormItem label="Breed">
                        {getFieldDecorator('petsBreed', {
                          rules: [
                            {
                              required: true,
                              message: 'Please select Breed!'
                            }
                          ]
                        })(
                          <Select
                            onChange={(value) => {
                              value = value === '' ? null : value;
                              this.onFormChange({
                                field: 'petsBreed',
                                value
                              });
                            }}
                          >
                            {catBreed.map((item) => (
                              <Option value={item.name} key={item.id}>
                                {item.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  )}
                  {petForm.petsType === 'dog' ? (
                    <Col
                      span={12}
                      style={{
                        display: petForm.petsType === 'cat' ? 'none' : 'block'
                      }}
                    >
                      <FormItem label="Weight">
                        {getFieldDecorator('petsSizeValueName', {
                          rules: [{ required: true, message: 'Please input Weight!' }]
                        })(
                          <Select
                            onChange={(value) => {
                              value = value === '' ? null : value;
                              this.onFormChange({
                                field: 'breeweightd',
                                value
                              });
                            }}
                          >
                            {sizeArr.map((item) => (
                              <Option value={item} key={item}>
                                {item}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  ) : null}

                  <Col span={12}>
                    <FormItem label="Sterilized status">
                      {getFieldDecorator('sterilized', {
                        rules: [
                          {
                            required: true,
                            message: 'Please Select Sterilized status!'
                          }
                        ]
                      })(
                        <Radio.Group>
                          <Radio value={0}>Yes</Radio>
                          <Radio value={1}>No</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Birthday">
                      {getFieldDecorator('birthOfPets', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input Birth Date!'
                          }
                        ],
                        initialValue: moment(new Date(this.state.currentBirthDay), 'DD/MM/YYYY')
                      })(
                        <DatePicker
                          style={{ width: '100%' }}
                          format="DD/MM/YYYY"
                          disabledDate={(current) => {
                            return current && current > moment().endOf('day');
                          }}
                          onChange={(date, dateString) => {
                            const value = dateString;
                            this.onFormChange({
                              field: 'birthOfPets',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Special needs">
                      {getFieldDecorator('petsPropRelations', {
                        rules: [
                          {
                            required: true,
                            message: 'Please Select Special needs!'
                          }
                        ]
                      })(
                        <Select
                          mode="tags"
                          placeholder="Please select"
                          style={{ width: '100%' }}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onFormChange({
                              field: 'petsPropRelations',
                              value
                            });
                          }}
                        >
                          {petsPropRelations.map((item) => (
                            <Option key={item}>{item}</Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem>
                      <Button type="primary" htmlType="submit">
                        Save
                      </Button>

                      <Button style={{ marginLeft: '20px' }}>
                        <Link to="/customer-list">Cancel</Link>
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Spin>
      </Row>
    );
  }
}
export default Form.create()(PetInfomation);
