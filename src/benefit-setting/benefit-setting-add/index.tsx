import React from 'react';
import config from '../configs';
import BenefitSettingAdd from './benefit-setting-item';

export default function ConsumptionGift(props) {
  return (
    <BenefitSettingAdd benefitType={config.CONSUMPTION_GIFT} {...props} />
  );
}
