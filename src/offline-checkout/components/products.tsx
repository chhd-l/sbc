import React from 'react';
import { Input } from 'antd';

export default class ProductOverview extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="c-box-title">Product overview</div>
        <div className="c-box-footer">
          <Input.Search />
        </div>
      </>
    );
  }
}
