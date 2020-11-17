import React, { Component } from 'react';
import classNames from 'classnames';
import { BreadCrumb, SelectGroup, history, Const, Headline } from 'qmkit';
import { Form, Row, Col, Select, Input, Button, message, Tooltip, Divider, Table } from 'antd';
import { Link } from 'react-router-dom';
import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

class ProductFinderList extends Component<any, any> {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      title: 'Product Finder List',
      searchForm: {},
      productFinderList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      consumerTypeList: [
        { name: 'Member', value: 0 },
        { name: 'Guest', value: 1 }
      ],
      petTypeList: []
    };
    // 事先声明方法绑定
    this.handleTableChange = this.handleTableChange.bind(this);
    this.getProductFinderList = this.getProductFinderList.bind(this);
  }

  componentDidMount() {
    this.getProductFinderList();
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  handleTableChange = (pagination: any) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getProductFinderList()
    );
  };
  onSearch = () => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      () => this.getProductFinderList()
    );
  };
  getProductFinderList = () => {
    const { searchForm, pagination } = this.state;
    let params = Object.assign(searchForm, {
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    });
    this.setState({
      loading: true
    });
    webapi
      .getProductFinderList(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          this.setState({
            productFinderList: res.context.detailsList,
            petTypeList: res.context.petTypeList,
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
  };
  render() {
    const { title, productFinderList, consumerTypeList, petTypeList } = this.state;
    const columns = [
      {
        title: 'Image',
        dataIndex: 'productImage',
        key: 'productImage',
        width: '10%',
        render: (text, record) => (text ? <img style={styles.tableImage} src={text} alt="Image" /> : null)
      },
      {
        title: 'Product Finder Number',
        dataIndex: 'finderNumber',
        key: 'finderNumber',
        width: '15%'
      },
      {
        title: 'Product Name',
        dataIndex: 'productName',
        key: 'productName',
        width: '10%'
      },
      {
        title: 'Consumer account',
        dataIndex: 'consumerAccount',
        key: 'consumerAccount',
        width: '10%'
      },
      {
        title: 'Consumer Type',
        dataIndex: 'consumerType',
        key: 'consumerType',
        width: '10%'
      },
      {
        title: 'Order Number',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
        width: '10%'
      },
      {
        title: 'Pet Type',
        dataIndex: 'petType',
        key: 'petType',
        width: '10%'
      },
      {
        title: 'Operation',
        key: 'operation',
        width: '8%',
        render: (text, record) => (
          <div>
            <Tooltip placement="top" title="Details">
              <Link to={'/product-finder-details/' + record.finderNumber} className="iconfont iconDetails"></Link>
            </Tooltip>
          </div>
        )
      }
    ];
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
                    addonBefore={<p style={styles.label}>Product finder number</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'finderNumber',
                        value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={<p style={styles.label}>Product name</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'productName',
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
                    label={<p style={styles.label}>Consumer type</p>}
                    style={{ width: 195 }}
                    onChange={(value) => {
                      value = value === '' ? null : value;
                      this.onFormChange({
                        field: 'consumerType',
                        value
                      });
                    }}
                  >
                    <Option value="">
                      <FormattedMessage id="all" />
                    </Option>
                    {consumerTypeList &&
                      consumerTypeList.map((item, index) => (
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
                  <Input
                    addonBefore={<p style={styles.label}>Consumer account</p>}
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
                  <SelectGroup
                    defaultValue=""
                    label={<p style={styles.label}>Pet type</p>}
                    style={{ width: 195 }}
                    onChange={(value) => {
                      value = value === '' ? null : value;
                      this.onFormChange({
                        field: 'petType',
                        value
                      });
                    }}
                  >
                    <Option value="">
                      <FormattedMessage id="all" />
                    </Option>
                    {petTypeList &&
                      petTypeList.map((item, index) => (
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
                    addonBefore={<p style={styles.label}>Order number</p>}
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.onFormChange({
                        field: 'orderNumber',
                        value
                      });
                    }}
                  />
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
          <Table rowKey="id" columns={columns} dataSource={productFinderList} pagination={this.state.pagination} loading={this.state.loading} scroll={{ x: '100%' }} onChange={this.handleTableChange} />
        </div>
      </div>
    );
  }
}

export default ProductFinderList;

const styles = {
  label: {
    width: 130,
    textAlign: 'center'
  },
  wrapper: {
    width: 157
  },
  tableImage: {
    width: '60px',
    height: '60px',
    padding: '5px',
    border: '1px solid rgb(221, 221, 221)',
    background: 'rgb(255, 255, 255)'
  }
} as any;
