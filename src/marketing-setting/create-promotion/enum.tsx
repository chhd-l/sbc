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
    1: <FormattedMessage id="Order.CouponCode" />
  },
  promotionType:{
    0: <FormattedMessage id="Marketing.All" />,
    1: <FormattedMessage id="Marketing.Autoship" />,
    2: <FormattedMessage id="Marketing.Club" />,
    3: <FormattedMessage id="Marketing.Singlepurchase" />
  },
  joinLevel:{
    '-1': <FormattedMessage id="Marketing.all" />,
    '-2': <FormattedMessage id="Marketing.Group" />,
    '-3': <FormattedMessage id="Marketing.Byemail" />,
  },
  scopeType:{
    0: <FormattedMessage id="Marketing.all" />,
    1: <FormattedMessage id="Marketing.Category" />,
    2: <FormattedMessage id="Marketing.Custom" />,
    3: <FormattedMessage id="Marketing.Attribute" />
  },
  CartLimit:{
    0: <FormattedMessage id="Order.none" />,
    1: <FormattedMessage id="Order.Amount" />,
    2: <FormattedMessage id="Order.Quantity" />,
  },
}