import { Button, Col, Form, Icon, Input, message, Modal, Row, Table, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { useCallbackState } from 'use-callback-state';
import { Const, RCi18n, SelectGroup } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import * as webapi from './webapi';
import { PaginationConfig } from 'antd/lib/pagination';
const FormItem = Form.Item;
const { Option } = Select;
const styles = {
  label: {
    width: 103,
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
  },
  {
    title: <FormattedMessage id="Prescriber.PrescriberType" />,
    dataIndex: 'prescriberType',
    key: 'prescriberType'
  },
  {
    title: <FormattedMessage id="Prescriber.PrescriberStatus" />,
    dataIndex: 'enabled',
    key: 'enabled',
    render: (text, record, index) => {
      return <p>{text ? RCi18n({ id: 'Prescriber.Enabled' }) : RCi18n({ id: 'Disabled' })}</p>;
    }
  }
];

type PrescriberProps = {
  customerId: string;
  getPrescriberList: () => void;
  setSelectedRowKeys: (newSelectedRowKeys: any) => void;
  selectedRowKeys: Array<string>;
  showModer: boolean;
  setShowModer: () => void;
  editPrescriberId: string;
};
const Prescriber = (props: PrescriberProps) => {
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [attributeList, setAttributeList] = useState([]);
  const [selectedRowItem, setSelectedRowItem]: any = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [prescribertype, setPrescribertype] = useState([]);
  const [paginations, setPaginations]: any = useState({
    current: 0,
    pageSize: 10,
    total: 0
  });
  const [sumTotal, setSumtotal] = useState(0);
  const [searchForm, setSearchForm] = useState({
    attributeName: '',
    attributeValue: '',
    prescriberId: '',
    prescriberName: '',
    prescriberType: ''
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
    getAttributes({});
  }, []);
  useEffect(() => {
    if (props.showModer) {
      webapi
        .fetchPrescriberType({ type: 'clinicType' })
        .then((res) => {
          let { context } = res.res;
          setPrescribertype([...context]);
        })
        .catch((err) => {
          message.error(err.toString() || <FormattedMessage id="Product.OperationFailed" />);
        });
    }
  }, [props.showModer]);
  const handleOk = () => {
    setConfirmLoading(true);
    if (selectedRowItem.length && props.customerId) {
      if (props.showModer) {
        //?????????????????????
        webapi
          .fetchUpdPrescriber({
            customerId: props.customerId,
            updatePrescriberId: selectedRowItem[0],
            oldPrescriberId: props.editPrescriberId
          })
          .then((data) => {
            if (data.res.code == 'K-000000') {
              setConfirmLoading(false);
              setVisible(false);
              props.getPrescriberList();
              setSelectedRowKeys([]);
              setSelectedRowItem([]);
              props.setShowModer();
            } else {
              setConfirmLoading(false);
            }
          })
          .catch((err) => {
            message.error(err.toString());
            setConfirmLoading(false);
          });
      } else {
        webapi
          .fetchAddPrescriber({
            customerId: props.customerId,
            prescriberIds: selectedRowItem,
            defaultPrescriberFlag: 0
          })
          .then((data) => {
            if (data.res.code == 'K-000000') {
              setConfirmLoading(false);
              setVisible(false);
              setSelectedRowKeys([]);
              setSelectedRowItem([]);
              props.getPrescriberList();
            } else {
              setConfirmLoading(false);
            }
          })
          .catch((err) => {
            message.error(err.toString());
            setConfirmLoading(false);
          });
      }
    } else {
      message.error(<FormattedMessage id="Product.OperationFailed" />);
    }
    setConfirmLoading(false);
  };
  const handleCancel = () => {
    setVisible(false);
    props.setShowModer();
  };
  const onFormChange = ({ field, value }) => {
    let data = searchForm;
    data[field] = value;
    setSearchForm({ ...data });
  };
  const getAttributes = ({ pageSize = 10, current = 1, total = 0 }: PaginationConfig) => {
    // console.log(pagination);
    let params = {
      prescriberId: searchForm.prescriberId,
      prescriberName: searchForm.prescriberName,
      prescriberType: searchForm.prescriberType,
      // attributeName: searchForm.attributeName,
      // attributeValue: searchForm.attributeValue,
      // attributeStatus: true,
      enabled: true,
      pageSize,
      pageNum: current - 1
    };
    // debugger;
    webapi
      .fetchClinicList(params)
      .then((data) => {
        const {
          res,
          res: { context }
        } = data;
        if (res.code === Const.SUCCESS_CODE) {
          const attributeList = res.context.content;
          setAttributeList([...attributeList]);
          setPaginations({
            current: context.number + 1,
            pageSize: context.size,
            total: context.total
          });
        }
      })
      .catch((err) => {
        message.error(err.toString() || <FormattedMessage id="Product.OperationFailed" />);
      });
  };
  const onSearch = () => {
    getAttributes({});
  };
  const onSelectChange = (selectedRowKey, selectedRow) => {
    if (props.showModer) {
      setSelectedRowKeys([selectedRowKey[selectedRowKey.length - 1]]);
      setSelectedRowItem([selectedRow[0].prescriberId]);
    } else {
      setSelectedRowKeys([...selectedRowKey]);
      if (selectedRowKey.length !== 0) {
        setSumtotal(selectedRowKey.length);
        selectedRow.forEach((item) => {
          setSelectedRowItem([...selectedRowItem, item.prescriberId]);
        });
      }
    }
  };
  const rowSelection = {
    selectedRowKeys,
    columnTitle: ' ', // ????????????
    hideDefaultSelections: true,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: props.selectedRowKeys.indexOf(record.prescriberId) !== -1 ? 'disabled' : '', // Column configuration not to be checked
      name: record.prescriberId
    })
  };
  const handleTableChange = async (pagination: any) => {
    // setPaginations({
    //   ...pagination
    // });
    getAttributes(pagination);
  };
  const openSelectAttribute = () => {
    setVisible(true);
    setSearchForm({
      attributeName: '',
      attributeValue: '',
      prescriberId: '',
      prescriberName: '',
      prescriberType: ''
    });
    getAttributes({});
  };
  return (
    <>
      <Button
        data-testid="addnewBtn"
        type="primary"
        style={{ margin: '10px 0 10px 0' }}
        onClick={() => openSelectAttribute()}
      >
        <span>
          <FormattedMessage id="Finance.AddNew" />
        </span>
      </Button>
      <Modal
        title={
          <FormattedMessage
            id="Prescriber-information-add.title"
            values={{
              count: (
                <>
                  <strong>
                    <FormattedMessage id="Prescriber-information-add-title.title" />
                  </strong>
                  <span style={{ color: 'rgb(226, 0, 26)' }}>{sumTotal} </span>
                </>
              )
            }}
          />
        }
        visible={visible || props.showModer}
        width="800px"
        confirmLoading={confirmLoading}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <div style={{ marginBottom: 16 }}>
            <Form className="filter-content" layout="inline">
              <Row>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <p style={styles.label} title={RCi18n({ id: 'Product.AttributeName' })}>
                          <FormattedMessage id="Order.PrescriberId" />
                        </p>
                      }
                      value={searchForm.prescriberId}
                      data-testid="inputOnchange"
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        onFormChange({
                          field: 'prescriberId',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <p style={styles.label} title={RCi18n({ id: 'Product.AttributeValue' })}>
                          <FormattedMessage id="Prescriber.PrescriberName" />
                        </p>
                      }
                      value={searchForm.prescriberName}
                      data-testid="inputOnchange1"
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        onFormChange({
                          field: 'prescriberName',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <SelectGroup
                      defaultValue=""
                      label={
                        <p style={styles.label} title={RCi18n({ id: 'PetOwner.ConsumerType' })}>
                          {RCi18n({ id: 'Prescriber.PrescriberType' })}
                        </p>
                      }
                      style={{ width: '90px' }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        onFormChange({
                          field: 'prescriberType',
                          value
                        });
                      }}
                    >
                      <Option value="">{RCi18n({ id: 'PetOwner.All' })}</Option>
                      {prescribertype.map((item) => (
                        <Option value={item.name} key={item.id}>
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
                      onClick={onSearch}
                      data-testid="onSearch"
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
            pagination={paginations}
          />
        </div>
      </Modal>
    </>
  );
};
export default Prescriber;
