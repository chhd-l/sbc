import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Tooltip, Popconfirm, message } from 'antd';
import { Headline, BreadCrumb, RCi18n, Const } from 'qmkit';
import { useAntdTable } from 'ahooks';
import { getUOMCategoryList, delUOMCategory } from './webapi';
import { FormattedMessage } from 'react-intl';
import FormModal from './components/form-modal';

const FormItem = Form.Item;

const getTableData = ({ current, pageSize }, formData) => {
  return getUOMCategoryList({
    pageNum: current - 1,
    pageSize,
    ...formData
  }).then(data => ({ total: data.res.context?.categories?.total ?? 0, list: data.res.context?.categories?.content ?? [] }));
};

function UomCategory(props: any) {
  const { tableProps, search, loading } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form: props.form,
  });
  const { submit } = search;

  const [modalProps, setModalProps] = useState({
    visible: false,
    id: 0,
    name: '',
    description: '',
    type: 1,  //1 - add, 2 - edit
    onCancel: () => setModalProps({ ...modalProps, visible: false }),
    onConfirm: () => {
      setModalProps({ ...modalProps, visible: false });
      submit();
    }
  });

  const deleteCategory = (id: number) => {
    delUOMCategory(id).then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        message.success('Operation successful');
        submit();
      }
    });
  };

  const { getFieldDecorator } = props.form;
  const columns = [
    {
      title: 'UOM category name',
      dataIndex: 'uomCategoryName',
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
            <a
              className="iconfont iconEdit"
              onClick={() => setModalProps({ ...modalProps, visible: true, type: 2, id: record.id, name: record.uomCategoryName, description: record.description })}
            ></a>
          </Tooltip>
          <Popconfirm placement="topLeft" title="Are you sure you want to delete this item?" onConfirm={() => deleteCategory(record.id)} okText={<FormattedMessage id="Product.Confirm" />} cancelText={<FormattedMessage id="Product.Cancel" />}>
            <Tooltip placement="top" title={<FormattedMessage id="Product.delete"/>}>
              <a className="iconfont iconDelete" style={{ marginLeft: 10 }}></a>
            </Tooltip>
          </Popconfirm>
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
          <Button 
            type="primary"
            onClick={() => setModalProps({ ...modalProps, visible: true, type: 1, id: 0, name: '', description: '' })}
          >
            Create new UOM category
          </Button>
        </div>
        <Table
          columns={columns}
          loading={loading}
          rowKey="id"
          {...tableProps}
        />
      </div>
      {modalProps.visible && <FormModal {...modalProps} />}
    </div>
  );
}

export default Form.create()(UomCategory);
