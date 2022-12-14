import { Button, Form, Icon, Input, message, Modal, Radio, Table, Tooltip, Select, Row, Col } from 'antd';
import moment from 'moment';
import { Const, SelectGroup, RCi18n } from 'qmkit';
import React from 'react';
import * as webapi from './../webapi';
import { IList } from 'typings/globalType';
import { FormattedMessage } from 'react-intl';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

const DragHandle = sortableHandle(() => <Icon type="drag" style={{ fontSize: 20, color: '#e2001a', marginLeft: 20 }} />);

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);
export default class RelevancyProduct extends React.Component<any, any> {
  props = {
    sortId: String
  };
  state = {
    visible: false,
    step: 1,
    searchForm: {
      productName: '',
      spu: ''
    },
    prpductList: [],
    selectedRowKeys: [],
    prevPropSelectedRowKeys: [],
    selectedRowList: [],
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
    // if (JSON.stringify(props.selectedRowKeys) !== JSON.stringify(state.prevPropSelectedRowKeys)) {
    //   return {
    //     selectedRowKeys: props.selectedRowKeys,
    //     prevPropSelectedRowKeys: props.selectedRowKeys
    //   };
    // }

    return null;
  }
  openModal = () => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        searchForm: {
          productName: '',
          spu: ''
        }
      },
      () => this.getProductList()
    );
    this.getSelectedProductList();
  };
  handleOk = () => {
    const { step, selectedRowList } = this.state;
    const { sortId } = this.props;
    if (step === 1) {
      for (let i = 0; i < selectedRowList.length; i++) {
        selectedRowList[i].index = i;
      }
      this.setState({
        selectedRowList,
        step: 2
      });
    } else {
      let goodsSortRelList = [];
      for (let i = 0; i < selectedRowList.length; i++) {
        selectedRowList[i].sort = i + 1;
        let param = {
          goodsId: selectedRowList[i].goodsId,
          sort: selectedRowList[i].sort,
          sortId: sortId,
          id: selectedRowList[i].id || ''
        };
        goodsSortRelList.push(param);
      }
      let params = {
        sortId: sortId,
        goodsSortRelList: goodsSortRelList
      };
      this.updateOverridedProduct(params);
    }
  };
  handleCancel = () => {
    const { step } = this.state;
    if (step === 2) {
      this.setState({
        step: 1
      });
    } else {
      this.setState({
        visible: false
      });
    }
  };
  handleClose = () => {
    this.setState({
      visible: false
    });
  };
  start = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRowList: []
    });
  };
  onSelectChange = (selectedRowKeys, selectedRow) => {
    let { selectedRowList } = this.state;
    selectedRowList = selectedRowList.concat(selectedRow);
    selectedRowList = this.arrayFilter(selectedRowKeys, selectedRowList);
    this.setState({ selectedRowKeys, selectedRowList });
  };

  arrayFilter = (arrKey, arrList) => {
    let tempList = [];
    arrKey.map((item) => {
      tempList.push(arrList.find((el) => el.goodsId === item));
    });
    return tempList;
  };

  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getProductList()
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
          pageSize: 10,
          total: 0
        }
      },
      () => this.getProductList()
    );
  };
  getProductList = () => {
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
          let prpductList = res.context.goods.content;
          pagination.total = res.context.goods.total;
          this.setState({
            prpductList,
            pagination
          });
        }
      })
      .catch((err) => {});
  };

  getSelectedProductList = () => {
    let sortIdList = [];
    sortIdList.push(this.props.sortId);
    let params = {
      sortIdList: sortIdList
    };
    webapi
      .getSelectedProductList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let selectedRowKeys = [];
          let selectedRowList = [];
          let selectedRow = res.context;
          for (let i = 0; i < selectedRow.length; i++) {
            selectedRowKeys.push(selectedRow[i].goodsId);
            let item = {
              id: selectedRow[i].id,
              goodsId: selectedRow[i].goodsId,
              goodsImg: selectedRow[i].goods.goodsImg,
              goodsName: selectedRow[i].goods.goodsName,
              brandName: selectedRow[i].goods.brandName,
              goodsCateName: selectedRow[i].goods.goodsCateName,
              goodsNo: selectedRow[i].goods.goodsNo,
              selectedFlag: false,
              storeCateName: selectedRow[i].goods.storeCateName
            };
            selectedRowList.push(item);
          }
          this.setState({
            step: 1,
            visible: true,
            selectedRowKeys,
            selectedRowList
          });
        }
      })
      .catch((err) => {});
  };
  updateOverridedProduct = (params) => {
    webapi
      .updateOverridedProduct(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(<FormattedMessage id="Product.OperateSuccessfully" />);
          this.setState({
            visible: false
          });
        }
      })
      .catch((err) => {});
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { selectedRowList } = this.state;

    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(selectedRowList), oldIndex, newIndex).filter((el) => !!el);
      for (let i = 0; i < newData.length; i++) {
        newData[i].sort = i + 1;
      }
      this.setState({
        selectedRowList: newData
      });
    }
  };

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { selectedRowList } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = selectedRowList.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  render() {
    const { confirmLoading, selectedRowKeys, prpductList, pagination, step, selectedRowList, searchForm } = this.state;
    const columns_product = [
      {
        title: <FormattedMessage id="Product.Image" />,
        dataIndex: 'goodsImg',
        key: 'goodsImg',
        render: (text) => <img src={text} alt="" style={{ width: 20 }} />
      },
      {
        title: <FormattedMessage id="Product.SPU" />,
        dataIndex: 'goodsNo',
        key: 'goodsNo'
      },
      {
        title: <FormattedMessage id="Product.ProductName" />,
        dataIndex: 'goodsName',
        key: 'goodsName'
      },
      {
        title: <FormattedMessage id="Product.SalesCategory" />,
        dataIndex: 'storeCateName',
        key: 'storeCateName'
      },
      {
        title: <FormattedMessage id="Product.ProductCategory" />,
        dataIndex: 'goodsCateName',
        key: 'goodsCateName'
      },
      {
        title: <FormattedMessage id="Product.Brand" />,
        dataIndex: 'brandName',
        key: 'brandName'
      }
    ];

    const columns_product_sort = [
      {
        title: <FormattedMessage id="Product.Image" />,
        dataIndex: 'goodsImg',
        key: 'goodsImg',
        render: (text) => <img src={text} alt="" style={{ width: 20 }} />
      },
      {
        title: <FormattedMessage id="Product.SPU" />,
        dataIndex: 'goodsNo',
        key: 'goodsNo'
      },
      {
        title: <FormattedMessage id="Product.ProductName" />,
        dataIndex: 'goodsName',
        key: 'goodsName'
      },
      {
        title: <FormattedMessage id="Product.SalesCategory" />,
        dataIndex: 'storeCateName',
        key: 'storeCateName'
      },
      {
        title: <FormattedMessage id="Product.ProductCategory" />,
        dataIndex: 'goodsCateName',
        key: 'goodsCateName'
      },
      {
        title: <FormattedMessage id="Product.Brand" />,
        dataIndex: 'brandName',
        key: 'brandName'
      },
      {
        title: <FormattedMessage id="Product.Operation" />,
        dataIndex: 'operation',
        className: 'drag-visible',
        render: (text, record) => (
          <div>
            <DragHandle />
          </div>
        )
      }
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;

    const DraggableContainer = (props) => <SortableContainer useDragHandle helperClass="row-dragging" onSortEnd={this.onSortEnd} {...props} />;
    return (
      <div style={{ display: 'inline-block' }}>
        <Tooltip placement="top" title={<FormattedMessage id="Product.OverridedProduct" />}>
          <a style={styles.edit} onClick={() => this.openModal()} className="iconfont iconEdit"></a>
        </Tooltip>
        <Modal
          title={<FormattedMessage id="Product.OverridedProduct" />}
          visible={this.state.visible}
          width="1200px"
          onOk={this.handleOk}
          onCancel={this.handleClose}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              {step === 1 ? 'Close' : 'Previous'}
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              {step === 1 ? 'Next' : 'Save'}
            </Button>
          ]}
        >
          {step === 1 ? (
            <div>
              <div style={{ marginBottom: 16 }}>
                <Form className="filter-content" layout="inline">
                  <Row>
                    <Col span={8}>
                      <FormItem>
                        <Input
                          addonBefore={
                            <p style={styles.label} title={RCi18n({id:'Product.ProductName'})}>
                              <FormattedMessage id="Product.ProductName" />
                            </p>
                          }
                          value={searchForm.productName}
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
                          addonBefore={<p style={styles.label} title={RCi18n({id:'Product.SPU'})}><FormattedMessage id="Product.SPU"/></p>}
                          value={searchForm.spu}
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
                            <FormattedMessage id="Product.search" />
                          </span>
                        </Button>
                      </FormItem>
                    </Col>
                  </Row>
                </Form>

                <Button type="primary" onClick={this.start} disabled={!hasSelected}>
                  <FormattedMessage id="Product.Reload" />
                </Button>
                <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
              </div>
              <Table rowKey="goodsId" rowSelection={rowSelection} columns={columns_product} dataSource={prpductList} onChange={this.handleTableChange} pagination={pagination} />
            </div>
          ) : (
            <Table
              pagination={false}
              dataSource={selectedRowList}
              columns={columns_product_sort}
              rowKey="index"
              components={{
                body: {
                  wrapper: DraggableContainer,
                  row: this.DraggableBodyRow
                }
              }}
            />
          )}
        </Modal>
      </div>
    );
  }
}
const styles = {
  edit: {
    paddingRight: 10
  },
  label: {
    width: 100,
    textAlign: 'center'
  }
} as any;
