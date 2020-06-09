import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  message,
  Table,
  Row,
  Col,
  Radio,
  Divider
} from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
import RewardRate from '@/clinic-reward-rate';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const { Column } = Table;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

class ClinicForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      clinicForm: {
        clinicsId: '',
        clinicsOwner: 'john',
        clinicsName: '',
        phone: '',
        primaryCity: '',
        primaryZip: '',
        clinicsType: '',
        longitude: '',
        latitude: '',
        location: '',
        enabled: true
      },
      cityArr: [],
      typeArr: [],
      sectionList: [
        {
          id: 1,
          orderType: 'Customer first order(CFO)',
          rewardRate: 0
        },
        {
          id: 2,
          orderType: 'Customer second and following orders(CSFO)',
          rewardRate: 0
        }
      ],
      isEdit: this.props.clinicId ? true : false,
      rewardMode: false,
      timeZone: '',
      rewardForm: {
        clinicsId: '',
        id: '',
        rewardRateFirst: 0,
        rewardRateMore: 0,
        rewardRule: false,
        storeId: 123456858,
        timeZone: 'Year'
      },
      activeKey: 'basic',
      isJump: false
    };
    this.getDetail = this.getDetail.bind(this);

    if (this.props.clinicId) {
      this.getDetail(this.props.clinicId);
      this.getClinicsReward(this.props.clinicId);
    }
    this.queryClinicsDictionary('city');
    this.queryClinicsDictionary('clinicType');
  }
  getClinicsReward = (id) => {
    webapi
      .getClinicsReward(id)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          if (res.context) {
            const { sectionList } = this.state;
            sectionList[0].rewardRate = res.context.rewardRateFirst;
            sectionList[1].rewardRate = res.context.rewardRateMore;

            this.setState({
              timeZone: res.context.timeZone,
              rewardMode: res.context.rewardRule,
              sectionList: sectionList,
              rewardForm: res.context
            });
          }
        } else {
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
      });
  };

  saveReward = (id?) => {
    const { sectionList, rewardForm } = this.state;

    if (!id) {
      message.error('Prescriber ID does not exist');
      return;
    }

    let params = {
      clinicsId: id,
      id: rewardForm.id,
      rewardRateFirst: sectionList[0].rewardRate,
      rewardRateMore: sectionList[1].rewardRate,
      rewardRule: this.state.rewardMode,
      storeId: rewardForm.storeId,
      timeZone: this.state.timeZone
    };
    webapi
      .saveReward(params)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          message.success(res.message || 'Successful');
          this.getClinicsReward(id);
        } else {
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
      });
  };
  // clearAndSave = () => {
  //   const { rewardForm } = this.state;
  //   let params = {
  //     clinicsId: this.props.clinicId,
  //     id: rewardForm.id,
  //     rewardRateFirst: 0,
  //     rewardRateMore: 0,
  //     rewardRule: false,
  //     storeId: rewardForm.storeId,
  //     timeZone: ''
  //   };
  //   webapi
  //     .clearRulesAndSave(params)
  //     .then((data) => {
  //       const res = data.res;
  //       if (res.code === 'K-000000') {
  //         this.getClinicsReward(this.props.clinicId);
  //         message.success(res.message || 'Successful');
  //       } else {
  //         message.error('Unsuccessful');
  //       }
  //     })
  //     .catch((err) => {
  //       message.error('Unsuccessful');
  //     });
  // };

  selectTimeZone = (value) => {
    this.setState({
      timeZone: value
    });
  };
  onDataChange = ({ id, field, value }) => {
    let data = this.state.sectionList;
    let findData = data.find((item) => {
      return item.id === id || item.tempId === id;
    });
    console.log(value);

    if (findData) {
      findData[field] = value;
      this.setState({
        sectionList: data
      });
    }
  };

  getDetail = async (id) => {
    const { res } = await webapi.getClinicById({
      clinicsId: id
    });
    if (res.code === 'K-000000') {
      this.setState({
        clinicForm: res.context
      });
      this.props.form.setFieldsValue({
        clinicsId: res.context.clinicsId,
        clinicsName: res.context.clinicsName,
        phone: res.context.phone,
        primaryCity: res.context.primaryCity,
        primaryZip: res.context.primaryZip,
        longitude: res.context.longitude,
        latitude: res.context.latitude,
        location: res.context.location,
        clinicsType: res.context.clinicsType
      });
    } else {
      message.error('Unsuccessful');
    }
  };
  queryClinicsDictionary = async (type: String) => {
    const { res } = await webapi.queryClinicsDictionary({
      type: type
    });
    if (res.code === 'K-000000') {
      if (type === 'city') {
        this.setState({
          cityArr: res.context
        });
      }
      if (type === 'clinicType') {
        this.setState({
          typeArr: res.context
        });
      }
    } else {
      message.error('Unsuccessful');
    }
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.clinicForm;
    data[field] = value;
    this.setState({
      clinicForm: data
    });
  };
  onCreate = () => {
    const clinicForm = this.state.clinicForm;
    webapi
      .addClinic({ ...clinicForm })
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          if (clinicForm.clinicsId) {
            this.setState({
              isEdit: true
            });
            this.saveReward(clinicForm.clinicsId);
          } else {
            message.error('Prescriber ID does not exist');
          }
        } else {
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
      });
  };
  onUpdate = () => {
    const clinicForm = this.state.clinicForm;
    webapi
      .updateClinic({ ...clinicForm })
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          if (clinicForm.clinicsId) {
            this.setState({
              isEdit: true
            });
            this.saveReward(clinicForm.clinicsId);
          } else {
            message.error('Prescriber ID does not exist');
          }
        } else {
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        this.switchTab('reward');
      } else {
        message.error(
          'Prescriber basic infomation is not verified. Please modify!'
        );
      }
    });
  };
  handleVerify = () => {
    this.props.form.validateFields((err) => {
      if (!err) {
        if (this.state.isEdit) {
          this.onUpdate();
        } else {
          this.onCreate();
        }
      } else {
        message.error(
          'Prescriber basic infomation is not verified. Please modify!'
        );
      }
    });
  };
  onChange = (e) => {
    this.setState({
      rewardMode: e.target.value
    });
  };
  //id校验
  compareID = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[1-9][0-9]{2,12}$/;
    if (!reg.test(form.getFieldValue('clinicsId'))) {
      callback('Please enter the correct Prescriber ID');
    } else {
      callback();
    }
  };
  //手机校验
  comparePhone = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[0-9+-\s]{6,20}$/;
    if (!reg.test(form.getFieldValue('phone'))) {
      callback('Please enter the correct phone');
    } else {
      callback();
    }
  };

  compareZip = (rule, value, callback) => {
    const { form } = this.props;
    let reg = /^[0-9]{3,10}$/;
    if (!reg.test(form.getFieldValue('primaryZip'))) {
      callback('Please enter the correct Prescriber Zip');
    } else {
      callback();
    }
  };
  //经度校验longitude
  compareLongitude = (rule, value, callback) => {
    const { form } = this.props;
    if (
      isNaN(form.getFieldValue('longitude')) ||
      form.getFieldValue('longitude') < -180 ||
      form.getFieldValue('longitude') > 180
    ) {
      callback('Please enter the correct longitude');
    } else {
      callback();
    }
  };
  //纬度校验latitude
  compareLatitude = (rule, value, callback) => {
    const { form } = this.props;

    if (
      isNaN(form.getFieldValue('latitude')) ||
      form.getFieldValue('latitude') < -90 ||
      form.getFieldValue('latitude') > 90
    ) {
      callback('Please enter the correct latitude');
    } else {
      callback();
    }
  };
  // goToReward = () => {
  //   this.setState({
  //     isJump: true
  //   });
  // };
  // stay = () => {
  //   this.setState({
  //     isJump: false
  //   });
  // };

  switchTab = (key) => {
    this.setState({
      activeKey: key
    });
  };

  savePrescriber = () => {
    const { sectionList } = this.state;
    if (!this.state.timeZone) {
      message.error('Period can not be empty!');
      return;
    }
    if (!(sectionList[0].rewardRate || sectionList[0].rewardRate === 0)) {
      message.error('Reward Rate can not be empty!');
      return;
    }
    if (!(sectionList[1].rewardRate || sectionList[1].rewardRate === 0)) {
      message.error('Reward Rate can not be empty!');
      return;
    }
    this.handleVerify();
  };

  render() {
    const { cityArr, typeArr } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Tabs activeKey={this.state.activeKey} onChange={this.switchTab}>
        <TabPane tab="Basic infomation" key="basic">
          <Form
            {...layout}
            style={{ width: '800px' }}
            onSubmit={this.handleSubmit}
          >
            <FormItem label="Prescriber ID">
              {getFieldDecorator('clinicsId', {
                rules: [
                  { required: true, message: 'Please input Prescriber id!' },
                  { validator: this.compareID }
                ]
              })(
                <Input
                  disabled={this.state.isEdit}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'clinicsId',
                      value
                    });
                  }}
                />
              )}
            </FormItem>
            <FormItem label="Prescriber Name">
              {getFieldDecorator('clinicsName', {
                rules: [
                  { required: true, message: 'Please input Prescriber name!' },
                  {
                    max: 255,
                    message: 'Prescriber name exceed the maximum length!'
                  }
                ]
              })(
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'clinicsName',
                      value
                    });
                  }}
                />
              )}
            </FormItem>
            <FormItem label="Prescriber Phone Number">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: 'Please input Prescriber phone number!'
                  },
                  { validator: this.comparePhone }
                ]
              })(
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'phone',
                      value
                    });
                  }}
                />
              )}
            </FormItem>
            <FormItem label="Prescriber City">
              {getFieldDecorator('primaryCity', {
                rules: [
                  { required: true, message: 'Please select Prescriber city!' }
                ]
              })(
                <Select
                  onChange={(value) => {
                    value = value === '' ? null : value;
                    this.onFormChange({
                      field: 'primaryCity',
                      value
                    });
                  }}
                >
                  {cityArr.map((item) => (
                    <Option value={item.valueEn} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="Prescriber Zip">
              {getFieldDecorator('primaryZip', {
                rules: [
                  { required: true, message: 'Please input Prescriber zip!' },
                  { validator: this.compareZip }
                ]
              })(
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'primaryZip',
                      value
                    });
                  }}
                />
              )}
            </FormItem>
            <FormItem label="Prescriber Type">
              {getFieldDecorator('clinicsType', {
                rules: [
                  { required: true, message: 'Please select Prescriber Type!' }
                ]
              })(
                <Select
                  onChange={(value) => {
                    value = value === '' ? null : value;
                    this.onFormChange({
                      field: 'clinicsType',
                      value
                    });
                  }}
                >
                  {typeArr.map((item) => (
                    <Option value={item.valueEn} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                  {/* <Option value="Mexico City">Mexico City</Option>
                  <Option value="Monterrey">Monterrey</Option> */}
                </Select>
              )}
            </FormItem>

            <FormItem label="Latitude">
              {getFieldDecorator('latitude', {
                rules: [
                  { required: true, message: 'Please input Latitude!' },
                  { validator: this.compareLatitude }
                ]
              })(
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'latitude',
                      value
                    });
                  }}
                />
              )}
            </FormItem>

            <FormItem label="Longitude">
              {getFieldDecorator('longitude', {
                rules: [
                  { required: true, message: 'Please input Longitude!' },
                  { validator: this.compareLongitude }
                ]
              })(
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'longitude',
                      value
                    });
                  }}
                />
              )}
            </FormItem>

            <FormItem label="Prescriber Address">
              {getFieldDecorator('location')(
                <Input.TextArea
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onFormChange({
                      field: 'location',
                      value
                    });
                  }}
                />
              )}
            </FormItem>
            <FormItem wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                Proceed to set reward rules
              </Button>

              <Button style={{ marginLeft: '20px' }}>
                <Link to="/clinic">Back To List</Link>
              </Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane tab="Reward Rate" key="reward">
          <Row>
            <Col span={24}>
              <span
                style={{
                  color: 'red',
                  fontFamily: 'SimSun',
                  marginRight: '4px',
                  fontSize: '12px'
                }}
              >
                *
              </span>
              <label
                style={{
                  minWidth: '200px',
                  marginRight: '10px',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                Period:
              </label>
              Every
              <Select
                value={this.state.timeZone}
                onChange={(value) => this.selectTimeZone(value)}
                style={{ minWidth: '200px', marginLeft: '10px' }}
              >
                <Option value="Year" key="year">
                  Year
                </Option>
                <Option value="Month" key="month">
                  Month
                </Option>
                <Option value="Week" key="week">
                  Week
                </Option>
              </Select>
            </Col>
            <Col span={24} style={{ marginTop: '20px' }}>
              <span
                style={{
                  color: 'red',
                  fontFamily: 'SimSun',
                  marginRight: '4px',
                  fontSize: '12px'
                }}
              >
                *
              </span>
              <label
                style={{
                  minWidth: '200px',
                  marginRight: '10px',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                Reward mode:
              </label>
              {/* <div style={{ marginTop: '20px' }}>
                <Radio.Group
                  onChange={this.onChange}
                  value={this.state.rewardMode}
                >
                  <Radio value={true} style={{ marginRight: '50px' }}>
                    <div style={{ display: 'inline-grid' }}>
                      <p style={{ fontSize: '20px' }}>
                        Customer-oriented reward
                      </p>
                      <span style={{ fontSize: '12px' }}>
                        (order types subject to a unique custome)
                      </span>
                    </div>
                  </Radio>
                  <Radio value={false}>
                    <div style={{ display: 'inline-grid' }}>
                      <p style={{ fontSize: '20px' }}>No reward rule</p>
                    </div>
                  </Radio>
                </Radio.Group>
              </div>
              <Divider type="horizontal" /> */}
              <Table
                style={{ paddingTop: '10px' }}
                pagination={false}
                rowKey="intervalPriceId"
                dataSource={this.state.sectionList}
              >
                <Column
                  title="Unique customer order type"
                  key="orderType"
                  width={180}
                  render={(rowInfo) => {
                    return rowInfo.orderType;
                  }}
                />
                <Column
                  title={
                    <div>
                      <span
                        style={{
                          color: 'red',
                          fontFamily: 'SimSun',
                          marginRight: '4px',
                          fontSize: '12px'
                        }}
                      >
                        *
                      </span>
                      Reward Rate
                    </div>
                  }
                  key="rewardRate"
                  width={180}
                  render={(rowInfo) => {
                    return (
                      <Row>
                        <Col span={10}>
                          <FormItem style={{ marginBottom: 0 }}>
                            <InputNumber
                              value={rowInfo.rewardRate}
                              min={0}
                              max={100}
                              formatter={(value) => `${value}%`}
                              parser={(value) => value.replace('%', '')}
                              onChange={(value) => {
                                const id = rowInfo.id;
                                this.onDataChange({
                                  id: id,
                                  field: 'rewardRate',
                                  value
                                });
                              }}
                            />
                            {/* <Input
                              value={rowInfo.rewardRate}
                              type="number"
                              onChange={(e) => {
                                const value = (e.target as any).value;
                                const id = rowInfo.id;
                                this.onDataChange({
                                  id: id,
                                  field: 'rewardRate',
                                  value
                                });
                              }}
                              addonAfter="%"
                            /> */}
                          </FormItem>
                        </Col>
                      </Row>
                    );
                  }}
                />
              </Table>
            </Col>
            <Col span={24} style={{ marginTop: '20px' }}>
              <Button type="primary" onClick={() => this.savePrescriber()}>
                Save
              </Button>
              <Button style={{ marginLeft: '20px' }}>
                <Link to="/clinic">Back To List</Link>
              </Button>
              {/* <Button onClick={() => this.clearAndSave()}>
                Clear rules and Save
              </Button> */}
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    );
  }
}
export default Form.create()(ClinicForm);
