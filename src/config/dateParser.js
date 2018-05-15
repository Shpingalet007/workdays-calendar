import moment from 'moment';

function parseDate(date) {
  const mDate = moment(
    `${date} 00:00`,
    'DD.MM.YYYY HH:mm',
  ).utc(1);

  return new Date(mDate);
}

export default parseDate;
