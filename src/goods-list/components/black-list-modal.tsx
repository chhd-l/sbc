import React from 'react';
import {Modal, Spin, Popconfirm, Tooltip, Button} from 'antd';
import {FormattedMessage} from 'react-intl';
import { DataGrid, RCi18n} from 'qmkit';
import {GoodsModal} from 'biz';
import '../index.less';


export default class BlackListModal extends React.Component<any, any>{
    currentSelected: any;

    constructor(props) {
        super(props);
        this.state = {
            priceBlackList: [
                {
                    goodsInfoId: 1,
                    goodsInfoNo: 1234,
                    goodsInfoName: 'goodsInfoName1',
                    specName: 'specName',
                    cateName: 'cateName',
                    brandName: 'brandName',
                    marketPrice: '20',
                    Inventory: 'Inventory',
                    number: 2223,

                },
                {
                    goodsInfoId: 2,
                    goodsInfoNo: 1234,
                    goodsInfoName: 'goodsInfoName2',
                    specName: 'specName',
                    cateName: 'cateName',
                    brandName: 'brandName',
                    marketPrice: '20',
                    Inventory: 'Inventory',
                    number: 2223,

                },
                {
                    goodsInfoId: 3,
                    goodsInfoNo: 1234,
                    goodsInfoName: 'goodsInfoName3',
                    specName: 'specName',
                    cateName: 'cateName',
                    brandName: 'brandName',
                    marketPrice: '20',
                    Inventory: 'Inventory',
                    number: 2223,

                },
            ],
            inventoryBlackList: [
                {
                    goodsInfoId: 1,
                    goodsInfoNo: 1234,
                    goodsInfoName: 'goodsInfoName1',
                    specName: 'specName',
                    cateName: 'cateName',
                    brandName: 'brandName',
                    marketPrice: '20',
                    Inventory: 'Inventory',
                    number: 2223,

                },
                {
                    goodsInfoId: 2,
                    goodsInfoNo: 1234,
                    goodsInfoName: 'goodsInfoName2',
                    specName: 'specName',
                    cateName: 'cateName',
                    brandName: 'brandName',
                    marketPrice: '20',
                    Inventory: 'Inventory',
                    number: 2223,

                },
                {
                    goodsInfoId: 3,
                    goodsInfoNo: 1234,
                    goodsInfoName: 'goodsInfoName3',
                    specName: 'specName',
                    cateName: 'cateName',
                    brandName: 'brandName',
                    marketPrice: '20',
                    Inventory: 'Inventory',
                    number: 2223,

                },
            ],

            confirmLoading: false,
            loading: false,
            productModalVisible: false,

            selectedSkuIds: [],
            selectedRows: [],
        }
        this.currentSelected = null;

    }

    componentDidMount() {
        // 初始化数据
        this.setState({
            loading: true
        })
        setTimeout(() =>{
            this.setState({
                loading: false,
            })
        }, 2000)
    }


    handleOk = e => {
        console.log(e);
        this.setState({
            confirmLoading: true
        })
        setTimeout(() =>{
            this.setState({
                confirmLoading: false
            })
            this.props.onCancel();
        }, 2000)
        let {
            priceBlackList,
            inventoryBlackList,
        } = this.state;

        // 提交已选产品结
    };

    handleCancel = e => {
        if (!this.props.onCancel) return;
        this.props.onCancel();
    };

    handleDelPrice = (key) => {
        let priceBlackList = [...this.state.priceBlackList];
        this.setState({
            priceBlackList: priceBlackList.filter((item) => item.goodsId !== key)
        })
    }

    handleDelInventory= (key) => {
        let inventoryBlackList = [...this.state.inventoryBlackList];
        this.setState({
            inventoryBlackList: inventoryBlackList.filter((item) => item.goodsId !== key)
        })
    }

    getPriceBlackListColumns = () => {
        return [
            {
                title: <FormattedMessage id="Product.SKUCode" />,
                dataIndex:"goodsInfoNo",
                key:"goodsInfoNo",
                width: "15%",
            },
            {
                title: <FormattedMessage id="Product.ProductName" />,
                dataIndex: 'goodsInfoName',
                key: 'goodsInfoName',
                width: "20%",
            },
            {
                title: <FormattedMessage id="Product.Specification" />,
                dataIndex:"specText",
                key:"specText",
                ellipsis: true,
                width: "20%",
                render: (text, record) => {
                    return !!text ? text : '-';
                },

            },
            {
                title: <FormattedMessage id="Product.ProductCategory" />,
                dataIndex: 'cateName',
                key: 'cateName',
                width: "15%"
            },
            {
                title: <FormattedMessage id="Product.Brand" />,
                dataIndex:"brandName",
                key:"brandName",
                render: (text, record) => {
                    return !!text ? text : '-';
                },
            },
            {
                title: <FormattedMessage id="Product.Operation" />,
                align: 'center',
                render: (rowInfo) => {
                    return (
                        <Popconfirm
                            placement="topLeft"
                            title={<FormattedMessage id="Product.deleteThisProduct" />}
                            onConfirm={() => this.handleDelPrice(rowInfo.goodsId)}
                            okText={<FormattedMessage id="Product.Confirm" />}
                            cancelText={<FormattedMessage id="Product.Cancel" />}
                        >
                            <Tooltip placement="top" title={<FormattedMessage id="Product.Delete" />}>
                                <a>
                                    <span className="icon iconfont iconDelete" style={{fontSize: 20}}/>
                                </a>
                            </Tooltip>
                        </Popconfirm>
                    );
                }
            },
        ]
    }

    getInventoryBlackListColumns = () => {
        return [
            {
                title: <FormattedMessage id="Product.SKUCode" />,
                dataIndex:"goodsInfoNo",
                key:"goodsInfoNo",
                width: "15%",
            },
            {
                title: <FormattedMessage id="Product.ProductName" />,
                dataIndex: 'goodsInfoName',
                key: 'goodsInfoName',
                width: "20%",
            },
            {
                title: <FormattedMessage id="Product.Specification" />,
                dataIndex:"specText",
                key:"specText",
                ellipsis: true,
                width: "20%",
                render: (text, record) => {
                    return !!text ? text : '-';
                },

            },
            {
                title: <FormattedMessage id="Product.ProductCategory" />,
                dataIndex: 'cateName',
                key: 'cateName',
                width: "15%"
            },
            {
                title: <FormattedMessage id="Product.Brand" />,
                dataIndex:"brandName",
                key:"brandName",
                render: (text, record) => {
                    return !!text ? text : '-';
                },
            },
            {
                title: <FormattedMessage id="Product.Operation" />,
                align: 'center',
                render: (rowInfo) => {
                    return (
                        <Popconfirm
                            placement="topLeft"
                            title={<FormattedMessage id="Product.deleteThisProduct" />}
                            onConfirm={() => this.handleDelPrice(rowInfo.goodsId)}
                            okText={<FormattedMessage id="Product.Confirm" />}
                            cancelText={<FormattedMessage id="Product.Cancel" />}
                        >
                            <Tooltip placement="top" title={<FormattedMessage id="Product.Delete" />}>
                                <a>
                                    <span className="icon iconfont iconDelete" style={{fontSize: 20}}/>
                                </a>
                            </Tooltip>
                        </Popconfirm>
                    );
                }
            },
        ]

    }

    showProductModal = (type) => {
        this.currentSelected = type;
        this.setState({
            productModalVisible: true
        })
    }

    closeProductModal = () => {
        this.setState({
            productModalVisible: false
        })
    }

    skuSelectedBackFun = (selectedSkuIds, selectedRows: any) => {

        if (!Array.isArray(selectedSkuIds) || !Array.isArray(selectedRows.toJS())) return;

        // type price 和 inventory

        this.setState({
            selectedSkuIds,
            selectedRows,
        })

        this.closeProductModal();
    }

    render() {
        let {
            visible,
        } = this.props;

        let {
            loading,
            confirmLoading,
            priceBlackList,
            inventoryBlackList,
            selectedSkuIds,
            selectedRows,
            productModalVisible,
        } = this.state;

        let priceColumns = this.getPriceBlackListColumns();
        let inventoryColumns = this.getInventoryBlackListColumns();

        return (
            <div>
                <Modal
                    width={1150}
                    title={null}
                    wrapClassName='blackListModal-wrap'
                    confirmLoading={confirmLoading}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={RCi18n({id:'Product.Confirm'})}
                    cancelText={RCi18n({id:'Product.Cancel'})}
                >
                    <Spin spinning={loading}>
                        <div className='list-box priceBlackList-box'>
                            <div className='list-box-title'><FormattedMessage id="Product.PriceBlackList" /></div>
                            <Button
                                type="primary"
                                onClick={() => this.showProductModal('price')}
                            >
                                <FormattedMessage id="Product.AddProduct" />
                            </Button>
                            <DataGrid
                                rowKey={(record) => record.goodsInfoId}
                                className='table-box'
                                dataSource={priceBlackList}
                                columns={priceColumns}
                                pagination={false}
                            />
                        </div>
                        <div className='list-box inventoryBlackList-box'>
                            <div className='list-box-title'><FormattedMessage id="Product.InventoryBlackList" /></div>
                            <Button
                                type="primary"
                                onClick={() => this.showProductModal('inventory')}
                            >
                                <FormattedMessage id="Product.AddProduct" />
                            </Button>
                            <DataGrid
                                rowKey={(record) => record.goodsInfoId}
                                className='table-box'
                                dataSource={inventoryBlackList}
                                columns={inventoryColumns}
                                pagination={false}

                            />
                        </div>
                    </Spin>

                </Modal>
                <GoodsModal
                    visible={productModalVisible}
                    selectedSkuIds={selectedSkuIds}
                    selectedRows={selectedRows}
                    onOkBackFun={this.skuSelectedBackFun}
                    onCancelBackFun={this.closeProductModal}
                />
            </div>
        );
    }
}