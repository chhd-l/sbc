import * as React from 'react';
import { fromJS, List } from 'immutable';
import { FormattedMessage, injectIntl} from 'react-intl';
import { Button, Checkbox, Col, DatePicker, Form, Input, message, Modal, Radio, Row, Select, Spin } from 'antd';
import moment from 'moment';
import * as webapi from '../webapi'
import { Relax } from 'plume2';
import { Const, history, QMMethod, util, cache, ValidConst, noop } from 'qmkit';
import UUID from 'uuid-js';

let FormItem = Form.Item;
let RangePicker = DatePicker.RangePicker;
let RadioGroup = Radio.Group;
let CheckboxGroup = Checkbox.Group;
let Confirm = Modal.confirm;

let formItemLayout = {
  wrapperCol: {
    span: 21
  },
  labelCol: {
    span: 3
  },
};
let smallformItemLayout = {
  wrapperCol: {
    span: 10
  },
  labelCol: {
  span: 3
}
};

let largeformItemLayout = {
  wrapperCol: {
    span: 10
  },
  labelCol: {
    span: 5
  }
};

@Relax
class FreeShippingAddForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    // const relaxProps = props.store.state();
    this.state = {
      timeZone: moment
      // shippingBean: relaxProps.get('shippingBean'),
      // allGroups: relaxProps.get('allGroups'), submitFreeShipping: relaxProps.get('allGroups'), loading: relaxProps.get('loading')
    };
  }
  props: {
    form: any;
    relaxProps?: {
      shippingBean: any;
      loading: boolean;
      marketingType: any;
      submitFreeShipping: Function;
      shippingBeanOnChange: Function;
      setMarketingType: Function;
      allGroups: any;
    };
    intl: any;
  };

  static relaxProps = {
    allGroups: 'allGroups',
    shippingBean: 'shippingBean',
    marketingType: 'marketingType',
    loading: 'loading',
    submitFreeShipping: noop,
    shippingBeanOnChange: noop,
    setMarketingType: noop
  };
  /**
   * 页面初始化
   * @returns {Promise<void>}
   */
  init = async () => {};
  componentDidMount() {}
  /**
   * 提交方法
   * @param e
   */
   handleSubmit = (e) => {
    e.preventDefault();
    let errorObject = {};
    let { shippingBean, submitFreeShipping } = this.props.relaxProps;
    this.setState({
      count: 1
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        submitFreeShipping(shippingBean.toJS());
      }
    });
  };
  /**
   * 内部方法，修改shippingBean对象的属性
   * @param params
   */
  onBeanChange = (params) => {
    let { shippingBean, shippingBeanOnChange } = this.props.relaxProps;
    shippingBeanOnChange(shippingBean.merge(params));
  };

  productTypeOnChange = (value) => {
    this.onBeanChange({ productType: value });
  };

  handleEndOpenChange = async (date) => {
    if (date == true) {
      let { res } = await webapi.timeZone();
      if (res.code == Const.SUCCESS_CODE) {
        this.setState({
          timeZone: res.defaultLocalDateTime
        });
      }
    }
  };

  selectGroupOnChange = (value) => {
    let segmentIds = [];
    segmentIds.push(value);
    this.onBeanChange({ segmentIds });
  };

  targetCustomerRadioChange = (value) => {
    this.onBeanChange({
      joinLevel: value,
      segmentIds: []
    });
  };


  shippingRadioOnChange = (e, key) => {
    switch (key) {
      case 'subType':
        this.props.form.setFieldsValue({
          shippingValue: null,
          shippingItemValue: null,
        });
        this.onBeanChange({
          shippingValue: null,
          subType: e.target.value,
          shippingItemValue: null,
        });
        break;
      case 'shippingValue':
        this.onBeanChange({
          shippingValue: e.target.value,
          shippingItemValue: null
        });
        break;
      case 'shippingItemValue':
        this.onBeanChange({
          shippingValue: null,
          shippingItemValue: e.target.value
        });
        break;
      default:
        break;
    }
  };

  getPromotionCode = () => {
    if (!this.state.promotionCode) {
      let timeStamp = new Date(sessionStorage.getItem('defaultLocalDateTime')).getTime().toString().slice(-10);
      let randomNumber = ('0'.repeat(8) + parseInt(Math.pow(2, 40) * Math.random()).toString(32)).slice(-8);
      let promotionCode = randomNumber + timeStamp;
      this.setState({
        promotionCode2: promotionCode,
        promotionCode: promotionCode,
      });
      return promotionCode;
    } else {
      return this.state.promotionCode;
    }
  };
  render() {
    let { form } = this.props; //marketingType, marketingId,
    let { getFieldDecorator } = this.props.form;
    let { allGroups, shippingBean, loading, marketingType, setMarketingType } = this.props.relaxProps;
    console.log(marketingType, 'marketingType-----------');
    return (
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 20 }} key={UUID.create().toString()}>
        <div className="bold-title"><FormattedMessage id="Marketing.ReductionType" />:</div>
        <FormItem {...formItemLayout} labelAlign="left">
        <div className="ant-form-inline">
          <Radio.Group value={marketingType} onChange={(e) => {
            setMarketingType(e.target.value)
            this.onBeanChange({
              marketingType: e.target.value
            })
          }}>
            <Radio  id="Marketing.Normal"  value={0}><FormattedMessage/></Radio>
            <Radio value={3}><FormattedMessage id="Marketing.Freeshipping" /></Radio>
          </Radio.Group>
        </div>
      </FormItem>
        <div className="bold-title"><FormattedMessage id="Marketing.PromotionType" />:</div>
        <FormItem {...formItemLayout} labelAlign="left">
          <div className="ant-form-inline">
            <Radio.Group onChange={e => {
              this.onBeanChange({
                promotionType: e.target.value,
              });
            }} value={shippingBean.get('promotionType')}>
              <Radio value={0}><FormattedMessage id="Marketing.All" /></Radio>
              <Radio value={1}><FormattedMessage id="Marketing.Autoship" /></Radio>
              {Const.SITE_NAME !== 'MYVETRECO' && <Radio value={2}><FormattedMessage id="Marketing.Club" /></Radio>}
              <Radio value={3}><FormattedMessage id="Marketing.Singlepurchase" /></Radio>
            </Radio.Group>
          </div>
        </FormItem>
        {
          shippingBean.get('promotionType') == 0 &&
          <FormItem {...formItemLayout} labelAlign="left">
            <div className="ant-form-inline">
              <Checkbox checked={shippingBean.get('isSuperimposeSubscription') === 0} onChange={(e) => {
                this.onBeanChange({
                  isSuperimposeSubscription: e.target.checked ? 0 : 1
                });
              }}>
                <FormattedMessage id="Marketing.Idontwanttocumulate" />
              </Checkbox>
            </div>
          </FormItem>
        }
        <div className="bold-title">Basic Setting</div>
        <FormItem {...smallformItemLayout} label={<FormattedMessage id="Marketing.PromotionCode" />} labelAlign="left">
          {getFieldDecorator('promotionCode', {
            initialValue: shippingBean.get('promotionCode') ? shippingBean.get('promotionCode') : this.getPromotionCode(),
            rules: [
              {
                required: true,
                whitespace: true,
                message:
                  (window as any).RCi18n({
                    id: 'Marketing.PleaseInputPromotionCode'
                  })
              },
              { min: 1, max: 20, message:
                  (window as any).RCi18n({
                    id: 'Marketing.words'
                  })
              },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback,
                    (window as any).RCi18n({
                      id: 'Marketing.PromotionCode'
                    })
                  );
                }
              }
            ]
          })(
            <Input
              onChange={(e) => {
                this.setState({
                  promotionCode: e.target.value
                });
                this.onBeanChange({
                  promotionCode:  e.target.value
                })
              }}
              // marketingBean.get('promotionType') === 1 || marketingBean.get('promotionType') === 2 ||
              disabled={shippingBean.get('publicStatus') == 1}
              style={{ width: 160 }}
            />
          )}

          <Checkbox
            style={{ marginLeft: 20 }}
            // disabled={marketingBean.get('promotionType') === 1 || marketingBean.get('promotionType') === 2}
            checked={shippingBean.get('publicStatus') == 1}
            onChange={(e) => {
              this.onBeanChange({
                publicStatus: e.target.checked ? 1 : 0
              });
            }}
          >
            <FormattedMessage id="Marketing.Public" />
          </Checkbox>
        </FormItem>
        <FormItem {...smallformItemLayout} label={<FormattedMessage id="Marketing.Freeshippingname" />}  className="gift-item" labelAlign="left" >
          {getFieldDecorator('marketingName', {
            onChange: (e) => this.onBeanChange({ marketingName: e.target.value }),
            rules: [
              {
                whitespace: true,
                message:
                  (window as any).RCi18n({
                    id: 'Marketing.Pleaseenterfreeshippingname',
                  }),
                required: true,
              },
              { min: 1, max: 40, message:
                  (window as any).RCi18n({
                  id: 'Marketing.40Words',
                })
              },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback,
                    (window as any).RCi18n({
                      id: 'Marketing.Freeshippingname',
                    })
                  );
                }
              }
            ],
            initialValue: shippingBean.get('marketingName')
          })(<Input placeholder={
            (window as any).RCi18n({
            id: 'Marketing.nomorethan40words',
          })} style={{ width: 350 }} />)}
        </FormItem>
        <FormItem {...smallformItemLayout} label={<FormattedMessage id="Marketing.StartAndEndTime" />} labelAlign="left" className="gift-item">
          {getFieldDecorator('time', {
            onChange: (date, dateString) => {
              if (date) {
                this.onBeanChange({
                  beginTime: dateString[0] + ':00',
                  endTime: dateString[1] + ':00'
                });
              }
            },
            rules: [
              {
                message: (window as any).RCi18n({
                  id: 'Marketing.PleaseSelectStartingAndEndTime'
                }),
                required: true,
              },
              {
                validator: (_rule, value, callback) => {
                  if (value[0]) {
                    callback();
                  } else {
                    callback(
                      (window as any).RCi18n({
                        id: 'Marketing.PleaseSelectStartingAndEndTime'
                      })
                    );
                  }
                }
              }
            ],
            initialValue: shippingBean.get('beginTime') === undefined ? [undefined, undefined] : [moment(shippingBean.get('beginTime')), moment(shippingBean.get('endTime'))]
          })(<RangePicker allowClear={false} getCalendarContainer={() => document.getElementById('page-content')} format={Const.DATE_FORMAT} placeholder={['Start time', 'End time']}  onOpenChange={this.handleEndOpenChange} showTime={{ format: 'HH:mm' }} />)}
        </FormItem>
        <div className="bold-title"><FormattedMessage id="Marketing.Freeshippingtype" />:</div>
        <FormItem {...smallformItemLayout} labelAlign="left">
          {getFieldDecorator(
            'subType',
            {}
          )(
            <>
              <RadioGroup onChange={(e) => this.shippingRadioOnChange(e, 'subType')}  value={shippingBean.get('subType')} >
                {/*<FormItem>*/}
                {/*  <Radio value={1}>All order</Radio>*/}
                {/*</FormItem>*/}
                <FormItem>
                  <Radio value={10}>
                    <span>
                      <FormattedMessage id="Marketing.Orderreach" /> &nbsp;
                      {getFieldDecorator('shippingValue', {
                        initialValue: shippingBean.get('shippingValue'),
                        rules: [
                          {
                            validator: (_rule, value, callback) => {
                              
                              if(shippingBean.get('subType') !== 10 || value === 0 || value === '0') {
                                callback();
                              } else if (!value) {//shippingBean.get('shippingValue')
                                callback(
                                  (window as any).RCi18n({
                                    id: 'Marketing.Shippingvalueentered',
                                  })
                                );
                              } else if(!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) || value>= 10000) {
                                callback(
                                  (window as any).RCi18n({
                                    id: 'Marketing.0-9999',
                                  })
                                );
                              }
                              callback();
                            }
                          }
                        ],
                      })(
                        <Input
                          title={
                            (window as any).RCi18n({
                            id: 'Marketing.0-9999',
                          })
                          }
                          style={{ width: 200 }}
                          placeholder={
                            (window as any).RCi18n({
                              id: 'Marketing.0-9999',
                            })
                          }
                          value={shippingBean.get('shippingValue')}
                          onChange={(e) => {
                            this.shippingRadioOnChange(e, 'shippingValue');
                          }}
                          disabled={shippingBean.get('subType') !== 10}
                        />
                      )}
                      <span>&nbsp;{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}</span>
                    </span>
                  </Radio>
                </FormItem>
                <FormItem>
                  <Radio value={11}>
                    <span>
                      <FormattedMessage id="Marketing.Orderreach" />&nbsp;
                      {getFieldDecorator('shippingItemValue', {
                        initialValue: shippingBean.get('shippingItemValue'),
                        rules: [
                          {
                            validator: (_rule, value, callback) => {
                              if(shippingBean.get('subType') !== 11) {
                                callback()
                              }else if (!value) {//shippingBean.get('shippingItemValue')
                                callback(
                                  (window as any).RCi18n({
                                    id: 'Marketing.Itemsmustbeentered',
                                  })
                                );
                              } else if(!/^\+?[1-9]\d{0,3}?$/.test(value)) {
                                callback(
                                  (window as any).RCi18n({
                                    id: 'Marketing.1-9999',
                                  })
                                );
                              }
                              callback();
                            }
                          }
                        ],
                      })(
                        <Input style={{ width: 200 }} value={shippingBean.get('shippingItemValue')}  placeholder={'1-9999'} onChange={(e) => this.shippingRadioOnChange(e, 'shippingItemValue')} disabled={shippingBean.get('subType') !== 11} title={'1-9999'}/>)}
                      <span>&nbsp;<FormattedMessage id="Marketing.items" /></span>
                    </span>
                  </Radio>
                </FormItem>
              </RadioGroup>
            </>
          )}
        </FormItem>
        <div className="bold-title"><FormattedMessage id="Marketing.TargetConsumer" />:</div>
        <FormItem {...formItemLayout} labelAlign="left" required={true}>
          {getFieldDecorator('joinLevel', {
            // rules: [{required: true, message: 'Please select target consumer'}],
          })(
            <div>
              <RadioGroup
                // onChange={(e) => {
                //   this.levelRadioChange(e.target.value);
                // }}
                // value={level._allCustomer ? -1 : 0}
                value={shippingBean.get('joinLevel') ? Number(shippingBean.get('joinLevel')) : -1}
                onChange={(e) => {
                  this.targetCustomerRadioChange(e.target.value);
                }}
              >
                {/*<Radio value={-1}>Full platform consumer</Radio>*/}
                {/*{util.isThirdStore() && <Radio value={0}>In-store customer</Radio>}*/}
                <Radio value={-1}><FormattedMessage id="Marketing.all" /></Radio>
                <Radio value={-3}><FormattedMessage id="Marketing.Selectgroup" /></Radio>
              </RadioGroup>
              {/*{level._levelPropsShow && (*/}
              {/*  <div>*/}
              {/*    <Checkbox indeterminate={level._indeterminate} onChange={(e) => this.allLevelChecked(e.target.checked)} checked={level._checkAll}>*/}
              {/*      All Leave*/}
              {/*    </Checkbox>*/}
              {/*    <CheckboxGroup options={this.renderCheckboxOptions(customerLevel)} onChange={this.levelGroupChange} value={level._checkedLevelList} />*/}
              {/*  </div>*/}
              {/*)}*/}
            </div>
          )}
        </FormItem>

        {shippingBean.get('joinLevel') == -3 && (
          <FormItem {...formItemLayout} required={true} labelAlign="left">
            {getFieldDecorator('segmentIds', {
              initialValue: shippingBean.get('segmentIds') && shippingBean.get('segmentIds').size > 0 ? shippingBean.get('segmentIds').toJS()[0] : null,
              rules: [
                {
                  validator: (_rule, value, callback) => {
                    if (!value && shippingBean.get('joinLevel') === -3) {
                      callback(
                        (window as any).RCi18n({
                          id: 'Marketing.Pleaseselectgroup'
                        })
                      );
                    }
                    callback();
                  }
                }
              ]
            })(
              <Select
                onChange={this.selectGroupOnChange}
                style={{ width: 520 }}
                // defaultValue={232}
                // value={shippingBean.get('segmentIds') && shippingBean.get('segmentIds').size > 0 ? shippingBean.get('segmentIds').toJS()[0] : null}
              >
                {allGroups.size > 0 &&
                  allGroups.map((item) => (
                    <Select.Option key={item.get('id')} value={item.get('id')}>
                      {item.get('name')}
                    </Select.Option>
                  ))}
              </Select>
            )}
          </FormItem>
        )}
        <Row type="flex" justify="start">
          {/*<Col span={3} />*/}
          <Col span={10}>
            <Button htmlType="submit" type="primary" >
              <FormattedMessage id="Marketing.Save" />
            </Button>
            &nbsp;&nbsp;
            <Button onClick={() => history.push('/marketing-center')}><FormattedMessage id="Marketing.Cancel" /></Button>
          </Col>
        </Row>
        {loading && <Spin className="loading-spin" />}
        {/*<GoodsModal visible={this.state.goodsModal._modalVisible} selectedSkuIds={this.state.goodsModal._selectedSkuIds} selectedRows={this.state.goodsModal._selectedRows} onOkBackFun={this.skuSelectedBackFun} onCancelBackFun={this.closeGoodsModal} />*/}
      </Form>
    );
  }
  /**
   * 关闭货品选择modal
   */
   closeGoodsModal = () => {
    this.setState({ goodsModal: { _modalVisible: false } });
  };
  /**
   * 打开货品选择modal
   */
  openGoodsModal = () => {
    let { selectedRows, selectedSkuIds } = this.state;
    this.setState({
      goodsModal: {
        _modalVisible: true,
        _selectedSkuIds: selectedSkuIds,
        _selectedRows: selectedRows
      }
    });
  };

  /**
   * 将skuIds转换成gridSource
   * @param scopeIds
   * @returns {any}
   */
  makeSelectedRows = (scopeIds) => {
    let { shippingBean } = this.state;
    let goodsList = shippingBean.get('goodsList');
    if (goodsList) {
      let goodsList = shippingBean.get('goodsList');
      let selectedRows;
      if (scopeIds) {
        selectedRows = goodsList
          .get('goodsInfoPage')
          .get('content')
          .filter((goodInfo) => scopeIds.includes(goodInfo.get('goodsInfoId')));
      } else {
        selectedRows = goodsList.get('goodsInfoPage').get('content');
      }
      return fromJS(
        selectedRows.toJS().map((goodInfo) => {
          let cId = fromJS(goodsList.get('goodses'))
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('cateId');
          let cate = fromJS(goodsList.get('cates') || []).find((s) => s.get('cateId') === cId);
          goodInfo.cateName = cate ? cate.get('cateName') : '';

          let bId = fromJS(goodsList.get('goodses'))
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('brandId');
          let brand = fromJS(goodsList.get('brands') || []).find((s) => s.get('brandId') === bId);
          goodInfo.brandName = brand ? brand.get('brandName') : '';
          return goodInfo;
        })
      );
    } else {
      return fromJS([]);
    }
  };

  /**
   * 渲染等级的checkBox
   * @param levels
   * @returns {any}
   */
   renderCheckboxOptions = (levels) => {
    return levels.map((level) => {
      return {
        label: level.customerLevelName,
        value: level.customerLevelId + '',
        key: level.customerLevelId
      };
    });
  };
  
  /**
   * 处理返回结果
   * @param response
   * @private
   */
  _responseThen = (response) => {
    if (response.res.code == Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      history.push('/marketing-list');
    }
    // this.setState({ saveLoading: false });
  };
  /**
   * 已选商品的删除方法
   * @param skuId
   */
  deleteSelectedSku = (skuId) => {
    const { selectedRows, selectedSkuIds } = this.state;
    selectedSkuIds.splice(
      selectedSkuIds.findIndex((item) => item == skuId),
      1
    );
    this.setState({
      selectedSkuIds: selectedSkuIds,
      selectedRows: selectedRows.delete(selectedRows.findIndex((row) => row.get('goodsInfoId') == skuId))
    });
  };

}

export default injectIntl(FreeShippingAddForm)
