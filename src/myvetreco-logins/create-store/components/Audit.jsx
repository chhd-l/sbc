import React from 'react';
import { Button } from 'antd';
import { history } from "qmkit";
import auditImg from '../../assets/images/store-audit.png';

export default function StoreAudit() {

  const backToLogin = () => {
    history.push("/login");
  };

  return (
    <div style={{paddingTop: 200, textAlign: 'center'}}>
      <img src={auditImg} alt="" />
      <div className="word tip" style={{margintTop: 70}}>You should enter your account and passwords again for logging in</div>
      <div style={{marginTop: 30}}>
        <Button type="primary" onClick={backToLogin}>Return to login page</Button>
      </div>
    </div>
  );
}
