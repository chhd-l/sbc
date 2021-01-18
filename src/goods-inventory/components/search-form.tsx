import React from 'react';
import { Relax } from 'plume2';
import { Alert, Input, Button, InputNumber } from 'antd';
import { AuthWrapper, noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';
//import { FormattedMessage } from 'react-intl';

@Relax
export default class SearchForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      disabledType: true,
      editType: true,
      getThreshold: 10
    };
  }

  props: {
    relaxProps?: {
      getThreshold: any;
      stock: any;
      onStock: Function;
      init: Function;
      bulkExport: Function;
    };
  };

  static relaxProps = {
    // 模糊条件-商品名称
    getThreshold: 'getThreshold',
    stock: 'stock',
    onStock: noop,
    init: noop,
    bulkExport: noop
  };

  onEdit = () => {
    this.setState(
      {
        disabledType: !this.state.disabledType,
        editType: !this.state.editType
      },
      () => {
        if (this.state.disabledType) {
          this.onRefresh();
        }
      }
    );
  };

  onChangeNumber = (res) => {
    const { onStock } = this.props.relaxProps;
    const value = res ? res : 1;
    this.setState({
      getThreshold: value
    });

    onStock(value);
  };

  onRefresh = () => {
    const { init, stock } = this.props.relaxProps;
    init(0, 10, stock);
  };

  render() {
    const { getThreshold, bulkExport, stock } = this.props.relaxProps;
    return (
      <div className="filter-content">
        <Alert message="Set a quantity that when products are below this certain quantity, they are considered as ‘Low inventory’ and will be shown in the list below." type="info" />
        <div className="inventory flex-start-align">
          <div className="inventory-text">
            <span>* </span>Products are ‘Low inventory’ when below :
          </div>
          <div style={{ width: '120px' }}>
            {
              <InputNumber
                style={{ width: '120px' }}
                // key={Number(stock) + 1}
                defaultValue={stock}
                step={1}
                disabled={this.state.disabledType}
                onChange={this.onChangeNumber}
                min={1}
                value={stock}
                formatter={(e) => {
                  if (!/(^[1-9]\d*$)/.test(e)) {
                    return 1;
                  } else {
                    return e;
                  }
                }}
              />
            }
          </div>
          <Button type="primary" icon="edit" shape="round" onClick={() => this.onEdit()}>
            {this.state.editType == true ? 'Edit' : 'Save'}
          </Button>
          {/*<Button type="primary" icon="sync" shape="round" onClick={() => this.onRefresh()}>*/}
          {/*  Refresh*/}
          {/*</Button>*/}

          <Button onClick={() => bulkExport()}>{<FormattedMessage id="bulkExport" />}</Button>
        </div>
      </div>
    );
  }
}
