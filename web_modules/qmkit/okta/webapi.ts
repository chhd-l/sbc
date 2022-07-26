import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function logout() {
    return Fetch<TResult>('/logout', {
        method: 'GET'
    });
}

export function getStoreList() {
    return Fetch<TResult>('/customer/employee/getStoreList', {
        method: 'GET'
    });
}



