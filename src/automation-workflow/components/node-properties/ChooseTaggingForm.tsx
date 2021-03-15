import React, { Component } from 'react';
import { Form, Input, Col, Row, Select, message, InputNumber, Radio, Icon } from 'antd';
import * as webapi from '@/automation-workflow/webapi';
import { Const } from 'qmkit';
import { debug } from 'console';

const FormItem = Form.Item;
const Option = Select.Option;

export default class ChooseSegmentForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        chooseType: 1, // 1:Seed Segment 2:Test Segment
        taggingList: [
          { rowId: 1, taggingId: undefined, linkOp: '' } // linkOp: 1:union 2:intersection 3:difference
        ],
        abTestType: 1, // 1:Percentage 2:Counts
        percentageValue: 0,
        aCountValue: 0,
        bCountValue: 0
      },
      taggingSource: [],
      testTaggingId: undefined,
      estimatedContact: '',
      nodeId: ''
    };
    this.onChange = this.onChange.bind(this);
    this.radioGroupOnChange = this.radioGroupOnChange.bind(this);
    this.addTagging = this.addTagging.bind(this);
  }

  componentDidMount() {
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  initData(nextProps) {
    const { taggingData } = nextProps;
    const { form, nodeId } = this.state;
    if (nodeId === nextProps.nodeId) {
      return;
    } else {
      this.setState({
        nodeId: nextProps.nodeId
      });
    }
    if (taggingData.chooseType === undefined) {
      this.setState({
        form: {
          chooseType: 1,
          taggingList: [{ rowId: 1, taggingId: undefined, linkOp: '' }],
          abTestType: 1,
          percentageValue: 0,
          aCountValue: 0,
          bCountValue: 0
        },
        taggingSource: [],
        testTaggingId: undefined,
        estimatedContact: ''
      });
    } else {
      form.chooseType = taggingData.chooseType;
      if (taggingData.chooseType === 1) {
        form.taggingList = taggingData.taggingList;
      } else {
        form.testTaggingId = taggingData.taggingList[0].segmentId;
      }
      form.abTestType = taggingData.abTestType;
      form.percentageValue = taggingData.percentageValue;
      form.aCountValue = taggingData.aCountValue;
      form.bCountValue = taggingData.bCountValue;

      this.setState({
        form
      });
    }
  }

  onChange(field, value) {
    let data = this.state.form;
    data[field] = value;
    this.setState(
      {
        form: data
      },
      () => this.updateParentValue()
    );
  }

  updateParentValue() {
    const { updateValue } = this.props;
    const { form } = this.state;
    updateValue('taggingData', form);
  }

  radioGroupOnChange(value) {
    this.setState(
      {
        form: {
          chooseType: value,
          taggingList: [
            { rowId: 1, taggingId: undefined, linkOp: '' } // linkOp: 1:union 2:intersection 3:difference
          ],
          abTestType: 1, // 1:Percentage 2:Counts
          percentageValue: 0,
          aCountValue: 0,
          bCountValue: 0
        },
        taggingSource: [],
        testTaggingId: undefined,
        estimatedContact: ''
      },
      () => this.updateParentValue()
    );
  }

  radioChangeStyle(link, linkType) {
    if (link === linkType) {
      return 'green';
    }
  }

  deleteTagging(rowId) {
    const { form } = this.state;
    form.taggingList = form.taggingList.filter((x) => x.rowId !== rowId);
    this.setState({
      form
    });
  }
  addTagging() {
    const { form } = this.state;
    let rowIds = form.taggingList.map((x) => x.rowId);
    let maxRowId = Math.max(...rowIds);
    form.taggingList.push({ rowId: maxRowId + 1, taggingId: null, linkOp: '1' });
    this.setState({
      form
    });
  }
  estimateContacts() {
    const { form, testTaggingId } = this.state;
    let parameter = [];
    if (form.chooseType === 1) {
      parameter = form.taggingList;
    } else {
      parameter = [{ rowId: 1, taggingId: testTaggingId, linkOp: '' }];
    }
    webapi
      .getCountBySegments(parameter)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            estimatedContact: res.context
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });
  }

  abTestTypeChange(value) {
    const { form } = this.state;
    form.percentageValue = 0;
    form.aCountValue = 0;
    form.bCountValue = 0;
    form.abTestType = value;
    this.setState({
      form
    });
  }

  onTaggingChange(oldId, newId) {
    const { form } = this.state;
    form.taggingList.map((item) => {
      if (item.id === oldId) {
        item.id = newId;
      }
    });
    this.setState(form);
  }

  render() {
    const { form, taggingSource, testTaggingId, estimatedContact } = this.state;
    const { updateValue } = this.props;
    return (
      <React.Fragment>
        <FormItem label="Choose a tagging" colon={false}>
          <Radio.Group
            onChange={(e) => {
              const value = (e.target as any).value;
              this.radioGroupOnChange(value);
            }}
            value={form.chooseType}
            style={{ width: '100%' }}
          >
            <Radio value={1}>Choose a tagging</Radio>
            {form.taggingList.map((tagging) => (
              <Row gutter={5} key={tagging.rowId}>
                {tagging.linkOp ? (
                  <Row>
                    <Col span={10} style={{ marginLeft: '20px' }}>
                      <Radio.Group
                        onChange={(e) => {
                          const value = (e.target as any).value;
                          this.onChange('linkOp', value);
                        }}
                        size="small"
                        value={tagging.linkOp}
                        className="linkStyle"
                      >
                        <Radio.Button value="1" style={{ backgroundColor: this.radioChangeStyle(tagging.linkOp, '1') }}>
                          And
                        </Radio.Button>
                        <Radio.Button value="2" style={{ backgroundColor: this.radioChangeStyle(tagging.linkOp, '2') }}>
                          Or
                        </Radio.Button>
                      </Radio.Group>
                    </Col>
                    <Col span={5}>
                      <span className="user-select-none item-icon iconfont iconDelete" style={{ color: 'red', fontSize: '18px' }} onClick={() => this.deleteTagging(tagging.rowId)} />
                    </Col>
                  </Row>
                ) : null}
                <Col span={20}>
                  <Select
                    dropdownClassName="normalSelect"
                    onChange={(value) => {
                      this.onTaggingChange(tagging.taggingId, value);
                    }}
                    placeholder="Please select tagging"
                    value={tagging.taggingId}
                    disabled={form.chooseType === 2}
                  >
                    {taggingSource.map((item) => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                {form.chooseType === 1 ? (
                  <Col span={4} style={{ lineHeight: 1.8 }}>
                    <span className="user-select-none item-icon icon iconfont iconbianzu9" style={{ fontSize: '25px' }} onClick={() => this.addTagging()} />
                  </Col>
                ) : null}
              </Row>
            ))}

            <Radio value={2}>Test Segment</Radio>
            <Row>
              <Select
                dropdownClassName="normalSelect"
                onChange={(value) => {
                  let testTaggingData = { taggingList: [], chooseType: 0 };
                  testTaggingData.taggingList = [{ rowId: 1, taggingId: value, linkOp: '' }];
                  testTaggingData.chooseType = 2;
                  this.setState(
                    {
                      testTaggingId: value
                    },
                    () => updateValue('taggingData', testTaggingData)
                  );
                }}
                placeholder="Please select tagging"
                value={testTaggingId}
                disabled={form.chooseType === 1}
              >
                {taggingSource.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Row>
            <Row>
              <span style={{ marginRight: '10px' }}>Estimated pet owner counts</span>
              <Icon type="reload" style={{ color: 'blue', fontSize: '18px' }} onClick={() => this.estimateContacts} />
              <Input value={estimatedContact} disabled={true} />
            </Row>
            {form.chooseType === 1 ? (
              <Row>
                <span>A/B Test</span>
                <Row gutter={20}>
                  <Col span={12}>
                    <Select dropdownClassName="normalSelect" value={form.abTestType} onChange={(value) => this.abTestTypeChange(value)}>
                      <Option value={1} key={1}>
                        Percentage
                      </Option>
                      <Option value={2} key={2}>
                        Counts
                      </Option>
                    </Select>
                  </Col>
                  {form.abTestType === 1 ? (
                    <Col span={12}>
                      <Row>
                        <Col span={13}>
                          <InputNumber
                            onChange={(value) => {
                              this.onChange('percentageValue', value);
                            }}
                            placeholder="Number"
                            value={form.percentageValue}
                            max={100}
                            min={0}
                          />
                        </Col>
                        <Col span={4}>%</Col>
                      </Row>
                    </Col>
                  ) : null}

                  {form.abTestType === 2 ? (
                    <Col span={6}>
                      <InputNumber
                        onChange={(value) => {
                          this.onChange('aCountValue', value);
                        }}
                        value={form.aCountValue}
                        placeholder="A"
                        min={0}
                      />
                    </Col>
                  ) : null}

                  {form.abTestType === 2 ? (
                    <Col span={6}>
                      <InputNumber
                        onChange={(value) => {
                          this.onChange('bCountValue', value);
                        }}
                        value={form.bCountValue}
                        placeholder="B"
                        min={0}
                      />
                    </Col>
                  ) : null}
                </Row>
              </Row>
            ) : null}
          </Radio.Group>
        </FormItem>
      </React.Fragment>
    );
  }
}
