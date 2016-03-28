import React, {
  Component,
  Image,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import * as Const from '../Const';
import * as Util from '../Util';
import { Theme } from '../res/styles/Theme';
import CalendarView from '../component/CalendarView';
import TimePicker from '../component/TimePicker';

export default class ActivityEdit extends Component {

  static defaultProps = {
    activity: {
      id: null,
      datetime: null, //Util.date2string(new Date()),
      feed_pwd: null,
      feed_mom: null,
      excreta_stl: null,
      excreta_urn: null,
      baby_id: null, //FIXME
    },
  };
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    openModal: React.PropTypes.func.isRequired,
    closeModal: React.PropTypes.func.isRequired,
    onActivityChange: React.PropTypes.func.isRequired,
    activity: React.PropTypes.object
    /*{
      id: 0,
      datetime: new Date(),
      feed_pwd: 0,
      feed_mom: 0,
      excreta_stl: 0,
      excreta_urn: 0,
    }*/,
  };

  constructor(props) {
    super(props);   //ES6，先有父类实例、再构建子类this
    this._excreataAmountTypes = [];
    for (let j = 0; j < Const.TEXTS.excreta_amount.length; j++) {
      this._excreataAmountTypes.push(j);
    }
    //kw: Picker will automatically select a default value on its first load and cause onValueChange().
    //    So we have to manually distinguish between 'no-value' and 'default-value'.
    this._pickerStates = {
      excreta_stl: {willLoadDefault: props.activity.excreta_stl === null, defaultValue: 0},
      excreta_urn: {willLoadDefault: props.activity.excreta_urn === null, defaultValue: 0},
    };
    this.state = {
      isEditMode: props.activity.id !== null,
      activity: props.activity,
    };
  }

  //---生命周期方法------
  /*componentDidMount() {
    Util.trace('ActivityEdit :: componentDidMount()');
  }
  componentWillReceiveProps() {
    Util.trace('ActivityEdit :: componentWillReceiveProps()');
  }
  shouldComponentUpdate() {
    Util.trace('ActivityEdit :: shouldComponentUpdate()');
    return true;
  }
  componentWillUpdate() {
    Util.trace('ActivityEdit :: componentWillUpdate()');
  }
  componentDidUpdate() {
    Util.trace('ActivityEdit :: componentDidUpdate()');
  }*/

  //---自定义方法------
  onTimeChange = (hour, minute) => {
    const prevDate = Util.string2date(this.state.activity.datetime);
    prevDate.setHours(hour, minute, prevDate.getSeconds());
    const {activity} = this.state;
    //activity.datetime = Util.date2string(prevDate);
    this.setState({activity: {...activity, datetime: Util.date2string(prevDate)}});
  };

  handleCurrentDatePress = () => {
    this.props.navigator.push({
      name: 'CalendarView',
      component: CalendarView,
      params: {
        selectedDate: Util.string2date(this.state.activity.datetime),
        onDateChange: date => {
          const prevDate = Util.string2date(this.state.activity.datetime);
          date.setHours(prevDate.getHours(), prevDate.getMinutes(), prevDate.getSeconds());
          const {activity} = this.state;
          //activity.datetime = Util.date2string(date);
          this.setState({activity: {...activity, datetime: Util.date2string(date)}});
        },
      },
    });
  };

  onFeedPwdChanged = (value) => {
    const {activity} = this.state;
    //activity.feed_pwd = value;
    this.setState({activity: {...activity, feed_pwd: value}});
  };
  onFeedMomChanged = (value) => {
    Util.trace(`ActivityEdit :: onFeedMomChanged(${value})`);
    const {activity} = this.state;
    //activity.feed_mom = value;
    this.setState({activity: {...activity, feed_mom: value}});
  };
  onExcretaStlChanged = (value) => {
    Util.trace(`ActivityEdit :: onExcretaStlChanged: this(${Object.keys(this).toString()})`);
    //kw: onChange() of Picker will be fired during first rendering
    const pickerState = this._pickerStates.excreta_stl;
    if (pickerState.willLoadDefault !== false && value === pickerState.defaultValue) {
      Util.trace('ActivityEdit :: onExcretaStlChanged: return');
      pickerState.willLoadDefault = false;
      return; //igonre this value change
    }
    const {activity} = this.state;
    //activity.excreta_stl = value;
    Util.trace(`ActivityEdit :: onExcretaStlChanged: activity(${Util.composeQueryString(activity)}),value(${value})`);
    this.setState({activity: {...activity, excreta_stl: value}});
  };
  onExcretaUrnChanged = (value) => {
    Util.trace(`ActivityEdit :: onExcretaUrnChanged: this(${Object.keys(this).toString()})`);
    //kw: onChange() of Picker will be fired during first rendering
    const pickerState = this._pickerStates.excreta_urn;
    if (pickerState.willLoadDefault !== false && value === pickerState.defaultValue) {
      Util.trace('ActivityEdit :: onExcretaStlChanged: return');
      pickerState.willLoadDefault = false;
      return; //igonre this value change
    }
    const {activity} = this.state;
    //activity.excreta_urn = value;
    Util.trace(`ActivityEdit :: onExcretaUrnChanged: activity(${Util.composeQueryString(activity)}),value(${value})`);
    this.setState({activity: {...activity, excreta_urn: value}});
  };

  handleDelete = () => {
    this.handleRequst('delete');
  };
  handleUpdate = () => {
    this.handleRequst('update');
  };
  handleInsert = () => {
    this.handleRequst('insert');
  };
  handleRequst(request: String) {
    const {activity} = this.state;
    //IMPROVE: validation of data fields
    if (request !== 'delete' && Util.isBlankActivity(activity)) {
      Util.alert('输入有误', '不可全部数据为空');
      return;
    }

    let url = '';
    let param = '';
    switch (request) {
      case 'delete':
        url = 'remove/';
        param = `id=${activity.id}`;
        break;
      case 'update':
        //IMPROVE: Validation: at least one field must be valid
        url = 'update/';
        param = Util.composeQueryString(activity);
        break;
      case 'insert':
        //IMPROVE: Validation: at least one field must be valid
        url = 'add/';
        param = Util.composeQueryString(activity);
        break;
      default:
        Util.error('Invalid request');
        return;
    }
    const REQUEST_URL = `${Const.API_URL}${url}${Const.PARAMS}&${param}`;

    this.props.openModal('请求处理中...');
    fetch(REQUEST_URL)
      .then((response) => {
        if (response.ok) {
          this.props.navigator.pop();
          this.props.closeModal();
          Util.toast('处理成功');
          this.props.onActivityChange(activity);
        } else {
          this.props.closeModal();
          response.text()
            .then((responseText) => {Util.alert('处理失败', responseText);});
        }
      })
      .catch((error) => {
        console.error(error);
        this.props.closeModal();
        Util.alert('请求处理异常', error);
      })
      .done();
  }

  //---Renderings------
  render() {
    //Util.warn(`${this.state.activity.datetime}`);
    const {activity} = this.state;
    const date = Util.string2date(activity.datetime);
    const excretaAmountTypes = this._excreataAmountTypes.map(excreataAmountType =>
      <Picker.Item key={excreataAmountType} value={excreataAmountType}
        label={Const.TEXTS.excreta_amount[excreataAmountType]} />);
    return (
      <View style={styles.container}>
        <View style={[Const.STYLES.Horz, {paddingHorizontal: 2}]}>
          <Text style={styles.labelText}>时间：</Text>
          <View style={Const.STYLES.Horz}>
          <TouchableHighlight
            style={{flex: 1}}
            onPress={this.state.isEditMode ? null : this.handleCurrentDatePress}
            underlayColor="transparent"
            activeOpacity={this.state.isEditMode ? 1 : 0.5}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={this.state.isEditMode ? styles.currentDateText$disabled : styles.currentDateText}>
                {Util.date2string(date, 'yyyy年M月d日')}
              </Text>
              {this.state.isEditMode ? null :
                <Image style={styles.calendarIcon} source={Const.IMAGES.ic_calendar} />
              }
            </View>
          </TouchableHighlight>
          <TimePicker
            style={[styles.currentTimePicker]/*must be array*/}
            selectedHour={date.getHours()}
            selectedMinute={date.getMinutes()}
            onValueChange={this.onTimeChange}
            textStyle={[styles.currentTimePicker$Text]/*must be array*/}
            minuteInterval={5}
            loop={false}
          />
          </View>
        </View>
        <View style={[Const.STYLES.Horz, {padding: 2}]}>
          <Text style={styles.labelText}>饮食：</Text>
          <View style={styles.divRound}>
            <View style={[Const.STYLES.Horz, {flex: 1, justifyContent: 'space-around'}]}>
            <Image style={styles.cellIcon} source={Const.IMAGES.feed_pwd} />
            <View style={styles.feedInput$Box}>
            <TextInput
              ref="ti_feed_pwd"
              style={styles.feedInput}
              textAlign="start"
              keyboardType="numeric"
              maxLength={3}
              onFocus={() => {this.refs.ti_feed_pwd.focus();}}
              onChangeText={this.onFeedPwdChanged}
              defaultValue={activity.feed_pwd === null ? '0' : activity.feed_pwd.toString()}
            /><Text>ml</Text>
            </View>
            </View>
            <View style={[Const.STYLES.Horz, {flex: 1, justifyContent: 'space-around'}]}>
            <Image style={styles.cellIcon} source={Const.IMAGES.feed_mom} />
            <View style={styles.feedInput$Box}>
            <TextInput
              ref="ti_feed_mom"
              style={styles.feedInput}
              textAlign="start"
              keyboardType="numeric"
              maxLength={3}
              onFocus={() => {this.refs.ti_feed_mom.focus();}}
              onChangeText={this.onFeedMomChanged}
              defaultValue={activity.feed_mom === null ? '0' : activity.feed_mom.toString()}
            /><Text>ml</Text>
            </View>
            </View>
          </View>
        </View>
        <View style={[Const.STYLES.Horz, {padding: 2}]}>
          <Text style={styles.labelText}>排泄：</Text>
          <View style={styles.divRound}>
            <View style={[Const.STYLES.Horz, {flex: 1, justifyContent: 'space-around'}]}>
            <Image style={styles.cellIcon} source={Const.IMAGES.excreta_stl} />
            <View style={styles.excretaAmountPicker$Box}>
            <Picker style={styles.excretaAmountPicker}
              selectedValue={activity.excreta_stl}
              onValueChange={this.onExcretaStlChanged}>
              {excretaAmountTypes}
            </Picker>
            </View>
            </View>
            <View style={[Const.STYLES.Horz, {flex: 1, justifyContent: 'space-around'}]}>
            <Image style={styles.cellIcon} source={Const.IMAGES.excreta_urn} />
            <View style={styles.excretaAmountPicker$Box}>
            <Picker style={styles.excretaAmountPicker}
              selectedValue={activity.excreta_urn}
              onValueChange={this.onExcretaUrnChanged}>
              {excretaAmountTypes}
            </Picker>
            </View>
            </View>
          </View>
        </View>
        {this.state.isEditMode ?
        <View style={[Const.STYLES.Horz, {paddingTop: 2}]}>
          <View style={Const.STYLES.Gap} />
          <TouchableOpacity
            style={styles.button || {flex: 3}}
            onPress={this.handleDelete}>
            <Text style={styles.buttonText}>删除</Text>
          </TouchableOpacity>
          <View style={Const.STYLES.Gap} />
          <TouchableOpacity
            style={styles.button || {flex: 3}}
            onPress={this.handleUpdate}>
            <Text style={styles.buttonText}>修改</Text>
          </TouchableOpacity>
          <View style={Const.STYLES.Gap} />
        </View> :
        <TouchableOpacity
          style={styles.button}
          onPress={this.handleInsert}>
          <Text style={styles.buttonText}>添加</Text>
        </TouchableOpacity>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 2,
    backgroundColor: Theme.mainBkgColor,
  },
  labelText: {
    fontSize: 20,
    color: Theme.labelTextColor,
  },
  currentDateText$disabled: {
    fontSize: 20,
    color: Theme.labelTextColor$disabled,
  },
  currentDateText: {
    fontSize: 20,
    color: Theme.labelTextColor,
  },
  calendarIcon: {
    width: 24,
    height: 24,
  },
  currentTimePicker: {
    marginLeft: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Theme.itemCellBkgColor,
    backgroundColor: Theme.itemCellBkgColor,
  },
  currentTimePicker$Text: {
    /*fontSize: 20,  Picker doesn't accept 'fontSize'*/
    color: Theme.contentTextColor,
  },
  divRound: {
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
  cellInnerText: {
    fontSize: 20,
  },
  feedInput$Box: {
    width: 60,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedInput: {
    flex: 1,
    fontSize: 20,
    textAlign: 'right',
    color: 'black',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: Theme.itemCellBkgColor,
  },
  excretaAmountPicker$Box: {
    width: 50,
  },
  excretaAmountPicker: {
    flex: 1,
    color: Theme.contentTextColor,
    borderWidth: 1,
    borderColor: 'black',
    /*
    width: 40,
    height: 50,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: 'blue',*/
  },
  button: {
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.buttonBkgColor,
    paddingVertical: 2,
    paddingHorizontal: 5,
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
});
