import { Button, Col, Form, Icon, Input, message, Modal, Row, Table, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { useCallbackState } from 'use-callback-state';
import { Const, RCi18n, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';
const FormItem = Form.Item;
const { Option } = Select;
const styles = {
  label: {
    width: 120,
    textAlign: 'center'
  }
} as any;
const columns_attribute = [
  {
    title: <FormattedMessage id="Prescriber.PrescriberID" />,
    dataIndex: 'prescriberId',
    key: 'prescriberId'
  },
  {
    title: <FormattedMessage id="Prescriber.PrescriberName" />,
    dataIndex: 'prescriberName',
    key: 'prescriberName'
  },
  {
    title: <FormattedMessage id="PetOwner.PrescriberCity" />,
    dataIndex: 'primaryCity',
    key: 'primaryCity'
    // width: '30%',
    // render: (text, record) => (
    //   <p>
    //     {record.attributesValuesVOList ? this.getAttributeValue(record.attributesValuesVOList) : ''}
    //   </p>
    // )
  },
  {
    title: <FormattedMessage id="Prescriber.PrescriberType" />,
    dataIndex: 'prescriberType',
    key: 'prescriberType'
  },
  {
    title: <FormattedMessage id="Prescriber.PrescriberStatus" />,
    dataIndex: 'auditStatus',
    key: 'auditStatus'
  }
];
const prescriber = () => {
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [oldSelectedRowKeys, setOldSelectedRowKeys] = useState([]);
  const [prevPropSelectedRowKeys, setPrevPropSelectedRowKeys] = useState([]);
  const [attributeList, setAttributeList] = useState([]);
  const [selectedRowList, setSelectedRowList] = useState([]);
  const [oldSelectedRowList, setOldSelectedRowList] = useState([]);
  const [prevPropSelectedRowList, setPrevPropSelectedRowList] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [prescribertype, setPrescribertype] = useState([]);
  const [pagination, setPagination]: any = useCallbackState(
    {
      current: 1,
      pageSize: 8,
      total: 0
    },
    () => {}
  );
  const [searchForm, setSearchForm] = useState({
    attributeName: '',
    attributeValue: ''
  });
  useEffect(() => {
    webapi
      .fetchPrescriberType({ type: 'clinicType' })
      .then((res) => {
        let { context } = res.res;
        setPrescribertype([...context]);
      })
      .catch((err) => {
        message.error(err.toString() || <FormattedMessage id="Product.OperationFailed" />);
      });
  }, []);
  const handleOk = () => {
    setConfirmLoading(true);
    let storeGoodsFilterList = [];
    for (let i = 0; i < selectedRowList.length; i++) {
      let item = {
        attributeId: selectedRowList[i].id,
        attributeName: selectedRowList[i].attributeName,
        filterType: '0',
        filterStatus: '1'
      };
      storeGoodsFilterList.push(item);
    }
    let params = {
      storeGoodsFilterList: storeGoodsFilterList
    };
    // webapi
    //   .addAttributeToFilter(params)
    //   .then((data) => {
    //     const { res } = data;
    //     if (res.code === Const.SUCCESS_CODE) {
    //       message.success(<FormattedMessage id="Product.OperateSuccessfully" />);
    //       setConfirmLoading(false);
    //       setVisible(false);
    //       //   this.props.refreshList();
    //     } else {
    //       setConfirmLoading(true);
    //     }
    //   })
    //   .catch((err) => {
    //     setConfirmLoading(false);
    //   });
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const onFormChange = ({ field, value }) => {
    let data = searchForm;
    data[field] = value;
    setSearchForm({ ...data });
  };
  const getAttributes = () => {
    let params = {
      attributeName: searchForm.attributeName,
      attributeValue: searchForm.attributeValue,
      attributeStatus: true,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1,
      searchType: 'filter'
    };
    webapi
      .fetchClinicList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          const attributeList = res.context.content;
          setAttributeList([...attributeList]);
        }
      })
      .catch((err) => {
        message.error(err.toString() || <FormattedMessage id="Product.OperationFailed" />);
      });
  };
  const onSearch = () => {
    setPagination(
      {
        current: 1,
        pageSize: 8,
        total: 0
      },
      () => {
        getAttributes();
      }
    );
  };
  const onSelectChange = (selectedRowKeys, selectedRow) => {
    setSelectedRowList([...selectedRowList.concat(selectedRow)]);
    setSelectedRowList([...arrayFilter(selectedRowKeys, selectedRowList)]);
    setSelectedRowKeys([...selectedRowKeys]);
  };
  const arrayFilter = (arrKey, arrList) => {
    let tempList = [];
    arrKey.map((item) => {
      tempList.push(arrList.find((el) => el.id === item));
    });
    return tempList;
  };
  const rowSelection = {
    selectedRowKeys,
    columnTitle: ' ', // 去掉全选
    hideDefaultSelections: true,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: JSON.stringify(oldSelectedRowKeys).indexOf(record.id) !== -1, // Column configuration not to be checked
      name: record.id
    })
  };
  const handleTableChange = (pagination: any) => {
    setPagination({ ...pagination }, () => getAttributes());
  };
  const openSelectAttribute = () => {
    setVisible(true);
    setPagination(
      {
        current: 1,
        pageSize: 8,
        total: 0
      },
      () => {}
    );
    setSearchForm({
      attributeName: '',
      attributeValue: ''
    });
    getAttributes();
  };
  return (
    <>
      <Button
        type="primary"
        style={{ margin: '10px 0 10px 0' }}
        onClick={() => openSelectAttribute()}
      >
        <span>
          <FormattedMessage id="Finance.AddNew" />
        </span>
      </Button>
      <Modal
        title={<FormattedMessage id="Prescriber-information-add.title" values={{ count: 1 }} />}
        visible={visible}
        width="800px"
        confirmLoading={confirmLoading}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <div style={{ marginBottom: 16 }}>
            <Form className="filter-content" layout="inline">
              <Row>
                <Col span={7}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <p style={styles.label} title={RCi18n({ id: 'Product.AttributeName' })}>
                          <FormattedMessage id="Order.PrescriberId" />
                        </p>
                      }
                      value={searchForm.attributeName}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        onFormChange({
                          field: 'attributeName',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <p style={styles.label} title={RCi18n({ id: 'Product.AttributeValue' })}>
                          <FormattedMessage id="Prescriber.PrescriberName" />
                        </p>
                      }
                      value={searchForm.attributeValue}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        onFormChange({
                          field: 'attributeValue',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem>
                    <SelectGroup
                      defaultValue=""
                      label={
                        <p style={styles.label} title={RCi18n({ id: 'PetOwner.ConsumerType' })}>
                          {RCi18n({ id: 'Prescriber.PrescriberType' })}
                        </p>
                      }
                      style={{ width: 120 }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        onFormChange({
                          field: 'customerTypeId',
                          value
                        });
                      }}
                    >
                      <Option value="">{RCi18n({ id: 'PetOwner.All' })}</Option>
                      {prescribertype.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </SelectGroup>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col offset={10} span={4} style={{ textAlign: 'center' }}>
                  <FormItem>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon="search"
                      shape="round"
                      onClick={(e) => {
                        e.preventDefault();
                        onSearch();
                      }}
                    >
                      <span>
                        <FormattedMessage id="Product.search" />
                      </span>
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={columns_attribute}
            dataSource={attributeList}
            onChange={handleTableChange}
            pagination={pagination}
          />
        </div>
      </Modal>
    </>
  );
};
export default prescriber;
