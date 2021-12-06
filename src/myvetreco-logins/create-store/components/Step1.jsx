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
      <div className="legal-container scrollbar">
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
      </div>
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
