
import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AssetManagement } from 'qmkit';
import { Table, Tooltip, Modal, Button, Form, Input, Row, Col, message, Select, Radio, Spin, Tabs, Popconfirm, Checkbox, Popover, Icon, Card, InputNumber } from 'antd';
import { RCi18n } from 'qmkit';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
class ProductPrice extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Product.ProductPrice" />,
      searchForm: {
        taggingName: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      popoverKey:0,
      visible:false,
      taggingList: [{
        id: 2344,
        imageurl: '',
        type: 'Regular',
        name: 'Royal Canin',
        sku: 1234,
        spu: 3455,
        category: 'SPT vet',
        p_price: 234,
        m_price: 345,
        s_price: 344,
        datetime: '21:00 08/08/21'
      },{
        id: 234422,
        imageurl: '',
        type: 'Regular',
        name: 'Royal Canin',
        sku: 1234,
        spu: 3455,
        category: 'SPT vet',
        p_price: 234,
        m_price: 3451,
        s_price: 3442,
        datetime: '21:00 08/08/21'
      }],
      currentPrice:0,
      loading:false
    };
  }
  componentDidMount() {

  }
  //获取列表
  getGoodsPriceFun=async()=>{
    const {context,code}=await webapi.getGoodPrice();

  }
   //查询
   getGoodsPriceSearch=async()=>{
    const {context,code}=await webapi.searchPriceList();

  }
   //全部更新
   updatePriceAllFun=async()=>{
    const {context,code}=await webapi.updatePriceAll();

  }
   // 手动更新
   updatePriceSingleFun=async()=>{
    const {context,code}=await webapi.updatePriceSingle();

  }

  changPrice=(e)=> {
   this.setState({
    currentPrice:e
   })
  }
  submitPrice=(item)=>{
    console.log(item);
  }
  onSearchFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };

  onSearch = () => {
    const { searchForm } = this.state
    this.setState({
      oldSearchForm: {
        taggingName: searchForm.taggingName
      }
    }, () => {
    })
  };
  content = (item) => (<div
    style={{ width: 200, padding: 15 }} >
    <InputNumber min={1} onChange={(e)=>this.changPrice(e)} value={this.state.currentPrice} style={{ width: '100%' }} />
    <div style={{ marginTop: 10, display: "flex" }}>
      <Button type="primary" key="ok" style={{ flex: 1 }} onClick={()=>this.submitPrice(item)}>OK</Button>
      <Button key="cancel" style={{ flex: 1, marginLeft: 10 }} onClick={() => this.hide()}>Cancel</Button>
    </div>
  </div>
  );


  hide = () => {
    this.setState({
      visible: false,
      show: 0
    });
  };

  handleVisibleChange = (visible,item,name) => {
    console.log(item, visible,item[name],name)
    if(visible){
      this.setState({currentPrice:item[name], visible,popoverKey:(item.id + '_'+name)});
    }else{
      this.setState({ visible,popoverKey:0});
    }

   
  };


  render() {
    const { loading, title, taggingList, searchForm } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: <FormattedMessage id="Product.PriceTableColumnImage" />,
        dataIndex: 'image',
        key: 'image'
      },
      {
        title: <FormattedMessage id="Product.PriceTableColumnType" />,
        dataIndex: 'goodsInfoType',
        key: 'goodsInfoType'
      },
      {
        title: <FormattedMessage id="Product.PriceTableColumnName" />,
        dataIndex: 'goodsName',
        key: 'goodsName'
      },
      {
        title: <FormattedMessage id="Product.PriceTableColumnSKU" />,
        dataIndex: 'goodsInfoNo',
        key: 'goodsInfoNo'
      },
      {
        title: <FormattedMessage id="Product.PriceTableColumnSPU" />,
        dataIndex: 'goodsNo',
        key: 'goodsNo'
      },
      {
        title: <FormattedMessage id="Product.PriceTableColumnCategory" />,
        dataIndex: 'cateName',
        key: 'cateName'
      },
      {
        title: <FormattedMessage id="Product.PriceTableColumnPurchasePrice" />,
        dataIndex: 'purchasePrice',
        key: 'purchasePrice'
      },
      {
        title: <FormattedMessage id="Product.PriceTableColumnMarketPrice" />,
        dataIndex: 'marketPrice',
        key: 'marketPrice',
        render: (text, recode) => {
          
          return (<Popover  content={this.content(recode)}
            trigger="click"
            visible={this.state.popoverKey ===(recode.id + '_m_price') && this.state.visible}
            onVisibleChange={(v) => this.handleVisibleChange(v, recode,'m_price')}
          >
            <span style={{ marginRight: 10 }}>{text}</span><Icon type="edit" />
          </Popover>)
        }
      },
      {
        title: <FormattedMessage id="Product.PriceTableColumnSubscriptionPrice" />,
        dataIndex: 'subscriptionPrice',
        key: 'subscriptionPrice',
        render: (text, recode) => {
          return (<Popover  content={this.content(recode)}
            trigger="click"
            visible={this.state.popoverKey ===(recode.id + '_s_price') && this.state.visible}
            onVisibleChange={(v) => this.handleVisibleChange(v, recode,'s_price')}
          >
            <span style={{ marginRight: 10 }}>{text}</span><Icon type="edit" />
          </Popover>)
        }
      },
      {
        title: <FormattedMessage id="Product.PriceTableColumnUpatatime" />,
        dataIndex: 'updateTime',
        key: 'updateTime'
      },

    ];

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          <div className="container-search" style={{ paddingBottom: 20 }}>
            <Headline title={title} />
            <Row>
              <Col span={8}>
                <Input
                  style={{ width: '95%' }}
                  // addonBefore={RCi18n({id:'Product.Taggingname'})}
                  value={searchForm.taggingName}
                  placeholder={RCi18n({ id: 'Product.SearchProducts' })}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    this.onSearchFormChange({
                      field: 'taggingName',
                      value
                    });
                  }}
                />
              </Col>
              <Col span={8}>
                <Button
                  type="primary"
                  icon="search"
                  shape="round"
                  onClick={(e) => {
                    e.preventDefault();
                    this.onSearch();
                  }}
                >
                  <span>
                    <FormattedMessage id="Product.search" />
                  </span>
                </Button>
              </Col>
            </Row>
          </div>

          <div className="container-search">
            <Form layout="inline" >
              <Form.Item label={RCi18n({ id: 'Product.Marketpricepercentage' })}>
                {getFieldDecorator('marketPricePercentage', {
                  initialValue: '',

                })(<Input />)}
              </Form.Item>
              <Form.Item label={RCi18n({ id: 'Product.Subscriptionpricepercentage' })}>
                {getFieldDecorator('subscriptionPricePercentage', {
                  initialValue: ''
                })(<Input />)}
              </Form.Item>
              <Form.Item label={RCi18n({ id: 'Product.Roundoff' })}>
                {getFieldDecorator('roundOff', {
                  initialValue: '',

                })(<Checkbox />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  apply
                </Button>
              </Form.Item>
            </Form>

            <div style={{ marginTop: 20 }}>
              <Table style={{ paddingRight: 20 }} rowKey="id" columns={columns} dataSource={taggingList} pagination={this.state.pagination} scroll={{ x: '100%' }} onChange={this.handleTableChange} />

            </div>
          </div>

        </Spin>
      </div>
    );
  }
}
const styles = {
  edit: {
    paddingRight: 10
  },
  tableImage: {
    width: '60px',
    height: '60px',
    padding: '5px',
    border: '1px solid rgb(221, 221, 221)',
    background: 'rgb(255, 255, 255)'
  }
} as any;

export default Form.create()(ProductPrice);
