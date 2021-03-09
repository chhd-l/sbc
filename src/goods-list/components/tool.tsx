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
    if (checkAuth('f_goods_up_down') || checkAuth('f_goods_6') || checkAuth('f_goods_temp_set')) {
      hasMenu = true;
    }

    return (
      <div className="handle-bar">
        {hasMenu && (
          <Dropdown overlay={this._menu()} getPopupContainer={() => document.getElementById('page-content')}>
            <Button>
              {<FormattedMessage id="Product.batchOperation" />}
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
              onClick={() => {
                this._spuOnSale();
              }}
            >
              <FormattedMessage id="Product.Batchonshelves" />
            </a>
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item>
          <AuthWrapper functionName="f_goods_up_down">
            <a
              onClick={() => {
                this._spuOffSale();
              }}
            >
              <FormattedMessage id="Product.Batchoffshelves" />
            </a>
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item>
          <AuthWrapper functionName="f_goods_6">
            <a
              onClick={() => {
                this._delGoods();
              }}
            >
              <FormattedMessage id="Product.Batchdelete" />
            </a>
          </AuthWrapper>
        </Menu.Item>
        {/* <Menu.Item>
          <AuthWrapper functionName="f_goods_temp_set">
            <a
              href="#"
              onClick={() => {
                this._setFeight();
              }}
            >
              Set the freight template
            </a>
          </AuthWrapper>
        </Menu.Item> */}
      </Menu>
    );
  };

  _setFeight = () => {
    const { selectedSpuKeys, setFeightVisible } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error(<FormattedMessage id="Product.atLeastOneItem" />);
      return;
    } else {
      setFeightVisible(true);
    }
  };

  _spuOnSale = () => {
    const { spuOnSale, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error(<FormattedMessage id="Product.atLeastOneItem" />);
      return;
    }
    confirm({
      title: <FormattedMessage id="Product.Prompt" />,
      content: <FormattedMessage id="Product.putProductsOnShelves" />,
      onOk() {
        spuOnSale();
      }
    });
  };

  _spuOffSale = () => {
    const { spuOffSale, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error(<FormattedMessage id="Product.atLeastOneItem" />);
      return;
    }
    confirm({
      title: <FormattedMessage id="Product.Prompt" />,
      content: <FormattedMessage id="Product.putProductsOnShelves" />,
      onOk() {
        spuOffSale();
      }
    });
  };

  _delGoods = () => {
    const { spuDelete, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error(<FormattedMessage id="Product.atLeastOneItem" />);
      return;
    }
    confirm({
      title: <FormattedMessage id="Product.Prompt" />,
      content: <FormattedMessage id="Product.deleteThisProduct" />,
      onOk() {
        spuDelete();
      }
    });
  };
}
