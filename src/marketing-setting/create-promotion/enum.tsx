import { FormattedMessage } from 'react-intl';
import React from 'react';

export const enumConst = {
  stepEnum:{
    1:'BasicSetting',
    2:'PromotionType',
    3:'Conditions',
    4:'Advantage',
  },
  typeOfPromotion:{
    0: <FormattedMessage id="Order.PromotionCode" />,
    1: <FormattedMessage id="Order.PromotionCode" />
  },
  promotionType:{
    0: <FormattedMessage id="Order.All" />,
    1: <FormattedMessage id="Order.Autoship" />,
    2: <FormattedMessage id="Order.Club" />,
    3: <FormattedMessage id="Order.Singlepurchase" />
  },
  joinLevel:{
    '-1': <FormattedMessage id="Order.all" />,
    '-2': <FormattedMessage id="Order.Group" />,
    '-3': <FormattedMessage id="Order.Byemail" />,
  },
  scopeType:{
    0: <FormattedMessage id="Order.all" />,
    1: <FormattedMessage id="Order.Category" />,
    2: <FormattedMessage id="Order.Custom" />,
    3: <FormattedMessage id="Order.Attribute" />
  },
  CartLimit:{
    0: <FormattedMessage id="Order.none" />,
    1: <FormattedMessage id="Order.Amount" />,
    2: <FormattedMessage id="Order.Quantity" />,
  },
}