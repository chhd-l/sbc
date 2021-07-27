import React,{ Component } from 'react';

import './index.less';

export default class StatisticsCharts extends Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            active: 'Hour'
        }
    }
    handleBtn = (e) => {
        this.setState({ active: e.target.value });
    }

    render() {
        let {active} = this.state;
        return (
            <div className='StatisticsCharts-wrap'>
                <div className='StatisticsCharts-header'>
                    <div className='header-right'>
                        {/*<AntBtnGroup*/}
                        {/*    active={active}*/}
                        {/*    onchange={this.handleBtn}*/}
                        {/*/>*/}
                    </div>
                </div>
            </div>
        );
    }
}