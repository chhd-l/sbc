import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';



export function fetchAnalysisExportReport(data) {
  return Fetch<TResult>('/digitalStrategy/asyncReportPage',{
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function fetchAnalysisReportsDown(id) {
  return Fetch<TResult>('/digitalStrategy/async/export/'+id,{
    method: 'GET',
  });
}