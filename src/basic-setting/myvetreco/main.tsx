import React from 'react';
import { BreadCrumb, Headline, Const, RCi18n } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { Tabs, Spin, Button, Row, Col, message, Modal } from 'antd';
import { getStoreInfo, saveBasicInfo, saveRepresentative, saveBankInfo, submitForAudit } from '../webapi';
import { BusinessBasicInformationForm, IndividualBasicInformationForm } from './basic';
import { ShareHolderForm, SignatoriesForm } from './repre';
import BankInformation from './bank';
import MapKeyToDisplayName from '../tools';
import moment from 'moment';

export const SupportedDocumentUtil = {
  mapPropsToFormData: (props, documentType) => {
    return props && props.length ? props.filter(item => item.documentType === documentType).map(item => ({ uid: '-1', name: item.filePath, url: item.filePath, status: 'done' })) : [];
  },
  mapFormDataToProps: (formData, documentType) => {
    return formData && formData.length ? formData.map(item => ({ filePath: item.url, documentType: documentType })) : [];
  },
  mapUploadObjToProps: (uploadObj) => {
    if (uploadObj.documentType === 'PASSPORT') {
      return SupportedDocumentUtil.mapFormDataToProps(uploadObj['PASSPORT'], 'PASSPORT');
    } else if (uploadObj.documentType === 'ID_CARD') {
      return SupportedDocumentUtil.mapFormDataToProps(uploadObj['ID_CARD_FRONT'], 'ID_CARD_FRONT').concat(SupportedDocumentUtil.mapFormDataToProps(uploadObj['ID_CARD_BACK'], 'ID_CARD_BACK'));
    } else {
      return SupportedDocumentUtil.mapFormDataToProps(uploadObj['DRIVING_LICENCE_FRONT'], 'DRIVING_LICENCE_FRONT').concat(SupportedDocumentUtil.mapFormDataToProps(uploadObj['DRIVING_LICENCE_BACK'], 'DRIVING_LICENCE_BACK'));
    }
  }
};

export const SupportedDocumentFieldValidator = (rules, value, callback) => {
  const errorMessage = RCi18n({id:"Store.supportdoctip"});
  if (value.documentType === 'PASSPORT' && value['PASSPORT'].length === 0) {
    callback(errorMessage);
  } else if (value.documentType === 'ID_CARD' && (value['ID_CARD_FRONT'].length === 0 || value['ID_CARD_BACK'].length === 0)) {
    callback(errorMessage);
  } else if (value.documentType === 'DRIVING_LICENCE' && (value['DRIVING_LICENCE_FRONT'].length === 0 || value['DRIVING_LICENCE_BACK'].length === 0)) {
    callback(errorMessage);
  } else {
    callback();
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
        errorList: ''
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
              const shodDocumentType = storeInfoResp.representativeRequest?.shareholder?.documentType ?? 'PASSPORT';
              this.shodForm.props.form.setFieldsValue({
                ...(storeInfoResp.representativeRequest?.shareholder ?? {}),
                cityId: { key: storeInfoResp.representativeRequest?.shareholder?.cityId ?? '', value: storeInfoResp.representativeRequest?.shareholder?.cityId ?? '', label: storeInfoResp.representativeRequest?.shareholder?.city ?? '' },
                dateOfBirth: storeInfoResp.representativeRequest?.shareholder?.dateOfBirth ? moment(storeInfoResp.representativeRequest.shareholder.dateOfBirth, 'YYYY-MM-DD') : null,
                supportedDocument: {
                  documentType: shodDocumentType,
                  ...(
                    shodDocumentType === 'PASSPORT'
                      ? {
                        PASSPORT: SupportedDocumentUtil.mapPropsToFormData(storeInfoResp.representativeRequest?.shareholder?.supportedDocument, 'PASSPORT')
                      }
                      : {
                        [`${shodDocumentType}_FRONT`]: SupportedDocumentUtil.mapPropsToFormData(storeInfoResp.representativeRequest?.shareholder?.supportedDocument, `${shodDocumentType}_FRONT`),
                        [`${shodDocumentType}_BACK`]: SupportedDocumentUtil.mapPropsToFormData(storeInfoResp.representativeRequest?.shareholder?.supportedDocument, `${shodDocumentType}_BACK`)
                      }
                  )
                }
              });
              this.shodForm.setDefaultOptions();
              const signDocumentType = storeInfoResp.representativeRequest?.signatories?.documentType ?? 'PASSPORT';
              this.signForm.props.form.setFieldsValue({
                ...(storeInfoResp.representativeRequest?.signatories ?? {}),
                cityId: { key: storeInfoResp.representativeRequest?.signatories?.cityId ?? '', value: storeInfoResp.representativeRequest?.signatories?.cityId ?? '', label: storeInfoResp.representativeRequest?.signatories?.city ?? '' },
                dateOfBirth: storeInfoResp.representativeRequest?.signatories?.dateOfBirth ? moment(storeInfoResp.representativeRequest.signatories.dateOfBirth, 'YYYY-MM-DD') : null,
                supportedDocument: {
                  documentType: signDocumentType,
                  ...(
                    signDocumentType === 'PASSPORT'
                      ? {
                        PASSPORT: SupportedDocumentUtil.mapPropsToFormData(storeInfoResp.representativeRequest?.signatories?.supportedDocument, 'PASSPORT')
                      }
                      : {
                        [`${signDocumentType}_FRONT`]: SupportedDocumentUtil.mapPropsToFormData(storeInfoResp.representativeRequest?.signatories?.supportedDocument, `${signDocumentType}_FRONT`),
                        [`${signDocumentType}_BACK`]: SupportedDocumentUtil.mapPropsToFormData(storeInfoResp.representativeRequest?.signatories?.supportedDocument, `${signDocumentType}_BACK`)
                      }
                  )
                }
              });
              this.signForm.setDefaultOptions();
            }
          } else {
            const basiDocumentType = storeInfoResp.individualBasicRequest?.documentType ?? 'PASSPORT';
            this.basiForm.props.form.setFieldsValue({
              ...storeInfoResp.individualBasicRequest,
              cityId: { key: storeInfoResp.individualBasicRequest.cityId ?? '', value: storeInfoResp.individualBasicRequest.cityId ?? '', label: storeInfoResp.individualBasicRequest.city ?? '' },
              dateOfBirth: storeInfoResp.individualBasicRequest.dateOfBirth ? moment(storeInfoResp.individualBasicRequest.dateOfBirth, 'YYYY-MM-DD') : null,
              supportedDocument: {
                documentType: basiDocumentType,
                ...(
                  basiDocumentType === 'PASSPORT'
                    ? {
                      PASSPORT: SupportedDocumentUtil.mapPropsToFormData(storeInfoResp.individualBasicRequest?.supportedDocument, 'PASSPORT')
                    }
                    : {
                      [`${basiDocumentType}_FRONT`]: SupportedDocumentUtil.mapPropsToFormData(storeInfoResp.individualBasicRequest?.supportedDocument, `${basiDocumentType}_FRONT`),
                      [`${basiDocumentType}_BACK`]: SupportedDocumentUtil.mapPropsToFormData(storeInfoResp.individualBasicRequest?.supportedDocument, `${basiDocumentType}_BACK`)
                    }
                )
              }
            });
          }
          this.basiForm.setDefaultOptions();
          //初始化bank information
          this.bankForm.props.form.setFieldsValue({
            ...(storeInfoResp.bankRequest ?? {}),
            cityId: { key: storeInfoResp.bankRequest?.cityId ?? '', value: storeInfoResp.bankRequest?.cityId ?? '', label: storeInfoResp.bankRequest.city ?? '' },
            supportedDocument: SupportedDocumentUtil.mapPropsToFormData(storeInfoResp.bankRequest?.supportedDocument, 'BANK_STATEMENT')
          });
          this.bankForm.setDefaultOptions();
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
            message.success(RCi18n({id:"Setting.Operatesuccessfully"}));
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
            message.success(RCi18n({id:"Setting.Operatesuccessfully"}));
          }
          this.setState({loading: false});
        });
      }).catch(() => {});
    } else {
      this.bankForm.validateForm().then(values => {
        this.setState({loading: true});
        saveBankInfo(values).then(data => {
          if (data.res.code === Const.SUCCESS_CODE) {
            message.success(RCi18n({id:"Setting.Operatesuccessfully"}));
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
          message.success(RCi18n({id:"Setting.Operatesuccessfully"}));
          this.setState({
            loading: false,
            storeInfo: Object.assign({}, storeInfo, { adyenAuditState: 0 })
          });
        } else {
          this.setState({ loading: false });
        }
      });
    }).catch((step: string) => {
      this.onTabChange(step);
    });
  }

  showError = () => {
    let { storeInfo: { errorList } } = this.state;
    errorList = JSON.parse(JSON.parse(errorList));
    Modal.error({
      title: RCi18n({id:"Store.plscheckfields"}),
      width: 600,
      content: <div style={{color:'red'}}>
        {errorList.map((err, idx) => <div key={idx}>
          {Object.keys(err).map((item, sidx) => <div key={sidx}>{MapKeyToDisplayName(item)}: {err[item]}</div>)}
        </div>)}
      </div>,
      okText: RCi18n({id:"Setting.OK"})
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
              <Headline title={RCi18n({id:"Store.storeInfo"})} />
            </Col>
            <Col span={12} style={{textAlign:'right',paddingRight:20}}>
              {adyenAuditState === 0 ? <Button type="primary" disabled><FormattedMessage id="Store.waitForAudit"/></Button> : adyenAuditState > 1 ? <Button type="primary" onClick={this.onAudit}><FormattedMessage id="Store.submitForAudit"/></Button> : null}
              {adyenAuditState === 2 && <Button type="link" onClick={this.showError}>{RCi18n({id:"Store.fail"})}</Button>}
              {adyenAuditState > 1 && <div><FormattedMessage id="Store.submittip"/></div>}
            </Col>
          </Row>
        </div>
        <div className="container">
          <Tabs activeKey={current} onChange={this.onTabChange}>
            <Tabs.TabPane tab={RCi18n({id:"Store.basicInfo"})} key="1" forceRender>
              {typeOfBusiness === 1 ?
               <BusinessBasicInformationForm adyenAuditState={adyenAuditState} onChangeName={this.onChangeName} wrappedComponentRef={formRef => this.basiForm = formRef} /> :
               <IndividualBasicInformationForm adyenAuditState={adyenAuditState} onChangeName={this.onChangeName} wrappedComponentRef={formRef => this.basiForm = formRef} />
              }
            </Tabs.TabPane>
            {typeOfBusiness === 1 && adyenAuditState !== 1 ? <Tabs.TabPane tab="Representative" key="2" forceRender={typeOfBusiness === 1}>
              <ShareHolderForm adyenAuditState={adyenAuditState} wrappedComponentRef={formRef => this.shodForm = formRef} />
              <SignatoriesForm adyenAuditState={adyenAuditState} wrappedComponentRef={formRef => this.signForm = formRef} />
            </Tabs.TabPane> : null}
            <Tabs.TabPane tab={RCi18n({id:"Store.bankInfo"})} key="3" forceRender>
              <BankInformation isBusiness={typeOfBusiness === 1} adyenAuditState={adyenAuditState} wrappedComponentRef={formRef => this.bankForm = formRef} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className="bar-button">
          <Button type="primary" onClick={this.onSave}><FormattedMessage id="Setting.Save"/></Button>
        </div>
      </Spin>
    );
  }
}
