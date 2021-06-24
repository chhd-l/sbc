// 星期
//(window as any).RCi18n({ id: 'Public.Passwordcannotbeempty' })
function getWeekDay(day) {
  let weekArr = [
    (window as any).RCi18n({ id: 'Order.Sunday' }),
    (window as any).RCi18n({ id: 'Order.Monday' }),
    (window as any).RCi18n({ id: 'Order.Tuesday' }),
    (window as any).RCi18n({ id: 'Order.Wednesday' }),
    (window as any).RCi18n({ id: 'Order.Thursday' }),
    (window as any).RCi18n({ id: 'Order.Friday' }),
    (window as any).RCi18n({ id: 'Order.Saturday' })
  ];
  return weekArr[day];
}
// 月份
function getMonth(num) {
  num = Number(num);
  let monthArr = [
    '0',
    (window as any).RCi18n({ id: 'Order.January' }),
    (window as any).RCi18n({ id: 'Order.February' }),
    (window as any).RCi18n({ id: 'Order.March' }),
    (window as any).RCi18n({ id: 'Order.April' }),
    (window as any).RCi18n({ id: 'Order.May' }),
    (window as any).RCi18n({ id: 'Order.June' }),
    (window as any).RCi18n({ id: 'Order.July' }),
    (window as any).RCi18n({ id: 'Order.August' }),
    (window as any).RCi18n({ id: 'Order.September' }),
    (window as any).RCi18n({ id: 'Order.October' }),
    (window as any).RCi18n({ id: 'Order.November' }),
    (window as any).RCi18n({ id: 'Order.December' })
  ];
  return monthArr[num];
}
// delivery date 格式转换: 星期, 15 月份
export function getFormatDeliveryDateStr(date) {
  if (!date) {
    return '';
  }
  // 获取明天几号
  let mdate = new Date();
  let tomorrow = mdate.getDate() + 1;
  // 获取星期
  var week = new Date(date).getDay();
  let weekday = getWeekDay(week);
  // 获取月份
  let ymd = date.split('-');
  let month = getMonth(ymd[1]);

  // 判断是否有 ‘明天’ 的日期
  let thisday = Number(ymd[2]);
  let daystr = '';
  if (tomorrow == thisday) {
    daystr = (window as any).RCi18n({ id: 'Order.tomorrow' });
  } else {
    daystr = weekday;
  }
  return daystr + ', ' + ymd[2] + ' ' + month;
}
