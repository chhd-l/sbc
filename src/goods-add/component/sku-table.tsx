import * as React from 'react';
import { Relax } from 'plume2';
import {
  Table,
  Input,
  Row,
  Col,
  Checkbox,
  InputNumber,
  Form,
  Button,
  message,
  Tooltip,
  Icon
} from 'antd';
import { IList } from 'typings/globalType';
import { fromJS, List } from 'immutable';
import { noop, ValidConst } from 'qmkit';
import ImageLibraryUpload from './image-library-upload';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;

const FILE_MAX_SIZE = 2 * 1024 * 1024;

@Relax
export default class SkuTable extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      goodsSpecs: IList;
      goodsList: IList;
      stockChecked: boolean;
      marketPriceChecked: boolean;
      specSingleFlag: boolean;
      spuMarketPrice: number;
      priceOpt: number;
      editGoodsItem: Function;
      deleteGoodsInfo: Function;
      updateSkuForm: Function;
      updateChecked: Function;
      synchValue: Function;
      clickImg: Function;
      removeImg: Function;
      modalVisible: Function;
    };
  };

  static relaxProps = {
    goodsSpecs: 'goodsSpecs',
    goodsList: 'goodsList',
    stockChecked: 'stockChecked',
    marketPriceChecked: 'marketPriceChecked',
    specSingleFlag: 'specSingleFlag',
    spuMarketPrice: ['goods', 'marketPrice'],
    priceOpt: 'priceOpt',
    editGoodsItem: noop,
    deleteGoodsInfo: noop,
    updateSkuForm: noop,
    updateChecked: noop,
    synchValue: noop,
    clickImg: noop,
    removeImg: noop,
    modalVisible: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(SkuForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const { updateSkuForm } = this.props.relaxProps;
    return (
      <WrapperForm
        ref={(form) => updateSkuForm(form)}
        {...{ relaxProps: this.props.relaxProps }}
      />
    );
  }
}

class SkuForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { goodsList } = this.props.relaxProps;
    const columns = this._getColumns();

    return (
      <div style={{ marginBottom: 20 }}>
        <Form>
          <Table
            rowKey="id"
            dataSource={goodsList.toJS()}
            columns={columns}
            pagination={false}
          />
        </Form>
      </div>
    );
  }

  _getColumns = () => {
    const { getFieldDecorator } = this.props.form;
    const {
      goodsSpecs,
      stockChecked,
      marketPriceChecked,
      modalVisible,
      clickImg,
      removeImg,
      specSingleFlag,
      spuMarketPrice,
      priceOpt
    } = this.props.relaxProps;

    let columns: any = List();

    // 未开启规格时，不需要展示默认规格
    if (!specSingleFlag) {
      columns = goodsSpecs
        .map((item) => {
          return {
            title: item.get('specName'),
            dataIndex: 'specId-' + item.get('specId'),
            key: item.get('specId')
          };
        })
        .toList();
    }

    columns = columns.unshift({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          <FormattedMessage id="product.image" />
        </div>
      ),
      key: 'img',
      className: 'goodsImg',
      render: (rowInfo) => {
        const images = fromJS(rowInfo.images ? rowInfo.images : []);
        return (
          <ImageLibraryUpload
            images={images}
            modalVisible={modalVisible}
            clickImg={clickImg}
            removeImg={removeImg}
            imgCount={1}
            imgType={1}
            skuId={rowInfo.id}
          />
        );
      }
    });

    columns = columns.unshift({
      title: '',
      key: 'index',
      render: (_text, _rowInfo, index) => {
        return index + 1;
      }
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          <FormattedMessage id="product.SKU" />
        </div>
      ),
      key: 'goodsInfoNo',
      render: (rowInfo) => {
        return (
          <Row>
            <Col span={12}>
              <FormItem style={styles.tableFormItem}>
                {getFieldDecorator('goodsInfoNo_' + rowInfo.id, {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请填写SKU编码'
                    },
                    {
                      min: 1,
                      max: 20,
                      message: '1-20字符'
                    }
                  ],
                  onChange: this._editGoodsItem.bind(
                    this,
                    rowInfo.id,
                    'goodsInfoNo'
                  ),
                  initialValue: rowInfo.goodsInfoNo
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        );
      }
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          <FormattedMessage id="product.marketPrice" />
          <br />
          <Checkbox
            disabled={priceOpt === 0}
            checked={marketPriceChecked}
            onChange={(e) => this._synchValue(e, 'marketPrice')}
          >
            <FormattedMessage id="allTheSame" />
            &nbsp;
            <Tooltip placement="top" title={'勾选后所有SKU都使用相同的市场价'}>
              <a style={{ fontSize: 14 }}>
                <Icon type="question-circle-o" />
              </a>
            </Tooltip>
          </Checkbox>
        </div>
      ),
      key: 'marketPrice',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('marketPrice_' + rowInfo.id, {
                rules: [
                  {
                    required: true,
                    message: '请填写市场价'
                  },
                  {
                    pattern: ValidConst.zeroPrice,
                    message: '请填写两位小数的合法金额'
                  },
                  {
                    type: 'number',
                    max: 9999999.99,
                    message: '最大值为9999999.99',
                    transform: function(value) {
                      return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                    }
                  }
                ],
                onChange: this._editGoodsItem.bind(
                  this,
                  rowInfo.id,
                  'marketPrice'
                ),
                initialValue: rowInfo.marketPrice || 0
              })(
                <Input
                  disabled={
                    (rowInfo.index > 1 && marketPriceChecked) ||
                    (!rowInfo.aloneFlag && priceOpt == 0 && spuMarketPrice)
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>
      )
    });

    columns = columns.push({
      title: (
        <div>
          <span
            style={{
              color: 'red',
              fontFamily: 'SimSun',
              marginRight: '4px',
              fontSize: '12px'
            }}
          >
            *
          </span>
          <FormattedMessage id="product.inventory" />
          <br />
          <Checkbox
            checked={stockChecked}
            onChange={(e) => this._synchValue(e, 'stock')}
          >
            <FormattedMessage id="allTheSame" />
            &nbsp;
            <Tooltip placement="top" title={'勾选后所有SKU都使用相同的库存'}>
              <a style={{ fontSize: 14 }}>
                <Icon type="question-circle-o" />
              </a>
            </Tooltip>
          </Checkbox>
        </div>
      ),
      key: 'stock',
      render: (rowInfo) => (
        <Row>
          <Col span={12}>
            <FormItem style={styles.tableFormItem}>
              {getFieldDecorator('stock_' + rowInfo.id, {
                rules: [
                  {
                    pattern: ValidConst.number,
                    message: '0或正整数'
                  }
                ],
                onChange: this._editGoodsItem.bind(this, rowInfo.id, 'stock'),
                initialValue: rowInfo.stock
              })(
                <InputNumber
                  style={{ width: '100px' }}
                  min={0}
                  max={9999999}
                  disabled={rowInfo.index > 1 && stockChecked}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      )
    });

    // columns = columns.push({
    //   title: '条形码',
    //   key: 'goodsInfoBarcode',
    //   render: (rowInfo) => (
    //     <Row>
    //       <Col span={12}>
    //         <FormItem style={styles.tableFormItem}>
    //           {getFieldDecorator('goodsInfoBarcode_' + rowInfo.id, {
    //             rules: [
    //               {
    //                 max: 20,
    //                 message: '0-20字符'
    //               }
    //             ],
    //             onChange: this._editGoodsItem.bind(
    //               this,
    //               rowInfo.id,
    //               'goodsInfoBarcode'
    //             ),
    //             initialValue: rowInfo.goodsInfoBarcode
    //           })(<Input />)}
    //         </FormItem>
    //       </Col>
    //     </Row>
    //   )
    // });

    columns = columns.push({
      title: <FormattedMessage id="operation" />,
      key: 'opt',
      render: (rowInfo) =>
        specSingleFlag ? null : (
          <Button onClick={() => this._deleteGoodsInfo(rowInfo.id)}>
            <FormattedMessage id="delete" />
          </Button>
        )
    });

    return columns.toJS();
  };

  _deleteGoodsInfo = (id: string) => {
    const { deleteGoodsInfo } = this.props.relaxProps;
    deleteGoodsInfo(id);
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif') ||
      fileName.endsWith('.jpeg')
    ) {
      if (file.size < FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小必须小于2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  /**
   * 修改商品属性
   */
  _editGoodsItem = (id: string, key: string, e: any) => {
    const { editGoodsItem, synchValue } = this.props.relaxProps;
    const checked = this.props.relaxProps[`${key}Checked`];
    if (e && e.target) {
      e = e.target.value;
    }
    editGoodsItem(id, key, e);

    if (key == 'stock' || key == 'marketPrice') {
      // 是否同步库存
      if (checked) {
        // 修改store中的库存或市场价
        synchValue(key);
        // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
        const fieldsValue = this.props.form.getFieldsValue();
        // 同步库存/市场价
        let values = {};
        Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
          if (field.indexOf(`${key}_`) === 0) {
            values[field] = e;
          }
        });
        // update
        this.props.form.setFieldsValue(values);
      }
    }
  };

  /**
   * 修改商品图片属性
   */
  _editGoodsImageItem = (id: string, key: string, { fileList }) => {
    let msg = null;
    if (fileList != null) {
      fileList.forEach((file) => {
        if (
          file.status == 'done' &&
          file.response != null &&
          file.response.message != null
        ) {
          msg = file.response.message;
        }
      });

      if (msg != null) {
        //如果上传失败，只过滤成功的图片
        message.error(msg);
        fileList = fileList.filter(
          (file) =>
            file.status == 'done' &&
            file.response != null &&
            file.response.message == null
        );
      }
    }
    const { editGoodsItem } = this.props.relaxProps;
    editGoodsItem(id, key, fromJS(fileList));
  };

  /**
   * 同步库存
   */
  _synchValue = async (e, key) => {
    const { updateChecked, goodsList } = this.props.relaxProps;
    await updateChecked(key, e.target.checked);
    const goodsInfo = goodsList.get(0);
    if (goodsInfo) {
      this._editGoodsItem(goodsInfo.get('id'), key, goodsInfo.get(key));
    }
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  tableFormItem: {
    marginBottom: '0px'
  }
};
