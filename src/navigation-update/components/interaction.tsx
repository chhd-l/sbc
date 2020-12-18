import React from 'react';
import { Form, Input, message, Radio, Select, Tree, TreeSelect, Row , Col  } from 'antd';
import * as webapi from '../webapi';
import { util } from 'qmkit';
import Upload from './upload';
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
      sortList: [],
      example: 'Example: ${product name}-${product SPU}'
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
    this.setImageUrl = this.setImageUrl.bind(this);
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
          let activeFilters = res.context.filter((x) => x.filterStatus === '1');
          activeFilters.map((item) => {
            let childrenNodes = [];
            let hasCustmerAttribute = item.storeGoodsFilterValueVOList && item.storeGoodsFilterValueVOList.length > 0;
            let hasAttribute = item.attributesValueList && item.attributesValueList.length > 0;
            if (hasCustmerAttribute || hasAttribute) {
              let valuesList = hasCustmerAttribute ? item.storeGoodsFilterValueVOList : hasAttribute ? item.attributesValueList : [];
              childrenNodes = valuesList.map((child) => {
                return {
                  title: child.attributeDetailName,
                  titleEn: child.attributeDetailNameEn,
                  value: child.id,
                  key: child.id,
                  isSingle: item.choiceStatus === 'Single choice',
                  filterType: item.filterType, // 1 is Custmered
                  parentId: hasAttribute ? item.attributeId : item.id
                };
              });
              filterList.push({
                title: item.attributeName,
                attributeName: item.attributeName,
                value: hasAttribute ? item.attributeId : item.id,
                key: hasAttribute ? item.attributeId : item.id,
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
    this.clearFields(['navigationCateIds', 'keywords', 'filter', 'searchSort', 'paramsField']);
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
      let children = selectChildren.filter((x) => x.parentId === item);
      let childValues = children.map((x) => x.value);
      let childTitles = children.map((x) => x.titleEn);
      let parent = this.state.filterList.find((x) => x.value === item);
      if (children.length === 0) {
        return;
      }
      let selectFilter = { attributeId: item, attributeName: parent && parent.attributeName ? parent.attributeName : '', filterType: children[0].filterType, attributeValues: childTitles, attributeValueIdList: childValues };
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
    let selectFilters = filterObject && filterObject.indexOf('{') > -1 ? JSON.parse(filterObject) : [];
    selectFilters.map((x) => {
      if (x.attributeValueIdList) {
        x.attributeValueIdList.map((v) => {
          filterValues.push(v);
        });
      }
    });
    return filterValues;
  }
  setImageUrl(url) {
    this.props.addField('pageImg', url);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { navigation, noLanguageSelect } = this.props;
    const { pageList, interaction, pageTypeCode, treeData, filterList, sortList, example } = this.state;
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
                    initialValue: pageList && pageList.length > 0 ? navigation.pageId : null,
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
                  <div>
                    <FormItem {...layout} label="Sales Category">
                      {getFieldDecorator('navigationCateIds', {
                        initialValue: defaultCategoryIds,
                        rules: [{ required: true, message: 'Please select sales category' }]
                      })(<TreeSelect {...tProps} />)}
                    </FormItem>
                    <FormItem {...layout} label="Page Title">
                      {getFieldDecorator('pageTitle', {
                        initialValue: navigation.pageTitle
                      })(
                        <Input
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.props.addField('pageTitle', value);
                          }}
                        />
                      )}
                    </FormItem>
                    <FormItem {...layout} label="Page Description">
                      {getFieldDecorator('pageDesc', {
                        initialValue: navigation.pageDesc
                      })(
                        <Input.TextArea
                          autoSize={{ minRows: 3, maxRows: 5 }}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.props.addField('pageDesc', value);
                          }}
                        />
                      )}
                    </FormItem>
                    <Row>
                      <Col span={4}>
                        <div className="uploadTip">Recommened size：800*800px the size of a single sheet does not exceed 2M，and the maximum sheets is 10</div>
                      </Col>
                    </Row>
                    <FormItem {...layout} label="Page Picture">
                      <Upload form={this.props.form} setUrl={this.setImageUrl} defaultValue={navigation.pageImg} />
                    </FormItem>
                  </div>
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
                    <span className="tip ant-form-item-required">{example}</span>
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
