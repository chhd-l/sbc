import React, { useEffect } from 'react';
import { Form, Button, Icon} from 'antd';
const bg_login = require('./img/bg-notify.png');
const img_review = require('./img/review.png');
import { withOktaAuth } from '@okta/okta-react';
import { cache, Const, RCi18n } from 'qmkit';

const FormItem = Form.Item;
export default withOktaAuth(class LoginNotify extends React.Component<any, any> {
  
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={styles.container}>
          <Form style={styles.notify}>
          <FormItem style={{ marginBottom: 30 }}>
            <img style={styles.reviewLogo} src={img_review} />
          </FormItem>
            <FormItem style={{ marginBottom: 30 }}>
                <div style={styles.reviewWord}>{RCi18n({id:'Public.UnderReview'})}</div>
            </FormItem>
            <FormItem style={{ marginBottom: 40 }}>
                <div style={styles.notifyWord}>
                  {RCi18n({id:'Public.Yourapplication'})}
                </div>
            </FormItem>
            <FormItem style={{ marginBottom: 30 }}>
              <Button
                type="primary"
                size="large"
                style={styles.returnBtn}
                onClick={(e) => this._handleReturn(e)}
              >
                <Icon type="arrow-left" /> {RCi18n({id:'Public.Return'})}
              </Button>
            </FormItem>
          </Form>
      </div>
    );
  }
  _handleReturn = async (e) =>{
    e.preventDefault();
    let idToken = this.props.authState.idToken;
    let redirectUri = window.origin + '/logout?type=' + sessionStorage.getItem(cache.OKTA_ROUTER_TYPE);
    let issure = sessionStorage.getItem(cache.OKTA_ROUTER_TYPE) ===  'staff' ? Const.REACT_APP_RC_ISSUER : Const.REACT_APP_PRESCRIBER_ISSUER;
    if(sessionStorage.getItem(cache.OKTA_ROUTER_TYPE) === 'staff') {
      this.props.authService.logout('/logout?type=' + sessionStorage.getItem(cache.OKTA_ROUTER_TYPE))
    } else {
      window.location.href = `${issure}/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${redirectUri}`;
    }
}
})
const styles = {
    reviewLogo: {
        width: 'auto',
        height: 97,
        marginBottom: '15px'
    },
    notify: {
        padding: 30,
        marginTop: 0,
        marginLeft: 100,
        marginRight:800
    },
    returnBtn: {
        fontFamily: 'DINPro-Bold',
        width: '24%',
        color: ' #FFFFFF',
        borderRadius: '22px',
        background: '#D81E06',
    },
    reviewWord: {
        fontFamily: 'DINPro-Regular',
        fontSize: 46,
        color: '#D81E06',
        letterSpacing: 0
    },
    notifyWord: {
        fontFamily: 'DINPro-Regular',
        fontSize: 22,
        color: '#394048',
        letterSpacing: 0
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundImage: 'url(' + bg_login + ')',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    } as any
};
