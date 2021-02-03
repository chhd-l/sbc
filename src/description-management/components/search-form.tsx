import React, { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import { FormattedMessage } from 'react-intl';

type Iprop = {
  descName: string;
  onChangeDescName: (value: string) => void;
  onSearch: Function;
};

export default function SearchForm(props: Iprop) {
  return (
    <Form layout="inline" style={{ marginBottom: 20 }}>
      <Row type="flex" align="middle">
        <Col span={10}>
          <Form.Item>
            <Input
              addonBefore="Description name"
              defaultValue={props.descName}
              onChange={(e) => {
                const value = (e.target as any).value;
                props.onChangeDescName(value);
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
              props.onSearch();
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
