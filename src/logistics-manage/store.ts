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
    const data = [
      {
        id: 1,
        key: '1',
        companyName: 'John Brown',
        companyCode: 12312,
        status: 1,
      },
      {
        id: 2,
        key: '2',
        companyName: 'Jim Green',
        companyCode: 12345,
        status: 0,
      },
      {
        id: 3,
        key: '3',
        companyName: 'Joe Black',
        companyCode: 12567,
        status: 1,
      },
    ];
    this.dispatch('list:table', data)

    this.dispatch('loading:end')
  }
  save = async (params) => {
    this.dispatch('formActor:field', {field: 'saveLoading', value: true })

    setTimeout(()=>{
      this.dispatch('formActor:field', {field: 'saveLoading', value: false })
      this.closeModal()
    }, 3000)
  }
  onFormChange = ({field, value}) => {
    this.dispatch('formActor:formField', {field, value })
  }

  afterClose = () => {
    this.dispatch('formActor:form', {
      status: 1
    })
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
  init = async () => {
    const expressAll = await webapi.fetchAllExpress();
    if (expressAll.res.code == Const.SUCCESS_CODE) {
      const expressChecked = await webapi.fetchCheckedExpress();
      if (expressChecked.res.code == Const.SUCCESS_CODE) {
        this.dispatch('exp:init', {
          all: expressAll.res.context,
          checked: expressChecked.res.context
        });
      } else {
        message.error(expressChecked.res.message);
      }
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
