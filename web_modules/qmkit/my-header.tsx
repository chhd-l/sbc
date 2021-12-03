import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layout,
  Menu,
  Dropdown,
  Icon,
  message,
  Button,
  Select,
  Badge,
  Popover,
  Empty,
  Tabs,
  notification,
  Modal,
  Tooltip,
  Spin
} from 'antd';
const { Header } = Layout;
import { history, cache, util, Const, AuthWrapper, checkAuth } from 'qmkit';
import QRCode from 'qrcode';
import copy from 'copy-to-clipboard';
import OktaLogout from './okta/okta-logout';
import {
  getStoreList,
} from './okta/webapi';
import { getHomeTaskListAndCount, getTaskRead, getHomeTaskTodoListTop5 } from '../../src/task/webapi';
import {getLanguageList,modifyLanguage,InitLanguage} from './lang/webapi'
import { FormattedMessage } from 'react-intl';
import msgImg from './images/icon/msg-icon.png'
//import value from '*.json';
const Option = Select.Option;
const { TabPane } = Tabs;
import text from './images/sys/text.png';
import iconEngland from './images/icon/iconEengland.svg';
import iconFrance from './images/icon/iconFrance.svg';
import iconMexico from './images/icon/iconMexico.svg';
import iconRussia from './images/icon/iconRussia.svg';
import iconSpain from './images/icon/iconSpain.svg';
import iconTurkey from './images/icon/iconTurkey.svg';
import iconAmerica from './images/icon/iconAmerica.svg';
import iconGermany from './images/icon/iconGermany.svg';
import iconSweden from './images/icon/iconSweden.svg';

import { RCi18n, switchLogin } from 'qmkit';
import tr from './lang/files/tr';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1991001_65pdey0igpv.js',
});

export default class MyHeader extends React.Component {
  constructor(props) {
    super(props);
    const lan = localStorage.getItem(cache.LANGUAGE) || 'en-US';
    this.state = {
      qrCodeLink: '',
      url: '',
      taskList: [],
      reminderTasks: [],
      visible: false,
      modalVisible: false,
      // English: util.requireLocalSrc(lan === 'en-US' ? Const.SITE_NAME === 'MYVETRECO' ? 'sys/English_act_blue.png' : 'sys/English_act.png' : 'sys/English.png'),
      // Russian: util.requireLocalSrc(lan === 'ru' ? Const.SITE_NAME === 'MYVETRECO' ? 'sys/Russian_act_blue.png' : 'sys/Russian_act.png' : 'sys/Russian.png'),
      // Turkey: util.requireLocalSrc(lan === 'tr' ? Const.SITE_NAME === 'MYVETRECO' ? 'sys/Turkey_act_blue.png' : 'sys/Turkey_act.png' : 'sys/Turkey.png'),
      // France: util.requireLocalSrc(lan === 'fr' ? Const.SITE_NAME === 'MYVETRECO' ? 'sys/France_act_blue.png' : 'sys/France_act.png' : 'sys/France.png'),
      // Spanish: util.requireLocalSrc(lan === 'es' ? Const.SITE_NAME === 'MYVETRECO' ? 'sys/Spanish_act_blue.png' : 'sys/Spanish_act.png' : 'sys/Spanish.png'),
      storeList: [],
      languageList:[],
      lan:localStorage.getItem(cache.LANGUAGE) || 'en-US'
    };
  }

  componentDidMount() {
    if ((window as any).token && Const.SITE_NAME !== 'MYVETRECO') {
      this.getLanguage()
      // 获取切换店铺的下拉数据
      if (checkAuth('f_home_switch_store')) {
        this.getUserStoreList();
      }
      if (checkAuth('f_petowner_task')) {
        this.getTaskList();
      }
    }

  }

  async getTaskList() {
    // const { res } = await getHomeTaskListAndCount();

    const data = await Promise.all([getHomeTaskListAndCount(), getHomeTaskTodoListTop5()]);

    this.setState({
      reminderTasks: data[0].res?.context?.reminderTasks ?? [],
      taskList: data[1].res?.context?.taskList ?? []
    });
  }
  async getLanguage() {
    let defaultLang = localStorage.getItem(cache.LANGUAGE)||'en-US';

    const { res } = await getLanguageList();
    const languageList = res?.context?.languageList || [];
    const _languageList = languageList.map(item => {
      const _item = Object.assign(item, {
        lang: item.lang === "es-MX" ? item.lang.replace('es-MX', 'es') : item.lang
      })
      return _item
    })
    _languageList.map(item => {
      let defaultImg = item.lang === defaultLang ?  Const.SITE_NAME === 'MYVETRECO' ?item.imageActBlue: item.imageAct :item.image;
      this.setState({
        [item.lang]: defaultImg
      })
    })
    this.setState({
      languageList: _languageList,
    })
  }

  returnTask(item, type) {
    if (type === 'reminderTasks') {
      this.readTask(item);
    }
    history.push(`/edit-task/${item.id}`);
  }

  async readTask(item) {
    const { res } = await getTaskRead({ id: item.id });
    if (res.code === Const.SUCCESS_CODE) {
      const index = this.state.reminderTasks.findIndex((it) => it.id === item.id);
      if (index !== undefined) {
        this.state.reminderTasks.splice(index, 1);
        this.setState({
          reminderTasks: this.state.reminderTasks,
          visible: false
        });
      }
    }
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  // setImgSrc(val, lan, type) {
  //   if ((sessionStorage.getItem(cache.LANGUAGE) || 'en-US') === lan) return;
  //   const siteFlag = type ? Const.SITE_NAME === 'MYVETRECO' ? '_blue' : '' : '';
  //   this.setState({ [val]: util.requireLocalSrc('sys/' + val + type + siteFlag + '.png') });
  // }
  setLangImgSrc(type,lang,img,imgMyVet?:string) {
    if ((localStorage.getItem(cache.LANGUAGE) || 'en-US') === lang) return;
    const imgSrc = type=== "active" && Const.SITE_NAME === 'MYVETRECO' ? imgMyVet : img;
    this.setState({ [lang]:imgSrc });
  }

  getLanguageItem() {
    const aLanguage = [
      { name: 'English', value: 'en-US' },
      { name: 'Russian', value: 'ru' },
      { name: 'Turkey', value: 'tr' },
      { name: 'France', value: 'fr' },
      { name: 'Spanish', value: 'es' }
    ];
    return (
      <div style={{ position: 'relative', height: 640 }}>
        <div style={{ width: '60%', position: 'absolute', top: '23%', left: '20%' }}>
          <p style={{ textAlign: 'center', fontSize: 56, color: 'var(--primary-color)', marginBottom: 50 }}>
            <Icon type="environment" style={{ fontSize: 48 }} />
            &nbsp;&nbsp;
            <span>
              <FormattedMessage id="Public.ChooseLocation" />
            </span>
          </p>
          <div className="space-around">
            {this.state.languageList?.map((item) => {
              return (
                <img
                  key={item.lang}
                  style={{
                    cursor: 'pointer',
                    width: '25%'
                  }}
                  onMouseLeave={(e) => {
                    // this.setImgSrc(item.name, item.value, '');
                    this.setLangImgSrc("default",item.lang,item.image)
                  }}
                  onMouseEnter={(e) => {
                    // this.setImgSrc(item.name, item.value, '_act');
                    this.setLangImgSrc("active",item.lang,item.imageAct,item.imageActBlue)
                  }}
                  src={this.state[item.lang]}
                  onClick={() => this.languageChange(item.lang)}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  content = () => (
    <div style={{ width: 350, minHeight: 380 }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab={RCi18n({id:'Home.Reminder'})} key="1">
          <ul style={{ height: 380, overflow: 'auto' }}>
            {this.state.reminderTasks.length > 0 ? (
              this.state.reminderTasks.map((item) => {
                return (
                  <li style={styles.popoverList} className="popover-list" key={item.id}>
                    <div className="popover-list-text" style={styles.popoverListText}>
                      <div style={{ color: 'red', cursor: 'pointer', fontSize: 16 }} onClick={() => this.returnTask(item, 'reminderTasks')}>
                        {item.title}
                      </div>
                      {/* <div style={{ fontSize: 12, marginTop: 5 }}>{item.createTime}</div> */}
                    </div>
                    <div style={{ width: '15%', textAlign: 'center' }}>
                      {' '}
                      <Icon type="close" style={{ cursor: 'pointer' }} onClick={() => this.readTask(item)} />
                    </div>
                  </li>
                );
              })
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </ul>
        </TabPane>
        <TabPane tab={RCi18n({id:'Home.Todotask'})} key="2">
          <ul style={{ height: 380, overflow: 'auto' }}>
            {this.state.taskList.length > 0 ? (
              this.state.taskList.map((item) => {
                return (
                  <li style={styles.popoverList} className="popover-list" key={item.id}>
                    <div style={{ width: '15%', textAlign: 'center' }}>
                      {' '}
                      <img src={text} alt="" />{' '}
                    </div>
                    <div className="popover-list-text" style={styles.popoverListText} onClick={() => this.returnTask(item, 'taskList')}>
                      <div style={{ color: '#606266', cursor: 'pointer', fontSize: 16 }}>{item.name}</div>
                      <div style={{ fontSize: 12, marginTop: 3, color: '#909399' }}>{item.startTime}</div>
                    </div>
                  </li>
                );
              })
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </ul>
        </TabPane>
      </Tabs>

      <div style={styles.linkMore}>
        <Link to="/tasks" style={{ fontSize: 16, color: '#909399' }}>
       {RCi18n({id:'Home.Viewalltask'})}
        </Link>
        <Icon type="right" />
      </div>
    </div>
  );

  _handlePreview = async () => {
    var prescriber = JSON.parse(sessionStorage.getItem(cache.PRESCRIBER_DATA));
    if (prescriber) {
      this.setState({
        // isPrescriber : true,
        qrCodeLink: prescriber.qrCodeLink,
        url: prescriber.url
      });
    }
  };

  handleCopy = (value) => {
    if (copy(value)) {
      message.success(RCi18n({id:"Order.OperateSuccessfully"}));
    } else message.error(RCi18n({id:"PetOwner.Unsuccessful"}));
  };

  languageChange = (value) => {
    // if ((sessionStorage.getItem(cache.LANGUAGE) || 'en-US') === value) return;
    // sessionStorage.setItem(cache.LANGUAGE, value);
    // history.go(0);

    // notification['info']({
    //   message: RCi18n({id:"Public.changeLanguageAlert"})
    // });
   this.modifyLang(value)

  };

  modifyLang = async (value) => {
    const currentLanguageKey = localStorage.getItem(cache.LANGUAGE) || 'en-US';
    if (currentLanguageKey === value) return;
    let params = {
      employeeId: sessionStorage.getItem('employeeId') || '',
      language: value
    }
    const { res } = await modifyLanguage(params);
    if (res.context) {
      sessionStorage.setItem(cache.LANGUAGE, value);
      localStorage.setItem(cache.LANGUAGE, value);
      history.go(0);
      notification['info']({
        message: RCi18n({ id: "Public.changeLanguageAlert" })
      });
    }
  }

  getUserStoreList = async () => {
    const data = await getStoreList();
    this.setState({
      storeList: data.res?.context?.storeList ?? [],
    });

  }

  /**
   * 根据storeId获取国旗
   *
   * 123456858   墨西哥
   * 123457907   俄罗斯
   * 123457908   德国
   * 123457909   法国
   * 123457910   美国
   * 123457911   土耳其
   * 123457915   瑞典
   * 123457916   英国
   **/
  getStoreIcon = (storeId) => {

    switch (storeId) {
      case '123456858': return  <Icon component={iconMexico} className='logo'/>;
      case '123457907': return  <Icon component={iconRussia} className='logo'/>;
      case '123457908': return  <Icon component={iconGermany} className='logo'/>;
      case '123457909': return  <Icon component={iconFrance} className='logo'/>;
      case '123457910': return  <Icon component={iconAmerica} className='logo'/>;
      case '123457911': return  <Icon component={iconTurkey} className='logo'/>;
      case '123457915': return  <Icon component={iconSweden} className='logo'/>;
      case '123457916': return  <Icon component={iconEngland} className='logo'/>;

      default: return  <IconFont className='logo' type='iconfangjian1' />;
    }
  }

  // 切换商铺
  onchangeShop = (info) => {
    if (!info) return;
    let {key: storeId} = info;
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    // 点击当前已登录商铺不处理
    let isCurrentStore = String(loginInfo.storeId) === String(storeId);
    if (isCurrentStore) return;

    this.userSwitchStore(storeId);
  }

  // 切换商铺后重新获取LOGIN_DATA数据
  userSwitchStore = (storeId) => {
    this.props.openMainLoading();
    switchLogin({storeId}, (res) => {
      if (res.code === Const.SUCCESS_CODE){
        // 重新加载页面
        window.location.reload();
      }else {

      }
    })
  }

  render() {
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    if (!loginInfo) {
      return null;
    }
    const accountName = loginInfo && loginInfo.employeeName;
    const storeName = loginInfo && loginInfo.storeName;
    const isMasterAccount = loginInfo && loginInfo.isMasterAccount;
    const mobile = loginInfo && loginInfo.mobile;

    //解析sessionStorage中的baseConfig
    let baseConfig,
      h5Dom,
      miniProgramDom,
      pcDom = null;
    if (sessionStorage.getItem(cache.SYSTEM_BASE_CONFIG)) {
      baseConfig = JSON.parse(sessionStorage.getItem(cache.SYSTEM_BASE_CONFIG));
    }

    //获取程序二维码
    let miniProgramUrl = localStorage.getItem(cache.MINI_QRCODE);
    if (miniProgramUrl) {
      miniProgramDom = (
        <Menu.Item key="2">
          <a href="#" className="previewCode">
            <img src={miniProgramUrl} alt="二维码" width="80" height="80" />
            <p>小程序</p>
            <div className="previewImg">
              <img src={miniProgramUrl} alt="二维码" />
            </div>
          </a>
        </Menu.Item>
      );
    }

    if (baseConfig) {
      if (baseConfig['pcWebsite']) {
        let url = '';
        if (baseConfig['pcWebsite'].endsWith('/')) {
          url = `${baseConfig['pcWebsite']}store-main/${loginInfo.storeId}`;
        } else {
          url = `${baseConfig['pcWebsite']}/store-main/${loginInfo.storeId}`;
        }
        let pcCodeUrl =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpDQ0E2NTM4MzMzRjQxMUU5QTM5MUY5ODk5ODhCQTBCMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDQ0E2NTM4NDMzRjQxMUU5QTM5MUY5ODk5ODhCQTBCMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkNDQTY1MzgxMzNGNDExRTlBMzkxRjk4OTk4OEJBMEIzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkNDQTY1MzgyMzNGNDExRTlBMzkxRjk4OTk4OEJBMEIzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Ira84wAAAaBJREFUeNrs3LFKw1AYxXGjteIkqLOoOHVwin0EQUFBF0FXFzfRx3BwqYIPIDjoIiKCr5BB8QHUXYQuClWJp3AHh1Rpemvycf8HDoGE3jQ/btKElkZpmg6Q/BmEAEAAAQSQAAgggAASAAEEEEACIIAAAkgABNBCKj4Hi+O49AecJAkzMIRTeFK9VFtqWmA/1At1wsQp/CPH6kpJLlHrbqKsWQJcdMtX9bFAwBl1XF22NgPH3PJG3SoQ8FTdVKvcxnAfCCABEEAAASQAAggggARAAAEEkAAIIIC2U+nz+HX1pMDjq1sHnHPNk/bXkk/qtBpxCneffXVW3Q3xGtj0MMadW957GKtlDfDWwxgNN/saHsa6tnYN3FFH1KUe9lFTD3t8H5/qlbptDfBFXc352in1OWP9vPrAhwg30gRAQzfSnbKnbqhDGds6/RDoTH3PWP+lnqsHoQCOuoPtdvbXftm2oB6pbyGcwtU+7Lf9qDccygxslvnZlg+Rf07EXz8xAwEEEEACIIAAAkgABBBAAAmAAAIIIAEQQAABJH/lW4ABAOc7TB5B8zqiAAAAAElFTkSuQmCC';
        pcDom = (
          <Menu.Item key="0">
            <a target="_blank" href={url}>
              {/* <div className="firstBorder"> */}
              <div>
                <img src={pcCodeUrl} alt="PC" width="80" height="80" />
              </div>
              <p style={{ paddingRight: 15 }}>PC端</p>
            </a>
          </Menu.Item>
        );
      }
      if (baseConfig['mobileWebsite']) {
        let url = '';
        if (baseConfig['mobileWebsite'].endsWith('/')) {
          url = `${baseConfig['mobileWebsite']}store-main/${loginInfo.storeId}`;
        } else {
          url = `${baseConfig['mobileWebsite']}/store-main/${loginInfo.storeId}`;
        }
        let qrCodeUrl = null;
        QRCode.toDataURL(url, { errorCorrectionLevel: 'H' }, function (_err, url) {
          qrCodeUrl = url;
        });
        h5Dom = (
          <Menu.Item key="1">
            <a target="_blank" href={url} className="previewMobile">
              <img src={qrCodeUrl} alt="二维码" width="80" height="80" />
              <p>移动端</p>
              <div className="previewImg">
                <img src={qrCodeUrl} alt="二维码" />
              </div>
            </a>
          </Menu.Item>
        );
      }
    }

    let qrCodeLinkPreview = (
      <Menu className="menuPreview">
        <Menu.Item key="0">
          <div style={{ textAlign: 'center' }}>
            {this.state.qrCodeLink ? <img src={this.state.qrCodeLink} alt="" style={{ width: '50%' }} /> : null}
            {this.state.url ? (
              <div>
                {this.state.url}
                <Button style={{ marginLeft: '10px' }} onClick={() => this.handleCopy(this.state.url)} size="small">
                  copy
                </Button>
              </div>
            ) : null}
          </div>
        </Menu.Item>
      </Menu>
    );

    let menuPreview = null;
    if (pcDom || h5Dom || miniProgramDom) {
      menuPreview = (
        <Menu className="menuPreview">
          {pcDom && pcDom}
          {/* {h5Dom && h5Dom}
          {miniProgramDom && miniProgramDom} */}
        </Menu>
      );
    } else {
      menuPreview = (
        <Menu className="menuPreview">
          <Menu.Item key="1">
            <a>请先在基本设置中配置预览链接</a>
          </Menu.Item>
        </Menu>
      );
    }

    const menu = (
      <Menu>
        {/* {isMasterAccount == '1' ? (
          <Menu.Item key="0">
            <Link to={'/account-manage'}>
              <Icon type="user" /> Account management
            </Link>
          </Menu.Item>
        ) : null} */}

        {/* <Menu.Item key="1">
          <a
            href="#"
            onClick={() =>
              history.push({
                pathname: '/find-password',
                state: {
                  phone: mobile
                }
              })
            }
          >
            <Icon type="lock" /> Change My Password
          </a>
        </Menu.Item> */}
        {Const.SITE_NAME !== 'MYVETRECO' && <Menu.Item key="1">
          <a onClick={() => this.setState({ modalVisible: true })}>
            <Icon type="global" /> Language
          </a>
        </Menu.Item>}
        <Menu.Item key="2">
          <OktaLogout type="link" text="Exit" />
        </Menu.Item>
      </Menu>
    );
    let {
      storeList,
    } = this.state;
    let isExistStoreList = Array.isArray(storeList) && (storeList.length > 0);
    const shopMenu = (
        // 当前自己store
        <Menu
            defaultSelectedKeys={[String(loginInfo.storeId)]}
            onClick={(e) => this.onchangeShop(e)}
        >
          {storeList.map(item => (
              <Menu.Item
                  key={item.storeId}
                  // disabled={loginInfo.storeId === item.storeId}
              >
                <div className='shop-list-item' >
                  {this.getStoreIcon(String(item.storeId))}
                  <span className='accountName'>{item.storeName}</span>
                </div>
              </Menu.Item>
          ))}
        </Menu>
    );

    const userImg =
      'data:image/png;base64,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';

    let employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    const prescriberId = employee && employee.prescribers && employee.prescribers.length > 0 ? employee.prescribers[0].id : null;

    return (
      <div className="my-header">
        <Header className="header" style={{ paddingLeft: '0' }}>
          <div style={styles.headerLeft}>
            <a href="/" style={styles.logoBg}>
              <img style={styles.logoImg} src={sessionStorage.getItem(cache.SITE_LOGO) ? sessionStorage.getItem(cache.SITE_LOGO) : util.requireLocalSrc('sys/02.jpg')} />
            </a>
            <span style={{display: 'inline-block', color: '#333'}}>{storeName}</span>

            {baseConfig &&
              (!prescriberId ? (
                <a className="ant-dropdown-link" href={`${baseConfig.pcWebsite}`} target="_blank">
                  <Icon type="eye-o" />
                  <span style={styles.dropdownText}>
                    <FormattedMessage id="Public.Overview" />
                  </span>
                  {/* <Icon type="down" /> */}
                </a>
              ) : null)
              //   (
              //   <Dropdown overlay={qrCodeLinkPreview} trigger={['click']}>
              //     <a className="ant-dropdown-link" href="#" onClick={() => this._handlePreview()}>
              //       <Icon type="eye-o" />
              //       <span style={styles.dropdownText}>Preview</span>
              //       <Icon type="down" />
              //     </a>
              //   </Dropdown>
              // )
            }
          </div>

          <div className="align-items-center">
            <div style={styles.headerRight}>
              {/*<Select defaultValue={sessionStorage.getItem(cache.LANGUAGE)} style={{ width: 120, marginRight: 40 }} onChange={this.languageChange}>*/}
              {/*  <Option value="English">English</Option>*/}
              {/*  <Option value="Russian">Russian</Option>*/}
              {/*  <Option value="German">German</Option>*/}
              {/*</Select>*/}
            </div>

            <div style={styles.headerRight}>
              {Const.SITE_NAME !== 'MYVETRECO' && <div style={{ paddingTop: 8}}>
                <AuthWrapper functionName="f_petowner_task">
                  <Badge count={this.state.reminderTasks.length}>
                    <Popover
                      style={{ padding: 0 }}
                      // visible={this.state.visible}
                      // onVisibleChange={this.handleVisibleChange}
                      placement="bottomRight"
                      content={this.content()}
                      trigger="click"
                    >
                      {/*<Icon type="bell" style={{ fontSize: 25 }} />*/}
                      <span className="iconfont iconmessage" style={{fontSize: 25}} />
                      {/*<span className="iconfont iconmessage3" style={{ fontSize: 25, marginRight: 10 }} ></span>*/}

                      {/*<span className="iconfont iconmessage2" style={{ fontSize: 25, marginRight: 10 }} ></span>*/}
                      {/*<span className="iconfont iconLC_icon_message_fill_1" style={{ fontSize: 25, marginRight: 10 }} ></span>*/}

                      {/*<span className="iconfont iconLC_icon_message_fill" style={{ fontSize: 25, marginRight: 10 }} ></span>*/}
                      {/*<span className="iconfont iconmessage1" style={{ fontSize: 25, marginRight: 10 }} ></span>*/}

                      {/*bell*/}
                      {/*<img src={msgImg} style={{ width: '2.5em', height: 'auto' }}/>*/}
                    </Popover>
                  </Badge>
                </AuthWrapper>
              </div>}
              {
                Const.SITE_NAME !== 'MYVETRECO' ? (
                  <div className='headerRight-shop'>
                    <div style={{ paddingLeft: 30}}>
                      <AuthWrapper functionName='f_home_switch_store'>
                        {
                          isExistStoreList
                            ? (
                              <Dropdown
                                placement={'bottomRight'}
                                overlay={shopMenu}
                                trigger={['click']}
                                overlayClassName='shop-list-box'
                              >
                                <span className="headerRight-shop-icon iconfont iconfangjian1" style={{ fontSize: 25 }} />
                              </Dropdown>
                            )
                            : null
                        }
                      </AuthWrapper>
                    </div>
                  </div>
                ): null
              }
              <div >
                <div>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" href="#">
                      {/* <Icon type="user" /> */}
                      {/* <img style={{width: '60px'}} src={sessionStorage.getItem(cache.SITE_LOGO)
                  ? sessionStorage.getItem(cache.SITE_LOGO)
                  : util.requireLocalSrc('sys/02.jpg')} alt="" /> */}
                      <span style={styles.dropdownText}>{accountName}</span>
                      <Icon type="down" />
                    </a>
                  </Dropdown>
                </div>
                {/*<div>{storeName}</div>*/}
              </div>
            </div>
          </div>
        </Header>
        <Modal visible={this.state.modalVisible} footer={null} closable={false} width="60%" centered={true} onCancel={() => this.setState({ modalVisible: false })}>
          <p>
            <img style={styles.logoImg} src={sessionStorage.getItem(cache.SITE_LOGO) ? sessionStorage.getItem(cache.SITE_LOGO) : util.requireLocalSrc('sys/02.jpg')} />
          </p>
          <div>{this.getLanguageItem()}</div>
        </Modal>
      </div>
    );
  }
}

const styles = {
  popoverList: {
    display: 'flex',
    justifyContent: 'space-between',
    // alignItems: 'center',
    padding: '15px 0'
  },
  linkMore: {
    padding: '10px 16px',
    borderTop: '1px solid #E5E7ED',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    osition: 'relative',
    margin: '0 -16px -12px -16px'
  },
  popoverListText: {
    flex: 1
  },
  logoBg: {
    width: 134,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoImg: {
    display: 'block',
    width: 80,
    maxHeight: 40
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  dropdownText: {
    marginLeft: 8,
    marginRight: 8
  },
  headerRight: {
    // textAlign: 'right',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
} as any;
