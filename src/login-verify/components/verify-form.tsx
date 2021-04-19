import React from 'react';
import { Form, Icon, Input, Button, Col, message, Checkbox, Row } from 'antd';
const FormItem = Form.Item;
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { history, Const, login, cache, OktaLogout, getRoutType, RCi18n } from 'qmkit';
import * as webApi from '../webapi';
const { Search } = Input;
import { withOktaAuth } from '@okta/okta-react';
import { FormattedMessage } from 'react-intl';

export default withOktaAuth(
  class VerifyForm extends React.Component<any, any> {
    constructor(props, ctx) {
      super(props);
      this.state = {
        requiredConsents: [],
        optionalConsents: [],
        checkContentIds: [],
        clickProcess: false,
        prcessDisabled: true,
        prcessLoadding: false
      };
    }

    async componentDidMount() {
      document.getElementById('consents').addEventListener('click', (e) => {
        if (e.target.localName === 'span') {
          let parentId = Number(e.target.parentNode.parentNode.id);
          let keyWords = e.target.innerText;
          let allList = [...this.state.requiredConsents, ...this.state.optionalConsents];
          let selectConsent = allList.find((x) => x.id === parentId);
          if (selectConsent) {
            let detali = selectConsent.detailList ? selectConsent.detailList.find((x) => x.contentTitle === keyWords) : { contentBody: '' };
            this.state.requiredConsents.map((requiredItem) => {
              if (requiredItem.id === parentId) {
                requiredItem.detailHtml = requiredItem.detailHtml ? '' : detali.contentBody;
              }
            });
            let tempRequiredConsents = [...this.state.requiredConsents];
            this.setState({
              requiredConsents: tempRequiredConsents
            });

            this.state.optionalConsents.map((optionalItem) => {
              if (optionalItem.id === parentId) {
                optionalItem.detailHtml = optionalItem.detailHtml ? '' : detali.contentBody;
              }
            });
            let tempOptionalConsents = [...this.state.optionalConsents];
            this.setState({
              optionalConsents: tempOptionalConsents
            });
          }
        }
      });
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      const loginLogo = sessionStorage.getItem(cache.SITE_LOGO);

      return (
        <div>
          <div style={styles.header}>
            <img style={styles.logo} src={loginLogo} />
            <div>
              <label style={styles.labelService}>
                <FormattedMessage id="Public.Thisserviceis" />
              </label>
            </div>
          </div>
          <Form style={styles.loginForm}>
            <FormItem style={{ marginBottom: 15 }}>
              <strong style={styles.title}>
                <FormattedMessage id="Public.Storeportal" />
              </strong>
            </FormItem>
            <FormItem style={{ marginTop: 10 }}>
              {getFieldDecorator('prescriberId', {
                rules: [{ required: true, message: RCi18n({id:'Public.ClientID Tip'}) }]
              })(<Search size="large" placeholder={RCi18n({id:'Public.ClientID Input'})} onSearch={(value, e) => this.search(value, e)} />)}
            </FormItem>
            <label style={styles.labelClientName}>
              <span style={{ color: '#E1021A' }}>*</span> <FormattedMessage id="Public.YourclientID" />
            </label>
            <FormItem style={{ marginTop: 10 }}>
              {getFieldDecorator('prescriberName', {
                rules: [{ required: false }]
              })(<Input size="large" disabled={true} placeholder={RCi18n({id:'Public.ClientName'})} />)}
            </FormItem>
            <FormItem style={{ marginTop: 10 }}>
              <Checkbox.Group style={{ width: '100%', maxHeight: '200px', overflowY: 'auto' }} onChange={this.consentChange}>
                <Row id="consents">
                  {this.state.requiredConsents.map((x, index) => {
                    return (
                      <Col span={24} key={index}>
                        <Row>
                          <Col span={2}>
                            <Checkbox value={x.id} key={x.id}></Checkbox>
                          </Col>
                          <Col span={22}>
                            <div id={x.id} dangerouslySetInnerHTML={{ __html: x.consentTitle }}></div>
                            {x.detailHtml ? <div style={{ padding: '10px 0' }} dangerouslySetInnerHTML={{ __html: x.detailHtml }}></div> : null}
                            {this.renderReuired(x.id)}
                          </Col>
                        </Row>
                      </Col>
                    );
                  })}

                  {this.state.optionalConsents.map((x, index) => {
                    return (
                      <Col span={24} key={index}>
                        <Row>
                          <Col span={2}>
                            <Checkbox value={x.id} key={x.id}></Checkbox>
                          </Col>
                          <Col span={22}>
                            <div id={x.id} dangerouslySetInnerHTML={{ __html: x.consentTitle }}></div>
                            {x.detailHtml ? <div style={{ padding: '10px 0' }} dangerouslySetInnerHTML={{ __html: x.detailHtml }}></div> : null}
                          </Col>
                        </Row>
                      </Col>
                    );
                  })}
                </Row>
              </Checkbox.Group>
            </FormItem>
            <FormItem>
              <Col span={10}>
                <OktaLogout type="button" text="Cancel" />
              </Col>
              <Col span={4}></Col>
              <Col span={10}>
                <Button type="primary" size="large" htmlType="submit" style={styles.loginBtn} onClick={(e) => this._handlePrcess(e)} disabled={this.state.prcessDisabled} loading={this.state.prcessLoadding}>
                  <FormattedMessage id="Public.Proceed" />
                </Button>
              </Col>
            </FormItem>
            <FormItem style={{ marginBottom: 0 }}>
              <div>
                <p style={{ textAlign: 'center', lineHeight: '20px', color: '#999' }}>
                  © <FormattedMessage id="Public.RoyalCaninSAS2020" />
                </p>
              </div>
            </FormItem>
          </Form>
        </div>
      );
    }

    consentChange = (checkedValue) => {
      this.setState({
        checkContentIds: checkedValue
      });
    };

    renderReuired(id) {
      return !this.state.checkContentIds.includes(id) && this.state.clickProcess ? <div style={styles.requiredLable}>This is required field</div> : null;
    }

    search = async (value, e) => {
      e.preventDefault();
      const form = this.props.form as WrappedFormUtils;
      const ids = value.split('-');
      if (ids && ids.length < 2) {
        message.error(RCi18n({id:'Public.NoPrescriber'}));
        form.setFieldsValue({ prescriberName: '' });
        return;
      }
      let param = {
        storeId: ids[0],
        prescriberId: ids[1]
      };
      const { res } = await webApi.getPrescriberByPrescriberIdAndStoreId(param);
      if (res.code === Const.SUCCESS_CODE && res.context && res.context.prescriberName) {
        form.setFieldsValue({ prescriberName: res.context.prescriberName });
      } else {
        message.error(RCi18n({id:'Public.NoPrescriber'}));
        form.setFieldsValue({ prescriberName: '' });
      }
      const { res: consentRes } = await webApi.getStoreOpenConsentList(param);
      if (consentRes.code === Const.SUCCESS_CODE && consentRes.context) {
        this.setState({
          requiredConsents: consentRes.context.requiredList,
          optionalConsents: consentRes.context.optionalList
        });
      } else {
        this.setState({
          requiredConsents: [],
          optionalConsents: []
        });
      }

      if (res.code === Const.SUCCESS_CODE && consentRes.code === Const.SUCCESS_CODE) {
        this.setState({
          prcessDisabled: false
        });
      }
    };

    _handlePrcess = async (e) => {
      e.preventDefault();
      const form = this.props.form as WrappedFormUtils;
      this.setState({
        clickProcess: true,
        prcessLoadding: true
      });

      let consentValid = true;
      this.state.requiredConsents.map((x) => {
        if (!this.state.checkContentIds.includes(x.id)) {
          consentValid = false;
          this.setState({
            prcessLoadding: false
          });
          return;
        }
      });
      form.validateFields(null, async (errs, values) => {
        if (!errs && consentValid) {
          let ids = values.prescriberId.split('-');
          if (ids && ids.length < 2) {
            message.error(RCi18n({id:'Public.NoPrescriber'}));
            this.setState({
              prcessLoadding: false
            });
            return;
          }
          let requiredList = [];
          let optionalList = [];

          this.state.requiredConsents.map((x) => {
            let isSelected = this.state.checkContentIds.includes(x.id);
            requiredList.push({ id: x.id, selectedFlag: isSelected });
          });

          this.state.optionalConsents.map((x) => {
            let isSelected = this.state.checkContentIds.includes(x.id);
            optionalList.push({ id: x.id, selectedFlag: isSelected });
          });

          // this.state.optionalConsents

          let oktaToken = this.props.authState.accessToken;
          sessionStorage.setItem(cache.OKTA_TOKEN, oktaToken);
          if (!oktaToken) {
            message.error(RCi18n({id:'Public.Expired'}));
            this.setState({
              prcessLoadding: false
            });
            let idToken = this.props.authState.idToken;
            let redirectUri = window.origin + '/logout?type=' + sessionStorage.getItem(cache.OKTA_ROUTER_TYPE);
            let issure = sessionStorage.getItem(cache.OKTA_ROUTER_TYPE) === 'staff' ? Const.REACT_APP_RC_ISSUER : Const.REACT_APP_PRESCRIBER_ISSUER;
            if (sessionStorage.getItem(cache.OKTA_ROUTER_TYPE) === 'staff') {
              this.props.authService.logout('/logout?type=' + sessionStorage.getItem(cache.OKTA_ROUTER_TYPE));
            } else {
              window.location.href = `${issure}/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${redirectUri}`;
            }
            return;
          }
          let param = {
            storeId: ids[0],
            prescriberId: ids[1],
            userId: sessionStorage.getItem(cache.LOGIN_ACCOUNT_NAME),
            employeeName: sessionStorage.getItem(cache.LOGIN_EMPLOYEE_NAME),
            oktaToken: 'Bearer ' + oktaToken,
            requiredList: requiredList,
            optionalList: optionalList
          };
          const { res } = await webApi.verifyUser(param);
          if (res.code === Const.SUCCESS_CODE) {
            if (res.context === 'needAudit') {
              history.push('/login-notify');
            } else if (res.context === 'alreadyRegister') {
              message.info(RCi18n({id:'Public.EmailTip'}));
            } else {
              let type = getRoutType(window.location.search);
              login(type, oktaToken);
            }
            this.setState({
              prcessLoadding: false
            });
          } else {
            this.setState({
              prcessLoadding: false
            });
          }
        }
      });
    };
  }
);

const styles = {
  loginForm: {
    width: 480,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 30,
    marginTop: 0,
    marginLeft: 500,
    boxShadow: '0 2px 60px 0 rgba(167,167,167,0.28)'
  },
  loginBtn: {
    fontFamily: 'DINPro-Bold',
    width: '100%',
    color: ' #FFFFFF',
    borderRadius: '22px',
    background: '#D81E06'
  },
  loginCancel: {
    width: '100%',
    background: '#fff',
    color: '#e2001a'
  },
  header: {
    width: 480,
    padding: 30,
    marginTop: 0,
    marginLeft: 500,
    textAlign: 'center'
  },
  logo: {
    width: 'auto',
    height: 60,
    marginBottom: '15px'
  },
  title: {
    fontSize: 32,
    color: '#222222',
    lineHeight: 1,
    textAlign: 'center',
    display: 'block',
    marginBottom: 30
  },
  labelService: {
    fontFamily: 'DINPro-Regular',
    fontSize: '16px',
    color: '#2E2E2E',
    letterSpacing: 0,
    lineHeight: '20px'
  },
  labelClientName: {
    fontFamily: 'DINPro-Medium',
    fontSize: '12px',
    color: '#444444',
    letterSpacing: 0,
    lineHeight: '20px'
  },
  requiredLable: {
    color: '#e2001a',
    padding: '10px 0'
  }
} as any;
