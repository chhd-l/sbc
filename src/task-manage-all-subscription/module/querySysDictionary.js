import * as webapi from '../webapi';
import { Const } from '../../../web_modules/qmkit';

//获取task-manage-all-subscription页面相关的数据字典
export const getSubscriptionAllSysDictionary = async () => {
  const countryArr=await getCountrySubFrequency();
  const frequencyList=await getAutoSubFrequency();
  const frequencyClubList=await getClubSubFrequency();
  const individualFrequencyList=await getIndividualSubFrequency()
  return {
    countryArr:countryArr,
    frequencyList: frequencyList,
    frequencyClubList:frequencyClubList,
    individualFrequencyList:individualFrequencyList
  };
};

//获取country的数据字典
export const getCountrySubFrequency = async () => {
  return await querySysDictionary('country');
};

//获取auto subscription的frequency字典
export const getAutoSubFrequency = async () => {
  const Frequency_day=await querySysDictionary('Frequency_day')
  const Frequency_week=await querySysDictionary('Frequency_week')
  const Frequency_month=await querySysDictionary('Frequency_month')
  return [
    ...Frequency_day,
    ...Frequency_week,
    ...Frequency_month
  ]
};

//获取club subscription的frequency字典
export const getClubSubFrequency = async () => {
  const Frequency_day_club=await querySysDictionary('Frequency_day_club')
  const Frequency_week_club=await querySysDictionary('Frequency_week_club')
  const Frequency_month_club=await querySysDictionary('Frequency_month_club')
  return [
    ...Frequency_day_club,
    ...Frequency_week_club,
    ...Frequency_month_club
  ]
};

//获取club subscription的frequency字典
export const getIndividualSubFrequency = async () => {
  return await querySysDictionary('Frequency_day_individual');
};

//获取数据字典
export const querySysDictionary = async (type) => {
  let sysDictionary = [];
  try{
    if (JSON.parse(sessionStorage.getItem(type + '_dict'))) {
      sysDictionary = JSON.parse(sessionStorage.getItem(type + '_dict'));
    } else {
      const data=await webapi.querySysDictionary({ type: type })
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        sysDictionary = [...res.context.sysDictionaryVOS];
        sessionStorage.setItem(type + '_dict', JSON.stringify(sysDictionary));
      }
    }
  }catch (e) {

  }
  return sysDictionary;
};
