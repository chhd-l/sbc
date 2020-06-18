import React from 'react';
import { StoreProvider } from 'plume2';

import AppStore from './store';
import Header from './component/header';
import TodoItems from './component/todo-items';
import StatisticalReport from './component/statistical-report';
import Ranking from './component/ranking';
import HomePrescriber from './component/home-prescriber';

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
    let employee = this.store.state().get('employee');
    let roleName = employee.get('roleName') ? employee.get('roleName') : '';
    let isPrescriber =
      employee.get('clientId') || roleName.indexOf('Prescriber') > -1;

    return !isPrescriber ? (
      <div style={styles.container}>
        <Header />
        <TodoItems />
        <StatisticalReport />
        {/* <Ranking /> */}
      </div>
    ) : (
      <div style={styles.container}>
        <HomePrescriber />
      </div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    padding: '12px'
  }
};
