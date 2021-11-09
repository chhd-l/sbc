
import React, { Component } from 'react';
import { BreadCrumb, Headline, Const } from 'qmkit';
import { Table, Tooltip, Modal, Button, Form, Input, Row, Col, message, Select, Radio, Spin, Tabs, Popconfirm, Checkbox, Popover, Icon, Card, InputNumber, Avatar, Pagination } from 'antd';
import { RCi18n } from 'qmkit';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
const { confirm } = Modal;
const SORT_TYPE = {
  ascend: 'asc',
  descend: 'desc'
}
let objP = {
  marketPricePercentage: 0,
  subscriptionPricePercentage: 0
}
class ProductPrice extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Product.ProductPrice" />,
      totalColumn: 0,
      currentTotal: 0,
      searchName: '',
      pagination: {
        pageNum: 0,
        pageSize: 10,
        sortColumn: '',
        sortRole: '',
        condition: ''
      },
      goodsInfoIds: "",
      isDisabled: true,
      popoverKey: 0,
      visible: false,
      goodsPriceList: [],
      currentPrice: 0,
      loading: false
    };
  }
  componentDidMount() {
    this.getGoodsPriceFun();
  }
  //获取列表
  getGoodsPriceFun = async () => {
    let p = this.state.pagination
    this.setState({ loading: true })
    const { res } = await webapi.getGoodPrice(p);
    const { code, context } = res;
    if (code === Const.SUCCESS_CODE) {
      let goodsObj = context?.goodsManagePriceList
      this.setState({
        goodsPriceList: goodsObj?.content ?? [],
        totalColumn: context?.total ?? 0,
        currentTotal: goodsObj.total,
        loading: false,
        pagination: {
          pageNum: goodsObj.number,
          pageSize: goodsObj.size,
          ...p
        }
      },()=>{
        this.hide();
      })
    }
  }

  //提交全部更新
  submitApply = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let goodsInfoIds = this.state.goodsInfoIds;
        values.marketPricePercentage = values.marketPricePercentage.toString()
        values.subscriptionPricePercentage = values.subscriptionPricePercentage ? values.subscriptionPricePercentage.toString() : '100'
        this.props.form.setFieldsValue({subscriptionPricePercentage:values.subscriptionPricePercentage})
        let allP = {
          goodsInfoIds,
          ...values
        }
        if (goodsInfoIds === '') {
          this.showConfirm(allP);
        } else {
          this.updatePriceAllFun(allP)
        }
      }
    });
  }
  //全部更新
  updatePriceAllFun = async (params) => {
    this.setState({ loading: true })
    const { res } = await webapi.updatePriceAll(params);
    const { code } = res;
    if (code === Const.SUCCESS_CODE) {
      this.getGoodsPriceFun();
      message.success('operation success')
    }
    this.setState({ loading: false })
  }
  // 手动更新
  updatePriceSingleFun = async (param) => {
    const { res } = await webapi.updatePriceSingle(param);
    const { code } = res;
    if (code === Const.SUCCESS_CODE) {
      this.getGoodsPriceFun();
      message.success('operation success')
    }
  }


  changPrice = (e) => {
    this.setState({
      currentPrice: e.toString()
    })
  }
  submitPrice = (item, name) => {
    console.log(item);
    let param = {
      goodsInfoId: item.goodsInfoId,
      [name]: this.state.currentPrice
    }
    this.updatePriceSingleFun(param);
  }
  onSearchFormChange = (e) => {
    const searchName = e.target.value;
    this.setState({
      searchName
    })
  };





  hide = () => {
    this.setState({
      visible: false,
      show: 0
    });
  };

  handleVisibleChange = (visible, item, name) => {
    if (visible) {
      this.setState({ currentPrice: item[name], visible, popoverKey: (item.goodsInfoId + '_' + name) });
    } else {
      this.setState({ visible, popoverKey: 0 });
    }


  };
  //排序
  handleTableChange = (pagination, filters, sorter) => {
    console.log(sorter, pagination, filters)
    const pager = { ...this.state.pagination };
    pager.pageNum = pagination.current;
    pager.sortColumn = sorter.field
    pager.sortRole = SORT_TYPE[sorter.order];
    this.setState({
      pagination: pager,
    }, () => {
      this.getGoodsPriceFun();
    });
  };
  //检测用户输入
  checkFomeInput = (e, name) => {
    objP[name] = e
    let bool = objP.marketPricePercentage > 0;
    this.setState({
      isDisabled: !bool
    })
  }
  exportExcel=async()=>{
    const res=await webapi.exportPriceList()
    console.log(res)
    // const exportHref = Const.HOST + `/goods/price/export`;
    // window.open(exportHref);
  }

  showConfirm = (param) => {
    confirm({
      title: 'Do you want to apply all items?',
      content: 'When clicked the OK button, there are product list will update new price ,are you got it',
      onOk: () => {
        this.updatePriceAllFun(param)
      },
      onCancel() { },
    });
  }
  content = (item, name) => (<div
    style={{ width: 200, padding: 15 }} >
    <InputNumber min={1} onChange={(e) => this.changPrice(e)} value={this.state.currentPrice} style={{ width: '100%' }} />
    <div style={{ marginTop: 10, display: "flex" }}>
      <Button type="primary" key="ok" style={{ flex: 1 }} onClick={() => this.submitPrice(item, name)}>OK</Button>
      <Button key="cancel" style={{ flex: 1, marginLeft: 10 }} onClick={() => this.hide()}>Cancel</Button>
    </div>
  </div>
  );
 
  render() {
    const { loading, title, goodsPriceList, pagination, isDisabled, totalColumn, currentTotal, searchName } = this.state;
    const { getFieldDecorator } = this.props.form;
    let infoType={
    0:"Physical commodity",
    1:"Virtual goods",
    2:'Bundle goods',
    3:'VET goods',
    4:'Gift goods'
    }
    const columns = [
      {
        title: <FormattedMessage id="Product.PriceTableColumnImage" />,
        dataIndex: 'image',
        key: 'image',
        render: (text) => <Avatar shape="square" size={60} src={text} />
      },
      {
        title: <FormattedMessage id="Product.PriceTableColumnType" />,
        dataIndex: 'goodsInfoType',
        key: 'goodsInfoType',
        render:(text)=>(text === 2 ? <FormattedMessage id='Product.bundle'/> : <FormattedMessage id='Product.regular'/>)
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
        key: 'goodsNo',
        sorter: true,
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
        sorter: true,
        render: (text, recode) => {

          return (<Popover content={this.content(recode, 'marketPrice')}
            trigger="click"
            visible={this.state.popoverKey === (recode.goodsInfoId + '_marketPrice') && this.state.visible}
            onVisibleChange={(v) => this.handleVisibleChange(v, recode, 'marketPrice')}
          >
            <span style={{ marginRight: 10 }}>{text}</span><Icon type="edit" />
          </Popover>)
        }
      },
      {
        title: <FormattedMessage id="Product.PriceTableColumnSubscriptionPrice" />,
        dataIndex: 'subscriptionPrice',
        key: 'subscriptionPrice',
        sorter: true,
        render: (text, recode) => {
          return (<Popover content={this.content(recode, 'subscriptionPrice')}
            trigger="click"
            visible={this.state.popoverKey === (recode.goodsInfoId + '_subscriptionPrice') && this.state.visible}
            onVisibleChange={(v) => this.handleVisibleChange(v, recode, 'subscriptionPrice')}
          >
            <span style={{ marginRight: 10 }}>{text}</span><Icon type="edit" />
          </Popover>)
        }
      },
      {
        title: <FormattedMessage id="Product.PriceTableColumnUpatatime" />,
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: true,
        render:(text)=>moment(text).format('YYYY-MM-DD HH:mm:ss')
      },

    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        let goodsInfoIds = selectedRows.map(item => item.goodsInfoId);
        this.setState({
          goodsInfoIds: goodsInfoIds.toString()
        })
      }
    };
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search" style={{ paddingBottom: 20 }}>
          <Headline title={title} />
          <Row>
            <Col span={8}>
              <Input
                style={{ width: '95%' }}
                // addonBefore={RCi18n({id:'Product.Taggingname'})}
                value={searchName}
                placeholder={RCi18n({ id: 'Product.SearchProducts' })}
                onChange={this.onSearchFormChange}
              />
            </Col>
            <Col span={8}>
              <Button
                type="primary"
                icon="search"
                shape="round"
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({
                    pagination: {
                      ...pagination,
                      pageNum: 0,
                      condition: searchName
                    }
                  }, () => {
                    this.getGoodsPriceFun();
                  })
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
          <Row>
            <Col span={18}>
              <Form layout="inline" onSubmit={(e) => this.submitApply(e)}>
                <Form.Item label={RCi18n({ id: 'Product.Marketpricepercentage' })}>
                  {getFieldDecorator('marketPricePercentage', {
                    initialValue: '',
                    onChange: (e) => this.checkFomeInput(e, 'marketPricePercentage')
                  })(<InputNumber min={0} />)}
                </Form.Item>
                <Form.Item label={RCi18n({ id: 'Product.Subscriptionpricepercentage' })}>
                  {getFieldDecorator('subscriptionPricePercentage', {
                    initialValue: '100',
                    onChange: (e) => this.checkFomeInput(e, 'subscriptionPricePercentage')
                  })(<InputNumber min={0} />)}
                </Form.Item>
                {/* <Form.Item label={RCi18n({ id: 'Product.Roundoff' })}>
                  {getFieldDecorator('roundOff', {
                    initialValue: false,
                    valuePropName: 'checked',
                  })(<Checkbox />)}
                </Form.Item> */}
                <Form.Item>
                  <Button type="primary" htmlType="submit" disabled={isDisabled}>
                    apply
                  </Button>
                </Form.Item>
              </Form>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: "right" }}>
                <span>{totalColumn} SKU</span> <Button type="primary" onClick={()=>this.exportExcel()}>export</Button>
              </div>
            </Col>
          </Row>
          <Spin spinning={loading}>

            <div style={{ marginTop: 20 }}>
              <Table

                rowKey="goodsInfoId"
                rowSelection={rowSelection}
                onChange={this.handleTableChange}
                columns={columns}
                dataSource={goodsPriceList}
                pagination={false}
                scroll={{ x: '100%' }} />


              {currentTotal > 0 ? (
                <Pagination
                  current={pagination.pageNum + 1}
                  total={currentTotal}
                  pageSize={pagination.pageSize}
                  showTotal={total => `Total ${currentTotal}`}
                  onChange={(pageNum, pageSize) => {
                    console.log(pageNum)
                    this.setState({
                      pagination: {
                        ...this.state.pagination,
                        pageNum: pageNum - 1,
                        pageSize
                      }
                    }, () => {
                      this.getGoodsPriceFun();
                    })
                  }}
                />
              ) : null}
            </div>
          </Spin>

        </div>


      </div>
    );
  }
}


export default Form.create()(ProductPrice);
