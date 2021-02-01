import { message } from 'antd';
import { Store } from 'plume2';
import { number } from 'prop-types';
import { util, history, cache } from 'qmkit';
const msg = {
    'K-000005': 'Your account is disabled',
    'K-000015': 'Failed to obtain authorization',
    'K-000002': ''
};
let errorList: any = [], _timerOut = 0, _times: number = 0,_error_index=0;
class HttpUtil {
    /**
      * 发送fetch请求
       * @param fetchUrl
       * @param fetchParams
       * @returns {Promise}
       */

    static handleFetchData(fetchUrl, fetchParams, httpCustomerOpertion) {
       let errorObj = Object.assign({}, { fetchUrl: fetchUrl.split('?')[0], fetchParams, httpCustomerOpertion });
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
                            _error_index=0;
                            _timerOut=0;
                           HttpUtil.findErrorInterfaceReload(true, errorObj)
                            if (jsonBody.code === 'K-999996') {
                                message.error(jsonBody.message);
                                return;
                            }
                            // token 过期时，前端直接处理
                            else if (jsonBody.code === 'K-000002') {
                                message.error(jsonBody.message);
                                util.logout();
                                history.push('/login');
                            }
                            // 账号禁用 统一返回到登录页面
                            else if (['K-000005', 'K-000015'].includes(jsonBody.code)) {
                                message.error(msg[jsonBody.code]);
                                history.push('login', { oktaLogout: true })
                                return;
                            } else if (jsonBody === 'Method Not Allowed') {
                                message.error('You do not have permission to access this feature');
                                return;
                            } else {
                                resolve(HttpUtil.handleResult(jsonBody, httpCustomerOpertion))
                            }
                        } else {
                            // 5. 接口状态判断
                            // http status header <200 || >299
                            let msg = "Service is busy,please try again later"
                            if (response.status === 404) {
                                msg = jsonBody.message
                            }

                            // message.info(msg)
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
               HttpUtil.findErrorInterfaceReload(false, errorObj)
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

        let code = result?.code??false;
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
            _error_index===0&&message.info(errStr)
        }
        _error_index++;
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
            }, httpCustomerOpertion.timeout || 100000)
        })
    }


    /**
     * 
     * @param status 请求成功的状态
     * fetchUrl.split('?')[0]
     */
    static findErrorInterfaceReload(status, errorObj) {
        let _index = errorList.findIndex(item => item.fetchUrl === errorObj.fetchUrl)
        if (!status && _index === -1) {
            errorList.push(errorObj);
        } else if (status && _index > -1) {
            errorList.splice(_index, 1)
        }
        const reoloadApi = () => {
            _timerOut++;
            new Promise((resolve,reject)=>{
                    if ((errorList.length-1) === _times) {
                        _times = 0;
                    } else {
                        _times++;
                        reoloadApi();
                    }
               
                let obj = errorList[_times];
                resolve(obj);
            }).then((obj:any)=>{
             
                if (typeof obj.fetchUrl === 'string') {
                    obj.fetchUrl += `${obj.fetchUrl.indexOf('?') == -1 ? '?reqId=' : '&reqId='
                        }${Math.random()}`;
                }
               HttpUtil.handleFetchData(obj.fetchUrl, obj.fetchParams, obj.httpCustomerOpertion);
            }).catch(e=>{
                console.error(e)
            });

        }
        errorList.length>0&&_timerOut<errorList.length&&reoloadApi();

    }

}
export default HttpUtil;