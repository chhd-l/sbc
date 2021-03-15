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
        segmentList: [
          { rowId: 1, segmentId: undefined, linkOp: '' } // linkOp: 1:union 2:intersection 3:difference
        ],
        abTestType: 1, // 1:Percentage 2:Counts
        percentageValue: 0,
        aCountValue: 0,
        bCountValue: 0
      },
      estimatedContact: '',
      nodeId: ''
    };
    this.onChange = this.onChange.bind(this);
    this.addTagging = this.addTagging.bind(this);
  }

  componentDidMount() {
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  initData(nextProps) {
    const { segmentData } = nextProps;
    const { form, nodeId } = this.state;
    if (nodeId === nextProps.nodeId) {
      return;
    } else {
      this.setState({
        nodeId: nextProps.nodeId
      });
    }
    if (segmentData.segmentList === undefined) {
      this.setState({
        form: {
          segmentList: [{ rowId: 1, segmentId: undefined, linkOp: '' }],
          abTestType: 1,
          percentageValue: 0,
          aCountValue: 0,
          bCountValue: 0
        },
        estimatedContact: ''
      });
    } else {
      form.segmentList = segmentData.segmentList;
      form.abTestType = segmentData.abTestType;
      form.percentageValue = segmentData.percentageValue;
      form.aCountValue = segmentData.aCountValue;
      form.bCountValue = segmentData.bCountValue;

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
    updateValue('segmentData', form);
  }

  radioChangeStyle(link, linkType) {
    if (link === linkType) {
      return 'green';
    }
  }

  deleteTagging(rowId) {
    const { form } = this.state;
    form.segmentList = form.segmentList.filter((x) => x.rowId !== rowId);
    this.setState(
      {
        form
      },
      () => this.updateParentValue()
    );
  }
  addTagging() {
    const { form } = this.state;
    let rowIds = form.segmentList.map((x) => x.rowId);
    let maxRowId = Math.max(...rowIds);
    form.segmentList.push({ rowId: maxRowId + 1, segmentId: null, linkOp: '1' });
    this.setState(
      {
        form
      },
      () => this.updateParentValue()
    );
  }
  estimateContacts() {
    const { form } = this.state;
    webapi
      .getCountBySegments({ segmentList: form.segmentList })
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
    this.setState(
      {
        form
      },
      () => this.updateParentValue()
    );
  }

  onTaggingChange(rowId, newsegmentIdId) {
    const { form } = this.state;
    form.segmentList.map((item) => {
      if (item.rowId === rowId) {
        item.segmentId = newsegmentIdId;
      }
    });

    this.setState(form, () => this.updateParentValue());
  }

  onLinkOpChange(rowId, linkOp) {
    const { form } = this.state;
    form.segmentList.map((item) => {
      if (item.rowId === rowId) {
        item.linkOp = linkOp;
      }
    });

    this.setState(form, () => this.updateParentValue());
  }

  render() {
    const { form, estimatedContact } = this.state;
    const { taggingSource } = this.props;
    return (
      <React.Fragment>
        <FormItem label="Choose a tagging" colon={false}>
          {form.segmentList.map((tagging) => (
            <Row gutter={5} key={tagging.rowId}>
              {tagging.linkOp ? (
                <Row>
                  <Col span={10} style={{ marginLeft: '20px' }}>
                    <Radio.Group
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.onLinkOpChange(tagging.rowId, value);
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
                  allowClear
                  dropdownClassName="normalSelect"
                  onChange={(value) => {
                    this.onTaggingChange(tagging.rowId, value);
                  }}
                  placeholder="Please select tagging"
                  value={tagging.segmentId}
                >
                  {taggingSource.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={4} style={{ lineHeight: 1.8 }}>
                <span className="user-select-none item-icon icon iconfont iconbianzu9" style={{ fontSize: '25px' }} onClick={() => this.addTagging()} />
              </Col>
            </Row>
          ))}
          <Row>
            <span style={{ marginRight: '10px' }}>Estimated pet owner counts</span>
            <Icon type="reload" style={{ color: 'blue', fontSize: '18px' }} onClick={() => this.estimateContacts()} />
            <Input value={estimatedContact} disabled={true} />
          </Row>
          <Row>
            <span>A/B Test</span>
            <Row gutter={20}>
              <Col span={12}>
                <Select allowClear dropdownClassName="normalSelect" value={form.abTestType} onChange={(value) => this.abTestTypeChange(value)}>
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
        </FormItem>
      </React.Fragment>
    );
  }
}
