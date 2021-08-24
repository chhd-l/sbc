import React from 'react';
import {
    Input,
    Modal,
    Table,
    Form,
    DatePicker,
    Popconfirm,
    Icon,
    Divider, message
} from 'antd';
import {FormattedMessage} from 'react-intl';
import {Const, RCi18n} from 'qmkit';
import moment from 'moment';
import './index.less';
import { getEditSkuMappingList, saveSkuMapping } from '../../webapi';

const styles = {
    label: {
        width: 151,
        textAlign: 'center'
    },
    wrapper: {
        width: 177
    }
} as any;
const { RangePicker } = DatePicker;

// @ts-ignore
@Form.create()
export default class SkuMappingModal extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            confirmLoading: false,
            dataSource: [],
            editList: [], // 已存在待编辑SkuMappingList
            ruleNo: 0,
            count: 0,
            loading: false,
        }
    }

    componentDidMount() {
        let {
            goodsInfoId,
        } = this.props;
        if (goodsInfoId){
          this.initList(goodsInfoId);
        }
    }

    initList = async (goodsInfoId) => {
        if (!goodsInfoId) return;
        this.setState({ loading: true});
        let { res } = await getEditSkuMappingList({goodsInfoId});
        this.setState({ loading: false});

        if(res.code === Const.SUCCESS_CODE){
          this.setState({
              editList: res.context?.mappings ?? [],
              dataSource: res.context?.mappings ?? [{
                      id: 0,
                      externalSkuNo: '',
                      condition: null,
                  }
              ], // 接口数据为空，默认添加一条数据
              ruleNo: res.context?.ruleNo ?? 0,
          })
        }

    }


    handleOk =  () => {
        let {
            onOk,
            goodsInfoId,
            sku,
        } = this.props;
        let {
            ruleNo,
            editList,
        } = this.state;
        if (!goodsInfoId) return;
        this.props.form.validateFieldsAndScroll( async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.setState({confirmLoading: true})
                let pattern = /^[0-9]*$/g;
                /**
                 * 编辑和新增的mappings一起提交，编辑的list需要返回原来已存在的字段
                 *
                 * 待编辑id为字符串，新增的id为数字，
                 **/

                let mappings = values.mappings.map(item => {
                    // 是否为新增的数据
                    if (pattern.test(item.id)){
                        return {
                            internalSkuId: goodsInfoId,
                            internalSkuNo: sku,
                            externalSkuNo: item.externalSkuNo,
                            condition: {
                                startTime: item.condition[0].format(Const.TIME_FORMAT),
                                endTime: item.condition[1].format(Const.TIME_FORMAT)
                            }
                        }
                    }else {
                        const found = editList.find(element => element.id === item.id);
                        let editItem = !!found ? found : {};
                        return {
                            ...editItem,
                            internalSkuId: goodsInfoId,
                            internalSkuNo: sku,
                            externalSkuNo: item.externalSkuNo,
                            condition: {
                                startTime: item.condition[0].format(Const.TIME_FORMAT),
                                endTime: item.condition[1].format(Const.TIME_FORMAT)
                            }
                        }
                    }

                })
                let params = {
                    goodsInfoId,
                    mappings,
                    ruleNo,
                }
                let { res } = await saveSkuMapping(params);
                this.setState({confirmLoading: false})

                if (res.code === Const.SUCCESS_CODE){
                    message.success('Operate successfully');
                    // 提交成功的回调
                    onOk && onOk({
                        sku,
                        ...params,
                    })
                }

            }
        });
    };

    handleCancel = () => {
        let {onCancel} = this.props;
        onCancel();
    };

    handleAdd = () => {
        const {
            count,
            dataSource,
        } = this.state;
        const newData = {
            id: count,
            externalSkuNo: '',
            condition: null,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };

    handleDelete = key => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.id !== key) });
    };

    getColumns = () => {
        const { getFieldDecorator } = this.props.form;

        return [
            {
                title: <strong>{`${RCi18n({id: 'Product.ExternalSKU'})}`}</strong>,
                dataIndex: 'externalSkuNo',
                width: '35%',
                render: (rowInfo, record, index) => {
                    return (
                        <div>
                            <Form.Item>
                                {
                                    getFieldDecorator(`mappings[${index}].externalSkuNo`, {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please input externalSkuNo!'
                                            },
                                        ],
                                        initialValue: record.externalSkuNo || ''
                                    })(
                                        <Input />
                                    )
                                }

                            </Form.Item>
                            <Form.Item>
                                {
                                    getFieldDecorator(`mappings[${index}].id`, {
                                        initialValue: record.id
                                    })(
                                        <Input hidden />
                                    )
                                }
                            </Form.Item>

                        </div>
                    );
                }
            },
            {
                title: <strong>{`${RCi18n({id: 'Product.ValidPeriod'})}`}</strong>,
                dataIndex: 'condition',
                width: '35%',
                render: (rowInfo, record, index) => {
                    let isInitialValue =  !!rowInfo && rowInfo.startTime && rowInfo.endTime;
                    return (
                        <Form.Item>
                            {
                                getFieldDecorator(`mappings[${index}].condition`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input condition!'
                                        },
                                    ],
                                    initialValue: isInitialValue
                                        ? [moment(rowInfo.startTime), moment(rowInfo.endTime)]
                                        : []
                                })(
                                    <RangePicker
                                        showTime
                                        format={Const.TIME_FORMAT}
                                        placeholder={[
                                            (window as any).RCi18n({
                                                id: 'Marketing.StartTime'
                                            }), (window as any).RCi18n({
                                                id: 'Marketing.EndTime'
                                            })
                                        ]}
                                    />
                                )
                            }
                        </Form.Item>
                    );
                }
            },
            {
                title: <strong>{`${RCi18n({id: 'Subscription.Operation'})}`}</strong>,
                dataIndex: 'Operation',
                width: '30%',
                render: (text, record, index) => {
                    return <span>
                        <Icon
                            style={{ paddingRight: 8, fontSize: '16px', color: 'red', cursor: 'pointer' }}
                            type="plus-circle"
                            onClick={(e) => this.handleAdd()}
                        />
                        <Divider type="vertical" style={{paddingBottom: 10}} />
                        {
                            index > 0
                                ? (
                                    <Popconfirm
                                        title={RCi18n({id: 'Subscription.SureToDelete'})}
                                        onConfirm={() => this.handleDelete(record.id)}
                                    >
                                        <a style={{paddingLeft: 5}} className="iconfont iconDelete"/>
                                    </Popconfirm>
                                )
                                : null
                        }
                    </span>;
                },
            }
        ]
    }

    render() {
        let {
            sku,
            visible,
        } = this.props;
        let {
            loading,
            dataSource,
            confirmLoading,
        } = this.state;

        let columns = this.getColumns();

        return (
            <Modal
                width={800}
                title={<strong><FormattedMessage id="Product.SkuMapping" /></strong>}
                visible={visible}
                confirmLoading={confirmLoading}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                wrapClassName='SkuMappingModal-wrap'
            >
                <div className='SkuMappingModal-main'>
                    <div className='SkuMappingModal-sku'>
                        <Input
                            disabled
                            value={sku}
                            addonBefore={
                                <p style={styles.label}>
                                    <FormattedMessage id="Product.SKU" />
                                </p>
                            }
                            style={{ width: 351 }}
                        />
                    </div>
                    <div className='SkuMappingModal-table-wrap'>
                        {/*<h3><FormattedMessage id="Product.SkuMapping"/></h3>*/}
                        <div className='SkuMappingModal-table-main'>
                            <Table
                                loading={loading}
                                dataSource={dataSource}
                                columns={columns}
                                pagination={false}
                                size="small"
                                rowKey='id'
                            />
                        </div>
                    </div>

                </div>
            </Modal>
        );
    }
}