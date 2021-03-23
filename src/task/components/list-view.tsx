import React, { Component } from 'react';
import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table } from 'antd';
import { BreadCrumb, SelectGroup, Const, Headline } from 'qmkit';
import * as webapi from '../webapi';
import { Link } from 'react-router-dom';
import moment from 'moment';

export default class ListView extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      taskList: [],
      formData: {},
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      taskStatus: [
        { name: 'To Do', value: 'To Do' },
        { name: 'On-going', value: 'On-going' },
        { name: 'Completed', value: 'Completed' },
        { name: 'Cancelled', value: 'Cancelled' }
      ],
      loading: false,
      queryType: '1'
    };
    this.handleTableChange = this.handleTableChange.bind(this);
    this.statuColor = this.statuColor.bind(this);
    this.getTaskList = this.getTaskList.bind(this);
  }

  componentDidMount() {
    this.getTaskList(this.props.queryType);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { formData } = nextProps;

    if (formData !== prevState.formData) {
      return {
        formData: formData
      };
    }
    return null;
  }

  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getTaskList(this.state.queryType)
    );
  };
  getTaskList = (queryType?: String) => {
    const { formData, pagination } = this.state;
    let params = Object.assign(formData, {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize,
      queryType: queryType
    });
    this.setState({
      loading: true,
      queryType: queryType
    });
    webapi
      .getTaskListView(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          this.setState({
            taskList: res.context.taskList,
            pagination: pagination,
            loading: false
          });
        } else {
          message.error(res.message || 'Get Data Failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Get Data Failed');
        this.setState({
          loading: false
        });
      });
  };
  statuColor(status) {
    let color = '';
    switch (status) {
      case 'To Do':
        color += 'rgba(233, 63, 81)';
        break;
      case 'On-going':
        color += 'rgba(57, 173, 255)';
        break;
      case 'Completed':
        color += 'rgba(114, 198, 127)';
        break;
      case 'Cancelled':
        color += 'rgba(172, 176, 180)';
        break;
    }
    return color;
  }
  render() {
    const { taskList, taskStatus } = this.state;
    const columns = [
      {
        title: 'Task Name',
        dataIndex: 'name',
        width: '10%'
      },
      {
        title: 'Golden Moment',
        dataIndex: 'goldenMoment',
        width: '15%'
      },
      {
        title: 'Task Status',
        dataIndex: 'status',
        width: '10%',
        render: (text) => {
          let status = taskStatus.find((x) => x.value === text);
          return <div style={{ color: this.statuColor(text) }}> {status ? status.name : ''}</div>;
        }
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        width: '10%'
      },
      {
        title: 'Customer Care',
        dataIndex: 'assistantName',
        width: '10%'
      },
      {
        title: 'Pet Owner',
        dataIndex: 'petOwner',
        width: '10%'
      },
      {
        title: 'Due Time',
        dataIndex: 'dueTime',
        width: '15%',
        render: (text, record) => (moment(text) < moment(new Date()) && (record.status === 'To Do' || record.status === 'On-going') ? <div style={{ color: 'rgba(239,28,51)' }}>{text}</div> : text)
      },
      {
        title: 'Operation',
        key: 'operation',
        width: '10%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title="Details">
              <Link to={'/edit-task/' + record.id} className="iconfont iconDetails"></Link>
            </Tooltip>
          </div>
        )
      }
    ];
    return (
      <div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={taskList}
          pagination={this.state.pagination}
          loading={{ spinning: this.state.loading, indicator: <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" /> }}
          scroll={{ x: '100%' }}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
