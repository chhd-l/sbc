import { Button, Form, Icon, Input, message, Modal, Radio, Table, Tooltip, Select, Row, Col } from 'antd';
import moment from 'moment';
import { Const, SelectGroup } from 'qmkit';
import React from 'react';
import * as webapi from './../webapi';
import { IList } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
export default class SelectAttribute extends React.Component<any, any> {
  props = {
    refreshList: Function,
    selectedRowKeys: Array
  };
  state = {
    visible: false,
    setp: 0,
    searchForm: {
      productName: '',
      spu: ''
    },
    prpductList: [],
    selectedRowKeys: [],
    prevPropSelectedRowKeys: [],
    selectedRow: [],
    confirmLoading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  };
  componentDidMount() {}

  static getDerivedStateFromProps(props, state) {
    // 当传入的值发生变化的时候，更新state
    if (JSON.stringify(props.selectedRowKeys) !== JSON.stringify(state.prevPropSelectedRowKeys)) {
      return {
        selectedRowKeys: props.selectedRowKeys,
        prevPropSelectedRowKeys: props.selectedRowKeys
      };
    }

    return null;
  }
  openModal = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = () => {
    this.setState({
      visible: false
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  start = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRow: []
    });
  };
  onSelectChange = (selectedRowKeys, selectedRow) => {
    this.setState({ selectedRowKeys, selectedRow });
  };
  handleTableChange = (pagination: any) => {
    this.setState({
      pagination: pagination
    });
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  onSearch = () => {
    const { searchForm, pagination } = this.state;
    let params = {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize,
      goodsName: searchForm.productName,
      goodsNo: searchForm.spu
    };
    webapi
      .getProductList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          console.log(res);
        } else {
          message.error(res.message || 'operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'operation failure');
      });
  };

  render() {
    const { confirmLoading, selectedRowKeys, prpductList, pagination } = this.state;
    const columns_attribute = [
      {
        title: 'Image',
        dataIndex: 'attributeName',
        key: 'attributeName'
      },
      {
        title: 'SPU',
        dataIndex: 'attributeName',
        key: 'attributeName'
      },
      {
        title: 'Product name',
        dataIndex: 'attributeName',
        key: 'attributeName'
      },
      {
        title: 'Sales category',
        dataIndex: 'attributeName',
        key: 'attributeName'
      },
      {
        title: 'Product category',
        dataIndex: 'attributeName',
        key: 'attributeName'
      },
      {
        title: 'Brand',
        dataIndex: 'attributeName',
        key: 'attributeName'
      }
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <Tooltip placement="top" title="Edit">
          <a style={styles.edit} onClick={() => this.openModal()} className="iconfont iconEdit"></a>
        </Tooltip>
        <Modal title="Select attribute" visible={this.state.visible} width="800px" onOk={this.handleOk} onCancel={this.handleCancel}>
          <div>
            <div style={{ marginBottom: 16 }}>
              <Form className="filter-content" layout="inline">
                <Row>
                  <Col span={8}>
                    <FormItem>
                      <Input
                        addonBefore={<p style={styles.label}>Product name</p>}
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onFormChange({
                            field: 'productName',
                            value
                          });
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem>
                      <Input
                        addonBefore={<p style={styles.label}>SPU</p>}
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onFormChange({
                            field: 'spu',
                            value
                          });
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={8} style={{ textAlign: 'center' }}>
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

              <Button type="primary" onClick={this.start} disabled={!hasSelected}>
                Reload
              </Button>
              <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
            </div>
            <Table rowKey="id" rowSelection={rowSelection} columns={columns_attribute} dataSource={prpductList} onChange={this.handleTableChange} pagination={pagination} />
          </div>
        </Modal>
      </div>
    );
  }
}
const styles = {
  edit: {
    paddingRight: 20
  },
  label: {
    width: 120,
    textAlign: 'center'
  }
} as any;
