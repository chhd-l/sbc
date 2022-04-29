import React from 'react';
import { Button } from 'antd';
import { history } from 'qmkit';
import moment from 'moment';

import '../css/login-form.less';

const bgImg = require('../img/login--success.jpg');

export default function Result(props: any) {
  return (
    <div className="spec-login-form" style={{textAlign:'center'}}>
      <div style={{marginTop: 30, marginBottom: 20}}>
        <img src={bgImg} style={{width: 300}} />
      </div>
      <div style={{marginBottom: 30, fontSize: 24}}>
        <span style={{color: 'var(--primary-color)'}}>Ваш запрос принят во внимание!</span>
      </div>
      <div style={{margin: '0 auto'}}>
        <div>Если ваша учетная запись существует, вы получите сообщение электронной почты на адрес: <b>{props.location?.state?.email ?? ''}</b></div>
        <div>Чтобы сбросить пароль, следуйте указаниям в сообщении электронной почты.</div>
        <div style={{marginTop: 20}}>Вы не получили сообщение электронной почты?</div>
        <div>Еще нет? Мы приглашаем вас повторить попытку.</div>
      </div>
      <div style={{marginTop: 40}}>
        <Button type="primary" className="login-button hollow" onClick={() => history.push('/reset-step1')}>Повторить попытку</Button>
      </div>
      <div className="foot">
        <span>Copyright &copy; {moment().format('YYYY')} Royal Canin SAS</span>
      </div>
    </div>
  );
}
