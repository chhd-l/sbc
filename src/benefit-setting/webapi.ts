
/*获取Group*/
import {Fetch} from 'qmkit';
type TResult = {
    code: string;
    message: string;
    context: any;
};

export const getAllGroups = (params) => {
    return Fetch('/customer/segment/segment/query', {
        method: 'POST',
        body: JSON.stringify({ ...params })
    });
};
