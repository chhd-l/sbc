import React, { Component } from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Input, Select, Button, Menu, Dropdown, DatePicker, Row, Col, message, Cascader } from 'antd';
import { noop, AuthWrapper, checkAuth, Headline, history, SelectGroup } from 'qmkit';
import Modal from 'antd/lib/modal/Modal';
import { IList } from 'typings/globalType';
import { FormattedMessage, injectIntl } from 'react-intl';
import { RCi18n } from 'qmkit';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const InputGroup = Input.Group;
/**
 * 订单查询头
 */
@Relax
class SearchHead extends Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      onBatchAudit: Function;
      tab: IMap;
      dataList: IList;
      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      onExportModalHide: Function;
      exportModalData: IMap;
      form:any
    };
  };

  static relaxProps = {
    onSearch: noop,
    onBatchAudit: noop,
    tab: 'tab',
    form:'form',
    dataList: 'dataList',
    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    onExportModalHide: noop,
    exportModalData: 'exportModalData'
  };

  constructor(props) {
    super(props);

    this.state = {
      felinRecoId: '',
      buyerOptions: 'PO name',
      fillDate: null,
      buyerOptionsValue: '',
      goodsNames: '',
    };
  }
  // static getDerivedStateFromProps({relaxProps}, prevState) {
  //   let form =relaxProps.form.toJS();
  //   // Store prevId in state so we can compare when props change.
  //   // Clear out previously-loaded data (so we don't render stale stuff).
  //   if (form.felinRecoId !== prevState.felinRecoId) {
  //     return {
  //       felinRecoId: form.felinRecoId,
  //       fillDate: form.fillDate?moment(form.fillDate,'YYYY-MM-DD'):null,
  //       buyerOptions: form.consumerEmail?('PO e-mail'):('PO name'),
  //       buyerOptionsValue:form.consumerEmail?form.consumerEmail:form.consumerName

  //     };
  //   }

  //   // No state update necessary
  //   return null;
  // }

  render() {
    const { onSearch, tab, form, onExportModalHide } = this.props.relaxProps;
    const { felinRecoId,goodsNames ,fillDate,buyerOptionsValue} = this.state;
    let hasMenu = false;
    if ((tab.get('key') == 'flowState-INIT' && checkAuth('fOrderList002')) || checkAuth('fOrderList004')) {
      hasMenu = true;
    }

    const menu = (
      <Menu>
        {tab.get('key') == 'flowState-INIT' && (
          <Menu.Item>
            <AuthWrapper functionName="fOrderList002">
              <a target="_blank" href="javascript:;" onClick={() => this._showBatchAudit()}>
                <FormattedMessage id="order.batchReview" />
              </a>
            </AuthWrapper>
          </Menu.Item>
        )}
        <Menu.Item>
          <AuthWrapper functionName="fOrderList004">
            <a href="javascript:;" onClick={() => this._handleBatchExport()}>
              <FormattedMessage id="order.batchExport" />
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        {/*<div className="space-between-align-items">*/}
        {/*  <Headline title="Prescription portal" />*/}
        {/*  {sessionStorage.getItem('PrescriberType') != null ? (*/}
        {/*    <Button*/}
        {/*      type="primary"*/}
        {/*      icon="plus"*/}
        {/*      htmlType="submit"*/}
        {/*      shape="round"*/}
        {/*      style={{ textAlign: 'center', marginRight: '20px' }}*/}
        {/*      onClick={(e) => {*/}
        {/*        history.push('/recomm-page-detail-new');*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      <span>New</span>*/}
        {/*    </Button>*/}
        {/*  ) : null}*/}
        {/*</div>*/}
        <div id="inputs">
          <Form className="filter-content" layout="inline">
            <Row>
              <Col span={8}>
                <FormItem>
                  <Input
                    value={felinRecoId}
                    addonBefore={RCi18n({ id: 'Prescriber.Recommendation No' })}
                    onChange={(e) => {
                      console.log((e.target as any).value)
                      this.setState({
                        felinRecoId: (e.target as any).value
                      });
                    }}
                  />
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem>
                  <Input
                    addonBefore={this._renderBuyerOptionSelect()}
                    value={buyerOptionsValue}
                    onChange={(e) => {
                      this.setState({
                        buyerOptionsValue: (e.target as any).value
                      });
                    }}
                  />
                </FormItem>
              </Col>

              <Col span={8}>
                {/*商品名称、SKU编码*/}
                <FormItem>
                  <Input
                  value={goodsNames}
                    addonBefore={RCi18n({ id: 'Prescriber.Product name' })}
                    onChange={(e) => {
                      this.setState({
                        goodsNames: (e.target as any).value
                      });
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={8}>
                {/*商品名称、SKU编码*/}
                <FormItem>
                  <InputGroup compact>
                    <Input  style={{width: '47%', textAlign: 'center' }} readOnly title={RCi18n({id:'Order.CreatedTime'})} defaultValue={RCi18n({id:'Order.CreatedTime'})} />
                    <DatePicker
                    value={fillDate}
                      style={{ width: '53%' }}
                      onChange={(date, dateString) => {
                        this.setState({
                          fillDate: date
                        });
                      }}
                    />
                  </InputGroup>
                </FormItem>
              </Col>


              <Col span={24} style={{ textAlign: 'center' }}>
                <FormItem>
                  {/* {sessionStorage.getItem('PrescriberType') != null ? ( */}
                  <Button
                    type="primary"
                    icon="plus"
                    htmlType="submit"
                    shape="round"
                    style={{ textAlign: 'center', marginRight: '20px' }}
                    onClick={(e) => {
                      history.push('/recommendation-add');
                    }}
                  >
                    <span><FormattedMessage id="Prescriber.New" /></span>
                  </Button>
                  {/* ) : null} */}


                  <Button
                    type="primary"
                    icon="search"
                    htmlType="submit"
                    shape="round"
                    style={{ textAlign: 'center', marginTop: '20px' }}
                    onClick={(e) => {
                      e.preventDefault();
                      const { felinRecoId, buyerOptions, goodsNames, buyerOptionsValue, fillDate } = this.state;
                      const params = {
                        felinRecoId: felinRecoId || null,
                        [buyerOptions == 'PO name' ? 'consumerName' : 'consumerEmail']: buyerOptionsValue || null,
                        goodsNames: goodsNames || null,
                        fillDate: (fillDate&&moment(fillDate).format('YYYY-MM-DD')) || null
                      };
                      onSearch(params);
                    }}
                  >
                    <span>
                      <FormattedMessage id="Prescriber.search" />
                    </span>
                  </Button>

                </FormItem>
              </Col>
            </Row>
          </Form>

          {/*{hasMenu && (
            <div className="handle-bar">
              <Dropdown
                overlay={menu}
                placement="bottomLeft"
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
              >
                <Button>
                  <FormattedMessage id="order.bulkOperations" />{' '}
                  <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          )}*/}
        </div>

        {/*<ExportModal
          data={exportModalData}
          onHide={onExportModalHide}
          handleByParams={exportModalData.get('exportByParams')}
          handleByIds={exportModalData.get('exportByIds')}
        />*/}
      </div>
    );
  }

  _renderBuyerOptionSelect = () => {
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        defaultValue={RCi18n({ id: 'Prescriber.PO Name' })}
        onChange={(value, a) => {
          this.setState({
            buyerOptions: value
          });
        }}
        value={this.state.buyerOptions}
        style={styles.label}
      >
        <Option value="PO name" title={RCi18n({id:'Prescriber.PO Name'})}> <FormattedMessage id="Prescriber.PO Name" /></Option>
        <Option value="PO e-mail" title={RCi18n({id:'Prescriber.PO E-mail'})}><FormattedMessage id="Prescriber.PO E-mail" /></Option>
      </Select>
    );
  };



  /**
   * 批量审核确认提示
   * @private
   */
  _showBatchAudit = () => {
    const { onBatchAudit, dataList } = this.props.relaxProps;
    const checkedIds = dataList
      .filter((v) => v.get('checked'))
      .map((v) => v.get('id'))
      .toJS();

    if (checkedIds.length == 0) {
      message.error(RCi18n({ id: 'Prescriber.needsToBeOperated' }));
      return;
    }

    const confirm = Modal.confirm;
    const title = RCi18n({ id: 'Prescriber.audit' });
    const content = RCi18n({ id: 'Prescriber.confirmAudit' });
    confirm({
      title: title,
      content: content,
      onOk() {
        onBatchAudit();
      },
      onCancel() { }
    });
  };

  _handleBatchExport() {
    const { onExportByParams, onExportByIds } = this.props.relaxProps;
    this.props.relaxProps.onExportModalChange({
      visible: true,
      byParamsTitle: RCi18n({ id: 'exportFilterOrder' }),
      byIdsTitle: RCi18n({ id: 'exportSelectedOrder' }),
      exportByParams: onExportByParams,
      exportByIds: onExportByIds
    });
  }
}

export default injectIntl(SearchHead);

const styles = {
  label: {
    width: 160,
    textAlign: 'center'
  },
  wrapper: {
    width: 185
  }
} as any;
