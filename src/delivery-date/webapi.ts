import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function GetAllCities() {
  return Fetch<TResult>('/systemRegion/findByStoreId', {
    method: 'GET'});
}