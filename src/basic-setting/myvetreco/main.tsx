import React from 'react';
import { BreadCrumb, Headline, Const } from 'qmkit';
import { Tabs, Spin, Button, Row, Col, message, Modal } from 'antd';
import { getStoreInfo, saveBasicInfo, saveRepresentative, saveBankInfo, submitForAudit } from '../webapi';
import { BusinessBasicInformationForm, IndividualBasicInformationForm } from './basic';
import { ShareHolderForm, SignatoriesForm } from './repre';
import BankInformation from './bank';
import moment from 'moment';
import { ThisExpression } from 'ts-morph';

export const SupportedDocumentUtil = {
  mapPropsToFormData: (props) => {
    return props && props.length ? props.map(item => ({ uid: '-1', name: item, url: item, status: 'done' })) : [];
  },
  mapFormDataToProps: (formData) => {
    return formData && formData.length ? formData.map(item => item.url) : [];
  }
};

export default class MyvetrecoStoreSetting extends React.Component<any, any> {
  basiForm: any;
  shodForm: any;
  signForm: any;
  bankForm: any;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      current: '1',
      typeOfBusiness: 1,
      storeInfo: {
        businessBasicRequest: {},
        individualBasicRequest: {},
        representativeRequest: {
          shareholder: {},
          signatories: {}
        },
        bankRequest: {},
        adyenAuditState: 1, //0 - 审核中， 1 - 审核通过，2 - 审核未通过， 3 - 未创建
        errorList: []
      }
    }
  }

  componentDidMount() {
    this.getStoreInfo();
  }

  getStoreInfo = () => {
    const { storeInfo } = this.state;
    this.setState({ loading: true });
    getStoreInfo().then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        const storeInfoResp = data.res.context;
        this.setState({
          loading: false,
          typeOfBusiness: storeInfoResp.businessBasicRequest && storeInfoResp.businessBasicRequest.typeOfBusiness === 1 ? 1 : 0,
          storeInfo: Object.assign({}, storeInfo, storeInfoResp)
        }, () => {
          //初始化basic information form
          if (storeInfoResp.businessBasicRequest && storeInfoResp.businessBasicRequest.typeOfBusiness === 1) {
            this.basiForm.props.form.setFieldsValue({
              ...storeInfoResp.businessBasicRequest,
              cityId: { key: storeInfoResp.businessBasicRequest.cityId ?? '', value: storeInfoResp.businessBasicRequest.cityId ?? '', label: storeInfoResp.businessBasicRequest.city ?? '' }
            });
            //business 并且不是审核通过的状态的话，初始化representative form
            if (storeInfoResp.adyenAuditState !== 1) {
              this.shodForm.props.form.setFieldsValue({
                ...(storeInfoResp.representativeRequest?.shareholder ?? {}),
                supportedDocument: SupportedDocumentUtil.mapPropsToFormData(storeInfoResp.representativeRequest?.shareholder?.supportedDocument)
              });
              this.signForm.props.form.setFieldsValue({
                ...(storeInfoResp.representativeRequest?.signatories ?? {}),
                cityId: { key: storeInfoResp.representativeRequest?.signatories?.cityId ?? '', value: storeInfoResp.representativeRequest?.signatories?.cityId ?? '', label: storeInfoResp.representativeRequest?.signatories?.city ?? '' },
                dateOfBirth: storeInfoResp.representativeRequest?.signatories?.dateOfBirth ? moment(storeInfoResp.representativeRequest.signatories.dateOfBirth, 'YYYY-MM-DD') : null,
                supportedDocument: SupportedDocumentUtil.mapPropsToFormData(storeInfoResp.representativeRequest?.signatories?.supportedDocument)
              });
              this.signForm.setDefaultOptions();
            }
          } else {
            this.basiForm.props.form.setFieldsValue({
              ...storeInfoResp.individualBasicRequest,
              cityId: { key: storeInfoResp.individualBasicRequest.cityId ?? '', value: storeInfoResp.individualBasicRequest.cityId ?? '', label: storeInfoResp.individualBasicRequest.city ?? '' },
              dateOfBirth: storeInfoResp.individualBasicRequest.dateOfBirth ? moment(storeInfoResp.individualBasicRequest.dateOfBirth, 'YYYY-MM-DD') : null,
              supportedDocument: SupportedDocumentUtil.mapPropsToFormData(storeInfoResp.individualBasicRequest?.supportedDocument)
            });
          }
          this.basiForm.setDefaultOptions();
          //初始化bank information
          this.bankForm.props.form.setFieldsValue({
            ...(storeInfoResp.bankRequest ?? {}),
            supportedDocument: SupportedDocumentUtil.mapPropsToFormData(storeInfoResp.bankRequest?.supportedDocument)
          });
        });
      }
    });
  }

  onTabChange = (activeKey: string) => {
    this.setState({ current: activeKey });
  }

  onChangeName = (name: string) => {
    this.bankForm.props.form.setFieldsValue({ ownerName: name });
  }

  onSave = () => {
    const { current, typeOfBusiness } = this.state;
    if (current === '1') {
      this.basiForm.validateForm(
        typeOfBusiness === 1 ? () => { this.setState({loading: true}); } : null,
        typeOfBusiness === 1 ? () => { this.setState({loading: false}); } : null
      ).then(values => {
        this.setState({loading: true});
        saveBasicInfo(values, typeOfBusiness === 1).then(data => {
          if (data.res.code === Const.SUCCESS_CODE) {
            message.success('Operate successful');
          }
          this.setState({loading: false});
        });
      }).catch(() => {});
    } else if (current === '2') {
      Promise.all([
        this.shodForm.validateForm(),
        this.signForm.validateForm()
      ]).then(([values1, values2]) => {
        this.setState({loading: true});
        saveRepresentative({
          shareholder: values1,
          signatories: values2
        }).then(data => {
          if (data.res.code === Const.SUCCESS_CODE) {
            message.success('Operate successful');
          }
          this.setState({loading: false});
        });
      }).catch(() => {});
    } else {
      this.bankForm.validateForm().then(values => {
        this.setState({loading: true});
        saveBankInfo(values).then(data => {
          if (data.res.code === Const.SUCCESS_CODE) {
            message.success('Operate successful');
          }
          this.setState({loading: false});
        });
      }).catch(() => {});
    }
  }

  onAudit = () => {
    const { typeOfBusiness, storeInfo } = this.state;
    Promise.all([
      this.basiForm.validateForm(
        typeOfBusiness === 1 ? () => { this.setState({loading: true}); } : null,
        typeOfBusiness === 1 ? () => { this.setState({loading: false}); } : null
      ),
      typeOfBusiness === 1 ? this.shodForm.validateForm() : new Promise(resolve => resolve({})),
      typeOfBusiness === 1 ? this.signForm.validateForm() : new Promise(resolve => resolve({})),
      this.bankForm.validateForm()
    ]).then(([values1, values2, values3, values4]) => {
      this.setState({ loading: true });
      submitForAudit({
        [typeOfBusiness === 1 ? 'businessBasicRequest' : 'individualBasicRequest']: values1,
        representativeRequest: typeOfBusiness === 1 ? { shareholder: values2, signatories: values3 } : null,
        bankRequest: values4
      }).then(data => {
        if (data.res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfull');
          this.setState({
            loading: false,
            storeInfo: Object.assign({}, storeInfo, { adyenAuditState: 0 })
          });
        }
      });
    }).catch((step: string) => {
      this.onTabChange(step);
    });
  }

  showError = () => {
    const { storeInfo: { errorList } } = this.state;
    Modal.error({
      title: 'errors',
      content: <div style={{color:'red'}}>{errorList.map(err => <div>{err}</div>)}</div>,
      okText: 'OK'
    });
  }

  render() {
    const { current, loading, typeOfBusiness, storeInfo: { adyenAuditState } } = this.state;
    return (
      <Spin spinning={loading}>
        <BreadCrumb />
        <div className="container-search">
          <Row>
            <Col span={12}>
              <Headline title="Store information" />
            </Col>
            <Col span={12} style={{textAlign:'right',paddingRight:20}}>
              {adyenAuditState === 0 ? <Button type="primary" disabled>Wait for auditing</Button> : adyenAuditState > 1 ? <Button type="primary" onClick={this.onAudit}>Submit for auditing</Button> : null}
              {adyenAuditState === 2 && <Button type="link" onClick={this.showError}>Fail?</Button>}
              {adyenAuditState > 1 && <div>You can submit Ayden account once fill all required fields</div>}
            </Col>
          </Row>
        </div>
        <div className="container">
          <Tabs activeKey={current} onChange={this.onTabChange}>
            <Tabs.TabPane tab="Basic information" key="1" forceRender>
              {typeOfBusiness === 1 ?
               <BusinessBasicInformationForm adyenAuditState={adyenAuditState} onChangeName={this.onChangeName} wrappedComponentRef={formRef => this.basiForm = formRef} /> :
               <IndividualBasicInformationForm adyenAuditState={adyenAuditState} onChangeName={this.onChangeName} wrappedComponentRef={formRef => this.basiForm = formRef} />
              }
            </Tabs.TabPane>
            {typeOfBusiness === 1 && adyenAuditState !== 1 ? <Tabs.TabPane tab="Representative" key="2" forceRender={typeOfBusiness === 1}>
              <ShareHolderForm adyenAuditState={adyenAuditState} wrappedComponentRef={formRef => this.shodForm = formRef} />
              <SignatoriesForm adyenAuditState={adyenAuditState} wrappedComponentRef={formRef => this.signForm = formRef} />
            </Tabs.TabPane> : null}
            <Tabs.TabPane tab="Bank information" key="3" forceRender>
              <BankInformation isBusiness={typeOfBusiness === 1} adyenAuditState={adyenAuditState} wrappedComponentRef={formRef => this.bankForm = formRef} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className="bar-button">
          <Button type="primary" onClick={this.onSave}>Save</Button>
        </div>
      </Spin>
    );
  }
}
