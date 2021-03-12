import React, { Component } from 'react';
import { Const } from 'qmkit';
import { Form, Input, Col, Row, Select, message, InputNumber } from 'antd';
import * as webapi from '@/automation-workflow/webapi';

const FormItem = Form.Item;
const Option = Select.Option;

export default class ChooseTaskForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        taskName: '',
        variableType: '',
        variableValue: '',
        assistantId: '',
        assistantName: '',
        goldenMoment: undefined,
        priority: undefined,
        actionType: undefined,
        startTime: '',
        dueTime: '',
        reminderTime: '',
        dueTimeNumber: 1,
        dueTimeType: undefined,
        reminderNumber: 1,
        reminderType: undefined
      },
      assignedUsers: [],
      goldenMomentList: [],
      priorityList: [
        { name: 'Low', value: 'Low' },
        { name: 'Medium', value: 'Medium' },
        { name: 'High', value: 'High' }
      ],
      actionTypeList: [
        { name: 'Call', value: 'Call' },
        { name: 'Email', value: 'Email' },
        { name: 'N/A', value: 'N/A' }
      ],
      timeType: [
        { name: 'Days', value: 'Day' },
        { name: 'Minutes', value: 'Minute' },
        { name: 'Months', value: 'Hour' },
        { name: 'Weeks', value: 'Week' }
      ],
      variableList: [
        { name: 'Order', value: ['Order Number'] },
        { name: 'Pet owner', value: ['Pet Owner Name', 'Pet Owner Account'] },
        { name: 'Pet', value: ['Pet Name'] },
        { name: 'Subscription', value: ['Subscription Number'] }
      ],
      variableValueList: [],

      nodeId: ''
    };
    this.onChange = this.onChange.bind(this);
    this.getEmployees = this.getEmployees.bind(this);
    this.searchAssignedTo = this.searchAssignedTo.bind(this);
  }
  onChange(field, value) {
    let data = this.state.form;
    data[field] = value;
    this.setState(
      {
        form: data
      },
      () => this.updateParentValue()
    );
  }

  componentDidMount() {
    this.initData(this.props);
    this.getEmployees();
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

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  initData(nextProps) {
    if (this.state.nodeId === nextProps.nodeId) {
      return;
    } else {
      this.setState({
        nodeId: nextProps.nodeId
      });
    }
    const { taskData } = nextProps;
    if (taskData && taskData.taskName === undefined) {
      this.setState({
        form: {
          taskName: '',
          variableType: '',
          variableValue: '',
          assistantId: null,
          assistantName: '',
          goldenMoment: undefined,
          priority: undefined,
          actionType: undefined,
          startTime: '',
          dueTime: '',
          reminderTime: '',
          dueTimeNumber: 1,
          dueTimeType: undefined,
          reminderNumber: 1,
          reminderType: undefined
        }
      });
    } else {
      this.setState({
        form: taskData
      });
    }
  }

  updateParentValue() {
    const { updateValue } = this.props;
    const { form } = this.state;
    updateValue('taskData', form);
  }

  searchAssignedTo = (value) => {
    this.getEmployees(value);
  };

  getEmployees(value?: String) {
    let params = {
      pageNum: 0,
      pageSize: 20,
      keyword: value
    };

    webapi
      .getEmployeesByKeyword(params)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            assignedUsers: res.context.employees
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });
  }

  variableTypeChange(name) {
    const { variableList, form } = this.state;
    let variable = variableList.find((x) => x.name === name);
    form.variableType = name;
    form.variableValue = '';
    this.setState(
      {
        form,
        variableValueList: variable ? variable.value : []
      },
      () => this.updateParentValue()
    );
  }

  variableValueChange(value) {
    const { form } = this.state;
    let newTaskName = form.taskName + ' {' + value + '} ';
    form.variableValue = value;
    form.taskName = newTaskName;
    this.setState(
      {
        form
      },
      () => this.updateParentValue()
    );
  }

  render() {
    const { form, assignedUsers, goldenMomentList, priorityList, actionTypeList, timeType, variableList, variableValueList } = this.state;
    return (
      <React.Fragment>
        <div className="taskFrom">
          <FormItem label="Task Name" colon={false}>
            <Input
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onChange('taskName', value);
              }}
              value={form.taskName}
              placeholder="Please input task name"
            />
          </FormItem>
          <FormItem label="Add Variable" colon={false}>
            <Row gutter={16}>
              <Col span={8}>
                <Select
                  onChange={(value) => {
                    this.variableTypeChange(value);
                  }}
                  dropdownClassName="normalSelect"
                  value={form.variableType}
                >
                  {variableList.map((item) => (
                    <Option value={item.name} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={16}>
                <Select
                  onChange={(value) => {
                    this.variableValueChange(value);
                  }}
                  dropdownClassName="normalSelect"
                  value={form.variableValue}
                >
                  {variableValueList.map((item) => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="Assigned To" colon={false}>
            <Select
              dropdownClassName="normalSelect"
              placeholder="Please input email or name"
              showSearch
              value={form.assistantId}
              onSearch={this.searchAssignedTo}
              onChange={(value) => {
                this.onChange('assistantId', value);
                let assistant = assignedUsers.find((x) => x.employeeId === value);
                let assistantName = assistant ? assistant.employeeName + '(' + assistant.accountName + ')' : '';
                this.onChange('assistantName', assistantName);
              }}
            >
              {assignedUsers.map((item) => (
                <Option value={item.employeeId} key={item.employeeId}>
                  {item.employeeName} {'(' + item.accountName + ')'})
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem label="GoldenMoment" colon={false}>
            <Select
              onChange={(value) => {
                this.onChange('goldenMoment', value);
              }}
              dropdownClassName="normalSelect"
              placeholder="Please select goldenMoment"
              value={form.goldenMoment}
            >
              {goldenMomentList.map((item) => (
                <Option value={item.value} key={item.id}>
                  {item.value}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem label="Priority" colon={false}>
            <Select
              onChange={(value) => {
                this.onChange('priority', value);
              }}
              dropdownClassName="normalSelect"
              placeholder="Please select priority"
              value={form.priority}
            >
              {priorityList.map((item) => (
                <Option value={item.value} key={item.value}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem label="Action Type" colon={false}>
            <Select
              onChange={(value) => {
                this.onChange('actionType', value);
              }}
              dropdownClassName="normalSelect"
              placeholder="Please select action type"
              value={form.actionType}
            >
              {actionTypeList.map((item) => (
                <Option value={item.value} key={item.value}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem colon={false} style={{ marginTop: '5px' }}>
            <Row gutter={24} type="flex" justify="start" align="middle">
              <Col span={6} className="horizontalLable">
                Start Time
              </Col>
              <Col span={18}>
                <Input placeholder="Task Creation Time" disabled />
              </Col>
            </Row>
            <Row gutter={24} type="flex" justify="start" align="middle">
              <Col span={6} className="horizontalLable">
                Due Time
              </Col>
              <Col span={4}>
                <InputNumber
                  onChange={(value) => {
                    this.onChange('dueTimeNumber', value);
                  }}
                  min={1}
                  max={100}
                  value={form.dueTimeNumber}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={6}>
                <Select
                  onChange={(value) => {
                    this.onChange('dueTimeType', value);
                  }}
                  dropdownClassName="normalSelect"
                  value={form.dueTimeType}
                >
                  {timeType.map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={8} className="horizontalLable">
                after task started
              </Col>
            </Row>
            <Row gutter={24} type="flex" justify="start" align="middle">
              <Col span={6} className="horizontalLable">
                Reminder Time
              </Col>
              <Col span={4}>
                <InputNumber
                  onChange={(value) => {
                    this.onChange('reminderNumber', value);
                  }}
                  min={1}
                  max={100}
                  value={form.reminderNumber}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={6}>
                <Select
                  onChange={(value) => {
                    this.onChange('reminderType', value);
                  }}
                  dropdownClassName="normalSelect"
                  value={form.reminderType}
                >
                  {timeType.map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={8} className="horizontalLable">
                after task started
              </Col>
            </Row>
          </FormItem>
        </div>
      </React.Fragment>
    );
  }
}
