import { Fetch } from 'qmkit';

/**
 * 新增调查
 */
 export const addNewSurvey = (params) =>{
  return Fetch(`/survey/add`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}