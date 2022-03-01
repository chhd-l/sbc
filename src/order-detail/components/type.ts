import { IMap } from 'plume2';

export interface Consignee {
  detailAddress: string;
  name: string;
  phone: string;
  countryId: string;
  country?: string;
  city: string;
  province: string;
  county: string;
  cityId: number;
  address: string;
  detailAddress1: string;
  detailAddress2: string;
  rfc: string;
  postCode: string;
  firstName: string;
  lastName: string;
  comment: string;
  entrance: string;
  apartment: string;
  area: string;
  timeSlot: string;
  deliveryDate: string;
  workTime: string;
  firstNameKatakana: string;
  lastNameKatakana: string;
}

export interface Invoice{
  open: boolean; //是否需要开发票
  type: number; //发票类型
  title: string; //发票抬头
  projectName: string; //开票项目名称
  generalInvoice?: IMap; //普通发票
  specialInvoice?: IMap; //增值税专用发票
  address: string;
  address1: string;
  address2: string;
  contacts: string; //联系人
  phone: string; //联系方式
  provinceId: number;
  cityId: number;
  province: string;
  county: string;
  countryId: number;
  country?: string;
  // city:string;
  // province:string;
  firstName: string;
  lastName: string;
  postCode: string;
  city: string;
  comment: string;
  entrance: string;
  apartment: string;
  area: string;
}
