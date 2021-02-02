import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline } from 'qmkit';
import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table, DatePicker } from 'antd';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import ListView from './components/list-view';
import CardView from './components/card-view';
import { Link } from 'react-router-dom';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class Task extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Task Board',
      isCardView: true,
      goldenMomentList: [],
      taskStatus: ['To Do', 'On-going', 'Completed', 'Cancelled'],
      priorityList: ['Low', '	Medium', 'High'],
      taskForm: {}
    };
    this.onFormChange = this.onFormChange.bind(this);
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.taskForm;
    data[field] = value;
    this.setState({
      taskForm: data
    });
  };
  render() {
    const { title, goldenMomentList, taskStatus, priorityList, isCardView, taskForm, reflashData } = this.state;
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={title} />
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
                      goldenMomentList.map((item, index) => (
                        <Option value={item} key={index}>
                          {item}
                        </Option>
                      ))}
                  </SelectGroup>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <SelectGroup
                    defaultValue=""
                    label={<p style={styles.label}>Task Status</p>}
                    style={{ width: 195 }}
                    onChange={(value) => {
                      value = value === '' ? null : value;
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
                        <Option value={item} key={index}>
                          {item}
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
                      priorityList.map((item, index) => (
                        <Option value={item} key={index}>
                          {item}
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
                        field: 'petOwnerName',
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
                        field: 'assistantName',
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
                      value: dateString[0]
                    });
                    this.onFormChange({
                      field: 'dueTimeEnd',
                      value: dateString[1]
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
                        this.refs.cardView.getTaskList();
                      } else {
                        this.refs.listView.getTaskList();
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
        </div>
        <div className="container">
          <Button type="primary" htmlType="submit" style={{ marginBottom: '20px' }}>
            <Link to={{ pathname: '/add-task' }}>Add New Task</Link>
          </Button>
          {isCardView ? <CardView ref="cardView" formData={taskForm} /> : <ListView ref="listView" formData={taskForm} />}
        </div>
      </div>
    );
  }
}

const styles = {
  label: {
    width: 143,
    textAlign: 'center'
  },
  wrapper: {
    width: 157
  }
} as any;
