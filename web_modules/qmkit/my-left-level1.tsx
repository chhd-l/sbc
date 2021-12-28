import React from 'react';
import { Layout, Menu, Icon } from 'antd';
const { Sider } = Layout;
import { history, cache, util, RCi18n, Const } from 'qmkit';
import { fromJS } from 'immutable';
import {FormattedMessage} from "react-intl";


export default class MyLeftLevel1 extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);
    // 1.登陆后获取的菜单信息列表
    const allGradeMenus = fromJS(
      JSON.parse(sessionStorage.getItem(cache.LOGIN_MENUS)) || []
    );
    // 2.初始化信息
    this.state = {
      firstActive: 0,
      allGradeMenus: allGradeMenus,
      collapsed:false
    };
  }
  onCollapse=()=>{
    this.setState({ collapsed:!this.state.collapsed})
    
  }

  render() {
    // 当前渲染的页面对应的路由
    const path = this.props.matchedPath;
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    if (!loginInfo) {
      return null;
    }

    // 商家登录审核状态 -1:未开店(没有审核状态)  0:未审核  1:已审核  2:审核未通过
    const auditState = loginInfo && loginInfo.auditState;
    // 一级菜单选中索引
    let firstActive =
      sessionStorage.getItem(cache.FIRST_ACTIVE) || this.state.firstActive;

    // 循环全部菜单，找到与当前页面 url 匹配的菜单，选中
    this.state.allGradeMenus.forEach((level1, index1) => {
      if (level1.get('children')) {
        level1.get('children').forEach((level2) => {
          if (level2.get('children')) {
            level2.get('children').forEach((level3) => {
              if (level3.get('url') === path) {
                firstActive = index1;
                return true;
              }
            });
          } else {
            if (level2.get('url') === path) {
              firstActive = index1;
            }
          }
        });
      } else {
        if (level1.get('url') === path) {
          firstActive = index1;
        }
      }
    });

    // 选中的一级菜单key
    let level1SelectKeys = [firstActive.toString()];
    // 账户管理不属于任何菜单,特殊处理
    if (path == '/account-manage') {
      level1SelectKeys = [];
    }
    
    const shopDomain = sessionStorage.getItem(cache.DOMAINNAME);
    let myvetreco_shop_domain_url = '';
    if (shopDomain) {
      myvetreco_shop_domain_url = shopDomain.endsWith('/') ? shopDomain + 'admin' : shopDomain + '/admin';
      myvetreco_shop_domain_url = myvetreco_shop_domain_url + '?authorize=' + util.encryptAES((window as any).token);
    }

    return (
      <Sider width={134} className="leftHeader" 
        trigger={null}
        collapsible collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}>
        <Menu
          inlineIndent={16}
          theme="light"
          mode="inline"
          selectedKeys={level1SelectKeys}
        >
          {/*头部一级菜单*/}
          {auditState == 1 &&
            this.state.allGradeMenus.toJS().map((v:any, i:any) => {
              return (
                <Menu.Item 
                  key={i.toString()} 
                  style={styles.navItem}
                  onClick={() => this._goFirstMenu(i)}>

                    {/* <img
                      style={styles.menuIcon}
                      src={util.requireLocalSrc(`icon/${v.icon}`)}
                      // src={util.requireLocalSrc(`icon/btn-product.svg`)}
                    /> */}
                    {/* <Icon className="icon iconfont icondingyue">
                    </Icon> */}
                    {/* <Icon type="home" style={{fontSize:30 }}/>
                    <span style={{display: 'block',lineHeight:'10px',}} >{v.title}</span> */}
                    <i className={"icon iconfont " + v.icon } style={{fontSize:30 }}></i>
                    <span style={{display: this.state.collapsed?'none':'block',lineHeight:'16px',whiteSpace:'initial'}} title={RCi18n({id:`Menu.${v.title}`})}><FormattedMessage id={"Menu."+ v.title} /></span>
                </Menu.Item>
              );
            })}
            {Const.SITE_NAME === 'MYVETRECO' && shopDomain ? (
              <Menu.Item
                key="myvetreco-shop-editor"
                style={styles.navItem}
              >
                <a href={myvetreco_shop_domain_url} target="_blank">
                  <i className="icon iconfont iconEdit" style={{fontSize:30 }}></i>
                  <span style={{display: this.state.collapsed?'none':'block',lineHeight:'16px',whiteSpace:'initial'}} title={RCi18n({id:`Menu.Shop editor`})}><FormattedMessage id="Menu.Shop editor" /></span>
                </a>
              </Menu.Item>
            ) : null}
        </Menu>
      </Sider>
    );
  }

  /**
   * 一级菜单的点击事件
   * @param i
   */
  _goFirstMenu = (i) => {

    // 缓存中记录当前选中的一级菜单
    sessionStorage.setItem(cache.FIRST_ACTIVE, i);
    
    this.setState({ firstActive: i });
    this.props.onFirstActiveChange(); //让父级告诉兄弟组件,选中的一级菜单变化了

    const menus = this.state.allGradeMenus;
    let url = '';
    if (menus.getIn([i, 'url'])) {
      //如果一级菜单本身就有url,则直接跳转该url
      url = menus.getIn([i, 'url']);
    } else {
      //查找一级菜单下面的第一个url(即 一级菜单的url默认为其子集中的第一个url)
      const secMenus = menus.get(i).get('children');
      if (secMenus && secMenus.size > 0) {
        secMenus.some((secMenu) => {
          if (secMenu.get('url')) {
            url = secMenu.get('url');
            return true;
          } else {
            const thiMenus = secMenu.get('children');
            if (thiMenus && thiMenus.size > 0) {
              return thiMenus.some((thiMenu) => {
                if (thiMenu.get('url')) {
                  url = thiMenu.get('url');
                  return true;
                }
                return false;
              });
            }
          }
          return false;
        });
      }
    }
    history.push(url);
  };
}

const styles = {
  menuIcon: {
    width: 30,
    height: 30,
  },
  navItem: {
    textAlign: 'center',
    height:'auto',
    marginBottom:0,
    paddingBottom:10
    // display: 'flex',
    // flexDirection: 'row',
    // alignItems: 'center',
    // overflow: 'hidden'
  }
} as any;
