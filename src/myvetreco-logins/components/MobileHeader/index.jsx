import React from 'react';
import { history } from 'qmkit';
import { Icon } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import './index.less';

export default function MobileHeader({ backUrl, title, showLeftIcon = true }) {
  
  const onBack = () => {
    if (backUrl) {
      history.push(backUrl);
    } else {
      history.go(-1);
    }
  }

  return (
    <div className="mobile-header">
      {showLeftIcon && <span className="left-icon" onClick={onBack}><Icon type="left" style={{fontSize:28}} /></span>}
      <span className="title">{title}</span>
      {showLeftIcon && <span className="right-icon"><Icon type="left" style={{fontSize:28}} /></span>}
    </div>
  );
}
