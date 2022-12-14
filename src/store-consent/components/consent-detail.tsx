import React, { Component } from 'react';
import { Select, Input, TreeSelect, InputNumber, Form, Row, Col, Button, message } from 'antd';
import '../editcomponents/style.less';
import { Relax } from 'plume2';
import { List } from 'immutable';

import { SelectGroup, noop, ReactEditor, RCi18n } from 'qmkit';
const { Option } = Select;
const FormItem = Form.Item;
const { SHOW_PARENT } = TreeSelect;
import { FormattedMessage, injectIntl } from 'react-intl';

type TParentConsentItem = {
  id: number;
  consentId: string;
  consentDesc: string;
};

@Relax
class StepConsentDetail extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      pageType: 'Detail',
      content: [],
      TitleType: true,
      detailType: false,
      category: '',
      editList: {},
      consentLanguage: [],
      // 创建一个空的editorState作为初始值
      editId: '',
      editor: {
        contentTitle: '',
        contentBody: '',
        sort: ''
      },
      value: ['Landing page'],
      detailList: [],
      consentForm: {},
      _detailType: true
    };
  }

  props: {
    relaxProps?: {
      loading: boolean;
      dataList: any;
      onFormChange: Function;
      consentLanguage: any;
      consentCategory: any;
      consentForm: any;
      refDetailEditor: Function;
      onEditSave: Function;
      editList: any;
      editId: any;
      formEdit: any;
      detailList: any;
      getConsentDetailDelete: Function;
      onDetailList: Function;
      parentConsentList: List<TParentConsentItem>;
    };
    intl: any;
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList',
    onFormChange: noop,
    consentLanguage: 'consentLanguage',
    consentCategory: 'consentCategory',
    consentForm: 'consentForm',
    refDetailEditor: noop,
    onEditSave: noop,
    editList: 'editList',
    editId: 'editId',
    detailList: 'detailList',
    getConsentDetailDelete: noop,
    onDetailList: noop,
    parentConsentList: 'parentConsentList'
  };

  handleChange = (value) => {};

  pageChange = (e) => {
    this.setState({ pageType: e });
  };

  addDetail = () => {
    let obj = {
      contentTitle: '',
      contentBody: '',
      uuid: (Math.rdmValue() * 16).toString(16).substr(2)
    };
    if (this.state.content.length <= 4) {
      this.state.content.push(obj);
      this.setState({ content: this.state.content, detailType: true });
    }
  };

  handleConsentTitle = (e) => {
    const { editList } = this.props.relaxProps;

    this.setState({
      TitleType: e.key == 'Content' ? true : false,
      _detailType: e.key == 'Content' ? true : false
    });
  };

  handleContent = (m, o) => {
    const { onFormChange, onEditSave, detailList, editId, consentForm } = this.props.relaxProps;
    // editId == '000' ? ((detailList as any) = []) : detailList;
    // delete m['uuid'];
    let list = [...this.state.content];
    list[o] = m;
    consentForm.consentDetailList = list;
    onFormChange(consentForm);
    return;
  };

  componentDidMount() {
    const { editId, consentLanguage, consentForm, onFormChange } = this.props.relaxProps;

    if (editId != '000') {
      this.setState({
        TitleType: this.state.editList.consentTitleType == 'Content' ? true : false,
        content: this.state.editList.consentDetailList.map((item) => {
          return { ...item, uuid: (Math.rdmValue() * 16).toString(16).substr(2) };
        }),
        value: this.state.editList.consentPage.split(',')
      });
    } else {
      consentForm.languageTypeId = consentLanguage[0] && consentLanguage[0].id;
      onFormChange(consentForm);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { editList } = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (editList !== prevState.editList) {
      return {
        consentForm: nextProps.relaxProps.consentForm,
        editList: nextProps.relaxProps.editList,
        detailList: nextProps.relaxProps.detailList,
        consentLanguage: nextProps.relaxProps.consentLanguage
      };
    }
    // 否则，对于state不进行任何操作
    return null;
  }

  handleEditorChange = (htmlInfo) => {
    const { onFormChange, consentForm } = this.props.relaxProps;
    consentForm.consentTitle = htmlInfo;
    onFormChange(consentForm);
  };

  onTreeChange = (e) => {
    const { onFormChange, consentForm } = this.props.relaxProps;
    this.setState({ value: e }, () => {
      consentForm.consentPage = e.toString();
      onFormChange(consentForm);
      /* onFormChange({
         field: 'consentPage',
         value: e.toString()
       });*/
    });
  };

  onCategory = (e) => {
    const { onFormChange, consentForm } = this.props.relaxProps;
    if (e == 'Prescriber') {
      this.setState({ value: ['Landing page'] }, () => {
        consentForm.consentPage = this.state.value.toString();
        onFormChange(consentForm);
        /*onFormChange({
          field: 'consentPage',
          value: this.state.value.toString()
        });*/
      });
    } else {
      this.setState({ value: ['Landing page', 'check out'] }, () => {
        consentForm.consentPage = this.state.value.toString();
        onFormChange(consentForm);
        /*onFormChange({
          field: 'consentPage',
          value: this.state.value.toString()
        });*/
      });
    }
  };

  onDelete = (item, i) => {
    const { getConsentDetailDelete, onDetailList, consentForm, onFormChange } = this.props.relaxProps;
    let _content = [...this.state.content];
    _content.splice(i, 1);
    this.setState(
      {
        content: _content
      },
      () => {
        if (item.id) {
          getConsentDetailDelete(item.id);
          onDetailList(_content);
          consentForm.consentDetailList = _content;
          onFormChange(consentForm);

          message.success((window as any).RCi18n({ id: 'Setting.Deletionsucceeded' }) + '!');
        }
      }
    );
    return;
  };

  getDetailForm = (e) => {
    this.setState({});
  };

  render() {
    const { onFormChange, editId, consentForm, parentConsentList, consentCategory } = this.props.relaxProps;
    const { editList, consentLanguage, editorState } = this.state;
    const htmlString = editList.consentTitle ? editList.consentTitle : '';
    const editor = htmlString; // BraftEditor.createEditorState(htmlString);
    const controls = [
      /*'bold',
      'italic',
      'underline',
      'separator',*/
      'text-color',
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
      searchPlaceholder: (window as any).RCi18n({ id: 'Setting.Pleaseselect' }),
      style: {
        width: '100%'
      }
    };
    console.log('consent consent', editList);
    return (
      <div className="consent-detail">
        <Row gutter={[24, 4]}>
          <Col span={8}>
            <FormItem className="input-consent">
              <SelectGroup
                label={(window as any).RCi18n({ id: 'Setting.Category' })}
                defaultValue={editList.consentCategory ? editList.consentCategory : 'Prescriber'}
                style={{ width: 280 }}
                onChange={(value) => {
                  this.onCategory(value);
                  consentForm.consentCategory = value;
                  onFormChange(consentForm);
                  /*onFormChange({
                    field: 'consentCategory',
                    value
                  })*/
                }}
              >
                {consentCategory.map((item) => (
                  <Option key={item.valueEn} value={item.valueEn}>{item.valueEn}</Option>
                ))}
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className="input-consent">
              <SelectGroup
                defaultValue={editList.filedType ? editList.filedType : 'Optional'}
                label={(window as any).RCi18n({ id: 'Setting.Fieldtype' })}
                style={{ width: 280 }}
                onChange={(value) => {
                  value = value === '' ? null : value;
                  consentForm.filedType = value;
                  onFormChange(consentForm);
                }}
              >
                <Option value="Optional">
                  <FormattedMessage id="Setting.Optional" />
                </Option>
                <Option value="Required">
                  <FormattedMessage id="Setting.Required" />
                </Option>
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className="input-consent">
              <SelectGroup
                defaultValue={editList.consentType ? editList.consentType : (window as any).RCi18n({ id: 'Setting.E-mailin' })}
                label={(window as any).RCi18n({ id: 'Setting.Consenttype' })}
                style={{ width: 280 }}
                onChange={(value, index) => {
                  value = value === '' ? null : value;
                  consentForm.consentType = value;
                  onFormChange(consentForm);
                }}
              >
                <Option value="0">&nbsp;</Option>
                <Option value="E-mail in">
                  <FormattedMessage id="Setting.Emailin" />
                </Option>
                <Option value="E-mail out">
                  <FormattedMessage id="Setting.Emailout" />
                </Option>
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className="input-consent">
              <Input
                addonBefore={(window as any).RCi18n({ id: 'Setting.Consentid' })}
                defaultValue={editList.consentId ? editList.consentId : ''}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  consentForm.consentId = value;
                  onFormChange(consentForm);
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className="input-consent">
              <Input
                addonBefore={(window as any).RCi18n({ id: 'Setting.Consentcode' })}
                defaultValue={editList.consentCode ? editList.consentCode : ''}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  consentForm.consentCode = value;
                  onFormChange(consentForm);
                  /*onFormChange({
                    field: 'consentCode',
                    value: value
                  });*/
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className="input-consent">
              <SelectGroup
                defaultValue={editList.parentId ? editList.parentId : ''}
                label={RCi18n({id:"Setting.ParentConsent"})}
                style={{ width: 280 }}
                optionLabelProp="label"
                onChange={(value, index) => {
                  value = value === '' ? null : value;
                  consentForm.parentId = value;
                  onFormChange(consentForm);
                }}
              >
                <Option value="" label="">&nbsp;</Option>
                {parentConsentList.toJS().map(item => (
                  <Option value={item.id} key={item.id} label={item.consentDesc}>
                    <div><b>{item.consentDesc}</b></div>
                    <div>{item.consentId}</div>
                  </Option>
                ))}
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className="input-consent">
              <Input.Group compact>
                <Input value={RCi18n({id:"Setting.ConsentVersion"})} disabled style={{width: '30%', textAlign: 'center', color:'rgba(0, 0, 0, 0.65)', backgroundColor: '#fff', cursor: 'default'}} />
                <InputNumber
                  style={{width: '70%'}}
                  min={1}
                  step={1}
                  precision={0}
                  defaultValue={editList.consentVersion ? editList.consentVersion : null}
                  onChange={(value) => {
                    consentForm.consentVersion = value;
                    onFormChange(consentForm);
                  }}
                />
              </Input.Group>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className="input-consent">
              <Input
                addonBefore={RCi18n({id:'Setting.ConsentDesc'})}
                defaultValue={editList.consentDesc ? editList.consentDesc : ''}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  consentForm.consentDesc = value;
                  onFormChange(consentForm);
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className="input-consent">
              <Input
                addonBefore={RCi18n({id:"Setting.ConsentGroup"})}
                defaultValue={editList.consentGroup ? editList.consentGroup : ''}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  consentForm.consentGroup = value;
                  onFormChange(consentForm);
                }}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className="input-consent">
              <SelectGroup
                defaultValue={editList.communicationType ? editList.communicationType : ''}
                label={RCi18n({id:'PetOwner.PreferChannel'})}
                style={{ width: 280 }}
                onChange={(value, index) => {
                  value = value === '' ? null : value;
                  consentForm.communicationType = value;
                  onFormChange(consentForm);
                }}
              >
                <Option value="">&nbsp;</Option>
                <Option value="email">{RCi18n({id:'PetOwner.Email'})}</Option>
                <Option value="phone">{RCi18n({id:'PetOwner.Phone'})}</Option>
                <Option value="print">{RCi18n({id:'PetOwner.Message'})}</Option>
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className="input-consent">
              <SelectGroup
                defaultValue={editList.pushOktaFlag ? editList.pushOktaFlag : 0}
                label={RCi18n({id:"Setting.PushToOkta"})}
                style={{ width: 280 }}
                onChange={(value, index) => {
                  value = value === '' ? null : value;
                  consentForm.pushOktaFlag = value;
                  onFormChange(consentForm);
                }}
              >
                <Option value={1}>{RCi18n({id:'Setting.Yes'})}</Option>
                <Option value={0}>{RCi18n({id:'Setting.No'})}</Option>
              </SelectGroup>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem className="input-consent">
              <SelectGroup
                defaultValue={editList.sendEmailFlag ? editList.sendEmailFlag : 0}
                label={RCi18n({id:"Setting.SendEmail"})}
                style={{ width: 280 }}
                onChange={(value, index) => {
                  value = value === '' ? null : value;
                  consentForm.sendEmailFlag = value;
                  onFormChange(consentForm);
                }}
              >
                <Option value={1}>{RCi18n({id:'Setting.Yes'})}</Option>
                <Option value={0}>{RCi18n({id:'Setting.No'})}</Option>
              </SelectGroup>
            </FormItem>
          </Col>
        </Row>
        <div className="detail">
          <div className="edit">
            <div className="edit-consent">
              <FormItem className="input-consent">
                <SelectGroup
                  defaultValue={editList.consentTitleType ? editList.consentTitleType : (window as any).RCi18n({ id: 'Setting.Content' })}
                  label={(window as any).RCi18n({ id: 'Setting.Consenttitle' })}
                  onChange={(value, index) => {
                    value = value === '' ? null : value;
                    this.handleConsentTitle(index);
                    consentForm.consentTitleType = value;
                    onFormChange(consentForm);
                  }}
                >
                  <Option key="Content" value="Content">
                    <FormattedMessage id="Setting.Content" />
                  </Option>
                  <Option key="URL" value="URL">
                    <FormattedMessage id="Setting.URL" />
                  </Option>
                </SelectGroup>
              </FormItem>
            </div>
            <div className="edit-content">
              {this.state.TitleType == true ? (
                <FormItem>
                  <div className="editor-wrapper">
                    <ReactEditor
                      count={1000}
                      id={'name-wrapper'}
                      toolbars={[
                        // 'fontName', // 字体
                        'html',
                        'foreColor', // 文字颜色
                        'link', // 插入链接
                        'fullScreen'
                      ]}
                      onContentChange={this.handleEditorChange}
                      content={editor}
                      height={300}
                    />
                  </div>
                </FormItem>
              ) : (
                <Input
                  placeholder={(window as any).RCi18n({ id: 'Setting.PleaseenterURLaddress' })}
                  defaultValue={editList.consentTitle ? editList.consentTitle : ''}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    consentForm.consentTitle = value;
                    onFormChange(consentForm);
                  }}
                />
              )}
            </div>
          </div>

          <div className="edit-add">
            {this.state.detailType == true ? (
              <div className="edit-add-content space-between-align">
                <div className="edit-content">
                  <FormattedMessage id="Setting.Consentdetail" />
                </div>
              </div>
            ) : null}
            {this.state.TitleType ? (
              <Button className="btn" type="primary" shape="round" icon="plus" onClick={this.addDetail}>
                New detail
              </Button>
            ) : null}
          </div>
          {this.state._detailType == true ? (
            <div className="detail-add">
              {this.state.content &&
                this.state.content.map((item, i) => {
                  return (
                    <div className="add" key={item.uuid}>
                      <div className="add-content space-between">
                        <div className="add-title">
                          <FormattedMessage id="Setting.Detail" /> {i + 1}
                        </div>
                        <div className="add-i">
                          <Input
                            maxLength={100}
                            placeholder={(window as any).RCi18n({ id: 'Setting.Pleaseenterkeywords' })}
                            defaultValue={item.contentTitle}
                            key={item.contentTitle}
                            onChange={(e) => {
                              const value = (e.target as any).value;
                              item.contentTitle = value;
                              this.handleContent(item, i);
                            }}
                          />
                        </div>
                        <div className="iconfont iconDelete icon" onClick={(e) => this.onDelete(item, i)}></div>
                      </div>
                      <FormItem>
                        <div className="editor-wrapper">
                          <ReactEditor
                            count={1000}
                            id={'name-mian' + item.uuid}
                            onContentChange={(content2) => {
                              item.contentBody = content2;
                              this.handleContent(item, i);
                            }}
                            toolbars={[
                              // 'fontName', // 字体
                              'html',
                              'foreColor', // 文字颜色
                              'link', // 插入链接
                              'fullScreen'
                            ]}
                            content={item.contentBody}
                            height={300}
                          />
                        </div>
                      </FormItem>
                    </div>
                  );
                })}
            </div>
          ) : null}
        </div>
        <div className="language">
          <Select
            defaultValue={editList.languageTypeId ? editList.languageTypeId : consentLanguage[0] ? consentLanguage[0].description : []}
            style={{ width: 120 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              consentForm.languageTypeId = value;
              onFormChange(consentForm);
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
export default injectIntl(StepConsentDetail);
