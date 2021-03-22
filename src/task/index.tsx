import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline } from 'qmkit';
import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table, DatePicker, Collapse, Breadcrumb, Icon } from 'antd';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import ListView from './components/list-view';
import CardView from './components/card-view';
import { Link } from 'react-router-dom';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

export default class Task extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Task Board',
      isCardView: true,
      goldenMomentList: [],
      taskStatus: [
        { name: 'To Do', value: 'To Do' },
        { name: 'On-going', value: 'On-going' },
        { name: 'Completed', value: 'Completed' },
        { name: 'Cancelled', value: 'Cancelled' }
      ],
      priorityList: [
        { name: 'Low', value: 'Low' },
        { name: 'Medium', value: 'Medium' },
        { name: 'High', value: 'High' }
      ],
      taskForm: {
        status: ''
      },
      queryType: '1',
      showAdvanceSearch: false
    };
    this.onFormChange = this.onFormChange.bind(this);
    this.clickTaskMore = this.clickTaskMore.bind(this);
  }

  componentDidMount() {
    webapi
      .getGlodenMomentList()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            goldenMomentList: res.context.sysDictionaryVOS
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.taskForm;
    data[field] = value;
    this.setState({
      taskForm: data
    });
  };
  clickTaskMore(status) {
    const { taskForm } = this.state;
    taskForm.status = status;
    this.setState({
      isCardView: false,
      showAdvanceSearch: true,
      taskForm: taskForm
    });
  }
  render() {
    const { title, goldenMomentList, taskStatus, priorityList, isCardView, taskForm, queryType, showAdvanceSearch } = this.state;
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/">Home</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Task board</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container">
          <Row>
            <Col span={12}>
              <Headline title={title} />
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <span className="advanceSearch" onClick={() => this.setState({ showAdvanceSearch: !showAdvanceSearch })}>
                Advance Search <Icon type={showAdvanceSearch ? 'up' : 'down'} />
              </span>
            </Col>
          </Row>
          {showAdvanceSearch ? (
            <Form className="filter-content" layout="inline">
              <Row>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={<p style={styles.label}>Task Name</p>}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'name',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <SelectGroup
                      defaultValue=""
                      showSearch
                      label={<p style={styles.label}>Golden Moment</p>}
                      style={{ width: 195 }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'goldenMoment',
                          value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="all" />
                      </Option>
                      {goldenMomentList &&
                        goldenMomentList.map((item) => (
                          <Option value={item.value} key={item.id}>
                            {item.value}
                          </Option>
                        ))}
                    </SelectGroup>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <SelectGroup
                      value={taskForm.status}
                      label={<p style={styles.label}>Task Status</p>}
                      style={{ width: 195 }}
                      onChange={(value) => {
                        this.onFormChange({
                          field: 'status',
                          value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="all" />
                      </Option>
                      {taskStatus &&
                        taskStatus.map((item, index) => (
                          <Option value={item.value} key={index}>
                            {item.name}
                          </Option>
                        ))}
                    </SelectGroup>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem>
                    <SelectGroup
                      defaultValue=""
                      label={<p style={styles.label}>Priority</p>}
                      style={{ width: 195 }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'priority',
                          value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="all" />
                      </Option>

                      {priorityList &&
                        priorityList.map((item) => (
                          <Option value={item.value} key={item.value}>
                            {item.name}
                          </Option>
                        ))}
                    </SelectGroup>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={<p style={styles.label}>Pet Assistant Name</p>}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'assistantName',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={<p style={styles.label}>Pet Owner Name</p>}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'petOwnerName',
                          value
                        });
                      }}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <RangePicker
                    placeholder={['Due Start time', 'Due End time']}
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) => {
                      this.onFormChange({
                        field: 'dueTimeStart',
                        value: dateString[0] ? dateString[0] + ' 00:00:00' : null
                      });
                      this.onFormChange({
                        field: 'dueTimeEnd',
                        value: dateString[1] ? dateString[1] + ' 00:00:00' : null
                      });
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <FormItem>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon="search"
                      shape="round"
                      onClick={(e) => {
                        e.preventDefault();
                        if (isCardView) {
                          this.refs.cardView.getTaskList(queryType);
                        } else {
                          this.refs.listView.getTaskList(queryType);
                        }
                      }}
                    >
                      <span>
                        <FormattedMessage id="search" />
                      </span>
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          ) : null}

          <Row style={{ marginBottom: '20px' }}>
            <Col span={12}>
              <Button type="primary" htmlType="submit">
                <Link to={{ pathname: '/add-task' }}>Add New Task</Link>
              </Button>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Select
                defaultValue={'1'}
                style={{ width: '120px', marginRight: '20px' }}
                onChange={(value) => {
                  this.setState({
                    queryType: value
                  });
                  if (isCardView) {
                    this.refs.cardView.getTaskList(value);
                  } else {
                    this.refs.listView.getTaskList(value);
                  }
                }}
              >
                <Option value={'1'}>My Task</Option>
                <Option value={'0'}>All Task</Option>
              </Select>
              <Select
                value={isCardView ? 0 : 1}
                style={{ width: '120px' }}
                onChange={(value) =>
                  this.setState({
                    isCardView: value === 0
                  })
                }
              >
                <Option value={0}>Card View</Option>
                <Option value={1}>List View</Option>
              </Select>
            </Col>
          </Row>
          {isCardView ? <CardView ref="cardView" formData={taskForm} queryType={queryType} clickTaskMore={this.clickTaskMore} /> : <ListView ref="listView" formData={taskForm} queryType={queryType} />}
        </div>
      </div>
    );
  }
}

const styles = {
  label: {
    width: 143,
    textAlign: 'center'
  }
} as any;
