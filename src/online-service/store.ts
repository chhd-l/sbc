import { Store, IOptions } from 'plume2';
import * as webapi from './webapi';
import IndexActor from './actor/online-server-actor';
import { checkAuth, Const } from 'qmkit';
import { message } from 'antd';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new IndexActor()];
  }

  /**
   * 初始化加载在线客服设置
   * @returns {Promise<void>}
   */
  init = async () => {
    const { res } = await webapi.getOnlineServerSwitch();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('ONLINE_SERVER_INIT', res.context);
    }
  };

  /**
   * 弹窗显隐
   * @returns {Promise<void>}
   */
  smsEdit = async () => {
    this.dispatch('modal:changeQQShow');
  };

  /**
   * 查询客服列表
   * @returns {Promise<void>}
   */
  onEditServer = async () => {
    const { res } = await webapi.getOnlineServerList();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('ONLINE_SERVER_LIST', res.context);
      this.smsEdit();
    }
  };

  /**
   * 弹窗显隐
   */
  smsCancel = () => {
    this.dispatch('modal:changeQQShow');
  };

  /**
   * 值改变
   * @param {any} field
   * @param {any} value
   */
  onFormChange = ({ field, value }) => {
    if (field == 'effectTerminal') {
      let valArr = [0, 0, 0];
      value.forEach((v) => {
        if (v == 'pc') {
          valArr[0] = 1;
        }
        if (v == 'app') {
          valArr[1] = 1;
        }
        if (v == 'mobile') {
          valArr[2] = 1;
        }
      });
      this.transaction(() => {
        ['effectivePc', 'effectiveApp', 'effectiveMobile'].forEach((v, index) => {
          this.dispatch('ON_FORM_CHANGE', {
            field: v,
            value: valArr[index]
          });
        });
      });
      return;
    }
    this.dispatch('ON_FORM_CHANGE', { field, value });
  };

  /**
   * 新增客服
   */
  onAddOnlineServer = () => {
    this.dispatch('ADD_ONLINE_SERVER');
  };

  /**
   * 客服编辑
   * @param state
   * @param index
   * @param text
   */
  onSetOnlineServer = ({ index, field, text }) => {
    this.dispatch('SET_ONLINE_SERVER', { index, field, text });
  };

  /**
   * 删除在线客服
   * @param index
   */
  onDelOnlineServer = (index) => {
    this.dispatch('ON_DEL_ONLINE_SERVER', index);
  };

  /**
   * 保存客服列表
   * @returns {Promise<void>}
   */
  onSaveOnlineServer = async () => {
    if (checkAuth('f_online_server_edit')) {
      const qqOnlineServerRop = this.state().get('onlineServer');
      const qqOnlineServerItemRopList = this.state().get('onlineServerList');
      if (qqOnlineServerItemRopList.size > 10) {
        message.error('最多添加10个客服账号');
        return;
      }

      if (qqOnlineServerItemRopList.size > 0) {
        let accounts = qqOnlineServerItemRopList.map((v) => v.get('customerServiceAccount'));
        let repeatNo = [];
        let temp = '';
        for (let i = 0; i < accounts.size - 1; i++) {
          temp = accounts.get(i);
          for (let j = i + 1; j < accounts.size; j++) {
            if (temp == accounts.get(j)) {
              repeatNo.push(temp);
            }
          }
        }
        if (repeatNo.length > 0) {
          message.error('Customer Service Account ' + repeatNo + ' Exsit');
          return;
        }
      }

      const { res } = await webapi.onSaveOnlineServer(qqOnlineServerRop, qqOnlineServerItemRopList);
      if (res.code == Const.SUCCESS_CODE) {
        message.success('Operate successfully');
        this.smsCancel();
        this.init();
      } else {
      }
    } else {
      message.error('No operation authority');
    }
  };
}
