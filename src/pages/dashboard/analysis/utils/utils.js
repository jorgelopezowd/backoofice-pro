import moment from 'moment';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}
export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;
    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  const year = now.getFullYear();

  if (type === 'month') {
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();
    console.log('nextdate',moment().endOf('month').format('YYYY-MM-DD hh:mm'),nextDate)
    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(now).format('YYYY-MM-DD hh:mm')),
    ];
  }

  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

var getDates = function (startDate, endDate, groupBy = 'day') {

  if (groupBy === 'day') {
      var dates = [],
          currentDate = startDate,
          addDays = function (days) {
              var date = new Date(this.valueOf());
              date.setDate(date.getDate() + days);
              return date;
          };
      while (currentDate <= endDate) {
          dates.push(currentDate.toISOString().split('T')[0]);
          currentDate = addDays.call(currentDate, 1);
      }

  } else {
      var dateStart = moment(startDate);
      var dateEnd = moment(endDate);
      var dates = [];

      while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
          dates.push(dateStart.format('YYYY-MM'));
          dateStart.add(1, 'month');
      }
  }
  return dates;
};
