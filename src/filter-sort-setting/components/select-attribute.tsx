import { Button, Form, Icon, Input, message, Modal, Radio, Table } from 'antd';
import moment from 'moment';
import { Const } from 'qmkit';
import React from 'react';
import * as webapi from './../webapi';
import { IList } from 'typings/globalType';

export default class SelectAttribute extends React.Component<any, any> {
  props = {
    refreshList: Function,
    selectedRowKeys: Array
  };
  state = {
    visible: false,
    selectedRowKeys: [],
    prevPropSelectedRowKeys: [],
    selectedRow: [],
    attributeList: [],
    confirmLoading: false,
    pagination: {
      current: 1,
      pageSize: 8,
      total: 0
    }
  };
  componentDidMount() {
    this.getAttributes();
  }

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
  getAttributes = () => {
    const { pagination } = this.state;
    let params = {
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
    this.setState({
      visible: true
    });
  };
  handleOk = () => {
    this.setState({
      confirmLoading: true
    });
    const { selectedRow } = this.state;
    let storeGoodsFilterList = [];
    for (let i = 0; i < selectedRow.length; i++) {
      let item = {
        attributeId: selectedRow[i].id,
        attributeName: selectedRow[i].attributeName,
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
    this.setState(
      {
        pagination: pagination
      },
      () => this.getAttributes()
    );
  };

  render() {
    const { confirmLoading, selectedRowKeys, attributeList, pagination } = this.state;
    const columns_attribute = [
      {
        title: 'Attribute name',
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
        <Button type="primary" style={{ margin: '10px 0 10px 0' }} onClick={() => this.openSelectAttribute()}>
          <span>Select attribute</span>
        </Button>
        <Modal title="Select attribute" visible={this.state.visible} width="600px" confirmLoading={confirmLoading} onOk={this.handleOk} onCancel={this.handleCancel}>
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={this.start} disabled={!hasSelected}>
                Reload
              </Button>
              <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
            </div>
            <Table rowKey="id" rowSelection={rowSelection} columns={columns_attribute} dataSource={attributeList} onChange={this.handleTableChange} pagination={pagination} />
          </div>
        </Modal>
      </div>
    );
  }
}
