import React, { Component } from 'react';
import { Headline, BreadCrumb, DragTable } from 'qmkit';
import { Row, Col, Select, Button, message, Tooltip, Divider, Popconfirm, Switch, Form, Modal } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';
import { getStoreLanguages } from './storeLanguage';

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class NavigationList extends Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      title: 'Navigation list',
      languages: [],
      selectLanguage: '',
      loading: false,
      defaultLanguage: '',
      dataSource: [],
      allTopNavigationName: []
    };
    this.getNavigationList = this.getNavigationList.bind(this);
    this.updateNavigationStatus = this.updateNavigationStatus.bind(this);
    this.sortNavigation = this.sortNavigation.bind(this);
    this.deleteNavigation = this.deleteNavigation.bind(this);
  }

  componentDidMount() {
    getStoreLanguages().then((res) => {
      this.setState({
        languages: res,
        defaultLanguage: res[0].name
      });
      if (this.props.location.state && this.props.location.state.language) {
        this.setState({
          defaultLanguage: this.props.location.state.language
        });
      }
      this.getNavigationList(this.state.defaultLanguage);
    });
  }

  getNavigationList(language) {
    webapi
      .getNavigations(language)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          let dataSource = [];
          let allTopNavigationName = [];
          res.context.map((item) => {
            let navigation = {
              id: item.id,
              parentId: item.parentId,
              key: item.id,
              navigationName: item.navigationName,
              sort: item.sort,
              enable: item.enable,
              paramsField: item.paramsField,
              language: item.language
            };
            dataSource.push(navigation);
            if (!item.parentId) {
              allTopNavigationName.push(item.navigationName);
            }
          });
          this.setState({
            dataSource: dataSource,
            selectLanguage: language,
            allTopNavigationName
          });
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
      });
  }
  updateNavigationStatus(record, checked) {
    let tipMessage = checked ? 'enable' : 'disable';
    let that = this;
    confirm({
      title: 'Prompt',
      content: 'Are you sure ' + tipMessage + ' the navigation',
      onOk() {
        let enable = checked ? 1 : 0;
        webapi
          .updateNavigationStatus(record.id, enable)
          .then((data) => {
            const { res } = data;
            if (res.code === 'K-000000') {
              message.success('Operate successfully');
              that.getNavigationList(that.state.selectLanguage);
            } else {
              message.error(res.message || 'Update Failed');
              that.setState({
                loading: false
              });
            }
          })
          .catch((err) => {
            message.error(err || 'Update Failed');
            that.setState({
              loading: false
            });
          });
      }
    });
  }
  sortNavigation(sortList) {
    webapi
      .sortNavigations(sortList)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          message.success('Operate successfully');
        } else {
          message.error(res.message || 'Sort Failed');
        }
      })
      .catch((err) => {
        message.error(err || 'Sort Failed');
      });
  }
  deleteNavigation(record) {
    if (record.children && record.children.length > 0) {
      message.warning('You must delete children of the navigation firstly');
      return;
    }
    webapi
      .deleteNavigation(record.id)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          message.success('Operate successfully');
          this.getNavigationList(this.state.selectLanguage);
        } else {
          message.error(res.message || 'Delete Failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Delete Failed');
        this.setState({
          loading: false
        });
      });
  }
  render() {
    const { title, languages, dataSource, loading, defaultLanguage, allTopNavigationName } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '10%'
      },
      {
        title: 'Navigation Item',
        dataIndex: 'navigationName',
        key: 'navigationName',
        width: '10%'
      },
      {
        title: 'Parameter',
        dataIndex: 'paramsField',
        key: 'paramsField',
        width: '10%'
      },
      {
        title: 'Status',
        dataIndex: 'enable',
        key: 'enable',
        width: '10%',
        render: (text, record) => <Switch checked={text === 1 ? true : false} onClick={(e) => this.updateNavigationStatus(record, e)}></Switch>
      },
      {
        title: 'Operation',
        key: 'operation',
        width: '8%',
        render: (text, record) => (
          <div>
            <div>
              <Tooltip placement="top" title="Add">
                <Link to={{ pathname: '/navigation-update/' + record.id, state: { type: 'add', language: record.language, noLanguageSelect: true } }} className="iconfont iconbtn-addsubvisionsaddcategory"></Link>
              </Tooltip>

              <Divider type="vertical" />

              <Tooltip placement="top" title="Edit">
                <Link to={{ pathname: '/navigation-update/' + record.id, state: { type: 'edit', noLanguageSelect: !!record.parentId } }} className="iconfont iconEdit"></Link>
              </Tooltip>

              <Divider type="vertical" />

              <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteNavigation(record)} okText="Confirm" cancelText="Cancel">
                <Tooltip placement="top" title="Delete">
                  <a type="link" className="iconfont iconDelete"></a>
                </Tooltip>
              </Popconfirm>
            </div>
          </div>
        )
      }
    ];
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={title} />
          <Row style={{ marginTop: '30px' }}>
            <Col span={12}>
              <Button type="primary" htmlType="submit">
                <Link to={{ pathname: '/navigation-add', state: { type: 'add', topNames: allTopNavigationName } }}>Add New Navigation Item</Link>
              </Button>
            </Col>
            <Col span={12} style={{ textAlign: 'end' }}>
              <Form>
                <FormItem>
                  {getFieldDecorator('language', {
                    initialValue: defaultLanguage,
                    rules: [{ required: true, message: 'Please input Navigation Name' }]
                  })(
                    <Select
                      style={{ width: 200 }}
                      onChange={(value) => {
                        value = value === '' ? null : value;
                        this.getNavigationList(value);
                      }}
                    >
                      {languages &&
                        languages.map((item, index) => (
                          <Option value={item.name} key={index}>
                            <img style={{ height: '20px', width: '20px' }} src={item.description} alt="Image" /> {item.name}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Form>
            </Col>
          </Row>
          <Row>
            <DragTable loading={loading} columns={columns} dataSource={dataSource} sort={this.sortNavigation} />
          </Row>
        </div>
      </div>
    );
  }
}
export default Form.create()(NavigationList);
