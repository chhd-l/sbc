import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import '../index.less';
import { FormattedMessage, injectIntl } from 'react-intl';
import { cache, Const, noop, SelectGroup } from 'qmkit';
import * as webapi from '../webapi';
import { Form, Select, Input, Button, Table, Divider, message, Checkbox, Pagination, Spin, Tooltip, Modal, Rate, TreeSelect, Icon, Upload, Tree } from 'antd';
import { IMap } from 'plume2';
import { List, fromJS, Map } from 'immutable';
import { FunctionOrConstructorTypeNodeBase } from 'ts-morph';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Dragger = Upload.Dragger;
const Option = Select.Option;
type TList = List<IMap>;
const confirm = Modal.confirm;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};
const FILE_MAX_SIZE = 2 * 1024 * 1024;

@Relax
class UploadImageModal extends Component<any, any> {
  _rejectForm;

  WrapperForm: any;

  constructor(props) {
    super(props);
  }
  state = {
    fileList: [], //pc fileList
    mFileList: [], //mobile fileList
    pcUrl: '',
    mobileUrl: '',
    companyInfoId: 0,
    storeId: 0,
    okDisabled: false,
    bannerId: null
  };
  props: {
    form: any;
    intl?:any;
    relaxProps?: {
      modalVisible: boolean;
      tableDatas: TList;
      bannerNoList: TList;
      form: Object;
      imageForm: any;
      fileList: TList;
      mFileList: TList;
      setModalVisible: Function;
      onFormChange: Function;
      getList: Function;
      getStoreId: Function;
      onImageFormChange: Function;
      uploadBanner: Function;
      editBanner: Function;
      resetForm: Function;
      setFileList: Function;
      setMFileList: Function;
    };
  };

  static relaxProps = {
    modalVisible: 'modalVisible',
    tableDatas: 'tableDatas',
    form: 'form',
    viewAction: 'viewAction',
    imageForm: 'imageForm',
    bannerNoList: 'bannerNoList',
    fileList: 'fileList',
    mFileList: 'mFileList',
    setModalVisible: noop,
    onFormChange: noop,
    getList: noop,
    getStoreId: noop,
    onImageFormChange: noop,
    uploadBanner: noop,
    editBanner: noop,
    resetForm: noop,
    setFileList: noop,
    setMFileList: noop
  };
  componentDidMount() {
    const { storeId, companyInfoId } = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    this.setState({
      storeId,
      companyInfoId
    });
  }

  _handleSubmit = () => {
    const { tableDatas, imageForm, fileList, mFileList, editBanner } = this.props.relaxProps;
    this.setState({
      okDisabled: true
    });
    if (tableDatas.size > 5) {
      message.error(<FormattedMessage id="Setting.addUpTo5banner" />);
      // this._handleModelCancel();
      return;
    }
    this.props.form.validateFields((err) => {
      if (!err) {
        let imageObj = imageForm.toJS();
        if (imageObj.fileList.filter((file) => file.status === 'done').length <= 0) {
          message.error(<FormattedMessage id="Setting.uploadPcResource" />);
          return;
        }
        if (imageObj.mFileList.filter((file) => file.status === 'done').length <= 0) {
          message.error(<FormattedMessage id="Setting.uploadMobileResource" />);
          return;
        }
        if (imageObj.bannerId) {
          // edit
          const params = {
            bannerId: imageObj.bannerId,
            bannerNo: imageObj.bannerNo,
            bannerName: imageObj.bannerName,
            mobiUrl: imageObj.mobiUrl,
            webUrl: imageObj.webUrl,
            storeId: this.state.storeId,
            userId: null,
            webSkipUrl: imageObj.webSkipUrl,
            mobiSkipUrl: imageObj.mobiSkipUrl,
            webUuid: imageObj.webUuid,
            mobiUuid: imageObj.mobiUuid,
            webImgName: imageObj.webImgName,
            mobiImgName: imageObj.mobiImgName,
            isVideo: imageObj.isVideo,
            isMobiVideo: imageObj.isMobiVideo
          };
          editBanner(params);
          this.setState({
            okDisabled: false
          });
        } else {
          //上传
          const params = {
            bannerId: null,
            bannerName: imageObj.bannerName,
            bannerNo: imageObj.bannerNo,
            mobiUrl: imageObj.mobiUrl,
            webUrl: imageObj.webUrl,
            storeId: this.state.storeId,
            userId: null,
            webSkipUrl: imageObj.webSkipUrl,
            mobiSkipUrl: imageObj.mobiSkipUrl,
            webUuid: imageObj.webUuid,
            mobiUuid: imageObj.mobiUuid,
            webImgName: imageObj.webImgName,
            mobiImgName: imageObj.mobiImgName,
            isVideo: imageObj.isVideo,
            isMobiVideo: imageObj.isMobiVideo
          };
          this._uploadBanner(params);
          this.setState({
            okDisabled: false
          });
        }
      }
    });
  };

  _uploadBanner = async (params) => {
    const { getList, getStoreId, uploadBanner } = this.props.relaxProps;
    const ref = this;
    const res = await uploadBanner(params);
    const title = RCi18n({id:'Setting.Tip'});
    const content = RCi18n({id:'Setting.AddBanner'});
    const ok = RCi18n({id:'Setting.OK'});
    const cancel = RCi18n({id:'Setting.Cancel'});
    if (res != -1) {
      confirm({
        title: title,
        content: content,
        onOk() {
          ref.resetImageForm();
          getList({ storeId: getStoreId() });
        },
        onCancel() {
          ref._handleModelCancel();
          getList({ storeId: getStoreId() });
        },
        okText: ok,
        cancelText: cancel
      });
    }
  };
  resetImageForm() {
    this.props.form.resetFields();
    const { resetForm } = this.props.relaxProps;
    resetForm();
    this._setFileList([]);
    this._setMFileList([]);
    // this.state.fileList = [];
    // this.state.mFileList = [];
  }
  _handleModelCancel = () => {
    const { setModalVisible } = this.props.relaxProps;
    this.resetImageForm();
    setModalVisible(false);
  };
  _setFileList = (fileList) => {
    const { onImageFormChange } = this.props.relaxProps;
    onImageFormChange({
      field: 'fileList',
      value: fileList
    });
  };
  _setMFileList = (mFileList) => {
    const { onImageFormChange } = this.props.relaxProps;
    onImageFormChange({
      field: 'mFileList',
      value: mFileList
    });
  };

  render() {
    const { modalVisible, tableDatas, imageForm, bannerNoList, onImageFormChange } = this.props.relaxProps;

    if (!modalVisible) {
      return null;
    }
    const ref = this;
    const { getFieldDecorator } = this.props.form;
    const list = imageForm.toJS().fileList;
    const mList = imageForm.toJS().mFileList;
    const setFileList = this._setFileList;
    const setMFileList = this._setMFileList;
    const storeId = this.state.storeId;
    const bannerId = imageForm.toJS().bannerId;
    const bannerNo = imageForm.toJS().bannerNo;
    const bannerName = imageForm.toJS().bannerName;
    const webSkipUrl = imageForm.toJS().webSkipUrl;
    const mobiSkipUrl = imageForm.toJS().mobiSkipUrl;
    const companyInfoId = this.state.companyInfoId;

    const props = {
      name: 'uploadFile',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
      },
      multiple: false,
      showUploadList: { showPreviewIcon: false, showRemoveIcon: true },
      //上传地址
      action: Const.HOST + `/store/uploadStoreResource?storeId=${storeId}&companyInfoId=${companyInfoId}&resourceType=IMAGE`,
      accept: '.jpg,.jpeg,.png,.gif,.mp4',
      beforeUpload(file) {
        let fileName = file.name.toLowerCase();
        if (tableDatas.size > 5) {
          message.error(<FormattedMessage id="Setting.onlyAddUpTo5banner" />);
          return false;
        }

        if (!fileName.trim()) {
          message.error(<FormattedMessage id="PleaseInputAFileName" />);
          return false;
        }

        if (/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/.test(fileName)) {
          message.error(<FormattedMessage id="theCorrectFormat" />);
          return false;
        }
        if (fileName.length > 40) {
          message.error(<FormattedMessage id="Setting.FileNameIsTooLong" />);
          return false;
        }

        if (list && list.length >= 1) {
          message.error(<FormattedMessage id="Setting.uploadOneResource" />);
          return false;
        }
        // 支持的图片格式：jpg、jpeg、png、gif
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif') || fileName.endsWith('.mp4')) {
          if (file.size <= FILE_MAX_SIZE) {
            return true;
          } else {
            message.error(<FormattedMessage id="Setting.FileSizeCannotExceed2M" />);
            return false;
          }
        } else {
          message.error(<FormattedMessage id="Setting.FileFormatError" />);
          return false;
        }
      },
      onChange(info) {
        const status = info.file.status;
        let fileList = info.fileList;
        if (status === 'done') {
          if (info.file.response && info.file.response.code && info.file.response.code !== Const.SUCCESS_CODE) {
            message.error(`${info.file.name} upload failed!`);
          } else {
            // ref.setState({
            //   pcUrl: info.file.response[0]
            // });
            onImageFormChange({
              field: 'webUrl',
              value: info.file.response[0]
            });
            onImageFormChange({
              field: 'webUuid',
              value: info.file.uid
            });
            onImageFormChange({
              field: 'webImgName',
              value: info.file.name
            });
            if (info.file.type.indexOf('video') !== -1) {
              onImageFormChange({
                field: 'isVideo',
                value: 1
              });
            } else {
              onImageFormChange({
                field: 'isVideo',
                value: 0
              });
            }
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} upload failed!`);
        }
        //仅展示上传中和上传成功的文件列表
        fileList = fileList.filter((f) => f.status == 'uploading' || (f.status == 'done' && !f.response) || (f.status == 'done' && f.response && !f.response.code));
        setFileList(fileList);
      }
    };
    const mProps = {
      name: 'uploadFile',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
      },
      multiple: false,
      showUploadList: { showPreviewIcon: false, showRemoveIcon: true },
      //上传地址
      action: Const.HOST + `/store/uploadStoreResource?storeId=${storeId}&companyInfoId=${companyInfoId}&resourceType=IMAGE`,
      accept: '.jpg,.jpeg,.png,.gif,.mp4',
      beforeUpload(file) {
        // if (!cateIdCurr) {
        //   message.error('Please select category first!');
        //   return false;
        // }
        let fileName = file.name.toLowerCase();

        if (tableDatas.size > 5) {
          message.error(<FormattedMessage id="Setting.onlyAddUpTo5banner" />);
          return false;
        }

        if (!fileName.trim()) {
          message.error(<FormattedMessage id="Setting.PleaseInputAFileName" />);
          return false;
        }

        if (/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/.test(fileName)) {
          message.error(<FormattedMessage id="Setting.theCorrectFormat" />);
          return false;
        }

        if (fileName.length > 40) {
          message.error(<FormattedMessage id="Setting.FileNameIsTooLong" />);
          return false;
        }
        if (mList && mList.length >= 1) {
          message.error(<FormattedMessage id="Setting.uploadOneResource" />);
          return false;
        }
        // 支持的图片格式：jpg、jpeg、png、gif
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif') || fileName.endsWith('.mp4')) {
          if (file.size <= FILE_MAX_SIZE) {
            return true;
          } else {
            message.error(<FormattedMessage id="Setting.FileSizeCannotExceed2M" />);
            return false;
          }
        } else {
          message.error(<FormattedMessage id="Setting.FileFormatError" />);
          return false;
        }
      },
      onChange(info) {
        const status = info.file.status;
        let fileList = info.fileList;
        if (status === 'done') {
          if (info.file.response && info.file.response.code && info.file.response.code !== Const.SUCCESS_CODE) {
            message.error(`${info.file.name} upload failed!`);
          } else {
            // ref.setState({
            //   mobileUrl: info.file.response[0]
            // });
            onImageFormChange({
              field: 'mobiUrl',
              value: info.file.response[0]
            });
            onImageFormChange({
              field: 'mobiUuid',
              value: info.file.uid
            });
            onImageFormChange({
              field: 'mobiImgName',
              value: info.file.name
            });
            if (info.file.type.indexOf('video') !== -1) {
              onImageFormChange({
                field: 'isMobiVideo',
                value: 1
              });
            } else {
              onImageFormChange({
                field: 'isMobiVideo',
                value: 0
              });
            }
            // message.success(`${info.file.name} uploaded successfully!`);
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} upload failed!`);
        }
        //仅展示上传中和上传成功的文件列表
        fileList = fileList.filter((f) => f.status == 'uploading' || (f.status == 'done' && !f.response) || (f.status == 'done' && f.response && !f.response.code));
        setMFileList(fileList);
      }
    };
    return (
      <Modal
        maskClosable={false}
        title={<FormattedMessage id="Setting.Upload" />}
        visible={modalVisible}
        width={920}
        // confirmLoading={true}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <div>
          <div>
            <Form>
              <FormItem {...formItemLayout} label={<FormattedMessage id="Setting.bannerNo" />}>
                {getFieldDecorator('bannerNo', {
                  initialValue: bannerNo,
                  rules: [{ required: true, message: <FormattedMessage id="Setting.PleaseSelectBannerNo" /> }]
                })(
                  <Select
                    style={{ width: 160 }}
                    onChange={(e) => {
                      onImageFormChange({
                        field: 'bannerNo',
                        value: e
                      });
                    }}
                  >
                    {bannerNoList.map((item: any, index) => (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="Setting.BannerName" />}>
                {getFieldDecorator('bannerName', {
                  initialValue: bannerName,
                  rules: [{ required: true, message: <FormattedMessage id="Setting.PleaseEnterBannerName" /> }]
                })(
                  <Input
                    onChange={(e) =>
                      onImageFormChange({
                        field: 'bannerName',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="Setting.PcUrl" />}>
                {getFieldDecorator('webSkipUrl', {
                  initialValue: webSkipUrl
                })(
                  <Input
                    placeholder="Example: https://www.royalcanin.com/"
                    onChange={(e) =>
                      onImageFormChange({
                        field: 'webSkipUrl',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="Setting.MobileUrl" />}>
                {getFieldDecorator('mobiSkipUrl', {
                  initialValue: mobiSkipUrl
                })(
                  <Input
                    placeholder="Example: https://www.royalcanin.com/"
                    onChange={(e) =>
                      onImageFormChange({
                        field: 'mobiSkipUrl',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="Setting.selectResource" values={{ type: 'pc' }} />} required={true}>
                <div style={{ marginTop: 16 }}>
                  <Dragger {...props} fileList={list}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">
                      <FormattedMessage id="Setting.dragImagesOrVideos" />
                    </p>
                    <p className="ant-upload-hint">
                      <FormattedMessage id="Setting.supportUpload" />
                    </p>
                  </Dragger>
                </div>
              </FormItem>
            </Form>
          </div>
          <div>
            <Form>
              <FormItem {...formItemLayout} label={<FormattedMessage id="Setting.selectResource" values={{ type: 'mobile' }} />} required={true}>
                <div style={{ marginTop: 16 }}>
                  <Dragger {...mProps} fileList={mList}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">
                      <FormattedMessage id="Setting.dragImagesOrVideos" />
                    </p>
                    <p className="ant-upload-hint">
                      <FormattedMessage id="Setting.supportUpload" />
                    </p>
                  </Dragger>
                </div>
              </FormItem>
            </Form>
          </div>
        </div>
      </Modal>
    );
  }
}

export default injectIntl(UploadImageModal);
