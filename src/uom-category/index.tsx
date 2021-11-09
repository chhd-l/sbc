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

  const deleteCategory = (id: string) => {
    delUOMCategory(id).then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        message.success(RCi18n({id:'Product.OperateSuccessfully'}));
        submit();
      }
    });
  };

  const { getFieldDecorator } = props.form;
  const columns = [
    {
      title: RCi18n({id:'Product.UOMCategoryName'}),
      dataIndex: 'uomCategoryName',
      width: '40%',
      key: 'name',
    },
    {
      title: RCi18n({id:'Product.Description'}),
      dataIndex: 'description',
      width: '40%',
      key: 'desc',
    },
    {
      title: RCi18n({id:'Product.operation'}),
      width: '20%',
      key: 'oper',
      render: (text, record) => (
        <div>
          <Tooltip placement="top" title={<FormattedMessage id="Product.Edit"/>}>
            <a
              className="iconfont iconEdit"
              onClick={() => setModalProps({ ...modalProps, visible: true, type: 2, id: record.id, name: record.uomCategoryName, description: record.description })}
            ></a>
          </Tooltip>
          <Popconfirm placement="topLeft" title={RCi18n({id:'Product.Areyousuretodelete'})} onConfirm={() => deleteCategory(record.id)} okText={<FormattedMessage id="Product.Confirm" />} cancelText={<FormattedMessage id="Product.Cancel" />}>
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
        <Headline title={RCi18n({id:'Product.UOMCategory'})} />
        <Form className="filter-content" layout="inline">
          <FormItem>
            {getFieldDecorator('uomCategoryName')(<Input addonBefore={RCi18n({id:'Product.UOMCategoryName'})} />)}
          </FormItem>
          <FormItem>
            <Button type="primary" icon="search" onClick={submit}><FormattedMessage id="Product.search"/></Button>
          </FormItem>
        </Form>
      </div>
      <div className="container">
        <div style={{margin: '10px 0', textAlign:'right'}}>
          <Button 
            type="primary"
            onClick={() => setModalProps({ ...modalProps, visible: true, type: 1, id: 0, name: '', description: '' })}
          >
            <FormattedMessage id="Product.Createnewuomcategory"/>
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
