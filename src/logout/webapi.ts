import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function logout() {
    return Fetch<TResult>('/logout', {
        method: 'GET'
    });
}