import React, { Component } from 'react';
import { BreadCrumb, Const, Headline } from 'qmkit';
import { Form, Icon, Input, Button, Row, Col, Spin, message } from 'antd';
import { FormattedMessage } from 'react-intl';
import './index.less';
import * as webapi from '@/setting-integration/webapi';

// @ts-ignore
@Form.create()
export default class PetApi extends Component<any, any>{
  private petId: string;
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
    }
    this.petId = ''
  }

  componentDidMount() {
    // 初始化form数据
    this.initForm();
  }

  initForm = async () => {
    const { setFieldsValue } = this.props.form;
    this.setState({loading: true})
    let { res } = await webapi.getPetApiInfo();
    this.setState({loading: false})
    if (res.code === Const.SUCCESS_CODE){
      let {countryCode, url, id} = res.context;
      this.petId = id;
      setFieldsValue({
        countryCode,
        url,
      })
    }else {
      message.warn(res.message);
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {

      if (!err) {
        console.log('Received values of form: ', values);
        if (!this.petId) return;

        const params = {
          id: this.petId,
          ...values,
        }
        this.setState({loading: true});
        let {res} = await webapi.updatePetApi(params);
        this.setState({loading: false});
        if (res.code === Const.SUCCESS_CODE){
          message.success('Operate successfully');
        }else {
          message.warn(res.message);
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const {loading} = this.state;
    return (
      <div>
        <BreadCrumb />
        <Spin spinning={loading}>
          <div className="container-search PetApi-warp">
            <Headline title={<FormattedMessage id="Menu.Pet API" />} />
            <Form {...formItemLayout}>
              <Form.Item label={<FormattedMessage id='URL'/>}>
                {getFieldDecorator('url', {
                  rules: [
                    { required: true, message: 'Please input your URL!' },
                    {
                      pattern: /[a-zA-z]+:\/\/[^s]*/,
                      message: 'Please enter the correct URL!'
                    }
                  ],
                })(
                  <Input
                    placeholder="URL"
                  />
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id='Setting.countryCode'/>} wrapperCol={{
                xs: { span: 24 },
                sm: { span: 8 },
              }}>
                {getFieldDecorator('countryCode', {
                  rules: [
                    { required: true, message: 'Please input your Country Code!' },
                  ],
                })(
                  <Input
                    placeholder="Country Code"
                  />
                )}
              </Form.Item>
            </Form>
            <Row>
              <Col span={8} offset={4}>
                <Button onClick={this.handleSubmit}>Save</Button>
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    );
  }
}