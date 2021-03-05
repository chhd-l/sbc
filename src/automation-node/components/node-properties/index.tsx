import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';
import ChooseEventForm from './ChooseEventForm'

const FormItem = Form.Item;

export default class NodeProperties extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { model } = this.props;
    return (
      <div>
        <Form className="ui-form-custom">
          <FormItem label="Item Name" colon={false}>
            <Input placeholder="Item Name" />
          </FormItem>      
          { model.nodeType == 'EventTrigger' ? <ChooseEventForm/>: null }   
        </Form>
      </div>
    );
  }
}
