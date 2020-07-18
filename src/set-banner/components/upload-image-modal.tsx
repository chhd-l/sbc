import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';
import '../index.less';
import { FormattedMessage } from 'react-intl';
import { cache, Const, noop, SelectGroup } from 'qmkit';
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

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Dragger = Upload.Dragger;
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
    cateDisabled: false
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
  componentDidMount() {}
  _handleSubmit = () => {
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
    debugger;
    this._handleModelCancel();
    // this._okFunc();
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
  /**
   * 确定并刷新对应分类的列表
   * @private
   */
  _okFunc = () => {
    // //提交
    // const {
    //   autoExpandImageCate,
    //   showUploadImageModal,
    //   queryImagePage
    // } = this.props.relaxProps;
    // //展开上传的分类
    // autoExpandImageCate(this.state.cateId);
    // showUploadImageModal(false);
    // //刷新列表信息
    // queryImagePage();
    // this.setState({ cateId: '', fileList: [], cateDisabled: false });
  };

  render() {
    const { modalVisible, form, onFormChange } = this.props.relaxProps;
    if (!modalVisible) {
      return null;
    }
    const setFileList = this._setFileList;
    const setMFileList = this._setMFileList;
    const setCateDisabled = this._setCateDisabled;
    const { storeId, companyInfoId } = JSON.parse(
      sessionStorage.getItem(cache.LOGIN_DATA)
    );
    const cateIdCurr = this.state.cateId;
    //处理分类的树形图结构数据
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode
              key={item.get('cateId')}
              value={item.get('cateId').toString()}
              title={item.get('cateName')}
            >
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId')}
            value={item.get('cateId').toString()}
            title={item.get('cateName')}
          />
        );
      });
    const props = {
      name: 'uploadFile',
      headers: {
        Accept: 'application/json',
        Authorization:
          'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
      },
      multiple: true,
      showUploadList: { showPreviewIcon: false, showRemoveIcon: true },
      //上传地址
      action:
        Const.HOST +
        `/store/uploadStoreResource?cateId=${cateIdCurr}&storeId=${storeId}&companyInfoId=${companyInfoId}&resourceType=IMAGE`,
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
            message.success(`${info.file.name} uploaded successfully!`);
            setCateDisabled();
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
        debugger;
        // lastModified: 1594892772516
        // lastModifiedDate: Thu Jul 16 2020 17:46:12 GMT+0800 (China Standard Time) {}
        // name: "test.mp4"
        // originFileObj: File {uid: "rc-upload-1594955234202-2", name: "test.mp4", lastModified: 1594892772516, lastModifiedDate: Thu Jul 16 2020 17:46:12 GMT+0800 (China Standard Time), webkitRelativePath: "", …}
        // percent: 100
        // size: 1131520
        // status: "uploading" /"done"
        // type: "video/mp4"
        // uid: "rc-upload-1594955234202-2"
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
      multiple: true,
      showUploadList: { showPreviewIcon: false, showRemoveIcon: true },
      //上传地址
      action:
        Const.HOST +
        `/store/uploadStoreResource?cateId=${cateIdCurr}&storeId=${storeId}&companyInfoId=${companyInfoId}&resourceType=IMAGE`,
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
            message.success(`${info.file.name} uploaded successfully!`);
            setCateDisabled();
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
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <div>
          <div>
            <Form>
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
