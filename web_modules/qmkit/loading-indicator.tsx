import React from 'react';
import { Icon } from 'antd';

export function LoadingForRC(props: any) {
  return (
    <img className="spinner ant-spin-dot" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />
  );
}

export function LoadingComponent(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="98px" height="98px" viewBox="0 0 98 98" version="1.1">
      <title>编组 2</title>
      <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="编组-2" transform="translate(2.000000, 2.000000)">
              <g id="编组-3" transform="translate(29.000000, 24.000000)" fill="#3C8CFF" fill-rule="nonzero">
                  <g id="编组">
                      <ellipse id="椭圆形" cx="18.0057865" cy="30.1916498" rx="1.21036506" ry="1.11784222"/>
                      <path d="M26.1650204,14.5696066 C22.4611489,18.7290906 15.8075913,19.3280564 11.3037119,15.9074497 C10.7758126,15.5051361 10.2907495,15.0571522 9.8551367,14.5696066 C1.94094042,18.2748081 -1.86444066,26.7572177 0.893284791,34.5460813 C0.893284791,34.5559912 1.98776383,37.4219484 4.72396144,36.3853677 C6.89575122,35.562842 6.48585809,33.2141842 6.05235855,32.4213883 L6.05235855,32.4213883 C5.30379416,30.6229867 4.93377805,28.7091567 4.96217158,26.7826274 C4.96217158,22.1110776 6.70046182,21.3460296 6.9751546,21.254858 C7.20883615,21.1916797 7.45062533,21.1576838 7.69407711,21.1537766 C8.30998982,21.1537766 8.86581349,21.5739584 9.17484286,22.0694558 L10.9431776,25.310009 C11.2393308,25.9382998 12.0161963,26.2118144 12.8123761,26.2118144 L17.1323493,26.2118144 C19.1002655,26.2118144 20.3514053,27.3831703 20.9587339,29.0103839 C21.1889292,29.6251718 21.8167005,30.0369133 22.5210491,30.0350726 L25.7401051,30.0350726 C26.5496129,30.0350726 27.2058486,30.6411443 27.2058486,31.3887716 C27.2058486,36.3635659 23.7571666,39.1700633 18.3706128,39.1700633 L17.7761605,39.1700633 C15.2931953,39.1700633 13.2823583,40.7021414 13.2823583,42.5909776 C13.2823583,44.4798139 15.2889032,46 17.7761605,46 L18.0100786,46 C26.3305224,45.9972892 33.5639475,40.7265908 35.5028581,33.2537334 C37.4417685,25.7808761 33.5804868,18.0548178 26.1650204,14.5696066 L26.1650204,14.5696066 Z" id="路径"/>
                      <ellipse id="椭圆形" cx="18.0057865" cy="8.3501228" rx="9.04125528" ry="8.3501228"/>
                  </g>
              </g>
              <circle id="椭圆形" stroke="#D7D7D7" stroke-width="4" cx="47" cy="47" r="47"/>
              <path d="M47,0 C21.0426168,0 0,21.0426168 0,47 C0,72.9573832 21.0426168,94 47,94 C72.9573832,94 94,72.9573832 94,47 C94,40.9038213 92.8393713,35.0787219 90.7270275,29.7336155" id="路径" stroke="#3C8CFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="bevel"/>
          </g>
      </g>
    </svg>
  );
}

export function LoadingForMyvetreco(props: any) {
  return (
    <Icon component={LoadingComponent} className="ant-spin-dot global-indicator-loading" />
  );
}