import React, { Component } from 'react';
import { Const, history } from 'qmkit';
import { Card, Icon, Row, Col, message, Dropdown, Button, Menu, Checkbox, Timeline, TreeSelect, Empty, Spin, Input } from 'antd';
import { replaceLink } from '../common';
import { Link } from 'react-router-dom';
import * as webapi from '../webapi';

const { SHOW_ALL } = TreeSelect;

export default class Activities extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      activityLoading: false,
      activityList: [
      ],
      treeData: [
        {
          title: 'Pet Owner',
          value: 'Pet Owner',
          key: 'Pet Owner'
        },
        {
          title: 'Updates',
          value: 'Updates',
          key: 'Updates'
        },
        {
          title: 'Tagging',
          value: 'Tagging',
          key: 'Tagging'
        },
        {
          title: 'Communication',
          value: 'Communication',
          key: 'Communication',
          children: [
            { value: 'Automation Email', key: 'Automation Email', title: 'Automation Email' },
            { value: 'Communication Email', key: 'Communication Email', title: 'Communication Email' }
          ]
        },
        {
          title: 'Comments',
          value: 'Comments',
          key: 'Comments',
          children: [
            { value: 'Comments.Notes', key: 'Comments.Notes', title: 'Notes' },
            { value: 'Comments.Feedback', key: 'Comments.Feedback', title: 'Feedback' }
          ]
        },
        {
          title: 'Task',
          value: 'Task',
          key: 'Task'
        },
        {
          title: 'Presciber',
          value: 'Presciber',
          key: 'Presciber'
        }
      ],
      isRecent: true,
      orderType: 'asc',
      filters: [],
      keyword: ''
    };
    this.getActivities = this.getActivities.bind(this);
    this.onActivityTypeChange = this.onActivityTypeChange.bind(this);
  }

  componentDidMount() {
    this.getActivities()
  }

  getActivities() {
    this.setState({
      activityLoading: true
    });
    const { isRecent, orderType, filters, keyword } = this.state;
    let param = {
      customerId: this.props.petOwnerId, // this.props.petOwnerId,
      orderType: orderType,
      recent: isRecent,
      filters: filters,
      keyword: keyword
    };
    webapi
      .getActivities(param, isRecent)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            activityList: res.context.activityVOList || [],
            activityLoading: false
          });
        } else {
          message.error(res.message || 'Get data failed');
          this.setState({
            activityLoading: false
          });
        }
      })
      .catch(() => {
        message.error('Get data failed');
        this.setState({
          activityLoading: false
        });
      });
  }

  onActivityTypeChange = (value) => {};

  render() {
    const { activityLoading, activityList, treeData, orderType, isRecent } = this.state;
    const menu = (
      <Menu>
        <Menu.Item key={1}>Add Comment</Menu.Item>
        <Menu.Item key={2}>
          <Link to={'/add-task'}>Add Task</Link>
        </Menu.Item>
      </Menu>
    );
    const tProps = {
      treeData,
      onChange: this.onActivityTypeChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_ALL,
      searchPlaceholder: 'Activity Type',
      style: {
        width: '150px'
      },
      maxTagCount: 0,
      allowClear: true
    };
    return (
      <Row>
        <Col span={9}>
        <Input
            className="searchInput"
            placeholder="Keyword"
            onPressEnter={() => this.getActivities()}
            onChange={(e) => {
              const value = (e.target as any).value;
              this.setState({
                keyword: value
              });
            }}
            style={{ width: '140px' }}
            prefix={<Icon type="search" onClick={() => this.getActivities()} />}
          />
        </Col>
        <Col span={15} className="activities-right" style={{ marginBottom: '20px' }}>
          <TreeSelect className="filter" {...tProps} onChange={(value) => this.setState({ filters: value }, () => this.getActivities())} />
          <Button className="sortBtn" onClick={() => this.setState({ orderType: orderType === 'asc' ? 'desc' : 'asc' }, () => this.getActivities())}>
            <span className="icon iconfont iconbianzusort" style={{ fontSize: '20px' }} />
          </Button>
          <Dropdown overlay={menu}>
            <Button className="addCommentBtn">
              <span className="icon iconfont iconbianzu9" style={{ fontSize: '20px' }} />
            </Button>
          </Dropdown>
        </Col>
        <Col span={24}>
          {activityList && activityList.length > 0 ? (
            <Spin spinning={activityLoading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
              <Timeline>
                {activityList.map((item, index) => (
                  <Timeline.Item key={index}>
                    <Row className="activities-timeline">
                      <Col span={19}>
                        <div className="activity-name">{replaceLink(item.activityName, item)}</div>
                        <div className="activity-type">{item.activityType}</div>
                      </Col>
                      <Col span={5}>
                        <div>
                          By
                          <span className="jump-link" style={{ marginLeft: '5px' }}>
                            {item.createdByUser}
                          </span>
                        </div>
                        <div style={{ marginBottom: '10px' }} className="activity-type">
                          {item.dateAdded}
                        </div>
                      </Col>
                      <Col span={24}>{/* <template-conponent
                  templateType="email"
                  width="95%"
                ></template-conponent> */}</Col>
                    </Row>
                  </Timeline.Item>
                ))}
              </Timeline>
              <div style={{ textAlign: 'center' }}>
                <Button type="link" className="jump-link" onClick={() => this.setState({ isRecent: false }, () => this.getActivities())}>
                  <span>{isRecent ? 'View More' : ''}</span>
                </Button>
              </div>
            </Spin>
          ) : (
            <Empty />
          )}
        </Col>
      </Row>
    );
  }
}
