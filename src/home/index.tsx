import React from 'react';
import { StoreProvider } from 'plume2';

import AppStore from './store';
import Header from './component/header';
import TodoItems from './component/todo-items';
import Prescriber from './component/prescriber';
import TodoItemsMyvet from './component/todo-items-myvetreco';
import moment from 'moment';
/*import StatisticalReport from './component/statistical-report';
import Ranking from './component/ranking';
import HomePrescriber from './component/home-prescriber';*/

import { cache, Const } from 'qmkit';
import * as webapi from './webapi';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class HelloApp extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
    this.state = {
      prescriberId: null,
      changeMode: false,
      getPrescriberId: '',
      week: moment(sessionStorage.getItem(cache.CURRENT_YEAR)).week()
    };
  }

  componentDidMount() {
    let employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    const prescriberId = employee && employee.prescribers && employee.prescribers.length > 0 ? employee.prescribers[0].id : null;
    let id = '';
    if (JSON.parse(sessionStorage.getItem('PrescriberSelect'))) {
      id = JSON.parse(sessionStorage.getItem('PrescriberSelect')).id;
    } else {
      id = prescriberId;
    }
    //sessionStorage.setItem('prescriberId', prescriberId);
    this.setState({
      prescriberId: id
    });
    let date = sessionStorage.getItem(cache.CURRENT_YEAR);
    if (Const.SITE_NAME === 'MYVETRECO' || id == null) {
      this.store.newInit({
        companyId: 2,
        weekNum: moment(date).week(),
        year: moment(date).weekYear()
      });
    } else {
      this.store.prescriberInit({
        companyId: 2,
        weekNum: moment(date).week(),
        year: moment(date).weekYear(),
        prescriberId: id
      });
    }

    this.getDeliveryOption();
  }
  getDeliveryOption() {
    webapi
      .getDeliveryOptions()
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          let doptions = res.context.configVOList;
          let pickupIsOpen = false;
          doptions.map((e: any) => {
            if (e.configType === 'pick_up_delivery') {
              e.status === 1 ? pickupIsOpen = true : pickupIsOpen = false;
            }
          });
          sessionStorage.setItem('portal-pickup-isopen', JSON.stringify(pickupIsOpen));
        }
      }).catch(() => { });
  }
  changePage(res) {
    this.setState(
      {
        changeMode: res.type,
        getPrescriberId: res.getPrescriberId,
        week: res.week
      },
      () => {
        let date = sessionStorage.getItem(cache.CURRENT_YEAR);
        if (res.getPrescriberId != null) {
          this.store.prescriberInit({
            companyId: 2,
            weekNum: this.state.week,
            year: moment(date).weekYear(),
            prescriberId: res.getPrescriberId
          });
        } else {
          this.store.newInit({
            companyId: 2,
            weekNum: this.state.week,
            year: moment(date).weekYear()
          });
        }
      }
    );
  }
  render() {
    let allFunctions = JSON.parse(sessionStorage.getItem(cache.LOGIN_FUNCTIONS));
    if (allFunctions.includes('f_home')) {
      return !this.state.prescriberId || Const.SITE_NAME === 'MYVETRECO' ? (
        <div style={styles.container}>
          <Header changePage={(mode) => this.changePage(mode)} />
          {Const.SITE_NAME === 'MYVETRECO' ? <TodoItemsMyvet /> : this.state.changeMode == false ? <TodoItems /> : <Prescriber prescriberId={this.state.getPrescriberId} />}

          {/*<StatisticalReport />
          <Ranking /> */}
        </div>
      ) : (
        <div style={styles.container}>
          {/*<HomePrescriber prescriberId={prescriberId} />*/}
          <Header changePage={(mode) => this.changePage(mode)} />
          <Prescriber prescriberId={this.state.prescriberId} />
        </div>
      );
    } else {
      return <div style={styles.container}></div>;
    }
  }
}

const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    padding: '12px'
  }
};
