import React, { Component } from 'react';
import {Table} from 'antd';
import {FormattedMessage} from 'react-intl';

import MyTooltip from '@/Integration/components/myTooltip';
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
                    errorMessage: {
                        'time':{

                            'x-request-id':'dc0306ca7ac6582b0ca8560bcdda115a',

                            'content-length':'176',

                            'country':'RU',

                            'clientid':'IceROxHgyg0riyVq',

                            'x-forwarded-proto':'https,http',

                            'clientsecret':'1lehSUJ8i65rSfY5vSFXjPsqpQB9BJ9X',

                            'x-forwarded-port':'443,443',

                            'x-correlation-id':'d232f500-b7c4-11eb-a8fe-0a0b7caf7557',

                            'x-forwarded-for':'10.240.2.11,10.240.3.18',

                            'forwarded':'proto=http;host="open.royalcanin.com:443";for="10.240.3.18:50552"',

                            'accept':'*/*',

                            'x-real-ip':'10.240.2.11',

                            'x-forwarded-host':'open.royalcanin.com:443,open.royalcanin.com:443',

                            'host':'10.240.2.21:8690',

                            'content-type':'application/json; charset=UTF-8; skipnullon="everywhere"',

                            'x-scheme':'https',

                            'user-agent':'AHC/1.0'
                        }
                    },
                },
                {
                    key: '2',
                    requestID: '28393504',
                    time: '2021-05-18 10:35:54',
                    cllentName: 'MuleSoft',
                    errorMessage: {
                        'time':{

                            'x-request-id':'dc0306ca7ac6582b0ca8560bcdda115a',

                            'content-length':'176',

                            'country':'RU',

                            'clientid':'IceROxHgyg0riyVq',

                            'x-forwarded-proto':'https,http',

                            'clientsecret':'1lehSUJ8i65rSfY5vSFXjPsqpQB9BJ9X',

                            'x-forwarded-port':'443,443',

                            'x-correlation-id':'d232f500-b7c4-11eb-a8fe-0a0b7caf7557',

                            'x-forwarded-for':'10.240.2.11,10.240.3.18',

                            'forwarded':'proto=http;host="open.royalcanin.com:443";for="10.240.3.18:50552"',

                            'accept':'*/*',

                            'x-real-ip':'10.240.2.11',

                            'x-forwarded-host':'open.royalcanin.com:443,open.royalcanin.com:443',

                            'host':'10.240.2.21:8690',

                            'content-type':'application/json; charset=UTF-8; skipnullon="everywhere"',

                            'x-scheme':'https',

                            'user-agent':'AHC/1.0'
                        }
                    },
                },
                {
                    key: '3',
                    requestID: '28393504',
                    time: '2021-05-18 10:35:54',
                    cllentName: 'MuleSoft',
                    errorMessage: {
                        'time':{

                            'x-request-id':'dc0306ca7ac6582b0ca8560bcdda115a',

                            'content-length':'176',

                            'country':'RU',

                            'clientid':'IceROxHgyg0riyVq',

                            'x-forwarded-proto':'https,http',

                            'clientsecret':'1lehSUJ8i65rSfY5vSFXjPsqpQB9BJ9X',

                            'x-forwarded-port':'443,443',

                            'x-correlation-id':'d232f500-b7c4-11eb-a8fe-0a0b7caf7557',

                            'x-forwarded-for':'10.240.2.11,10.240.3.18',

                            'forwarded':'proto=http;host="open.royalcanin.com:443";for="10.240.3.18:50552"',

                            'accept':'*/*',

                            'x-real-ip':'10.240.2.11',

                            'x-forwarded-host':'open.royalcanin.com:443,open.royalcanin.com:443',

                            'host':'10.240.2.21:8690',

                            'content-type':'application/json; charset=UTF-8; skipnullon="everywhere"',

                            'x-scheme':'https',

                            'user-agent':'AHC/1.0'
                        }
                    },
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
                title: <FormattedMessage id="Log.ClientName" />,
                dataIndex: 'cllentName',
                key: 'cllentName',
            },
            {
                title: <FormattedMessage id="Dashboard.Error Message" />,
                dataIndex: 'errorMessage',
                key: 'errorMessage',
                render: (text, record) => (<MyTooltip content={record.errorMessage} text={'errorMessage'}/>)
            },
            {
                title:  <FormattedMessage id="Dashboard.Log" />,
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