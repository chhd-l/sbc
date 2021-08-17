import React from 'react';
import { Table } from 'antd';
import {FormattedMessage} from 'react-intl';
import { AntIcon, AntSpin } from 'biz';
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
            pageNum: page,
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
                dataIndex: 'SPU',
                key: 'SPU',
            },
            {
                title: <FormattedMessage id="Product.SKU" />,
                dataIndex: 'SKU',
                key: 'SKU',
            },
            {
                title: <FormattedMessage id="Product.ExternalSKU" />,
                dataIndex: 'ExternalSKU',
                key: 'ExternalSKU',
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

    handleOk = values => {
        console.log('values', values);
        this.setState({
            visible: false,
        });
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
                    rowKey='id'
                    loading={{
                        spinning: loading,
                        indicator: AntSpin.loadingImg
                    }}
                    bordered
                    dataSource={data}
                    columns={columns}
                    pagination={{
                        total: 1,
                        current: 1,
                        onChange: this.handleChange
                    }}
                />
                {
                    visible
                        ? (
                            <SkuMappingModal
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