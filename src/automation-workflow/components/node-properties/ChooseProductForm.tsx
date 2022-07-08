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
import { Const, RCi18n, util } from 'qmkit';
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
    uploadBtnEnable: false
    // isImport: true
  });
  const uploadProps: DraggerProps = {
    name: 'file',
    showUploadList: false,
    accept: '.xls,.xlsx',
    headers: header,
    data: { campaignId: id },
    action: Const.HOST + '/automation/excel/import',
    onChange: (file) => {
      const {
        file: {
          response: { context, code },
          status
        }
      } = file;
      if (status === 'done') {
        if (code === Const.SUCCESS_CODE) {
          message.success(RCi18n({ id: 'Setting.Operatesuccessfully' }));
          setFileData({ file: context, uploadBtnEnable: true });
        }
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
      const exportHref = Const.HOST + `/automation/excel/template/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('请登录');
    }
  };
  const handleUpload = async () => {
    updateValue('productData', { path: fileData.file });
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
        disabled={!fileData.uploadBtnEnable}
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
