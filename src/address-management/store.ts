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
      const { currencyId } = storeInfo.context;
      console.log(storeInfo.context, 'storeInfo.context-----------');
      const { res: countryInfo } = await webapi.fetchDictionaryList();
      if (countryInfo.code == Const.SUCCESS_CODE) {
        console.log(countryInfo.context, 'countryInfo.context-----------');
        const currentCountry = countryInfo.context.sysDictionaryPage.content.find((item) => {
          return item.id === currencyId;
        });
      }
    } else {
      message.error(storeInfo.message);
    }
  };

  deleteRow = async (params) => {
    this.dispatch('loading:start');
    const { res } = await webapi.deleteRow(params);

    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('loading:end');
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }
  };

  editRow = async (params) => {
    const res = await webapi.editRow(params);
  };

  getStatesList = async (params) => {
    this.dispatch('loading:start');
    this.dispatch(
      'list:stateList',
      fromJS([
        {
          country: 'United States',
          state: 'New York1',
          postCode: '12132-12122'
        },
        {
          country: 'United States',
          state: 'New York2',
          postCode: '12132-12122;13332-122'
        },
        {
          country: 'United States',
          state: 'New York3',
          postCode: ''
        }
      ])
    );
    // const { res } = await webapi.getList(params);
    // if (res.code === Const.SUCCESS_CODE) {
    //   this.dispatch('loading:end');
    //   this.dispatch('list:getList', fromJS(res.context));
    // } else {
    //   this.dispatch('loading:end');
    //   message.error(res.message);
    // }
  };

  getCitysList = async (params) => {
    this.dispatch('loading:start');
    this.dispatch(
      'list:cityList',
      fromJS([
        {
          country: 'United States',
          state: 'New York',
          city: 'New York city',
          postCode: '12132-12122'
        },
        {
          country: 'United States',
          state: 'New York',
          city: 'New York city',
          postCode: '12132-12122;13333-2333'
        },
        {
          country: 'United States',
          state: 'New York',
          city: 'New York city',
          postCode: ''
        }
      ])
    );
    // const { res } = await webapi.getList(params);
    // if (res.code === Const.SUCCESS_CODE) {
    //   this.dispatch('loading:end');
    //   this.dispatch('list:getList', fromJS(res.context));
    // } else {
    //   this.dispatch('loading:end');
    //   message.error(res.message);
    // }
  };

  newStateForm = () => {
    this.setIsEditStateForm(false);
    this.setStateModalVisible(true);
  };
  newCityForm = () => {
    this.setIsEditCityForm(false);
    this.setCityModalVisible(true);
  };
  editStateForm = (form) => {
    let arr = [];
    if (form.postCode) {
      const postCodeArr = form.postCode.split(';');
      postCodeArr.forEach((item) => {
        arr.push({
          id: new Date().getTime(),
          preCode: item.split('-')[0],
          suffCode: item.split('-')[1]
        });
      });
      const newForm = {
        country: form.country,
        state: form.state,
        postCodeArr: arr
      };
      this.dispatch('StateFormActor:stateForm', newForm);
    } else {
      this.onStateFormChange({
        field: 'country',
        value: form.country
      });
      this.onStateFormChange({
        field: 'state',
        value: form.state
      });
    }

    this.setIsEditStateForm(true);
    this.setStateModalVisible(true);
  };
  editCityForm = (form) => {
    let arr = [];
    if (form.postCode) {
      const postCodeArr = form.postCode.split(';');
      postCodeArr.forEach((item) => {
        arr.push({
          id: new Date().getTime(),
          preCode: item.split('-')[0],
          suffCode: item.split('-')[1]
        });
      });
      const newForm = {
        country: form.country,
        state: form.state,
        city: form.city,
        postCodeArr: arr
      };
      this.dispatch('CityFormActor:cityForm', newForm);
    } else {
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
