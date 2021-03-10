import React, { Component } from 'react';
import { Form, Row, Col, Input, Radio, TimePicker, DatePicker, InputNumber, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

export default class ChooseIfElseForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      conditionList: [{ id: 1, tableName: undefined, colName: undefined, selOp: undefined, colValue: '', linkOp: '', valueSelect: [], valueType: 'text' }],
      types: [
        { name: 'Order', value: 'order' },
        { name: 'Contact', value: 'contact' },
        { name: 'Pet', value: 'pet' }
      ],
      fileds: [],
      conditionTypes: [
        { key: 'empty', name: 'Empty' },
        { key: 'notEmpty', name: 'Not empty' },
        { key: 'equals', name: 'Equals' },
        { key: 'notEquals', name: 'Not equals' },
        { key: 'greaterThan', name: 'Greater than' },
        { key: 'lessThan', name: 'Less than' },
        { key: 'like', name: 'Like' },
        { key: 'notLike', name: 'Not like' },
        { key: 'greaterThanOrEquals', name: 'Greater than or equals' },
        { key: 'lessThanOrEquals', name: 'Less than or equals' }
      ],
      style: {
        fontSize: '10px'
      },
      orderNoSelect: [
        { name: 1, value: 1 },
        { name: 2, value: 2 },
        { name: 3, value: 3 },
        { name: 4, value: 4 },
        { name: 5, value: 5 },
        { name: 6, value: 6 },
        { name: 7, value: 7 },
        { name: 8, value: 8 },
        { name: 9, value: 9 },
        { name: 10, value: 10 },
        { name: 11, value: 11 },
        { name: 12, value: 12 }
      ],
      judgeSelect: [
        { name: 'True', value: 'True' },
        { name: 'False', value: 'False' }
      ],
      mouths: 'Month(s)',
      orderFeildDict: [],
      contactFeildDict: [],
      petFeildDict: []
    };
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    const { conditionData } = this.props;
    if (conditionData && conditionData.length > 0) {
      this.setState(
        {
          conditionList: conditionData
        },
        () =>
          this.state.conditionList.forEach((ele) => {
            this.dropdownChange(ele.tableName);
          })
      );
    }
  }
  onChange(field, value, id) {
    const { conditionList } = this.state;
    conditionList.map((item) => {
      if (item.id === id) {
        item[field] = value;
        if (field === 'tableName') {
          item.colName = undefined;
          item.selOp = undefined;
          item.colValue = undefined;
        }
      }
    });
    this.setState(
      {
        conditionList
      },
      () => this.updateParentValue()
    );
  }
  updateParentValue() {
    const { updateValue } = this.props;
    const { conditionList } = this.state;
    updateValue('conditionDataList', conditionList);
  }

  radioChangeStyle(link, linkType) {
    if (link === linkType) {
      return 'green';
    }
  }

  addCondidtion(id) {
    const { conditionList } = this.state;
    let ids = conditionList.map((x) => x.id);
    let maxId = Math.max(...ids);
    let condition = { id: maxId + 1, tableName: undefined, colName: undefined, selOp: undefined, colValue: '', linkOp: 'And', valueSelect: [] };
    conditionList.push(condition);
    this.setState({
      conditionList
    });
  }

  deleteCondition(id) {
    const { conditionList } = this.state;
    let newConditionList = conditionList.filter((x) => x.id !== id);
    this.setState({
      conditionList: newConditionList
    });
  }

  typeChange(condition) {
    condition.colName = undefined;
    condition.selOp = undefined;
    condition.colValue = undefined;
  }
  dropdownChange(tableName) {
    const { orderFeildDict, contactFeildDict, petFeildDict } = this.state;
    switch (tableName ? tableName.toLowerCase() : '') {
      case 'order':
        this.setState({
          fileds: orderFeildDict
        });
        break;
      case 'contact':
        this.setState({
          fileds: contactFeildDict
        });
        break;
      case 'pet':
        this.setState({
          fileds: petFeildDict
        });
        break;
    }
  }
  colNameChange(condition) {
    const { conditionList } = this.state;
    const { orderNoSelect, orderProductTypesDict, judgeSelect, businessTypeDict, channelTypeDict } = this.state;
    const { orderStatusDict, genderDict, clubNameDict, breedDict, countryDict } = this.state;
    const colName = condition.colName;
    let tmpType;
    let tmpArr = [];
    switch (colName) {
      case 'orderSequence':
      case 'consecutive':
        tmpArr = orderNoSelect;
        break;
      case 'preProductCategory':
      case 'productCategory':
        tmpArr = orderProductTypesDict;
        break;
      case 'switchedProduct':
      case 'firstRefillAfter':
      case 'sterillizationStatus':
      case 'subscriptionStatus':
        tmpArr = judgeSelect;
        break;
      case 'businessType':
        tmpArr = businessTypeDict;
        break;
      case 'channelType':
        tmpArr = channelTypeDict;
        break;
      case 'orderStatus':
        tmpArr = orderStatusDict;
        break;
      case 'gender':
        tmpArr = genderDict;
        break;
      case 'clubName':
        tmpArr = clubNameDict;
        break;
      case 'pedigreeName':
        tmpArr = breedDict.sort((a, b) => {
          return a.name.charCodeAt(0) - b.name.charCodeAt(0);
        });
        break;
      case 'primaryCountry':
        tmpArr = countryDict.sort((a, b) => {
          return a.name.charCodeAt(0) - b.name.charCodeAt(0);
        });
        break;
    }

    switch (colName) {
      case 'intervalDay':
      case 'petAge':
      case 'petId':
      case 'orderno':
      case 'petOwnerId':
      default:
        tmpType = 'text';
    }

    conditionList.map((item) => {
      if (item.id === condition.id) {
        item.valueType = tmpType;
        item.valueSelect = tmpArr;
        item.colValue = undefined;
      }
    });

    this.setState({ conditionList });
  }
  render() {
    const { conditionList, types, fileds, conditionTypes, mouths } = this.state;
    return (
      <React.Fragment>
        <FormItem label="Set Conditions" colon={false}>
          {conditionList.map((condition) => (
            <Row key={condition.id}>
              {condition.linkOp ? (
                <Row gutter={0}>
                  <Col span={8}>
                    <Radio.Group
                      size="small"
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onChange('linkOp', value, condition.id);
                      }}
                      value={condition.linkOp}
                      className="linkStyle"
                    >
                      <Radio.Button value="And" style={{ backgroundColor: this.radioChangeStyle(condition.linkOp, 'And') }}>
                        And
                      </Radio.Button>
                      <Radio.Button value="Or" style={{ backgroundColor: this.radioChangeStyle(condition.linkOp, 'Or') }}>
                        Or
                      </Radio.Button>
                    </Radio.Group>
                  </Col>
                  <Col span={5}>
                    <span className="user-select-none item-icon iconfont iconDelete" style={{ color: 'red', fontSize: '18px' }} onClick={() => this.deleteCondition(condition.id)} />
                  </Col>
                </Row>
              ) : null}

              <Row gutter={5}>
                <Col span={4}>
                  <Select
                    onChange={(value) => {
                      this.onChange('tableName', value, condition.id);
                    }}
                    placeholder="Table"
                    value={condition.tableName}
                    size="small"
                    dropdownMatchSelectWidth={false}
                    style={{ fontSize: '10px' }}
                  >
                    {types.map((item) => (
                      <Option value={item.value} key={item.value}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <Select
                    onChange={(value) => {
                      this.onChange('colName', value, condition.id);
                      this.colNameChange(condition);
                    }}
                    placeholder="Field"
                    value={condition.colName}
                    size="small"
                    style={{ fontSize: '10px' }}
                    dropdownMatchSelectWidth={false}
                    onDropdownVisibleChange={() => this.dropdownChange(condition.tableName)}
                  >
                    {fileds.map((item) => (
                      <Option value={item.value} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <Select
                    onChange={(value) => {
                      this.onChange('selOp', value, condition.id);
                    }}
                    placeholder="Condition"
                    value={condition.selOp}
                    size="small"
                    style={{ fontSize: '10px' }}
                  >
                    {conditionTypes.map((item) => (
                      <Option value={item.key} key={item.key}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                {condition.valueSelect && condition.valueSelect.length > 0 ? (
                  <Col span={6}>
                    <Select
                      onChange={(value) => {
                        this.onChange('colValue', value, condition.id);
                      }}
                      placeholder="Value"
                      value={condition.colValue}
                      size="small"
                      dropdownMatchSelectWidth={false}
                      style={{ fontSize: '10px' }}
                    >
                      {condition.valueSelect.map((item) => (
                        <Option value={item.value} key={item.value}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                ) : (
                  <Col span={6} className="conditionValue">
                    <Input
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onChange('colValue', value, condition.id);
                      }}
                      type={condition.valueType}
                      placeholder="Value"
                      size="small"
                      style={{ fontSize: '10px' }}
                      value={condition.colValue}
                      suffix={condition.colName === 'petAge' ? mouths : ''}
                    />
                  </Col>
                )}

                <Col span="2">
                  <span className="user-select-none item-icon icon iconfont iconbianzu9" onClick={() => this.addCondidtion(condition.id)} />
                </Col>
              </Row>
            </Row>
          ))}
        </FormItem>
      </React.Fragment>
    );
  }
}
