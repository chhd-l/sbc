import React, { Component } from 'react';
import {Table, Tooltip} from 'antd';

import './index.less';
import {FormattedMessage} from 'react-intl';

export default class LogTable extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [
                {
                    key: '1',
                    requestID: '28393504',
                    time: '2021-05-18 10:35:54',
                    intertaceName: 'Price Synchronization',
                    header: 'sadasdfasdf',
                    payload: 'sssssssssssssssssssss',
                    response: 'sadfasdfasdf',
                    cllentName: 'MuleSoft',
                },
                {
                    key: '2',
                    requestID: '28393504',
                    time: '2021-05-18 10:35:54',
                    intertaceName: 'Price Synchronization',
                    header: 'sadasdfasdf',
                    payload: 'sssssssssssssssssssss',
                    response: 'sadfasdfasdf',
                    cllentName: 'MuleSoft',
                },
                {
                    key: '3',
                    requestID: '28393504',
                    time: '2021-05-18 10:35:54',
                    intertaceName: 'Price Synchronization',
                    header: 'sadasdfasdf',
                    payload: 'sssssssssssssssssssss',
                    response: 'sadfasdfasdf',
                    cllentName: 'MuleSoft',
                },
            ]
        }

    }

    getColumns = () => {
        return [
            {
                title: <FormattedMessage id="Log.RequestID" />,
                dataIndex: 'requestID',
                key: 'requestID',
            },
            {
                title: <FormattedMessage id="Log.Time" />,
                dataIndex: 'time',
                key: 'time',
            },
            {
                title: <FormattedMessage id="Log.InterfaceName" />,
                dataIndex: 'intertaceName',
                key: 'intertaceName',
            },
            {
                title: <FormattedMessage id="Log.Header" />,
                dataIndex: 'header',
                key: 'header',
                render: (text, record) => {
                    return (
                        <Tooltip title={text}>
                            <span className='text-tip'>Header</span>
                        </Tooltip>
                    );
                },
            },
            {
                title: <FormattedMessage id="Log.Payload" />,
                dataIndex: 'payload',
                key: 'payload',
                render: (text, record) => {
                    return (
                        <Tooltip title={text}>
                            <span className='text-tip'>payload</span>
                        </Tooltip>
                    );
                },
            },
            {
                title: <FormattedMessage id="Log.Response" />,
                dataIndex: 'response',
                key: 'response',
                render: (text, record) => {
                    return (
                        <Tooltip title={text}>
                            <span className='text-tip'>response</span>
                        </Tooltip>
                    );
                },
            },
            {
                title: <FormattedMessage id="Log.ClientName" />,
                dataIndex: 'cllentName',
                key: 'cllentName',
            },
            {
                title: '',
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
                render: (text, record) => {
                    return (
                        <a onClick={() => this.goToDetails(record)}>
                            <i className="iconfont iconDetails"/>
                        </a>
                    );
                },
            },
        ]
    }

    goToDetails = (record) => {
        console.log('record', record);
    }

    render() {
        let {dataSource} = this.state;
        let columns = this.getColumns();
        return (
            <div className='StatisticsTable-wrap'>
                <Table  dataSource={dataSource} columns={columns} pagination={false}/>
            </div>
        );
    }
}