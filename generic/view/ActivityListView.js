import React, {
  Component,
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Const from '../Const';
import * as Util from '../Util';
import { Theme } from '../res/styles/Theme';
import CalendarView from '../component/CalendarView';
import ActivityEdit from './ActivityEdit';
import Test from '../test/Test';


const BLANK_ACTIVITY = {
  id: null,
  datetime: null, //Util.date2string(new Date())
  feed_pwd: null,
  feed_mom: null,
  excreta_stl: null,
  excreta_urn: null,
  baby_id: null, //Const.DEMO ? DEMO_BABY_ID : null,
};

class DivFeed extends Component {
  static defaultProps = {
    feed_pwd: 0,
    feed_mom: 0,
  };
  static propTypes = {
    feed_pwd: React.PropTypes.number,
    feed_mom: React.PropTypes.number,
    style: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
  };
  render() {
    return this.props.feed_pwd === null && this.props.feed_mom === null ?
      <View style={this.props.style} /> :
      <View style={[styles.divFeed, this.props.style]}>
        {this.props.feed_pwd === null ? <View /> :
        <Image style={styles.cellIcon} source={Const.IMAGES.feed_pwd} />
        }
        {this.props.feed_pwd === null || this.props.feed_mom === null ? <View /> :
        <Text style={styles.cellInnerText}>+</Text>
        }
        {this.props.feed_mom === null ? <View /> :
        <Image style={styles.cellIcon} source={Const.IMAGES.feed_mom} />
        }
        <Text style={styles.cellInnerText}>
          {`${Number(this.props.feed_pwd) + Number(this.props.feed_mom)}ml`}
        </Text>
      </View>;
  }
}
class DivExcreta extends Component {
  static defaultProps = {
    excreta_stl: 0,
    excreta_urn: 0,
  };
  static propTypes = {
    excreta_stl: React.PropTypes.number,
    excreta_urn: React.PropTypes.number,
    style: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
  };
  shouldComponentUpdate(nextProps /*, nextState*/) {
    //IMPROVE: is this necessary for performance?
    return (nextProps.excreta_stl !== this.props.excreta_stl)
        || (nextProps.excreta_urn !== this.props.excreta_urn);
  }
  render() {
    return this.props.excreta_stl === null && this.props.excreta_urn === null ?
      <View style={this.props.style} /> :
      <View style={[styles.divExcreta, this.props.style]}>
        {
        //NOTE: using [] will result in warning 'Each child in an array or iterator
        //      should have a unique "key" prop.'
        this.props.excreta_stl === null ? <View /> :
        <View style={Const.STYLES.Horz}>
          <Image style={styles.cellIcon} source={Const.IMAGES.excreta_stl} />
          <Text style={styles.cellInnerText}>{Const.TEXTS.excreta_amount[this.props.excreta_stl]}</Text>
        </View>
        }
        {this.props.excreta_urn === null ? <View /> :
        <View style={Const.STYLES.Horz}>
          <Image style={styles.cellIcon} source={Const.IMAGES.excreta_urn} />
          <Text style={styles.cellInnerText}>{Const.TEXTS.excreta_amount[this.props.excreta_urn]}</Text>
        </View>
        }
      </View>;
  }
}

export default class ActivityListView extends Component {

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    openModal: React.PropTypes.func.isRequired,
    closeModal: React.PropTypes.func.isRequired,
    date: React.PropTypes.instanceOf(Date).isRequired,
    baby_id: React.PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);   //ES6，先有父类实例、再构建子类this
    this.state = {
      isLoading: false,
      date: props.date,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  }

  //---生命周期方法------
  componentDidMount() {
    this.fetchData();
  }
  componentWillUnmount() {
    //IMPROVE: [性能]本地cache缓存，可参考ZhiHuDaily
    //repository.saveStories(dataCache.dataForTheme, dataCache.topDataForTheme);
  }

  //---自定义方法------
  //IMPROVE: [性能]ListView延迟加载，可参考ZhiHuDaily
  onListViewEndReached = () => {
    /*
    console.log('onListViewEndReached() ' + this.state.isLoadingTail);
    if (this.state.isLoadingTail) {
      return;
    }
    this.fetchStories(this.props.theme, false);
    */
  };

  fetchData() {
    const REQUEST_URL = `${Const.API_URL}${Const.PARAMS}
            &date=${Util.date2string(this.state.date, 'yyyy-MM-dd')}`;
    this.setState({
      isLoading: true,
      dataSource: this.state.dataSource,
    });
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          isLoading: false,
          dataSource: this.state.dataSource.cloneWithRows(responseData),
        });
      })
      /*
      .then((response) => {
        const responseDate = JSON.parse(response.text(), (key, value) =>
                            /^date/.test(key) ? Util.string2date(value) : value);
        this.setState({
          isLoading: false,
          dataSource: this.state.dataSource.cloneWithRows(responseDate),
        });
      })*/
      .catch((error) => {
        console.error(error);
        this.setState({
          isLoading: false,
          dataSource: this.state.dataSource.cloneWithRows([]),
        });
        Util.alert('网络错误', error);
      })
      .done();
  }

  handlePrevDate = () => {
    this.setState({date: new Date(this.state.date.getTime() - 86400000)});
    this.fetchData();
  };
  handleNextDate = () => {
    this.setState({date: new Date(this.state.date.getTime() + 86400000)});
    this.fetchData();
  };
  handleCurrentDatePress = () => {
    this.props.navigator.push({
      name: 'CalendarView',
      component: CalendarView,
      params: {
        selectedDate: this.state.date,
        onDateChange: date => {
          //Util.trace(`selected:${date}`);
          this.setState({date});
          this.fetchData();
        },
      },
    });
  };

  handleActivityPress = (activity: Object) => {
    const defaultActivity = BLANK_ACTIVITY;
    if (activity === BLANK_ACTIVITY) {
      const currentDate = new Date();
      this.state.date.setHours(currentDate.getHours());
      this.state.date.setMinutes(currentDate.getMinutes());
      defaultActivity.datetime = Util.date2string(this.state.date);
      defaultActivity.baby_id = this.props.baby_id;
    }
    this.props.navigator.push({
      name: 'ActivityEdit',
      component: ActivityEdit,
      params: {
        activity: activity === undefined ? defaultActivity : activity,
        onActivityChange: newActivity => {
          this.setState({date: Util.string2date(newActivity.datetime)});
          this.fetchData();
        },
      },
    });
  };

  handleTest = () => {
    this.props.openModal('AAAAAAA');
    /*this.props.navigator.push({
      name: 'Test',
      component: Test,
      params: {
        testdata: {
          text: 'From Parent: ActivityListView',
        },
      },
    });*/
  };

  //---Renderings------
  renderRow = (activity: Object/*, sectionID: number, rowID: number*/) =>
      (activity === null ? <View /> :
      <TouchableHighlight
        onPress={() => this.handleActivityPress(activity)}
        underlayColor="transparent"
        activeOpacity={0.5}>
        <View style={styles.cell}>
          <Text style={styles.cellTimeText}>
            {Util.date2string(Util.string2date(activity.datetime), 'HH:mm')}
          </Text>
          <View style={styles.cellInner}>
            <DivFeed style={[{flex: 1}]}
              feed_pwd={activity.feed_pwd} feed_mom={activity.feed_mom} />
            <DivExcreta style={[{flex: 1}]}
              excreta_stl={activity.excreta_stl} excreta_urn={activity.excreta_urn} />
          </View>
        </View>
      </TouchableHighlight>);

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.currentDate}>
          <TouchableHighlight
            style={styles.currentDate$nav}
            onPress={this.handlePrevDate}
            underlayColor="transparent"
            activeOpacity={0.5}>
            <Text style={styles.buttonText}>{'《'}</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.currentDate$picker}
            onPress={this.handleCurrentDatePress}
            underlayColor="transparent"
            activeOpacity={0.5}>
            <View style={styles.currentDate$picker$horz}>
              <Text style={styles.currentYearText}>
                {Util.date2string(this.state.date, 'yyyy年')}
              </Text>
              <Image style={styles.currentDateText$wrapper}
                resizeMode={Image.resizeMode.cover}
                source={Const.DEMO ? Const.IMAGES.demo : Const.IMAGES.transparent}>
                <Text style={styles.currentDateText}>
                  {Util.date2string(this.state.date, 'M月d日')}
                </Text>
                <Image style={styles.calendarIcon} source={Const.IMAGES.ic_calendar} />
              </Image>
              <Text style={styles.currentWeekdayText}>
                {Util.date2weeekdayString(this.state.date)}
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.currentDate$nav}
            onPress={this.handleNextDate}
            underlayColor="transparent"
            activeOpacity={0.5}>
            <Text style={styles.buttonText}>{'》'}</Text>
          </TouchableHighlight>
        </View>
        {
        this.state.isLoading ?
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>正在加载...</Text>
        </View> :
        this.state.dataSource.getRowCount() === 0 ?
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>当天尚无记录</Text>
        </View> :
        <ListView
          ref="listview"
          style={styles.listview}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          /*onEndReached={this.onListViewEndReached}*/
          /*renderSectionHeader={this.renderSectionHeader}*/
          /*renderHeader={this._renderHeader}*/
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps
          showsVerticalScrollIndicator={false}
        />
        }
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.handleActivityPress(BLANK_ACTIVITY)}>
          <Image style={styles.addIcon} source={Theme.IMAGES.ic_add} />
          <Text style={styles.buttonText}>添加日常记录</Text>
        </TouchableOpacity>
        {Const.DEBUG ?
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleTest}>
            <Text style={styles.buttonText}>测试</Text>
          </TouchableOpacity> : null
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Theme.mainBkgColor,
  },
  currentDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentDate$nav: {
    flex: 1,
  },
  currentDate$picker: {
    flex: 6,
  },
  currentDate$picker$horz: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentYearText: {
    flex: 1,
    fontSize: 18,
    color: Theme.labelTextColor,
    textAlign: 'center',
  },
  currentDateText$wrapper: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  currentDateText: {
    fontSize: 24,
    color: Theme.labelTextColor,
    textAlign: 'center',
  },
  calendarIcon: {
    width: 24,
    height: 24,
  },
  currentWeekdayText: {
    flex: 1,
    fontSize: 18,
    color: Theme.labelTextColor,
    textAlign: 'center',
  },
  emptyView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.mainBkgColor,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 20,
    color: Theme.labelTextColor,
  },
  gapVert: {
    height: 50,
  },
  listview: {
    paddingBottom: 10,
    backgroundColor: Theme.mainBkgColor,
  },
  separator: {
    height: 1,
  },
  cell: {
    flexDirection: 'column',
    padding: 2,
    marginHorizontal: 8,
    marginVertical: 0.5,
    backgroundColor: Theme.itemBkgColor,
  },
  cellTimeText: {
    fontSize: 12,
    textAlign: 'center',
  },
  cellInner: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  cellInnerText: {
    fontSize: 20,
  },
  divFeed: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Theme.itemCellBkgColor,
    backgroundColor: Theme.itemCellBkgColor,
  },
  divExcreta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Theme.itemCellBkgColor,
    backgroundColor: Theme.itemCellBkgColor,
  },
  cellIcon: {
    width: 40,
    height: 50,
  },
  addIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  button: {
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.buttonBkgColor,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderColor: Theme.buttonBkgColor,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: Theme.buttonTextColor,
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    height: Const.SCREEN_WIDTH * Const.RATIO_FOOTER,
    backgroundColor: Theme.itemBkgColor,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'column',
  },
  footerButtonImage: {
    flex: 2,
  },
  footerButtonText: {
    flex: 1,
  },
});
