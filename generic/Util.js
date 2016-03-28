import {
  Alert,
  ToastAndroid,
} from 'react-native';

const WEEKDAY = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

export function string2date(str : String) {
  return new Date(Date.parse(str.replace(/-/g, "/")));
}

export function date2string(date : Date, formator = 'yyyy-MM-dd HH:mm' : String) {
  /*
  const month = date.getMonth + 1;
  return formator.replace("YYYY", date.getFullYear())
    .replace("MM", month > 9 ? `0${month}` : month)
    .replace("DD", date.getDate())
    .replace("hh", date.getHours())
    .replace("mm", date.getMinutes())
    .replace("ss", date.getSeconds());*/
  let result = formator;
  const o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //小时
    "H+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds(), //毫秒
  };

  if (/(y+)/.test(result)) {
    result = result.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(result)) {
      result = result.replace(RegExp.$1, (RegExp.$1.length === 1) ?
          (o[k]) : (`00${o[k]}`.substr(`${o[k]}`.length)));
    }
  }
  return result;
}

export function date2weeekdayString(date : Date) {
  return WEEKDAY[date.getDay()];
}

export function composeQueryString(object: Object) {
  let result = '';
  if (object === null) {
    return result;
  }
  for (const [k, v] of Object.entries(object)) {
    if (v !== null) {
      const ve = escape(v);
      result = (result.length === 0) ? `${k}=${ve}` : `${result}&${k}=${ve}`;
    }
  }
  return result;
}

export function toast(message : String) {
  ToastAndroid.show(message, ToastAndroid.LONG);
}
export function alert(title: String, message : String) {
  Alert.alert(title, message);
}
export function error(message : String) {
  Alert.alert('ERROR', message);
}
export function warn(message : String) {
  ToastAndroid.show(message, ToastAndroid.LONG);
}
export function trace(message : String) {
  if (__DEV__) {
    //Alert.alert('TRACE', message);
    console.log(message);
  }
}

//domain specific --> Model Layer?
export function isBlankActivity(activity) {
  return (activity.feed_pwd === 0 || activity.feed_pwd === null)
    && (activity.feed_mom === 0 || activity.feed_mom === null)
    && (activity.excreta_stl === 0 || activity.excreta_stl === null)
    && (activity.excreta_urn === 0 || activity.excreta_urn === null);
}


