import * as React from 'react';
import { Modal, Table, Select, Checkbox, Button } from 'antd';
import { noop, util } from 'qmkit';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { accDiv } from '../../../web_modules/qmkit/float';
import moment from 'moment';
declare type IList = List<any>;
const { Option } = Select;
let arrQuantity = [];
let arrAll = [];
let getpageNum = [1];
@Relax
/*发布*/
export default class DetailPublish extends React.Component<any, any> {
  props: {
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
      addProduct: [],
      pageNum: 0,
      getArr: []
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
    // console.log(arrQuantity);
    // console.log(selectedRowKeys);
    selectedRowKeys.map((item, i) => {
      //  console.log(item),111111111;
      //  console.log(v[i]),222222;

      if (arrQuantity.length > 0) {
        arrQuantity.map((m, n) => {
          if (m.no == item) {
            v[i].recommendationNumber = Number(m.recommendationNumber);
          }
        });
      }
    });
    console.log(v, 1111);
    console.log(arrAll, 1111);
    this.setState({ selectedRowKeys, addProduct: v });
  };
  handleOk = (e) => {
    const { onProductselect } = this.props.relaxProps;
    console.log(arrAll);
    //onProductselect(this.state.addProduct);
    //this.props.showModal(false);
  };

  handleCancel = (e) => {
    this.props.showModal(false);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visible } = nextProps;
    let getPageNum = nextProps.relaxProps.productForm
      ? nextProps.relaxProps.productForm.pageNum
      : 0;
    //console.log(nextProps,'aaaaa');
    //console.log(prevState.pageNum,'cccc');

    // 当传入的visible发生变化的时候，更新state
    if (visible !== prevState.visible) {
      return {
        visible
      };
    }
    // 否则，对于state不进行任何操作
    return null;
  }
  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any
  ) {
    console.log(prevProps, 'aaaaa');

    console.log(this.state.pageNum, 123);
    console.log(prevState.pageNum, 'bbbb');
  }

  componentDidMount() {
    const { onProductForm } = this.props.relaxProps;
    onProductForm();
  }

  handleChange = (value, a, index, e) => {
    arrQuantity.push({ no: a.goodsInfoNo, recommendationNumber: e });
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
              rowKey={(record, index) => record.goodsInfoNo}
              size="small"
              pagination={{
                total,
                onChange: (pageNum, pageSize) => {
                  getpageNum.push(pageNum);
                  let a = [...new Set([...getpageNum])];
                  console.log(a, '++++++++++++');
                  a.map((v, i) => {
                    console.log(pageNum);
                    console.log(v);

                    if (pageNum != v) {
                      arrAll = arrAll.concat(this.state.addProduct);
                    }
                  });

                  this.setState({ pageNum });
                  console.log(pageNum);

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
