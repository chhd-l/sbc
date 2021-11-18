import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * get Dict
 * @param filterParams
 */
export function querySysDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}


/**
 * 详情列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
 export function fetchFinanceRewardDetails(param = {}) {
  return Fetch<TResult>('/trade', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

/**
 * 详情
 */

export function fetchFindById(param = {}) {
  return Fetch<TResult>('/felinReco/findById', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchproductTooltip(param={}) {
  return Fetch<TResult>(`/recommendation/listGoodsInfo`/*'/recommendation/listGoodsInfo'*/, {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchCreateLink(param = {}) {
  return Fetch<TResult>('/recommendation/addGoodsInfoRel', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchModify(param = {}) {
  return Fetch<TResult>('/recommendation/modify', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

export function fetchLinkStatus(param = {}) {
  return Fetch<TResult>('/recommendation/modify/linkStatus', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}


//商品列表

export function fetchFelinRecoProducts(param = {}) {
  return Fetch<TResult>('/felinReco/products', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

/**
 * 扫码
 */
 export function fetchFelinFindByNoScan(param={}){
  return Fetch<TResult>('/appt/findByNo', {
    method: 'POST',
    body: JSON.stringify(param)
  });
 }

 /**
 * 保存
 */
  export function fetchFelinSave(param={}){
    return Fetch<TResult>('/felinReco/save', {
      method: 'POST',
      body: JSON.stringify(param)
    });
   }

 /**
 * 查询全部的问答
 */
  export function fetchFindFillAutoAllTitle(param={}){
    return Fetch<TResult>('/fill-auto/findAllTitle', {
      method: 'POST',
      body: JSON.stringify(param)
    });
   }

    /**
 * 查询单个的问答
 */
  export function fetchFindFillAutoById(id){
    return Fetch<TResult>(`/fill-auto/findById/${id}`, {
      method: 'POST'
    });
   }


   export function fetchlistGoodsInfo(param) {
    return Fetch<TResult>('/goodsInfos/bundelPage', {
      method: 'POST',
      body: JSON.stringify(param)
    });
  }

  //查找产品树和问题树
  export function fetchFindAllCate(param) {
    return Fetch<TResult>('/fill-auto/findAllCate', {
      method: 'POST',
      body: JSON.stringify(param)
    });
  }
 //查找所选
  export function acquireContent(param) {
    return Fetch<TResult>('/fill-auto/acquireContent', {
      method: 'POST',
      body: JSON.stringify(param)
    });
  }
    