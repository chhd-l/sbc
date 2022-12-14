import React from 'react';
import { Alert, Breadcrumb, Button, Icon, message, Row, Spin, Steps, Upload } from 'antd';
import { Const, Fetch, Headline, util, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { RCi18n } from 'qmkit';
const Dragger = Upload.Dragger;
const Step = Steps.Step;

const header = {
  Accept: 'application/json',
  authorization: 'Bearer ' + (window as any).token
};

const steps = [
  {
    id: 1,
    title: <FormattedMessage id="Product.downloadProductImportTemplate" />,
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
const importGoods = (ext) => {
  return Fetch('/goods/import/' + ext, {
    method: 'GET'
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
      isImport: true
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
    const { current, fileName, err, isImport, errBtn } = this.state;
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            <FormattedMessage id="Product.productImport" />
          </Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline title={<FormattedMessage id="Product.productImport" />} />
          <Alert
            message={RCi18n({id:'Product.OperationDescription'})}
            description={
              <ul>
                <li>1、{<FormattedMessage id="Product.importInfo1" />}</li>
                <li>2、{<FormattedMessage id="Product.importInfo2" />}</li>
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
              <Button type="primary" icon="download" style={{ marginTop: 10 }} onClick={this.toDownTempl}>
                {<FormattedMessage id="Product.downloadProductImportTemplate" />}
              </Button>
              <div style={{ marginTop: 40 }}>
                <Button type="primary" onClick={this._next}>
                  {<FormattedMessage id="Product.next" />}
                </Button>
              </div>
            </div>
          ) : null}
          {current == 1 ? (
            <Spin spinning={this.state.loading}>
              <div className="steps-content" style={styles.center}>
                <Dragger name="uploadFile" multiple={false} showUploadList={false} accept=".xls,.xlsx" headers={header} action={Const.HOST + '/goods/excel/upload'} onChange={this.changeImage}>
                  <div style={styles.content}>
                    <p className="ant-upload-hint" style={{ fontSize: 14, color: 'black' }}>
                      {' '}
                      <Icon type="upload" />
                      <FormattedMessage id="Product.chooseFileToUpload" />
                    </p>
                  </div>
                </Dragger>
                <div style={styles.tip}>{fileName}</div>
                {err ? (
                  <div style={styles.tip}>
                    <span style={styles.error}>导入失败！</span>
                    您可以<a onClick={this.toExcel}>下载错误表格</a>
                    ，查看错误原因，修改后重新导入。
                  </div>
                ) : null}

                <p style={styles.grey}>
                  <FormattedMessage id="Product.importInfo2" />
                </p>

                {errBtn ? (
                  <Button type="primary" onClick={this._importGoods} disabled={isImport}>
                    重新导入
                  </Button>
                ) : (
                  <Button type="primary" onClick={this._importGoods} disabled={isImport}>
                    <FormattedMessage id="Product.confirmToImport" />
                  </Button>
                )}
              </div>
            </Spin>
          ) : null}
          {current == 2 ? (
            <div className="steps-content" style={styles.center}>
              <div style={styles.center}>
                <p style={styles.greyBig}>导入成功！</p>
                <p style={styles.grey1}>您可以前往商品列表查看已导入的商品，或是继续导入。</p>
              </div>

              <Button type="primary" onClick={this._init}>
                继续导入
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  _init = () => {
    let err = false;
    let ext = '';
    let fileName = '';
    let loading = false;
    let isImport = true;
    let errBtn = false;
    this.setState({ err, ext, fileName, loading, isImport, errBtn });
    this.prev();
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
      const exportHref = Const.HOST + `/goods/excel/template/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('请登录');
    }
  }

  _importGoods = async () => {
    const { ext } = this.state;
    if (ext == '') {
      message.error('请上传文件');
      return;
    }

    let loading = true;
    this.setState({ loading });
    const importRes: any = await importGoods(ext);
    if (importRes.res.code == 'K-030404') {
      loading = false;
      let err = true;
      let errBtn = true;
      this.setState({ loading, err, errBtn });
    } else if (importRes.res.code == Const.SUCCESS_CODE) {
      loading = false;
      this.setState({ loading });
      this.next();
    } else {
      loading = false;
      this.setState({ loading });
      message.error(importRes.res.message);
    }
  };

  changeImage = (info) => {
    const status = info.file.status;
    let loading = true;
    let err = false;
    if (status == 'uploading') {
      const fileName = '';
      const ext = '';
      this.setState({ ext, fileName, loading, err });
    }
    if (status === 'done') {
      let fileName = '';
      let ext = '';
      loading = false;
      if (info.file.response.code == Const.SUCCESS_CODE) {
        fileName = info.file.name;
        ext = info.file.response.context;
        let isImport = false;
        this.setState({ isImport });
        message.success(fileName + '上传成功');
      } else {
        if (info.file.response === 'Method Not Allowed') {
          message.error('此功能您没有权限访问');
        } else {
          message.error(info.file.response.message);
        }
      }
      this.setState({ ext, fileName, loading, err });
    } else if (status === 'error') {
      message.error('上传失败');
      loading = false;
      this.setState({ loading, err });
    }
  };

  toExcel = () => {
    const { ext } = this.state;
    // 参数加密
    let base64 = new util.Base64();
    const atoken = (window as any).token;
    if (atoken != '') {
      let encrypted = base64.urlEncode(JSON.stringify({ token: atoken }));

      // 新窗口下载
      const exportHref = Const.HOST + `/goods/excel/err/${ext}/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('请登录');
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
