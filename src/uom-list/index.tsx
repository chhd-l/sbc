import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Tooltip, Row, Col, Select, Popconfirm, message } from 'antd';
import { Headline, BreadCrumb, RCi18n, SelectGroup, Const } from 'qmkit';
import { useAntdTable } from 'ahooks';
import { getUOMList, getAllUOMCategory, delUom } from './webapi';
import { FormattedMessage } from 'react-intl';
import FormModal from './components/form-modal';

const FormItem = Form.Item;
const Option = Select.Option;

const getTableData = ({ current, pageSize }, formData) => {
  return getUOMList({
    pageNum: current - 1,
    pageSize,
    ...formData
  }).then(data => ({ total: data.res.context?.uoms?.total ?? 0, list: data.res.context?.uoms.content ?? [] }));
};

function UomList(props: any) {
  const [uomCategoryList, setUomCategoryList] = useState([]);

  useEffect(() => {
    getAllUOMCategory().then(data => {
      setUomCategoryList(data.res.context?.categories?.content ?? []);
    });
  }, []);

  const { tableProps, search, loading } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form: props.form,
  });
  const { submit } = search;

  const [modalProps, setModalProps] = useState({
    visible: false,
    id: null,
    uomCode: '',
    uomName: '',
    categoryId: null,
    categories: [],
    type: '',
    ratio: null,
    formType: 1, //1-Add,2-Edit
    onCancel: () => setModalProps({ ...modalProps, visible: false }),
    onConfirm: () => {
      setModalProps({ ...modalProps, visible: false });
      submit();
    }
  });

  const deleteUOM = (id: string) => {
    delUom(id).then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        message.success(RCi18n({id:'Product.OperateSuccessfully'}));
        submit();
      }
    });
  };

  const { getFieldDecorator } = props.form;
  const columns = [
    {
      title: RCi18n({id:'Product.UOMcode'}),
      dataIndex: 'uomCode',
      key: 'code',
    },
    {
      title: RCi18n({id:'Product.UOMname'}),
      dataIndex: 'uomName',
      width: '20%',
      key: 'name',
    },
    {
      title: RCi18n({id:'Setting.Category'}),
      dataIndex: 'uomCategoryName',
      width: '20%',
      key: 'category',
    },
    {
      title: RCi18n({id:'Setting.Type'}),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: RCi18n({id:'Product.Ratio'}),
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
              onClick={() => setModalProps({ ...modalProps, visible: true, formType: 2, id: record.id, uomCode: record.uomCode, uomName: record.uomName, categoryId: record.categoryId, categories: uomCategoryList, type: record.type, ratio: record.ratio })}
            ></a>
          </Tooltip>
          <Popconfirm placement="topLeft" title={RCi18n({id:'Product.Areyousuretodelete'})} onConfirm={() => deleteUOM(record.id)} okText={<FormattedMessage id="Product.Confirm" />} cancelText={<FormattedMessage id="Product.Cancel" />}>
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
        <Headline title={RCi18n({id:'Product.UOMlist'})} />
        <Form className="filter-content" layout="inline">
          <Row>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('uomCode')(
                  <Input
                    addonBefore={RCi18n({id:'Product.UOMcode'})}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('uomName')(
                  <Input
                    addonBefore={RCi18n({id:'Product.UOMname'})}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('categoryId')(
                  <SelectGroup
                    label={<p style={styles.label}><FormattedMessage id="Product.UOMCategory"/></p>}
                    style={{ width: 195 }}
                    allowClear
                  >
                    {uomCategoryList.map((item, idx) => (
                      <Option key={idx} value={item.id}>{item.uomCategoryName}</Option>
                    ))}
                  </SelectGroup>
                )}
              </FormItem>
            </Col>
            <Col span={24} style={{textAlign:'center'}}>
              <FormItem>
                <Button type="primary" icon="search" onClick={submit}><FormattedMessage id="Product.search"/></Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="container">
        <div style={{margin: '10px 0', textAlign:'right'}}>
          <Button 
            type="primary"
            onClick={() => setModalProps({ ...modalProps, visible: true, formType: 1, id: null, uomCode: '', uomName: '', categoryId: null, categories: uomCategoryList, type: '', ratio: null })}
          >
            <FormattedMessage id="Product.Createnewuom"/>
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

