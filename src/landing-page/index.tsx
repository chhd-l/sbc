import React from 'react';
import { useAntdTable } from 'ahooks';
import { Form, Table, Row, Col, Button, Input, DatePicker, Tabs, Tooltip, Popconfirm, message } from 'antd';
import { Headline, BreadCrumb, RCi18n, Const } from 'qmkit';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { getLandingPageList, updateLandingPageStatus } from './webapi';

import { FormComponentProps, FormItemProps } from 'antd/es/form';
import { ColumnProps } from 'antd/es/table';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const formItemLayout: FormItemProps = {
  wrapperCol: { span: 24 },
  style: { width: '80%' }
};

const getTableData = ({ current, pageSize }, formData) => {
  const startDate = formData['dateRange'] && formData['dateRange'][0] ? formData['dateRange'][0].format('YYYY-MM-DD') : undefined;
  const endDate = formData['dateRange'] && formData['dateRange'][1] ? formData['dateRange'][1].format('YYYY-MM-DD') : undefined;
  return getLandingPageList({
    pageNum: current - 1,
    pageSize,
    number: formData.id,
    title: formData.title,
    startDate,
    endDate
  }).then(data => ({ total: data.res.context?.landingPageSumVO?.total ?? 0, list: data.res.context?.landingPageSumVO?.content ?? [] }));
};

const LandingPage: React.FC<FormComponentProps> = (props: FormComponentProps) => {

  const { tableProps, search, loading } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form: props.form,
  });
  const { submit } = search;

  const { getFieldDecorator } = props.form;

  const updateStatus = (id, status) => {
    updateLandingPageStatus(id, status).then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        message.success(data.res.message);
        submit();
      }
    });
  };

  const columns: ColumnProps<any>[] = [
    {
      title: <FormattedMessage id="Marketing.LandingPageId" />,
      dataIndex: 'number',
      key: 'number'
    },
    {
      title: <FormattedMessage id="Setting.Title" />,
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: <FormattedMessage id="Survey.views" />,
      dataIndex: 'views',
      key: 'views'
    },
    {
      title: <FormattedMessage id="Survey.clicks" />,
      dataIndex: 'clicks',
      key: 'clicks'
    },
    {
      title: <FormattedMessage id="Marketing.status" />,
      dataIndex: 'status',
      key: 'status',
      render: (text) => text === 1 ? <FormattedMessage id="Subscription.Active" /> : <FormattedMessage id="Subscription.Inactive" />
    },
    {
      title: <FormattedMessage id="Survey.creation_time" />,
      dataIndex: 'registerDate',
      key: 'registerDate'
    },
    {
      title: <FormattedMessage id="Marketing.Operation" />,
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <div>
          <Tooltip placement="top" title={<FormattedMessage id="Marketing.Detail"/>}>
            <Link to={`/landing-page-detail/${text}`} className="iconfont iconDetails"></Link>
          </Tooltip>
          {record.status === 0 && (
            <Popconfirm placement="topLeft" title={RCi18n({id:"Finance.doThis"})} onConfirm={() => updateStatus(text, 1)} okText={<FormattedMessage id="Product.Confirm" />} cancelText={<FormattedMessage id="Product.Cancel" />}>
              <Tooltip title={RCi18n({id:'Subscription.Active'})}>
                <Button type="link" size="small" style={{ padding: '0 10px' }}>
                  <i className="iconfont iconbtn-open"></i>
                </Button>
              </Tooltip>
            </Popconfirm>
          )}
          {record.status === 1 && (
            <Popconfirm placement="topLeft" title={RCi18n({id:"Finance.doThis"})} onConfirm={() => updateStatus(text, 0)} okText={<FormattedMessage id="Product.Confirm" />} cancelText={<FormattedMessage id="Product.Cancel" />}>
              <Tooltip title={RCi18n({id:'Subscription.Inactive'})}>
                <Button type="link" size="small" style={{ padding: '0 10px' }}>
                  <i className="iconfont iconbtn-stop"></i>
                </Button>
              </Tooltip>
            </Popconfirm>
          )}
        </div>
      )
    }
  ];

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
                  <Input addonBefore={<FormattedMessage id="Marketing.LandingPageId" />} />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('title')(
                  <Input addonBefore={<FormattedMessage id="Setting.Title" />} />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('dateRange')(
                  <RangePicker format="YYYY-MM-DD" />
                )}
              </FormItem>
            </Col>
            <Col span={24} style={{textAlign:'center'}}>
              <FormItem>
                <Button type="primary" icon="search" shape="round" onClick={submit}><FormattedMessage id="Marketing.Search" /></Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="container">
        <Tabs>
          <Tabs.TabPane tab={<FormattedMessage id="Marketing.AllLandingPages" />}>
            <Table
              rowKey="id"
              loading={loading}
              columns={columns}
              {...tableProps}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Form.create<FormComponentProps>()(LandingPage);
