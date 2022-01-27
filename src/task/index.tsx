import React, { Component, LegacyRef } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline, cache, RCi18n } from 'qmkit';
import {
  Form,
  Row,
  Col,
  Select,
  Input,
  Button,
  message,
  Tooltip,
  Table,
  DatePicker,
  Collapse,
  Breadcrumb,
  Icon,
  notification,
  Modal
} from 'antd';
import * as webapi from './webapi';
import { FormattedMessage, injectIntl } from 'react-intl';
import ListView from './components/list-view';
import CardView from './components/card-view';
import { Link } from 'react-router-dom';
import './style.less';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

@injectIntl
export default class Task extends React.Component<any, any> {
  cardViewRef: React.RefObject<any>;
  listViewRef: React.RefObject<any>;
  constructor(props) {
    super(props);
    this.state = {
      title: <FormattedMessage id="task.TaskBoard" />,
      isCardView: sessionStorage.getItem(cache.TASKVIEWTYPE) === 'False' ? false : true,
      goldenMomentList: [],
      timeZoneList: [],
      taskStatus: [
        { name: <FormattedMessage id="task.ToDo" />, value: 'To Do' },
        { name: <FormattedMessage id="task.On-going" />, value: 'On-going' },
        { name: <FormattedMessage id="task.Completed" />, value: 'Completed' },
        { name: <FormattedMessage id="task.Cancelled" />, value: 'Cancelled' }
      ],
      priorityList: [
        { name: <FormattedMessage id="task.Low" />, value: 'Low' },
        { name: <FormattedMessage id="task.Medium" />, value: 'Medium' },
        { name: <FormattedMessage id="task.High" />, value: 'High' }
      ],
      taskForm: sessionStorage.getItem(cache.TASKFROMDATA) ? JSON.parse(sessionStorage.getItem(cache.TASKFROMDATA)) : { status: '' },
      queryType: sessionStorage.getItem(cache.TASKQueryType) ? sessionStorage.getItem(cache.TASKQueryType) : '0',
      showAdvanceSearch: sessionStorage.getItem(cache.TASKSHOWSEARCH) === 'True' ? true : false,
      exportLoading: false,
    };
    this.onFormChange = this.onFormChange.bind(this);
    this.clickTaskMore = this.clickTaskMore.bind(this);

    this.cardViewRef = React.createRef();
    this.listViewRef = React.createRef();
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
        }
      });
    webapi.getTimeZoneList().then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.setState({
          timeZoneList: data.res.context?.sysDictionaryVOS ?? []
        });
      }
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
  };

  handleExport = () => {
    const { taskForm } = this.state;
    console.log(taskForm)

    // 只支持导出一年内的时间
    const { dueTimeStart } = taskForm;
    if (dueTimeStart) {
      const isOver = moment(dueTimeStart).valueOf() < moment().subtract(1, 'y').valueOf();

      if (isOver) {
        message.error((window as any).RCi18n({id:'Task.ExportTaskTimeTips'}));
        return;
      }
    }

    this.setState({
      exportLoading: true
    })
    webapi.exportTask(taskForm).then((data:any) => {
      const res = data.res;

      if (res.code === Const.SUCCESS_CODE) {
        Modal.success({
          width: 550,
          centered: true,
          content: RCi18n({ id: 'Public.exportConfirmTip' }),
          okText: RCi18n({ id: 'Order.btnConfirm' }),
          icon: '',
          onOk: () => {
            // this.props.history.goBack();
          },
          okButtonProps: {
            style: {
              marginRight: 200
            }
          }
        });
      }

      this.setState({
        exportLoading: false
      })
    }).catch(() => {
      this.setState({
        exportLoading: false
      })
    });

  };

  render() {
    const { title, goldenMomentList, taskStatus, priorityList, isCardView, taskForm, queryType, showAdvanceSearch, exportLoading, timeZoneList } = this.state;
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/">
              <FormattedMessage id="Menu.Home" />
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <FormattedMessage id="task.TaskBoard" />
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="container">
          <Row>
            <Col span={12}>
              <Headline title={title} />
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button type="primary" className="export-task-button" onClick={this.handleExport} loading={exportLoading}>
                <span><FormattedMessage id="Task.ExportTasks" /></span>
              </Button>
              <span
                className="advanceSearch"
                onClick={() => {
                  this.setState({ showAdvanceSearch: !showAdvanceSearch });
                  sessionStorage.setItem(cache.TASKSHOWSEARCH, !showAdvanceSearch ? 'True' : 'False');
                }}
              >
                <FormattedMessage id="task.AdvanceSearch" /> <Icon type={showAdvanceSearch ? 'up' : 'down'} />
              </span>
            </Col>
          </Row>
          {showAdvanceSearch ? (
            <Form className="filter-content" layout="inline">
              <Row>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <p style={styles.label}>
                          <FormattedMessage id="task.TaskName" />
                        </p>
                      }
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'name',
                          value
                        });
                      }}
                      value={taskForm.name}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <SelectGroup
                      defaultValue=""
                      showSearch
                      dropdownMatchSelectWidth={false}
                      label={
                        <p style={styles.label}>
                          <FormattedMessage id="task.GoldenMoment" />
                        </p>
                      }
                      style={{ width: 194, maxWidth: 194 }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'goldenMoment',
                          value
                        });
                      }}
                      value={taskForm.goldenMoment}
                    >
                      <Option value="">
                        <FormattedMessage id="Order.All" />
                      </Option>
                      {goldenMomentList &&
                        goldenMomentList.map((item) => (
                          <Option value={item.valueEn} key={item.id}>
                            {item.valueEn}
                          </Option>
                        ))}
                    </SelectGroup>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <SelectGroup
                      dropdownMatchSelectWidth={false}
                      value={taskForm.status}
                      label={
                        <p style={styles.label}>
                          <FormattedMessage id="task.TaskStatus" />
                        </p>
                      }
                      style={{ width: 194 }}
                      onChange={(value) => {
                        this.onFormChange({
                          field: 'status',
                          value
                        });
                      }}
                    >
                      <Option value="">
                        <FormattedMessage id="task.All" />
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
                      label={
                        <p style={styles.label}>
                          <FormattedMessage id="task.Priority" />
                        </p>
                      }
                      style={{ width: 194 }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'priority',
                          value
                        });
                      }}
                      value={taskForm.priority}
                    >
                      <Option value="">
                        <FormattedMessage id="task.All" />
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
                      addonBefore={
                        <Tooltip
                          overlayStyle={{
                            overflowY: 'auto'
                          }}
                          placement="bottomLeft"
                          title={<div>{<FormattedMessage id="task.PetAssistantName" />}</div>}
                        >
                          <p style={styles.label} className="overFlowtext">
                            {<FormattedMessage id="task.PetAssistantName" />}
                          </p>
                        </Tooltip>
                      }
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'assistantName',
                          value
                        });
                      }}
                      value={taskForm.assistantName}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    <Input
                      addonBefore={
                        <Tooltip
                          overlayStyle={{
                            overflowY: 'auto'
                          }}
                          placement="bottomLeft"
                          title={<div>{<FormattedMessage id="task.PetOwnerName" />}</div>}
                        >
                          <p style={styles.label} className="overFlowtext">
                            {<FormattedMessage id="task.PetOwnerName" />}
                          </p>
                        </Tooltip>
                      }
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onFormChange({
                          field: 'petOwnerName',
                          value
                        });
                      }}
                      value={taskForm.petOwnerName}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <RangePicker
                    placeholder={[(window as any).RCi18n({ id: 'task.DueStarttime' }), (window as any).RCi18n({ id: 'task.DueEndtime' })]}
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) => {
                      this.onFormChange({
                        field: 'dueTimeStart',
                        value: dateString[0] ? dateString[0] + ' 00:00:00' : null
                      });
                      this.onFormChange({
                        field: 'dueTimeEnd',
                        value: dateString[1] ? dateString[1] + ' 23:59:59' : null
                      });
                    }}
                    value={taskForm.dueTimeStart && taskForm.dueTimeEnd ? [moment(taskForm.dueTimeStart), moment(taskForm.dueTimeEnd)] : null}
                    style={{ width: 360 }}
                  />
                </Col>
                <Col span={8}>
                  <FormItem>
                    <SelectGroup
                      defaultValue=""
                      showSearch
                      dropdownMatchSelectWidth={false}
                      label={
                        <p style={styles.label}>
                          <FormattedMessage id="Setting.timeZone" />
                        </p>
                      }
                      style={{ width: 194, maxWidth: 194 }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.onFormChange({
                          field: 'timeZone',
                          value
                        });
                      }}
                      value={taskForm.timeZone}
                    >
                      <Option value="">
                        <FormattedMessage id="Order.All" />
                      </Option>
                      {timeZoneList &&
                        timeZoneList.map((item) => (
                          <Option value={item.name} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                    </SelectGroup>
                  </FormItem>
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
                          this.cardViewRef.current.getTaskList(queryType);
                        } else {
                          this.listViewRef.current.getTaskList(queryType, true);
                        }
                        sessionStorage.setItem(cache.TASKFROMDATA, JSON.stringify(taskForm));
                      }}
                    >
                      <span>
                        <FormattedMessage id="task.Search" />
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
                <Link to={{ pathname: '/add-task' }}>
                  <FormattedMessage id="task.AddNewTask" />
                </Link>
              </Button>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Select
                defaultValue={queryType}
                style={{ width: '120px', marginRight: '20px' }}
                onChange={(value) => {
                  this.setState({
                    queryType: value
                  });
                  if (isCardView) {
                    this.cardViewRef.current.getTaskList(value);
                  } else {
                    this.listViewRef.current.getTaskList(value);
                  }
                  sessionStorage.setItem(cache.TASKQueryType, value);
                }}
                dropdownMatchSelectWidth={false}
              >
                <Option value={'1'}>
                  <FormattedMessage id="task.MyTasks" />
                </Option>
                <Option value={'0'}>
                  <FormattedMessage id="task.AllTasks" />
                </Option>
              </Select>
              <Select
                value={isCardView ? 0 : 1}
                style={{ width: '120px' }}
                onChange={(value) => {
                  this.setState({
                    isCardView: value === 0
                  });
                  sessionStorage.setItem(cache.TASKVIEWTYPE, value === 0 ? 'True' : 'False');
                }}
                dropdownMatchSelectWidth={false}
              >
                <Option value={0}>
                  <FormattedMessage id="task.CardView" />
                </Option>
                <Option value={1}>
                  <FormattedMessage id="task.ListView" />
                </Option>
              </Select>
            </Col>
          </Row>
          {isCardView ? <CardView ref={this.cardViewRef} formData={taskForm} queryType={queryType} clickTaskMore={this.clickTaskMore} /> : <ListView ref={this.listViewRef} formData={taskForm} queryType={queryType} />}
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
