import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline, RCi18n } from 'qmkit';
import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table, DatePicker, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import SearchForm from 'web_modules/biz/selected-sku-modal/search-form';

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
      searchForm: {
        searchTerm: this.props.location.state ? this.props.location.state.searchTerm : '',
        startDate: this.props.location.state ? this.props.location.state.startDate : '',
        endDate: this.props.location.state ? this.props.location.state.endDate : ''
      },
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
    this.setState(
      {
        title: this.state.type === 'all' ? RCi18n({id:'Product.SearchResultDetails'}) : RCi18n({id:'Product.NoResultSearchDetails'})
      },
      () => this.getSearchResultDetails()
    );
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    if (field === 'dateRange') {
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

  onSearch() {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      () => this.getSearchResultDetails()
    );
  }

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
      .getSearchDetailData(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.totalElements;
          this.setState({
            searchResultDetails: res.context.searchDetailsViews,
            pagination: pagination,
            loading: false
          });
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  }

  render() {
    const { title, type, searchResultDetails, pagination, loading, searchForm } = this.state;
    let test = searchForm;
    const columns = [
      {
        title: <FormattedMessage id="Product.SearchNo"/>,
        dataIndex: 'searchNo',
        key: 'searchNo',
        width: '15%'
      },
      {
        title: <FormattedMessage id="Product.SearchTime"/>,
        dataIndex: 'searchTime',
        key: 'searchTime',
        width: '15%'
      },
      {
        title: <FormattedMessage id="PetOwner.ConsumerType"/>,
        dataIndex: 'consumerType',
        key: 'consumerType',
        width: '15%'
      },
      {
        title: <FormattedMessage id="PetOwner.ConsumerAccount"/>,
        dataIndex: 'consumerAccount',
        key: 'consumerAccount',
        width: '15%'
      },
      {
        title: <FormattedMessage id="PetOwner.ConsumerName"/>,
        dataIndex: 'consumerName',
        key: 'consumerName',
        width: '15%'
      }
    ];
    if (type === 'all') {
      columns.push({
        title: <FormattedMessage id="Product.TotalFound"/>,
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
                    addonBefore={<p style={styles.label} title={RCi18n({id:'PetOwner.ConsumerAccount'})}><FormattedMessage id="PetOwner.ConsumerAccount"/></p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'consumerAccount',
                        value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <RangePicker
                    defaultValue={[moment(searchForm.startDate), moment(searchForm.endDate)]}
                    onChange={(value) => {
                      this.onFormChange({
                        field: 'dateRange',
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
                      this.onSearch();
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
        <div className="bar-button">
          <Button onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="back" />}
          </Button>
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
