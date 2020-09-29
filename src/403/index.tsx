import React, { Component } from 'react'
import {IntlProvider,FormattedMessage, FormattedNumber} from 'react-intl';

const image = require('./image/403.jpg');
const logo = require('./image/logo--animated.png');

export default class index extends Component {
    render() {
        return (
            <React.Fragment>
            <div style={{ textAlign: 'center' }}>
                    <img src={logo} style={{width: '150px', margin: '80px auto 20px'}}></img>
                <div
                >
                <div className="container">
                    <div className="rc-padding--md rc-text--center rc-bg-colour--interface">
                    <img src={image} style={{width: '300px', margin: '0 auto'}}></img>
        
                    <div className="rc-bg-colour--brand3">
                        <div className="rc-padding--sm rc-margin-bottom--xs">
                        <div className="rc-padding-y--md rc-md-down"></div>
        
                        <div className="rc-layout-container rc-one-column rc-max-width--md">
                            <div className="rc-column">
                            <div className="rc-full-width rc-text--center rc-padding-x--sm">
                                <div className="rc-alpha inherit-fontsize">
                                <h1>
                                  NO Permission
                                </h1>
                                </div>
                                <div>
                                Your account has no permission
                                </div>
                            </div>
                            </div>
                        </div>
        
                        <div className="rc-padding-y--md rc-md-down"></div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
          </React.Fragment>
        )
    }
}
