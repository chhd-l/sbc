
export const OrderStatus = [
    { name: 'Created', value: 'INIT', listShow: true  },
    { name: 'Pending review', value: 'PENDING_REVIEW', listShow: true },
    { name: 'To be delivered', value: 'TO_BE_DELIVERED', listShow: true },
    { name: 'Partially Shipped', value: 'PARTIALLY_SHIPPED' },
    { name: 'Shipped', value: 'SHIPPED', listShow: true },
    { name: 'Partially Delivered', value: 'PARTIALLY_DELIVERED' },
    { name: 'Delivered', value: 'DELIVERED', listShow: true },
    { name: 'Completed', value: 'COMPLETED', listShow: true },
    { name: 'Cancelled', value: 'VOID', listShow: true },
    { name: 'Rejected', value: 'REJECTED', listShow: true }
  ];
  
  export const ShippStatus = [
    { name: 'Not Shipped', value: 'NOT_YET_SHIPPED' },
    { name: 'Partially Shipped', value: 'PART_SHIPPED' },
    { name: 'Shipped', value: 'SHIPPED' },
    { name: 'Partially Delivered', value: 'PARTIALLY_DELIVERED' },
    { name: 'Delivered', value: 'DELIVERED' },
    { name: 'Rejected', value: 'REJECTED' }
  ];
  
  export const PaymentStatus = [
    { name: 'Not Paid', value: 'NOT_PAID' },
    { name: 'Authorized', value: 'AUTHORIZED' },
    { name: 'Paid', value: 'PAID' },
    { name: 'Refund', value: 'REFUND' },
    { name: 'Paying', value: 'PAYING' }
  ];
  
  export function getOrderStatusValue(statusName, value) {
    switch (statusName) {
      case 'OrderStatus':
        let orderStatus = OrderStatus.find((x) => x.value === value);
        return orderStatus ? orderStatus.name : '';
      case 'ShippStatus':
        let shippStatus = ShippStatus.find((x) => x.value === value);
        return shippStatus ? shippStatus.name : '';
      case 'PaymentStatus':
        let paymentStatus = PaymentStatus.find((x) => x.value === value);
        return paymentStatus ? paymentStatus.name : '';
      default:
        return "unknown";;
    }
  }
  