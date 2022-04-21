import { QL } from 'plume2';
import { IList } from 'typings/globalType';
import { fromJS } from 'immutable';

export const ruleTableListQL = QL('ruleTableListQL', [
  'ruleTableList',
  (requests: IList) => {
    return requests.filter((r) => r.get('delFlag') == 0).toJS();
  }
]);
