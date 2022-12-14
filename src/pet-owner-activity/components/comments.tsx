import React, { Component } from 'react';
import { Const, history, cache } from 'qmkit';
import {
  Card,
  Icon,
  Row,
  Col,
  message,
  Dropdown,
  Button,
  Menu,
  Checkbox,
  Timeline,
  TreeSelect,
  Empty,
  Spin,
  Input
} from 'antd';
import { replaceLink } from '../common';
import { Link } from 'react-router-dom';
import * as webapi from '../webapi';
import AddComment from './add-comment';
import { FormattedMessage, injectIntl } from 'react-intl';

const { SHOW_ALL } = TreeSelect;

export default class Comments extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      activityLoading: false,
      activityList: [],
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
          // children: [
          //   { value: 'Automation Email', key: 'Automation Email', title: 'Automation Email' },
          //   { value: 'Communication Email', key: 'Communication Email', title: 'Communication Email' }
          // ]
          children: [
            {
              title: 'Order email',
              value: 'Order email',
              key: 'Order'
            },
            {
              title: 'Subscription email',
              value: 'Subscription email',
              key: 'Subscription'
            },
            {
              title: 'Recommendation email',
              value: 'Recommendation email',
              key: 'Recommendation'
            },
            {
              title: 'Prescriber creation email',
              value: 'Prescriber creation email',
              key: 'Prescriber creation'
            },
            {
              title: 'Automation email',
              value: 'Automation email',
              key: 'Automation'
            }
          ]
        },
        {
          title: 'Comments',
          value: 'Comments',
          key: 'Comments'
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
      orderType: 'desc',
      filters: ['Comments'],
      keyword: '',
      visible: false
    };
    this.getActivities = this.getActivities.bind(this);
    this.onActivityTypeChange = this.onActivityTypeChange.bind(this);
  }

  componentDidMount() {
    this.getActivities();
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
            activityList: res.context.customerActivity || [],
            activityLoading: false
          });
        } else {
          message.error(res.message || (window as any).RCi18n({ id: 'Public.GetDataFailed' }));
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
    const { activityLoading, activityList, treeData, orderType, isRecent, visible } = this.state;
    const { petOwner } = this.props;
    const hasTaskRole =
      sessionStorage.getItem(cache.LOGIN_FUNCTIONS) &&
      JSON.parse(sessionStorage.getItem(cache.LOGIN_FUNCTIONS)).includes('f_petowner_task');
    const menu = (
      <Menu>
        <Menu.Item key={1}>
          <a onClick={() => this.setState({ visible: true })}> Add Comment</a>
        </Menu.Item>
        {hasTaskRole ? (
          <Menu.Item key={2}>
            {' '}
            <a
              onClick={() =>
                history.push('/add-task', {
                  petOwner: {
                    contactId: this.props.petOwnerId,
                    petOwnerName: petOwner.contactName,
                    customerAccount: petOwner.customerAccount
                  }
                })
              }
            >
              Add Task
            </a>
          </Menu.Item>
        ) : null}
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
          <TreeSelect
            className="filter"
            {...tProps}
            onChange={(value) => this.setState({ filters: value }, () => this.getActivities())}
          />
          <Button
            className="sortBtn"
            onClick={() =>
              this.setState({ orderType: orderType === 'asc' ? 'desc' : 'asc' }, () =>
                this.getActivities()
              )
            }
          >
            <span className="icon iconfont iconbianzusort" style={{ fontSize: '20px' }} />
          </Button>
          <Dropdown overlay={menu}>
            <Button className="addCommentBtn">
              <span className="icon iconfont iconbianzu9" style={{ fontSize: '20px' }} />
            </Button>
          </Dropdown>
        </Col>
        <Col span={24}>
          <Spin spinning={activityLoading}>
            {activityList && activityList.length > 0 ? (
              <div>
                <Timeline>
                  {activityList.map((item, index) => (
                    <Timeline.Item key={index}>
                      <Row className="activities-timeline">
                        <Col span={19}>
                          <div className="activity-name">
                            {replaceLink(item.activityName, item)}
                          </div>
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
                        <Col span={24}>
                          {/* <template-conponent
                  templateType="email"
                  width="95%"
                ></template-conponent> */}
                        </Col>
                      </Row>
                    </Timeline.Item>
                  ))}
                </Timeline>
                <div style={{ textAlign: 'center' }}>
                  <Button
                    type="link"
                    className="jump-link"
                    onClick={() => this.setState({ isRecent: false }, () => this.getActivities())}
                  >
                    <span>{isRecent ? 'View More' : ''}</span>
                  </Button>
                </div>
              </div>
            ) : (
              <Empty />
            )}
          </Spin>
        </Col>
        {visible ? (
          <AddComment
            visible={visible}
            getActivities={() => {
              this.getActivities();
            }}
            petOwnerId={this.props.petOwnerId}
            closeModel={() => this.setState({ visible: false })}
          />
        ) : null}
      </Row>
    );
  }
}
