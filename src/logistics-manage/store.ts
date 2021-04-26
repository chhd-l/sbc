import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { message } from 'antd';
import ExpActor from './actor/exp-actor';
import { Const, RCi18n } from 'qmkit';
import ListActor from './actor/list-actor'
import LoadingActor from './actor/loading-actor'
import FormActor from './actor/form-actor'
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new ExpActor(), new ListActor(), new LoadingActor(), new FormActor()];
  }

  initList = async () => {
    this.dispatch('loading:start')
    const {res}=await webapi.fetchCheckedExpress()
   
    if(res.code===Const.SUCCESS_CODE){
    this.dispatch('list:table', res.context)
    }

    this.dispatch('loading:end')
  }
  //保存
  save = async (params) => {
    let companyForm= this.state().get('companyForm');
    this.dispatch('formActor:field', {field: 'saveLoading', value: true })
    const {res} = await webapi.updateStoreLogisticSetting(companyForm.toJS())

    setTimeout(()=>{
      this.dispatch('formActor:field', {field: 'saveLoading', value: false })
      this.closeModal()
    }, 3000)
  }
  //setting save
  saveSetting = async () => {
   let settingForm= this.state().get('settingForm');
    this.dispatch('formActor:field', {field: 'saveSettingLoading', value: true })
   const {res} = await webapi.updateStoreLogisticSetting(settingForm.toJS())

    if(res.code=Const.SUCCESS_CODE){
      setTimeout(()=>{
        this.dispatch('formActor:field', {field: 'saveSettingLoading', value: false })
        message.success(res.message)
        this.closeSettingModal()
        this.init()
      }, 2000)
    }
    
  }
  onFormChange = ({field, value}) => {
    this.dispatch('formActor:formField', {field, value })
  }

  onSettingFormChange = ({field, value}) => {
    this.dispatch('formActor:settingFormField', {field, value })
  }
  //修改状态
  onSwitchSettingChange = async(params) => {
   const {res}= await webapi.updateStoreLogisticSettingStatus(params);
    if(res.code===Const.SUCCESS_CODE){
      this.init()
    }

  }
   //修改company状态
   onSwitchCompanyChange = async(params) => {
    const {res}= await webapi.updateStoreExpressCompanyRelaStatus(params);
     if(res.code===Const.SUCCESS_CODE){
       this.initList()
     }
 
   }
  afterClose = () => {
    this.dispatch('formActor:form', {
      status: 1
    })
  }
  deleteRow = (record) => {
    message.success('delete success!')
  }
  editRow = (record) => {
    this.openModal()
  }
  addCompany = () => {
    this.openModal()
  }
  close = () => {
    this.closeModal()
  }
  openModal = () => {
    this.dispatch('formActor:field', {field: 'modalVisible', value: true})
  }
  closeModal = () => {
    this.dispatch('formActor:field', {field: 'modalVisible', value: false})
  }
  openSettingModal = (item) => {
    this.dispatch('formActor:settingForm', item)
    this.dispatch('formActor:field', {field: 'settingModalVisible', value: true})
  }
  closeSettingModal = () => {
    this.dispatch('formActor:field', {field: 'settingModalVisible', value: false})
  }
  afterCloseSettingModal = () => {
    this.dispatch('formActor:settingForm', {})
  }

  init = async () => {
    const expressAll = await webapi.findStoreLogisticSettingByStoreId();
    const {res:allCompany}=await webapi.fetchAllExpress()
    this.dispatch('exp:allCompany',allCompany.context);
    if (expressAll.res.code == Const.SUCCESS_CODE) {
      this.dispatch('exp:init', expressAll.res.context);
    } else {
      message.error(expressAll.res.message);
    }
  };

  /**
   * 选中一个或多个快递公司
   *
   */
  onChecked = async (index: number, checked: boolean, expressCompanyId: Number) => {
    const checkedRelation = this.state().get('checkedRelation');
    if (checked) {
      if (checkedRelation.size >= 20) {
        message.error(RCi18n({id:'Public.logisticsCompanyTip'}));
      } else {
        const { res } = await webapi.addExpress(expressCompanyId);
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch('exp:afterChecked', res.context);
          this.dispatch('exp:checked', { index, checked });
        } else if (res.code == 'K-090903') {
          message.error(RCi18n({id:'Public.logisticsCompanyErr'}));
          this.init();
        } else {
          this.init();
        }
      }
    } else {
      if (checkedRelation.get(expressCompanyId.toString())) {
        const { res } = await webapi.deleteExpress(checkedRelation.get(expressCompanyId.toString()), expressCompanyId.toString());
        if (res.code == Const.SUCCESS_CODE) {
          this.dispatch('exp:afterUnChecked', expressCompanyId.toString());
          this.dispatch('exp:checked', { index, checked });
        } else {
          this.init();
        }
      }
    }
  };
}
