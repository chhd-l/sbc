import * as React from 'react';
import { Modal, Table, Select, Checkbox, Button } from 'antd';
import { noop, util } from 'qmkit';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { accDiv } from '../../qmkit/float';
import moment from 'moment';
declare type IList = List<any>;
const { Option } = Select;
let arrQuantity = [];

@Relax
/*发布*/
export default class DetailPublish extends React.Component<any, any> {
  props: {
    showModal?:Function
    relaxProps?: {
      sharing: any;
      productForm: any;
      productList: IList;
      onProductselect: Function;
      onSharing: Function;
      onProductForm: Function;
      loading: boolean;
      createLink: any;
     
    };
  };

  static relaxProps = {
    sharing: 'sharing',
    productForm: 'productForm',
    onSharing: noop,
    onProductForm: noop,
    onProductselect: noop,
    loading: 'loading',
    productList: 'productList',
    createLink: 'createLink'
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      addProduct: []
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

  onSelectChange = (selectedRowKeys, v, o) => {
    selectedRowKeys.forEach((item, i) => {
      v[i].quantity = 1;
      if (arrQuantity.length > 0) {
        arrQuantity.forEach((m, n) => {
          if (m.no == item) {
            v[i].quantity = Number(m.quantity);
          }
        });
      }
    });
    this.setState({ selectedRowKeys, addProduct: v });
  };
  handleOk = (e) => {
    const { onProductselect } = this.props.relaxProps;
    onProductselect(this.state.addProduct);
    this.props.showModal(false);
  };

  handleCancel = (e) => {
    this.props.showModal(false);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visible } = nextProps;
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

  handleChange = (value, a, index, e) => {
    arrQuantity.push({ no: index, quantity: e });
  };

  render() {
    const {
      loading,
      sharing,
      onProductForm,
      productForm,
      productList
    } = this.props.relaxProps;
    const { selectedRowKeys } = this.state;
    const total = productForm && productForm.total;
    const pageNum = productForm && productForm.pageNum;

    const rowSelection = { selectedRowKeys, onChange: this.onSelectChange };
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      /*{
        title: 'No',
        dataIndex: 'id',
        key: 'departmentName',
        render: (text,record,index)=>{
          return <span>{(pageNum)*10+index+1}</span>
        }
      },
      {
        title: 'Image',
        dataIndex: 'goodsInfoImg',
        key: 'goodsInfoImg',
        render: (text) => <img src={text} alt="" width="20" height="25"/>
      },*/
      {
        title: 'Product Name',
        dataIndex: 'goodsInfoName',
        key: 'goodsInfoName'
      },
      {
        title: 'SKU',
        dataIndex: 'goodsInfoNo',
        key: 'goodsInfoNo'
      },
      {
        title: 'Signed classification',
        dataIndex: 'Signed',
        key: 'Signed',
        render: (text, record, index) => {
          return <span>{record.goods.goodsCateName}</span>;
        }
      },
      {
        title: 'Price',
        dataIndex: 'marketPrice',
        key: 'marketPrice'
      },
      {
        title: 'Quantity',
        dataIndex: 'addedFlag',
        key: 'addedFlag',
        width: '8%',
        render: (text, record, index) => {
          return (
            <Select
              defaultValue="1"
              style={{ width: 120 }}
              onChange={(e) => this.handleChange(text, record, index, e)}
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
              <Option value="6">6</Option>
              <Option value="7">7</Option>
              <Option value="8">8</Option>
              <Option value="9">9</Option>
              <Option value="10">10</Option>
            </Select>
          );
        }
      }
      /*{
        title: 'Operation',
        dataIndex: 'Operation'
      }*/
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
              size="small"
              pagination={{
                total,
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
