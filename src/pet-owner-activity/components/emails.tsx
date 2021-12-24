import React, { Component } from 'react';
import { Const, cache, history } from 'qmkit';
import { Row, Col, Dropdown, Button, Menu, Timeline, Select, Empty, Spin, message } from 'antd';
import { replaceLink } from '../common';
import TemplateConponent from './template-conponent';
import { Link } from 'react-router-dom';
import * as webapi from '../webapi';
import AddComment from './add-comment';
import { FormattedMessage, injectIntl } from 'react-intl';

const Option = Select.Option;
export default class emails extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      emailLoading: false,
      emailList: [],
      emailFilters: [
        {
          value: 'Order email',
          name: 'Order email'
        },
        {
          value: 'Subscription email',
          name: 'Subscription email'
        },
        {
          value: 'Recommendation email',
          name: 'Recommendation email'
        },
        {
          value: 'Prescriber creation email',
          name: 'Prescriber creation email'
        },
        {
          value: 'Automation email',
          name: 'Automation email'
        }
      ],
      isRecent: true,
      orderType: 'desc',
      filters: [],
      visible: false
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
      customerId: this.props.petOwnerId, // this.props.petOwnerId,
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
            emailList: res.context.customerActivity || [],
            emailLoading: false
          });
        } else {
          message.error(res.message || (window as any).RCi18n({id:'Public.GetDataFailed'}));
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
    const { emailLoading, emailList, emailFilters, orderType, isRecent, visible } = this.state;
    const { petOwner } = this.props;
    const hasTaskRole = sessionStorage.getItem(cache.LOGIN_FUNCTIONS) && JSON.parse(sessionStorage.getItem(cache.LOGIN_FUNCTIONS)).includes('f_petowner_task');
    const menu = (
      <Menu>
        <Menu.Item key={1}>
          <a onClick={() => this.setState({ visible: true })}> Add Comment</a>
        </Menu.Item>
        {hasTaskRole ? (
          <Menu.Item key={2}>
            {' '}
            <a onClick={() => history.push('/add-task', { petOwner: { contactId: this.props.petOwnerId, petOwnerName: petOwner.contactName, customerAccount: petOwner.customerAccount } })}>Add Task</a>
          </Menu.Item>
        ) : null}
      </Menu>
    );
    return (
      <Row>
        <Col span={9}></Col>
        <Col span={15} className="activities-right" style={{ marginBottom: '20px' }}>
          <Select className="filter" placeholder="Email Type" allowClear={true} dropdownMatchSelectWidth={false} maxTagCount={0} style={{ width: '120px' }} mode="multiple" onChange={(value) => this.setState({ filters: value }, () => this.getEmails())}>
            {emailFilters.map((item) => (
              <Option value={item.value} key={item.value}>
                {item.name}
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
          <Spin spinning={emailLoading}>
            {emailList && emailList.length > 0 ? (
              <div>
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
                          <TemplateConponent avtivity={item.emailTaskMessage} />
                        </Col>
                      </Row>
                    </Timeline.Item>
                  ))}
                </Timeline>
                <div style={{ textAlign: 'center' }}>
                  <Button type="link" className="jump-link" onClick={() => this.setState({ isRecent: false }, () => this.getEmails())}>
                    <span>{isRecent ? 'View More' : ''}</span>
                  </Button>
                </div>
              </div>
            ) : (
              <Empty />
            )}
          </Spin>
        </Col>
        {visible ? <AddComment visible={visible} getActivities={() => {}} petOwnerId={this.props.petOwnerId} closeModel={() => this.setState({ visible: false })} /> : null}
      </Row>
    );
  }
}
