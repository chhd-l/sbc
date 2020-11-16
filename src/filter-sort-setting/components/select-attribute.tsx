import { Button, Col, Form, Icon, Input, message, Modal, Radio, Row, Table } from 'antd';
import moment from 'moment';
import { Const } from 'qmkit';
import React from 'react';
import * as webapi from './../webapi';
import { IList } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;

export default class SelectAttribute extends React.Component<any, any> {
  props = {
    refreshList: Function,
    selectedRowKeys: Array
  };
  state = {
    visible: false,
    selectedRowKeys: [],
    oldSelectedRowKeys: [],
    prevPropSelectedRowKeys: [],
    attributeList: [],
    selectedRowList: [],
    confirmLoading: false,
    pagination: {
      current: 1,
      pageSize: 8,
      total: 0
    },
    searchForm: {
      attributeName: '',
      attributeValue: ''
    }
  };
  componentDidMount() {}

  static getDerivedStateFromProps(props, state) {
    // 当传入的值发生变化的时候，更新state
    if (JSON.stringify(props.selectedRowKeys) !== JSON.stringify(state.prevPropSelectedRowKeys)) {
      return {
        oldSelectedRowKeys: props.selectedRowKeys.concat(),
        selectedRowKeys: props.selectedRowKeys.concat(),
        prevPropSelectedRowKeys: props.selectedRowKeys.concat()
      };
    }

    return null;
  }
  getAttributes = () => {
    const { pagination, searchForm } = this.state;
    let params = {
      attributeName: searchForm.attributeName,
      attributeValue: searchForm.attributeValue,
      attributeStatus: true,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    };
    webapi
      .getAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          const attributeList = res.context.attributesList;
          this.setState({ attributeList, pagination });
        } else {
          message.error(res.message || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
      });
  };

  openSelectAttribute = () => {
    this.setState(
      {
        visible: true,
        pagination: {
          current: 1,
          pageSize: 8,
          total: 0
        },
        searchForm: {
          attributeName: '',
          attributeValue: ''
        }
      },
      () => this.getAttributes()
    );
  };
  handleOk = () => {
    this.setState({
      confirmLoading: true
    });
    const { selectedRowList } = this.state;
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
    webapi
      .addAttributeToFilter(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Operate successfully');
          this.setState({
            confirmLoading: false,
            visible: false
          });
          this.props.refreshList();
        } else {
          this.setState({
            confirmLoading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          confirmLoading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  // start = () => {
  //   this.setState({
  //     selectedRowKeys: [],
  //     selectedRowList: []
  //   });
  // };
  onSelectChange = (selectedRowKeys, selectedRow) => {
    let { selectedRowList } = this.state;
    selectedRowList = selectedRowList.concat(selectedRow);
    selectedRowList = this.arrayFilter(selectedRowKeys, selectedRowList);
    this.setState({ selectedRowKeys, selectedRowList });
  };
  arrayFilter = (arrKey, arrList) => {
    let tempList = [];
    arrKey.map((item) => {
      tempList.push(arrList.find((el) => el.id === item));
    });
    return tempList;
  };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getAttributes()
    );
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  onSearch = () => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 8,
          total: 0
        }
      },
      () => this.getAttributes()
    );
  };
  getAttributeValue = (attributeValueList) => {
    let attributeValue = [];
    for (let i = 0; i < attributeValueList.length; i++) {
      attributeValue.push(attributeValueList[i].attributeDetailName);
    }
    return attributeValue.join(';');
  };

  render() {
    const { confirmLoading, selectedRowKeys, oldSelectedRowKeys, attributeList, pagination, searchForm } = this.state;
    const columns_attribute = [
      {
        title: 'Attribute name',
        dataIndex: 'attributeName',
        key: 'attributeName'
      },
      {
        title: 'Attribute value',
        dataIndex: 'attributeValue',
        key: 'attributeValue',
        width: '30%',
        render: (text, record) => <p>{record.attributesValuesVOList ? this.getAttributeValue(record.attributesValuesVOList) : ''}</p>
      }
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: (record) => ({
        disabled: JSON.stringify(oldSelectedRowKeys).indexOf(record.id) !== -1, // Column configuration not to be checked
        name: record.id
      })
    };
    // const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <Button type="primary" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openSelectAttribute()}>
          <span>Select attribute</span>
        </Button>
        <Modal title="Select attribute" visible={this.state.visible} width="800px" confirmLoading={confirmLoading} onOk={this.handleOk} onCancel={this.handleCancel}>
          <div>
            <div style={{ marginBottom: 16 }}>
              <Form className="filter-content" layout="inline">
                <Row>
                  <Col span={10}>
                    <FormItem>
                      <Input
                        addonBefore={<p style={styles.label}>Attribute name</p>}
                        value={searchForm.attributeName}
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onFormChange({
                            field: 'attributeName',
                            value
                          });
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={10}>
                    <FormItem>
                      <Input
                        addonBefore={<p style={styles.label}>Attribute value</p>}
                        value={searchForm.attributeValue}
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onFormChange({
                            field: 'attributeValue',
                            value
                          });
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={4} style={{ textAlign: 'center' }}>
                    <FormItem>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon="search"
                        shape="round"
                        onClick={(e) => {
                          e.preventDefault();
                          this.onSearch();
                        }}
                      >
                        <span>
                          <FormattedMessage id="search" />
                        </span>
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>

              {/* <Button type="primary" onClick={this.start} disabled={!hasSelected}>
                Reload
              </Button>
              <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span> */}
            </div>
            <Table rowKey="id" rowSelection={rowSelection} columns={columns_attribute} dataSource={attributeList} onChange={this.handleTableChange} pagination={pagination} />
          </div>
        </Modal>
      </div>
    );
  }
}
const styles = {
  label: {
    width: 120,
    textAlign: 'center'
  }
} as any;
