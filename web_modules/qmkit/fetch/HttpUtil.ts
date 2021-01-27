import { message } from 'antd';
import { Store } from 'plume2';
import { util, history,cache } from 'qmkit';
const msg = {
    'K-000005': 'Your account is disabled',
    'K-000015': 'Failed to obtain authorization',
    'K-000002': ''
}
class HttpUtil{
    /**
      * 发送fetch请求
       * @param fetchUrl
       * @param fetchParams
       * @returns {Promise}
       */

    static handleFetchData(fetchUrl, fetchParams, httpCustomerOpertion) {
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
                                if (jsonBody.code === 'K-999996') {
                                    message.error(jsonBody.message);
                                    return;
                                }
                                // 账号禁用 统一返回到登录页面
                                else if (['K-000005', 'K-000015', 'K-000002'].includes(jsonBody.code)) {
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
                                    msg = "Not Find"
                                }

                                message.info(msg)
                                reject(HttpUtil.handleFailedResult({ fetchStatus: response.status, netStatus: response.status, error: msg }, httpCustomerOpertion))
                            }

                    }).catch(e => {
                        const errMsg = e.name + " " + e.message
                        reject(HttpUtil.handleFailedResult({ fetchStatus: response.status, error: errMsg, netStatus: response.status }, httpCustomerOpertion))
                    })
                }
            ).catch(e => {
                const errMsg = e.name + " " + e.message
                if (httpCustomerOpertion.isAbort) {
                    // 请求超时后，放弃迟到的响应
                    return
                }
                httpCustomerOpertion.isFetched = true
                httpCustomerOpertion.isHandleResult && message.error('Service is busy,please try again later');
                let er={ fetchStatus: "404", error: errMsg ,msg:'Request interface failed or interface does not exist, please check it'}
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
                message.info(errStr)
            }
            const errorMsg = "Uncaught PromiseError: " + (result.netStatus || "") + " " + (result.error || result.msg || result.message || "")
            sessionStorage.setItem(cache.ERROR_INFO,JSON.stringify(result))
           process.env.NODE_ENV==="production"&&history.push('error')

            return errorMsg


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
                    reject({ fetchStatus: "timeout" })
                }
            }, httpCustomerOpertion.timeout || 100000)
        })
    }


}
export default HttpUtil;
