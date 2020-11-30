import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin, Alert, InputNumber, Tabs } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

class PeoductCategory extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Product category',
      currentId: '',
      visible: false,
      productCategoryList: [],
      selectedRowKeys: [],
      attributeList: [],
      confirmLoading: false,
      pagination: {
        current: 1,
        pageSize: 8,
        total: 0
      },
      searchForm: {
        attributeName: '',
        attributeValue: ''
      }
    };
  }
  componentDidMount() {
    this.getGoodsCates();
  }
  removeChildrenIsNull = (objArr) => {
    let tempString = JSON.stringify(objArr);
    let returnString = tempString.replaceAll(',"children":[]', '');
    return JSON.parse(returnString);
  };
  openBindAttribute = (id) => {
    this.setState(
      {
        currentId: id,
        pagination: {
          current: 1,
          pageSize: 8,
          total: 0
        },
        searchForm: {
          attributeName: '',
          attributeValue: ''
        }
      },
      () => this.getAttributes()
    );
    this.getSelectedListById(id);
  };
  handleOk = () => {
    this.setState({
      confirmLoading: true
    });
    this.relationAttributes();
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  getAttributes = () => {
    const { pagination, searchForm } = this.state;
    let params = {
      attributeName: searchForm.attributeName,
      attributeValue: searchForm.attributeValue,
      attributeStatus: true,
      pageSize: pagination.pageSize,
      pageNum: pagination.current - 1
    };
    webapi
      .getAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          pagination.total = res.context.total;
          const attributeList = res.context.attributesList;
          this.setState({ attributeList, pagination });
        } else {
          message.error(res.message || 'Operation failed');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failed');
      });
  };

  getGoodsCates = () => {
    webapi.getGoodsCates().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.init(res.context);
      }
    });
  };
  init(cates) {
    console.log(cates.filter((item) => item.cateParentId == 0));

    const newDataList = cates
      .filter((item) => item.cateParentId == 0)
      .map((data) => {
        const children = cates
          .filter((item) => item.cateParentId == data.cateId)
          .map((childrenData) => {
            const lastChildren = cates
              .filter((item) => item.cateParentId == childrenData.cateId)
              .sort((c1, c2) => {
                return c1.sort - c2.sort;
              });
            if (lastChildren.length > 0) {
              childrenData.children = lastChildren;
            }
            return childrenData;
          })
          .sort((c1, c2) => {
            return c1.sort - c2.sort;
          });
        if (children.length > 0) {
          data.children = children;
        }
        return data;
      })
      .sort((c1, c2) => {
        return c1.sort - c2.sort;
      });
    this.setState({
      productCategoryList: newDataList
    });
  }

  start = () => {
    this.setState({
      selectedRowKeys: []
    });
  };
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  getSelectedListById = (id) => {
    webapi.getSelectedListById(id).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let selectedRows = res.context;
        let selectedRowKeys = [];
        for (let i = 0; i < selectedRows.length; i++) {
          selectedRowKeys.push(selectedRows[i].id);
        }
        this.setState({
          selectedRowKeys,
          visible: true
        });
      }
    });
  };
  relationAttributes = () => {
    const { currentId, selectedRowKeys } = this.state;
    let params = {
      attributesIdList: selectedRowKeys,
      goodsCateId: currentId
    };
    webapi
      .relationAttributes(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
          this.setState({
            visible: false,
            confirmLoading: false
          });
        } else {
          this.setState({
            confirmLoading: false
          });
          message.error(res.message || 'Operate failed');
        }
      })
      .catch((err) => {
        this.setState({
          confirmLoading: false
        });
        message.error(err.toString() || 'Operate failed');
      });
  };
  getAttributeValue = (attributeValueList) => {
    let attributeValue = [];
    for (let i = 0; i < attributeValueList.length; i++) {
      attributeValue.push(attributeValueList[i].attributeDetailName);
    }
    return attributeValue.join(';');
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };
  onSearch = () => {
    this.setState(
      {
        pagination: {
          current: 1,
          pageSize: 8,
          total: 0
        }
      },
      () => this.getAttributes()
    );
  };

  render() {
    const { title, productCategoryList, selectedRowKeys, confirmLoading, attributeList, searchForm } = this.state;
    const columns = [
      {
        title: 'Category name',
        dataIndex: 'cateName',
        key: 'cateName'
      },
      {
        title: 'Category images',
        dataIndex: 'cateImg',
        key: 'cateImg',
        render: (text) => <div>{text ? <img src={text} alt="" style={{ width: 30 }} /> : '-'}</div>
      },
      {
        title: 'Operation',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <div>
            {record.cateGrade === 3 ? (
              <Tooltip placement="topLeft" title="Bind attribute">
                <a style={styles.edit} className="iconfont iconbtn-addsubvisionsaddcategory" onClick={() => this.openBindAttribute(record.cateId)}></a>
              </Tooltip>
            ) : (
              '-'
            )}
          </div>
        )
      }
    ];
    const columns_attribute = [
      {
        title: 'Attribute name',
        dataIndex: 'attributeName',
        key: 'attributeName'
      },
      {
        title: 'Attribute value',
        dataIndex: 'attributeValue',
        key: 'attributeValue',
        width: '30%',
        render: (text, record) => <p>{record.attributesValuesVOList ? this.getAttributeValue(record.attributesValuesVOList) : ''}</p>
      }
    ];
    const description = (
      <div>
        <p>Product category is set by RC staff, you can associate attribute to product category.</p>
      </div>
    );

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <Alert message={description} type="info" />

          <Table rowKey="cateId" columns={columns} dataSource={this.removeChildrenIsNull(productCategoryList)} style={{marginRight:10}} />
        </div>
        <Modal title="Bind attribute" width="800px" visible={this.state.visible} confirmLoading={confirmLoading} onOk={this.handleOk} onCancel={this.handleCancel}>
          <div>
            <div style={{ marginBottom: 16 }}>
              <Form className="filter-content" layout="inline">
                <Row>
                  <Col span={10}>
                    <FormItem>
                      <Input
                        addonBefore={<p style={styles.label}>Attribute name</p>}
                        value={searchForm.attributeName}
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onFormChange({
                            field: 'attributeName',
                            value
                          });
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={10}>
                    <FormItem>
                      <Input
                        addonBefore={<p style={styles.label}>Attribute value</p>}
                        value={searchForm.attributeValue}
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onFormChange({
                            field: 'attributeValue',
                            value
                          });
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={4} style={{ textAlign: 'center' }}>
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

              <Button type="primary" onClick={this.start} disabled={!hasSelected}>
                Reload
              </Button>
              <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
            </div>
            <Table rowKey="id" rowSelection={rowSelection} columns={columns_attribute} dataSource={attributeList} />
          </div>
        </Modal>
      </div>
    );
  }
}
const styles = {} as any;

export default Form.create()(PeoductCategory);
