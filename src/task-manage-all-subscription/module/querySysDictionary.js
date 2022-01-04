import * as webapi from '../webapi';
import { Const } from '../../../web_modules/qmkit';

//获取task-manage-all-subscription页面相关的数据字典
export const getSubscriptionAllSysDictionary = () => {
  return {
    countryArr:getCountrySubFrequency(),
    frequencyList: getAutoSubFrequency(),
    frequencyClubList:getClubSubFrequency(),
    individualFrequencyList:getIndividualSubFrequency()
  };
};

//获取country的数据字典
export const getCountrySubFrequency = () => {
  return querySysDictionary('country');
};

//获取auto subscription的frequency字典
export const getAutoSubFrequency = () => {
  return [
    ...querySysDictionary('Frequency_day'),
    ...querySysDictionary('Frequency_week'),
    ...querySysDictionary('Frequency_month')
  ];
};

//获取club subscription的frequency字典
export const getClubSubFrequency = () => {
  return [
    ...querySysDictionary('Frequency_day_club'),
    ...querySysDictionary('Frequency_week_club'),
    ...querySysDictionary('Frequency_month_club')
  ];
};

//获取club subscription的frequency字典
export const getIndividualSubFrequency = () => {
  return querySysDictionary('Frequency_day_individual');
};

//获取数据字典
export const querySysDictionary = (type) => {
  let sysDictionary = [];
  if (JSON.parse(sessionStorage.getItem(type + '_dict'))) {
    sysDictionary = JSON.parse(sessionStorage.getItem(type + '_dict'));
  } else {
    webapi
      .querySysDictionary({
        type: type
      })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          sysDictionary = [...res.context.sysDictionaryVOS];
          sessionStorage.setItem(type + '_dict', JSON.stringify(sysDictionary));
        }
      });
  }
  return sysDictionary;
};
