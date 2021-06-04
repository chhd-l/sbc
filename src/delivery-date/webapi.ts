import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function GetAllCities() {
  return Fetch<TResult>('/system-city/query-all', {
    method: 'GET'});
}