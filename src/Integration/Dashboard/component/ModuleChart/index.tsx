import React, { Component } from 'react';
import {history} from 'qmkit';

import './index.less';

export default class ModuleChart extends Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            isActive: false
        }
    }

    goToDetails = (id) => {
        if (!id) return;
        history.push(`/integration-dashboard-detail/${id}`);
    }
    render() {

        return (
            <div className='ModuleChart-wrap'>
                <div className='ModuleChart-main'>
                    <div className='ModuleChart-box ModuleChart-center'>FGS</div>
                    <div
                        className='ModuleChart-box ModuleChart-item-box Navision'
                        onClick={() => this.goToDetails('Navision')}
                    >
                        Navision
                        <div className='arrows-box arrows-left active'/>
                        <div className='arrows-box arrows-right'/>
                    </div>
                    <div
                        className='ModuleChart-box ModuleChart-item-box WeSahre'
                        onClick={() => this.goToDetails('WeSahre')}
                    >
                        WeSahre
                        <div className='arrows-box arrows-left'/>
                        <div className='arrows-box arrows-right'/>
                    </div>
                    <div
                        className='ModuleChart-box ModuleChart-item-box DaData'
                        onClick={() => this.goToDetails('DaData')}
                    >
                        DaData
                        <div className='arrows-box arrows-left to-box-left'/>
                        <div className='arrows-box arrows-right to-box-left'/>
                    </div>
                    <div
                        className='ModuleChart-box ModuleChart-item-box Fedex'
                        onClick={() => this.goToDetails('Fedex')}
                    >
                        Fedex
                        <div className='arrows-box arrows-left to-box-left'/>
                        <div className='arrows-box arrows-right to-box-left'/>
                    </div>
                    <div
                        className='ModuleChart-box ModuleChart-item-box OKTA-CIAM'
                        onClick={() => this.goToDetails('OKTA CIAM')}
                    >
                        OKTA CIAM
                        <div className='arrows-box arrows-left to-box-top'/>
                        <div className='arrows-box arrows-right to-box-top active'/>
                    </div>
                </div>

            </div>
        );
    }
}