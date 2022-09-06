import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Breadcrumb, Button, Icon, message, notification, Row, Spin, Steps, Upload } from 'antd';
import { Const, Fetch, Headline, util, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import TextArea from 'antd/lib/input/TextArea';
const Dragger = Upload.Dragger;
const Step = Steps.Step;

const header = {
  Accept: 'application/json',
  authorization: 'Bearer ' + (window as any).token
};

const steps = [
  {
    id: 1,
    title: <FormattedMessage id="Product.downloadRedirectionImportTemplate" />,
    content: 'First-content'
  },
  {
    id: 2,
    title: <FormattedMessage id="Product.uploadData" />,
    content: 'Second-content'
  },
  {
    id: 3,
    title: <FormattedMessage id="Product.finish" />,
    content: 'Third-content'
  }
];

/**
 * 导入
 * @returns {Promise<IAsyncResult<T>>}
 */
const importGoods = (file) => {
  return Fetch('/redirectionUrl/import', {
    method: 'POST',
    headers: header,
    body: file
  });
};

export default class GoodsImport extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      ext: '',
      fileName: '',
      err: false,
      errBtn: false,
      loading: false,
      isImport: true,
      textvalue: [],
      file: null,
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render() {
    const { current, fileName, err, isImport, errBtn, textvalue } = this.state;
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            <FormattedMessage id="Content.redirectionImport" />
          </Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline title={<FormattedMessage id="Content.redirectionImport" />} />
          <Alert
            message={(window as any).RCi18n({ id: 'Product.OperationDescription' })}
            description={
              <ul>
                <li>1、{<FormattedMessage id="Content.importInfo1" />}</li>
                <li>2、{<FormattedMessage id="Content.importInfo2" />}</li>
              </ul>
            }
          />

          <div style={styles.uploadTit}>
            <Steps current={current}>
              {steps.map((item) => (
                <Step key={item.id} title={item.title} />
              ))}
            </Steps>
          </div>
          {current == 0 ? (
            <div style={styles.center}>
              <Button data-testid="download" type="primary" icon="download" style={{ marginTop: 10 }} onClick={this.toDownTempl}>
                {<FormattedMessage id="Product.downloadRedirectionImportTemplate" />}
              </Button>
              <div style={{ marginTop: 40 }}>
                <Button data-testid="downloadnext" type="primary" onClick={this._next}>
                  {<FormattedMessage id="Product.next" />}
                </Button>
              </div>
            </div>
          ) : null}
          {current == 1 ? (
            <Spin spinning={this.state.loading}>
              <div className="steps-content" style={styles.center}>
                <Dragger name="file" multiple={false} showUploadList={false} accept=".xls,.xlsx" headers={header} action={Const.HOST + '/redirectionUrl/import'} onChange={this.changeImage} beforeUpload={this.beforeUpload}>
                  <div style={styles.content}>
                    <p className="ant-upload-hint" style={{ fontSize: 14, color: 'black' }}>
                      {' '}
                      <Icon type="upload" />
                      <FormattedMessage id="Product.chooseFileToUpload" />
                    </p>
                  </div>
                </Dragger>
                <div style={styles.tip}>{fileName}</div>
                {/* {err ? (
                  <div style={styles.tip}>
                    <span style={styles.error}>导入失败！</span>
                    您可以<a onClick={this.toExcel}>下载错误表格</a>
                    ，查看错误原因，修改后重新导入。
                  </div>
                ) : null} */}

                <p style={styles.grey}>
                  <FormattedMessage id="Content.importInfo2" />
                </p>
                {/* 
                {errBtn ? (
                  <Button type="primary" onClick={this._importGoods} disabled={isImport}>
                    重新导入
                  </Button>
                ) : ( */}
                <Button
                  type="primary"
                  onClick={() => {
                    setTimeout(() => {
                      message.success('upload successfully');
                      this.next();
                    }, 500)
                  }}
                  disabled={isImport}
                >
                  <FormattedMessage id="Product.confirmToImport" />
                </Button>
                {/* )} */}
              </div>
            </Spin>
          ) : null}
          {current == 2 ? (
            <div className="steps-content" style={{ display: 'flex', justifyContent: 'center', paddingBottom: '100px' }}>
              <div style={{ width: '450px', }}>
                <div style={{ marginBottom: '50px' }}>
                  <p style={styles.greyBig}><FormattedMessage id="Content.successInfo" /></p>
                  <br />
                  <p style={styles.greyBig}><FormattedMessage id="Content.successInfo2" /></p>
                  <TextArea
                    value={textvalue?.length > 0 && textvalue.join('\n')}
                    autoSize={{ minRows: 5, maxRows: 10 }}
                    readOnly
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                  <Button type="primary" >
                    <Link to="/set-redirection">
                      <FormattedMessage id="Content.checkImportedLinks" />
                    </Link>

                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      this._init();
                    }}>
                    <FormattedMessage id="Content.ContinueToimport" />
                  </Button>
                </div>
              </div>



            </div>
          ) : null}
        </div>
      </div>
    );
  }

  _init = () => {
    let fileName = '';
    let loading = false;
    let isImport = true;
    this.setState({ fileName, loading, isImport, current: 0 });
  };

  _next = () => {
    this.next();
  };

  toDownTempl() {
    // 参数加密
    let base64 = new util.Base64();
    const token = (window as any).token;
    if (token) {
      let result = JSON.stringify({ token: token });
      let encrypted = base64.urlEncode(result);

      // 新窗口下载
      const exportHref = Const.HOST + `/redirectionUrl/queryExcel/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('please login');
    }
  }

  beforeUpload = (file) => {
    console.log('file', file)
  }

  changeImage = (info) => {
    const status = info.file.status;
    let loading = true;
    console.log('info', info)
    if (status == 'uploading') {
      const fileName = '';
      this.setState({ fileName, loading });
    }
    if (status === 'done') {
      let fileName = '';
      loading = false;
      if (info.file.response.code == Const.SUCCESS_CODE) {
        fileName = info.file.name;
        const textvalue = info.file.response.context || [];
        let isImport = false;
        this.setState({ isImport, textvalue: textvalue });
        message.success(fileName + ` ${(window as any).RCi18n({ id: "Public.Upload.uploadsuccess" })}`);
      } else {
        if (info.file.response === 'Method Not Allowed') {
          // 此功能您没有权限访问
          message.error('You do not have permission to access this feature');
        } else {
          let errStr = `${info.file.response.message}（${info.file.response.code}）`;
          notification.error({
            message: 'System Notification',
            duration: 5,
            key: 'error_pop',
            description: errStr,
          });
        }
      }
      this.setState({ fileName, loading });
    } else if (status === 'error') {
      // 上传失败
      message.error((window as any).RCi18n({ id: 'Public.Upload.uploadfailed' }));
      loading = false;
      this.setState({ loading });
    }
  };
}

const styles = {
  uploadTit: {
    margin: '40px 80px'
  },
  content: {
    background: '#fcfcfc',
    padding: '50px 0'
  },
  grey: {
    color: '#999999',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10
  },
  tip: {
    marginTop: 10,
    marginLeft: 10,
    color: '#333'
  },
  error: {
    color: '#e10000'
  },
  grey1: {
    color: '#666666',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10
  },
  center: {
    textAlign: 'center'
  },
  greyBig: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold'
  }
} as any;
