/* eslint-disable no-underscore-dangle */
import moment from 'moment';

const ZERO_DATE = '0001-01-01T09:00:00.000Z';

export const getStringSorter = (property) => (a, b) => {
  let first = a[property] || '';
  let second = b[property] || '';
  first = first.toString();
  second = second.toString();
  return first.toLowerCase() < second.toLowerCase() ? -1 : 1;
};

export const getStringSorterWithoutKey = (a, b) => {
  let first = a || '';
  let second = b || '';
  first = first.toString();
  second = second.toString();
  return first.toLowerCase() < second.toLowerCase() ? -1 : 1;
};
export const getNumberSorter = (property) => (a, b) => {
  const first = a[property] || -Number.MAX_VALUE;
  const second = b[property] || -Number.MAX_VALUE;
  return parseInt(first, 10) - parseInt(second, 10);
};
export const getNumberSorterWithoutKey =  (a, b) => {
  const first = a || -Number.MAX_VALUE;
  const second = b || -Number.MAX_VALUE;
  return parseInt(first, 10) - parseInt(second, 10);
};

export const getDateFormatterWithoutKey = (a) => {
  if (moment(a).isBefore(moment(a))) {
    return -1;
  }
  return 1;
};
export const getFloatSorter = (property) => (a, b) => {
  const first = a[property] || -Number.MAX_VALUE;
  const second = b[property] || -Number.MAX_VALUE;
  return parseFloat(first) - parseFloat(second);
};

export const getDateSorter = (property) => (a, b) => {
  const first = a[property] || ZERO_DATE;
  const second = b[property] || ZERO_DATE;
  return moment.utc(first).diff(moment.utc(second));
};

export const getBoolSorter = (property) => (a, b) => {
  const first = a[property] || false;
  const second = b[property] || false;
  return first - second;
};
