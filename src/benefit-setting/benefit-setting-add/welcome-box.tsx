import React from 'react';
import config from '../configs';
import BenefitSettingAdd from './benefit-setting-item';

export default function WelcomeBox(props) {
  return (
    <BenefitSettingAdd benefitType={config.WELCOME_BOX} {...props} />
  );
}
