import React, { Component } from 'react';
import { Headline, BreadCrumb, DragTable } from 'qmkit';
import { Row, Col, Select, Button, message, Tooltip, Divider, Popconfirm, Switch, Form } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';
import { getStoreLanguages } from './storeLanguage';

const Option = Select.Option;
const FormItem = Form.Item;

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
      dataSource: []
    };
    this.getNavigationList = this.getNavigationList.bind(this);
    this.updateNavigation = this.updateNavigation.bind(this);
    this.sortNavigation = this.sortNavigation.bind(this);
    this.deleteNavigation = this.deleteNavigation.bind(this);
  }

  componentDidMount() {
    getStoreLanguages().then((res) => {
      this.setState({
        languages: res,
        defaultLanguage: res[0].valueEn
      });
      if (this.props.location.state && this.props.location.state.language) {
        this.setState({
          defaultLanguage: this.props.location.state.language
        });
      }
      this.getNavigationList(res[0].valueEn);
    });
  }

  getNavigationList(language) {
    webapi
      .getNavigations(language)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          let dataSource = [];
          res.context.map((item) => {
            let navigation = {
              id: item.id,
              parentId: item.parentId,
              key: item.id,
              navigationName: item.navigationName,
              sort: item.sort,
              enable: item.enable,
              paramsField: item.paramsField
            };
            dataSource.push(navigation);
          });
          this.setState({
            dataSource: dataSource,
            selectLanguage: language
          });
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
      });
  }
  updateNavigation(record, checked) {
    record.enable = checked ? 1 : 0;
    webapi
      .updateNavigation({ navigationRequest: record })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          message.success(res.message || 'Update successful');
          this.getNavigationList(this.state.selectLanguage);
        } else {
          message.error(res.message || 'Update Failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Update Failed');
        this.setState({
          loading: false
        });
      });
  }
  sortNavigation(sortList) {
    webapi
      .sortNavigations(sortList)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          message.success(res.message || 'Sort successful');
        } else {
          message.error(res.message || 'Sort Failed');
        }
      })
      .catch((err) => {
        message.error(err || 'Sort Failed');
      });
  }
  deleteNavigation(id) {
    webapi
      .deleteNavigations({ id: id })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          message.success(res.message || 'Delete successful');
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
    const { title, languages, dataSource, loading, defaultLanguage } = this.state;
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
        render: (text, record) => <Switch checked={text === 1 ? true : false} onClick={(e) => this.updateNavigation(record, e)}></Switch>
      },
      {
        title: 'Operation',
        key: 'operation',
        width: '8%',
        render: (text, record) => (
          <div>
            <div>
              <Tooltip placement="top" title="Edit">
                <Link to={'/navigation-update/' + record.id} className="iconfont iconbtn-addsubvisionsaddcategory"></Link>
              </Tooltip>
              <Divider type="vertical" />

              <Tooltip placement="top" title="Edit">
                <Link to={'/navigation-update/' + record.id} className="iconfont iconEdit"></Link>
              </Tooltip>

              <Divider type="vertical" />

              <Popconfirm placement="topLeft" title="Are you sure to delete this item?" onConfirm={() => this.deleteNavigation(record.id)} okText="Confirm" cancelText="Cancel">
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
                <Link to="/navigation-update">Add New Navigation Item</Link>
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
                          <Option value={item.valueEn} key={index}>
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
