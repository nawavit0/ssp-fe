import moment from 'moment';
export function checkDate(from, to) {
  const dateTimeNow = moment().valueOf();
  if (from) {
    from = moment(from)
      // .add(25200000, 'ms')
      .valueOf();
    if (from > dateTimeNow) {
      return false;
    }
  }

  if (to) {
    to = moment(to)
      // .add(25200000, 'ms')
      .valueOf();
    if (to < dateTimeNow) {
      return false;
    }
  }

  return true;
}

export function transformDate(strDate, fmFrom, fmTo) {
  try {
    return strDate
      .split(fmFrom)
      .reverse()
      .join(fmTo);
  } catch (e) {
    return '';
  }
}

export function fullDate(date, lang = 'en') {
  try {
    if (date) {
      return moment(date)
        .add(lang === 'en' ? 0 : 543, 'years')
        .locale(lang)
        .format('DD MMMM YYYY');
    }
  } catch (e) {
    return '';
  }
}
