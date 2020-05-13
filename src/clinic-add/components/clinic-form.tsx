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
        longitude: '',
        latitude: '',
        location: ''
      }
    };
    this.getDetail = this.getDetail.bind(this);

    if (this.props.clinicId) {
      this.getDetail(this.props.clinicId);
    }
  }
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
    console.log(this.state.clinicForm);
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
  addAreaPrice() {
    console.log('新增');
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Tabs>
        <TabPane tab="Basic infomation" key="basic">
          <Form
            {...layout}
            style={{ width: '600px' }}
            onSubmit={this.handleSubmit}
          >
            <FormItem label="Prescriber Name">
              {getFieldDecorator('clinicsName', {
                rules: [
                  { required: true, message: 'Please input clinic name!' }
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
                    message: 'Please input clinic phone number!'
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
                  { required: true, message: 'Please select clinic city!' }
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
                  <Option value="Mexico City">Mexico City</Option>
                  <Option value="Monterrey">Monterrey</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="Prescriber Zip">
              {getFieldDecorator('primaryZip', {
                rules: [{ required: true, message: 'Please input clinic zip!' }]
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
          <Table
            style={{ paddingTop: '10px' }}
            pagination={false}
            rowKey="intervalPriceId"
            footer={() => <Button>+ Add section</Button>}
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
                  order amount
                </div>
              }
              key="area"
              width={80}
              render={(rowInfo, _i, index) => {
                return (
                  <Row>
                    <Col span={10}>
                      <FormItem>
                        <Input addonBefore=" ≥ " disabled={index == 0} />
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
                  reward rate
                </div>
              }
              key="price"
              width={80}
              render={(rowInfo) => {
                return (
                  <Row>
                    <Col span={10}>
                      <FormItem>
                        <Input />
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
                return i > 0 ? <Button>Delete</Button> : null;
              }}
            />
          </Table>
        </TabPane>
      </Tabs>
    );
  }
}
export default Form.create()(ClinicForm);
