/**
 * storage的key，定义为常量统一存放
 */
export default {
  LOGIN_DATA: 's2b-supplier@login', //登录信息缓存
  LOGIN_MENUS: 's2b-supplier@menus', //登录人菜单信息
  LOGIN_FUNCTIONS: 's2b-supplier@functions', //登录人功能权限信息
  SITE_LOGO: 's2b-supplier@logo', //商城logo
  DATA_BOARD: 's2b-supplier@dataBoard:', //控制面板
  SYSTEM_BASE_CONFIG: 's2b-supplier@systemBaseConfig:', //系统配置，如pc，h5系统配置
  SYSTEM_GET_CONFIG: 's2b-supplier@systemGetConfig:', //默认配置 //价格符号
  SYSTEM_GET_CONFIG_NAME: 's2b-supplier@systemGetConfigName:',//价格名称
  FIRST_ACTIVE: 's2b-supplier@firstActive', //选中的第一层菜单下标
  SECOND_ACTIVE: 's2b-supplier@secondActive', //选中的第二层菜单下标
  THIRD_ACTIVE: 's2b-supplier@thirdActive', //选中的第三层菜单下标
  MINI_QRCODE: 's2b-supplier-miniProgram-code', //店铺主页小程序码
  PENDING_AND_REFUSED: 'pending-or-refused-useInfo', //审核中或者审核未通过的用户信息
  VALUE_ADDED_SERVICES: 'value-added-service', // 增值服务
  HIDE_EMPLOYEE_SETTING: 'HIDE_EMPLOYEE_SETTING',
  PRESCRIBER_DATA: 's2b-prescriber@data',
  EMPLOYEE_DATA: 's2b-employee@data',
  MAP_MODE:'s2b-map-mode',
  OKTA_TOKEN: 'okta-token',
  LOGIN_ACCOUNT_NAME: 'login-account-name',
  LOGIN_EMPLOYEE_NAME: 'login-employee-name',
  FIRST_PRESCRIBER_DATA: 'first-prescriber-data',
  OKTA_LOGOUT: 'okta_logout'
};
