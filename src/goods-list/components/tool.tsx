import * as React from 'react';
import { Relax } from 'plume2';
import { Button, Dropdown, Menu, Icon, Modal, message } from 'antd';
import { IList } from 'typings/globalType';
import { withRouter } from 'react-router';
import {noop, AuthWrapper, checkAuth, util, Const} from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import SyncButton from './sync-product';
const confirm = Modal.confirm;

@withRouter
@Relax
class Tool extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      spuDelete: Function;
      spuOnSale: Function;
      spuOffSale: Function;
      selectedSpuKeys: IList;
      setFeightVisible: Function;
      likeGoodsName: string;
      likeGoodsInfoNo: string;
      likeGoodsNo: string;
      storeCateIdList: string;
      brandId: string;
      cateId: string;
    };
  };
  static relaxProps = {
    spuDelete: noop,
    spuOnSale: noop,
    spuOffSale: noop,
    selectedSpuKeys: 'selectedSpuKeys',
    field: 'field',
    setFeightVisible: noop,
    // 模糊条件-商品名称
    likeGoodsName: 'likeGoodsName',
    // 模糊条件-SKU编码
    likeGoodsInfoNo: 'likeGoodsInfoNo',
    // 模糊条件-SPU编码
    likeGoodsNo: 'likeGoodsNo',
    // 商品分类
    storeCateIdList: 'storeCateIdList',
    // 品牌编号
    brandId: 'brandId',
    cateId: 'cateId',
  };

  render() {
    let hasMenu = false;
    if (checkAuth('f_goods_up_down') || checkAuth('f_goods_6') || checkAuth('f_goods_temp_set')) {
      hasMenu = true;
    }

    return (
      <div className="handle-bar">
        <AuthWrapper functionName="f_goods_sync">
          <SyncButton />
        </AuthWrapper>
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
        <Menu.Item>
          <AuthWrapper functionName="f_goods_6">
            <a
              onClick={() => {
                this._export();
              }}
            >
              Batch export Stock&Price
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

      message.error(this.props.intl.formatMessage({ id: 'Product.atLeastOneItem' }));
      return;
    } else {
      setFeightVisible(true);
    }
  };

  _spuOnSale = () => {
    const { spuOnSale, selectedSpuKeys } = this.props.relaxProps;

    if (selectedSpuKeys.count() < 1) {

      message.error(this.props.intl.formatMessage({ id: 'Product.atLeastOneItem' }));
      return;
    }
    let title = this.props.intl.formatMessage({ id: 'Product.Prompt' })
    let content = this.props.intl.formatMessage({ id: 'Product.putProductsOnShelves' })
    confirm({

      title: title,
      content: content,
      onOk() {
        spuOnSale();
      }
    });
  };

  _spuOffSale = () => {
    const { spuOffSale, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error(this.props.intl.formatMessage({ id: 'Product.atLeastOneItem' }));
      return;
    }
    let title = this.props.intl.formatMessage({ id: 'Product.Prompt' })
    let content = this.props.intl.formatMessage({ id: 'Product.putProductsOnShelves' })
    confirm({
      title: title,
      content: content,
      onOk() {
        spuOffSale();
      }
    });
  };

  _delGoods = () => {
    const { spuDelete, selectedSpuKeys } = this.props.relaxProps;
    if (selectedSpuKeys.count() < 1) {
      message.error(this.props.intl.formatMessage({ id: 'Product.atLeastOneItem' }));
      return;
    }

    let title = this.props.intl.formatMessage({ id: 'Product.Prompt' })
    let content = this.props.intl.formatMessage({ id: 'Product.deleteThisProduct' })
    confirm({
      title: title,
      content: content,
      onOk() {
        spuDelete();
      }
    });
  };


  _export = () => {
    const { likeGoodsName, likeGoodsInfoNo, likeGoodsNo, storeCateIdList, cateId, brandId } = this.props.relaxProps;

    let params = {
      likeGoodsName,
      likeGoodsNo,
      likeGoodsInfoNo,
      storeCateIdList,
      cateId,
      brandId,
    };
    return new Promise((resolve) => {
      setTimeout(() => {
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          const exportHref = Const.HOST + `/goods/exportSpus/${encrypted}`;

          window.open(exportHref);
        } else {
          message.error(<FormattedMessage id="Analysis.Unsuccessful" />);
        }

        resolve();
      }, 500);
    });
  };
}
export default injectIntl(Tool)
