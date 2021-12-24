import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IRoute } from './route-with-subroutes';
import noop from './noop';
import { routes, homeRoutes, auditDidNotPass } from '../../src/router';
import { fromJS } from 'immutable';
import { util, cache, Const } from 'qmkit';
export type Loader = () => Promise<any>;

export interface Props {
  path: string;
  exact?: boolean;
  strict?: boolean;
  load: Loader;
  subRoutes?: Array<IRoute>;
  handlePathMatched?: Function;
}

/**
 * 封装异步路由的解决方案
 * @param props 路由参数
 */
export default function AsyncRoute(props: Props) {
  const { load, handlePathMatched, subRoutes, ...rest } = props;
  return (
    <Route
      {...rest}
      render={(props) => {
        const unAuthRoutes = fromJS(homeRoutes);
        if (unAuthRoutes.some((route) => route.get('path') == props.match.path)) {
          // 1.不需要登录权限,直接可以访问的页面
          return <AsyncLoader {...props} load={load} subRoutes={subRoutes} />;
        } else {
          if (util.isLogin()) {
            const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
            const auditState = loginInfo.auditState; // 商家登录审核状态 -1:未开店(没有审核状态)  0:未审核  1:已审核  2:审核未通过
            if (auditState == 1) {
              // return <AsyncLoader {...props} load={load} subRoutes={subRoutes} />;
              // 2.1.审核通过状态下, 只能访问路由中定义的页面(入驻流程无法查看)
              if (fromJS(routes).some((route) => route.get('path') == props.match.path)) {
                return <AsyncLoader {...props} load={load} subRoutes={subRoutes} handlePathMatched={handlePathMatched} />;
              } else {
                return (
                  <Redirect
                    to={{
                      pathname: '/lackcompetence',
                      state: { from: props.location }
                    }}
                  />
                );
              }
            } else {
              // 2.2.非审核成功状态下, 只能看到入驻流程页面(其他页面无法查看)
              if (fromJS(auditDidNotPass).some((route) => route.get('path') == props.match.path)) {
                return <AsyncLoader {...props} load={load} subRoutes={subRoutes} />;
              } else {
                return (
                  <Redirect
                    to={{
                      pathname: '/lackcompetence',
                      state: { from: props.location }
                    }}
                  />
                );
              }
            }
          } else {
            // 2.3.需要登录的,跳转到登录页面
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
          }
        }
      }}
    />
  );
}

/**
 * 异步load模块组件
 */
class AsyncLoader extends React.Component<any, any> {
  props: {
    subRoutes?: Array<IRoute>;
    load: Loader;
    handlePathMatched?: Function;
    match: any;
  };

  state: {
    Component: React.ComponentClass<any>;
  };

  static defaultProps = {
    load: noop,
    handlePathMatched: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      Component: null
    };
  }

  componentDidMount() {
    const { load } = this.props;
    const { handlePathMatched } = this.props;
    handlePathMatched(this.props.match.path);

    load()
      .then((Component) =>
        this.setState({
          Component: Component.default || Component
        })
      )
      .catch(() => { });
  }

  render() {
    const { Component } = this.state;
    // return (
    //   <div style={{
    //     position: 'absolute',
    //     left: '50%',
    //     top: '50%',
    //   }}>
    //     <div className="donut" style={{position: 'absolute',}}></div>
    //     <svg xmlns="http://www.w3.org/2000/svg" style={{
    //     position: 'absolute',
    //     left: 20,
    //     top: 35,
    //   }} viewBox="0 0 190.7 104" width='60px' data-js-import-interactive-svg="null" svg-animate-processed="true">
    //       <path d="M38.3 93.9c-3.1 0-5.6-2.4-5.6-5.5 0-1.8.8-3.5 2.3-4.5 14.7-11 37.2-17.6 60.2-17.6 22.9 0 45.4 6.6 60.1 17.6 2.4 1.8 2.9 5.3 1.1 7.8-1.8 2.4-5.3 2.9-7.8 1.1-9.9-7.4-29.2-15.4-53.5-15.4-24.4 0-43.7 7.9-53.6 15.4-.8.7-2 1.1-3.2 1.1zm5.1 9.4c.9 0 1.7-.3 2.4-.9 11.2-9.2 30.2-15 49.4-15 19.4 0 37.9 5.6 49.3 15 1.6 1.3 4 1.1 5.3-.5 1.3-1.6 1.1-4-.5-5.3-12.7-10.5-33-16.7-54.1-16.7S53.7 86.2 41 96.6c-1.6 1.3-1.9 3.7-.5 5.3.7.9 1.8 1.4 2.9 1.4zM13.7 23.5C6.7 23.5 1 29.2 1 36.2c0 7 5.7 12.7 12.7 12.7h.1c7 0 12.7-5.8 12.6-12.8 0-2.2-.6-4.4-1.7-6.3-2.3-3.9-6.5-6.3-11-6.3zm81.5 9.8c-7 0-12.7 5.7-12.7 12.7s5.7 12.7 12.7 12.7c7 0 12.7-5.7 12.7-12.7 0-7-5.7-12.7-12.7-12.7zm0-31.8c-7 0-12.7 5.7-12.7 12.7s5.7 12.7 12.7 12.7 12.7-5.7 12.7-12.7c0-7-5.7-12.7-12.7-12.7zM61.4 37.8c-1.1 0-2.3.1-3.4.4-6.8 1.8-10.8 8.7-9 15.5 1.5 5.6 6.6 9.5 12.4 9.5h.3c1.1 0 2.1-.2 3.1-.5 6.8-1.8 10.8-8.7 9.1-15.5-1.6-5.6-6.7-9.5-12.5-9.4zM29.9 50.9c-7 0-12.7 5.7-12.7 12.7 0 2.3.6 4.5 1.8 6.5 2.3 3.8 6.4 6.2 10.9 6.2h.1c2.3 0 4.5-.6 6.5-1.8 6-3.6 8-11.4 4.5-17.4-2.5-3.8-6.6-6.1-11.1-6.2zm102.4-12.7c-6.8-1.9-13.8 2.1-15.6 8.9s2.1 13.8 8.9 15.6c6.8 1.9 13.8-2.1 15.6-8.9 1.9-6.7-2.1-13.7-8.8-15.6h-.1zm8.4-30.7c-6.8-1.8-13.8 2.1-15.6 8.9s2.1 13.8 8.9 15.6c6.8 1.8 13.8-2.1 15.6-8.9 1.9-6.7-2.1-13.7-8.9-15.6zm26.2 45.2c-6-3.6-13.8-1.6-17.4 4.4s-1.6 13.8 4.4 17.4 13.8 1.6 17.4-4.4c1.7-2.9 2.2-6.4 1.4-9.6-.8-3.3-2.9-6.1-5.8-7.8zm22-19.6c-1.4-5.6-6.5-9.6-12.3-9.6-4.5 0-8.7 2.4-10.9 6.2-3.6 6.1-1.6 13.8 4.5 17.4 1.9 1.1 4.2 1.8 6.4 1.8 4.5 0 8.7-2.4 11-6.2 1.7-2.9 2.2-6.4 1.3-9.6zM53 32.5c7 0 12.7-5.7 12.7-12.7S60 7.1 53 7.1c-1.1 0-2.3.1-3.4.4-6.8 1.8-10.8 8.7-9.1 15.5 1.5 5.6 6.6 9.5 12.5 9.5z" fill="#e2001a"></path>
    //     </svg>
    //   </div>
    //   );

    return Component ? (
      <Component {...this.props} key={Math.random()} />
    ) : Const.SITE_NAME === 'MYVETRECO' ? (
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
      }}>
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
                  <path className="global-indicator-loading" d="M47,0 C21.0426168,0 0,21.0426168 0,47 C0,72.9573832 21.0426168,94 47,94 C72.9573832,94 94,72.9573832 94,47 C94,40.9038213 92.8393713,35.0787219 90.7270275,29.7336155" id="路径" stroke="#3C8CFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="bevel"/>
              </g>
          </g>
        </svg>
      </div>
    ) : (
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
      }}>
        <div className="donut" style={{position: 'absolute',}}></div>
        <svg xmlns="http://www.w3.org/2000/svg" style={{
        position: 'absolute',
        left: 20,
        top: 35,
      }} viewBox="0 0 190.7 104" width='60px' data-js-import-interactive-svg="null" svg-animate-processed="true">
          <path d="M38.3 93.9c-3.1 0-5.6-2.4-5.6-5.5 0-1.8.8-3.5 2.3-4.5 14.7-11 37.2-17.6 60.2-17.6 22.9 0 45.4 6.6 60.1 17.6 2.4 1.8 2.9 5.3 1.1 7.8-1.8 2.4-5.3 2.9-7.8 1.1-9.9-7.4-29.2-15.4-53.5-15.4-24.4 0-43.7 7.9-53.6 15.4-.8.7-2 1.1-3.2 1.1zm5.1 9.4c.9 0 1.7-.3 2.4-.9 11.2-9.2 30.2-15 49.4-15 19.4 0 37.9 5.6 49.3 15 1.6 1.3 4 1.1 5.3-.5 1.3-1.6 1.1-4-.5-5.3-12.7-10.5-33-16.7-54.1-16.7S53.7 86.2 41 96.6c-1.6 1.3-1.9 3.7-.5 5.3.7.9 1.8 1.4 2.9 1.4zM13.7 23.5C6.7 23.5 1 29.2 1 36.2c0 7 5.7 12.7 12.7 12.7h.1c7 0 12.7-5.8 12.6-12.8 0-2.2-.6-4.4-1.7-6.3-2.3-3.9-6.5-6.3-11-6.3zm81.5 9.8c-7 0-12.7 5.7-12.7 12.7s5.7 12.7 12.7 12.7c7 0 12.7-5.7 12.7-12.7 0-7-5.7-12.7-12.7-12.7zm0-31.8c-7 0-12.7 5.7-12.7 12.7s5.7 12.7 12.7 12.7 12.7-5.7 12.7-12.7c0-7-5.7-12.7-12.7-12.7zM61.4 37.8c-1.1 0-2.3.1-3.4.4-6.8 1.8-10.8 8.7-9 15.5 1.5 5.6 6.6 9.5 12.4 9.5h.3c1.1 0 2.1-.2 3.1-.5 6.8-1.8 10.8-8.7 9.1-15.5-1.6-5.6-6.7-9.5-12.5-9.4zM29.9 50.9c-7 0-12.7 5.7-12.7 12.7 0 2.3.6 4.5 1.8 6.5 2.3 3.8 6.4 6.2 10.9 6.2h.1c2.3 0 4.5-.6 6.5-1.8 6-3.6 8-11.4 4.5-17.4-2.5-3.8-6.6-6.1-11.1-6.2zm102.4-12.7c-6.8-1.9-13.8 2.1-15.6 8.9s2.1 13.8 8.9 15.6c6.8 1.9 13.8-2.1 15.6-8.9 1.9-6.7-2.1-13.7-8.8-15.6h-.1zm8.4-30.7c-6.8-1.8-13.8 2.1-15.6 8.9s2.1 13.8 8.9 15.6c6.8 1.8 13.8-2.1 15.6-8.9 1.9-6.7-2.1-13.7-8.9-15.6zm26.2 45.2c-6-3.6-13.8-1.6-17.4 4.4s-1.6 13.8 4.4 17.4 13.8 1.6 17.4-4.4c1.7-2.9 2.2-6.4 1.4-9.6-.8-3.3-2.9-6.1-5.8-7.8zm22-19.6c-1.4-5.6-6.5-9.6-12.3-9.6-4.5 0-8.7 2.4-10.9 6.2-3.6 6.1-1.6 13.8 4.5 17.4 1.9 1.1 4.2 1.8 6.4 1.8 4.5 0 8.7-2.4 11-6.2 1.7-2.9 2.2-6.4 1.3-9.6zM53 32.5c7 0 12.7-5.7 12.7-12.7S60 7.1 53 7.1c-1.1 0-2.3.1-3.4.4-6.8 1.8-10.8 8.7-9.1 15.5 1.5 5.6 6.6 9.5 12.5 9.5z" fill="#e2001a"></path>
        </svg>
      </div>
      );
  }
}
