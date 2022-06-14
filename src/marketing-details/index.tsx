import React from 'react'
import { Const } from 'qmkit';

import FgsMarketingDetils from "./components/Fgs-marketing-detils";
import MyvetMarketingDetils from './components/myvet-marketing-detils'

export default function Index(props) {
  return Const.SITE_NAME === 'MYVETRECO' ? <MyvetMarketingDetils {...props} /> : <FgsMarketingDetils {...props} />
}
