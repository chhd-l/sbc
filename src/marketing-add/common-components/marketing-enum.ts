export enum MARKETING_TYPE {
  //满减
  FULL_REDUCTION,
  //满折
  FULL_DISCOUNT,
  //满赠
  FULL_GIFT,
  //首次折扣
  FIRST_DISCOUNT,
  //免运费
  FREE_SHIPPING = 4,
  //一口价
  FIXED_PRICE = 5
}

export enum SUB_TYPE {
  // 满金额减
  REDUCTION_FULL_AMOUNT,

  // 满数量减
  REDUCTION_FULL_COUNT,

  // 满金额折
  DISCOUNT_FULL_AMOUNT,

  // 满数量折
  DISCOUNT_FULL_COUNT,

  // 满金额赠
  GIFT_FULL_AMOUNT,

  // 满数量赠
  GIFT_FULL_COUNT
}

export const TYPE_STRING = {
  [MARKETING_TYPE.FULL_DISCOUNT]: 'discount',
  [MARKETING_TYPE.FULL_GIFT]: 'gift',
  [MARKETING_TYPE.FULL_REDUCTION]: 'reduction'
};

export function GET_MARKETING_STRING(type) {
  return TYPE_STRING[type];
}
