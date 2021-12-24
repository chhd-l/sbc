import React, { Component } from 'react';
import { Select, Button, Icon } from 'antd';
import './editcomponents/style.less';
import { Relax } from 'plume2';
import DragTable from './components/dragTable'
import Detail from './components/consent-detail';

//import { bool } from 'prop-types';
import { noop, SelectGroup, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';

const { Option } = Select;

@Relax
export default class StepConsent extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      //pageType: 'Detail',
      listSelect: {
        languageTypeId: '',
        consentCategory: ''
      }
    };
  }

  props: {
    histroy?: Object;
    relaxProps?: {
      loading: boolean;
      consentLanguage: any;
      pageChangeType: any;
      getConsentList: Function;
      getLanguage: Function;
      pageChange: Function;
      editId: any;
      editList: any;
    };
  };

  static relaxProps = {
    loading: 'loading',
    consentLanguage: 'consentLanguage',
    pageChangeType: 'pageChangeType',
    getConsentList: noop,
    getLanguage: noop,
    pageChange: noop,
    editId: 'editId',
    editList: 'editList'
  };

  componentDidMount() {
    const { getConsentList, getLanguage } = this.props.relaxProps;
    getConsentList();
    getLanguage();
  }

  handleChange = (value) => {
    const { getConsentList } = this.props.relaxProps;
    this.setState(
      {
        listSelect: { ...this.state.listSelect, consentCategory: value }
      },
      () => {
        getConsentList(this.state.listSelect);
      }
    );
  };

  onDescription = (e, v) => {
    const { getConsentList } = this.props.relaxProps;
    this.setState(
      {
        listSelect: { ...this.state.listSelect, languageTypeId: e }
      },
      () => {
        getConsentList(this.state.listSelect);
      }
    );
  };

  render() {
    const { consentLanguage, pageChange, pageChangeType, editId, editList } = this.props.relaxProps;

    return (
      <div className="consent">
        {pageChangeType == 'List' ? (
          <React.Fragment>
            <div className="consent-select space-between">
              <div className="consent-select-text"><FormattedMessage id="Setting.Category" /></div>
              <div className="consent-select-data space-between">
                <Select defaultValue="" style={{ width: 120 }} onChange={this.handleChange}>
                  <Option value=""><FormattedMessage id="Setting.All" /></Option>
                  <Option value="Prescriber"><FormattedMessage id="Setting.Prescriber" /></Option>
                  <Option value="Consumer"><FormattedMessage id="Setting.Consumer" /></Option>
                </Select>
                <Select style={{ width: 120 }} defaultValue="" onChange={(e, v) => this.onDescription(e, v)}>
                  <Option value=""><FormattedMessage id="Setting.All" /></Option>
                  {consentLanguage.map((item) => {
                    return <Option value={item.id}>{item.description}</Option>;
                  })}
                </Select>
              </div>
            </div>
            <Button className="btn" style={{ width: 140 }} type="primary" shape="round" icon="plus" onClick={() => pageChange('Detail', '000')}>
              <FormattedMessage id="Setting.NewConsent" />
            </Button>
            <div id="consent" className="consent-table">
              <DragTable />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div onClick={() => pageChange('List')}>
              <div className="detail-title">
                <Icon type="left" /> {editId == '000' ? RCi18n({id:"Setting.AddConsent"}) : RCi18n({id:"Setting.EditConsent"})}
              </div>
            </div>
            {/*{editList.id != null ? <Detail /> : <Detail />}*/}

            {editList.id || editId == '000' ? <Detail /> : null}
          </React.Fragment>
        )}
      </div>
    );
  }
}

