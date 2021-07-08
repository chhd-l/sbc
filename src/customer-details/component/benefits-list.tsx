import React from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { getBenefitsList} from "../webapi";
interface Iprop {
    startDate: string;
    endDate: string;
    customerId: string;
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
        const { startDate, endDate, customerId } = this.props;
        const { pagination } = this.state;
        this.setState({loading:true});
        getBenefitsList({
            endTime:endDate,
            startTime:startDate,
            pageNum: pagination.current - 1,
            pageSize: pagination.pageSize,
            buyerId:customerId
        }).
        then((data)=>{
            this.setState({
                loading: false,
                list:data.res.context.content,
                pagination: {
                    ...pagination,
                    total: data.res.context.total
                  }
            });
        }).catch(()=>{
            this.setState({
                loading:false
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
        // for (let i = 0; i < 100; i++) {
        //     list.push({
        //       key: i,
        //       BenefitType: `Edrward ${i}`,
        //       GiftName: 32,
        //       GiftType: `London Park no. ${i}`,
        //       DeliveryNumber:112,
        //       SPU:1,
        //       SKU:2,
        //       Status:3,
        //       ScheduledTime:3,
        //       DeliveryTime:4,
        //     });
        //   }
        const columns = [
            {
                title: <FormattedMessage id="PetOwner.BenefitType" />,
                dataIndex: 'BenefitType',
                key: 'BenefitType'
            },
            {
                title: <FormattedMessage id="PetOwner.GiftName" />,
                dataIndex: 'GiftName',
                key: 'GiftName'
            },
            {
                title: <FormattedMessage id="PetOwner.GiftType" />,
                dataIndex: 'GiftType',
                key: 'GiftType'
            }, {
                title: <FormattedMessage id="PetOwner.DeliveryNumber" />,
                dataIndex: 'DeliveryNumber',
                key: 'DeliveryNumber'
            },
            {
                title: <FormattedMessage id="PetOwner.SPU" />,
                dataIndex: 'SPU',
                key: 'SPU'
            },
            {
                title: <FormattedMessage id="PetOwner.SKU" />,
                dataIndex: 'SKU',
                key: 'SKU'
            }, {
                title: <FormattedMessage id="PetOwner.Status" />,
                dataIndex: 'Status',
                key: 'Status'
            }, {
                title: <FormattedMessage id="PetOwner.ScheduledTime" />,
                dataIndex: 'ScheduledTime',
                key: 'ScheduledTime'
            }, {
                title: <FormattedMessage id="PetOwner.DeliveryTime" />,
                dataIndex: 'DeliveryTime',
                key: 'DeliveryTime'
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

