import React, { Component } from 'react';
import {Table, Tooltip} from 'antd';

import './index.less';

export default class ErrorTable extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [
                {
                    key: '1',
                    requestID: '28393504',
                    time: '2021-05-18 10:35:54',
                    cllentName: 'MuleSoft',
                    errorMessage:
                        `
                        { 
                           "code":"K-050102",
                           "message":"order status has changed, please refresh the page",
                           "errorData":null,
                           "context":null,
                           "defaultLocalDateTime":"2021-05-18 11:35:54.291",
                           "i18nParams":null
                           }
                         `
                },
                {
                    key: '2',
                    requestID: '28393504',
                    time: '2021-05-18 10:35:54',
                    cllentName: 'MuleSoft',
                    errorMessage:
                        `
                        { 
                           "code":"K-050102",
                           "message":"order status has changed, please refresh the page",
                           "errorData":null,
                           "context":null,
                           "defaultLocalDateTime":"2021-05-18 11:35:54.291",
                           "i18nParams":null
                           }
                         `
                },
                {
                    key: '3',
                    requestID: '28393504',
                    time: '2021-05-18 10:35:54',
                    cllentName: 'MuleSoft',
                    errorMessage:
                        `
                        { 
                           "code":"K-050102",
                           "message":"order status has changed, please refresh the page",
                           "errorData":null,
                           "context":null,
                           "defaultLocalDateTime":"2021-05-18 11:35:54.291",
                           "i18nParams":null
                           }
                         `
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
                title: 'Cllent Name',
                dataIndex: 'cllentName',
                key: 'cllentName',
            },
            {
                title: 'Error Message',
                dataIndex: 'errorMessage',
                key: 'errorMessage',
                render: (text, record) => {
                    return (
                        <Tooltip title={text}>
                            <span className='text-tip'>Error</span>
                        </Tooltip>
                    );
                },
            },
            {
                title: 'Log',
                dataIndex: 'log',
                key: 'log',
                align: 'center',
                width: 100,
                render: (text, record) => {
                    return (
                        <a onClick={() => this.goToDetails(record)}>
                            <span className='text-tip'>Check</span>
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
            <div className='ErrorTable-wrap'>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                />
            </div>
        );
    }
}