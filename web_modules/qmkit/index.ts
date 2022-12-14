import noop from './noop';
import DataGrid from './datagrid';
import SelectGroup from './select-group';
import AsyncRouter from './async-router';
import routeWithSubRoutes from './route-with-subroutes';
// import Fetch from './fetch';
import Headline from './head-line';
import MyHeader from './my-header';
import MyLeftMenu from './my-left-menu';
import MyLeftLevel1 from './my-left-level1';
import AreaSelect from './area/area-select';
import CitySelect from './area/city-select';
import AreaInfo from './area/area-info';
import * as FindBusiness from './business/business';
import Const from './config';
import Tips from './tips';
import * as FindArea from './area/area';
import history from './history';
import cache from './cache';
import * as util from './util';
import TimerButton from './timer-button';
import ExportModal from './export-modal';
import ValidConst from './validate';
import TreeSelectGroup from './tree-select-group';
import * as QMFloat from './float';
import * as QMMethod from './comment-method';
// import UEditor from './ueditor/Ueditor';
import QMUpload from './upload';
import DataModal from './data-dictionary';
import { AuthWrapper, checkAuth, checkMenu } from './checkAuth';
import Logistics from './logistics/logistics';
import WMVideo from './video';
import InputGroupCompact from './input-group/index';
import DatePickerLaber from './date-picker-laber';
import * as Resource from './resource';
import BreadCrumb from './bread-crumb';
import VASConst from './VAS-Const';
import { login, switchLogin, getRoutType } from './login/login';
import OktaLogout from './okta/okta-logout'
import DragTable from './dragTable';
import AssetManagement from './assetManagement';
import ErrorBoundary from './errorBoundary';
import ReactEditor from './reactEditor/index'
import Fetch from './fetch/index'
import Fonts from './images/iconfont/iconfont.json'
import {OrderStatus, ShippStatus, PaymentStatus, FelineOrderStatus, getOrderStatusValue,getFelineOrderStatusValue} from './order-status-enum'
import QRScaner from './qr-scan';
import {RCi18n} from './lang';
import { getFormatDeliveryDateStr } from './deliveryDate';
import { LoadingForRC, LoadingForMyvetreco } from './loading-indicator';
export {
  noop,
  SelectGroup,
  DataGrid,
  AsyncRouter,
  routeWithSubRoutes,
  Fetch,
  Headline,
  MyHeader,
  MyLeftMenu,
  MyLeftLevel1,
  AreaSelect,
  CitySelect,
  Const,
  Tips,
  FindArea,
  history,
  util,
  cache,
  TimerButton,
  AreaInfo,
  ExportModal,
  ValidConst,
  TreeSelectGroup,
  QMFloat,
  QMMethod,
  // UEditor,
  QMUpload,
  DataModal,
  AuthWrapper,
  checkAuth,
  checkMenu,
  WMVideo,
  Logistics,
  InputGroupCompact,
  DatePickerLaber,
  Resource,
  BreadCrumb,
  VASConst,
  FindBusiness,
  login,
  switchLogin,
  OktaLogout,
  getRoutType,
  DragTable,
  AssetManagement,
  ErrorBoundary,
  ReactEditor,
  Fonts,
  OrderStatus,
  ShippStatus,
  PaymentStatus,
  FelineOrderStatus,
  getOrderStatusValue,
  getFelineOrderStatusValue,
  QRScaner,
  RCi18n,
  getFormatDeliveryDateStr,
  LoadingForRC,
  LoadingForMyvetreco,
};
