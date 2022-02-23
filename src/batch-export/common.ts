import { RCi18n, ShippStatus, PaymentStatus } from 'qmkit';
import type { fieldDataType, labelDataType } from './data.d';

export const orderSeachField: fieldDataType[] = [
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
    key: 'id'
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
    key: 'buyerName'
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
    key: 'consigneeName'
  },
  {
    label: RCi18n({ id: 'Order.orderTag' }),
    key: 'goodWillFlag',
    options: {
      goodWillFlag: [
        { value: '0', name: RCi18n({ id: 'order.regularOrder' }) },
        { value: '1', name: RCi18n({ id: 'Order.goodWillOrder' }) }
      ]
    }
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
    key: 'skuName'
  },
  {
    label: [
      {
        value: 'payState',
        name: RCi18n({ id: 'Order.paymentStatus' })
      },
      {
        value: 'deliverStatus',
        name: RCi18n({ id: 'Order.shippingStatus' })
      }
    ],
    key: 'payState',
    options: {
      payState: PaymentStatus,
      deliverStatus: ShippStatus
    }
  },
  {
    label: RCi18n({ id: 'Order.subscriptionType' }),
    key: 'subscriptionTypeQuery',
    options: {
      subscriptionTypeQuery: [
        { value: 'ContractProduct', name: RCi18n({ id: 'Order.contractProduct' }) },
        { value: 'Club', name: RCi18n({ id: 'Order.club' }) },
        { value: 'Autoship', name: RCi18n({ id: 'Order.autoship' }) },
        { value: 'Autoship_Club', name: RCi18n({ id: 'Order.Autoship&Club' }) },
        { value: 'Individualization', name: RCi18n({ id: 'Order.Individualization' }) }
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
  },
  {
    label: RCi18n({ id: 'Order.createdBy' }),
    key: 'orderCreateByType',
    options: {
      orderCreateByType: [
        { value: 'CC', name: RCi18n({ id: 'Order.customerCare' }) },
        { value: 'PO', name: RCi18n({ id: 'Order.petOwner' }) }
      ]
    }
  }
];

export const subscriptionSeachField: fieldDataType[] = [
  {
    label: [
      {
        value: 'subscribeId',
        name: RCi18n({ id: 'Order.subscriptionNumber' })
      },
      {
        value: 'orderCode',
        name: RCi18n({ id: 'Order.OrderNumber' })
      }
    ],
    key: 'subscribeId'
  },
  {
    label: [
      {
        value: 'goodsName',
        name: RCi18n({ id: 'Order.productName' })
      },
      {
        value: 'skuNo',
        name: RCi18n({ id: 'Order.skuCode' })
      }
    ],
    key: 'goodsName'
  },
  {
    label: [
      {
        value: 'cycleTypeId_autoship',
        name:
          RCi18n({ id: 'Subscription.Frequency' }) + '(' + RCi18n({ id: 'Order.autoship' }) + ')'
      },
      {
        value: 'cycleTypeId_club',
        name: RCi18n({ id: 'Subscription.Frequency' }) + '(' + RCi18n({ id: 'Order.club' }) + ')'
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
        value: 'customerName',
        name: RCi18n({ id: 'Order.consumerName' })
      },
      {
        value: 'customerAccount',
        name: RCi18n({ id: 'Order.consumerAccount' })
      }
    ],
    key: 'customerName'
  },
  {
    label: [
      { value: 'prescriberName', name: RCi18n({ id: 'Order.clinicName' }) },
      { value: 'prescriberId', name: RCi18n({ id: 'Order.clinicID' }) }
    ],
    key: 'prescriberName'
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
  },
  {
    label: '',
    key: 'beginTime',
    type: 'rangePicker'
  },
  {
    label: RCi18n({ id: 'Subscription.SubscriptionStatus' }),
    key: 'subscriptionStatus',
    options: {
      subscriptionStatus: [
        { value: '0', name: RCi18n({ id: 'Subscription.Active' }) },
        { value: '2', name: RCi18n({ id: 'Subscription.Inactive' }) },
        { value: '1', name: RCi18n({ id: 'Subscription.Paused' }) },
        { value: '', name: RCi18n({ id: 'Subscription.all' }) },
      ]
    },
    valueLink: 'subscriptionStatus'
  },
  {
    label: '',
    key: 'nextRefillDate',
    type: 'rangePicker'
  }
];
