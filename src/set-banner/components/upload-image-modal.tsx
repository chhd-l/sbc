import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import '../index.less';
import { FormattedMessage } from 'react-intl';
import { cache, Const, noop, SelectGroup } from 'qmkit';
import * as webapi from '../webapi';
import {
  Form,
  Select,
  Input,
  Button,
  Table,
  Divider,
  message,
  Checkbox,
  Pagination,
  Spin,
  Tooltip,
  Modal,
  Rate,
  TreeSelect,
  Icon,
  Upload,
  Tree
} from 'antd';
import { fromJS, Map } from 'immutable';
import { FunctionOrConstructorTypeNodeBase } from 'ts-morph';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Dragger = Upload.Dragger;
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
export default class UploadImageModal extends Component<any, any> {
  _rejectForm;

  WrapperForm: any;

  constructor(props) {
    super(props);
  }
  state = {
    // fileList: [], //pc fileList
    mFileList: [], //mobile fileList
    webUrl: '',
    mobiUrl: '',
    companyInfoId: 0,
    storeId: 0,
    okDisabled: false,
    bannerId: null
  };
  props: {
    form: any;
    relaxProps?: {
      modalVisible: boolean;
      tableDatas: TList;
      bannerNoList: TList;
      form: Object;
      imageForm: any;
      setModalVisible: Function;
      onFormChange: Function;
      getList: Function;
      getStoreId: Function;
      onImageFormChange: Function;
      uploadBanner: Function;
      editBanner: Function;
      resetForm: Function;
    };
  };

  static relaxProps = {
    modalVisible: 'modalVisible',
    tableDatas: 'tableDatas',
    form: 'form',
    viewAction: 'viewAction',
    imageForm: 'imageForm',
    bannerNoList: 'bannerNoList',
    setModalVisible: noop,
    onFormChange: noop,
    getList: noop,
    getStoreId: noop,
    onImageFormChange: noop,
    uploadBanner: noop,
    editBanner: noop,
    resetForm: noop
  };

  componentDidMount() {
    const { storeId, companyInfoId } = JSON.parse(
      sessionStorage.getItem(cache.LOGIN_DATA)
    );
    this.setState({
      storeId,
      companyInfoId
    });
  }

  _handleSubmit = () => {
    const { tableDatas, imageForm, editBanner } = this.props.relaxProps;
    this.setState({
      okDisabled: true
    });
    if (!imageForm.toJS().bannerId && tableDatas.size >= 5) {
      message.error('You can only add up to 5 banner.');
      return;
    }
    this.props.form.validateFields((err) => {
      if (!err) {
        debugger;
        if (
          !imageForm.toJS().fileList ||
          (imageForm.toJS().fileList &&
            imageForm.toJS().fileList.filter((file) => file.status === 'done')
              .length <= 0)
        ) {
          message.error('Please choose to upload pc resource!');
          return;
        }
        if (
          !imageForm.toJS().mFileList ||
          (imageForm.toJS().mFileList &&
            imageForm.toJS().mFileList.filter((file) => file.status === 'done')
              .length <= 0)
        ) {
          message.error('Please choose to upload mobile resource!');
          return;
        }
        if (imageForm.toJS().bannerId) {
          // edit
          const params = {
            bannerId: imageForm.toJS().bannerId,
            bannerNo: imageForm.toJS().bannerNo,
            bannerName: imageForm.toJS().bannerName,
            mobiUrl: imageForm.toJS().mobiUrl,
            webUrl: imageForm.toJS().webUrl,
            storeId: this.state.storeId,
            userId: null,
            webSkipUrl: imageForm.toJS().webSkipUrl,
            mobiSkipUrl: imageForm.toJS().mobiSkipUrl,
            webUuid: imageForm.toJS().webUuid,
            mobiUuid: imageForm.toJS().mobiUuid,
            webImgName: imageForm.toJS().webImgName,
            mobiImgName: imageForm.toJS().mobiImgName
          };
          editBanner(params);
          this.setState({
            okDisabled: false
          });
        } else {
          //上传
          const params = {
            bannerId: null,
            bannerName: imageForm.toJS().bannerName,
            bannerNo: imageForm.toJS().bannerNo,
            mobiUrl: this.state.mobiUrl,
            webUrl: this.state.webUrl,
            storeId: this.state.storeId,
            userId: null,
            webSkipUrl: imageForm.toJS().webSkipUrl,
            mobiSkipUrl: imageForm.toJS().mobiSkipUrl,
            webUuid: imageForm.toJS().webUuid,
            mobiUuid: imageForm.toJS().mobiUuid,
            webImgName: imageForm.toJS().webImgName,
            mobiImgName: imageForm.toJS().mobiImgName
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
    if (res != -1) {
      confirm({
        title: 'Tip',
        content: 'Whether to continue to add banner ?',
        onOk() {
          ref.resetImageForm();
          getList({ storeId: getStoreId() });
        },
        onCancel() {
          ref._handleModelCancel();
          getList({ storeId: getStoreId() });
        },
        okText: 'OK',
        cancelText: 'Cancel'
      });
    }
  };
  resetImageForm() {
    const { resetForm } = this.props.relaxProps;
    resetForm();
    this.props.form.resetFields();
    // this.setState({
    //   fileList: [],
    //   mFileList: []
    // });
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
    // this.setState({ mFileList });
    const { onImageFormChange } = this.props.relaxProps;
    onImageFormChange({
      field: 'mFileList',
      value: mFileList
    });
  };

  render() {
    const {
      modalVisible,
      tableDatas,
      imageForm,
      bannerNoList,
      onImageFormChange
    } = this.props.relaxProps;

    if (!modalVisible) {
      return null;
    }
    const ref = this;
    const { getFieldDecorator } = this.props.form;
    // const list = this.state.fileList;
    const fileList = imageForm.toJS().fileList ? imageForm.toJS().fileList : [];
    const mFileList = imageForm.toJS().mFileList
      ? imageForm.toJS().mFileList
      : [];
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
        Authorization:
          'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
      },
      multiple: false,
      showUploadList: { showPreviewIcon: false, showRemoveIcon: true },
      //上传地址
      action:
        Const.HOST +
        `/store/uploadStoreResource?storeId=${storeId}&companyInfoId=${companyInfoId}&resourceType=IMAGE`,
      accept: '.jpg,.jpeg,.png,.gif,.mp4',
      beforeUpload(file) {
        let fileName = file.name.toLowerCase();
        if (!bannerId && tableDatas.size >= 5) {
          message.error('You can only add up to 5 banner.');
          return false;
        }

        if (!fileName.trim()) {
          message.error('Please input a file name');
          return false;
        }

        if (
          /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/.test(
            fileName
          )
        ) {
          message.error('Please enter the file name in the correct format');
          return false;
        }

        if (fileName.length > 40) {
          message.error('File name is too long');
          return false;
        }

        if (fileList.length >= 1) {
          message.error('Only can upload one resource.');
          return false;
        }
        // 支持的图片格式：jpg、jpeg、png、gif
        if (
          fileName.endsWith('.jpg') ||
          fileName.endsWith('.jpeg') ||
          fileName.endsWith('.png') ||
          fileName.endsWith('.gif') ||
          fileName.endsWith('.mp4')
        ) {
          if (file.size <= FILE_MAX_SIZE) {
            return true;
          } else {
            message.error('File size cannot exceed 2M');
            return false;
          }
        } else {
          message.error('File format error');
          return false;
        }
      },
      onChange(info) {
        const status = info.file.status;
        let fileList = info.fileList;
        if (status === 'done') {
          if (
            info.file.response &&
            info.file.response.code &&
            info.file.response.code !== Const.SUCCESS_CODE
          ) {
            message.error(`${info.file.name} upload failed!`);
          } else {
            ref.setState({
              webUrl: info.file.response[0]
            });

            onImageFormChange({
              field: 'webUuid',
              value: info.file.uid
            });
            onImageFormChange({
              field: 'webImgName',
              value: info.file.name
            });
            // message.success(`${info.file.name} uploaded successfully!`);
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} upload failed!`);
        }
        //仅展示上传中和上传成功的文件列表
        fileList = fileList.filter(
          (f) =>
            f.status == 'uploading' ||
            (f.status == 'done' && !f.response) ||
            (f.status == 'done' && f.response && !f.response.code)
        );
        console.log(fileList, 'ddddddddddddddddddddddd');
        setFileList(fileList);
      }
    };
    const mProps = {
      name: 'uploadFile',
      headers: {
        Accept: 'application/json',
        Authorization:
          'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
      },
      multiple: false,
      showUploadList: { showPreviewIcon: false, showRemoveIcon: true },
      //上传地址
      action:
        Const.HOST +
        `/store/uploadStoreResource?storeId=${storeId}&companyInfoId=${companyInfoId}&resourceType=IMAGE`,
      accept: '.jpg,.jpeg,.png,.gif,.mp4',
      beforeUpload(file) {
        // if (!cateIdCurr) {
        //   message.error('Please select category first!');
        //   return false;
        // }
        let fileName = file.name.toLowerCase();

        if (!bannerId && tableDatas.size >= 5) {
          message.error('You can only add up to 5 banner.');
          return false;
        }

        if (!fileName.trim()) {
          message.error('Please input a file name');
          return false;
        }

        if (
          /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/.test(
            fileName
          )
        ) {
          message.error('Please enter the file name in the correct format');
          return false;
        }

        if (fileName.length > 40) {
          message.error('File name is too long');
          return false;
        }
        if (mFileList.length >= 1) {
          message.error('Only can upload one resource.');
          return false;
        }
        // 支持的图片格式：jpg、jpeg、png、gif
        if (
          fileName.endsWith('.jpg') ||
          fileName.endsWith('.jpeg') ||
          fileName.endsWith('.png') ||
          fileName.endsWith('.gif') ||
          fileName.endsWith('.mp4')
        ) {
          if (file.size <= FILE_MAX_SIZE) {
            return true;
          } else {
            message.error('File size cannot exceed 2M');
            return false;
          }
        } else {
          message.error('File format error');
          return false;
        }
      },
      onChange(info) {
        const status = info.file.status;
        let fileList = info.fileList;
        if (status === 'done') {
          if (
            info.file.response &&
            info.file.response.code &&
            info.file.response.code !== Const.SUCCESS_CODE
          ) {
            message.error(`${info.file.name} upload failed!`);
          } else {
            ref.setState({
              mobiUrl: info.file.response[0]
            });
            onImageFormChange({
              field: 'mobiUuid',
              value: info.file.uid
            });
            onImageFormChange({
              field: 'mobiImgName',
              value: info.file.name
            });
            // message.success(`${info.file.name} uploaded successfully!`);
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} upload failed!`);
        }
        //仅展示上传中和上传成功的文件列表
        fileList = fileList.filter(
          (f) =>
            f.status == 'uploading' ||
            (f.status == 'done' && !f.response) ||
            (f.status == 'done' && f.response && !f.response.code)
        );
        setMFileList(fileList);
      }
    };
    return (
      <Modal
        maskClosable={false}
        title={<FormattedMessage id="upload" />}
        visible={modalVisible}
        width={920}
        // confirmLoading={true}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <div>
          <div>
            <Form>
              <FormItem {...formItemLayout} label="Banner No">
                {getFieldDecorator('bannerNo', {
                  initialValue: bannerNo,
                  rules: [
                    { required: true, message: 'Please select banner No.' }
                  ]
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
                    {bannerNoList.map((item) => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="Banner name">
                {getFieldDecorator('bannerName', {
                  initialValue: bannerName,
                  rules: [
                    { required: true, message: 'Please enter banner name.' }
                  ]
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
              <FormItem {...formItemLayout} label="Pc href">
                {getFieldDecorator('webSkipUrl', {
                  initialValue: webSkipUrl
                  // rules: [{ required: true, message: 'Please enter pc href.' }]
                })(
                  <Input
                    placeholder="Example: https://www.baidu.com/"
                    onChange={(e) =>
                      onImageFormChange({
                        field: 'webSkipUrl',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="Mobile href">
                {getFieldDecorator('mobiSkipUrl', {
                  initialValue: mobiSkipUrl
                  // rules: [
                  //   { required: true, message: 'Please enter mobile href.' }
                  // ]
                })(
                  <Input
                    placeholder="Example: https://www.baidu.com/"
                    onChange={(e) =>
                      onImageFormChange({
                        field: 'mobiSkipUrl',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label={
                  <FormattedMessage
                    id="selectResource"
                    values={{ type: 'pc' }}
                  />
                }
                required={true}
              >
                {getFieldDecorator('fileList', {
                  initialValue: fileList
                })(
                  <div style={{ marginTop: 16 }}>
                    <Dragger {...props} fileList={fileList}>
                      <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                      </p>
                      <p className="ant-upload-text">
                        <FormattedMessage id="dragImagesOrVideos" />
                      </p>
                      <p className="ant-upload-hint">
                        <FormattedMessage id="supportUpload" />
                      </p>
                    </Dragger>
                  </div>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={
                  <FormattedMessage
                    id="selectResource"
                    values={{ type: 'mobile' }}
                  />
                }
                required={true}
              >
                {getFieldDecorator('mFileList', {
                  initialValue: mFileList
                })(
                  <div style={{ marginTop: 16 }}>
                    <Dragger {...mProps} fileList={mFileList}>
                      <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                      </p>
                      <p className="ant-upload-text">
                        <FormattedMessage id="dragImagesOrVideos" />
                      </p>
                      <p className="ant-upload-hint">
                        <FormattedMessage id="supportUpload" />
                      </p>
                    </Dragger>
                  </div>
                )}
              </FormItem>
            </Form>
          </div>
        </div>
      </Modal>
    );
  }
}
