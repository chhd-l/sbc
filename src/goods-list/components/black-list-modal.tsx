import React from 'react';
import {
    Modal,
    Spin,
    Popconfirm,
    Tooltip,
    Button,
    Table,
    message
} from 'antd';
import {FormattedMessage} from 'react-intl';
import {Const, DataGrid, RCi18n} from 'qmkit';
import {GoodsModal} from 'biz';
import { fromJS } from 'immutable';
import {
    getBlacklist,
    saveBlacklist,
} from '../webapi';
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
        this.initBlacklist();
    }

    initBlacklist = async () => {
        this.setState({ loading: true });
        const { res } = await getBlacklist();
        this.setState({ loading: false });

        // @ts-ignore
        if (res.code === Const.SUCCESS_CODE ){
            // @ts-ignore
            let priceBlackList = res.context?.price?.goodsInfos?.content ?? [];
            // @ts-ignore
            let inventoryBlackList =  res.context?.inventory?.goodsInfos?.content ?? [];
            this.setState({
                priceBlackList,
                inventoryBlackList,
            })
        }
    }

    handleOk = async () => {
        this.setState({ confirmLoading: true })
        let {
            priceBlackList,
            inventoryBlackList,
        } = this.state;
        let params = {
            price: {
                blacklistType: 0,
                goodsInfoIds: priceBlackList.map(item => item.goodsInfoId),
            },
            inventory: {
                blacklistType: 1,
                goodsInfoIds: inventoryBlackList.map(item => item.goodsInfoId),
            },
        }
        const { res } = await saveBlacklist(params);
        this.setState({ confirmLoading: false });
        // @ts-ignore
        if (res.code ===  Const.SUCCESS_CODE) {
            message.success(RCi18n({id:'Product.OperateSuccessfully'}));
            // @ts-ignore
            this.handleCancel();
        }

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
                width: "20%",
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
                width: "20%"
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
                            <a>
                                <span className="icon iconfont iconDelete" style={{fontSize: 18}}/>
                            </a>
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
                width: "20%",
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
                width: "20%"
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
                            <a>
                                <span className="icon iconfont iconDelete" style={{fontSize: 18}}/>
                            </a>
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
                        : [],
                    selectedRows: priceBlackList,
                })

              break;
            case 'inventory':
                let isInventoryBlackList = Array.isArray(inventoryBlackList) && (inventoryBlackList.length > 0);
                this.setState({
                    selectedSkuIds: isInventoryBlackList
                        ? inventoryBlackList.map(item => item.goodsInfoId)
                        : [],
                    selectedRows: inventoryBlackList,
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
                    { title: 'name', dataIndex: 'Name', key: 'Name' },
                    { title: 'value', dataIndex: 'theValue', key: 'theValue' },
                ],
            },
        ]
        return <Table
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
                    width={800}
                    title={null}
                    wrapClassName='blackListModal-wrap'
                    confirmLoading={confirmLoading}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={RCi18n({id:'Product.Confirm'})}
                    cancelText={RCi18n({id:'Product.Cancel'})}
                >
                    <div>
                        <div className='list-box priceBlackList-box'>
                            <div className='list-box-title'><FormattedMessage id="Product.PriceBlackList" /></div>
                            <Button
                                type="primary"
                                onClick={() => this.showProductModal('price')}
                            >
                                <FormattedMessage id="Product.AddProduct" />
                            </Button>
                            <DataGrid
                                loading={loading}
                                rowKey={(record) => record.goodsInfoId}
                                className='table-box'
                                dataSource={priceBlackList}
                                columns={priceColumns}
                                expandedRowRender={(record) => this.expandedRowRender(record.specification)}
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
                                loading={loading}
                                rowKey={(record) => record.goodsInfoId}
                                className='table-box'
                                dataSource={inventoryBlackList}
                                columns={inventoryColumns}
                                expandedRowRender={(record) => this.expandedRowRender(record.specification)}
                                pagination={false}
                            />
                        </div>
                    </div>

                </Modal>
                <GoodsModal
                    visible={productModalVisible}
                    selectedSkuIds={selectedSkuIds}
                    selectedRows={fromJS(selectedRows)}
                    onOkBackFun={this.skuSelectedBackFun}
                    onCancelBackFun={this.closeProductModal}
                />
            </div>
        );
    }

}

