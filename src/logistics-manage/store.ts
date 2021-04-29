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

  //列表
  initList = async () => {
    this.dispatch('loading:start')
    const {res}=await webapi.fetchCheckedExpress()
   
    if(res.code===Const.SUCCESS_CODE){
    this.dispatch('list:table', res.context)
    }

    this.dispatch('loading:end')
  }

  //card
  init = async () => {
    const expressAll = await webapi.findStoreLogisticSettingByStoreId();
    if (expressAll.res.code == Const.SUCCESS_CODE) {
      this.dispatch('exp:init', expressAll.res.context);
    } else {
      message.error(expressAll.res.message);
    }
  };

  fetchAllExpress = async () =>{
    const {res:allCompany}=await webapi.fetchAllExpress()
    this.dispatch('exp:allCompany',allCompany.context);
  }
  //save company
  save = async () => {
    let companyForm= this.state().get('companyForm');
    this.dispatch('formActor:field', {field: 'saveLoading', value: true })
    let res=null
    if(companyForm.get('id')){
     res = await webapi.updateExpress(companyForm);
    }else{
     res = await webapi.addExpress(companyForm);
    }
    
    if(res.res.code===Const.SUCCESS_CODE){
      setTimeout(()=>{
        message.success(res.message)
        this.dispatch('formActor:field', {field: 'saveLoading', value: false })
        this.closeModal()
        this.initList()
      }, 1000)
    }
   
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
      }, 1000)
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
    this.dispatch('loading:start')
    // this.dispatch('exp:cardLoading', true)
   const {res}= await webapi.updateStoreLogisticSettingStatus(params);
    setTimeout(()=>{
      if(res.code===Const.SUCCESS_CODE){
        message.success(res.message)
        this.init()
      }
      this.dispatch('loading:end')
    }, 1500)
    // this.dispatch('exp:cardLoading', false)

  }
   //修改company状态
   onSwitchCompanyChange = async(params) => {
    const {res}= await webapi.updateStoreExpressCompanyRelaStatus(params);
     if(res.code===Const.SUCCESS_CODE){
      message.success(res.message)
       this.initList()
     }
 
   }
  afterClose = () => {
    this.dispatch('formActor:form', {
      status: 1
    })
  }
  /**
   * 删除
   * @param record 
   */
  deleteRow =async (record) => {
    const {res}= await webapi.deleteExpress({id:record.id});
    if(res.code===Const.SUCCESS_CODE){
      message.success(res.message)
      this.initList()
    }
   
  }
  editRow = (record) => {
    const{id,storeCompanyCode,expressCompanyId,status,companyInfoId}=record
    let p={
      id,storeCompanyCode,expressCompanyId,status,companyInfoId
    }
    this.dispatch('formActor:form',p)
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

 

}
