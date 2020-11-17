import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline } from 'qmkit';
import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table, DatePicker, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class ProductSearchDetails extends React.Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      id: this.props.match.params.id,
      type: this.props.location.state ? this.props.location.state.type : '',
      searchForm: {},
      searchResultDetails: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      loading: false
    };
  }

  componentDidMount() {
    this.setState({
      title: this.state.type === 'all' ? 'Search Result Details' : 'No-Result Search Details'
    });
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    if (field === '') {
      let startDate = moment(value[0]).format('YYYY-MM-DD');
      let endDate = moment(value[1]).format('YYYY-MM-DD');
      data['startDate'] = startDate;
      data['endDate'] = endDate;
    } else {
      data[field] = value;
    }
    this.setState({
      searchForm: data
    });
  };

  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getSearchResultDetails()
    );
  };

  getSearchResultDetails() {
    const { searchForm, pagination } = this.state;
    let params = Object.assign(searchForm, {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    });
    this.setState({
      loading: true
    });
    webapi
      .getSearchResultData(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          this.setState({
            productFinderList: res.context.content,
            pagination: pagination,
            loading: false
          });
        } else {
          message.error(res.message || 'Get Data Failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Get Data Failed');
        this.setState({
          loading: false
        });
      });
  }

  render() {
    const { title, type, searchResultDetails, pagination, loading } = this.state;
    const columns = [
      {
        title: 'Search No.',
        dataIndex: 'searchNo',
        key: 'searchNo',
        width: '15%'
      },
      {
        title: 'Search Time',
        dataIndex: 'searchTime',
        key: 'searchTime',
        width: '15%'
      },
      {
        title: 'Consumer Type',
        dataIndex: 'consumerType',
        key: 'consumerType',
        width: '15%'
      },
      {
        title: 'Consumer Account',
        dataIndex: 'consumerAccount',
        key: 'consumerAccount',
        width: '15%'
      },
      {
        title: 'Consumer Name',
        dataIndex: 'consumerName',
        key: 'consumerName',
        width: '15%'
      }
    ];
    if (type === 'all') {
      columns.push({
        title: 'Result No.',
        dataIndex: 'resultNo',
        key: 'resultNo',
        width: '15%'
      });
    }
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline title={title} />
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={styles.label}>Consumer account</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'productFinderNumber',
                        value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <RangePicker
                    renderExtraFooter={() => 'extra footer'}
                    onChange={(value) => {
                      this.onFormChange({
                        field: 'DateRange',
                        value: value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon="search"
                    shape="round"
                    onClick={(e) => {
                      e.preventDefault();
                      this.getSearchResultDetails();
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
          <Table rowKey="id" columns={columns} dataSource={searchResultDetails} pagination={pagination} loading={loading} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
        </div>
      </div>
    );
  }
}
const styles = {
  label: {
    width: 130,
    textAlign: 'center'
  },
  wrapper: {
    width: 157
  }
} as any;
