import React, { Component } from 'react';
import { Card, Icon, Row, Col, message, Dropdown, Button, Menu, Checkbox, Timeline } from 'antd';
import { replaceLink } from '../common';

export default class Activities extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      activityLoading: false,
      activityList: [
        {
          activityName: "/'feedback contents''",
          activityType: 'Feedback',
          category: 'Comments',
          contactId: 229,
          contents: 'GOOD',
          createdBy: 138,
          createdByUser: 'Mia Lin',
          dateAdded: '2021-01-28 12:30:31',
          id: 8195,
          noteId: 12,
          tenantId: 4
        },
        {
          activityName: 'Contact data exported',
          activityType: '',
          category: 'Contacts integration',
          contactId: 229,
          createdBy: 139,
          createdByUser: 'Morgane DAUM',
          dateAdded: '2021-01-22 12:53:32',
          id: 8157,
          tenantId: 4
        }
      ]
    };
    this.activitiesSort = this.activitiesSort.bind(this);
  }
  activitiesSort() {}
  render() {
    const { activityLoading, activityList } = this.state;
    const menu = (
      <Menu>
        <Menu.Item key={1}>Add Comment</Menu.Item>
        <Menu.Item key={2}>Add Task</Menu.Item>
      </Menu>
    );
    return (
      <Row>
        <Col span={9}></Col>
        <Col span={15} className="activities-right" style={{ marginBottom: '20px' }}>
          {/* <Dropdown trigger={['click']} overlayClassName="dropdown-custom" style={{marginRight: '10px'}}>
                  <Button className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                    Email Type
                    <Icon type="down" />
                  </Button>
                  <Menu slot="overlay">
                    <Checkbox
                      :indeterminate="indeterminateEmail"
                      @change="onCheckAllEamil"
                      :checked="checkEmailAll"
                    >{{ $t('public.selectAll') }}</Checkbox>
                    <Divider />
                    <CheckboxGroup v-model="emailCheckedList" @change="emailChange">
                      <Row :gutter="24" v-for="(item, i) in emailFilter" :key="i">
                        <Col span={24}>
                          <Checkbox :value="item.value">{{ item.label }}</Checkbox>
                        </Col>
                      </Row>
                    </CheckboxGroup>
                  </Menu>
                </Dropdown> */}
          <Button className="sortBtn" onClick={this.activitiesSort}>
            <span className="icon iconfont iconbianzu8" style={{ fontSize: '22px' }} />
          </Button>
          <Dropdown overlay={menu}>
            <Button className="addCommentBtn">
              <span className="icon iconfont iconbianzu9" style={{ fontSize: '22px' }} />
            </Button>
          </Dropdown>
        </Col>
        <Col span={24}>
          <Timeline pending={activityLoading}>
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
            <Button type="link" className="jump-link">
              View More
            </Button>
          </div>
        </Col>
      </Row>
    );
  }
}
