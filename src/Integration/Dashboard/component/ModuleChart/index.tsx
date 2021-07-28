import React, { Component } from 'react';
import './index.less';

export default class ModuleChart extends Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            isActive: false
        }
    }
    render() {

        return (
            <div className='ModuleChart-wrap'>
                <div className='ModuleChart-main'>
                    <div className='ModuleChart-box ModuleChart-center'>FGS</div>
                    <div className='ModuleChart-box ModuleChart-item-box Navision'>
                        Navision
                        <div className='arrows-box arrows-left active'/>
                        <div className='arrows-box arrows-right'/>
                    </div>
                    <div className='ModuleChart-box ModuleChart-item-box WeSahre'>
                        WeSahre
                        <div className='arrows-box arrows-left'/>
                        <div className='arrows-box arrows-right'/>
                    </div>
                    <div className='ModuleChart-box ModuleChart-item-box DaData'>
                        DaData
                        <div className='arrows-box arrows-left to-box-left'/>
                        <div className='arrows-box arrows-right to-box-left'/>
                    </div>
                    <div className='ModuleChart-box ModuleChart-item-box Fedex'>
                        Fedex
                        <div className='arrows-box arrows-left to-box-left'/>
                        <div className='arrows-box arrows-right to-box-left'/>
                    </div>
                    <div className='ModuleChart-box ModuleChart-item-box OKTA-CIAM'>
                        OKTA CIAM
                        <div className='arrows-box arrows-left to-box-top'/>
                        <div className='arrows-box arrows-right to-box-top active'/>
                    </div>
                </div>

            </div>
        );
    }
}