import React from 'react';
import {
    Spin
} from 'antd';

const loadingImg = <img
    style={{ width: '90px',height: '90px' }}
    src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif"
    alt=""
/>
function AntSpin(props){

    return <Spin indicator={loadingImg} {...props}/>;
}
AntSpin.loadingImg = loadingImg;

export default AntSpin;
