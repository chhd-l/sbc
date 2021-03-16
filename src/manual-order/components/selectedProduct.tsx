import { Button, Table } from 'antd';
import React from 'react';
import AddProductModal from './addProductModal';

export default class SelectedProduct extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false
    };
  }

  addProduct = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false
    });
  };

  render() {
    // const { getFieldDecorator } = this.props.form;
    const { noLanguageSelect } = this.props;
    const dataSource = [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号'
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号'
      }
    ];

    const columns = [
      {
        title: 'Image',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'SKU',
        dataIndex: 'age',
        key: 'age'
      },
      {
        title: 'Product name',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: 'Weight',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: 'Marketing price',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: 'Subscription price',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: 'Selected Subscription',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: 'Frequency',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: 'Quantity',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: 'Total amount',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: 'Operation',
        dataIndex: 'address',
        key: 'address'
      }
    ];
    return (
      <div>
        <h3>Step2</h3>
        <h4>
          {this.props.stepName}
          {/* <span className="ant-form-item-required"></span> */}
        </h4>
        <Button type="primary" onClick={this.addProduct}>
          Add product
        </Button>
        <div className="basicInformation">
          <Table dataSource={dataSource} columns={columns} />;<AddProductModal visible={this.state.visible} handleCancel={this.handleCancel} handleOk={this.handleOk}></AddProductModal>
        </div>
      </div>
    );
  }
}
