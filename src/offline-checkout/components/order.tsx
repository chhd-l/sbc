import React from 'react';
import Header from './header';

export default class Order extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}
