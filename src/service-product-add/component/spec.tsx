import * as React from 'react';
import { Relax } from 'plume2';
import { Checkbox, Input, Select, Button, Row, Col, Icon, Form, message } from 'antd';
import { noop, cache, ValidConst } from 'qmkit';
import { IList } from 'typings/globalType';
import { Map, fromJS } from 'immutable';
import { FormattedMessage } from 'react-intl';
import { RCi18n } from 'qmkit';

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
      setDefaultBaseSpecId: Function;
      editGoodsItem: Function;
      baseSpecId: any;
      goods: any;
      initServiceSpec: Function;
    };
  };

  static relaxProps = {
    // 是否为单规格
    specSingleFlag: 'specSingleFlag',
    goods: 'goods',
    // 修改是否为当单规格
    editSpecSingleFlag: noop,
    // 商品规格
    goodsSpecs: 'goodsSpecs',
    baseSpecId: 'baseSpecId',
    // 修改规格名称
    editSpecName: noop,
    // 修改规格值
    editSpecValues: noop,
    // 添加规格
    addSpec: noop,
    deleteSpec: noop,
    updateSpecForm: noop,
    setDefaultBaseSpecId: noop,
    editGoodsItem: noop,
    initServiceSpec: noop
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
    const { updateSpecForm, setDefaultBaseSpecId } = this.props.relaxProps;
    //this._addSpec();
    //this._initSpec();
    updateSpecForm(this.props.form);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { specSingleFlag, goodsSpecs, baseSpecId } = this.props.relaxProps;
    return (
      <div id="specSelect" style={{ marginBottom: 10 }}>
        <Form>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
            <FormattedMessage id="product.specificationSetting" />
          </div>
          {/* <div style={styles.box}>
            <Checkbox onChange={this._editSpecFlag} checked={!specSingleFlag}>
              <span>
                <FormattedMessage id="product.setMultipleSpecificationOfProducts" />
              </span>
            </Checkbox>
          </div> */}
          <div style={styles.bg}>
            {specSingleFlag ? null : (
              <Row>
                <Col offset={0}>
                  <p style={{ color: '#999', marginBottom: 5 }}><FormattedMessage id="Product.usingTheKeyboardEnterKey" /></p>
                </Col>
              </Row>
            )}
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
                                  message: <FormattedMessage id="Product.NoMoreThan100characters" />
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
                              initialValue: item.get('specName')
                            })(<Input placeholder={RCi18n({id:'Product.inputspecification'})} style={{ width: '90%' }} disabled={item.get('editable') === false} />)}
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
                                        const duplicatedIndex = valueList.findIndex((v1, index1) => index1 != k && v1.trim().toLowerCase() === trimValue.toLowerCase());
                                        if (duplicatedIndex > -1) {
                                          duplicated = true;
                                        }
                                      });

                                      if (whitespace) {
                                        callback(new Error(RCi18n({id:'Product.specificationvaluecannot'})));
                                        return;
                                      }
                                      /*if (overLen) {
                                        callback(new Error('Each value supports up to 20 characters'));
                                        return;
                                      }*/
                                      if (duplicated) {
                                        callback(new Error(RCi18n({id:'Product.Repeatedspecifications'})));
                                        return;
                                      }
                                    }

                                    if (value.length > 100) {
                                      callback(new Error(RCi18n({id:'Product.Supportupto20specifications'})));
                                      return;
                                    }

                                    callback();
                                  }
                                }
                              ],
                              onChange: this._editSpecValue.bind(this, item.get('specId')),
                              initialValue: specValues
                            })(
                              <Select mode="tags" getPopupContainer={() => document.getElementById('specSelect')} style={{ width: '90%' }} placeholder={RCi18n({id:'Product.inputspecificationValue'})} notFoundContent={RCi18n({id:'Product.Nospecificationvalue'})} tokenSeparators={[',']}>
                                {this._getChildren(item.get('specValues'), item.get('specName'))}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={2} style={{ marginTop: 2, textAlign: 'center' }}>
                          <Button type="primary" onClick={() => this._deleteSpec(item.get('specId'))} style={{ marginTop: '2px' }} disabled={item.get('editable') === false}>
                            <FormattedMessage id="delete" />
                          </Button>
                        </Col>
                      </Row>
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

  _initSpec = () => {
    const { initServiceSpec, updateSpecForm } = this.props.relaxProps;
    updateSpecForm(this.props.form);
    initServiceSpec();
  };

  /**
   * 获取规格值转为option
   */
  _getChildren = (specValues: IList, specName: any) => {
    const children = [];
    specValues.forEach((item) => {
      //let a = item.get('detailName').replace(/[^\d.]/g, '');
      children.push(<Option key={item.get('detailName')} disabled={item.get('editable') === false}>{item.get('detailName')}</Option>);
    });
    return children;
  };

  /**
   * 设置是否为单规格
   */
  _editSpecFlag = (e) => {
    const { editSpecSingleFlag, updateSpecForm, editGoodsItem } = this.props.relaxProps;
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
    const { editSpecValues, goodsSpecs, updateSpecForm, editGoodsItem, goods } = this.props.relaxProps;
    const { setFieldsValue } = this.props.form;
    // 找到原规格值列表
    const spec = goodsSpecs.find((spec) => spec.get('specId') == specId);
    const oldSpecValues = spec.get('specValues');
    let specValues = fromJS(value);
    specValues = specValues.map((item) => {
      const ov = oldSpecValues.find((ov) => ov.get('detailName') == item);
      const isMock = !ov || ov.get('isMock') === true;
      const valueId = ov ? ov.get('specDetailId') : this._getRandom();
      const mockId = ov ? ov.get('mockSpecDetailId') : valueId;
      const editable = ov ? ov.get('editable') : true;
      return Map({
        goodsPromotions: goods.get('promotions'),
        isMock: isMock,
        specDetailId: valueId,
        mockSpecDetailId: mockId,
        detailName: item,
        subscriptionStatus: goods.get('subscriptionStatus'),
        editable: editable
      });
    });
    updateSpecForm(this.props.form);
    editSpecValues({ specId, specValues });

    /*if (value.length == 1) {
      let goods = Map({
        subscriptionStatus: fromJS(1)
      });
      editGoodsItem(goods);
      setFieldsValue({ subscriptionStatus: 1 })
      //setFieldsValue({ subscriptionStatus: 0 });
    }*/
  };

  /**
   * 添加规格
   */
  _addSpec = () => {
    const { addSpec, goodsSpecs, updateSpecForm } = this.props.relaxProps;
    if (goodsSpecs != null && goodsSpecs.count() >= 5) {
      message.error(RCi18n({id:'Product.AddUpo5Specifications'}));
      return;
    }
    updateSpecForm(this.props.form);
    addSpec();
  };

  _deleteSpec = (specId: number) => {
    const { deleteSpec, goodsSpecs, updateSpecForm } = this.props.relaxProps;
    if (goodsSpecs != null && goodsSpecs.count() <= 1) {
      message.error(RCi18n({id:'Product.Keep1SpecificationItem'}));
      return;
    }
    updateSpecForm(this.props.form);
    deleteSpec(specId);
  };

  /**
   *  获取整数随机数
   */
  _getRandom = () => {
    return parseInt((window.crypto.getRandomValues(new Uint8Array(1)) * 0.001).toString().substring(2, 18));
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
