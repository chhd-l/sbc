import { IOptions, Store } from 'plume2';
import { Const } from 'qmkit';
import { fromJS } from 'immutable';
import { message } from 'antd';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
  }

  onFormChange = () => {
    console.log('onFormChange');
  };

  onSearch = () => {
    console.log('onSearch');
  };
}
