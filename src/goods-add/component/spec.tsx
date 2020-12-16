import * as React from 'react';
import { Relax } from 'plume2';
import { Checkbox, Input, Select, Button, Row, Col, Icon, Form, message } from 'antd';
import { noop, cache } from 'qmkit';
import { IList } from 'typings/globalType';
import { Map, fromJS } from 'immutable';
import { FormattedMessage } from 'react-intl';

const Option = Select.Option;
const FormItem = Form.Item;

@Relax
export default class Spec extends React.Component<any, any> {
  WrapperForm: any;
  props: {
    relaxProps?: {
      specSingleFlag: boolean;
      editSpecSingleFlag: Function;
      goodsSpecs: IList;
      editSpecName: Function;
      editSpecValues: Function;
      addSpec: Function;
      deleteSpec: Function;
      updateSpecForm: Function;
    };
  };

  static relaxProps = {
    // 是否为单规格
    specSingleFlag: 'specSingleFlag',
    // 修改是否为当单规格
    editSpecSingleFlag: noop,
    // 商品规格
    goodsSpecs: 'goodsSpecs',
    // 修改规格名称
    editSpecName: noop,
    // 修改规格值
    editSpecValues: noop,
    // 添加规格
    addSpec: noop,
    deleteSpec: noop,
    updateSpecForm: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(SpecForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    // const { updateSpecForm } = relaxProps;
    return (
      <WrapperForm
        ref={(form) => (this['_form'] = form)}
        // ref={form => updateSpecForm(form)}
        {...{ relaxProps: relaxProps }}
      />
    );
  }
}

class SpecForm extends React.Component<any, any> {
  componentDidMount() {
    const { updateSpecForm, editSpecSingleFlag } = this.props.relaxProps;
    updateSpecForm(this.props.form);
    //editSpecSingleFlag('checked');
    this._addSpec();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { specSingleFlag, goodsSpecs } = this.props.relaxProps;
    return (
      <div id="specSelect" style={{ marginBottom: 10 }}>
        <Form>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
            <FormattedMessage id="product.specificationSetting" />
          </div>
          <div style={styles.box}>
            <Checkbox onChange={this._editSpecFlag} checked={!specSingleFlag} disabled>
              <span>
                {/* <span
                  style={{
                    color: 'red',
                    fontFamily: 'SimSun',
                    marginRight: '4px',
                    fontSize: '12px'
                    // float: 'left'
                  }}
                >
                  *
                </span> */}
                <FormattedMessage id="product.setMultipleSpecificationOfProducts" />
              </span>
            </Checkbox>
          </div>
          <div style={styles.bg}>
            {specSingleFlag ? null : (
              <Row>
                <Col offset={0}>
                  <p style={{ color: '#999', marginBottom: 5 }}>You can quickly add multiple specifications using the keyboard enter key</p>
                </Col>
              </Row>
            )}
            {/*<div style={{ marginBottom: 20 }}>
              <Row type="flex" justify="start" align="top">
                <Col span={3}>
                  <span
                    style={{
                      color: 'red',
                      fontFamily: 'SimSun',
                      marginRight: '4px',
                      fontSize: '12px',
                      float: 'left'
                    }}
                  >
                    *
                  </span>
                  <FormItem>
                    {getFieldDecorator('spec_' + 1, {
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: 'Please input specification'
                        },
                        {
                          min: 1,
                          max: 100,
                          message: 'No more than 100 characters'
                        },
                        {
                          // 重复校验,
                          validator: (_rule, specsName, callback) => {
                            if (!specsName) {
                              callback();
                              return;
                            }
                            //   获得表单其他列的规格名称，
                            goodsSpecs.forEach((value, i) => {
                              value.get('specName') == specsName ? callback(new Error('Specification name duplicate')) : callback();
                            });
                            callback();
                          }
                        }
                      ],
                      onChange: this._editSpecName.bind(this, 1),
                      initialValue: 'weight'
                    })(<Input placeholder="Please input specification" style={{ width: '90%' }} disabled={true} />)}
                  </FormItem>
                </Col>
                <Col span={10}>
                  <span
                    style={{
                      color: 'red',
                      fontFamily: 'SimSun',
                      marginRight: '4px',
                      fontSize: '12px',
                      float: 'left'
                    }}
                  >
                    *
                  </span>
                  <FormItem>
                    {getFieldDecorator('specval_' + 2, {
                      rules: [
                        {
                          required: true,
                          message: 'Please input specification Value'
                        },
                        {
                          validator: (_rule, value, callback) => {
                            if (!value) {
                              callback();
                              return;
                            }

                            if (value.length > 0) {
                              const valueList = fromJS(value);
                              let overLen = false;
                              let whitespace = false;
                              let duplicated = false;

                              valueList.forEach((v, k) => {
                                const trimValue = v.trim();
                                if (!trimValue) {
                                  whitespace = true;
                                  return false;
                                }
                                if (v.length > 20) {
                                  overLen = true;
                                  return false;
                                }

                                // 重复校验
                                const duplicatedIndex = valueList.findIndex((v1, index1) => index1 != k && v1.trim() === trimValue);
                                if (duplicatedIndex > -1) {
                                  duplicated = true;
                                }
                              });

                              if (whitespace) {
                                callback(new Error('The specification value cannot be a space character'));
                                return;
                              }
                              if (overLen) {
                                callback(new Error('Each value supports up to 20 characters'));
                                return;
                              }
                              if (duplicated) {
                                callback(new Error('Repeated specifications'));
                                return;
                              }
                            }

                            if (value.length > 20) {
                              callback(new Error('Support up to 20 specifications'));
                              return;
                            }

                            callback();
                          }
                        }
                      ],
                      onChange: this._editSpecValue.bind(this, 23),
                      //initialValue: ''
                    })(
                      <Select mode="tags" getPopupContainer={() => document.getElementById('specSelect')} style={{ width: '90%' }} placeholder="Please input specification Value" notFoundContent="No specification value" tokenSeparators={[',']}>
                        {this._getChildren(item.get('specValues'))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>*/}
            {specSingleFlag
              ? null
              : goodsSpecs.map((item, index) => {
                  const specValues =
                    item.get('specValues').count() > 0
                      ? item
                          .get('specValues')
                          .map((item) => item.get('detailName'))
                          .toJS()
                      : [];
                  return (
                    <div key={item.get('specId')} style={{ marginBottom: 20 }}>
                      <Row type="flex" justify="start" align="top">
                        <Col span={3}>
                          <span
                            style={{
                              color: 'red',
                              fontFamily: 'SimSun',
                              marginRight: '4px',
                              fontSize: '12px',
                              float: 'left'
                            }}
                          ></span>
                          <FormItem>
                            {getFieldDecorator('spec_' + item.get('specId'), {
                              rules: [
                                // {
                                //   required: true,
                                //   whitespace: true,
                                //   message: 'Please input specification'
                                // },
                                {
                                  min: 1,
                                  max: 100,
                                  message: 'No more than 100 characters'
                                },
                                {
                                  // 重复校验,
                                  validator: (_rule, specsName, callback) => {
                                    if (!specsName) {
                                      callback();
                                      return;
                                    }
                                    //   获得表单其他列的规格名称，
                                    goodsSpecs.forEach((value, i) => {
                                      if (i != index) {
                                        value.get('specName') == specsName ? callback(new Error('Specification name duplicate')) : callback();
                                      }
                                    });
                                    callback();
                                  }
                                }
                              ],
                              onChange: this._editSpecName.bind(this, item.get('specId')),
                              initialValue: index == 0 ? sessionStorage.getItem(cache.SYSTEM_GET_WEIGHT) : item.get('specName')
                            })(<Input placeholder="Please input specification" style={{ width: '90%' }} disabled={index == 0 ? true : false} />)}
                          </FormItem>
                        </Col>
                        <Col span={9}>
                          <span
                            style={{
                              color: 'red',
                              fontFamily: 'SimSun',
                              marginRight: '4px',
                              fontSize: '12px',
                              float: 'left',
                              marginLeft: '10px'
                            }}
                          ></span>
                          <FormItem>
                            {getFieldDecorator('specval_' + item.get('specId'), {
                              rules: [
                                // {
                                //   required: true,
                                //   message: 'Please input specification Value'
                                // },
                                {
                                  validator: (_rule, value, callback) => {
                                    if (!value) {
                                      callback();
                                      return;
                                    }

                                    if (value.length > 0) {
                                      const valueList = fromJS(value);
                                      let overLen = false;
                                      let whitespace = false;
                                      let duplicated = false;

                                      valueList.forEach((v, k) => {
                                        const trimValue = v.trim();
                                        if (!trimValue) {
                                          whitespace = true;
                                          return false;
                                        }
                                        if (v.length > 20) {
                                          overLen = true;
                                          return false;
                                        }

                                        // 重复校验
                                        const duplicatedIndex = valueList.findIndex((v1, index1) => index1 != k && v1.trim() === trimValue);
                                        if (duplicatedIndex > -1) {
                                          duplicated = true;
                                        }
                                      });

                                      if (whitespace) {
                                        callback(new Error('The specification value cannot be a space character'));
                                        return;
                                      }
                                      if (overLen) {
                                        callback(new Error('Each value supports up to 20 characters'));
                                        return;
                                      }
                                      if (duplicated) {
                                        callback(new Error('Repeated specifications'));
                                        return;
                                      }
                                    }

                                    if (value.length > 20) {
                                      callback(new Error('Support up to 20 specifications'));
                                      return;
                                    }

                                    callback();
                                  }
                                }
                              ],
                              onChange: this._editSpecValue.bind(this, item.get('specId')),
                              initialValue: specValues
                            })(
                              <Select mode="tags" getPopupContainer={() => document.getElementById('specSelect')} style={{ width: '90%' }} placeholder="Please input specification Value" notFoundContent="No specification value" tokenSeparators={[',']}>
                                {this._getChildren(item.get('specValues'))}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        {index != 0 ? (
                          <Col span={2} style={{ marginTop: 2, textAlign: 'center' }}>
                            <Button type="primary" onClick={() => this._deleteSpec(item.get('specId'))} style={{ marginTop: '2px' }}>
                              <FormattedMessage id="delete" />
                            </Button>
                          </Col>
                        ) : null}
                      </Row>
                      {index === 0 ? (
                        <Row>
                          <span style={{ color: 'red' }}>*</span> You only need to input specific weight value
                        </Row>
                      ) : null}
                    </div>
                  );
                })}

            {specSingleFlag ? null : (
              <Button onClick={this._addSpec}>
                <Icon type="plus" />
                <FormattedMessage id="addSpecifications" />
              </Button>
            )}
          </div>
        </Form>
      </div>
    );
  }

  /**
   * 获取规格值转为option
   */
  _getChildren = (specValues: IList) => {
    const children = [];
    specValues.forEach((item) => {
      let a = item.get('detailName').replace(/[^\d.]/g, '');
      children.push(<Option key={item.get('detailName')}>{a}</Option>);
    });
    return children;
  };

  /**
   * 设置是否为单规格
   */
  _editSpecFlag = (e) => {
    const { editSpecSingleFlag, updateSpecForm } = this.props.relaxProps;
    updateSpecForm(this.props.form);
    editSpecSingleFlag(!e.target.checked);
  };

  /**
   * 修改规格名称
   */
  _editSpecName = (specId: number, e) => {
    const { editSpecName, updateSpecForm } = this.props.relaxProps;
    const specName = e.target.value;
    updateSpecForm(this.props.form);
    editSpecName({ specId, specName });
  };

  /**
   * 修改规格值
   */
  _editSpecValue = (specId: number, value: string) => {
    const { editSpecValues, goodsSpecs, updateSpecForm } = this.props.relaxProps;
    // 找到原规格值列表
    const spec = goodsSpecs.find((spec) => spec.get('specId') == specId);
    const oldSpecValues = spec.get('specValues');
    let specValues = fromJS(value);
    specValues = specValues.map((item) => {
      const ov = oldSpecValues.find((ov) => ov.get('detailName') == item);
      const isMock = !ov || ov.get('isMock') === true;
      const valueId = ov ? ov.get('specDetailId') : this._getRandom();
      return Map({
        isMock: isMock,
        specDetailId: valueId,
        detailName: item
      });
    });
    updateSpecForm(this.props.form);
    editSpecValues({ specId, specValues });
  };

  /**
   * 添加规格
   */
  _addSpec = () => {
    const { addSpec, goodsSpecs, updateSpecForm } = this.props.relaxProps;
    if (goodsSpecs != null && goodsSpecs.count() >= 5) {
      message.error('Add up to 5 specifications');
      return;
    }
    updateSpecForm(this.props.form);
    addSpec();
  };

  _deleteSpec = (specId: number) => {
    const { deleteSpec, goodsSpecs, updateSpecForm } = this.props.relaxProps;
    if (goodsSpecs != null && goodsSpecs.count() <= 1) {
      message.error('Keep at least 1 specification item');
      return;
    }
    updateSpecForm(this.props.form);
    deleteSpec(specId);
  };

  /**
   *  获取整数随机数
   */
  _getRandom = () => {
    return parseInt(Math.random().toString().substring(2, 18));
  };
  r;
}

const styles = {
  box: {
    padding: 10,
    paddingLeft: 20
  },
  bg: {
    padding: 20,
    paddingTop: 0
  }
} as any;
