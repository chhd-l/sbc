import React from 'react';
import {Modal, Spin, Popconfirm, Tooltip, Button, Table} from 'antd';
import {FormattedMessage} from 'react-intl';
import { DataGrid, RCi18n} from 'qmkit';
import {GoodsModal} from 'biz';
import '../index.less';

export default class BlackListModal extends React.Component<any, any>{
    currentSelected: any;

    constructor(props) {
        super(props);
        this.state = {
            priceBlackList: [],
            inventoryBlackList: [],

            confirmLoading: false,
            loading: false,

            productModalVisible: false,

            selectedSkuIds: [],
            selectedRows: [],
        }
        this.currentSelected = null;

    }

    componentDidMount() {
        let priceBlackList = [
            {
                goodsInfoId: '8a70802e7ae8ee92017aec3b9f3a001d',
                goodsInfoName: 'tmjgift12',
                specText: [
                    {
                        name: '规格1',
                        value: '10kg'
                    },
                    {
                        name: '规格2',
                        value: '10g'
                    },
                    {
                        name: '规格3',
                        value: '10unit'
                    }
                ],
                goodsInfoNo: 'T80010',
                cateName: 'CA Cat food',
                brandName: null,
            },
            {
                goodsInfoId: '8a70802e7ae8ee92017aec3ad8a1001b',
                goodsInfoName: 'tmjgift125',
                goodsInfoNo: 'T80011',
                specText: null,
                cateName: 'CA Cat food',
                brandName: null,
            },
        ]
        let inventoryBlackList = [
            {
                goodsInfoId: '8a70802e7ae8ee92017aec3b9f3a001d',
                goodsInfoName: 'tmjgift12',
                specText: [
                    {
                        name: '规格1',
                        value: '10kg'
                    },
                    {
                        name: '规格2',
                        value: '10g'
                    },
                    {
                        name: '规格3',
                        value: '10unit'
                    }
                ],
                goodsInfoNo: 'T80010',
                cateName: 'CA Cat food',
                brandName: null,
            },
            {
                goodsInfoId: '8a70802e7ae8ee92017aec3ad8a1001b',
                goodsInfoName: 'tmjgift125',
                goodsInfoNo: 'T80011',
                specText: null,
                cateName: 'CA Cat food',
                brandName: null,
            },

        ];
        // 初始化数据 priceBlackList 和 inventoryBlackList
        this.setState({
            loading: true
        })
        setTimeout(() => {
            this.setState({
                priceBlackList,
                inventoryBlackList,
                loading: false,
            })
        }, 2000)

    }

    handleOk = e => {
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
            priceBlackList: priceBlackList.filter((item) => item.goodsInfoId !== key)
        })
    }

    handleDelInventory= (key) => {
        let inventoryBlackList = [...this.state.inventoryBlackList];
        this.setState({
            inventoryBlackList: inventoryBlackList.filter((item) => item.goodsInfoId !== key)
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
            // {
            //     title: <FormattedMessage id="Product.Specification" />,
            //     dataIndex:"specText",
            //     key:"specText",
            //     ellipsis: true,
            //     width: "20%",
            //     render: (text, record) => {
            //         return !!text ? text : '-';
            //     },
            //
            // },
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
                            onConfirm={() => this.handleDelPrice(rowInfo.goodsInfoId)}
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
            // {
            //     title: <FormattedMessage id="Product.Specification" />,
            //     dataIndex:"specText",
            //     key:"specText",
            //     ellipsis: true,
            //     width: "20%",
            //     render: (text, record) => {
            //         return !!text ? text : '-';
            //     },
            //
            // },
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
                            onConfirm={() => this.handleDelInventory(rowInfo.goodsInfoId)}
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
        let {
            priceBlackList,
            inventoryBlackList,
        } = this.state;
        // price 和 inventory 存在数据, 更新selectedSkuIds （goodsInfoId）
        switch (type){
            case 'price':
                // @ts-ignore
                let isPriceBlackList = Array.isArray(priceBlackList) && (priceBlackList.length > 0);
                this.setState({
                    selectedSkuIds: isPriceBlackList
                        ? priceBlackList.map(item => item.goodsInfoId)
                        : []
                })

              break;
            case 'inventory':
                let isInventoryBlackList = Array.isArray(inventoryBlackList) && (inventoryBlackList.length > 0);
                this.setState({
                    selectedSkuIds: isInventoryBlackList
                        ? inventoryBlackList.map(item => item.goodsInfoId)
                        : []
                })
                break;
            default: break;
        }
        this.setState({
            productModalVisible: true
        })

    }

    closeProductModal = () => {
        this.currentSelected = null;
        this.setState({
            productModalVisible: false
        })
    }

    skuSelectedBackFun = (selectedSkuIds, selectedRows: any) => {

        if (!Array.isArray(selectedSkuIds) || !Array.isArray(selectedRows.toJS())) return this.closeProductModal();

        // type price 和 inventory
        switch (this.currentSelected) {
            case 'price':
                this.setState({
                    priceBlackList: selectedRows.toJS(),
                });
                break;
            case 'inventory':
                this.setState({
                    inventoryBlackList: selectedRows.toJS(),
                });
                break;
            default: return;
        }

        this.setState({
            selectedSkuIds,
        })

        this.closeProductModal();
    }

    expandedRowRender = (data) => {
        if (!data) return null;
        if (!Array.isArray(data)) return null;
        if (data.length < 1) return null;
        const columns = [
            {
                title: 'Specification',
                children: [
                    { title: 'name', dataIndex: 'name', key: 'name' },
                    { title: 'value', dataIndex: 'value', key: 'value' },
                ],
            },
        ]
        return <Table
            bordered
            columns={columns}
            dataSource={data}
            pagination={false}
        />;
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
                                expandedRowRender={(record) => this.expandedRowRender(record.specText)}
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

                                expandedRowRender={(record) => this.expandedRowRender(record.specText)}
                                pagination={false}
                            />
                        </div>
                    </Spin>

                </Modal>
                <GoodsModal
                    visible={productModalVisible}
                    selectedSkuIds={selectedSkuIds}
                    // selectedRows={selectedRows}
                    onOkBackFun={this.skuSelectedBackFun}
                    onCancelBackFun={this.closeProductModal}
                />
            </div>
        );
    }

}

function SpecificationList () {

}