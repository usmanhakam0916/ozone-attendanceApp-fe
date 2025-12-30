import { message } from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import { parse } from 'querystring';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

moment.locale('en-US');
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export function fileCheck(file) {
  const fileExtension = file.type;
  if (
    fileExtension === 'image/jpeg' ||
    fileExtension === 'image/png' ||
    fileExtension === 'image/jpg'
  ) {
    return true;
  }
  return false;
}

export function videoFileCheck(file) {
  const fileExtension = file.type;
  // eslint-disable-next-line no-constant-condition
  if (
    fileExtension === 'video/mp4' ||
    fileExtension === 'video/MOV' ||
    fileExtension === 'video/WMV' ||
    fileExtension === 'video/FLV'
  ) {
    message.success('Uploading file');
    return true;
  }
  message.error('Please select video file');
  return false;
}

export const formatCurrencyInDollar = (value) => `$ ${numeral(value).format('0,0')}`;

export const formatCurrencyInPKR = (value) => `Rs. ${numeral(value).format('0,0')}`;
export const formatDate = (value) => {
  moment.locale('en-US');
  return moment(value).format('ddd, MM Do YY, hh:mm a');
};

export const formatDatePlusDays = (value, day) => {
  moment.locale('en-US');
  return moment(value).add('days', day).format('ddd, MM Do YY, hh:mm a');
};
export const formatResponseTime = (value) =>
  `${numeral(value).format('0,0')} - ${numeral(value).format('0,0')}`;

export const formatCurrency = (value) => numeral(value).format('0,0');

export const isValidId = (id) => id !== 'create' && Number.isInteger(parseInt(id, 10));

export const openInNewWindow = (url) => {
  const win = window.open(url, '_blank');
  win.focus();
};

export const singleFileFormItemGetValueEvent = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export const getFormFileChecker = (form) => (field) =>
  form.getFieldValue(field) && form.getFieldValue(field)[0];

export const getFormFile = (file) => ({
  uid: file.id,
  name: file.name,
  url: file.url,
  status: 'done',
  response: file,
});

// todo : make utility function for three condition
export const getFilteredDates = (filteredData, filters, type) => {
  if (filters.dateType === type && filters.date[0] && filters.date[1]) {
    const startDateFilter = moment(filters.date[0]);
    const endDateFilter = moment(filters.date[1]);

    // eslint-disable-next-line no-param-reassign
    filteredData = filteredData.filter((item) => {
      const type2 = moment(item[`${type}`]);
      return type2 >= startDateFilter && type2 <= endDateFilter;
    });
  } else {
    return filteredData;
  }
  return filteredData;
};

export function compareCheckInTimes(s1CheckInTime, s2CheckInTime) {
  return (
    moment(s1CheckInTime).isAfter(moment(s2CheckInTime)) ||
    moment(s1CheckInTime).isSame(moment(s2CheckInTime))
  );
}

export function compareCheckOutTimes(checkInTime, checkOutTime) {
  return moment(checkInTime).isAfter(moment(checkOutTime));
}

export const getDateWiseObjects = (object) => {
  let s1 = null;
  let s2 = null;

  if (object.length === 1) {
    s1 = object[0];
  } else {
    s1 = object[object.length - 1];
    s2 = object[0];
  }

  return [s1, s2];
};
