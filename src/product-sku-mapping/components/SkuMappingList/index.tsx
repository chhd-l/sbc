import React from 'react';
import { Table } from 'antd';
import {FormattedMessage} from 'react-intl';
import { AntIcon, AntSpin } from 'biz';

export default class SkuMappingList extends React.Component<any, any>{
    constructor(props) {
        super(props);
    }

    handleEdit = (record) => {
        console.log('handleEdit', record);
        // 更新列表
        this.props.getListData();
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
                render: (text, record) => (
                    <span>
                        <a onClick={() => this.handleEdit(record)}>
                            <AntIcon type='iconbianji'/>
                        </a>
                    </span>
                ),
            },
        ]
    }

    render() {
        let {
            loading
        } = this.props;
        let columns = this.getColumns();
        return (
            <div>
                <Table
                    loading={{
                        spinning: loading,
                        indicator: AntSpin.loadingImg
                    }}
                    bordered
                    dataSource={[]}
                    columns={columns}
                />
            </div>
        );
    }
}