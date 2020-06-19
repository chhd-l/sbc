import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Dropdown, Menu, Icon, Modal, message } from 'antd';
import { IList } from 'typings/globalType';
import { withRouter } from 'react-router';
import { noop, AuthWrapper, checkAuth } from 'qmkit';
import { FormattedMessage } from 'react-intl';
const confirm = Modal.confirm;

@withRouter
@Relax
export default class Tool extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      spuDelete: Function;
      spuOnSale: Function;
      spuOffSale: Function;
      selectedSpuKeys: IList;
      setFeightVisible: Function;
    };
  };

  static relaxProps = {
    spuDelete: noop,
    spuOnSale: noop,
    spuOffSale: noop,
    selectedSpuKeys: 'selectedSpuKeys',
    setFeightVisible: noop
  };

  render() {
    let hasMenu = false;
    if (
      checkAuth('f_goods_up_down') ||
      checkAuth('f_goods_6') ||
      checkAuth('f_goods_temp_set')
    ) {
      hasMenu = true;
    }

    return (
      <div className="handle-bar">
        {hasMenu && (
          <Dropdown
            overlay={this._menu()}
            getPopupContainer={() => document.getElementById('page-content')}
          >
            <Button>
              {<FormattedMessage id="product.batchOperation" />}
              <Icon type="down" />
            </Button>
          </Dropdown>
        )}
      </div>
    );
  }

  _menu = () => {
    return (
      <Menu>
        <Menu.Item>
          <AuthWrapper functionName="f_goods_up_down">
            <a
              href="javascript:;"
              onClick={() => {
                this._spuOnSale();
              }}
            >
              Batch shelves
            </a>
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item>
          <AuthWrapper functionName="f_goods_up_down">
            <a
              href="javascript:;"
              onClick={() => {
                this._spuOffSale();
              }}
            >
              Batch off shelves
            </a>
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item>
          <AuthWrapper functionName="f_goods_6">
            <a
              href="javascript:;"
              onClick={() => {
                this._delGoods();
              }}
            >
              Batch delete
            </a>
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item>
          <AuthWrapper functionName="f_goods_temp_set">
            <a
              href="javascript:;"
              onClick={() => {
                this._setFeight();
              }}
            >
              Set the freight template
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );
  };

  _setFeight = () => {
    const { selectedSpuKeys, setFeightVisible } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error('至少选择一件商品');
      return;
    } else {
      setFeightVisible(true);
    }
  };

  _spuOnSale = () => {
    const { spuOnSale, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error('至少选择一件商品');
      return;
    }
    confirm({
      title: '提示',
      content: '您确认要上架这些商品吗？',
      onOk() {
        spuOnSale();
      }
    });
  };

  _spuOffSale = () => {
    const { spuOffSale, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error('至少选择一件商品');
      return;
    }
    confirm({
      title: '提示',
      content: '您确认要下架这些商品吗？',
      onOk() {
        spuOffSale();
      }
    });
  };

  _delGoods = () => {
    const { spuDelete, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error('至少选择一件商品');
      return;
    }
    confirm({
      title: '提示',
      content: '您确认要删除这些商品吗？',
      onOk() {
        spuDelete();
      }
    });
  };
}
