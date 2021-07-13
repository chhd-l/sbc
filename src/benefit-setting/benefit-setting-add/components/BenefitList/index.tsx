import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';
import {Relax} from 'plume2';
import {Button, Col, Form, Icon, InputNumber, Popconfirm, Row, Select, Table} from 'antd';
import {RCi18n, ValidConst} from 'qmkit';
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

    componentDidMount() {
        // 有ID 编辑状态
    }

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

    showProduct = (key) => {

    };

    editGiftItem = (item) => {

    }

    onDelGiftItem= (record, item) => {
        if (!record || !item) return;
        // 删除更新当前行数据
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

        let columns = [
            {
                title: 'Delivery number',
                dataIndex: 'deliveryNumber',
                width: '30%',
                render: (rowInfo, record, index) => {
                    let isDisabled = false;
                    return (
                        <div>
                            <Row>
                                <Col span={16}>
                                    <Form.Item>
                                        {
                                            getFieldDecorator(`benefitList[${index}].deliveryNumber`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: RCi18n({id: 'Subscription.PleaseInputDeliveryNumber'})
                                                    },
                                                ]
                                            })(
                                                <Select className='deliveryNumber-select'>
                                                    {deliveryNumberData.map(item => <Option key={item.id}><strong>{item.name}</strong></Option>)}
                                                </Select>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>
                    );
                }
            },
            {
                title: 'Gift',
                dataIndex: 'gifts',
                render: (rowInfo, record, index) => {
                    let el = (
                        <Row>
                            <Col span={16}>
                                <div className="space-between-align">
                                    <div style={{ paddingTop: 6 }}>
                                        {' '}
                                        <Icon
                                            style={{ paddingRight: 8, fontSize: '24px', color: 'red', cursor: 'pointer' }}
                                            type="plus-circle"
                                            onClick={(e) => this.openGoodsModal(record)}
                                        />
                                    </div>
                                    <div style={{ lineHeight: 2 }}>
                                        {record.gifts &&
                                        record.gifts.map((item, recordIndex) => {
                                            return (
                                                <div className="space-between-align" key={item.subGoodsInfoId} style={{ paddingLeft: 5 }}>
                                                    <span style={{ paddingLeft: 5, paddingRight: 5 }}>{item.goodsInfoNo}</span>
                                                    <Form.Item key={recordIndex} style={styles.tableFormItem}>
                                                        {
                                                            getFieldDecorator(`benefitList[${index}].gifts[${recordIndex}]`, {
                                                                getValueFromEvent: (e) => this.getValueFromEvent(e, item),
                                                                initialValue: {
                                                                    productId: item.goodsInfoId,
                                                                    productNum: 1
                                                                },
                                                                rules: [
                                                                    { required: true, message:
                                                                            (window as any).RCi18n({
                                                                                id: 'Marketing.greaterthan0andlessthan999'
                                                                            })
                                                                    }
                                                                ]
                                                            })(
                                                                <InputNumber
                                                                    style={{ width: '60px', height: '28px', textAlign: 'center' }}
                                                                    key={item.goodsInfoId || recordIndex}
                                                                    min={1}
                                                                    max={item.stock || 999}
                                                                    formatter={(value: any) => value.productNum}
                                                                    onChange={(e) => this.editGiftItem(item)}
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

                                {/*<Form.Item style={styles.tableFormItem}>*/}
                                {/*    {getFieldDecorator(`benefitList[${index}].gifts`, {*/}
                                {/*        rules: [*/}
                                {/*            {*/}
                                {/*                required: true,*/}
                                {/*                message: RCi18n({id:'Product.PleaseInputSKU'})*/}
                                {/*            },*/}
                                {/*            {*/}
                                {/*                pattern: ValidConst.number,*/}
                                {/*                message: RCi18n({id:'Product.positiveInteger'})*/}
                                {/*            }*/}
                                {/*        ]*/}
                                {/*    })(*/}
                                {/*        <div className="space-between-align">*/}
                                {/*            <div style={{ paddingTop: 6 }}>*/}
                                {/*                {' '}*/}
                                {/*                <Icon*/}
                                {/*                    style={{ paddingRight: 8, fontSize: '24px', color: 'red', cursor: 'pointer' }}*/}
                                {/*                    type="plus-circle"*/}
                                {/*                    onClick={(e) => this.openGoodsModal(record)}*/}
                                {/*                />*/}
                                {/*            </div>*/}
                                {/*            <div style={{ lineHeight: 2 }}>*/}
                                {/*                {record.gifts.selectedRows &&*/}
                                {/*                record.gifts.selectedRows.map((item, recordIndex) => {*/}
                                {/*                    return (*/}
                                {/*                        <div className="space-between-align" key={item.subGoodsInfoId} style={{ paddingLeft: 5 }}>*/}
                                {/*                            <span style={{ paddingLeft: 5, paddingRight: 5 }}>{item.goodsInfoNo}</span>*/}

                                {/*                            <InputNumber*/}
                                {/*                                style={{ width: '60px', height: '28px', textAlign: 'center' }}*/}
                                {/*                                defaultValue={item.productNum || 1}*/}
                                {/*                                // key={item.subGoodsInfoId}*/}
                                {/*                                min={1}*/}
                                {/*                                max={item.stock || 10000}*/}
                                {/*                                onChange={(e) => this.editGiftItem(item)}*/}
                                {/*                            />*/}
                                {/*                            <a*/}
                                {/*                                style={{paddingLeft: 5}}*/}
                                {/*                                className="iconfont iconDelete"*/}
                                {/*                                onClick={() => this.onDelGiftItem(record, item)}*/}
                                {/*                            />*/}
                                {/*                        </div>*/}
                                {/*                    );*/}
                                {/*                })}*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*    )}*/}
                                {/*</Form.Item>*/}
                            </Col>
                        </Row>
                    );
                    return el;
                }

            },
            {
                title: 'Operation',
                dataIndex: 'Operation',
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
                            <Popconfirm title={RCi18n({id: 'Subscription.SureToDelete'})} onConfirm={() => this.handleDelete(record.key)}>
                                <a style={{paddingLeft: 5}} className="iconfont iconDelete" />
                            </Popconfirm>
                        </div>
                    </div>;
                },
            },
        ];

        return columns;
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
                        key='key'
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