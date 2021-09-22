import { Fetch } from 'qmkit';

type TResult = {
    code: string;
    message: string;
    context: any;
};

type modifyLangType = {
    employeeId: string
    language: string
}

type InitLangType = {
    employeeId: string
    loginType: string
    oktaToken: string
}

/**
 * 获取当前语言列表
 */
export function getLanguageList() {
    return Fetch<TResult>('/language/list', {
        method: 'GET'
    });
}

/**
 * 语言切换保存
 */
export function modifyLanguage(params: modifyLangType) {
    return Fetch<TResult>('/language/modify', {
        method: 'POST',
        body: JSON.stringify(params)
    });
}

/**
 * 初始化语言
 */
export function InitLanguage() {
    const token = (window as any).token;
    let params = {
        employeeId: sessionStorage.getItem('employeeId') || '',
        loginType: sessionStorage.getItem('loginType') || '',
        oktaToken: token
    }
    return Fetch<TResult>('/language/init', {
        method: 'POST',
        body: JSON.stringify(params)
    });
}