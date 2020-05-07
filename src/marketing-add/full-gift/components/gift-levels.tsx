import * as React from 'react';
import {fromJS, Set} from 'immutable';

import {InputNumber, Input, Button, Select, Form} from 'antd';
import {DataGrid, ValidConst} from 'qmkit';

import {GoodsModal} from 'biz';

const Option = Select.Option;
const {Column} = DataGrid;
const FormItem = Form.Item;

import styled from 'styled-components';

const HasError = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  .ant-select-selection {
    border-color: #d9d9d9 !important;
  }
  .ant-select-selection .ant-select-arrow {
    color: #d9d9d9;
  }
`;

export default class GiftLevels extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            isFullCount: props.isFullCount,
            selectedRows: props.selectedRows,
            fullGiftLevelList: props.fullGiftLevelList
                ? props.fullGiftLevelList
                : [],
            //公用的商品弹出框
            goodsModal: {
                _modalVisible: false,
                _forIndex: 0
            }
        };
    }

    componentDidMount() {
        if (
            !this.props.fullGiftLevelList ||
            this.props.fullGiftLevelList.length == 0
        ) {
            this.initLevel();
        }
    }

    shouldComponentUpdate(nextProps) {
        let resetFields = {};
        const {fullGiftLevelList, isFullCount} = this.props;

        if (isFullCount != nextProps.isFullCount) {
            fullGiftLevelList.forEach((level, index) => {
                resetFields[`level_rule_value_${index}`] = null;
                level.fullGiftDetailList.forEach((detail, detailIndex) => {
                    resetFields[
                        `${detail.productId}level_detail${index}${detailIndex}`
                        ] = 1;
                });
            });
            this.initLevel();
            this.setState({
                selectedRows: fromJS([]),
                isFullCount: nextProps.isFullCount
            });
        } else {
            if (
                fullGiftLevelList &&
                fullGiftLevelList.length != nextProps.fullGiftLevelList.length
            ) {
                nextProps.fullGiftLevelList.forEach((level, index) => {
                    if ((!isFullCount ? level.fullAmount : level.fullCount) != null) {
                        resetFields[`level_rule_value_${index}`] = !isFullCount
                            ? level.fullAmount
                            : level.fullCount;
                    }
                });
            }
        }
        if (JSON.stringify(resetFields) !== '{}') {
            this.props.form.setFieldsValue(resetFields);
        }
        return true;
    }

    render() {
        const {goodsModal, isFullCount, fullGiftLevelList} = this.state;

        const {form} = this.props;

        const {getFieldDecorator} = form;

        return (
            <div>
                {fullGiftLevelList.map((level, index) => {
                    return (
                        <div key={level.key ? level.key : level.giftLevelId}>
                            <HasError>
                                <span>满&nbsp;</span>
                                <FormItem>
                                    {getFieldDecorator(`level_rule_value_${index}`, {
                                        rules: [
                                            {required: true, message: '必须输入规则'},
                                            {
                                                validator: (_rule, value, callback) => {
                                                    if (value) {
                                                        if (!isFullCount) {
                                                            if (
                                                                !ValidConst.price.test(value) ||
                                                                !(value < 100000000 && value > 0)
                                                            ) {
                                                                callback('请输入0.01-99999999.99间的数字');
                                                            }
                                                        } else {
                                                            if (
                                                                !ValidConst.noZeroNumber.test(value) ||
                                                                !(value < 10000 && value > 0)
                                                            ) {
                                                                callback('请输入1-9999间的整数');
                                                            }
                                                        }
                                                    }
                                                    callback();
                                                }
                                            }
                                        ],
                                        initialValue: !isFullCount
                                            ? level.fullAmount
                                            : level.fullCount
                                    })(
                                        <Input
                                            style={{width: 200}}
                                            placeholder={
                                                !isFullCount
                                                    ? '0.01-99999999.99间的数字'
                                                    : '1-9999间的数字'
                                            }
                                            onChange={(e) => {
                                                this.ruleValueChange(index, e.target.value);
                                            }}
                                        />
                                    )}
                                </FormItem>
                                <span>
                  &nbsp;{!isFullCount ? '元' : '件'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                                <Button
                                    type="primary"
                                    icon="plus"
                                    onClick={() => this.openGoodsModal(index)}
                                    style={{marginTop: 3.5}}
                                >
                                    添加赠品
                                </Button>&nbsp;&nbsp;
                                <Select
                                    value={level.giftType}
                                    style={{width: 120, marginTop: 3.5}}
                                    onChange={(val) => {
                                        this.onChange(index, 'giftType', val);
                                    }}
                                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                >
                                    <Option value={1}>可选一种</Option>
                                    <Option value={0}>默认全赠</Option>
                                </Select>
                                &nbsp;&nbsp;&nbsp;
                                {index > 0 && (
                                    <a onClick={() => this.deleteLevels(index)}>删除</a>
                                )}
                            </HasError>

                            <DataGrid
                                scroll={{y: 500}}
                                size="small"
                                rowKey={(record) => record.goodsInfoId}
                                dataSource={
                                    level.fullGiftDetailList
                                        ? this.getSelectedRowByIds(
                                        this.getIdsFromLevel(level.fullGiftDetailList)
                                        )
                                        : []
                                }
                                pagination={false}
                            >
                                <Column
                                    title="SKU编码"
                                    dataIndex="goodsInfoNo"
                                    key="goodsInfoNo"
                                    width="10%"
                                />

                                <Column
                                    title="商品名称"
                                    dataIndex="goodsInfoName"
                                    key="goodsInfoName"
                                    width="20%"
                                    render={(value) => {
                                        return <div className="line-two">{value}</div>;
                                    }}
                                />

                                <Column
                                    title="规格"
                                    dataIndex="specText"
                                    key="specText"
                                    width="8%"
                                    render={(value) => {
                                        if (value) {
                                            return <div>{value}</div>;
                                        } else {
                                            return '-';
                                        }
                                    }}
                                />

                                <Column
                                    title="分类"
                                    key="cateName"
                                    dataIndex="cateName"
                                    width="8%"
                                />

                                <Column
                                    title="品牌"
                                    key="brandName"
                                    dataIndex="brandName"
                                    width="8%"
                                    render={(value) => {
                                        if (value) {
                                            return value;
                                        } else {
                                            return '-';
                                        }
                                    }}
                                />

                                <Column
                                    title="单价"
                                    key="marketPrice"
                                    dataIndex="marketPrice"
                                    width="10%"
                                    render={(data) => {
                                        return `¥${data}`;
                                    }}
                                />

                                <Column
                                    title="库存"
                                    key="stock"
                                    dataIndex="stock"
                                    width="10%"
                                    render={(stock) => {
                                        if (stock < 20) {
                                            return (
                                                <div className="has-error">
                                                    <p>{stock}</p>
                                                    <div className="ant-form-explain">库存过低</div>
                                                </div>
                                            );
                                        } else {
                                            return stock;
                                        }
                                    }}
                                />

                                <Column
                                    title="赠送数量"
                                    className="centerItem"
                                    key="count"
                                    width="20%"
                                    render={(row, _record, detailIndex) => {
                                        return (
                                            <FormItem>
                                                {getFieldDecorator(
                                                    `${
                                                        row.goodsInfoId
                                                    }level_detail${index}${detailIndex}`,
                                                    {
                                                        initialValue:
                                                            fullGiftLevelList[index]['fullGiftDetailList'][
                                                                detailIndex
                                                                ] ? fullGiftLevelList[index]['fullGiftDetailList'][
                                                                detailIndex
                                                                ]['productNum'] : 1,
                                                        rules: [
                                                            {required: true, message: '必须输入赠送数量'},
                                                            {
                                                                pattern: ValidConst.noZeroNumber,
                                                                message: '只能是大于0的整数'
                                                            },
                                                            {
                                                                validator: (_rule, value, callback) => {
                                                                    if (
                                                                        value &&
                                                                        ValidConst.noZeroNumber.test(value) &&
                                                                        (value > 999 || value < 1)
                                                                    ) {
                                                                        callback('仅限1-999间的整数');
                                                                    }
                                                                    callback();
                                                                }
                                                            }
                                                        ]
                                                    }
                                                )(
                                                    <InputNumber
                                                        min={0}
                                                        onChange={(val: string) => {
                                                            this.giftCountOnChange(index, detailIndex, val);
                                                        }}
                                                    />
                                                )}
                                            </FormItem>
                                        );
                                    }}
                                />

                                <Column
                                    title="操作"
                                    key="operate"
                                    width="12%"
                                    render={(row) => {
                                        return (
                                            <a
                                                onClick={() => this.deleteRows(index, row.goodsInfoId)}
                                            >
                                                删除
                                            </a>
                                        );
                                    }}
                                />
                            </DataGrid>
                            <FormItem key={index}>
                                {getFieldDecorator(`level_${index}`, {})(<div/>)}
                            </FormItem>
                        </div>
                    );
                })}
                <Button
                    onClick={this.addLevels}
                    disabled={fullGiftLevelList.length >= 5}
                >
                    添加多级促销
                </Button>
                &nbsp;&nbsp;最多可设置5级
                {fullGiftLevelList.length > 0 &&
                goodsModal._modalVisible && (
                    <GoodsModal
                        skuLimit={20}
                        visible={goodsModal._modalVisible}
                        selectedSkuIds={this.getIdsFromLevel(
                            fullGiftLevelList[goodsModal._forIndex]['fullGiftDetailList']
                        )}
                        selectedRows={fromJS(
                            this.getSelectedRowByIds(
                                this.getIdsFromLevel(
                                    fullGiftLevelList[goodsModal._forIndex][
                                        'fullGiftDetailList'
                                        ]
                                )
                            )
                        )}
                        onOkBackFun={(selectedSkuIds, selectedRows) =>
                            this.skuSelectedBackFun(
                                goodsModal._forIndex,
                                selectedSkuIds,
                                selectedRows
                            )
                        }
                        onCancelBackFun={this.closeGoodsModal}
                    />
                )}
            </div>
        );
    }

    /**
     * 删除已经绑定的商品
     * @param index
     * @param goodsInfoId
     */
    deleteRows = (_index, goodsInfoId) => {
        let {selectedRows, fullGiftLevelList} = this.state;
        const {onChangeBack} = this.props;
        fullGiftLevelList.forEach((level) => {
            let levelIndex = level.fullGiftDetailList.findIndex(
                (detail) => detail.productId == goodsInfoId
            );
            if (levelIndex > -1) {
                level.fullGiftDetailList.splice(levelIndex, 1);
            }
        });
        //去除选中
        let rowIndex = selectedRows.toJS().findIndex(
            (row) => row.goodsInfoId == goodsInfoId
        );
        let newRows = selectedRows.toJS();
        //大于-1说明包含此元素
        if (rowIndex > -1) {
            newRows.splice(rowIndex, 1);
        }
        selectedRows = fromJS(newRows);

        this.setState({
            selectedRows: selectedRows,
            fullGiftLevelList: fullGiftLevelList
        });
        onChangeBack(fullGiftLevelList);
    };

    /**
     * 删除等级
     * @param index
     */
    deleteLevels = (index) => {
        let {fullGiftLevelList} = this.state;
        //重置表单的值
        this.props.form.setFieldsValue({
            [`level_rule_value_${fullGiftLevelList.length - 1}`]: null
        });
        fullGiftLevelList.splice(index, 1);
        this.setState({fullGiftLevelList: fullGiftLevelList});
        //传递到父页面
        const {onChangeBack} = this.props;
        onChangeBack(fullGiftLevelList);
    };

    /**
     * 添加多级促销
     */
    addLevels = () => {
        const {fullGiftLevelList} = this.state;
        if (fullGiftLevelList.length >= 5) return;
        fullGiftLevelList.push({
            key: this.makeRandom(),
            fullAmount: null,
            fullCount: null,
            giftType: 1,
            fullGiftDetailList: []
        });
        this.setState({fullGiftLevelList: fullGiftLevelList});

        //传递到父页面
        const {onChangeBack} = this.props;
        onChangeBack(fullGiftLevelList);
    };

    /**
     * 初始化等级
     */
    initLevel = () => {
        const initLevel = [
            {
                key: this.makeRandom(),
                fullAmount: null,
                fullCount: null,
                giftType: 1,
                fullGiftDetailList: []
            }
        ];
        this.setState({fullGiftLevelList: initLevel});

        const {onChangeBack} = this.props;
        onChangeBack(initLevel);
    };

    /**
     * 规则变更
     * @param index
     * @param value
     */
    ruleValueChange = (index, value) => {
        const {isFullCount} = this.state;
        this.onChange(index, !isFullCount ? 'fullAmount' : 'fullCount', value);
    };

    /**
     * 整个表单内容变化方法
     * @param index
     * @param props
     * @param value
     */
    onChange = (index, props, value) => {
        const {fullGiftLevelList} = this.state;
        fullGiftLevelList[index][props] = value;
        if (props == 'fullAmount') {
            fullGiftLevelList[index]['fullCount'] = null;
        } else if (props == 'fullCount') {
            fullGiftLevelList[index]['fullAmount'] = null;
        }
        this.setState({fullGiftLevelList: fullGiftLevelList});

        //传递到父页面
        const {onChangeBack} = this.props;
        onChangeBack(fullGiftLevelList);
    };

    /**
     * sku选择之后的回调事件
     * @param index
     * @param selectedSkuIds
     * @param selectedRows
     */
    skuSelectedBackFun = (index, selectedSkuIds, selectedRows) => {
        this.onChange(
            index,
            'fullGiftDetailList',
            selectedSkuIds.map((skuId) => {
                return {productId: skuId, productNum: 1};
            })
        );
        let rows = (selectedRows.isEmpty() ? Set([]) : selectedRows.toSet()).concat(
            fromJS(this.state.selectedRows).toSet()
        );
        this.setState({goodsModal: {_modalVisible: false}, selectedRows: rows});
    };

    /**
     * 满赠数量变化
     * @param index
     * @param goodsInfoId
     * @param count
     */
    giftCountOnChange = (index, detailIndex, count) => {
        let {fullGiftLevelList} = this.state;
        let fullGiftDetailList = fullGiftLevelList[index].fullGiftDetailList;
        fullGiftDetailList[detailIndex]['productNum'] = count;
        this.onChange(index, 'fullGiftDetailList', fullGiftDetailList);
    };

    /**
     * 打开modal
     * @param index
     */
    openGoodsModal = (index) => {
        this.setState({goodsModal: {_modalVisible: true, _forIndex: index}});
    };

    /**
     * 关闭modal
     */
    closeGoodsModal = () => {
        this.setState({goodsModal: {_modalVisible: false}});
    };

    /**
     * 工具方法：通过选择id获取rows
     * @param ids
     * @returns {Array}
     */
    getSelectedRowByIds = (ids) => {
        const {selectedRows} = this.state;
        const rows = selectedRows.filter((row) =>
            ids.includes(row.get('goodsInfoId'))
        );
        return rows && !rows.isEmpty() ? rows.toJS() : [];
    };

    /**
     * 通过detailList获取id集合
     * @param detailList
     * @returns {Array}
     */
    getIdsFromLevel = (detailList) => {
        return detailList
            ? detailList.map((detail) => {
                return detail.productId;
            })
            : [];
    };

    /**
     * 生成随机数，作为key值
     * @returns {string}
     */
    makeRandom = () => {
        return 'key' + (Math.random() as any).toFixed(6) * 1000000;
    };
}
