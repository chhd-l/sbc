import React from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { cache } from 'qmkit';
import { isNumber } from 'lodash';

const currencySymbol = sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) || '';

type promotionsArrObj = {
  code?: string,
  createTime?: string,
  delFlag?: number,
  discount?: number | string,
  id?: number,
  mergeId?: string,
  name?: string,
  orderId?: string,
  subscriptionDiscount?: number,
  subscriptionId?: string,
  type?: number,
  updateTime?: string,
  useTime?: string,
  value?: number,
  publicStatus?: string,
  marketingType?: number
}

type MorePromotionModalPropsType = {
  promotionsArr: Array<promotionsArrObj>;
  visible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

function MorePromotionModal({ promotionsArr, visible, handleOk, handleCancel }: MorePromotionModalPropsType) {
  return (
    <div>
      <Modal
        title={(window as any).RCi18n({
          id: 'Subscription.seePromotions'
        })}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {promotionsArr?.length > 0 && promotionsArr.map((item) => {
          // publicStatus 0 private 
          //              1 public
          if (item?.publicStatus === '1') {
            return (<p style={{ marginBottom: '8px' }}>
              <FormattedMessage
                id='Subscription.SaveItem'
                values={{
                  val1: `${(item?.value ?? 0) + currencySymbol}`,
                  val2: <FormattedMessage id='Subscription.SaveItemPublic' />
                }}
              />
            </p>)
          } else {
            // marketingType 0 满减 1 满折
            if (item?.marketingType === 0) {
              return (<p style={{ marginBottom: '8px' }}>
                <FormattedMessage
                  id='Subscription.SaveItem'
                  values={{
                    val1: `${(item?.value ?? 0) + currencySymbol}`,
                    val2: `${item?.code ?? ''}`
                  }}
                />
              </p>)
            } else {
              return (<p style={{ marginBottom: '8px' }}>
                <FormattedMessage
                  id='Subscription.SaveItemDiscount'
                  values={{
                    discount: `${item?.discount && `${item?.discount}`.includes('%')
                      ? item?.discount
                      : Number(item?.discount).toFixed(0) + '%'
                      }` ?? '0%',
                    code: `${item?.code ?? ''}`
                  }}
                />
              </p>)
            }
          }
        })}

      </Modal>
    </div>
  )
}

export default MorePromotionModal;
