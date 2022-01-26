import React from 'react';
import { useAntdTable } from 'ahooks';
import { Form, Table, Row, Col, Button, Input, DatePicker, Tabs } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';

import { FormComponentProps, FormItemProps } from 'antd/es/form';
import { ColumnProps } from 'antd/es/table';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const formItemLayout: FormItemProps = {
  wrapperCol: { span: 24 },
  style: { width: '80%' }
};
const columns: ColumnProps<any>[] = [
  {
    title: "Landing page ID"
  },
  {
    title: "Title"
  },
  {
    title: "Views"
  },
  {
    title: "Clicks"
  },
  {
    title: "Status"
  },
  {
    title: "Creation time"
  },
  {
    title: "Operation"
  }
];

const LandingPage: React.FC<FormComponentProps> = (props: FormComponentProps) => {

  const { getFieldDecorator } = props.form;

  return (
    <div>
      <BreadCrumb />
      <div className="container-search">
        <Headline title="Landing page list" />
        <Form className="filter-content" layout="inline">
          <Row gutter={24}>
            <Col span={8}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('id')(
                  <Input addonBefore="Landing page ID" />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('title')(
                  <Input addonBefore="Title" />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('times')(
                  <RangePicker format="YYYY-MM-DD" />
                )}
              </FormItem>
            </Col>
            <Col span={24} style={{textAlign:'center'}}>
              <FormItem>
                <Button type="primary" icon="search" shape="round">Search</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="container">
        <Tabs>
          <Tabs.TabPane tab="All landing pages">
            <Table
              rowKey="id"
              columns={columns}
              dataSource={[]}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Form.create<FormComponentProps>()(LandingPage);
