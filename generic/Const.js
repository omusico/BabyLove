import {
  StyleSheet,
  Dimensions,
} from 'react-native';

const APP_REV = '0.3';
export const DEMO = true;
export const DEBUG = false;

export const API_URL = `http://tchu.sinaapp.com/bb/${APP_REV}/act/`;
const API_KEY = '111111111111111111111111';
const PAGE_SIZE = 25;
export const PARAMS = `?apikey=${API_KEY}&page_limit=${PAGE_SIZE}`;

//const IMAGES_ROOT = './res/images/'; //cannot use template in require()?
export const IMAGES = Object.freeze({
  ic_calendar: require('./res/images/ic_calendar.png'),
  feed_pwd: require('./res/images/feed_pwd.png'),
  feed_mom: require('./res/images/feed_mom.png'),
  excreta_stl: require('./res/images/excreta_stl.png'),
  excreta_urn: require('./res/images/excreta_urn.png'),
  transparent: require('./res/images/trans.png'),
  demo: require('./res/images/demo.png'),
});

export const TEXTS = Object.freeze({
  excreta_amount: ['无', '少', '多'],
});

export const STYLES = StyleSheet.create({
  Horz: {
    flexDirection: 'row',
    /*justifyContent: 'center',*/
    alignItems: 'center',
  },
  Vert: {
    flexDirection: 'column',
    /*justifyContent: 'center',*/
    alignItems: 'center',
  },
  Gap: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  Border: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const RATIO_FOOTER = 0.129;

