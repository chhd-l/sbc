import React, { Component } from 'react';
import { Select, Button, Icon } from 'antd';
import '../editcomponents/style.less';
import { Relax, Action } from 'plume2';
import DragTable from '../components/dragTable';
import NewDetail from '../components/consent-new-detail';
import Detail from '../components/consent-detail';

//import { bool } from 'prop-types';
import { noop, SelectGroup } from 'qmkit';

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
      dataList: any;
      consentLanguage: any;
      pageChangeType: any;
      consentListSelect: any;
      getConsentList: Function;
      getLanguage: Function;
      pageChange: Function;
      getConsentListSelect: Function;
      editId: any;
    };
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList',
    consentLanguage: 'consentLanguage',
    pageChangeType: 'pageChangeType',
    consentListSelect: 'consentListSelect',
    getConsentList: noop,
    getLanguage: noop,
    pageChange: noop,
    getConsentListSelect: noop,
    editId: 'editId'
  };

  componentDidMount() {
    const { getConsentList, getLanguage } = this.props.relaxProps;
    getConsentList();
    getLanguage();
    /*getLanguage(callback=>{
      this.setState({description:callback[0] ? callback[0].description : ''})
    });*/
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
    const {
      consentLanguage,
      pageChange,
      pageChangeType,
      editId
    } = this.props.relaxProps;
    return (
      <div className="consent">
        {pageChangeType == 'List' ? (
          <React.Fragment>
            <div className="consent-select space-between">
              <div className="consent-select-text">Category</div>
              <div className="consent-select-data space-between">
                <Select
                  defaultValue="All"
                  style={{ width: 120 }}
                  onChange={this.handleChange}
                >
                  <Option value="">All</Option>
                  <Option value="Prescriber">Prescriber</Option>
                  <Option value="Consumer">Consumer</Option>
                </Select>
                <Select
                  style={{ width: 120 }}
                  defaultValue="All"
                  onChange={(e, v) => this.onDescription(e, v)}
                >
                  <Option value="">All</Option>
                  {consentLanguage.map((item) => {
                    return <Option value={item.id}>{item.description}</Option>;
                  })}
                </Select>
              </div>
            </div>
            <Button
              className="btn"
              type="primary"
              shape="round"
              icon="plus"
              onClick={() => pageChange('Detail', '000')}
            >
              New consent
            </Button>
            <div id="consent" className="consent-table">
              <DragTable />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div onClick={() => pageChange('List')}>
              <div className="detail-title">
                <Icon type="left" /> Consent edit
              </div>
            </div>
            {editId != null ? <Detail editId={editId}/> : null}
          </React.Fragment>
        )}
      </div>
    );
  }
}
