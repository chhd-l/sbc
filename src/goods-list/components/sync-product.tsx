import React from 'react';
import { Button } from 'antd';
import { syncProduct } from '../webapi';

export default class SyncButton extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      count: 60
    };
  }

  startCountDown = () => {
    const ld = setInterval(() => {
      if (this.state.count === 1) {
        clearInterval(ld);
        this.setState({
          loading: false,
          count: 60
        });
      } else {
        this.setState({
          count: this.state.count - 1
        });
      }
    }, 1000);
  };

  onSync = () => {
    this.setState({
      loading: true
    });
    syncProduct()
      .then(() => {
        this.startCountDown();
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { loading, count } = this.state;
    return (
      <Button type="primary" disabled={loading} onClick={this.onSync}>
        {loading ? `Synchronize(${count})` : 'Synchronize'}
      </Button>
    );
  }
}
