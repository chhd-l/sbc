import React from 'react';
import { Relax, IMap } from 'plume2';

import { Table, Modal, message } from 'antd';
import { history, noop, QMFloat, AuthWrapper, checkAuth } from 'qmkit';
import styled from 'styled-components';
const TableDiv = styled.div`
  margin-top: 20px;
  #freightTempName {
    width: 50%;
  }
  .ant-table-thead > tr > th {
    background-color: #fff;
  }
  .ant-table-title {
    background-color: #fafafa;
    .table-title-box {
      display: flex;
      justify-content: space-between;
      .operat-box {
        a {
          margin-left: 15px;
        }
      }
    }
  }
`;

const operateWay = {
  0: { label: 'piece', unit: 'piece' },
  1: { label: 'weight', unit: 'kg' },
  2: { label: 'volume', unit: 'm³' }
};
const confirm = Modal.confirm;

/**
 * 运费模板Item
 */
@Relax
export default class FreightItem extends React.Component<any, any> {
  props: {
    // 展示数据
    data: any;
    // 展示标题
    title: string;
    // 是否默认
    isDefault?: boolean;
    // 运费模板类型 false: 店铺运费模板(不展示'关联商品') ture: 单品运费模板(展示'关联商品')
    typeFlag?: boolean;
    // 计价方式 0:件数 1:重量 2:体积
    valuationType?: number;
    // 模板Id
    freightId: number;
    // 是否为店铺模板
    isStore?: boolean;
    relaxProps?: {
      // 单品运费模板
      goodsFreights: IMap;

      // 复制方法
      copy: Function;
      // 删除方法
      del: Function;
    };
  };

  static relaxProps = {
    // 单品运费模板
    goodsFreights: 'goodsFreights',

    // 复制方法
    copy: noop,
    // 删除方法
    del: noop
  };

  static defaultProps = {
    isDefault: false,
    typeFlag: false,
    operateMode: 0,
    // 是否为店铺模板
    isStore: false
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {
      data,
      title,
      isDefault,
      typeFlag,
      valuationType,
      freightId,
      isStore
    } = this.props;
    let columns = [
      {
        title: 'Courier',
        width: typeFlag ? '20%' : '30%',
        dataIndex: 'deliverWay',
        render: (text) => {
          return text == 1 ? 'Express Delivery' : '';
        }
      } as any,
      {
        title: 'Ship To',
        width: typeFlag ? '20%' : '35%',
        dataIndex: 'destinationAreaName',
        render: (text) => {
          return text.replace(',', ' ');
        }
      }
    ];
    // 单品
    if (typeFlag) {
      columns = columns.concat([
        {
          title: `First ${operateWay[valuationType].label}(${operateWay[valuationType].unit})`,
          dataIndex: 'freightStartNum',
          width: '15%'
        },
        {
          title: 'Down Payment(dollar)',
          dataIndex: 'freightStartPrice',
          width: '15%'
        },
        {
          title: `Continued ${operateWay[valuationType].label}(${operateWay[valuationType].unit})`,
          dataIndex: 'freightPlusNum',
          width: '15%'
        },
        {
          title: 'Renewal(dollar)',
          dataIndex: 'freightPlusPrice',
          width: '15%'
        }
      ]);
    } else {
      // 店铺
      columns = columns.concat([
        {
          title: 'Billing Rules',
          width: '35%',
          dataIndex: 'freightType',
          render: (text, record) => {
            if (text == 0) {
              return (
                <div>
                  Order less than {QMFloat.addZero(record.satisfyPrice)} dollar,
                  Shipping fee is {QMFloat.addZero(record.satisfyFreight)}{' '}
                  dollar
                </div>
              );
            } else {
              return (
                <div>
                  Fixed freight {QMFloat.addZero(record.fixedFreight)} dollar
                </div>
              );
            }
          }
        }
      ]);
    }

    let params = {
      columns,
      dataSource: data,
      bordered: true,
      pagination: false,
      title: () => {
        return (
          <div className="table-title-box">
            {title}
            {!isStore &&
              isDefault &&
              '(The default template is used for products without freight template)'}
            <div className="operat-box">
              {typeFlag && (
                <AuthWrapper functionName="f_goods_temp_copy">
                  <a
                    href="javascript:void(0);"
                    onClick={() => this._copy(freightId)}
                  >
                    Copy
                  </a>
                </AuthWrapper>
              )}
              {((checkAuth('f_store_temp_edit') && isStore) ||
                (checkAuth('f_goods_temp_edit') && !isStore)) && (
                <a
                  href="javascript:;"
                  onClick={() => this._edit(freightId, isStore)}
                >
                  Edit
                </a>
              )}
              {typeFlag && (
                <AuthWrapper functionName="f_goods_rela_list">
                  <a
                    href="javascript:;"
                    onClick={() =>
                      history.push(`/freight-with-goods/${freightId}`)
                    }
                  >
                    Related
                  </a>
                </AuthWrapper>
              )}
              {!isDefault &&
                ((checkAuth('f_store_temp_del') && isStore) ||
                  (checkAuth('f_goods_temp_del') && !isStore)) && (
                  <a
                    href="javascript:;"
                    onClick={() => this._del(freightId, isStore)}
                  >
                    Delete
                  </a>
                )}
            </div>
          </div>
        );
      }
    } as any;
    return (
      <TableDiv>
        <Table
          rowKey={(record: any) => record.id || record.freightTempId}
          {...params}
        />
      </TableDiv>
    );
  }

  /**
   * 复制
   */
  _copy = (freightId) => {
    const { goodsFreights, copy } = this.props.relaxProps;
    if (goodsFreights.count() < 20) {
      copy(freightId);
    } else {
      message.error('You can only add up to 20 shipping templates');
    }
  };

  /**
   * 编辑
   */
  _edit = (freightId, isStore) => {
    if (isStore) {
      history.push(`/store-freight-edit/${freightId}`);
    } else {
      history.push(`/goods-freight-edit/${freightId}`);
    }
  };

  /**
   * 删除
   */
  _del = (freightId, isStore) => {
    const { del } = this.props.relaxProps;
    confirm({
      content: 'Are you sure you want to delete this template?',
      iconType: 'exclamation-circle',
      onOk() {
        del(freightId, isStore);
      }
    });
  };
}
