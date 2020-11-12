import React, { Component } from 'react';
import { Alert, Col, Form, Input, message, Modal, Radio, Row, Select, Tree, TreeSelect } from 'antd';
import * as webapi from '../webapi';
import { util } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;
const { SHOW_PARENT } = TreeSelect;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 }
};

export default class Interaction extends React.Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      interaction: 0,
      pageList: [],
      // Product List Page --PLP
      // Product Detail Page -- PDP
      // Search Results Page--SRP
      // Subscription Page --SP
      // Contact Us Page--CUP
      // Home Page--HP
      pageTypeCode: 'PLP',
      defaultPageId: null,
      treeData: [],
      filterList: [],
      sortList: []
    };
    this.getPageTypes = this.getPageTypes.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getFilters = this.getFilters.bind(this);
    this.getSorts = this.getSorts.bind(this);

    this.radioChange = this.radioChange.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.onSalesCategoryChange = this.onSalesCategoryChange.bind(this);
  }

  componentDidMount() {
    this.props.addField('interaction', this.state.interaction);
    this.getPageTypes();
    this.getCategories();
    this.getFilters();
    this.getSorts();
  }

  getPageTypes() {
    webapi
      .querySysDictionary({ type: 'pageType' })
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let pageList = res.context.sysDictionaryVOS;
          let defaultPage = pageList.find((x) => x.valueEn === 'PLP');
          this.setState({
            pageList,
            defaultPageId: defaultPage ? defaultPage.id : null
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch((err) => {
        message.error('Get data failed');
      });
  }
  getCategories() {
    webapi
      .getCategories()
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let source = res.context.map((item) => {
            return {
              id: item.storeCateId,
              title: item.cateName,
              value: item.storeCateId,
              parentId: item.cateParentId === 0 ? null : item.cateParentId,
              key: item.storeCateId
            };
          });
          let treeData = util.setChildrenData(source);
          this.setState({
            treeData
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch((err) => {
        message.error('Get data failed');
      });
  }
  getFilters() {
    webapi
      .getFilters()
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let filterList = res.context.map((item) => {
            return {
              id: item.id,
              name: item.attributeName
            };
          });
          this.setState({
            filterList
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch((err) => {
        message.error('Get data failed');
      });
  }
  getSorts() {
    webapi
      .getSorts()
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let sortList = res.context.map((item) => {
            return {
              id: item.id,
              name: item.sortName
            };
          });
          this.setState({
            sortList
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch((err) => {
        message.error('Get data failed');
      });
  }

  radioChange(e) {
    this.props.addField('interaction', e.target.value);
    this.setState({
      interaction: e.target.value
    });
  }
  pageChange(value) {
    value = value === '' ? null : value;
    this.props.addField('pageId', value);
    let selectPage = this.state.pageList.find((x) => x.id === value);
    if (selectPage) {
      this.setState({
        pageTypeCode: selectPage.valueEn
      });
    }
  }
  onSalesCategoryChange = (value) => {
    this.props.addField('navigationCateIds', value.join(','));
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { navigation } = this.props;
    const { pageList, interaction, defaultPageId, pageTypeCode, treeData, filterList, sortList } = this.state;
    const targetList = ['_blank', '_self', '_parent', '_top', 'framename'];
    const tProps = {
      treeData,
      value: navigation.navigationCateIds ? navigation.navigationCateIds.split(',') : [],
      onChange: this.onSalesCategoryChange,
      treeCheckable: true,
      searchPlaceholder: 'Please select',
      style: {
        width: '100%'
      }
    };
    return (
      <div>
        <h3>Step3</h3>
        <h4>
          Interaction Type<span className="ant-form-item-required"></span>
        </h4>
        <div className="interaction">
          <Form>
            <FormItem>
              <Radio.Group onChange={this.radioChange} size="large" defaultValue={interaction}>
                <Radio value={0}>Page</Radio>
                <Radio value={1}>External URL</Radio>
                <Radio value={2}>Text</Radio>
              </Radio.Group>
            </FormItem>
            {interaction === 0 ? (
              <div>
                <FormItem {...layout} label="Page">
                  {getFieldDecorator('pageId', {
                    initialValue: navigation.pageId ? navigation.pageId : defaultPageId,
                    rules: [{ required: true, message: 'Please select page' }]
                  })(
                    <Select onChange={this.pageChange}>
                      {pageList &&
                        pageList.map((item, index) => (
                          <Option value={item.id} key={index}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
                {pageTypeCode === 'PLP' ? (
                  <FormItem {...layout} label="Sales Category">
                    {getFieldDecorator('navigationCateIds', {
                      initialValue: navigation.navigationCateIds,
                      rules: [{ required: true, message: 'Please select sales category' }]
                    })(<TreeSelect {...tProps} />)}
                  </FormItem>
                ) : null}
                {pageTypeCode === 'SRP' ? (
                  <FormItem {...layout} label="Keywords">
                    {getFieldDecorator('keywords', {
                      initialValue: navigation.keywords,
                      rules: [{ required: true, message: 'Please input keywords' }]
                    })(
                      <Input
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.props.addField('keywords', value);
                        }}
                      />
                    )}
                  </FormItem>
                ) : null}

                {pageTypeCode === 'SRP' || pageTypeCode === 'PLP' ? (
                  <div>
                    <FormItem {...layout} label="Filter">
                      {getFieldDecorator('filter', {
                        initialValue: navigation.filter ? navigation.filter.split(',') : []
                      })(
                        <Select
                          mode="multiple"
                          onChange={(value: any) => {
                            this.props.addField('filter', value.join(','));
                          }}
                        >
                          {filterList.map((item, index) => (
                            <Option value={item.id} key={index}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem {...layout} label="Sort">
                      {getFieldDecorator('searchSort', {
                        initialValue: navigation.searchSort ? navigation.searchSort.split(',') : []
                      })(
                        <Select
                          mode="multiple"
                          onChange={(value: any) => {
                            this.props.addField('searchSort', value.join(','));
                          }}
                        >
                          {sortList.map((item, index) => (
                            <Option value={item.id} key={index}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </div>
                ) : (
                  <FormItem {...layout} label="Paramter">
                    {getFieldDecorator('paramsField', {
                      initialValue: navigation.paramsField
                    })(
                      <Input.TextArea
                        autoSize={{ minRows: 8, maxRows: 10 }}
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.props.addField('paramsField', value);
                        }}
                      />
                    )}
                  </FormItem>
                )}
              </div>
            ) : null}
            {interaction === 1 ? (
              <FormItem {...layout} label="Target">
                {getFieldDecorator('target', {
                  initialValue: navigation.target ? navigation.target : ''
                })(
                  <Select
                    allowClear
                    onChange={(value) => {
                      value = value === '' ? null : value;
                      this.props.addField('target', value);
                    }}
                  >
                    {targetList.map((item, index) => (
                      <Option value={item} key={index}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            ) : null}
          </Form>
        </div>
      </div>
    );
  }
}
