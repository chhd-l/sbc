import React from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { getBenefitsList } from "../webapi";
import { Const } from 'qmkit';
interface Iprop {
    startDate: string;
    endDate: string;
    customerAccount: string;
}
export default class BenefitsList extends React.Component<Iprop, any> {

    constructor(props: Iprop) {
        super(props);
        this.state = {
            loading: false,
            list: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            }
        };
    }
    componentDidMount() {
        this.getBebefitsList();
    }
    componentDidUpdate(prevProps) {
        if (this.props.startDate !== prevProps.startDate || this.props.endDate !== prevProps.endDate) {
            this.getBebefitsList();
        }
    }

    getBebefitsList = () => {
        const { startDate, endDate, customerAccount } = this.props;
        const { pagination } = this.state;
        this.setState({ loading: true });
        getBenefitsList({
            endDate,
            startDate,
            pageNum: pagination.current - 1,
            pageSize: pagination.pageSize,
            customerAccount
        }).
            then((data) => {
                this.setState({
                    loading: false,
                    list: data.res.context.subscriptionOrderGiftList,
                    pagination: {
                        ...pagination,
                        total: data.res.context.total
                    }
                });
            }).catch(() => {
                this.setState({
                    loading: false
                })
            })
    }
    onTableChange = (pagination) => {
        this.setState(
            {
                pagination: pagination
            },
            () => this.getBebefitsList()
        );
    };


    render() {
        const { list, pagination, loading } = this.state;
        const columns = [
            {
                title: <FormattedMessage id="PetOwner.BenefitType" />,
                dataIndex: 'benefitType',
                key: 'BenefitType',
                align: 'center'
            },
            {
                title: <FormattedMessage id="PetOwner.GiftName" />,
                dataIndex: 'giftName',
                key: 'GiftName',
                align: 'center'
            },
            {
                title: <FormattedMessage id="PetOwner.GiftType" />,
                dataIndex: 'giftType',
                key: 'GiftType',
                align: 'center'
            }, {
                title: <FormattedMessage id="PetOwner.DeliveryNumber" />,
                dataIndex: 'deliveryNumber',
                key: 'DeliveryNumber',
                align: 'center'
            },
            {
                title: <FormattedMessage id="PetOwner.SPU" />,
                dataIndex: 'spuNo',
                key: 'SPUNO',
                align: 'center'

            },
            {
                title: <FormattedMessage id="PetOwner.SKU" />,
                dataIndex: 'skuNO',
                key: 'SKUNO',

            }, {
                title: <FormattedMessage id="PetOwner.Status" />,
                dataIndex: 'status',
                key: 'Status',
                align: 'center'
            }, {
                title: <FormattedMessage id="PetOwner.ScheduledTime" />,
                dataIndex: 'scheduledTime',
                key: 'ScheduledTime',
                render: (text) => {
                    return (
                        moment(text).format(Const.TIME_FORMAT)
                    )
                }
            }, {
                title: <FormattedMessage id="PetOwner.DeliveryTime" />,
                dataIndex: 'deliveredTime',
                key: 'DeliveryTime',
                align: 'center',
                render: (text) => {
                    return (
                        moment(text).format(Const.TIME_FORMAT)
                    )
                }
            }
        ];
        return (
            <>
                <Table
                    loading={{ spinning: loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
                    rowKey="id"
                    columns={columns}
                    dataSource={list}
                    pagination={pagination}
                    onChange={this.onTableChange}
                >
                </Table>
            </>
        )
    }
}

