import React, { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import { FormattedMessage } from 'react-intl';

type Iprop = {
  descName: string;
  onSearch?: Function;
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

  onFormSearch = () => {};

  render() {
    return (
      <Form layout="inline" style={{ marginBottom: 20 }}>
        <Row>
          <Col span={8}>
            <Form.Item>
              <Input
                addonBefore="Description name"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.onFieldChange(value);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Button
              type="primary"
              icon="search"
              shape="round"
              onClick={(e) => {
                e.preventDefault();
                this.onFormSearch();
              }}
            >
              <span>
                <FormattedMessage id="search" />
              </span>
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(SearchForm);
