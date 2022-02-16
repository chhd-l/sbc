import { Store } from 'plume2';

import { message } from 'antd';
import { fromJS, Map } from 'immutable';

import { Const, history } from 'qmkit';
import moment from 'moment';

import Consent from './actor/consent';
import * as webApi from './webapi';

export default class AppStore extends Store {
  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  bindActor() {
    return [new Consent()];
  }

  

  /* ------------ consent  ------------- */

  getConsentList = async (param?: any) => {
    this.dispatch('loading:start');
    const { res } = await webApi.fetchConsentList(param);

    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('consent:consentList', fromJS(res.context != null ? res.context.consentVOList : []));
      });
    } else {
      this.dispatch('loading:end');
    }
  };

  getParentConsentList = () => {
    webApi.getParentConsentList().then(data => {
      if (data.res.code === Const.SUCCESS_CODE) {
        this.dispatch('consent:parentConsentList', fromJS(data.res.context?.consentVOList ?? []));
      }
    });
  };

  //语言
  getLanguage = async (callback) => {
    const { res } = await webApi.fetchQuerySysDictionary({
      type: 'consentLanguage'
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('consent:consentLanguage', res.context.sysDictionaryVOS);
      });
      //callback&&callback(res.context.sysDictionaryVOS)
    }
  };

  //category
  getCategories = async (callback) => {
    const { res } = await webApi.fetchQuerySysDictionary({
      type: 'consentCategory'
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('consent:consentCategory', res.context.sysDictionaryVOS);
      });
      //callback&&callback(res.context.sysDictionaryVOS)
    }
  };

  propSort = async (param?: any) => {
    const { res } = await webApi.fetchPropSort(param);

    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.getConsentList();
      });
    }
  };

  //删除
  getConsentDelete = async (param?: any) => {
    const { res } = await webApi.fetchConsentDelete(param);
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.getConsentList();
      });
    }
  };

  //new
  consentSubmit = async (param?: any, type?: any) => {
    let data = param;
    if (type != '000') {
      if (param.consentId != '' && param.consentCode != '' && param.consentTitleType != '' && param.consentTitle != '') {
        const { res } = await webApi.fetchEditSave(param);
        if (res.code == Const.SUCCESS_CODE) {
          this.transaction(() => {
            message.success('Submit successful！');
            this.pageChange('List', null);
            this.dispatch('consent:editList', {});
            this.getConsentList();
            //form = this.state().get('detailList');
          });
        }
      } else {
        message.error('Submit Can not be empty！');
      }
    } else {
      if (data.consentId != '' && data.consentCode != '' && data.consentTitleType != '' && data.consentTitle != '') {
        // if(data.consentCategory=="Prescriber"){  //consentGroup为新增填写字段
        //   data.consentGroup = 'default'
        // }else{
        //   delete data.consentGroup //之前也没传值，保持不变
        // }
        const { res } = await webApi.fetchNewConsent(data);
        if (res.code == Const.SUCCESS_CODE) {
          this.transaction(() => {
            message.success('Submit successful！');
            this.pageChange('List', null);
            this.getConsentList();
          });
          //history.push('/shop-info');
        }
      } else {
        message.error('Submit Can not be empty！');
      }
    }
  };

  //pageChange
  pageChange = (param, id) => {
    /*let a = this.state().get('consentForm');
    for (let key in a) {
      a[key] = '';
    }*/
    //param == 'List'? this.dispatch('consent:consentForm', {}):param
    this.dispatch('consent:editId', id);

    this.dispatch('consent:pageChange', param);
    if (id != '000' && param != 'List') {
      this.onEditList(id);
    } else {
      let consentForm = {
        languageTypeId: '',
        consentCategory: 'Prescriber',
        filedType: 'Optional',
        consentPage: ['Landing page'].toString(),
        consentId: '',
        consentCode: '',
        consentType: 'Email in',
        consentTitleType: 'Content',
        consentTitle: '',
        consentDetailList: []
      };
      this.dispatch('consent:editList', consentForm);
      this.dispatch('consent:consentForm', consentForm);
    }
  };

  //add FormChange
  onFormChange = (param) => {
    this.dispatch('consent:consentForm', param);
  };

  //onFormEdit
  onEditSave = (param?: any) => {
    this.dispatch('consent:formEdit', param);
  };

  //onDetailList
  onDetailList = async (param?: any) => {
    this.dispatch('consent:detailList', param);
  };

  // Switch
  onSwitch = async (param?: any) => {
    const { res } = await webApi.fetchSwitch(param);
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.getConsentList();
      });
    }
  };

  //fetchEditList
  onEditList = async (param?: any) => {
    const { res } = await webApi.fetchEditList(param);
    if (res.code == Const.SUCCESS_CODE) {
      let data = res.context.consentAndDetailVO;
      this.dispatch('consent:consentForm', data);

      this.dispatch('consent:editList', data);
      this.dispatch('consent:detailList', data.consentDetailList);
      this.dispatch('consent:editId', param);
    }
  };

  //fetchConsentDetailDelete
  getConsentDetailDelete = async (param?: any) => {
    const { res } = await webApi.fetchConsentDetailDelete(param);
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        //this.getConsentList();
      });
    }
  };

  //select consent ids for batch updating in consent list
  onSelectConsentIds = (selectedRowKeys) => {
    this.dispatch('consent:setSelectedConsentIds', fromJS(selectedRowKeys));
  };

  //batch update consent version
  batchUpdateConsentVersion = async (ids: number[], consentVersion: string) => {
    const { res } = await webApi.batchUpdateConsentVersion(ids, consentVersion);
    if (res.code === Const.SUCCESS_CODE) {
      message.success(res.message);
      this.transaction(() => {
        this.dispatch('consent:setSelectedConsentIds', fromJS([]));
        this.getConsentList();
      });
      return true;
    } else {
      return false;
    }
  };
}
