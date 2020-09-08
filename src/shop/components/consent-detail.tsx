import React, { Component } from 'react';
import { Select, Input, Icon, Form, Col, Button } from 'antd';
import '../editcomponents/style.less';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';

import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';

import { SelectGroup, UEditor, noop } from 'qmkit';
//import { render } from 'react-dom';
//import DragTable from '../components/dragTable';
//import { FormattedMessage } from 'react-intl';
const { Option } = Select;
const FormItem = Form.Item;

let addContent = [];
let content1 = '';
let content2 = '';

@Relax
export default class StepConsentDetail extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      pageType: 'Detail',
      content: [],
      consentTitle: true,
      detailType: false,
      a: { contentTitle: '', contentBody: '', sort: '' },
      b: { contentTitle: '', contentBody: '', sort: '' },
      c: { contentTitle: '', contentBody: '', sort: '' },
      d: { contentTitle: '', contentBody: '', sort: '' },
      e: { contentTitle: '', contentBody: '', sort: '' },
      category: '',
      editList: {},
      consentLanguage: [],
      // 创建一个空的editorState作为初始值
      editorState: BraftEditor.createEditorState(null)
    };
  }

  props: {
    relaxProps?: {
      loading: boolean;
      dataList: any;
      onFormChange: Function;
      consentLanguage: any;
      consentForm: any;
      refDetailEditor: Function;
      onEditSave: Function;
      editList: any;
      editId: any;
    };
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList',
    onFormChange: noop,
    consentLanguage: 'consentLanguage',
    consentForm: 'consentForm',
    refDetailEditor: noop,
    onEditSave: noop,
    editList: 'editList',
    editId: 'editId'
  };

  handleChange = (value) => {
    //console.log(`selected ${value}`);
  };

  pageChange = (e) => {
    this.setState({ pageType: e });
  };

  addDetail = () => {
    addContent.push(1);
    this.setState({ content: addContent, detailType: true });
  };

  handleConsentTitle = (e) => {
    this.setState({ consentTitle: e.key == '0' ? true : false });
  };

  handleContent = (m, n, o) => {
    const { onFormChange } = this.props.relaxProps;
    let list = [];
    if (o == 0) {
      this.setState({
        a: { ...this.state.a, contentTitle: m, contentBody: n, sort: o + 1 }
      });
    }
    if (o == 1) {
      this.setState({
        b: { ...this.state.b, contentTitle: m, contentBody: n, sort: o + 1 }
      });
    }
    if (o == 2) {
      this.setState({
        c: { ...this.state.c, contentTitle: m, contentBody: n, sort: o + 1 }
      });
    }
    if (o == 3) {
      this.setState({
        d: { ...this.state.d, contentTitle: m, contentBody: n, sort: o + 1 }
      });
    }
    if (o == 4) {
      this.setState({
        e: { ...this.state.e, contentTitle: m, contentBody: n, sort: o + 1 }
      });
    }

    list.push(
      this.state.a,
      this.state.b,
      this.state.c,
      this.state.d,
      this.state.e
    );
    onFormChange({
      field: 'consentDetailList',
      value: list
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { editList, consentLanguage } = nextProps;

    // 当传入的type发生变化的时候，更新state
    if (editList !== prevState.editList) {
      return {
        editList: nextProps.relaxProps.editList,
        consentLanguage: nextProps.relaxProps.consentLanguage
      };
    }
    // 否则，对于state不进行任何操作
    return null;
  }

  componentDidMount() {
    const { onEditSave } = this.props.relaxProps;
    onEditSave(this.state.editList);
    this.setState({ editorState: this.state.editList.consentTitle });
  }
  handleEditorChange = (editorState) => {
    const { onFormChange } = this.props.relaxProps;

    this.setState({ editorState }, () => {
      let rawInfo = this.state.editorState.toRAW();
      let htmlInfo = BraftEditor.createEditorState(rawInfo).toHTML();
      console.log('Html', htmlInfo);
      console.log('Raw', rawInfo);
      onFormChange({
        field: 'consentTitle',
        value: htmlInfo
      });
    });
  };

  render() {
    const { onFormChange, editId } = this.props.relaxProps;
    const { editList, consentLanguage, editorState } = this.state;
    const htmlString = editList.consentTitle ? editList.consentTitle : '';
    const editor = BraftEditor.createEditorState(htmlString);
    const controls = [
      'bold',
      'italic',
      'underline',
      'text-color',
      'separator',
      'link',
      'separator'
    ];

    return (
      <div className="consent-detail">
        <div className="detail space-between">
          <div className="detail-form">
            <FormItem>
              <SelectGroup
                label="Category"
                defaultValue={
                  editList.consentCategory
                    ? editList.consentCategory
                    : 'Prescriber'
                }
                style={{ width: 280 }}
                onChange={(value) => {
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
                defaultValue={editList.consentId ? editList.consentId : ''}
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
                defaultValue={
                  editList.filedType ? editList.filedType : 'Optional'
                }
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
                defaultValue={editList.consentCode ? editList.consentCode : ''}
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
                defaultValue={
                  editList.consentPage ? editList.consentPage : 'Landing page'
                }
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
                defaultValue={
                  editList.consentType ? editList.consentType : 'E-mail in'
                }
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
                  defaultValue={
                    editList.consentTitleType
                      ? editList.consentTitleType
                      : 'Content'
                  }
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
                  <Option key="Content" value="Content">
                    Content
                  </Option>
                  <Option key="URL" value="URL">
                    URL
                  </Option>
                </SelectGroup>
              </FormItem>
            </div>
            <div className="edit-content">
              {this.state.consentTitle == true ? (
                <FormItem>
                  <div className="editor-wrapper">
                    <BraftEditor
                      defaultValue={editor}
                      //value={editorState}
                      onChange={this.handleEditorChange}
                      className="my-editor"
                      controls={controls}
                    />
                  </div>
                </FormItem>
              ) : (
                /*<div>
                  <UEditor
                    id={'edit'}
                    content={editList.consentTitle ? editList.consentTitle : ''}
                    height="150px"
                    onContentChange={(UEditor) => {
                      onFormChange({
                        field: 'consentTitle',
                        value: UEditor
                      });
                    }}
                  />
                </div>*/
                <Input
                  placeholder="Please enter URL address"
                  defaultValue={
                    editList.consentTitle ? editList.consentTitle : ''
                  }
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    onFormChange({
                      field: 'consentTitle',
                      value: value
                    });
                  }}
                />
              )}
            </div>
          </div>

          <div className="edit-add">
            {this.state.detailType == true ? (
              <div className="edit-add-content space-between-align">
                <div className="edit-content">Consent detail</div>
              </div>
            ) : null}
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
                    <div className="add-content space-between">
                      <div className="add-title">Detail {i + 1}</div>
                      <div className="add-i">
                        <Input
                          placeholder="Please enter URL keywords"
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            content1 = value;
                            this.handleContent(content1, content2, i);
                          }}
                        />
                      </div>
                    </div>
                    <UEditor
                      id={'detail' + i}
                      content=""
                      height="320px"
                      key={i}
                      onContentChange={(UEditor) => {
                        content2 = UEditor;
                        this.handleContent(content1, content2, i);
                      }}
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
            defaultValue={
              editList.languageTypeId
                ? editList.languageTypeId
                : consentLanguage[0]
                ? consentLanguage[0].description
                : []
            }
            style={{ width: 120 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'languageTypeId',
                value
              });
            }}
          >
            {consentLanguage[0] &&
              consentLanguage.map((item, i) => {
                return (
                  <Option key={i} value={item.id}>
                    {item.description}
                  </Option>
                );
              })}
          </Select>
        </div>
      </div>
    );
  }
}
