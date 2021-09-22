import { Fetch } from 'qmkit';

type TResult = {
    code: string;
    message: string;
    context: any;
};

/**
 * 获取当前语言列表
 */
export function getLanguageList() {
    return Fetch<TResult>('/language/list', {
        method: 'GET'
    });
}

