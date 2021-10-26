import React, { Component } from 'react';
import { AuthWrapper } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Tooltip, Spin, Table } from 'antd';



class ActivitiesInfo extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      interfaceList: [{ActivityName:'ces'}],

    };
  }

  componentDidMount() {

  }

  render() {
    const { interfaceList, loading } = this.state;
    const columns = [
      {
        title: <FormattedMessage id="Marketing.ActivityName" />,
        dataIndex: 'ActivityName',
        key: 'ActivityName'
      },
      {
        title: <FormattedMessage id="Marketing.lssuanceTime" />,
        dataIndex: 'lssuanceTime',
        key: 'lssuanceTime'
      },
      {
        title: <FormattedMessage id="Marketing.validPeriod" />,
        dataIndex: 'validPeriod',
        key: 'validPeriod'
      },
      {
        title: <FormattedMessage id="Marketing.totalNumber" />,
        dataIndex: 'totalNumber',
        key: 'totalNumber'
      },
      {
        title: <FormattedMessage id="Marketing.status" />,
        dataIndex: 'status',
        key: 'status'
      },
      {
        title: <FormattedMessage id="Marketing.Operation" />,
        dataIndex: 'Operation',
        render: (text, record) => (
          <AuthWrapper functionName="f_interface_details">
            <a>
              <Tooltip placement="top" title={<FormattedMessage id="Marketing.Export" />}>
                <span className="icon iconfont iconOffShelves" style={{ fontSize: 20 }}></span>
              </Tooltip>
            </a>
          </AuthWrapper>
        )
      }
    ];

    return (
      <Spin spinning={loading}>
          <Table
            dataSource={interfaceList}
            pagination={false}
            columns={columns}
            rowKey="id"
          />
      </Spin>
    );
  }
}

export default ActivitiesInfo
