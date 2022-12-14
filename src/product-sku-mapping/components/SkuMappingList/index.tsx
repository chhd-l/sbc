import React from 'react';
import { Table } from 'antd';
import {FormattedMessage} from 'react-intl';
import { AntIcon } from 'biz';
import SkuMappingModal from '../SkuMappingModal';
import './index.less';

export default class SkuMappingList extends React.Component<any, any>{
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
                title: <FormattedMessage id="Product.productName" />,
                dataIndex: 'productName',
                key: 'productName',
            },
            {
                title: <FormattedMessage id="Product.SPU" />,
                dataIndex: 'spu',
                key: 'spu',
            },
            {
                title: <FormattedMessage id="Product.SKU" />,
                dataIndex: 'sku',
                key: 'sku',
            },
            {
                title: <FormattedMessage id="Product.ExternalSKU" />,
                dataIndex: 'externalSku',
                key: 'externalSku',
            },
            {
                title: 'Action',
                key: 'action',
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
        } = this.props;
        let {
            visible,
            currentRecord,
        } = this.state;
        let columns = this.getColumns();
        return (
            <div>
                <Table
                    rowKey='goodsInfoId'
                    loading={loading}
                    bordered
                    dataSource={data.content}
                    columns={columns}
                    pagination={{
                        total: data.total || 0,
                        current: data.number + 1 || 0,
                        onChange: this.handleChange
                    }}
                />
                {
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
                }
            </div>
        );
    }
}