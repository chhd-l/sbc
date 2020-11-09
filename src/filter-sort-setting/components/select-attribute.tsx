import { Button, Form, Icon, Input, message, Modal, Radio, Table } from 'antd';
import moment from 'moment';
import { Const } from 'qmkit';
import React from 'react';
import * as webapi from './../webapi';

const FormItem = Form.Item;
class SelectAttribute extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      selectedRowKeys: [],
      attributeList: [],
      confirmLoading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }
  componentDidMount() {
    this.getAttributes();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // const {type} = nextProps;
    // // 当传入的值发生变化的时候，更新state
    // if (type !== prevState.type) {
    //     return {
    //         type,
    //     };
    // }
    // // 否则，对于state不进行任何操作
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

  onAttributeFormChange = ({ field, value }) => {
    let data = this.state.attributeForm;
    data[field] = value;
    this.setState({
      attributeForm: data
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
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  start = () => {
    this.setState({
      selectedRowKeys: []
    });
  };
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const { confirmLoading, selectedRowKeys, attributeList } = this.state;
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
        <Modal title="Bind attribute" visible={this.state.visible} confirmLoading={confirmLoading} onOk={this.handleOk} onCancel={this.handleCancel}>
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={this.start} disabled={!hasSelected}>
                Reload
              </Button>
              <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
            </div>
            <Table rowKey="id" rowSelection={rowSelection} columns={columns_attribute} dataSource={attributeList} />
          </div>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(SelectAttribute);
