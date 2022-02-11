import React, { Component } from 'react';
import { Select, Button, Icon, message } from 'antd';
import './editcomponents/style.less';
import { Relax } from 'plume2';
import { List } from 'immutable';
import DragTable from './components/dragTable'
import Detail from './components/consent-detail';
import ConsentVersionModal from './components/consent-version-modal';

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
      consentCategory: any;
      pageChangeType: any;
      getConsentList: Function;
      getLanguage: Function;
      getCategories: Function;
      pageChange: Function;
      editId: any;
      editList: any;
      getParentConsentList: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    consentLanguage: 'consentLanguage',
    consentCategory: 'consentCategory',
    pageChangeType: 'pageChangeType',
    getConsentList: noop,
    getLanguage: noop,
    getCategories: noop,
    pageChange: noop,
    editId: 'editId',
    editList: 'editList',
    getParentConsentList: noop
  };

  componentDidMount() {
    const { getConsentList, getParentConsentList, getLanguage, getCategories } = this.props.relaxProps;
    getConsentList();
    getLanguage();
    getCategories();
    getParentConsentList();
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
    const { consentLanguage, consentCategory, pageChange, pageChangeType, editId, editList } = this.props.relaxProps;

    return (
      <div className="consent">
        {pageChangeType == 'List' ? (
          <React.Fragment>
            <div className="consent-select space-between">
              <div className="consent-select-text"><FormattedMessage id="Setting.Category" /></div>
              <div className="consent-select-data space-between">
                <Select defaultValue="" style={{ width: 120 }} onChange={this.handleChange}>
                  <Option value=""><FormattedMessage id="Setting.All" /></Option>
                  {consentCategory.map((item) => {
                    return <Option key={item.valueEn} value={item.valueEn}>{item.valueEn}</Option>;
                  })}
                </Select>
                <Select style={{ width: 120 }} defaultValue="" onChange={(e, v) => this.onDescription(e, v)}>
                  <Option value=""><FormattedMessage id="Setting.All" /></Option>
                  {consentLanguage.map((item) => {
                    return <Option key={item.id} value={item.id}>{item.description}</Option>;
                  })}
                </Select>
              </div>
            </div>
            <div className="space-between" style={{marginTop:15}}>
              <div>
                <Button type="primary" shape="round" icon="plus" onClick={() => pageChange('Detail', '000')}>
                  <FormattedMessage id="Setting.NewConsent" />
                </Button>
              </div>
              <div>
                <ConsentVersionModal />
              </div>
            </div>
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

