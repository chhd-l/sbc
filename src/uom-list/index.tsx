import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Tooltip, Row, Col, Select } from 'antd';
import { Headline, BreadCrumb, RCi18n, SelectGroup } from 'qmkit';
import { useAntdTable } from 'ahooks';
import { getUOMList } from './webapi';
import { FormattedMessage } from 'react-intl';
import FormModal from './components/form-modal';

const FormItem = Form.Item;
const Option = Select.Option;

const getTableData = ({ current, pageSize }, formData) => {
  return getUOMList({
    pageNum: current - 1,
    pageSize,
    ...formData
  }).then(data => ({ total: data.res.context?.total ?? 0, list: data.res.context?.content ?? [] }));
};

function UomList(props: any) {
  const [modalProps, setModalProps] = useState({
    visible: false,
    name: '',
    description: '',
    title: 'Add',
    onCancel: () => setModalProps({ ...modalProps, visible: false })
  });

  const { tableProps, search, loading } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form: props.form,
  });
  const { submit } = search;
  const { getFieldDecorator } = props.form;
  const columns = [
    {
      title: 'UOM Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'UOM Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Ratio',
      dataIndex: 'ratio',
      key: 'ratio',
    },
    {
      title: 'Operation',
      key: 'oper',
      render: (text, record) => (
        <div>
          <Tooltip placement="top" title={<FormattedMessage id="Product.Edit"/>}>
            <a
              className="iconfont iconEdit"
              onClick={() => setModalProps({ ...modalProps, visible: true, name: record.name, description: record.description })}
            ></a>
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
        <Headline title="UOM list" />
        <Form className="filter-content" layout="inline">
          <Row>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('code')(
                  <Input
                    addonBefore="UOM Code"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('name')(
                  <Input
                    addonBefore="UOM Name"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('category')(
                  <SelectGroup
                    label={<p style={styles.label}>UOM Category</p>}
                    style={{ width: 195 }}
                  >
                    <Option value="">
                      <FormattedMessage id="Subscription.all" />
                    </Option>
                  </SelectGroup>
                )}
              </FormItem>
            </Col>
            <Col span={24} style={{textAlign:'center'}}>
              <FormItem>
                <Button type="primary" icon="search" onClick={submit}>Search</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="container">
        <div style={{margin: '10px 0', textAlign:'right'}}>
          <Button 
            type="primary"
            onClick={() => setModalProps({ ...modalProps, visible: true, name: '', description: '' })}
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

const styles = {
  label: {
    width: 143,
    textAlign: 'center'
  },
  wrapper: {
    width: 157
  }
} as any;

export default Form.create()(UomList);

