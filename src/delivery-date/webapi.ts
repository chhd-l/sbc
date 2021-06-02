import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function GetShipSettingList(filterParams = {}) {
  return Fetch<TResult>('/ShipSetting/list', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}