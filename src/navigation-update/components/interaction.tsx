import React from 'react';
import { Form, Input, message, Radio, Select, Tree, TreeSelect } from 'antd';
import * as webapi from '../webapi';
import { util } from 'qmkit';
const { SHOW_PARENT } = TreeSelect;

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

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
      interaction: null,
      pageList: [],
      // Product List Page --PLP
      // Product Detail Page -- PDP
      // Search Results Page--SRP
      // Subscription Page --SP
      // Contact Us Page--CUP
      // Home Page--HP
      pageTypeCode: '',
      treeSource: [],
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
    this.clearFields = this.clearFields.bind(this);
    this.getAllChildredIds = this.getAllChildredIds.bind(this);
    this.generateFilterTree = this.generateFilterTree.bind(this);
    this.filterChange = this.filterChange.bind(this);
    this.getFilterValues = this.getFilterValues.bind(this);
  }

  componentDidMount() {
    let defaultInteraction = this.props.navigation.interaction ? this.props.navigation.interaction : 0;
    this.setState({
      interaction: defaultInteraction
    });
    this.props.addField('interaction', defaultInteraction);
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
          this.setState({
            pageList
          });
          let selectPage = pageList.find((x) => x.id === this.props.navigation.pageId);
          if (selectPage) {
            this.setState({
              pageTypeCode: selectPage.valueEn
            });
          }
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });
  }
  getCategories() {
    webapi
      .getCategories()
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let treeSource = res.context.map((item) => {
            return {
              id: item.storeCateId,
              title: item.cateName,
              value: item.storeCateId,
              parentId: item.cateParentId === 0 ? null : item.cateParentId,
              key: item.storeCateId
            };
          });
          let treeData = util.setChildrenData(treeSource);
          this.setState({
            treeSource,
            treeData
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });
  }
  getFilters() {
    webapi
      .getFilters()
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let filterList = [];
          res.context.map((item) => {
            let childrenNodes = [];
            let hasCustmerAttribute = item.storeGoodsFilterValueVOList && item.storeGoodsFilterValueVOList.length > 0;
            let hasAttribute = item.attributesValueList && item.attributesValueList.length > 0;
            if (hasCustmerAttribute || hasAttribute) {
              let valuesList = hasCustmerAttribute ? item.storeGoodsFilterValueVOList : hasAttribute ? item.attributesValueList : [];
              childrenNodes = valuesList.map((child) => {
                return {
                  title: child.attributeDetailName,
                  value: child.id,
                  key: child.id,
                  isSingle: item.choiceStatus === 'Single choice',
                  parentId: item.id
                };
              });
              filterList.push({
                title: item.attributeName,
                value: item.id,
                key: item.id,
                children: childrenNodes
              });
            }
            return item;
          });
          this.setState({
            filterList
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
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
      .catch(() => {
        message.error('Get data failed');
      });
  }

  radioChange(e) {
    let value = e.target.value;
    this.props.addField('interaction', value);
    this.setState({
      interaction: value
    });
    if (value === 0) {
      this.clearFields(['target']);
    }

    if (value === 1) {
      this.clearFields(['pageId', 'navigationCateIds', 'keywords', 'filter', 'searchSort', 'paramsField']);
    }

    if (value === 2) {
      this.clearFields(['target']);
      this.clearFields(['pageId', 'navigationCateIds', 'keywords', 'filter', 'searchSort', 'paramsField']);
    }
  }

  clearFields(fields) {
    fields.map((item) => {
      this.props.addField(item, null);
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
    let treeLowestIds = [];
    value.map((item) => {
      let childrenIds = this.getAllChildredIds(item, []);
      treeLowestIds.push(childrenIds);
      return item;
    });
    this.props.addField('navigationCateIds', treeLowestIds.join(','));
  };
  getAllChildredIds(id, chilidrenIds) {
    let children = this.state.treeSource.filter((x) => x.parentId === id);
    if (children && children.length > 0) {
      children.map((x) => {
        this.getAllChildredIds(x.id, chilidrenIds);
      });
    } else {
      chilidrenIds.push(id);
    }
    return chilidrenIds;
  }

  filterChange(filterValues) {
    let allChildrenList = [];
    this.state.filterList.map((x) => {
      x.children.map((c) => allChildrenList.push(c));
    });
    let selectChildren = allChildrenList.filter((x) => filterValues.includes(x.value));
    let allParentIds = [...new Set(selectChildren.map((x) => x.parentId))]; // remove repect item
    let selectFilterList = [];
    allParentIds.map((item) => {
      let childrenIds = selectChildren.filter((x) => x.parentId === item).map((x) => x.value);
      let selectFilter = { parentId: item, values: childrenIds };
      selectFilterList.push(selectFilter);
    });
    let selectFilterListString = JSON.stringify(selectFilterList);
    this.props.addField('filter', selectFilterListString);
    this.generateFilterTree(this.state.filterList);
  }

  generateFilterTree(filterList) {
    return (
      filterList &&
      filterList.map((item) => {
        let parentItem = this.state.filterList.find((x) => x.value === item.parentId);
        let childrenIds = parentItem ? parentItem.children.map((x) => x.value) : [];
        let selectedFilters = this.getFilterValues(this.props.navigation.filter);
        let intersection = childrenIds.filter((v) => selectedFilters.includes(v));
        let singleDisabled = item.isSingle && intersection.length > 0 && item.value != intersection[0];
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode key={'parent' + item.key} value={'partent' + item.value} title={item.title} disabled checkable={false}>
              {this.generateFilterTree(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} value={item.value} title={item.title} disabled={singleDisabled} />;
      })
    );
  }
  getFilterValues(filterObject) {
    let filterValues = [];
    let selectFilters = filterObject.indexOf('{') > -1 ? JSON.parse(filterObject) : [];
    selectFilters.map((x) => {
      x.values.map((v) => {
        filterValues.push(v);
      });
    });
    return filterValues;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { navigation, noLanguageSelect } = this.props;
    const { pageList, interaction, pageTypeCode, treeData, filterList, sortList } = this.state;
    const targetList = [
      { name: 'External', value: '_blank' },
      { name: 'Self', value: '_self' }
    ];
    let defaultCategoryIds = navigation.navigationCateIds ? navigation.navigationCateIds.split(',').map((x) => parseInt(x)) : [];
    const tProps = {
      treeData,
      value: defaultCategoryIds,
      onChange: this.onSalesCategoryChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select',
      style: {
        width: '100%'
      }
    };
    let defaultFilter = this.getFilterValues(navigation.filter);
    return (
      <div>
        <h3>{noLanguageSelect ? 'Step2' : 'Step3'}</h3>
        <h4>
          Interaction Type<span className="ant-form-item-required"></span>
        </h4>
        <div className="interaction">
          <Form>
            <FormItem>
              {getFieldDecorator('interaction', {
                initialValue: interaction
              })(
                <Radio.Group onChange={this.radioChange} size="large">
                  <Radio value={0}>Page</Radio>
                  <Radio value={1}>External URL</Radio>
                  <Radio value={2}>Text</Radio>
                </Radio.Group>
              )}
            </FormItem>
            {interaction === 0 ? (
              <div>
                <FormItem {...layout} label="Page">
                  {getFieldDecorator('pageId', {
                    initialValue: navigation.pageId,
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
                      initialValue: defaultCategoryIds,
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
                        initialValue: defaultFilter
                      })(
                        <TreeSelect
                          treeCheckable={true}
                          showCheckedStrategy={(TreeSelect as any).SHOW_ALL}
                          treeDefaultExpandAll
                          placeholder="Please select"
                          style={{ width: '100%' }}
                          onChange={(value: any) => {
                            this.filterChange(value);
                          }}
                        >
                          {this.generateFilterTree(filterList)}
                        </TreeSelect>
                      )}
                    </FormItem>
                    <FormItem {...layout} label="Sort">
                      {getFieldDecorator('searchSort', {
                        initialValue: navigation.searchSort
                      })(
                        <Select
                          onChange={(value: any) => {
                            this.props.addField('searchSort', value);
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
                ) : pageTypeCode !== '' ? (
                  <FormItem {...layout} label="Parameter">
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
                ) : null}
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
                      <Option value={item.value} key={index}>
                        {item.name}
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
