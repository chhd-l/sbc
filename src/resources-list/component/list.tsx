import React from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { AntIcon } from 'biz';
// import SkuMappingModal from '../SkuMappingModal';
// import './index.less';

export default class List extends React.Component<any, any>{
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

  // handleChange = (page) => {
  //   this.props.updateListData({
  //     pageNum: page - 1,
  //   });
  // }

  getColumns = () => {
    return [
      {
        title: <FormattedMessage id="Resources.email" />,
        dataIndex: 'email',
        key: 'email',
        width: 230,
      },
      {
        title: <FormattedMessage id="Resources.name" />,
        dataIndex: 'employeeName',
        key: 'employeeName',
        width: 230,
      },
      {
        title: <FormattedMessage id="Resources.service_type" />,
        dataIndex: 'serviceTypeNames',
        key: 'serviceTypeNames',
        width: 150,
      },
      {
        title: <FormattedMessage id="Resources.appointment_type" />,
        dataIndex: 'appointmentTypeNames',
        key: 'appointmentTypeNames',
        width: 150,
      },
      {
        title: <FormattedMessage id="Resources.planned_status" />,
        dataIndex: 'arranged',
        key: 'arranged',
        width: 150,
      },
      {
        title: <FormattedMessage id="Resources.planning_time" />,
        dataIndex: 'planningTime',
        key: 'planningTime',
        width: 150,
        align: 'left',
        className: 'SkuMappingList-action',
        render: (text, record) => (
          <span>
            <Link to={`/resources-setting/${record.employeeId}`}>
            <AntIcon className='SkuMappingList-action-icon' type='iconEdit' />
            </Link>
          </span>
        ),
      },
    ]
  }

  handleOk = (values) => {
    console.log('values', values);
    let { getListData } = this.props;
    // 更新列表
    getListData && getListData();
    this.handleCancel();
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
      onSelectChange
    } = this.props;
    let {
      visible,
      currentRecord,
    } = this.state;
    let columns = this.getColumns();

    return (
      <Table
        rowKey='goodsInfoId'
        // loading={loading}
        dataSource={this.props.resourceList}
        columns={columns}
        rowSelection={{
          onChange: (selectedRowKeys) => {
            onSelectChange(selectedRowKeys);
          }
        }}
        pagination={false}
        scroll={{ y: 500 }}
      />
    );
  }
}