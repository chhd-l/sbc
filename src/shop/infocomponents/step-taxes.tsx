import React, { Component } from 'react';
import { Select, Button, Icon } from 'antd';
import '../editcomponents/style.less';
import { Relax, Action } from 'plume2';
import TaxesTable from '../components/taxes-table';
import TaxesAdd from '../components/taxes-add';
import { noop } from 'qmkit';

@Relax
export default class StepTaxes extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
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
      //getConsentListSelect: Function;
      editId: any;
      editList: any;
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
    //getConsentListSelect: noop,
    editId: 'editId',
    editList: 'editList'
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
    const { consentLanguage, pageChange, pageChangeType, editId, editList } = this.props.relaxProps;

    return (
      <div className="consent">
        <div className="taxes space-between">
          <Button className="btn" type="primary" shape="round" onClick={() => pageChange('Detail', '000')}>
            Add tax zone
          </Button>
          <Button className="btn" shape="round" icon="setting" onClick={() => pageChange('Detail', '000')}>
            Tax setting
          </Button>
        </div>
        <div id="consent" className="consent-table">
          <TaxesTable />
          <TaxesAdd />
        </div>
      </div>
    );
  }
}
