import React, { Component } from 'react';
import { Select, Input, TreeSelect, Icon, Form, Col, Button, message } from 'antd';
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
const { SHOW_PARENT } = TreeSelect;

let addContent = [];
let content1 = '';
let content2 = '';
let consentDetailList = [];
@Relax
export default class StepConsentDetail extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      pageType: 'Detail',
      content: [],
      TitleType: true,
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
      editorState: BraftEditor.createEditorState(null),
      editId: '',
      editor: {
        contentTitle: '',
        contentBody: '',
        sort: ''
      },
      value: ['Landing page'],
      detailList: [],
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
      formEdit: any;
      detailList: any;
      getConsentDetailDelete: Function;
      onDetailList: Function;
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
    editId: 'editId',
    detailList: 'detailList',
    getConsentDetailDelete: noop,
    onDetailList: noop
  };

  handleChange = (value) => {
    //console.log(`selected ${value}`);
  };

  pageChange = (e) => {
    this.setState({ pageType: e });
  };

  addDetail = () => {
    this.state.content.push(new Object());
    this.setState({ content: this.state.content, detailType: true });
  };

  handleConsentTitle = (e) => {
    //console.log(e.key);
    this.setState(
      { TitleType: e.key == 'Content' ? true : false },
      () => {

      }
    );
  };

  handleContent = (m, n, o) => {
    const {
      onFormChange,
      onEditSave,
      detailList,
      editId
    } = this.props.relaxProps;
    editId === '000' ? ((detailList as any) = []) : detailList;
    let list = [];
    if (o == 0) {
      this.setState({
        a: {
          ...this.state.a,
          ...detailList[0],
          contentTitle: m,
          contentBody: n,
          sort: o + 1
        }
      },()=>{

      });
    }
    if (o == 1) {
      this.setState({
        b: {
          ...this.state.b,
          ...detailList[1],
          contentTitle: m,
          contentBody: n,
          sort: o + 1
        }
      });
    }
    if (o == 2) {
      this.setState({
        c: {
          ...this.state.c,
          ...detailList[2],
          contentTitle: m,
          contentBody: n,
          sort: o + 1
        }
      });
    }
    if (o == 3) {
      this.setState({
        d: {
          ...this.state.d,
          ...detailList[3],
          contentTitle: m,
          contentBody: n,
          sort: o + 1
        }
      });
    }
    if (o == 4) {
      this.setState({
        e: {
          ...this.state.e,
          ...detailList[4],
          contentTitle: m,
          contentBody: n,
          sort: o + 1
        }
      });
    }

    list.push(
      this.state.a,
      this.state.b,
      this.state.c,
      this.state.d,
      this.state.e
    );

    list = list.filter(item =>{
      return item.contentTitle != '' || item.contentBody != ''
    });
    onEditSave(list);
    onFormChange({
      field: 'consentDetailList',
      value: list
    });
  };

  componentDidMount() {
    const { onFormChange, consentLanguage, editId } = this.props.relaxProps;
    if ( editId != '000') {
      this.setState({
        TitleType: this.state.editList.consentTitleType == 'Content' ? true : false,
        content: this.state.editList.consentDetailList,
        value: this.state.editList.consentPage.split(',')

      });
    }

    onFormChange({
      field: 'languageTypeId',
      value: consentLanguage[0] && consentLanguage[0].id
    });
    //onEditSave(editList);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { editList } = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (editList !== prevState.editList) {
      return {
        editList: nextProps.relaxProps.editList,
        detailList: nextProps.relaxProps.detailList,
        consentLanguage: nextProps.relaxProps.consentLanguage
      };
    }
    // 否则，对于state不进行任何操作
    return null;
  }

  handleEditorChange = (editorState) => {
    const { onFormChange } = this.props.relaxProps;
    this.setState({ editorState }, () => {
      let rawInfo = this.state.editorState.toRAW();
      let htmlInfo = BraftEditor.createEditorState(rawInfo).toHTML();
      onFormChange({
        field: 'consentTitle',
        value: htmlInfo
      });
    });
  };

  onTreeChange = (e) => {
    const { onFormChange } = this.props.relaxProps;
    this.setState({ value: e }, () => {
      onFormChange({
        field: 'consentPage',
        value: e.toString()
      });
    });
  };

  onCategory = (e) => {
    const { onFormChange } = this.props.relaxProps;
    if (e == 'Prescriber') {
      this.setState({ value: ['Landing page'] }, () => {
        onFormChange({
          field: 'consentPage',
          value: this.state.value.toString()
        });
      });
    } else {
      this.setState({ value: ['Landing page', 'check out'] }, () => {
        onFormChange({
          field: 'consentPage',
          value: this.state.value.toString()
        });
      });
    }
  };

  onDelete = (item,i) => {
    const { getConsentDetailDelete, onDetailList } = this.props.relaxProps;
    let content = this.state.content.filter((item, index) => {
      return index != i;
    });
    this.setState({ content: content }, () => {
      if (item.id) {
        getConsentDetailDelete(item.id);
        onDetailList(content)
        message.success('Deletion succeeded!');
      } else {
      }
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
    const treeData = [
      {
        title: 'Landing page',
        value: 'Landing page',
        key: '0'
      },
      {
        title: 'check out',
        value: 'check out',
        key: '1'
      }
    ];
    const tProps = {
      treeData,
      value: this.state.value,
      onChange: this.onTreeChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select',
      style: {
        width: '100%'
      }
    };

   /* setTimeout(()=>{
      console.log(this.state.content,11111);
      console.log(editList,22222);
    },200)*/
    return (
      <div className="consent-detail">
        <div className="detail space-between">
          <div className="detail-form">
            <FormItem>
              <SelectGroup
                label="Category"
                defaultValue={editList.consentCategory ? editList.consentCategory : 'Prescriber'}
                style={{ width: 280 }}
                onChange={(value) => {
                  this.onCategory(value);
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
              <TreeSelect {...tProps} />
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
                      ?  editList.consentTitleType
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
              {this.state.TitleType == true ? (
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
            {this.state.TitleType ? (
              <Button
                className="btn"
                type="primary"
                shape="round"
                icon="plus"
                onClick={this.addDetail}
              >
                New detail
              </Button>
            ) : null}
          </div>
          <div className="detail-add">
            {this.state.content &&
              this.state.content.map((item, i) => {
                if (i <= 4) {
                  return (
                    <div className="add" key={i}>
                      <div className="add-content space-between">
                        <div className="add-title">Detail {i + 1}</div>
                        <div className="add-i">
                          <Input
                            placeholder="Please enter  keywords"
                            defaultValue={item.contentTitle}
                            key={item.contentTitle}
                            onChange={(e) => {
                              const value = (e.target as any).value;
                              content1 = value;
                              this.handleContent(content1, content2, i);
                            }}
                          />
                        </div>
                        <div
                          className="iconfont iconDelete icon"
                          onClick={(e) => this.onDelete(item,i)}
                        ></div>
                      </div>
                      <FormItem>
                        <div className="editor-wrapper">
                          <BraftEditor
                            defaultValue={BraftEditor.createEditorState(
                              item.contentBody
                            )}
                            key={item.contentBody}
                            //value={editorState}
                            onChange={(e) => {
                              content2 = BraftEditor.createEditorState(
                                e.toRAW()
                              ).toHTML();
                              this.handleContent(content1, content2, i);
                            }}
                            className="my-editor"
                            controls={controls}
                          />
                        </div>
                      </FormItem>
                      {/*<UEditor
                      id={'detail' + i}
                      content=""
                      height="320px"
                      key={i}
                      onContentChange={(UEditor) => {
                        content2 = UEditor;
                        this.handleContent(content1, content2, i);
                      }}
                    />*/}
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
                  <Option key={item.id} value={item.id}>
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
