import React from 'react';
import { Relax } from 'plume2';
import { withRouter } from 'react-router-dom';
import { Table, Row, Col, Button, Collapse } from 'antd';
import moment from 'moment';
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
    title: 'Operator Type',
    dataIndex: 'operator.platform',
    key: 'operator.platform',
    render: (val) => `${operatorDic[val]}`
  },
  {
    title: 'Operator',
    dataIndex: 'operator.name',
    key: 'operator.name'
  },
  {
    title: 'Time',
    dataIndex: 'eventTime',
    key: 'eventTime',
    render: (time) => time && moment(time).format(Const.TIME_FORMAT).toString()
  },
  {
    title: 'Operation Category',
    dataIndex: 'eventType',
    key: 'eventType'
  },
  {
    title: 'Operation Log',
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
@withRouter
@Relax
export default class OperateLog extends React.Component<any, any> {
  static relaxProps = {
    log: ['detail', 'tradeEventLogs']
  };

  render() {
    const { log } = this.props.relaxProps;
    debugger;
    const Panel = Collapse.Panel;

    return (
      <div>
        <div style={styles.backItem}>
          <Collapse>
            <Panel header={<FormattedMessage id="operationLog" />} key="1" style={customPanelStyle}>
              <Row>
                <Col span={24}>
                  <Table rowKey={(_record, index) => index.toString()} columns={columns} dataSource={log.toJS()} pagination={false} bordered />
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </div>
        <div className="bar-button">
          <Button type="primary" onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="back" />}
          </Button>
        </div>
      </div>
    );
  }
}

const styles = {
  backItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 20
  }
} as any;
