import React, { Component } from 'react';
import { Select, Input, Icon, Form, Col, Button } from 'antd';
import '../editcomponents/style.less';
import { Relax } from 'plume2';
import DragTable from '../components/dragTable';
import { FormattedMessage } from 'react-intl';
import { SelectGroup, UEditor } from 'qmkit';
import { render } from 'react-dom';

const { Option } = Select;
const FormItem = Form.Item;

let addContent = [];

@Relax
export default class StepConsent extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      pageType: 'Detail',
      content: []
    };
  }

  props: {
    histroy?: Object;
    relaxProps?: {
      loading: boolean;
      dataList: any;
    };
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList'
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

  render() {
    return (
      <div className="consent-detail">
        <div className="detail space-between">
          <div className="detail-form">
            <FormItem>
              <SelectGroup
                defaultValue=""
                label="Language"
                style={{ width: 280 }}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  /*this.onFormChange({
                  field: 'customerTypeId',
                  value
                });*/
                }}
              >
                <Option value="">English</Option>
                {/*{customerTypeArr.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}*/}
              </SelectGroup>
            </FormItem>
            <FormItem>
              <Input
                addonBefore="Consent id"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  /* onFormChange({
                 field: 'prescriberName',
                 value: value
               });*/
                }}
              />
            </FormItem>
          </div>

          <div className="detail-form">
            <FormItem>
              <SelectGroup
                defaultValue=""
                label="Category"
                style={{ width: 280 }}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  /*this.onFormChange({
                  field: 'customerTypeId',
                  value
                });*/
                }}
              >
                <Option value="">Prescriber</Option>
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
                  /* onFormChange({
                 field: 'prescriberName',
                 value: value
               });*/
                }}
              />
            </FormItem>
          </div>

          <div className="detail-form">
            <FormItem>
              <SelectGroup
                defaultValue=""
                label="Consent type"
                style={{ width: 280 }}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  /*this.onFormChange({
                  field: 'customerTypeId',
                  value
                });*/
                }}
              >
                <Option value="">All</Option>
                {/*{customerTypeArr.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}*/}
              </SelectGroup>
            </FormItem>
          </div>

          <div className="edit">
            <div className="edit-content">Consent title</div>
            <UEditor id={'edit'} content="" />
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
      </div>
    );
  }
}
