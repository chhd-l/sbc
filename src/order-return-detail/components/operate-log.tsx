import React from 'react';
import { Relax } from 'plume2';
import moment from 'moment';
import { Table, Button, Collapse } from 'antd';
import { IMap } from 'typings/globalType';
import { Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';

enum operatorDic {
  BOSS = 'Boss',
  PLATFORM = 'Platform',
  CUSTOMER = 'Customer',
  THIRD = 'Third',
  SUPPLIER = 'Supplier'
}

const columns = [
  {
    title: <FormattedMessage id="operatorType" />,
    dataIndex: 'operator',
    key: 'operator',
    render: (operator) => {
      return operatorDic[operator.platform];
    }
  },
  {
    title: <FormattedMessage id="operator" />,
    dataIndex: 'operator',
    key: 'operatorName',
    render: (operator) => operator.name
  },
  {
    title: <FormattedMessage id="time" />,
    dataIndex: 'eventTime',
    key: 'eventTime',
    render: (t) => moment(t).format(Const.TIME_FORMAT)
  },
  {
    title: <FormattedMessage id="operationCategory" />,
    dataIndex: 'eventType',
    key: 'eventType'
  },
  {
    title: <FormattedMessage id="operationLog" />,
    dataIndex: 'eventDetail',
    key: 'eventDetail',
    width: '50%'
  }
];

const customPanelStyle = {
  paddingRight: 10
};

/**
 * 操作日志
 */
@Relax
export default class OperateLog extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: IMap;
    };
  };

  static relaxProps = {
    detail: 'detail'
  };

  constructor(props) {
    super(props);
  }

  state = {
    showLogs: false
  };

  render() {
    const { detail } = this.props.relaxProps;
    const detailObj = detail.toJS();
    const logs = detailObj.returnEventLogs || [];
    const Panel = Collapse.Panel;
    return (
      <div style={styles.container}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Collapse>
            <Panel
              header={<FormattedMessage id="operationLog" />}
              key="1"
              style={customPanelStyle}
            >
              <Table
                bordered
                rowKey={() => Math.random().toString()}
                columns={columns}
                dataSource={logs}
                pagination={false}
              />
            </Panel>
          </Collapse>
        </div>
        <div className="bar-button">
          <Button
            type="primary"
            onClick={() => {
              history.back();
            }}
          >
            返回
          </Button>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20
  },

  table: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20
  }
} as any;
