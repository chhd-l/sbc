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
              dataSource: res.context || [
                  {
                      key: 0,
                      externalSkuNo: '',
                      condition: null,
                  }
              ] // 接口数据为空，默认添加一条数据
          })
        }

    }


    handleOk =  () => {
        let {onOk, goodsInfoId} = this.props;
        if (!goodsInfoId) return;
        this.props.form.validateFieldsAndScroll( async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.setState({confirmLoading: true})
                let mappings = values.mappings.map(item => {
                    return {
                        externalSkuNo: item.externalSkuNo,
                        condition: {
                            startTime: item.condition[0].format(Const.DAY_FORMAT),
                            endTime: item.condition[1].format(Const.DAY_FORMAT)
                        }
                    }
                })
                let params = {
                    goodsInfoId,
                    mappings,
                    ruleNo: 0,

                }
                let { res } = await saveSkuMapping(params);
                this.setState({confirmLoading: false})

                if (res.code === Const.SUCCESS_CODE){
                    message.success('Operate successfully');
                    // 提交成功的回调
                    onOk && onOk(values)
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
            key: count,
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

    getColumns = () => {
        const { getFieldDecorator } = this.props.form;

        return [
            {
                title: <strong>{`${RCi18n({id: 'Product.ExternalSKU'})}`}</strong>,
                dataIndex: 'externalSkuNo',
                width: '35%',
                render: (rowInfo, record, index) => {
                    return (
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
                                        format={Const.DAY_FORMAT}
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
                                        onConfirm={() => this.handleDelete(record.key)}
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
            visible,
            goodsInfoId,
        } = this.props;
        let {
            loading,
            dataSource,
        } = this.state;

        let columns = this.getColumns();

        return (
            <Modal
                width={800}
                title={<strong><FormattedMessage id="Product.SkuMapping" /></strong>}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                wrapClassName='SkuMappingModal-wrap'
            >
                <div className='SkuMappingModal-main'>
                    <div className='SkuMappingModal-sku'>
                        <Input
                            disabled
                            value={goodsInfoId}
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