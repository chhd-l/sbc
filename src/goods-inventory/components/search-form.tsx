import React from 'react';
import { Relax } from 'plume2';
import { Alert, Input, Button, InputNumber } from 'antd';
import { FormattedMessage } from 'react-intl';

@Relax
export default class SearchForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      disabledType: true,
      editType: true
    };
  }

  props: {
    relaxProps?: {
      likeGoodsName: string;
    };
  };

  static relaxProps = {
    // 模糊条件-商品名称
    likeGoodsName: 'likeGoodsName'
  };

  onEdit = () => {
    this.setState({
      disabledType: !this.state.disabledType,
      editType: !this.state.editType
    });
  };
  onChangeNumber = (res) => {
    console.log(res);
  };

  onRefresh = () => {};

  render() {
    return (
      <div className="filter-content">
        <Alert message="Set an amount that when products are below this certain amount, they are considered as ‘Low inventory’ and will be shown in the list below." type="info" />
        <div className="inventory flex-start-align">
          <div className="inventory-text">
            <span>* </span>Products are ‘Low inventory’ when below :
          </div>
          <InputNumber style={{ width: '60px' }} defaultValue={10} disabled={this.state.disabledType} onChange={(e) => this.onChangeNumber(e)} min={0} max={10} />
          <Button type="primary" icon="edit" shape="round" onClick={() => this.onEdit()}>
            {this.state.editType == true ? 'Edit' : 'Save'}
          </Button>
          <Button type="primary" icon="sync" shape="round" onClick={() => this.onRefresh()}>
            Refresh
          </Button>
        </div>
      </div>
    );
  }
}
