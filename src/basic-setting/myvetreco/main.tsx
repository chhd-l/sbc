import React from 'react';
import { BreadCrumb, Headline, Const } from 'qmkit';
import { Tabs, Spin, Button, Row, Col, message } from 'antd';
import { getStoreInfo, saveBasicInfo, saveRepresentative, saveBankInfo, submitForAudit } from '../webapi';
import { BusinessBasicInformationForm, IndividualBasicInformationForm } from './basic';
import { ShareHolderForm, SignatoriesForm } from './repre';
import BankInformation from './bank';
import moment from 'moment';

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
            //business的话，初始化representative form
            this.shodForm.props.form.setFieldsValue(storeInfoResp.representativeRequest?.shareholder ?? {});
            this.signForm.props.form.setFieldsValue({
              ...(storeInfoResp.representativeRequest?.signatories ?? {}),
              cityId: { key: storeInfoResp.representativeRequest?.signatories?.cityId ?? '', value: storeInfoResp.representativeRequest?.signatories?.cityId ?? '', label: storeInfoResp.representativeRequest?.signatories?.city ?? '' },
              dateOfBirth: storeInfoResp.representativeRequest?.signatories?.dateOfBirth ? moment(storeInfoResp.representativeRequest.signatories.dateOfBirth, 'YYYY-MM-DD') : null
            });
            this.signForm.setDefaultOptions();
          } else {
            this.basiForm.props.form.setFieldsValue({
              ...storeInfoResp.individualBasicRequest,
              cityId: { key: storeInfoResp.individualBasicRequest.cityId ?? '', value: storeInfoResp.individualBasicRequest.cityId ?? '', label: storeInfoResp.individualBasicRequest.city ?? '' },
              dateOfBirth: storeInfoResp.individualBasicRequest.dateOfBirth ? moment(storeInfoResp.individualBasicRequest.dateOfBirth, 'YYYY-MM-DD') : null
            });
          }
          this.basiForm.setDefaultOptions();
          //初始化bank information
          this.bankForm.props.form.setFieldsValue(storeInfoResp.bankRequest);
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
      this.basiForm.props.form.validateFields((errors, values) => {
        if (!errors) {
          this.setState({loading: true});
          saveBasicInfo({
            ...values,
            cityId: values.cityId.key,
            city: values.cityId.label,
            dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined
          }, typeOfBusiness === 1).then(data => {
            if (data.res.code === Const.SUCCESS_CODE) {
              message.success('Operate successful');
            }
            this.setState({loading: false});
          });
        }
      });
    } else if (current === '2') {
      Promise.all([
        new Promise((resolve, reject) => {
          this.shodForm.props.form.validateFields((errors, values) => {
            if (!errors) {
              resolve(values);
            } else {
              reject();
            }
          })
        }),
        new Promise((resolve, reject) => {
          this.signForm.props.form.validateFields((errors, values) => {
            if (!errors) {
              resolve({
                ...values,
                cityId: values.cityId.key,
                city: values.cityId.label,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null
              });
            } else {
              reject();
            }
          })
        })
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
      })
    } else {
      this.bankForm.props.form.validateFields((errors, values) => {
        if (!errors) {
          this.setState({loading: true});
          saveBankInfo(values).then(data => {
            if (data.res.code === Const.SUCCESS_CODE) {
              message.success('Operate successful');
            }
            this.setState({loading: false});
          });
        }
      });
    }
  }

  onAudit = () => {
    
  }

  render() {
    const { current, loading, typeOfBusiness } = this.state;
    return (
      <Spin spinning={loading}>
        <BreadCrumb />
        <div className="container-search">
          <Row>
            <Col span={12}>
              <Headline title="Store information" />
            </Col>
            <Col span={12} style={{textAlign:'right',paddingRight:20}}>
              <Button type="danger">Submit for auditing</Button>
              <Button type="link">Fail?</Button>
              <div>You can submit Ayden account once fill all required fields</div>
            </Col>
          </Row>
        </div>
        <div className="container">
          <Tabs activeKey={current} onChange={this.onTabChange}>
            <Tabs.TabPane tab="Basic information" key="1" forceRender>
              {typeOfBusiness === 1 ?
               <BusinessBasicInformationForm onChangeName={this.onChangeName} wrappedComponentRef={formRef => this.basiForm = formRef} /> :
               <IndividualBasicInformationForm onChangeName={this.onChangeName} wrappedComponentRef={formRef => this.basiForm = formRef} />
              }
            </Tabs.TabPane>
            <Tabs.TabPane tab="Representative" key="2" forceRender={typeOfBusiness === 1} disabled={typeOfBusiness === 0}>
              <ShareHolderForm wrappedComponentRef={formRef => this.shodForm = formRef} />
              <SignatoriesForm wrappedComponentRef={formRef => this.signForm = formRef} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Bank information" key="3" forceRender>
              <BankInformation isBusiness={typeOfBusiness === 1} wrappedComponentRef={formRef => this.bankForm = formRef} />
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
