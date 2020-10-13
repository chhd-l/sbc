import React from 'react';
import { StoreProvider } from 'plume2';

import AppStore from './store';
import Header from './component/header';
import TodoItems from './component/todo-items';
import StatisticalReport from './component/statistical-report';
import Ranking from './component/ranking';
import HomePrescriber from './component/home-prescriber';
import { cache } from 'qmkit';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class HelloApp extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    let employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    const prescriberId = employee && employee.prescribers && employee.prescribers.length > 0 ? employee.prescribers[0].id : null;

    let allFunctions = JSON.parse(sessionStorage.getItem(cache.LOGIN_FUNCTIONS));

    if (allFunctions.includes('f_home')) {
      return !prescriberId ? (
        <div style={styles.container}>
          <Header />
          <TodoItems />
          <StatisticalReport />
          {/* <Ranking /> */}
        </div>
      ) : (
        <div style={styles.container}>
          <HomePrescriber prescriberId={prescriberId} />
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