import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function fetchAnalysisExportReport(data) {
  return Fetch<TResult>('/digitalStrategy/asyncReportPage',{
    method: 'POST',
    body: JSON.stringify(data)
  });
}