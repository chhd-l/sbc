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
import { Const, util } from 'qmkit';
import * as webapi from '@/automation-workflow/webapi';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { DraggerProps } from 'antd/lib/upload';

const { Dragger } = Upload;
const FormItem = Form.Item;
const header = {
  Accept: 'application/json',
  authorization: 'Bearer ' + (window as any).token
};
export default function ChooseProductForm({ updateValue, productData }) {
  console.log('productDataproductDataproductData ', productData);
  const { id } = useParams();
  const [fileData, setFileData] = useState({
    file: null,
    uploading: false
    // isImport: true
  });
  const uploadProps: DraggerProps = {
    name: 'file',
    showUploadList: false,
    accept: '.xls,.xlsx',
    headers: header,
    data: { campaignId: id },
    action: Const.HOST + '/automation/excel/import',

    onChange: (f) => {
      console.log(f, 'fff');
      // const { response } = file;
      // response.con
      // updateValue('productData', { path: 999 });
      // return;
      // const status = info.file.status;
      // if (status == 'uploading') {
      //   const fileName = '';
      //   setFileData({ file: fileName, uploading: false });
      // }
      if (status === 'done') {
        setFileData((f) => ({ ...f, uploading: true }));
        // updateValue('priceIncreaseTime', f);
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
        updateValue('productData', { path: fileData.file });
      }
    }
  };
  const toDownTempl = () => {
    // 参数加密
    let base64 = new util.Base64();
    const token = (window as any).token;
    if (token) {
      let result = JSON.stringify({ token: token });
      let encrypted = base64.urlEncode(result);
      const exportHref = Const.HOST + `/goods/excel/template/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('请登录');
    }
  };
  const handleUpload = async () => {
    debugger;
    const fd = new FormData();
    fd.append('files[]', fileData.file);
    // fd.append('userName', userName.value)
    // fd.append('age','18')
    const importRes: any = await webapi.automationUploadFile(fd);
  };

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
      <Button type="primary" icon="upload" className="upload-btn" onClick={toDownTempl}>
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
        onClick={handleUpload}
        className="upload-btn"
      >
        <FormattedMessage id="Product.confirmToImport" />
      </Button>
    </div>
  );
}
