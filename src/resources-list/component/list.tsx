import React from 'react';
import { Table } from 'antd';
import {FormattedMessage} from 'react-intl';
import { AntIcon } from 'biz';
// import SkuMappingModal from '../SkuMappingModal';
// import './index.less';

export default class List extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            currentRecord: {}
        }
    }

    handleEdit = (record) => {
        this.setState({
            currentRecord: record
        }, () => {
            this.showModal();
        })
    }

    handleChange = (page) => {
        console.log('pagination', page);
        // 更新列表
        this.props.getListData({
            pageNum: page - 1,
        });
    }

    getColumns = () => {
        return [
            {
                title: <FormattedMessage id="Resources.email" />,
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: <FormattedMessage id="Resources.name" />,
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: <FormattedMessage id="Resources.service_type" />,
                dataIndex: 'serviceType',
                key: 'serviceType',
            },
            {
                title: <FormattedMessage id="Resources.appointment_type" />,
                dataIndex: 'appointmentType',
                key: 'appointmentType',
            },
            {
              title: <FormattedMessage id="Resources.planned_status" />,
              dataIndex: 'plannedStatus',
              key: 'plannedStatus',
          },
            {
              title: <FormattedMessage id="Resources.planning_time" />,
              dataIndex: 'planningTime',
              key: 'planningTime',
                align: 'left',
                className: 'SkuMappingList-action',
                render: (text, record) => (
                    <span>
                        <a onClick={() => this.handleEdit(record)}>
                            <AntIcon className='SkuMappingList-action-icon' type='iconEdit'/>
                        </a>
                    </span>
                ),
            },
        ]
    }

    handleOk = (values) => {
        console.log('values', values);
        let { getListData } = this.props;
        // 更新列表
        getListData && getListData();
        this.handleCancel();
    };

    showModal = () => {
        this.setState({
            visible: true,

        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    render() {
        let {
            loading,
            data,
            onSelectChange
        } = this.props;
        let {
            visible,
            currentRecord,
        } = this.state;
        let columns = this.getColumns();
        const _data ={
          content:[{
            email:1,
            name:2,
            serviceType:3
          },{
            email:1,
            name:2,
            serviceType:3
          },{
            email:1,
            name:2,
            serviceType:3
          },{
            email:1,
            name:2,
            serviceType:3
          },{
            email:1,
            name:2,
            serviceType:3
          },]
        }
        return (
            <div>
                <Table
                    rowKey='goodsInfoId'
                    // loading={loading}
                    // bordered
                    dataSource={_data.content}
                    columns={columns}
                    rowSelection={{
                        // selectedRowKeys: selectedSpuKeys.toJS(),
                        onChange: (selectedRowKeys) => {
                          onSelectChange(selectedRowKeys);
                        }
                      }}
                    // pagination={{
                    //     total: data.total || 0,
                    //     current: data.number + 1 || 0,
                    //     onChange: this.handleChange
                    // }}
                />
                {/* {
                    visible
                        ? (
                            <SkuMappingModal
                                sku={currentRecord.sku}
                                goodsInfoId={currentRecord.goodsInfoId}
                                visible={visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                            />
                        )
                        : null
                } */}
            </div>
        );
    }
}