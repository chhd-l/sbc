import { IOptions, Store, ViewAction } from 'plume2';
import { message, Modal } from 'antd';
import LoadingActor from './actor/loading-actor';
import ListActor from './actor/list-actor';
import StateFormActor from './actor/state-form-actor';
import CityFormActor from './actor/city-form-actor';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { cache, Const, history, util } from 'qmkit';

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
          postCode: '12132-12122;13331'
        },
        {
          country: 'United States',
          state: 'New York2',
          postCode: '12132-12122;13332'
        },
        {
          country: 'United States',
          state: 'New York3',
          postCode: '12132-12122;13333'
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
          postCode: '12132-12122;13333'
        },
        {
          country: 'United States',
          state: 'New York',
          city: 'New York city',
          postCode: '12132-12122;13333'
        },
        {
          country: 'United States',
          state: 'New York',
          city: 'New York city',
          postCode: '12132-12122;13333'
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
    this.setIsEditStateForm(true);
    this.dispatch('StateFormActor:stateForm', form);
    this.setStateModalVisible(true);
  };
  editCityForm = (form) => {
    this.setIsEditCityForm(true);
    this.dispatch('CityFormActor:cityForm', form);
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
  onResetStateForm = () => {
    this.dispatch('StateFormActor:resetForm');
  };
  onResetCityForm = () => {
    this.dispatch('CityFormActor:resetForm');
  };
}
