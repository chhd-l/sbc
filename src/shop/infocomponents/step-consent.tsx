import React, { Component } from 'react';
import { Select, Button, Icon } from 'antd';
import '../editcomponents/style.less';
import { Relax } from 'plume2';
import DragTable from '../components/dragTable';
import Detail from '../components/consent-detail';
import { bool } from 'prop-types';
import { noop } from 'qmkit';

const { Option } = Select;

let description = '';

@Relax
export default class StepConsent extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      //pageType: 'Detail',
      description: ''
    };
  }

  props: {
    histroy?: Object;
    relaxProps?: {
      loading: boolean;
      dataList: any;
      consentLanguage: any;
      pageChangeType: any;
      getConsentList: Function;
      getLanguage: Function;
      pageChange: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList',
    consentLanguage: 'consentLanguage',
    pageChangeType: 'pageChangeType',
    getConsentList: noop,
    getLanguage: noop,
    pageChange: noop
  };

  componentDidMount() {
    const { getConsentList, getLanguage } = this.props.relaxProps;
    getConsentList();
    getLanguage();
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  /*pageChange = (e) => {
    this.setState({ pageType: e });
  };*/

  onDescription = (e, v) => {
    console.log(e, 1111);
    console.log(v, 2222);
    this.setState({ description: v.props.children });
  };

  render() {
    const {
      consentLanguage,
      pageChange,
      pageChangeType
    } = this.props.relaxProps;
    description = consentLanguage[0] ? consentLanguage[0].description : '';

    return (
      <div className="consent">
        {pageChangeType == 'List' ? (
          <React.Fragment>
            <div className="consent-select space-between">
              <div className="consent-select-text">Category</div>
              <div className="consent-select-data space-between">
                <Select
                  defaultValue="Prescriber"
                  style={{ width: 120 }}
                  onChange={this.handleChange}
                >
                  <Option value="Prescriber">Prescriber</Option>
                  <Option value="value1">value1</Option>
                </Select>
                <Select
                  value={this.state.description}
                  style={{ width: 120 }}
                  onChange={(e, v) => this.onDescription(e, v)}
                >
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
              onClick={() => pageChange('Detail')}
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
                <Icon type="left" /> Concent edit
              </div>
            </div>
            <Detail />
          </React.Fragment>
        )}
      </div>
    );
  }
}
