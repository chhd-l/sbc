import { RCi18n, ShippStatus, PaymentStatus } from 'qmkit';
import type { fieldDataType, labelDataType } from './data.d';

export const orderSeachField:fieldDataType[] = [
  {
    label: [
      {
        value: 'id',
        name: RCi18n({ id: 'Order.OrderNumber' })
      },
      {
        value: 'subscribeId',
        name: RCi18n({ id: 'Order.subscriptionNumber' })
      }
    ],
    key: 'id',
  },
  {
    label: [
      {
        value: 'buyerName',
        name: RCi18n({ id: 'Order.consumerName' })
      },
      {
        value: 'buyerAccount',
        name: RCi18n({ id: 'Order.consumerAccount' })
      }
    ],
    key: 'buyerName',
  },
  {
    label: [
      {
        value: 'consigneeName',
        name: RCi18n({ id: 'Order.recipient' })
      },
      {
        value: 'consigneePhone',
        name: RCi18n({ id: 'Order.recipientPhone' })
      }
    ],
    key: 'consigneeName',
  },
  {
    label: [
      {
        value: 'orderType',
        name: RCi18n({ id: 'Order.orderType' })
      },
      {
        value: 'orderSource',
        name: RCi18n({ id: 'Order.orderSource' })
      }
    ],
    key: 'orderType',
    options: {
      orderType: [
        { value: 'SINGLE_PURCHASE', name: RCi18n({ id: 'Order.Singlepurchase' }) },
        { value: 'SUBSCRIPTION', name: RCi18n({ id: 'Order.subscription' }) },
        { value: 'MIXED_ORDER', name: RCi18n({ id: 'Order.mixedOrder' }) }
      ],
      orderSource: [
        { value: 'FGS', name: RCi18n({ id: 'Order.fgs' }) },
        { value: 'L_ATELIER_FELIN', name: RCi18n({ id: 'Order.felin' }) }
      ]
    }
  },
  {
    label: [
      {
        value: 'skuName',
        name: RCi18n({ id: 'Order.productName' })
      },
      {
        value: 'skuNo',
        name: RCi18n({ id: 'Order.skuCode' })
      }
    ],
    key: 'skuName',
  },
  {
    label: [
      {
        value: 'paymentStatus',
        name: RCi18n({ id: 'Order.paymentStatus' })
      },
      {
        value: 'shippingStatus',
        name: RCi18n({ id: 'Order.shippingStatus' })
      }
    ],
    key: 'paymentStatus',
    options: {
      paymentStatus: PaymentStatus,
      shippingStatus: ShippStatus
    }
  },
  {
    label: RCi18n({ id: 'Order.subscriptionType' }),
    key: 'subscriptionType',
    options: {
      subscriptionType: [
        { value: 'ContractProduct', name: RCi18n({ id: 'Order.contractProduct' }) },
        { value: 'Club', name: RCi18n({ id: 'Order.club' }) },
        { value: 'Autoship', name: RCi18n({ id: 'Order.autoship' }) },
        { value: 'Autoship_Club', name: RCi18n({ id: 'Order.Autoship&Club' }) }
      ]
    },
    valueLink: 'subscriptionPlanType'
  },
  {
    label: [
      { value: 'promotionCode', name: RCi18n({ id: 'Order.promotionCode' }) },
      { value: 'couponCode', name: RCi18n({ id: 'Order.couponCode' }) }
    ],
    key: 'promotionCode'
  },
  {
    label: RCi18n({ id: 'Order.subscriptionOrderTime' }),
    key: 'subscriptionRefillType',
    options: {
      subscriptionRefillType: [
        { value: 'First', name: RCi18n({ id: 'Order.first' }) },
        { value: 'Recurrent', name: RCi18n({ id: 'Order.recurrent' }) }
      ]
    }
  },
  {
    label: RCi18n({ id: 'Order.subscriptionPlanType' }),
    key: 'subscriptionPlanType',
    options: {
      subscriptionPlanType: [
        { value: 'Cat', name: RCi18n({ id: 'Order.cat' }) },
        { value: 'Dog', name: RCi18n({ id: 'Order.dog' }) },
        { value: 'Cat_Dog', name: RCi18n({ id: 'Order.Cat&Dog' }) },
        { value: 'SmartFeeder', name: RCi18n({ id: 'Order.smartFeeder' }) }
      ]
    },
    optionLink: 'subscriptionType'
  },
  {
    label: [
      { value: 'clinicsName', name: RCi18n({ id: 'Order.clinicName' }) },
      { value: 'clinicsIds', name: RCi18n({ id: 'Order.clinicID' }) }
    ],
    key: 'clinicsName'
  },
  {
    label: '',
    key: 'beginTime',
    type: 'rangePicker'
  }
];

export const subscriptionSeachField:fieldDataType[] = [
  {
    label: [
      {
        value: 'subscribeId',
        name: RCi18n({ id: 'Order.subscriptionNumber' })
      },
      {
        value: 'id',
        name: RCi18n({ id: 'Order.OrderNumber' })
      }
    ],
    key: 'subscribeId',
  },
  {
    label: [
      {
        value: 'skuName',
        name: RCi18n({ id: 'Order.productName' })
      },
      {
        value: 'skuNo',
        name: RCi18n({ id: 'Order.skuCode' })
      }
    ],
    key: 'skuName',
  },
  {
    label: [
      {
        value: 'cycleTypeId_autoship',
        name: RCi18n({ id: 'Subscription.Frequency' }) + "(" + RCi18n({ id: 'Order.autoship' }) + ")"
      },
      {
        value: 'cycleTypeId_club',
        name: RCi18n({ id: 'Subscription.Frequency' }) + "(" + RCi18n({ id: 'Order.club' }) + ")"
      }
    ],
    key: 'cycleTypeId_autoship',
    options: {
      cycleTypeId_autoship: [],
      cycleTypeId_club: []
    }
  },
  {
    label: [
      {
        value: 'buyerName',
        name: RCi18n({ id: 'Order.consumerName' })
      },
      {
        value: 'buyerAccount',
        name: RCi18n({ id: 'Order.consumerAccount' })
      }
    ],
    key: 'buyerName',
  },
  {
    label: [
      { value: 'clinicsName', name: RCi18n({ id: 'Order.clinicName' }) },
      { value: 'clinicsIds', name: RCi18n({ id: 'Order.clinicID' }) }
    ],
    key: 'clinicsName'
  },
  {
    label: RCi18n({ id: 'Order.subscriptionType' }),
    key: 'subscriptionType',
    options: {
      subscriptionType: [
        { value: 'ContractProduct', name: RCi18n({ id: 'Order.contractProduct' }) },
        { value: 'Club', name: RCi18n({ id: 'Order.club' }) },
        { value: 'Autoship', name: RCi18n({ id: 'Order.autoship' }) },
        { value: 'Autoship_Club', name: RCi18n({ id: 'Order.Autoship&Club' }) }
      ]
    },
    valueLink: 'subscriptionPlanType'
  },
  {
    label: RCi18n({ id: 'Order.subscriptionPlanType' }),
    key: 'subscriptionPlanType',
    options: {
      subscriptionPlanType: [
        { value: 'Cat', name: RCi18n({ id: 'Order.cat' }) },
        { value: 'Dog', name: RCi18n({ id: 'Order.dog' }) },
        { value: 'Cat_Dog', name: RCi18n({ id: 'Order.Cat&Dog' }) },
        { value: 'SmartFeeder', name: RCi18n({ id: 'Order.smartFeeder' }) }
      ]
    },
    optionLink: 'subscriptionType'
  }
];