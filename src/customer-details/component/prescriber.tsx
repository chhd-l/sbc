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
  const [sumTotal, setSumtotal] = useState(1);
  const [searchForm, setSearchForm] = useState({
    attributeName: '',
    attributeValue: '',
    prescriberId: '',
    prescriberName: '',
    prescriberType: ''
  });
  useEffect(() => {
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
        //如果是编辑状态
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
      attributeStatus: true,
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
          setSumtotal(context.total);
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
    // setSelectedRowList([...selectedRowList.concat(selectedRow)]);
    // setSelectedRowList([...arrayFilter(selectedRowKey, selectedRowList)]);
    setSelectedRowKeys([...selectedRowKey]);
    // props.setSelectedRowKeys([...props.selectedRowKeys, ...selectedRow.prescriberId]);
    // let checkoutitem: any = {};
    // attributeList.forEach((item) => {
    //   if (item.id == selectedRowKey) {
    //     checkoutitem = item;
    //   }
    // });
    if (selectedRowKey.length !== 0) {
      selectedRow.forEach((item) => {
        setSelectedRowItem([...selectedRowItem, item.prescriberId]);
      });
    }
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
          <FormattedMessage id="Prescriber-information-add.title" values={{ count: sumTotal }} />
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
                <Col span={7}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <p style={styles.label} title={RCi18n({ id: 'Product.AttributeName' })}>
                          <FormattedMessage id="Order.PrescriberId" />
                        </p>
                      }
                      value={searchForm.prescriberId}
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
                <Col span={7}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <p style={styles.label} title={RCi18n({ id: 'Product.AttributeValue' })}>
                          <FormattedMessage id="Prescriber.PrescriberName" />
                        </p>
                      }
                      value={searchForm.prescriberName}
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
