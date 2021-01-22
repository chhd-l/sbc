import React, { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';

type Iprop = {
  descName: string;
  onSearch?: Function;
  form?: object;
};

class SearchForm extends Component<Iprop> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      formData: {
        descName: props.descName
      }
    };
  }

  onFieldChange = (value: string) => {
    this.setState({
      formData: {
        descName: value
      }
    });
  };
}

export default Form.create()(SearchForm);
