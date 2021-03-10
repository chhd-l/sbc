import { IOptions, Store, ViewAction } from 'plume2';
import { Input, message, Modal } from 'antd';
import LoadingActor from './actor/loading-actor';
import ListActor from './actor/list-actor';
import StateFormActor from './actor/state-form-actor';
import CityFormActor from './actor/city-form-actor';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { cache, Const, history, util } from 'qmkit';
import React from 'react';

const confirm = Modal.confirm;
export default class AppStore extends Store {
  //btn加载
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new LoadingActor(), new ListActor(), new StateFormActor(), new CityFormActor()];
  }

  init = async () => {
    const { res: storeInfo } = await webapi.fetchStoreInfo();
    if (storeInfo.code == Const.SUCCESS_CODE) {
      const { countryId } = storeInfo.context;
      const { res: countryInfo } = await webapi.fetchDictionaryList({
        keywords: '',
        type: 'Country',
        pageNum: 0,
        pageSize: 1000
      });
      if (countryInfo.code == Const.SUCCESS_CODE) {
        const currentCountry = countryInfo.context.sysDictionaryPage.content.find((item) => {
          return item.id === countryId;
        });
        sessionStorage.setItem('currentCountry', JSON.stringify(currentCountry));
        this.onStateFormChange({
          field: 'country',
          value: currentCountry.name
        });
        this.onCityFormChange({
          field: 'country',
          value: currentCountry.name
        });
      }
    } else {
      message.error(storeInfo.message);
    }
  };

  getStatesList = async (params) => {
    this.dispatch('loading:start');
    // this.dispatch(
    //   'list:stateList',
    //   fromJS([
    //     {
    //       country: 'Mexico',
    //       state: 'New York1',
    //       postCode: '12132-12122'
    //     },
    //     {
    //       country: 'Mexico',
    //       state: 'New York2',
    //       postCode: '12132-12122;13332-122'
    //     },
    //     {
    //       country: 'Mexico',
    //       state: 'New York3',
    //       postCode: ''
    //     }
    //   ])
    // );
    const { res } = await webapi.getStateList(params);
    if (res.code === Const.SUCCESS_CODE) {
      if (res.context && res.context.systemStates) {
        const list = [...res.context.systemStates.content];
        list.forEach((item) => {
          let codeArr = [];
          item.state = item.stateName;
          item.country = item.countryName;
          if (item.systemStatePostCodes && item.systemStatePostCodes.length > 0) {
            item.systemStatePostCodes.forEach((code) => {
              codeArr.push(code.postCode);
            });
            item.postCode = codeArr.join(';');
          }
        });

        this.dispatch('list:stateList', fromJS(list));
        this.dispatch(
          'list:statePagination',
          fromJS({
            current: res.context.systemStates.number + 1,
            pageSize: res.context.systemStates.size,
            total: res.context.systemStates.total
          })
        );
        this.dispatch('loading:end');
      }
    } else {
      this.dispatch('loading:end');
    }
  };

  getCitysList = async (params) => {
    this.dispatch('loading:start');
    // this.dispatch(
    //   'list:cityList',
    //   fromJS([
    //     {
    //       country: 'Mexico',
    //       state: 'New York',
    //       city: 'New York city',
    //       postCode: '12132-12122'
    //     },
    //     {
    //       country: 'Mexico',
    //       state: 'New York',
    //       city: 'New York city',
    //       postCode: '12132-12122;13333-2333'
    //     },
    //     {
    //       country: 'Mexico',
    //       state: 'New York',
    //       city: 'New York city',
    //       postCode: ''
    //     }
    //   ])
    // );
    const { res } = await webapi.getCityList(params);
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('loading:end');
      if (res.context && res.context.systemCitys) {
        const list = [...res.context.systemCitys.content];
        list.forEach((item) => {
          let codeArr = [];
          item.city = item.cityName;
          item.state = item.stateName;
          item.country = item.countryName;
          if (item.systemCityPostCodes && item.systemCityPostCodes.length > 0) {
            item.systemCityPostCodes.forEach((code) => {
              codeArr.push(code.postCode);
            });
            item.postCode = codeArr.join(';');
          }
        });

        this.dispatch('list:cityList', fromJS(list));
        this.dispatch(
          'list:cityPagination',
          fromJS({
            current: res.context.systemCitys.number + 1,
            pageSize: res.context.systemCitys.size,
            total: res.context.systemCitys.total
          })
        );
      }
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }
  };

  addState = async (params) => {
    this.dispatch('confirmLoading:start');
    const { res } = await webapi.addState(params);
    if (res.code === Const.SUCCESS_CODE) {
      this.setStateModalVisible(false);
      this.getStatesList({
        pageNum: this.state().get('statePagination').toJS().current - 1,
        pageSize: this.state().get('statePagination').toJS().pageSize
      });
      this.dispatch('confirmLoading:end');
    } else {
      this.dispatch('confirmLoading:end');
      message.error(res.message);
    }
  };
  editState = async (params) => {
    this.dispatch('confirmLoading:start');
    const { res } = await webapi.editState(params);
    if (res.code === Const.SUCCESS_CODE) {
      this.setStateModalVisible(false);
      this.getStatesList({
        pageNum: this.state().get('statePagination').toJS().current - 1,
        pageSize: this.state().get('statePagination').toJS().pageSize
      });
      this.dispatch('confirmLoading:end');
    } else {
      message.error(res.message);
      this.dispatch('confirmLoading:end');
    }
  };
  deleteState = async (params) => {
    const { res } = await webapi.deleteState(params);
    if (res.code === Const.SUCCESS_CODE) {
      this.getStatesList({
        pageNum: this.state().get('statePagination').toJS().current - 1,
        pageSize: this.state().get('statePagination').toJS().pageSize
      });
    } else {
      message.error(res.message);
    }
  };
  deleteCity = async (params) => {
    const { res } = await webapi.deleteCity(params);
    if (res.code === Const.SUCCESS_CODE) {
      this.getCitysList({
        pageNum: this.state().get('cityPagination').toJS().current - 1,
        pageSize: this.state().get('cityPagination').toJS().pageSize
      });
    } else {
      message.error(res.message);
    }
  };
  addCity = async (params) => {
    this.dispatch('confirmLoading:start');
    const { res } = await webapi.addCity(params);
    if (res.code === Const.SUCCESS_CODE) {
      this.setCityModalVisible(false);
      this.getCitysList({
        pageNum: this.state().get('cityPagination').toJS().current - 1,
        pageSize: this.state().get('cityPagination').toJS().pageSize
      });
      this.dispatch('confirmLoading:end');
    } else {
      message.error(res.message);
      this.dispatch('confirmLoading:end');
    }
  };

  editCity = async (params) => {
    this.dispatch('confirmLoading:start');
    const { res } = await webapi.editCity(params);
    if (res.code === Const.SUCCESS_CODE) {
      this.setCityModalVisible(false);
      this.getCitysList({
        pageNum: this.state().get('statePagination').toJS().current - 1,
        pageSize: this.state().get('statePagination').toJS().pageSize
      });
      this.dispatch('confirmLoading:end');
    } else {
      message.error(res.message);
      this.dispatch('confirmLoading:end');
    }
  };
  newStateForm = () => {
    this.setIsEditStateForm(false);
    this.setStateModalVisible(true);
  };
  newCityForm = () => {
    this.getStateDropdown({
      pageNum: 0,
      pageSize: 100000
    });
    this.setIsEditCityForm(false);
    this.setCityModalVisible(true);
  };

  getStateDropdown = async (params) => {
    const { res } = await webapi.getStateList(params);
    if (res.code === Const.SUCCESS_CODE) {
      if (res.context && res.context.systemStates) {
        const list = [...res.context.systemStates.content];
        this.dispatch('CityFormActor:stateNameList', fromJS(list));
      }
    } else {
      message.error(res.message);
    }
  };

  searchState = (value) => {
    console.log(value, '搜-----------------');
  };
  editStateForm = (form) => {
    if (form.systemStatePostCodes) {
      const postCodeArr = form.systemStatePostCodes;
      postCodeArr.forEach((item) => {
        item.preCode = item.postCode.split('-')[0];
        item.suffCode = item.postCode.split('-')[1];
        item.value = item.id;
      });
      const newForm = {
        id: form.id,
        country: form.country,
        state: form.state,
        abbreviation: form.abbreviation,
        postCodeArr,
        ...form
      };
      this.dispatch('StateFormActor:stateForm', newForm);
    } else {
      this.onStateFormChange({
        field: 'id',
        value: form.id
      });
      this.onStateFormChange({
        field: 'country',
        value: form.country
      });
      this.onStateFormChange({
        field: 'state',
        value: form.state
      });
      this.onStateFormChange({
        field: 'abbreviation',
        value: form.abbreviation
      });
    }

    this.setIsEditStateForm(true);
    this.setStateModalVisible(true);
  };
  editCityForm = (form) => {
    let arr = [];
    this.getStateDropdown({
      pageNum: 0,
      pageSize: 100000
    });
    if (form.systemCityPostCodes) {
      const postCodeArr = form.systemCityPostCodes;
      postCodeArr.forEach((item) => {
        item.preCode = item.postCode.split('-')[0];
        item.suffCode = item.postCode.split('-')[1];
        item.value = item.id;
      });
      const newForm = {
        id: form.id,
        country: form.country,
        state: form.state,
        city: form.city,
        region: form.region,
        postCodeArr,
        ...form
      };
      this.dispatch('CityFormActor:cityForm', newForm);
    } else {
      this.onCityFormChange({
        field: 'id',
        value: form.id
      });
      this.onCityFormChange({
        field: 'country',
        value: form.country
      });
      this.onCityFormChange({
        field: 'state',
        value: form.state
      });
      this.onCityFormChange({
        field: 'city',
        value: form.city
      });
      this.onCityFormChange({
        field: 'region',
        value: form.region
      });
    }

    this.setIsEditCityForm(true);
    this.setCityModalVisible(true);
  };
  setStateModalVisible = (visible) => {
    this.dispatch('StateFormActor:setModalVisible', visible);
  };

  setCityModalVisible = (visible) => {
    this.dispatch('CityFormActor:setModalVisible', visible);
  };

  setIsEditStateForm = (isEdit) => {
    this.dispatch('StateFormActor:setIsEdit', isEdit);
  };

  setIsEditCityForm = (isEdit) => {
    this.dispatch('CityFormActor:setIsEdit', isEdit);
  };

  onStateFormChange = ({ field, value }) => {
    this.dispatch('StateFormActor:field', { field, value });
  };

  onCityFormChange = ({ field, value }) => {
    this.dispatch('CityFormActor:field', { field, value });
  };
  onResetStateForm = () => {
    this.dispatch('StateFormActor:resetForm');
  };
  onResetCityForm = () => {
    this.dispatch('CityFormActor:resetForm');
  };
}
