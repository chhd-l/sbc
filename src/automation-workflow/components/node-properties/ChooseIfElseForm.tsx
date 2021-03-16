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
      judgeSelect: [
        { name: 'Yes', value: 1 },
        { name: 'No', value: 0 }
      ],
      mouths: 'Month(s)',
      orderFeildDict: [
        { name: 'Order Status', value: 'orderStatus' },
        { name: 'Shipping Status', value: 'shippingStatus' },
        { name: 'Payment Status', value: 'paymentStatus' },
        { name: 'Order Type', value: 'orderType' }
      ],
      contactFeildDict: [
        { name: 'City', value: 'city' },
        { name: 'Postal Code', value: 'postalCode' },
        { name: 'Consumer Type', value: 'consumerType' }
      ],
      petFeildDict: [
        { name: 'Gender', value: 'gender' },
        { name: 'Category', value: 'category' },
        { name: 'Weight', value: 'weight' },
        { name: 'Age', value: 'age' },
        { name: 'Breed', value: 'breed' },
        { name: 'Sterilization Status', value: 'sterilizationStatus' },
        { name: 'Special Needs', value: 'specialNeeds' }
      ],
      orderStatusDict: [
        { name: 'Init', value: 'INIT' },
        { name: 'Groupon', value: 'GROUPON' },
        { name: 'Audit', value: 'AUDIT' },
        { name: 'Delivered Part', value: 'DELIVERED_PART' },
        { name: 'Delivered', value: 'DELIVERED' },
        { name: 'Confirmed', value: 'CONFIRMED' },
        { name: 'Completed', value: 'COMPLETED' },
        { name: 'Void', value: 'VOID' }
      ],
      shippingStatusDict: [
        { name: 'Not Yet Shipped', value: 'NOT_YET_SHIPPED' },
        { name: 'Shipped', value: 'SHIPPED' },
        { name: 'Part Shipped', value: 'PART_SHIPPED' },
        { name: 'Void', value: 'VOID' },
        { name: 'Unknow', value: '' }
      ],
      paymenStatusDict: [
        { name: 'Not Paid', value: 'NOT_PAID' },
        { name: 'Unconfirmed', value: 'UNCONFIRMED' },
        { name: 'Paid', value: 'PAID' },
        { name: 'Refund', value: 'REFUND' },
        { name: 'Paying', value: 'PAYING' },
        { name: 'Unknow', value: '' }
      ],
      orderTypeList: [
        { name: 'Single purchase', value: 'SINGLE_PURCHASE' },
        { name: 'Subscription', value: 'SUBSCRIPTION' }
      ],
      consumerTypeList: [
        { name: 'Guest', value: 0 },
        { name: 'Member', value: 1 }
      ],
      nodeId: ''
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  initData(nextProps) {
    if (this.state.nodeId === nextProps.nodeId) {
      return;
    } else {
      this.setState({
        nodeId: nextProps.nodeId
      });
    }
    const { conditionData } = nextProps;
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
    } else {
      this.setState({
        conditionList: [{ id: 1, tableName: undefined, colName: undefined, selOp: undefined, colValue: '', linkOp: '', valueSelect: [], valueType: 'text' }]
      });
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
    this.setState(
      {
        conditionList
      },
      () => this.updateParentValue()
    );
  }

  deleteCondition(id) {
    const { conditionList } = this.state;
    let newConditionList = conditionList.filter((x) => x.id !== id);
    this.setState(
      {
        conditionList: newConditionList
      },
      () => this.updateParentValue()
    );
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
    const { judgeSelect, shippingStatusDict, paymenStatusDict } = this.state;
    const { orderStatusDict, genderDict, orderTypeList, consumerTypeList } = this.state;
    const colName = condition.colName;
    let tmpType;
    let tmpArr = [];
    switch (colName) {
      case 'orderStatus':
        tmpArr = orderStatusDict;
        break;
      case 'shippingStatus':
        tmpArr = shippingStatusDict;
        break;
      case 'paymentStatus':
        tmpArr = paymenStatusDict;
        break;
      case 'orderType':
        tmpArr = orderTypeList;
        break;
      case 'consumerType':
        tmpArr = consumerTypeList;
        break;

      case 'gender':
        tmpArr = genderDict;
        break;
      case 'category':
        tmpArr = [
          { name: 'Dog', value: 'dog' },
          { name: 'Cat', value: 'cat' }
        ];
        break;
      case 'sterilizationStatus':
        tmpArr = judgeSelect;
        break;
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

    this.setState({ conditionList }, () => this.updateParentValue());
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
                    allowClear
                    dropdownClassName="minSelect"
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
                    allowClear
                    dropdownClassName="minSelect"
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
                      <Option value={item.value} key={item.value}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <Select
                    allowClear
                    dropdownClassName="minSelect"
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
                      allowClear
                      dropdownClassName="minSelect"
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
                  <span className="user-select-none item-icon icon iconfont iconbianzu9" style={{ fontSize: '25px' }} onClick={() => this.addCondidtion(condition.id)} />
                </Col>
              </Row>
            </Row>
          ))}
        </FormItem>
      </React.Fragment>
    );
  }
}
