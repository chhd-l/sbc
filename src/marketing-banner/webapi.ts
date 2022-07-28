import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function setBannerForm(data) {
  // console.log(JSON.stringify({data}))

  return Fetch<TResult>('/marketingBanner/saveMarketingBanner',{
    method: 'POST',
    body: JSON.stringify(
      data
    )
  })
}

export function GetBanner() {
  return Fetch<TResult>('/marketingBanner/getMarketingBanner', {
    method: 'GET',
  });
}

// export function editBannerOption(status) {
//   // return !status;
//   return Fetch<TResult>('',{
//     method: 'POST',
//     body: JSON.stringify({
//       requestList: [{ status: status }]
//     })
//   })
//   // return Fetch<TResult>('/system/config/batchEnableAndDisable', {
//   //   method: 'POST',
//   //   body: JSON.stringify({
//   //     requestList: [{ status: status }]
//   //   })
//   // });
// }