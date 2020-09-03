import React, { Component } from 'react';
import { Select, Input, Icon, Form, Col, Button } from 'antd';
import '../editcomponents/style.less';
import { Relax } from 'plume2';

import { SelectGroup, UEditor, noop } from 'qmkit';
//import { render } from 'react-dom';
//import DragTable from '../components/dragTable';
//import { FormattedMessage } from 'react-intl';
const { Option } = Select;
const FormItem = Form.Item;

let addContent = [];

@Relax
export default class StepConsent extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      pageType: 'Detail',
      content: [],
      consentTitle: true
    };
  }

  props: {
    relaxProps?: {
      loading: boolean;
      dataList: any;
      onFormChange: Function;
      consentLanguage: any;
      consentForm: any;
    };
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList',
    onFormChange: noop,
    consentLanguage: 'consentLanguage',
    consentForm: 'consentForm'
  };

  handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  pageChange = (e) => {
    this.setState({ pageType: e });
  };

  addDetail = () => {
    addContent.push(1);
    this.setState({ content: addContent });
  };

  handleConsentTitle = (e) => {
    this.setState({ consentTitle: e.key == '0' ? true : false });
  };

  componentDidMount() {
    const { consentLanguage } = this.props.relaxProps;
  }

  render() {
    const {
      onFormChange,
      consentLanguage,
      consentForm
    } = this.props.relaxProps;
    let defaultLanguage =
      consentLanguage == [] ? consentLanguage[0].description : '';
    setTimeout(() => {
      console.log(consentForm, 1111);
    });
    return (
      <div className="consent-detail">
        <div className="detail space-between">
          <div className="detail-form">
            <FormItem>
              <SelectGroup
                label="Category"
                defaultValue="Prescriber"
                style={{ width: 280 }}
                onChange={(value) => {
                  console.log(value, 12333);
                  value = value === '' ? null : value;
                  onFormChange({
                    field: 'consentCategory',
                    value
                  });
                }}
              >
                <Option value="Prescriber">Prescriber</Option>
                <Option value="Consumer">Consumer</Option>
              </SelectGroup>
            </FormItem>
            <FormItem>
              <Input
                addonBefore="Consent id"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'consentId',
                    value: value
                  });
                }}
              />
            </FormItem>
          </div>

          <div className="detail-form">
            <FormItem>
              <SelectGroup
                defaultValue="Optional"
                label="Filed type"
                style={{ width: 280 }}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  onFormChange({
                    field: 'filedType',
                    value
                  });
                }}
              >
                <Option value="Optional">Optional</Option>
                <Option value="Required">Required</Option>
                {/*{customerTypeArr.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}*/}
              </SelectGroup>
            </FormItem>
            <FormItem>
              <Input
                addonBefore="Consent code"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  onFormChange({
                    field: 'consentCode',
                    value: value
                  });
                }}
              />
            </FormItem>
          </div>

          <div className="detail-form">
            <FormItem>
              <SelectGroup
                defaultValue="Landing page"
                label="Page"
                style={{ width: 280 }}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  onFormChange({
                    field: 'consentPage',
                    value
                  });
                }}
              >
                <Option value="Landing page">Landing page</Option>
                {/*<Option value="">landing page</Option>*/}
                <Option value="Check out">check out</Option>
              </SelectGroup>
            </FormItem>
            <FormItem>
              <SelectGroup
                defaultValue="E-mail in"
                label="Consent type"
                style={{ width: 280 }}
                onChange={(value, index) => {
                  value = value === '' ? null : value;

                  onFormChange({
                    field: 'consentType',
                    value
                  });
                }}
              >
                <Option value="E-mail in">Email in</Option>
                <Option value="E-mail out">Email out</Option>
              </SelectGroup>
            </FormItem>
          </div>

          <div className="edit">
            <div className="edit-consent">
              <FormItem>
                <SelectGroup
                  defaultValue="Content"
                  label="Consent title"
                  onChange={(value, index) => {
                    value = value === '' ? null : value;
                    this.handleConsentTitle(index);
                    onFormChange({
                      field: 'consentTitleType',
                      value
                    });
                  }}
                >
                  <Option key="0" value="Content">
                    Content
                  </Option>
                  <Option key="1" value="URL">
                    URL
                  </Option>
                </SelectGroup>
              </FormItem>
            </div>
            <div className="edit-content">
              {this.state.consentTitle == true ? (
                <div>
                  <UEditor id={'edit'} content="" height="150px" />
                </div>
              ) : (
                <Input
                  placeholder="Please enter URL address"
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    /* onFormChange({
                   field: 'prescriberName',
                   value: value
                 });*/
                  }}
                />
              )}
            </div>
          </div>
          <div className="edit-add space-between-align">
            <div className="edit-content">Consent detail</div>
            <Button
              className="btn"
              type="primary"
              shape="round"
              icon="plus"
              onClick={this.addDetail}
            >
              New detail
            </Button>
          </div>
          <div className="detail-add">
            {this.state.content.map((item, i) => {
              if (i <= 4) {
                return (
                  <div className="add">
                    <div className="add-title">Detail {i + 1}</div>
                    <UEditor
                      id={'detail' + i}
                      content=""
                      height="320px"
                      key={i}
                    />
                  </div>
                );
              } else {
                return false;
              }
            })}
          </div>
        </div>
        <div className="language">
          <Select
            defaultValue={defaultLanguage}
            style={{ width: 120 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'customerTypeId',
                value
              });
            }}
          >
            {consentLanguage.map((item) => {
              return <Option value={item.id}>{item.description}</Option>;
            })}
          </Select>
        </div>
      </div>
    );
  }
}
