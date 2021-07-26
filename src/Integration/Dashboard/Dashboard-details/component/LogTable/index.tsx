import React, { Component } from 'react';
import {Table, Tooltip} from 'antd';

import './index.less';

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
                title: 'Request ID',
                dataIndex: 'requestID',
                key: 'requestID',
            },
            {
                title: 'Time',
                dataIndex: 'time',
                key: 'time',
            },
            {
                title: 'Intertace Name',
                dataIndex: 'intertaceName',
                key: 'intertaceName',
            },
            {
                title: 'Header',
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
                title: 'Payload',
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
                title: 'Response',
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
                title: 'Cllent Name',
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
                            <i className="iconfont iconxiangqing11"/>
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