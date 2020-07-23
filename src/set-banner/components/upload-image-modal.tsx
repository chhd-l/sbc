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
    cateId: '',
    fileList: [], //pc fileList
    mFileList: [], //mobile fileList
    pcUrl: '',
    mobileUrl: '',
    companyInfoId: 0,
    storeId: 0,
    bannerName: '',
    okDisabled: false
  };
  props: {
    relaxProps?: {
      modalVisible: boolean;
      form: Object;
      setModalVisible: Function;
      onFormChange: Function;
    };
  };

  static relaxProps = {
    modalVisible: 'modalVisible',
    form: 'form',
    setModalVisible: noop,
    onFormChange: noop,
    viewAction: 'viewAction'
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
  _handleSubmit = async () => {
    if (
      this.state.fileList.filter((file) => file.status === 'done').length <= 0
    ) {
      message.error('Please choose to upload pc resource!');
      return;
    }
    if (
      this.state.mFileList.filter((file) => file.status === 'done').length <= 0
    ) {
      message.error('Please choose to upload mobile resource!');
      return;
    }
    this.setState({
      okDisabled: true
    });
    const params = {
      bannerId: null,
      bannerName: this.state.bannerName,
      mobiUrl: this.state.mobileUrl,
      storeId: this.state.storeId,
      userId: null,
      webUrl: this.state.pcUrl
    };
    const { res } = await webapi.updateBanner(params);
    this.setState({
      okDisabled: false
    });
    const ref = this;
    if (res.code === 'K-000000') {
      confirm({
        title: '提示',
        content: '是否继续添加banner',
        onOk() {
          ref.setState({
            bannerName: '',
            fileList: [],
            mFileList: [],
            pcUrl: '',
            mobileUrl: ''
          });
        },
        onCancel() {
          this._handleModelCancel();
        },
        okText: 'OK',
        cancelText: 'Cancel'
      });
    }
  };
  _handleModelCancel = () => {
    const { setModalVisible } = this.props.relaxProps;
    setModalVisible(false);
  };
  _setFileList = (fileList) => {
    this.setState({ fileList });
  };
  _setMFileList = (mFileList) => {
    this.setState({ mFileList });
  };
  _setCateDisabled = () => {
    this.setState({ cateDisabled: true });
  };
  setBannerName(e) {
    this.setState({
      bannerName: e.target.value
    });
  }
  render() {
    const { modalVisible, form, onFormChange } = this.props.relaxProps;
    if (!modalVisible) {
      return null;
    }
    const ref = this;
    const list = this.state.fileList;
    const mList = this.state.mFileList;
    const setFileList = this._setFileList;
    const setMFileList = this._setMFileList;
    const storeId = this.state.storeId;
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
        if (list.length >= 1) {
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
              pcUrl: info.file.response[0]
            });
            message.success(`${info.file.name} uploaded successfully!`);
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
        if (mList.length >= 1) {
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
          debugger;
          if (
            info.file.response &&
            info.file.response.code &&
            info.file.response.code !== Const.SUCCESS_CODE
          ) {
            message.error(`${info.file.name} upload failed!`);
          } else {
            ref.setState({
              mobileUrl: info.file.response[0]
            });
            message.success(`${info.file.name} uploaded successfully!`);
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
              <FormItem
                label="Banner Name"
                name="bannerName"
                value={this.state.bannerName}
                rules={[
                  { required: true, message: 'Please input your bannerName.' },
                  { max: 30, message: '最多30字符' }
                ]}
              >
                <Input onChange={(e) => this.setBannerName(e)} />
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
                <div style={{ marginTop: 16 }}>
                  <Dragger {...props} fileList={this.state.fileList}>
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
              </FormItem>
            </Form>
          </div>
          <div>
            <Form>
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
                <div style={{ marginTop: 16 }}>
                  <Dragger {...mProps} fileList={this.state.mFileList}>
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
              </FormItem>
            </Form>
          </div>
        </div>
      </Modal>
    );
  }
}
