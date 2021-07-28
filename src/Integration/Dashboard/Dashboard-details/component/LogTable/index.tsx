import React, { Component } from 'react';
import {Table, Tooltip} from 'antd';
import {FormattedMessage} from 'react-intl';

import MyTooltip from '@/Integration/components/myTooltip';
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
                    header: {
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
                    payload: {
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
                    response: {
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
                    cllentName: 'MuleSoft',
                },
                {
                    key: '2',
                    requestID: '28393504',
                    time: '2021-05-18 10:35:54',
                    intertaceName: 'Price Synchronization',
                    header: {
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
                    payload: {
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
                    response: {
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
                    cllentName: 'MuleSoft',
                },
                {
                    key: '3',
                    requestID: '28393504',
                    time: '2021-05-18 10:35:54',
                    intertaceName: 'Price Synchronization',
                    header: {
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
                    payload: {
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
                    response: {
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
                title: <FormattedMessage id="Log.Header"/>,
                dataIndex: 'header',
                key: 'header',
                render: (text, record) => (<MyTooltip content={record.header} text={'header'}/>)
            },
            {
                title: <FormattedMessage id="Log.Payload" />,
                dataIndex: 'payload',
                key: 'payload',
                render: (text, record) => (<MyTooltip content={record.payload} text={'payload'}/>)
            },
            {
                title: <FormattedMessage id="Log.Response" />,
                dataIndex: 'response',
                key: 'response',
                render: (text, record) => (<MyTooltip content={record.response} text={'response'}/>)
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