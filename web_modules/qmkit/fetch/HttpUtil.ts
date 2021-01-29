import { message } from 'antd';
import { util, history, cache } from 'qmkit';
const msg = {
    'K-000005': 'Your account is disabled',
    'K-000015': 'Failed to obtain authorization',
    'K-000002': ''
}
let errorList: any = [];
let errorObj: any = {};
let _times: number = 0;
let _timerOut:any=null;
class HttpUtil {

    /**
      * 发送fetch请求
       * @param fetchUrl
       * @param fetchParams
       * @returns {Promise}
       */

    static handleFetchData(fetchUrl, fetchParams, httpCustomerOpertion) {
        errorObj = Object.assign({}, { fetchUrl:fetchUrl.split('?')[0], fetchParams, httpCustomerOpertion });
        // 1. 处理的第一步
        const { isShowLoading } = httpCustomerOpertion
        if (isShowLoading) {

        }
        httpCustomerOpertion.isFetched = false
        httpCustomerOpertion.isAbort = false
        // 处理自定义的请求头
        if (httpCustomerOpertion.hasOwnProperty("customHead")) {
            const { customHead } = httpCustomerOpertion
            fetchParams.headers = Object.assign({}, fetchParams.headers, customHead)
        }
        // 2. 对fetch请求再进行一次Promise的封装
        const fetchPromise = new Promise((resolve, reject) => {
            fetch(fetchUrl, fetchParams).then(
                (response: any) => {
                    // 3. 放弃迟到的响应
                    if (httpCustomerOpertion.isAbort) {
                        // 3. 请求超时后，放弃迟到的响应
                        return
                    }
                    if (isShowLoading) {
                        //暂不统一处理
                    }
                    httpCustomerOpertion.isFetched = true
                    response.json().then(jsonBody => {
                        if (response.status == 200 && response.ok) {
                            HttpUtil.findErrorInterfaceReload(true,fetchUrl.split('?')[0])
                            if (jsonBody.code === 'K-999996') {
                                message.error(jsonBody.message);
                                return;
                            }
                            // 账号禁用 统一返回到登录页面
                            else if (['K-000002', 'K-000005', 'K-000015'].includes(jsonBody.code)) {
                                message.error(msg[jsonBody.code]);
                                util.logout();
                                history.push('/login', { oktaLogout: false })
                                return;
                            } else if (jsonBody === 'Method Not Allowed') {
                                message.error('You do not have permission to access this feature');
                                return;
                            } else {
                                resolve(HttpUtil.handleResult(jsonBody, httpCustomerOpertion))
                            }
                        } else {
                            reject(HttpUtil.handleFailedResult({ code: response.status, message: msg, error: msg }, httpCustomerOpertion))
                        }

                    }).catch(e => {
                        let msg = "Service is busy,please try again later"
                        const errMsg = e.name + " " + e.message
                        reject(HttpUtil.handleFailedResult({ code: response.status, message: msg, error: errMsg, }, httpCustomerOpertion))
                    })
                }
            ).catch(e => {
                const errMsg = e.name + " " + e.message
                if (httpCustomerOpertion.isAbort) {
                    // 请求超时后，放弃迟到的响应
                    return
                }
                httpCustomerOpertion.isFetched = true
                let er = { code: "404", error: errMsg, message: 'Request interface failed or interface does not exist, please check it' }
                HttpUtil.findErrorInterfaceReload(false,fetchUrl.split('?')[0])
                reject(HttpUtil.handleFailedResult(er, httpCustomerOpertion))
            })
        })
        return Promise.race([fetchPromise, HttpUtil.fetchTimeout(httpCustomerOpertion)])
    }
    /**
       * 统一处理后台返回的结果, 包括业务逻辑报错的结果
       * @param result
       *
       */
    static handleResult(result, httpCustomerOpertion) {

        let code = result.code
        if (code && httpCustomerOpertion.isHandleResult === true) {
            const errMsg = result.msg || result.message || "Service is busy,please try again later"
            const errStr = `${errMsg}`
            //message.success(errStr)
        }

        return result
    }
    /**
     * 统一处fetch的异常, 不包括业务逻辑报错
     * @param result
     *
     */
    static handleFailedResult(result, httpCustomerOpertion) {

        if (result.code && httpCustomerOpertion.isHandleResult === true) {
            const errMsg = result.msg || result.message || "Service is busy,please try again later"
            const errStr = `${errMsg}（${result.code}）`
            // HttpUtil.hideLoading()
            //  message.info(errStr)
        }
        // const errorMsg = "Uncaught PromiseError: " + (result.netStatus || "") + " " + (result.error || result.msg || result.message || "")
        // sessionStorage.setItem(cache.ERROR_INFO,JSON.stringify({...result,error:errorMsg}))
        // process.env.NODE_ENV==="production"&&history.push('/error')

        return result;
    }
    /**
     * 控制Fetch请求是否超时
     * @returns {Promise}
     */
    static fetchTimeout(httpCustomerOpertion) {
        const { isShowLoading } = httpCustomerOpertion
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!httpCustomerOpertion.isFetched) {
                    // 还未收到响应，则开始超时逻辑，并标记fetch需要放弃
                    httpCustomerOpertion.isAbort = true
                    message.info("Service is busy,please try again later")
                    reject({ code: "timeout" })
                }
            }, httpCustomerOpertion.timeout || 100000000)
        })
    }

    /**
     * 
     * @param status 请求成功的状态
     */
    static findErrorInterfaceReload(status,fetchUrl:any) {
        let _index = errorList.findIndex(item => item.fetchUrl === fetchUrl)

        if (!status && _index === -1) {
            errorList.push(errorObj);
        } else if (status && _index > -1) {
           errorList.splice(_index, 1)
        }
        // return errorList;
        const reoloadApi = () => {
            _timerOut= setTimeout(() => {
                let {
                    fetchUrl,
                    fetchParams,
                    httpCustomerOpertion
                } = errorList[_times];
                if (typeof fetchUrl === 'string') {
                    fetchUrl += `${
                        fetchUrl.indexOf('?') == -1 ? '?reqId=' : '&reqId='
                    }${Math.random()}`;
                  }
                if (errorList.length === _times) {
                    _times=0;
                    HttpUtil.handleFetchData(fetchUrl, fetchParams, httpCustomerOpertion);
                    clearTimeout(_timerOut)
                }else{
                    HttpUtil.handleFetchData(fetchUrl, fetchParams, httpCustomerOpertion);
                    _times++;
                }
            }, 1000);
        }
        reoloadApi();
       
    }

}
export default HttpUtil;