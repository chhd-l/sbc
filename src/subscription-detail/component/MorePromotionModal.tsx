import React from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { cache } from 'qmkit';

const currencySymbol = sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) || '';

type MorePromotionModalPropsType = {
  promotionsArr: Array<any>;
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
          return (<p>
            <FormattedMessage
              id='Subscription.SaveItem'
              values={{
                val1: `${item?.value + currencySymbol}`,
                val2: `${item?.name}`
              }}
            />
          </p>)
        })}

      </Modal>
    </div>
  )
}

export default MorePromotionModal;
