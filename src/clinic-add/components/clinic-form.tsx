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
  Col
} from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './../webapi';
import { Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';

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
        location: ''
      },
      cityArr: [],
      typeArr: [],
      sectionList: []
    };
    this.getDetail = this.getDetail.bind(this);
    this.addSection = this.addSection.bind(this);

    if (this.props.clinicId) {
      this.getDetail(this.props.clinicId);
      this.queryClinicsReward(this.props.clinicId);
    }
    this.queryClinicsDictionary('city');
    this.queryClinicsDictionary('clinicType');
  }
  queryClinicsReward = async (id) => {
    const { res } = await webapi.queryClinicsReward({
      clinicsId: id
    });
    if (res.code === 'K-000000') {
      if (res.context.length > 0) {
        this.setState({
          sectionList: res.context,
          timeZone: res.context[0].timeZone
        });
      }
    } else {
      message.error(res.message || 'get data faild');
    }
  };

  addSection() {
    let section = {
      timeZone: this.state.timeZone,
      tempId: new Date().valueOf(),
      orderAmount: '',
      rewardRate: ''
    };
    let sectionList = this.state.sectionList;
    sectionList.push(section);
    this.setState({
      sectionList: sectionList
    });
  }
  saveRewardRate = async (row) => {
    if (!row.timeZone) {
      message.error('Time Zone can not be empty');
      return;
    }
    if (!row.orderAmount) {
      message.error('Order Amount can not be empty');
      return;
    }
    if (!row.rewardRate) {
      message.error('Reward Rate can not be empty');
      return;
    }
    if (row.id) {
      const { res } = await webapi.updateClinicsReward(row);
      if (res.code === 'K-000000') {
        message.success('update success');
      } else {
        message.error(res.message);
      }
    } else {
      //新增else
      if (this.state.clinicForm.clinicsId) {
        //通过基本信息的clinicId判断是否已存在诊所
        const { res } = await webapi.getClinicById({
          clinicsId: this.state.clinicForm.clinicsId
        });
        if (res.code === 'K-000000' && res.context.clinicsId) {
          row.clinicsId = res.context.clinicsId;

          this.addRewardRate(row);
        } else {
          message.error('Please create the basic information first ');
        }
      } else {
        message.error('Please create the basic information first ');
      }
    }
  };
  addRewardRate = async (row) => {
    const { res } = await webapi.addClinicsReward(row);
    if (res.code === 'K-000000') {
      message.success('create success');
    } else {
      message.error(res.message);
    }
  };
  deleteRewardRate = async (row) => {
    if (row.id) {
      const { res } = await webapi.delClinicsReward({ id: row.id });
      if (res.code === 'K-000000') {
        message.success('delete success');
        let data = this.state.sectionList;
        data = data.filter((item) => {
          if (item.id !== row.id) {
            return item;
          }
        });
        this.setState({
          sectionList: data
        });
      } else {
        message.error(res.message);
      }
    } else {
      let data = this.state.sectionList;
      data = data.filter((item) => {
        if (item.tempId !== row.tempId) {
          return item;
        }
      });
      this.setState({
        sectionList: data
      });
    }
  };
  selectTimeZone = (value) => {
    let data = this.state.sectionList;
    data = data.map((item) => {
      item.timeZone = value;
      return item;
    });
    this.setState({
      timeZone: value,
      sectionList: data
    });
  };
  onDataChange = ({ id, field, value }) => {
    let data = this.state.sectionList;
    let findData = data.find((item) => {
      return item.id === id || item.tempId === id;
    });
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
        location: res.context.location
      });
    } else {
      message.error(res.message || 'get data faild');
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
      message.error(res.message);
    }
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.clinicForm;
    data[field] = value;
    this.setState({
      clinicForm: data
    });
  };
  onCreate = async () => {
    const clinicForm = this.state.clinicForm;
    const { res } = await webapi.addClinic({
      ...clinicForm
    });
    if (res.code === 'K-000000') {
      message.success(res.message || 'create success');
    } else {
      message.error(res.message || 'create faild');
    }
  };
  onUpdate = async () => {
    let clinicForm = this.state.clinicForm;
    clinicForm.clinicsId = this.props.clinicId;
    const { res } = await webapi.updateClinic({
      ...clinicForm
    });
    if (res.code === 'K-000000') {
      message.success(res.message || 'update success');
    } else {
      message.error(res.message || 'update faild');
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        if (this.props.pageType === 'create') {
          this.onCreate();
        }
        if (this.props.pageType === 'edit') {
          this.onUpdate();
        }
      }
    });
  };

  render() {
    const { cityArr, typeArr } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Tabs>
        <TabPane tab="Basic infomation" key="basic">
          <Form
            {...layout}
            style={{ width: '600px' }}
            onSubmit={this.handleSubmit}
          >
            <FormItem label="Prescriber ID">
              {getFieldDecorator('clinicsId', {
                rules: [
                  { required: true, message: 'Please input Prescriber id!' }
                ]
              })(
                <Input
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
                  { required: true, message: 'Please input Prescriber name!' }
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
                  }
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
                  {/* <Option value="Mexico City">Mexico City</Option>
                  <Option value="Monterrey">Monterrey</Option> */}
                </Select>
              )}
            </FormItem>
            <FormItem label="Prescriber Zip">
              {getFieldDecorator('primaryZip', {
                rules: [
                  { required: true, message: 'Please input Prescriber zip!' }
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
            <FormItem label="Longitude">
              {getFieldDecorator('longitude', {
                rules: [{ required: true, message: 'Please input Longitude!' }]
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
            <FormItem label="Latitude">
              {getFieldDecorator('latitude', {
                rules: [{ required: true, message: 'Please input Latitude!' }]
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
              {this.props.pageType === 'edit' ? (
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              ) : (
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              )}
              <Button style={{ marginLeft: '20px' }}>
                <Link to="/clinic">Back List</Link>
              </Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane tab="Reward Rate" key="reward">
          {/*区间价价table*/}
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
          <label style={{ minWidth: '200px', marginRight: '10px' }}>
            Time Zome:
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
          <Table
            style={{ paddingTop: '10px' }}
            pagination={false}
            rowKey="intervalPriceId"
            dataSource={this.state.sectionList}
            footer={() => (
              <Button onClick={() => this.addSection()}>+ Add section</Button>
            )}
          >
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
                  Order Amount
                </div>
              }
              key="orderAmount"
              width={180}
              render={(rowInfo, _i, index) => {
                return (
                  <Row>
                    <Col span={10}>
                      <FormItem style={{ marginBottom: 0 }}>
                        <Input
                          value={rowInfo.orderAmount}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            const id = rowInfo.id ? rowInfo.id : rowInfo.tempId;
                            this.onDataChange({
                              id,
                              field: 'orderAmount',
                              value
                            });
                          }}
                          addonBefore=" ≥ "
                        />
                      </FormItem>
                    </Col>
                  </Row>
                );
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
                        <Input
                          value={rowInfo.rewardRate}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            const id = rowInfo.id ? rowInfo.id : rowInfo.tempId;
                            this.onDataChange({
                              id: id,
                              field: 'rewardRate',
                              value
                            });
                          }}
                          addonAfter="%"
                        />
                      </FormItem>
                    </Col>
                  </Row>
                );
              }}
            />
            <Column
              title={<FormattedMessage id="operation" />}
              key="opt"
              width={80}
              render={(rowInfo, _x, i) => {
                return (
                  <div>
                    <Button
                      style={{ marginRight: '10px' }}
                      onClick={() => this.saveRewardRate(rowInfo)}
                    >
                      Save
                    </Button>
                    <Button onClick={() => this.deleteRewardRate(rowInfo)}>
                      Delete
                    </Button>
                  </div>
                );
              }}
            />
          </Table>
        </TabPane>
      </Tabs>
    );
  }
}
export default Form.create()(ClinicForm);
