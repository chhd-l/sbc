import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Tooltip } from 'antd';
import { Headline, BreadCrumb, RCi18n } from 'qmkit';
import { useAntdTable } from 'ahooks';
import { getUOMCategoryList } from './webapi';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;

const getTableData = ({ current, pageSize }, formData) => {
  return getUOMCategoryList({
    pageNum: current - 1,
    pageSize,
    ...formData
  }).then(data => ({ total: data.res.context?.total ?? 0, list: data.res.context?.content ?? [] }));
};

function UomCategory(props: any) {

  const { tableProps, search, loading } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form: props.form,
  });
  const { submit } = search;
  const { getFieldDecorator } = props.form;
  const columns = [
    {
      title: 'UOM category name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'desc',
    },
    {
      title: 'Operation',
      key: 'oper',
      render: (text, record) => (
        <div>
          <Tooltip placement="top" title={<FormattedMessage id="Product.Edit"/>}>
            <a className="iconfont iconEdit"></a>
          </Tooltip>
          <Tooltip placement="top" title={<FormattedMessage id="Product.delete"/>}>
            <a className="iconfont iconDelete" style={{ marginLeft: 10 }}></a>
          </Tooltip>
        </div>
      )
    }
  ];
  return (
    <div>
      <BreadCrumb />
      <div className="container-search">
        <Headline title="UOM category" />
        <Form className="filter-content" layout="inline">
          <FormItem>
            {getFieldDecorator('name')(<Input addonBefore="UOM category name" />)}
          </FormItem>
          <FormItem>
            <Button type="primary" icon="search" onClick={submit}>Search</Button>
          </FormItem>
        </Form>
      </div>
      <div className="container">
        <div style={{margin: '10px 0', textAlign:'right'}}>
          <Button type="primary">Create new UOM category</Button>
        </div>
        <Table
          columns={columns}
          loading={loading}
          rowKey="id"
          {...tableProps}
        />
      </div>
    </div>
  );
}

export default Form.create()(UomCategory);
