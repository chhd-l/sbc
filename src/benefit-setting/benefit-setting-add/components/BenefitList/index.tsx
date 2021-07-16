import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';
import {Button, Col, Form, Icon, InputNumber, Popconfirm, Row, Select, Table} from 'antd';
import {RCi18n} from 'qmkit';
import {GoodsModal} from 'biz';

import './index.less';

const styles = {
    box: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    } as any,
    plus: {
        color: '#999',
        fontSize: '28px'
    },
    tableFormItem: {
        marginBottom: '0px',
        padding: '2px'
    }
};
const deliveryNumberData = [
    {
        id: 1,
        name: 'Quarter n*1',
    },
    {
        id: 2,
        name: 'Quarter n*2',
    },
    {
        id: 3,
        name: 'Quarter n*3',
    },
    {
        id: 4,
        name: 'Quarter n*4',
    },
    ]

const { Option } = Select;


export default class BenefitList extends Component<any, any>{
    columns: any;
    currentSelected: any;

    constructor(props) {
        super(props);
        this.currentSelected = null;
        this.state = {
            dataSource: [],
            count: 0,
            visible: false,
            selectedSkuIds: [],
            selectedRows: [],
        };
    }

    componentDidUpdate(prevProps) {
        // 典型用法（不要忘记比较 props）：
        if (this.props.initData && !prevProps.initData) {
            this.initDataSource(this.props.initData);
        }
    }

    initDataSource = (initData) => {
        if (!initData) return;
        let {fullGiftLevelList} = initData;

        if (Array.isArray(fullGiftLevelList) && fullGiftLevelList.length > 0) {
            let initDataSource = fullGiftLevelList.map(item => {
                let {
                    giftLevelId,
                    deliveryNumber,
                    fullGiftDetailList
                } = item;

                let selectedSkuIds = fullGiftDetailList.map(item => item.productId)
                let selectedRows = initData.goodsList.goodsInfoPage.content.filter(item => selectedSkuIds.includes(item.goodsInfoId));
                // 添加数量属性
                let gifts = selectedRows.map(item => {
                    let productNum = fullGiftDetailList.find(gifItem => gifItem.productId === item.goodsInfoId).productNum;
                    return {
                        ...item,
                        productNum,
                    }
                })

                return {
                    gifts,
                    selectedSkuIds,
                    selectedRows,
                    key: giftLevelId,
                    deliveryNumber: deliveryNumber,
                }
            })

            this.setState({
                dataSource: initDataSource
            })
        }

    };


    handleDelete = key => {

        const dataSource = [...this.state.dataSource];
        // 最后一个重置数据
        if (Array.isArray(dataSource) && dataSource.length === 1){
            this.setState({
                dataSource: [],
                count: 0,
            })
        }else {
            this.setState({ dataSource: dataSource.filter(item => item.key !== key) });

        }
    };

    handleDeliveryNumberChange(value, record) {
        console.log(`selected ${value}`);
        const dataSource = [...this.state.dataSource];
        let index = dataSource.findIndex(item => item.key === record.key);
        if ( index > -1 ){
            dataSource[index].deliveryNumber = Number(value);
        }
        this.setState({
            dataSource
        })

    }

    handleAdd = () => {
        const { count, dataSource } = this.state;
        let minLength = deliveryNumberData.length;
        if (dataSource.length >= minLength) return;
        const newData = {
            key: count,
            deliveryNumber: '',
            gifts: [],
            selectedSkuIds: [],
            selectedRows: []
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };

    onDelGiftItem= (record, item) => {
        if (!record || !item) return;
        // 删除当前行数据
        let dataSource = [...this.state.dataSource];
        let index = dataSource.findIndex(item => item.key === record.key);
        if (index > -1) {
            dataSource[index].gifts = dataSource[index].gifts.filter(x => x.goodsInfoId !== item.goodsInfoId);
            this.setState({
                dataSource: [...dataSource],
            })
        }
    };

    skuSelectedBackFun = (selectedSkuIds, selectedRows: any) => {

        if (!Array.isArray(selectedSkuIds) || !Array.isArray(selectedRows.toJS())) return;

        let currentSelected = this.currentSelected;
        if (!currentSelected) return;
        const dataSource = [...this.state.dataSource];

        // 选中gift,更新dataSource
        let index = dataSource.findIndex((item) => item.key === currentSelected.key);
        if (index > -1 ) {
            dataSource[index].gifts = selectedRows.toJS();
            dataSource[index].selectedSkuIds = selectedSkuIds;
            dataSource[index].selectedRows = selectedRows;
        }

        this.setState({
            selectedSkuIds,
            selectedRows,
            dataSource,
        })
        this.closeGoodsModal();
    }

    closeGoodsModal = () => {
        this.setState({visible: false});
    }

    openGoodsModal = (currentSelected) => {

        if (!currentSelected) return;
        let {selectedSkuIds,selectedRows} = currentSelected;
        this.currentSelected = currentSelected;
        // 当前行存在已选中产品，
        if (Array.isArray(selectedSkuIds) && selectedSkuIds.length > 0){
            this.setState({
                selectedSkuIds,
                selectedRows,
            })
        }else { // 重置
            this.setState({
                selectedSkuIds: [],
                selectedRows: [],
            })
        }
        this.setState({visible: true});
    };

    getValueFromEvent = (e, info) => {
        console.log('e.target.value', e, info);
        return {
            productId: info.goodsInfoId,
            productNum: e || 1,
        };
    };

    getColumns = () => {
        const { getFieldDecorator } = this.props.form;

        return [
            {
                title: <strong>{`${RCi18n({id: 'Subscription.Delivery number'})}`}</strong>,
                dataIndex: 'deliveryNumber',
                className: 'deliveryNumber-warp',
                width: '40%',
                render: (rowInfo, record, index) => {
                    // console.log('record', record);
                    let isDisabled = false;
                    return (
                        <Row>
                            <Col span={20}>
                                <Form.Item>
                                    {
                                        getFieldDecorator(`benefitList[${index}].deliveryNumber`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: RCi18n({id: 'Subscription.PleaseInputDeliveryNumber'})
                                                    },
                                                ],
                                                initialValue: record.deliveryNumber || null

                                            })(
                                                <Select onChange={(value) => this.handleDeliveryNumberChange(value, record)} className='deliveryNumber-select'>
                                                    {deliveryNumberData.map(item => (
                                                        <Option
                                                            key={item.id}
                                                            value={item.id}
                                                        >
                                                            <strong>{item.name}</strong>
                                                        </Option>))}
                                                </Select>
                                        )
                                    }
                                </Form.Item>
                            </Col>
                        </Row>
                    );
                }
            },
            {
                title: <strong>{`${RCi18n({id: 'Subscription.Gift'})}`}</strong>,
                dataIndex: 'gifts',
                width: '40%',
                render: (rowInfo, record, index) => {
                    return (
                        <Row>
                            <Col span={20}>
                                <div className="space-between-align">
                                    <div style={{paddingTop: 6}}>
                                        {' '}
                                        <Icon
                                            style={{paddingRight: 8, fontSize: '24px', color: 'red', cursor: 'pointer'}}
                                            type="plus-circle"
                                            onClick={(e) => this.openGoodsModal(record)}
                                        />
                                    </div>
                                    <div style={{lineHeight: 2}}>
                                        {record.gifts &&
                                        record.gifts.map((item, recordIndex) => {
                                            return (
                                                <div className="space-between-align" key={item.goodsInfoId}
                                                     style={{paddingLeft: 5}}>
                                                    <span style={{
                                                        paddingLeft: 5,
                                                        paddingRight: 5
                                                    }}>{item.goodsInfoNo}</span>
                                                    <Form.Item key={recordIndex} style={styles.tableFormItem}>
                                                        {
                                                            getFieldDecorator(`benefitList[${index}].gifts[${recordIndex}]`, {
                                                                getValueFromEvent: (e) => this.getValueFromEvent(e, item),
                                                                initialValue: {
                                                                    productId: item.goodsInfoId,
                                                                    productNum: item.productNum || 1,
                                                                },
                                                                rules: [
                                                                    {
                                                                        required: true, message:
                                                                            (window as any).RCi18n({
                                                                                id: 'Marketing.greaterthan0andlessthan999'
                                                                            })
                                                                    }
                                                                ]
                                                            })(
                                                                <InputNumber
                                                                    style={{
                                                                        width: '60px',
                                                                        height: '28px',
                                                                        textAlign: 'center'
                                                                    }}
                                                                    key={item.goodsInfoId || recordIndex}
                                                                    min={1}
                                                                    max={item.stock || 999}
                                                                    formatter={(value: any) => value.productNum}
                                                                    // onChange={(e) => this.editGiftItem(item)}
                                                                />
                                                            )
                                                        }
                                                    </Form.Item>
                                                    <a
                                                        style={{paddingLeft: 5}}
                                                        className="iconfont iconDelete"
                                                        onClick={() => this.onDelGiftItem(record, item)}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    );
                }

            },
            {
                title: <strong>{`${RCi18n({id: 'Subscription.Operation'})}`}</strong>,
                dataIndex: 'Operation',
                width: '20%',
                render: (text, record) => {
                    return <div>
                        <div>
                            {/*<Icon*/}
                            {/*    style={{ paddingRight: 8, fontSize: '24px', color: 'red', cursor: 'pointer' }}*/}
                            {/*    type="plus-circle"*/}
                            {/*    onClick={(e) => this.handleAdd()} */}
                            {/*/>*/}
                        </div>
                        <div>
                            <Popconfirm title={RCi18n({id: 'Subscription.SureToDelete'})}
                                        onConfirm={() => this.handleDelete(record.key)}>
                                <a style={{paddingLeft: 5}} className="iconfont iconDelete"/>
                            </Popconfirm>
                        </div>
                    </div>;
                },
            },
        ];
    }

    getGiftsValidateFields = () => {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form.Item>
                {getFieldDecorator('gif-errors')(<input hidden/>)}
            </Form.Item>
        );
    }

    render() {
        let {
            visible,
            dataSource,
            selectedSkuIds,
            selectedRows
        } = this.state;
        let columns = this.getColumns();

        return (
            <div className='BenefitList-wrap'>
                <div className='BenefitList-title'>
                    <FormattedMessage id="Subscription.benefits" />
                </div>
                <div className='BenefitList-main'>
                    <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                        <FormattedMessage id="Marketing.Addgift" />
                    </Button>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        size="small"
                        rowKey='key'
                        className='BenefitList-table-wrap'
                    />
                    {this.getGiftsValidateFields()}
                </div>
                <GoodsModal
                    visible={visible}
                    selectedSkuIds={selectedSkuIds}
                    selectedRows={selectedRows}
                    onOkBackFun={this.skuSelectedBackFun}
                    onCancelBackFun={this.closeGoodsModal}
                />
            </div>
        );
    }
}

// export default Form.create()(BenefitList)