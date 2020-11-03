import React, { useEffect } from 'react';
import { Form, Button, Icon} from 'antd';
import { StoreProvider } from 'plume2';
const bg_login = require('./img/bg-notify.png');
const img_review = require('./img/review.png');
import AppStore from '../login/store';
import { withOktaAuth } from '@okta/okta-react';
import { cache} from 'qmkit';

const FormItem = Form.Item;

StoreProvider(AppStore, { debug: __DEV__ })
export default withOktaAuth(class LoginNotify extends React.Component<any, any> {
  store: AppStore;
  
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
                <div style={styles.reviewWord}>Under Review</div>
            </FormItem>
            <FormItem style={{ marginBottom: 40 }}>
                <div style={styles.notifyWord}>
                  Your application has been sent to the related prescriber and the user account is under audit.
                  We will notify you of the result by email.
                </div>
            </FormItem>
            <FormItem style={{ marginBottom: 30 }}>
              <Button
                type="primary"
                size="large"
                style={styles.returnBtn}
                onClick={(e) => this._handleReturn(e)}
              >
                <Icon type="arrow-left" /> Return
              </Button>
            </FormItem>
          </Form>
      </div>
    );
  }
  _handleReturn = async (e) =>{
    e.preventDefault();
    this.props.authService.logout('/logout?type=' + sessionStorage.getItem(cache.OKTA_ROUTER_TYPE));
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