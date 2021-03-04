import React, { Component } from 'react';
import { Const, history } from 'qmkit';
import { Row, Col, Dropdown, Button, Menu, Checkbox, Timeline, Select, Empty, Spin, message } from 'antd';
import { replaceLink } from '../common';
import TemplateConponent from './template-conponent';
import { Link } from 'react-router-dom';
import * as webapi from '../webapi';
import value from '*.json';

const Option = Select.Option;
export default class emails extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      emailLoading: false,
      emailList: [
      ],
      emailFilters: [
        { value: 'COMMUNICATION.Emails', label: 'Communication Email' },
        { value: 'CAMPAIGN ACTIVITY.Emails', label: 'Automation Email' }
      ],
      isRecent: true,
      orderType: 'asc',
      filters: []
    };
    this.getEmails = this.getEmails.bind(this);
  }

  componentDidMount() {
    this.getEmails();
  }

  getEmails() {
    this.setState({
      emailLoading: true
    });
    const { isRecent, orderType, filters } = this.state;
    let param = {
      customerId: '291', // this.props.petOwnerId,
      orderType: orderType,
      recent: isRecent,
      filters: filters
    };
    webapi
      .getEamils(param, isRecent)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            emailList: res.context.activityVOList || [],
            emailLoading: false
          });
        } else {
          message.error(res.message || 'Get data failed');
          this.setState({
            emailLoading: false
          });
        }
      })
      .catch(() => {
        message.error('Get data failed');
        this.setState({
          emailLoading: false
        });
      });
  }
  render() {
    const { emailLoading, emailList, emailFilters, orderType, isRecent } = this.state;
    const menu = (
      <Menu>
        <Menu.Item key={1}>Add Comment</Menu.Item>
        <Menu.Item key={2}>
          <Link to={'/add-task'}>Add Task</Link>
        </Menu.Item>
      </Menu>
    );
    return (
      <Row>
        <Col span={9}></Col>
        <Col span={15} className="activities-right" style={{ marginBottom: '20px' }}>
          <Select
            className="filter"
            placeholder="Email Type"
            allowClear={true}
            dropdownMatchSelectWidth={false}
            maxTagCount={0}
            style={{ width: '120px' }}
            mode="multiple"
            onChange={(value) => this.setState({ filters: value }, () => this.getEmails())}
          >
            {emailFilters.map((item) => (
              <Option value={item.value} key={item.label}>
                {item.label}
              </Option>
            ))}
          </Select>
          <Button className="sortBtn" onClick={() => this.setState({ orderType: orderType === 'asc' ? 'desc' : 'asc' }, () => this.getEmails())}>
            <span className="icon iconfont iconbianzusort" style={{ fontSize: '20px' }} />
          </Button>
          <Dropdown overlay={menu}>
            <Button className="addCommentBtn">
              <span className="icon iconfont iconbianzu9" style={{ fontSize: '20px' }} />
            </Button>
          </Dropdown>
        </Col>
        <Col span={24}>
          {emailList && emailList.length > 0 ? (
            <Spin spinning={emailLoading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
              <Timeline>
                {emailList.map((item, index) => (
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
                      <Col span={24}>
                        <TemplateConponent avtivity={item} />
                      </Col>
                    </Row>
                  </Timeline.Item>
                ))}
              </Timeline>
              <div style={{ textAlign: 'center' }}>
                <Button type="link" className="jump-link" onClick={() => this.setState({ isRecent: false }, () => this.getEmails())}>
                <span>{ isRecent ? 'View More' : ''}</span>
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
