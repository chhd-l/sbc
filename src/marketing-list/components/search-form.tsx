import React from 'react';
import { Relax, IMap } from 'plume2';
import { Form, Select, Input, Button, DatePicker, Row, Col } from 'antd';
import { SelectGroup, noop, Const, RCi18n, util } from 'qmkit';
import { List } from 'immutable';
// import locale from 'antd/es/date-picker/locale/lv_LV';
import moment from 'moment';
import 'moment/locale/en-au';
import { FormattedMessage, injectIntl } from 'react-intl';

moment.locale('en-au');
type TList = List<IMap>;

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    intl: any;
    relaxProps?: {
      customerLevels: TList;
      defaultLocalDateTime: any;
      onFormChange: Function;
      onSearch: Function;
    };
  };

  state = {
    startValue: null,
    endValue: null,
    endOpen: false
  };

  static relaxProps = {
    customerLevels: ['customerLevels'],
    defaultLocalDateTime: 'defaultLocalDateTime',
    onFormChange: noop,
    onSearch: noop
  };

  render() {
    const { onFormChange, onSearch, customerLevels, defaultLocalDateTime } = this.props.relaxProps;
    const { startValue, endValue } = this.state;
    return (
      <Form className="filter-content" layout="inline">
        <Row id="input-lable-wwidth">
          <Col span="8">
            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="Marketing.CampaignName" />}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'marketingName',
                    value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span="8" id="select-group-width">
            <FormItem>
              <SelectGroup
                getPopupContainer={() => document.getElementById('page-content')}
                label={<FormattedMessage id="Marketing.PromotionType" />}
                // style={{ width: 170 }}
                defaultValue=""
                onChange={(value) => {
                  value = value === '' ? null : value;
                  onFormChange({
                    field: 'promotionType',
                    value
                  });
                }}
              >
                <Option value=""><FormattedMessage id="Marketing.Alltype" /></Option>
                <Option value="0"><FormattedMessage id="Marketing.All" /></Option>
                <Option value="1"><FormattedMessage id="Marketing.Autoship" /></Option>
                {Const.SITE_NAME !== 'MYVETRECO' && <Option value="2"><FormattedMessage id="Marketing.Clubpromotion" /></Option>}
                <Option value="3"><FormattedMessage id="Marketing.Singlepurchase" /></Option>
                <Option value="4"><FormattedMessage id="Marketing.Individualization" /></Option>
                {/* <Option value="4">满金额赠</Option>
            <Option value="5">满数量赠</Option> */}
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span="8" id="select-group-width">
            <FormItem>
              <SelectGroup
                getPopupContainer={() => document.getElementById('page-content')}
                label="Campaign Type"
                // style={{ width: 160 }}
                defaultValue="All"
                onChange={(value) => {
                  value = value === '' ? null : value;
                  onFormChange({
                    field: 'subType',
                    value
                  });
                }}
              >
                <Option value={null}><FormattedMessage id="Marketing.all" /></Option>
                <Option value={0}><FormattedMessage id="Marketing.FullAmountReduction" /></Option>
                <Option value={1}><FormattedMessage id="Marketing.FullQuantityReduction" /></Option>
                <Option value={2}><FormattedMessage id="Marketing.FullAmountDiscount" /></Option>
                <Option value={3}><FormattedMessage id="Marketing.FullQuantityDiscount" /></Option>
                {Const.SITE_NAME !== 'MYVETRECO' && <Option value={4}><FormattedMessage id="Marketing.Fullamountgift" /></Option>}
                {Const.SITE_NAME !== 'MYVETRECO' && <Option value={5}><FormattedMessage id="Marketing.Fullquantitygift" /></Option>}
                {Const.SITE_NAME !== 'MYVETRECO' && <Option value={14}><FormattedMessage id="Marketing.Fullquantityleaflet" /></Option>}
                {Const.SITE_NAME !== 'MYVETRECO' && <Option value={15}><FormattedMessage id="Marketing.Fullamountleaflet" /></Option>}
              </SelectGroup>
            </FormItem>
          </Col>{' '}
        </Row>
        <Row id="input-lable-wwidth">
          <Col span="8">
            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="Marketing.PromotionCode" />}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'promotionCode',
                    value
                  });
                }}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem>
              <DatePicker
                allowClear={true}
                disabledDate={this.disabledStartDate}
                // defaultValue={moment(new Date('2015-01-01 00:00:00'), 'YYYY-MM-DD HH:mm:ss')}
                showTime={{ format: 'HH:mm' }}
                format={Const.DATE_FORMAT}
                value={startValue}
                placeholder={
                  (window as any).RCi18n({
                    id: 'Marketing.StartTime'
                  })
                }
                onChange={this.onStartChange}
                showToday={false}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem>
              <DatePicker
                allowClear={true}
                disabledDate={this.disabledEndDate}
                // defaultValue={moment(new Date(defaultLocalDateTime), 'YYYY-MM-DD')}
                showTime={{ format: 'HH:mm' }}
                format={Const.DATE_FORMAT}
                value={endValue}
                placeholder={
                  (window as any).RCi18n({
                    id: 'Marketing.EndTime'
                  })
                }
                onChange={this.onEndChange}
                showToday={false}
              />
            </FormItem>
          </Col>
        </Row>
        <Row id="input-lable-wwidth">
          <Col span="8" id="select-group-width">
            <FormItem>
              <SelectGroup
                getPopupContainer={() => document.getElementById('page-content')}
                label={<FormattedMessage id="Marketing.CodeType" />}
                // style={{ width: 170 }}
                defaultValue=""
                onChange={(value) => {
                  value = value === '' ? null : value;
                  onFormChange({
                    field: 'publicStatus',
                    value
                  });
                }}
              >
                <Option value=""><FormattedMessage id="Marketing.All" /></Option>
                <Option value="0"><FormattedMessage id="Marketing.private" /></Option>
                <Option value="1"><FormattedMessage id="Marketing.public" /></Option>
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem>
              <Input
                addonBefore={<FormattedMessage id="Marketing.createName" />}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'createName',
                    value
                  });
                }}
              />
            </FormItem>
          </Col>
        </Row>
        <Row id="input-lable-wwidth">
          <Col span="24" style={{ textAlign: 'center' }}>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                icon="search"
                shape="round"
                onClick={(e) => {
                  e.preventDefault();
                  onSearch();
                }}
              >
                <FormattedMessage id="Marketing.Search" />
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  onStartChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DATE_FORMAT) + ':00';
    }
    const { onFormChange } = this.props.relaxProps;
    onFormChange({ field: 'startTime', value: time });
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DATE_FORMAT) + ':00';
    }
    const { onFormChange } = this.props.relaxProps;
    onFormChange({ field: 'endTime', value: time });
    this.onChange('endValue', value);
  };

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };
}
export default injectIntl(SearchForm)
