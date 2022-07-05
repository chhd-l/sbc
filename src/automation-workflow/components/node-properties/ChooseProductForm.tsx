import React, { Component, useState } from 'react';
import {
  Form,
  Tooltip,
  Row,
  Icon,
  Select,
  Card,
  Modal,
  message,
  Button,
  Alert,
  Upload
} from 'antd';
import { Const } from 'qmkit';
import * as webapi from '@/automation-workflow/webapi';
import { FormattedMessage } from 'react-intl';
const { Dragger } = Upload;
const FormItem = Form.Item;
const header = {
  Accept: 'application/json',
  authorization: 'Bearer ' + (window as any).token
};
export default function ChooseProductForm(props) {
  const [fileData, setFileData] = useState({
    file: null,
    uploading: false
    // isImport: true
  });
  // const { form, title, modalVisible, previewLoading, emailContent, selectLoading } = this.state;
  const uploadProps = {
    name: 'file',
    showUploadList: false,
    accept: '.xls,.xlsx',
    headers: header,
    action: Const.HOST + '/automation/excel/import',
    onChange: (info) => {
      const status = info.file.status;
      // if (status == 'uploading') {
      //   const fileName = '';
      //   setFileData({ file: fileName, uploading: false });
      // }
      if (status === 'done') {
        setFileData((f) => ({ ...f, uploading: true }));
        // let fileName = '';
        // let ext = '';
        // loading = false;
        // if (info.file.response.code == Const.SUCCESS_CODE) {
        //   fileName = info.file.name;
        //   let isImport = false;
        //   this.setState({ isImport });
        //   message.success(fileName + '上传成功');
        // } else {
        //   if (info.file.response === 'Method Not Allowed') {
        //     message.error('此功能您没有权限访问');
        //   } else {
        //     message.error(info.file.response.message);
        //   }
        // }
        // this.setState({ ext, fileName, loading, err });
      } else if (status === 'error') {
        // message.error('上传失败');
        // loading = false;
        // this.setState({ loading, err });
      }
    }
  };

  // const handleUpload = async () => {
  //   debugger;
  //   const fd = new FormData();
  //   fd.append('files[]', fileData.file);
  //   // fd.append('userName', userName.value)
  //   // fd.append('age','18')
  //   const importRes: any = await webapi.automationUploadFile(fd);
  // };

  return (
    <div className="chooseProductForm">
      <h4>
        <span className="red-number">1</span>Download product import template
      </h4>

      <FormItem label="Product import" colon={false}>
        <Alert
          message={
            <div>
              <p>
                <FormattedMessage id="Product.OperationDescription-1" />
              </p>
              <p>
                <FormattedMessage id="Product.OperationDescription-2" />
              </p>
            </div>
          }
          type="error"
        />
      </FormItem>
      <Button type="primary" icon="upload" className="upload-btn">
        <FormattedMessage id="Product.Downloadproductimporttemplate" />
      </Button>
      <h4>
        <span className="red-number">2</span>Upload data
      </h4>
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">
          <FormattedMessage id="Product.chooseFileToUpload" />
        </p>
        <p className="ant-upload-hint">
          <FormattedMessage id="Product.importInfo2" />
        </p>
      </Dragger>
      <Button
        disabled={!fileData.file}
        loading={fileData.uploading}
        type="primary"
        icon="upload"
        // onClick={handleUpload}
        className="upload-btn"
      >
        <FormattedMessage id="Product.confirmToImport" />
      </Button>
    </div>
  );
}
