import React, { useState, useEffect } from 'react';
import { Steps } from 'antd';
import { RCi18n, Const, cache } from 'qmkit';
import { getUserStatus } from '../login/webapi';
import logo from '../assets/images/myvet_logo.png';
import fgsLogo from '../../login-admin/img/logo.png';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import Create from './components/Creating';
import StoreAudit from './components/Audit';
import './index.less';
import '../assets/App.less';
const { Step } = Steps;
const sourceStoreId = sessionStorage.getItem(cache.CREATESTORE_SOURCE_STORE_ID)
  ? sessionStorage.getItem(cache.CREATESTORE_SOURCE_STORE_ID)
  : Const.SITE_NAME === 'MYVETRECO'
  ? 123457915
  : 123457909;
const sourceCompanyInfoId = sessionStorage.getItem(cache.CREATESTORE_SOURCE_COMPANYINFO_ID)
  ? sessionStorage.getItem(cache.CREATESTORE_SOURCE_COMPANYINFO_ID)
  : Const.SITE_NAME === 'MYVETRECO'
  ? 1062
  : 1053;
const Logo = Const.SITE_NAME === 'MYVETRECO' ? logo : fgsLogo;

//sourceStoreId and sourceCompanyInfoId into sessionStorage
sessionStorage.setItem(cache.CREATESTORE_SOURCE_STORE_ID, sourceStoreId);
sessionStorage.setItem(cache.CREATESTORE_SOURCE_COMPANYINFO_ID, sourceCompanyInfoId);

function CreateStores() {
  const userInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login')) || {};
  const [current, setCurrent] = useState(0);
  const [submitData, setSubmitData] = useState({});
  useEffect(() => {
    getData();
  }, []);
  /**
   * 获取上次提交的数据进行回显
   */
  const getData = async () => {
    const { res } = await getUserStatus(userInfo.accountName);
    if (res.code === 'K-000000') {
      setSubmitData(res.context);
    }
  };

  return (
    <div>
      {current < 5 ? (
        <div className="create-store-page scrollbar">
          <div className="vmargin-level-4 align-item-center">
            <img src={Logo} width="166" alt="" />
          </div>
          <div className="vmargin-level-4 align-item-center word large">
            {RCi18n({ id: 'Login.create_store_title' })}
          </div>
          <div className="vmargin-level-4">
            <Steps
              current={current}
              size="small"
              labelPlacement="vertical"
              style={{ width: 960, margin: '0 auto' }}
            >
              <Step title={RCi18n({ id: 'Login.create_store_step1' })} />
              <Step title={RCi18n({ id: 'Login.create_store_step2' })} />
              <Step title={RCi18n({ id: 'Login.create_store_step3' })} />
              {Const.SITE_NAME === 'MYVETRECO' && (
                <Step title={RCi18n({ id: 'Login.create_store_step4' })} />
              )}

              {Const.SITE_NAME === 'MYVETRECO' && (
                <Step title={RCi18n({ id: 'Login.create_store_step5' })} />
              )}
            </Steps>
          </div>
          <div id="create-store-content">
            {/*{current === 0 && <Step1 setStep={setCurrent} />}*/}
            {/*{current === 1 && <Step2 setStep={setCurrent} />}*/}
            {/*{current === 2 && <Step3 setStep={setCurrent} />}*/}
            {/*{current === 3 && <Step4 setStep={setCurrent} />}*/}
            {/*{current === 4 && <Step5 setStep={setCurrent} />}*/}
            <div style={{ display: current === 0 ? 'block' : 'none' }}>
              <Step1 setStep={setCurrent} userInfo={userInfo} />
            </div>
            <div style={{ display: current === 1 ? 'block' : 'none' }}>
              <Step2
                setStep={setCurrent}
                userInfo={userInfo}
                legalInfo={submitData?.legalInfo}
                sourceStoreId={sourceStoreId}
                sourceCompanyInfoId={sourceCompanyInfoId}
              />
            </div>
            <div style={{ display: current === 2 ? 'block' : 'none' }}>
              <Step3
                setStep={setCurrent}
                userInfo={userInfo}
                step={current}
                store={submitData?.store}
                sourceStoreId={sourceStoreId}
                sourceCompanyInfoId={sourceCompanyInfoId}
              />
            </div>
            <div style={{ display: current === 3 ? 'block' : 'none' }}>
              {Const.SITE_NAME === 'MYVETRECO' && (
                <Step4
                  setStep={setCurrent}
                  userInfo={userInfo}
                  step={current}
                  sourceStoreId={sourceStoreId}
                  sourceCompanyInfoId={sourceCompanyInfoId}
                />
              )}
            </div>
            <div style={{ display: current === 4 ? 'block' : 'none' }}>
              {Const.SITE_NAME === 'MYVETRECO' && (
                <Step5
                  setStep={setCurrent}
                  userInfo={userInfo}
                  paymentInfoRequest={submitData?.paymentInfoRequest}
                />
              )}
            </div>
          </div>
        </div>
      ) : current === 5 ? (
        <Create userInfo={userInfo} setStep={setCurrent} />
      ) : (
        <StoreAudit />
      )}
    </div>
  );
}

export default CreateStores;
