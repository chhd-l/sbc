import React, { Component } from 'react';
import { BreadCrumb, Headline } from 'qmkit';
import { Form, Spin, Row, Col, Select, Input } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
export default class ClinicList extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      searchForm: {
        taskID: '',
        objectType: '',
        objectNo: '',
        emailTemplate: '',
        category: '',
        status: ''
      },
      title: 'Email Task List'
    };
  }
  componentDidMount() {}

  render() {
    const { title } = this.state;
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Spin spinning={this.state.loading}>
            <Headline title={title} />
            <Form className="filter-content" layout="inline"></Form>
          </Spin>
        </div>
        <div className="container"></div>
      </div>
    );
  }
}
