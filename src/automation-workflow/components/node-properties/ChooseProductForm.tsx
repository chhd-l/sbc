import React, { useState } from 'react';
import { Form, Icon, message, Button, Alert, Upload, notification, Spin } from 'antd';
import { Const, RCi18n, util } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { DraggerProps } from 'antd/lib/upload';

const { Dragger } = Upload;
const FormItem = Form.Item;
const header = {
  Accept: 'application/json',
  authorization: 'Bearer ' + (window as any).token
};
export default function ChooseProductForm({ updateValue }) {
  const { id } = useParams();
  const [fileData, setFileData] = useState({
    file: null,
    uploadBtnEnable: false,
    loading: false
  });
  const uploadProps: DraggerProps = {
    name: 'file',
    showUploadList: false,
    accept: '.xls,.xlsx',
    action: Const.HOST + '/automation/excel/import',
    beforeUpload: (file) => {
      setFileData((s) => ({ ...s, file, uploadBtnEnable: true }));
      return false;
    }
  };
  const toDownTempl = () => {
    // 参数加密
    let base64 = new util.Base64();
    const token = (window as any).token;
    let result = JSON.stringify({ token: token });
    let encrypted = base64.urlEncode(result);
    const exportHref = Const.HOST + `/automation/excel/template/${encrypted}`;
    window.open(exportHref);
  };
  const handleUpload = async () => {
    try {
      setFileData((s) => ({ ...s, loading: true }));
      const formData = new FormData();
      formData.append('campaignId', id);
      formData.append('file', fileData.file);
      const resp = await fetch(Const.HOST + '/automation/excel/import', {
        method: 'POST',
        headers: header,
        body: formData
      });
      const { context, code, message: msg } = await resp.json();
      if (code === Const.SUCCESS_CODE) {
        message.success(RCi18n({ id: 'Setting.Operatesuccessfully' }));
        setFileData({ loading: false, file: null, uploadBtnEnable: false });
        updateValue('productData', { path: context });
      } else {
        notification.error({
          message: 'System Notification',
          duration: 3,
          key: 'error_pop',
          description: msg
        });
        setFileData((s) => ({ ...s, loading: false }));
      }
    } catch (error) {
      notification.error({
        message: 'System Notification',
        duration: 3,
        key: 'error_pop',
        description: error
      });
      setFileData((s) => ({ ...s, loading: false }));
    }
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
        <Spin spinning={fileData.loading}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">
            <FormattedMessage id="Product.chooseFileToUpload" />
          </p>
        </Spin>
      </Dragger>

      <div className="desc-container">
        <p>{fileData.file?.name}</p>
        <p className="ant-upload-hint">
          <FormattedMessage id="Product.importInfo2" />
        </p>
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
    </div>
  );
}
