import React, { Component } from 'react';
import { Card, Icon, Row, Col, message, Dropdown, Button, Menu, Checkbox, Timeline } from 'antd';
const { Divider } = Menu;
const { Item } = Menu;
const CheckboxGroup = Checkbox.Group;
import { replaceLink } from '../common';
import TemplateConponent from './template-conponent';

export default class emails extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      emailLoading: false,
      emailList: [
        {
          activityName: "New booking in /'clinics name' from /'2021-01-29T09:31 to /'2021-01-29T10:31'",
          activityType: 'Clinic Booking',
          auditId: 8018,
          category: 'Clinic',
          clinicId: 6,
          clinicName: 'Вега',
          petOwnerId: 229,
          createdBy: 138,
          createdByUser: 'Mia Lin',
          dateAdded: '2021-01-28 12:32:26',
          id: 8196,
          tenantId: 4
        }
      ],
      emailFilter: [
        { value: 'COMMUNICATION.Emails', label: 'Communication Email' },
        { value: 'CAMPAIGN ACTIVITY.Emails', label: 'Campaign Email' }
      ],
      filterVisible: false
    };
    this.activitiesEmailSort = this.activitiesEmailSort.bind(this);
  }

  componentDidMount() {}

  activitiesEmailSort() {}
  render() {
    const { emailLoading, emailList, emailFilter, filterVisible } = this.state;
    const menu = (
      <Menu>
        <Menu.Item key={1}>Add Comment</Menu.Item>
        <Menu.Item key={2}>Add Task</Menu.Item>
      </Menu>
    );
    const filterMenu = (
      <Menu>
        <Checkbox>Select All</Checkbox>
        <a className="closeFilter" onClick={() => this.setState({ filterVisible: false })}>
          {' '}
          X
        </a>
        <Divider />
        <CheckboxGroup>
          {emailFilter.map((item, index) => (
            <Row gutter={24} key={index}>
              <Col span={24}>
                <Checkbox value={item.value}>{item.label}</Checkbox>
              </Col>
            </Row>
          ))}
        </CheckboxGroup>
      </Menu>
    );
    return (
      <Row>
        <Col span={9}></Col>
        <Col span={15} className="activities-right" style={{ marginBottom: '20px' }}>
          <div style={{ marginRight: '10px' }}>
            <Dropdown overlay={filterMenu} trigger={['click']} overlayClassName="dropdown-custom" visible={filterVisible}>
              <Button className="ant-dropdown-link" onClick={(e) => this.setState({ filterVisible: true })}>
                Email Type
                <Icon type="down" />
              </Button>
            </Dropdown>
          </div>
          <Button className="sortBtn" onClick={this.activitiesEmailSort}>
            <span className="icon iconfont iconbianzu8" style={{ fontSize: '22px' }} />
          </Button>
          <Dropdown overlay={menu}>
            <Button className="addCommentBtn">
              <span className="icon iconfont iconbianzu9" style={{ fontSize: '22px' }} />
            </Button>
          </Dropdown>
        </Col>
        <Col span={24}>
          <Timeline pending={emailLoading}>
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
            <Button type="link" className="jump-link">
              View More
            </Button>
          </div>
        </Col>
      </Row>
    );
  }
}
