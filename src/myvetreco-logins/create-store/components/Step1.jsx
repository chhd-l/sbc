import React, {useState} from 'react';
import {Checkbox, Button, Skeleton} from 'antd';
import {onContactAgreement} from "../webapi";
import { Const } from 'qmkit';

export default function Step1({ setStep,userInfo }) {
    const [check,setCheck] = useState(false)
    const [loading, setLoading] = useState(false);

    const toNext = async ()=>{
        setLoading(true)
        onContactAgreement({
            consentId: 123456,
            email: userInfo.accountName,
            employeeId: userInfo.employeeId
        }).then(res=>{
            setLoading(false)
            setStep(1)
        }).catch(err=>{
            setLoading(false)
        })
    }
  return (
    <div>

      <div className="vmargin-level-4 align-item-center word big">1 / {Const.SITE_NAME === 'MYVETRECO' ? '5' : '3'} Agree our legal contract to start</div>
      {Const.SITE_NAME === 'MYVETRECO' ? <div className="legal-container scrollbar">
        LEGAL CONTRACT <br />
          Mars is al meer dan 100 jaar een trots familiebedrijf. Het is deze onafhankelijkheid die het ons toestaat om in generaties te denken en niet in kwartalen, zodat we kunnen investeren in de langetermijntoekomst van ons bedrijf, onze mensen, onze klanten en de planeet — allemaal gedreven door onze vaste principes. Wij geloven dat de wereld die we morgen willen begint met de manier waarop we vandaag zaken doen.
          <br />
          Onze principes voor gegevensbescherming:
          <br />
          1. Wij hechten waarde aan en respecteren de persoonsgegevens die ons zijn toevertrouwd.
          <br />
          2. We streven ernaar transparant en verantwoordelijk te zijn in de manier waarop wij met de aan ons toevertrouwde persoonsgegevens omgaan , waarbij we ons laten leiden door onze vijf principes en de wet.
          <br />
          3. We houden ons aan de privacyrechten van onze consumenten, klanten en sollicitanten, en respecteren deze.
          <br />
          4. We streven naar een voortdurende verbetering van onze privacy- en veiligheidsprocedures.
          <br />
          5. Deze privacyverklaring geeft je informatie over de manier waarop wij persoonsgegevens verzamelen, gebruiken en delen bij Mars, Incorporated, dochterondernemingen en aangesloten bedrijven (tezamen, “Mars,” “wij,” “ons” of “onze”), via onze websites, mobiele applicaties of andere sites waarop deze privacyverklaring staat vermeld (tezamen de “Sites”). Deze privacyverklaring is ook van toepassing op informatie die wordt verzameld van jou persoonlijk en in een van onze winkels en/of dierenziekenhuizen (ook de “Sites“) en wanneer je solliciteert naar een baan bij Mars.
      </div> : <div className="legal-container scrollbar">
        LEGAL CONTRACT <br />
        Mars has been a proud family business for over 100 years. It's this independence that allows us to think in generations, not quarters, so that we can invest in the long-term future of our company, our people, our customers and the planet — all driven by our firm principles. We believe that the world we want tomorrow starts with the way we do business today.
          <br />
          Our data protection principles:
          <br />
          1. We value and respect the personal data entrusted to us.
          <br />
          2. We strive to be transparent and responsible in the way we handle the personal data entrusted to us, guided by our five principles and the law.
          <br />
          3. We adhere to and respect the privacy rights of our consumers, customers and job applicants.
          <br />
          4. We strive to continuously improve our privacy and security procedures.
          <br />
          5. This privacy statement provides you with information about how we collect, use and share personal information at Mars, Incorporated, its subsidiaries and affiliates (collectively, “Mars,” “we,” “us” or “our”), through our websites, mobile applications or other sites that contain this privacy statement (collectively, the “Sites”). This privacy statement also applies to information collected from you personally and at one of our stores and/or animal hospitals (also the “Sites”) and when you apply for a job at Mars.
      </div>}
      <div className="flex align-center space-between" style={{width:800,margin:'20px auto'}}>
        <div>
          <Checkbox checked={check}
                    onChange={(checkedValue)=>{
                        setCheck(checkedValue.target.checked)
                    }}>
              I agree with the legal contract
          </Checkbox>
        </div>
        <div>
          <Button loading={loading} disabled={!check} size="large" type="primary" onClick={toNext}>Next</Button>
        </div>
      </div>
        {/*<Skeleton active />*/}
    </div>
  );
}
