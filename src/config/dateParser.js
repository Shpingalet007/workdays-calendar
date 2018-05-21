import moment from 'moment';

function parseDate(date) {
  let mDate;

  if (!date) mDate = moment().format('DD.MM.YYYY');
  else {
    mDate = moment(
      `${date} 00:00`,
      'DD.MM.YYYY HH:mm',
    ).utc(1);
  }

  return new Date(mDate);
}

export default parseDate;
