import * as React from 'react';

import { Modal, Table, Input, Checkbox, Button } from 'antd';
import { noop, util } from 'qmkit';
import { Relax } from 'plume2';
import { List } from 'immutable';
declare type IList = List<any>;

@Relax
/*发布*/
export default class DetailPublish extends React.Component<any, any> {
  props: {
    relaxProps?: {
      sharing: any;
      productForm: any;
      productList: IList;
      onSharing: Function;
      onProductForm: Function;
      loading: boolean;
    };
  };

  static relaxProps = {
    sharing: 'sharing',
    productForm: 'productForm',
    onSharing: noop,
    onProductForm: noop,
    loading: 'loading',
    productList: 'productList'
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false
    };
  }
  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false
      });
    }, 1000);
  };

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  handleOk = (e) => {
    //console.log(e);
    const { sharing } = this.props.relaxProps;
    console.log(sharing.toJS(), 111111111111111);
  };

  handleCancel = (e) => {
    this.props.showModal(false);
  };

  handleTableChange(pagination: any) {
    const { onProductForm } = this.props.relaxProps;

    onProductForm({ pageNum: pagination.current, pageSize: 10 });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { visible, ok, cancel } = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (visible !== prevState.visible) {
      return {
        visible
      };
    }
    // 否则，对于state不进行任何操作
    return null;
  }
  componentDidMount() {
    const { onProductForm } = this.props.relaxProps;
    onProductForm();
  }
  render() {
    const {
      loading,
      sharing,
      onProductForm,
      productForm,
      productList
    } = this.props.relaxProps;
    const { selectedRowKeys } = this.state;
    const rowSelection = { selectedRowKeys, onChange: this.onSelectChange };
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        title: 'No',
        dataIndex: 'name',
        render: (text) => <a>{text}</a>
      },
      {
        title: 'Image',
        dataIndex: 'Image'
      },
      {
        title: 'Product Name',
        dataIndex: 'Product'
      },
      {
        title: 'SKU',
        dataIndex: 'SKU'
      },
      {
        title: 'Member Price',
        dataIndex: 'Member'
      },
      {
        title: 'Status',
        dataIndex: 'Status'
      },
      {
        title: 'Operation',
        dataIndex: 'Operation'
      }
    ];
    return (
      <div id="publishButton">
        <Modal
          width={1200}
          title={
            //主要实现代码此处可传入一个html结构组件也是可以的
            <div style={{ color: '#e2001a', fontSize: 18 }}>Sharing</div>
          }
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div className="product">
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                onClick={this.start}
                disabled={!hasSelected}
              >
                Reload
              </Button>
              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
              </span>
            </div>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={productList ? productList.toJS() : []}
              loading={loading}
              pagination={{
                onChange: (pageNum, pageSize) => {
                  onProductForm({ pageNum: pageNum - 1, pageSize });
                }
              }}
            />
          </div>
        </Modal>
      </div>
    );
  }
}
