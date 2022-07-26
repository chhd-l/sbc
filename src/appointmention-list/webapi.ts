import { Fetch, cache, Const, util } from 'qmkit';
import { message } from 'antd';
import {TResult} from 'qmkit/type';
// type TResult = {
//   code: string;
//   message: string;
//   context: any;
// };

// 获取customer list
export function getCustomerList(filterParams = {}) {
  return Fetch<TResult>('/customer/pageBySupplier', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getAppointmentList(params = {}) {
  return Fetch<TResult>('/appt/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function getAvailabelTimeByDate(dateStr: string) {
  return Fetch<TResult>('/appt/findByStoreAndDate', {
    method: 'POST',
    body: JSON.stringify({ apptDate: dateStr })
  });
}

export function addNewAppointment(params = {}) {
  return Fetch<TResult>('/appt/save', {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] || ''
    })
  });
}

export function findAppointmentById(id: number) {
  return Fetch<TResult>('/appt/find', {
    method: 'POST',
    body: JSON.stringify({ id })
  });
}

export function findAppointmentByAppointmentNo(apptNo) {
  return Fetch<TResult>('/appt/findByNo', {
    method: 'POST',
    body: JSON.stringify({ apptNo })
  });
}

export function updateAppointmentById(params = {}) {
  return Fetch<TResult>('/appt/update', {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] || ''
    })
  });
}


export function queryDate(params = {}) {
  return Fetch<TResult>('/resourceDatePlan/queryDate', {
    method: 'POST',
    body: JSON.stringify({
      "serviceTypeId":"6",
     ...params
    })
  });
}
//查询字典
export const goodsDict = (type) =>{
  return Fetch(`/goodsDictionary/queryGoodsDictionary`, {
    method: 'POST',
    body: JSON.stringify(type)
  });
}

 //获取字典
 export const getAllDict = async (type) => {

   const {res}:any=await goodsDict({ type})

   if (res?.code === Const.SUCCESS_CODE) {
    let objValue = {}
    let list = res.context.goodsDictionaryVOS
    list.map(it => {
      objValue[it.id] = it.name;
    })
    return {
      list,
      objValue
    }
  }
  return {
    list:[],
    objValue:{}
  }

//   const allDict = await Promise.all([goodsDict({ type: 'service_type' }), goodsDict({ type: 'apprintment_type' }), await goodsDict({ type: 'expert_type' })])
//   console.log(allDict)
//   let _listKey = ['serviceTypeObj', 'apprintmentTypObj', 'expertTypeObj',],
//     _list_ = ['serviceTypeList', 'apprintmentTypeList', 'expertTypeList',]
//   allDict.map((item, index) => {
//     const { res }: any = item;
//     if (res?.code === Const.SUCCESS_CODE) {
//       let objValue = {}
//       let _list = res.context.goodsDictionaryVOS
//       _list.map(it => {
//         objValue[it.id] = it.name;
//       })
//     }
//   })
}

//list
export const apptList = (params={}) =>{
  return Fetch(`/appt/list`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
//update
export const apptUpdate = (params={}) =>{
  return Fetch(`/appt/update`, {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] || ''
    })
  });
}
//find
export const apptFindById = (id) =>{
  return Fetch(`/appt/find?id=${id}`, {
    method: 'get',
  });
}

//保存
export const apptSave = (params={}) =>{
  return Fetch(`/appt/save`, {
    method: 'POST',
    body: JSON.stringify({...params,
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] || ''
    })
  });
}

//cancel
export const apptCancel = (params) =>{
  return Fetch(`/appt/cancel`, {
    method: 'post',
    body: JSON.stringify(params)
  });
}
// details
export const apptDetail = (id) =>{
  return Fetch(`/appt/detail/${id}`);
}
//arrived
export const apptArrived = (params) =>{
  return Fetch(`/appt/arrived`, {
    method: 'post',
    body: JSON.stringify(params)
  });
}


// 获取 id
export function getMagByApptId(filterParams = {}) {
  return Fetch<TResult>('/felinReco/magByApptId', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}



//blocked

export const bookBySlot = (params) =>{
  return Fetch(`/resourceDatePlan/blockBySlot`, {
    method: 'post',
    body: JSON.stringify({...params,
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] || ''
    })
  });
}
export const releaseById = (params) =>{
  return Fetch(`/resourceDatePlan/releaseById`, {
    method: 'post',
    body: JSON.stringify({...params,
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] || ''
    })
  });
}



export function exportAppointmentList(params = {}) {
  params['storeId'] = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] || '';
  return new Promise((resolve) => {
    setTimeout(() => {
      // 参数加密
      let base64 = new util.Base64();
      const token = (window as any).token;
      if (token) {
        let result = JSON.stringify({ ...params, token: token });
        let encrypted = base64.urlEncode(result);

        // 新窗口下载
        const exportHref = Const.HOST + `/appt/export/${encrypted}`;
        window.open(exportHref);
      } else {
        message.error('Please login first');
      }

      resolve('');
    }, 500);
  });
}

/**
 * 每日排版计划表
 */
 export const calendarByDay = (params) =>{
  return Fetch(`/resourceDatePlan/calendarByDay`, {
    method: 'POST',
    body: JSON.stringify({...params,
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] || ''
    })
  });
}

/**
 * 人员列表
 */
 export const AllEmployeePerson = (params={}) =>{
  return Fetch(`/resourceSetting/getAllEmployeeForResource`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}