import { Fetch } from 'qmkit';

/**
 * 调查列表
 */
 export const surveyList = (params) =>{
  return Fetch('/survey/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 删除一条调查
 */
 export const deleteSurvey = (params) =>{
  return Fetch('/survey/delete', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 新增调查
 */
 export const addNewSurvey = (params) =>{
  return Fetch('/survey/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}